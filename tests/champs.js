const fs=require('fs');const s=fs.readFileSync(process.argv[2]||'app/index.html','utf8');
const a=s.indexOf('// ===================== DADOS'),b=s.indexOf('// ===================== INTERFACE');
eval(s.slice(a,b).replace(/const /g,'var '));
const kr=process.argv[3]==='k';const part={},ch={};
for(let t=0;t<3000;t++){const fmt=['copa','mata','rei'][t%3];const n=fmt==='rei'?[8,12,16][t%3]:[8,16,20,32][t%4];
  const T=newTourState(Math.random,fmt,drawIds(n,Math.random),{krampus:kr});
  for(const i of T.ids){const nm=CARDS[i].n;part[nm]=(part[nm]||0)+1;}
  let g=0;while(!T.done&&g++<3000){const bt=curBout(T);const r=fight(bt.A,bt.B,{ta:bt.ta,tb:bt.tb,quiet:true});const pd=applyResult(T,r);for(const x of pd)choosePending(T,x,x.opts[0]);}
  if(T.champ!=null){const nm=CARDS[T.champ].n;ch[nm]=(ch[nm]||0)+1;}}
const r=Object.keys(part).map(n=>[n,(ch[n]||0)/part[n]]).sort((x,y)=>y[1]-x[1]);
console.log(r.slice(0,14).map(x=>x[0]+' '+(x[1]*100).toFixed(1)+'%').join(' | '));
