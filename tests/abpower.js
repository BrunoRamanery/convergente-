const fs=require('fs');const s=fs.readFileSync('app/index.html','utf8');
const a=s.indexOf('// ===================== DADOS'),b=s.indexOf('// ===================== INTERFACE');
eval(s.slice(a,b).replace(/const /g,'var '));
const base={...KRAMPUS,ab:[]};const N=+process.argv[2]||12;
function wr(ab){const c={...base,ab};let w=0,n=0;for(let o=0;o<NB;o++)for(let k=0;k<N;k++){const r=fight(c,CARDS[o],{quiet:true,tb:{karma:0},ta:{karma:0}});n++;if(r.w.n===c.n)w++;}return w/n;}
const b0=wr([]);const out={};
const ids=new Set();CARDS.slice(0,NB).forEach(c=>c.ab.forEach(id=>ids.add(id)));
for(const id of ids){if(!AB[id]||NO_ROUBO.includes(id))continue;out[id]=Math.round((wr([id])-b0)*1000)/10;}
console.log('base',Math.round(b0*100));console.log(JSON.stringify(Object.fromEntries(Object.entries(out).sort((x,y)=>y[1]-x[1]))));
