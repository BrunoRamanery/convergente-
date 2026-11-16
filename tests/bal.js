const fs=require('fs');const s=fs.readFileSync(process.argv[2]||'app/index.html','utf8');
const a=s.indexOf('// ===================== DADOS'),b=s.indexOf('// ===================== INTERFACE');
eval(s.slice(a,b).replace(/const /g,'var '));
const OV=JSON.parse(process.argv[3]||'{}');const N=+process.argv[4]||25;
for(const n in OV){const c=CARDS.find(x=>x.n===n);const o=OV[n];if(o.hp)c.hp=o.hp;if(o.en)c.en=o.en;Object.assign(c.st,o.st||{});c.forca=Object.values(c.st).reduce((x,y)=>x+y,0);}
const T=['Orochi','Shao Kahn','I-No','Sagat','Gargos','Omni-Man','Kratos','Homelander','Sonya Blade','M. Bison','Jin Kazama','Rugal Bernstein'];
const wr=i=>{let w=0,n=0;for(let o=0;o<NB;o++){if(o===i)continue;for(let k=0;k<N;k++){const f=fight(CARDS[i],CARDS[o],{quiet:true});n++;if(f.w.i===i)w++;}}return Math.round(w/n*100);};
if(process.argv[5]==='all'){const r=[];for(let i=0;i<NB;i++)r.push([CARDS[i].n,CARDS[i].tit||'comum',wr(i)]);r.sort((x,y)=>y[2]-x[2]);console.log(r.map(x=>x.join(' ')).join(' | '));}
else console.log(T.map(n=>{const c=CARDS.find(x=>x.n===n);return `${n} ${wr(c.i)}% [${c.hp} ${Object.values(c.st).join('/')}]`;}).join('\n'));
