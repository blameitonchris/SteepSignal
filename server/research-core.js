import { randomUUID } from 'node:crypto';
export const candidates = [
 ['Matcha',['matcha tea']],['Hojicha',['hojicha tea']],['Fruit iced tea',['fruit iced tea']],['Sparkling tea',['sparkling tea']],['Lower-sugar tea drinks',['low sugar tea drinks']]
].map(([name,phrases])=>({id:randomUUID(),name,phrases}));
export function csvRows(text){
 if(typeof text!=='string'||Buffer.byteLength(text)>512000)throw Error('Paste a CSV smaller than 500 KB.');
 text=text.replace(/^\uFEFF/,'');let out=[],row=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++){let c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else if(!quoted&&cell!=='')throw Error('A CSV quote is misplaced. Please use an original Trends export.');else quoted=!quoted;}
 else if(c===','&&!quoted){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(s=>s.trim()))out.push(row);row=[];cell='';}else cell+=c;}
 if(quoted)throw Error('A CSV quotation is unfinished. Please export the file again.');row.push(cell);if(row.some(s=>s.trim()))out.push(row);return out;
}
export function validDate(s){return typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;}
function seriesDate(s){if(/^\d{4}-\d{2}$/.test(s))s+='-01';return validDate(s)?s:null;}
export function parseTrends(text){
 const rows=csvRows(text);const h=rows.findIndex(row=>/^(day|week|month|date)$/i.test(row[0].trim())&&row.length>1);
 if(h<0)throw Error('We could not find an interest-over-time table. Export the chart with Day, Week, or Month in its first column; related-query and regional exports use a different format.');
 const headers=rows[h].slice(1).map(s=>s.trim());if(headers.length>10||headers.some(s=>!s))throw Error('Use one to ten named search terms.');
 const metadata=rows.slice(0,h).map(row=>row.join(',')).filter(Boolean);
 let geography=null,termLabels=[];
 for(const header of headers){const match=header.match(/^(.*?)\s*:\s*\(([^)]+)\)\s*$/);termLabels.push(match?match[1].trim():header);if(match){if(geography&&geography!==match[2])throw Error('Search terms in this file have different geographic labels. Export a single comparison chart.');geography=match[2];}}
 if(new Set(termLabels).size!==termLabels.length)throw Error('Search-term columns must have distinct names.');
 const records=[],seen=new Set();
 for(let i=h+1;i<rows.length;i++){
  const row=rows[i];const date=seriesDate(row[0].trim());if(!date)throw Error(`Row ${i+1}: use a valid date in an interest-over-time export.`);
  if(row.length!==headers.length+1)throw Error(`Row ${i+1}: the number of columns does not match the search terms.`);
  if(seen.has(date))throw Error(`Row ${i+1}: this date appears twice.`);seen.add(date);
  const values=row.slice(1).map((v,j)=>{v=v.trim();if(v===''||/^(n\/a|na|null|—|-)$/.test(v.toLowerCase()))return {kind:'missing',value:null};if(v==='<1'||v==='< 1')return {kind:'lessThanOne',value:null};if(!/^\d+(\.\d+)?$/.test(v)||+v>100)throw Error(`Row ${i+1}, ${termLabels[j]}: expected 0–100, <1, or a missing value.`);return {kind:'number',value:+v};});
  records.push({date,values});
 }
 if(!records.length||records.length>5000)throw Error('Use a chart with 1–5,000 time periods.');
 records.sort((a,b)=>a.date.localeCompare(b.date));
 // A downloaded CSV normally has no reliable export timestamp or complete settings.
 return {id:randomUUID(),label:'Imported real data — Google Trends',terms:termLabels,headers,records,geography,interval:rows[h][0].trim(),metadata,range:{start:records[0].date,end:records.at(-1).date},importedAt:new Date().toISOString(),source:'https://trends.google.com/trends/',settings:{category:null,searchType:null,exportedAt:null},normalization:'This export is its own 0–100 scale. Compare terms within this file only.'};
}
export function confirmTrends(parsed,settings){
 if(!settings||typeof settings.geography!=='string'||!settings.geography.trim()||typeof settings.category!=='string'||!settings.category.trim()||typeof settings.searchType!=='string'||!settings.searchType.trim())throw Error('Confirm geography, category, and search type before saving. Enter Unknown if a setting cannot be verified.');
 if(settings.exportedAt&&!validDate(settings.exportedAt))throw Error('Use YYYY-MM-DD for the export date, or leave it blank if unknown.');
 const geography=settings.geography.trim();if(parsed.geography&&geography!==parsed.geography)throw Error('The confirmed geography must match the CSV geographic label.');
 return {...parsed,geography,settings:{category:settings.category.trim().slice(0,200),searchType:settings.searchType.trim().slice(0,200),exportedAt:settings.exportedAt||null,confirmedAt:new Date().toISOString()},settingsConfirmed:true};
}
export function normalizeVideos(body,context){
 const records=[],seen=new Set();for(const item of body.items||[]){const id=item.id?.videoId,s=item.snippet;if(!id||!s||!/^[a-zA-Z0-9_-]{11}$/.test(id)||seen.has(id))continue;seen.add(id);
  records.push({id,title:String(s.title||'Untitled video').slice(0,500),channel:String(s.channelTitle||'').slice(0,300),published:String(s.publishedAt||''),description:String(s.description||'').slice(0,6000),url:'https://www.youtube.com/watch?v='+id,thumbnail:s.thumbnails?.default?.url?.match(/^https:\/\/i\.ytimg\.com\//)?s.thumbnails.default.url:null,source:'YouTube',label:'Live YouTube discovery',geo:'unknown',geoBasis:'Available in the US; creator origin and audience location are unknown.',collectedAt:context.collectedAt,query:context.query});
 }return records;
}
export class ProviderError extends Error{constructor(code,message,status=502){super(message);this.code=code;this.status=status;}}
export async function discover({query,start,end,topicId}, {key,fetcher=fetch,now=()=>new Date()}={}){
 if(!key)throw new ProviderError('missing_key','YouTube is not connected yet. The owner needs to configure the server API key.',503);
 if(typeof query!=='string'||!query.trim()||query.length>120||!validDate(start)||!validDate(end)||start>end||Date.parse(end)-Date.parse(start)>366*86400000)throw new ProviderError('invalid_search','Enter a search phrase and a valid date range of up to 366 days.',400);
 const until=new Date(end+'T00:00:00Z');until.setUTCDate(until.getUTCDate()+1);
 const url=new URL('https://www.googleapis.com/youtube/v3/search');for(const [k,v] of Object.entries({part:'snippet',type:'video',q:query.trim(),publishedAfter:start+'T00:00:00Z',publishedBefore:until.toISOString(),regionCode:'US',order:'date',maxResults:'25',key}))url.searchParams.set(k,v);
 let response,body;try{response=await fetcher(url,{signal:AbortSignal.timeout(12000)});body=await response.json();}catch{throw new ProviderError('timeout','YouTube did not respond in time. Please try again later.');}
 if(!response.ok){const reasons=(body?.error?.errors||[]).map(e=>e.reason);if(reasons.some(r=>/quota|dailyLimit/i.test(r)))throw new ProviderError('quota','The YouTube allowance has been reached. Try again after the daily quota resets.',429);
 if(reasons.some(r=>/accessNotConfigured|serviceDisabled/i.test(r)))throw new ProviderError('disabled_api','The owner needs to enable YouTube Data API v3 in the Google project.',503);
 if(response.status===400||response.status===401||response.status===403)throw new ProviderError('provider_access','YouTube refused this connection. The owner should check the server key and API restrictions.',503);
 throw new ProviderError('provider_error','YouTube could not complete this search. Please try again later.');}
 const collectedAt=now().toISOString();const records=normalizeVideos(body,{collectedAt,query:query.trim()});return {topicId:typeof topicId==='string'?topicId.slice(0,150):null,label:'Live YouTube discovery',records,collectedAt,range:{start,end},query:query.trim(),limited:true,limit:25,geography:'US availability only — origin and audience unknown',coverage:'Up to 25 matching videos from one search, not a complete count of tea conversations. No transcripts, sentiment, views, sales, or purchase intent were retrieved.',momentum:'There is insufficient evidence to measure momentum: no comparable historical collection is available.'};
}
export function buildBrief({topic,range,videos,trends,observations,hypothesis,test,measure}){
 if(!topic?.name||!validDate(range?.start)||!validDate(range?.end)||range.start>range.end)throw Error('Choose a research topic and valid dates for your roundup.');
 const phrases=[topic.name,...(topic.phrases||[])].map(s=>s.toLowerCase());const relevant=s=>phrases.some(p=>s.toLowerCase().includes(p));
 const expiry=Date.now()-24*3600000;const discovery=videos&&Date.parse(videos.collectedAt)>expiry&&videos.range?.start===range.start&&videos.range?.end===range.end&&(videos.topicId===topic.id||(topic.phrases||[topic.name]).some(s=>s.toLowerCase()===videos.query?.toLowerCase()))?videos:null;
 const videoRows=discovery?(discovery.records||[]).filter(v=>Date.parse(v.collectedAt)>expiry&&v.label==='Live YouTube discovery'&&v.url==='https://www.youtube.com/watch?v='+v.id):[];
 const trendsRows=(trends||[]).filter(t=>t.settingsConfirmed&&/^united states$|^US$/i.test(t.geography||'')).map(t=>{
  const indexes=t.terms.map((term,i)=>relevant(term)?i:-1).filter(i=>i>=0);return {...t,selectedTerms:indexes.map(i=>t.terms[i]),selectedRecords:t.records.filter(r=>r.date>=range.start&&r.date<=range.end).map(r=>({date:r.date,values:indexes.map(i=>r.values[i])}))};
 }).filter(t=>t.selectedTerms.length&&t.selectedRecords.length);
 for(const t of trendsRows)t.patterns=t.selectedTerms.map((term,i)=>{const rows=t.selectedRecords,numeric=rows.filter(r=>r.values[i].kind==='number'),latest=rows.at(-1),last=latest.values[i];let text=`${term}: ${rows.length} imported period(s) in this selection.`;if(numeric.length){const peak=numeric.reduce((a,b)=>a.values[i].value>=b.values[i].value?a:b);text+=` Highest numeric relative-interest value: ${peak.values[i].value} at period starting ${peak.date}, on this file’s own scale.`;}text+=` Most recent period starts ${latest.date}: ${last.kind==='missing'?'missing':last.kind==='lessThanOne'?'less than 1':last.value}. No sales or absolute search counts are inferred.`;return text;});
 const obs=(observations||[]).filter(o=>o.label==='Authorized manual observation'&&o.authorized===true&&['quotation','interpretation'].includes(o.textKind)&&/^https?:\/\//.test(o.url||'')&&['confirmed_us','inferred_us','unknown'].includes(o.geo)&&o.geoBasis&&o.topicId===topic.id&&o.published>=range.start&&o.published<=range.end);
 return {id:randomUUID(),topic:{id:topic.id,name:topic.name,phrases:topic.phrases},range,createdAt:new Date().toISOString(),label:'Real research — limited evidence',videos:videoRows,discovery:discovery?{query:discovery.query,collectedAt:discovery.collectedAt,range:discovery.range,limit:25}:null,trends:trendsRows,observations:obs,summary:{youtube:discovery?`${videoRows.length} matching videos retrieved (maximum 25). US availability does not identify US creators or viewers.`:'No current YouTube discovery for this topic and exact date range. Run a search; expired results are not evidence.',trends:trendsRows.length?`${trendsRows.length} confirmed-US export(s) include matching terms. Each export has an independent relative scale; no cross-export score is calculated.`:'No confirmed-US interest-over-time export for these dates and terms.',feedback:obs.length?`${obs.length} authorized manual observations. Read their quotation or interpretation labels and geographic relevance before drawing conclusions.`:'No authorized customer-feedback evidence for this topic and dates.',momentum:'There is insufficient evidence to measure momentum from a single discovery. Search interest is relative, not sales or absolute search counts.'},hypothesis:typeof hypothesis==='string'?hypothesis.slice(0,5000):'A small tea offering related to this topic may be worth testing; customer preference and purchase intent are unproven.',test:typeof test==='string'?test.slice(0,5000):'Offer a small, clearly priced trial and invite voluntary feedback.',measure:typeof measure==='string'?measure.slice(0,5000):'Record actual feedback, trial costs, and units sold, if any. Do not generate sales results.',limitations:['Research candidates are not verified current trends.','YouTube metadata describes videos; it does not establish taste preferences, sentiment, or demand.','Manual observation authorization and geographic labels are researcher-supplied, not independently verified. Confirmed-US observations remain separate from unknown-origin videos.','Google Trends imports are user-provided exports with unverified provenance and researcher-confirmed settings. Each file has its own normalized scale; missing and <1 values are retained.','Coverage is limited, sampling is not representative, and no market forecast is provided.']};
}
