import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
http.createServer(async (req,res)=>{
  const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let file = path.resolve(root, '.' + (pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  try{if((await stat(file)).isDirectory()) file=path.join(file,'index.html'); const content=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(content);}
  catch{
    if(pathname==='/404.html'){res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}).end('Not found');return;}
    try{const content=await readFile(path.join(root,'404.html'));res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(content);}
    catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}).end('Not found');}
  }
}).listen(5173,'0.0.0.0',()=>console.log('Local: http://localhost:5173'));
