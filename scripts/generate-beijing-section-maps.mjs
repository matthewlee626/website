import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve('next/package.json'))('sharp');
const root = path.resolve(import.meta.dirname, '..');
const places = JSON.parse(await readFile(path.join(root, 'app/blogs/beijing/field-notes.json')));
const output = path.join(root, 'public/beijing/sections');
const cache = path.join(root, '.next/beijing-osm-tile-cache');
await mkdir(output, { recursive: true });
await mkdir(cache, { recursive: true });
const width = 1100, height = 660, padding = 75;
const sections = {
  geography: places.filter(p => p.area !== 'Beyond the city'),
  center: places.filter(p => ['Center','South','East','North','West'].includes(p.area)),
  'center-center': places.filter(p => p.area === 'Center'),
  south: places.filter(p => p.area === 'South'),
  east: places.filter(p => p.area === 'East'),
  north: places.filter(p => p.area === 'North'),
  west: places.filter(p => p.area === 'West'),
  chaoyang: places.filter(p => p.area === 'Chaoyang'),
  wangjing: places.filter(p => p.area === 'Wangjing'),
  haidian: places.filter(p => p.area === 'Haidian'),
  misc: places.filter(p => p.area === 'Beyond the city'),
};
function project([lon,lat],z) { const s=256*2**z; return [(lon+180)/360*s,(1-Math.asinh(Math.tan(lat*Math.PI/180))/Math.PI)/2*s]; }
async function tile(z,x,y) {
  const file=path.join(cache,`${z}-${x}-${y}.png`);
  try { return await readFile(file); } catch {}
  const url=`https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
  const response=await fetch(url,{signal:AbortSignal.timeout(20000),headers:{"User-Agent":"BeijingFieldNotesMapGenerator/1.0 (personal blog static maps)"}});
  if(!response.ok) throw new Error(`${response.status}: ${url}`);
  const data=Buffer.from(await response.arrayBuffer()); await writeFile(file,data); return data;
}
const manifest={};
for(const [section,items] of Object.entries(sections)) {
  let zoom=15, points;
  while(true) {
    points=items.map(p=>project(p.coordinates,zoom));
    if(zoom<=7 || (Math.max(...points.map(p=>p[0]))-Math.min(...points.map(p=>p[0]))<width-padding*2 && Math.max(...points.map(p=>p[1]))-Math.min(...points.map(p=>p[1]))<height-padding*2)) break;
    zoom--;
  }
  const left=Math.round((Math.min(...points.map(p=>p[0]))+Math.max(...points.map(p=>p[0]))-width)/2);
  const top=Math.round((Math.min(...points.map(p=>p[1]))+Math.max(...points.map(p=>p[1]))-height)/2);
  const minX=Math.floor(left/256),minY=Math.floor(top/256), maxX=Math.floor((left+width)/256),maxY=Math.floor((top+height)/256);
  const layers=[];
  for(let y=minY;y<=maxY;y++) {
    const row=await Promise.all(Array.from({length:maxX-minX+1},async(_,i)=>({input:await tile(zoom,minX+i,y),left:i*256,top:(y-minY)*256})));
    layers.push(...row);
  }
  const base=await sharp({create:{width:(maxX-minX+1)*256,height:(maxY-minY+1)*256,channels:4,background:'#f5f5f0'}}).composite(layers).png().toBuffer();
  const markers=points.map(([x,y],i)=>`<g transform="translate(${x-left},${y-top})"><circle r="17" fill="#33507b" stroke="white" stroke-width="3"/><text text-anchor="middle" y="5" font-family="Arial,sans-serif" font-size="14" font-weight="bold" fill="white">${i+1}</text></g>`).join('');
  const overlay=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${section==='geography'?'':markers}<rect x="${width-295}" y="${height-28}" width="295" height="28" fill="white" fill-opacity=".95"/><text x="${width-12}" y="${height-10}" text-anchor="end" font-family="Arial,sans-serif" font-size="12" fill="#333">© OpenStreetMap contributors</text></svg>`);
  await sharp(base).extract({left:left-minX*256,top:top-minY*256,width,height}).composite([{input:overlay}]).webp({quality:88}).toFile(path.join(output,`${section}.webp`));
  manifest[section]={image:`/beijing/sections/${section}.webp`,width,height,places:section==='geography'?[]:items.map((p,i)=>({number:i+1,name:p.name}))};
  console.log(`Generated ${section}: ${items.length} locations, zoom ${zoom}`);
}
await writeFile(path.join(root,'app/blogs/beijing/section-maps.json'),JSON.stringify(manifest,null,2)+'\n');
