const fs=require('fs');const s=fs.readFileSync(process.argv[2]||'app/index.html','utf8');
const a=s.indexOf('// ===================== DADOS'),b=s.indexOf('// ===================== INTERFACE');
eval(s.slice(a,b).replace(/const /g,'var '));
const scale=+process.argv[3]||1;
for(const k in DIV_PCT)DIV_PCT[k]*=scale;
const T={player:null,diff:'divina'};const res={};
for(let p=0;p<NB;p++){let w=0,n=0;const tier=CARDS[p].tit||'Comum';
  for(let o=0;o<NB;o++){if(o===p)continue;for(let k=0;k<30;k++){T.player=p;const tb=divBuff(T,{},CARDS[o]);const r=fight(CARDS[p],CARDS[o],{quiet:true,tb});n++;if(r.w.i===p)w++;}}
  (res[tier]=res[tier]||[]).push([CARDS[p].n,Math.round(w/n*100)]);}
for(const t in res){const v=res[t];console.log(t,'média',Math.round(v.reduce((s,x)=>s+x[1],0)/v.length),v.map(x=>x[0]+' '+x[1]).join(', '));}
