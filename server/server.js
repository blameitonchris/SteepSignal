import http from 'node:http';
import { timingSafeEqual } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname } from 'node:path';
import { discover, parseTrends, confirmTrends, buildBrief, candidates } from './research-core.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2'};
const STATIC=new Set(['index.html','style.css','app.js','data.js','ui.js','mark.svg','research.js','research.css','compatibility/index.html','compatibility/style.css','compatibility/app.js','compatibility/core.js','compatibility/data.js','fonts/theme.css']);
// A fixed allowlist prevents serving .env, source backups, or server code.
export function createServer({key=process.env.YOUTUBE_API_KEY,accessCode=process.env.RESEARCH_ACCESS_CODE,fetcher=fetch,allowOrigins=(process.env.ALLOWED_ORIGINS||'').split(',').filter(Boolean),dailyLimit=Number(process.env.YOUTUBE_DAILY_SEARCH_LIMIT)||10}={}){
 const rates=new Map();let calls=0,day=new Date().toISOString().slice(0,10),active=0;
 function authenticated(req){const value=req.headers['x-research-access'];if(!accessCode||accessCode.length<16||typeof value!=='string')return false;const a=Buffer.from(value),b=Buffer.from(accessCode);return a.length===b.length&&timingSafeEqual(a,b);}
 function rate(req){const now=Date.now(),ip=req.socket.remoteAddress||'unknown';// Do not trust spoofable forwarded IPs.
  for(const [k,v] of rates)if(now-v.start>60000)rates.delete(k);
  if(!rates.has(ip)&&rates.size>=5000)return false;const value=rates.get(ip)||{start:now,n:0};value.n++;rates.set(ip,value);if(rates.size>5000||value.n>30)return false;return true;}
 return http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Cache-Control','no-store');
  const path=new URL(req.url,'http://server.invalid').pathname;
  if(path.startsWith('/api/')){
   res.setHeader('Content-Type','application/json; charset=utf-8');
   const reply=(status,data)=>{res.writeHead(status);res.end(JSON.stringify(data));};
   const origin=req.headers.origin;
   const own=origin&&origin===((req.socket.encrypted?'https':'http')+'://'+req.headers.host);
   // Proxied hosting passes X-Forwarded-Proto only for origin comparison, never rate identity.
   const proxiedOwn=origin&&origin==='https://'+req.headers.host;
   if(origin&&!own&&!proxiedOwn&&!allowOrigins.includes(origin))return reply(403,{error:'This website is not allowed to use the research server.',code:'origin'});
   if(origin){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');}
   if(req.method==='OPTIONS'){res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type, X-Research-Access');res.writeHead(204);return res.end();}
   if(!rate(req))return reply(429,{error:'Please pause for a minute before trying again.',code:'rate_limit'});
   if(!authenticated(req))return reply(401,{error:accessCode&&accessCode.length>=16?'Enter the owner’s research access code.':'The owner needs to configure a server research access code (at least 16 characters).',code:'access_required'});
   if(path==='/api/status'&&req.method==='GET')return reply(200,{connected:!!key,label:key?'Key configured — run a search to verify access':'YouTube not connected — server key missing',checkedAt:new Date().toISOString(),candidates});
   if(req.method!=='POST')return reply(405,{error:'Use a supported research action.',code:'method'});
   let bytes=0,chunks=[];try{
    for await(const chunk of req){bytes+=chunk.length;if(bytes>768000){reply(413,{error:'This request is too large. Use a smaller CSV or backup.',code:'too_large'});req.resume();return;}chunks.push(chunk);}
    const data=JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if(path==='/api/discover'){
     if(data.policyVersion!=='2026-10-13')return reply(403,{error:'Read and accept the current research terms and privacy notice before using YouTube discovery.',code:'consent_required'});
     if(!key)return reply(503,{error:'YouTube is not connected yet. The owner needs to configure the server API key.',code:'missing_key'});
     const today=new Date().toISOString().slice(0,10);if(day!==today){day=today;calls=0;}
     if(calls>=Math.min(50,Math.max(1,dailyLimit))||active>=2)return reply(429,{error:'The server’s discovery allowance is reached or another search is running. Please try later.',code:'budget'});
     calls++;active++;try{return reply(200,await discover(data,{key,fetcher}));}finally{active--;}
    }
    if(path==='/api/trends/preview')return reply(200,parseTrends(data.csv));
    if(path==='/api/trends/confirm')return reply(200,confirmTrends(parseTrends(data.csv),data.settings));
    if(path==='/api/brief'&&data.videos?.records?.length&&data.policyVersion!=='2026-10-13')return reply(403,{error:'Accept the current research terms and privacy notice before processing YouTube evidence.',code:'consent_required'});
    if(path==='/api/brief')return reply(200,buildBrief(data));
    return reply(404,{error:'That research action is unavailable.',code:'not_found'});
   }catch(err){return reply(err.status||400,{error:err.status?err.message:err instanceof SyntaxError?'The request could not be read. Please try again.':String(err.message).slice(0,500),code:err.code||'invalid_request'});}
  }
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end();}
  let name=path.slice(1);if(!name)name='index.html';if(name==='compatibility/'||name==='compatibility')name='compatibility/index.html';
  if(!STATIC.has(name)){res.writeHead(404);return res.end('Page not found');}
  try{const contents=await readFile(resolve(root,name));res.setHeader('Content-Type',MIME[extname(name)]||'application/octet-stream');res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https://i.ytimg.com; connect-src 'self' https:; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'");res.writeHead(200);res.end(req.method==='HEAD'?undefined:contents);}catch{res.writeHead(404);res.end('Page not found');}
 });
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 if(!process.env.RESEARCH_ACCESS_CODE||process.env.RESEARCH_ACCESS_CODE.length<16){console.error('Set RESEARCH_ACCESS_CODE to a random secret of at least 16 characters. No server started.');process.exit(1);}
 const port=Number(process.env.PORT)||3000;createServer().listen(port,'0.0.0.0',()=>console.log('SteepSignal research server listening on port '+port+'. No credentials are logged.'));
}
