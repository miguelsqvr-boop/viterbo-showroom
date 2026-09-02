import sharp from 'sharp';
import { readdirSync } from 'fs';
const pattern = process.argv[2], outName = process.argv[3], cols = 5, T = 300;
const files = readdirSync('/tmp/drive').filter(f=>f.includes(pattern) && /\.(jpe?g|png)$/i.test(f)).sort();
const tiles = [];
for (const f of files) tiles.push(await sharp('/tmp/drive/'+f).resize({width:T,height:T,fit:'contain',background:'#e8e8e8'}).toBuffer());
const rows = Math.ceil(tiles.length/cols);
await sharp({create:{width:T*cols,height:T*rows,channels:3,background:'#e8e8e8'}})
  .composite(tiles.map((input,i)=>({input,left:(i%cols)*T,top:Math.floor(i/cols)*T})))
  .toFile(`/tmp/${outName}.png`);
files.forEach((f,i)=>console.log(String(i+1).padStart(2), f));
