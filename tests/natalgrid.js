const fs=require('fs');const s=fs.readFileSync('app/index.html','utf8');
const a=s.indexOf('// ===================== DADOS'),b=s.indexOf('// ===================== INTERFACE');
eval(s.slice(a,b).replace(/const /g,'var '));
const idx=n=>CARDS.findIndex(c=>c.n===n);const FIELD=NATAL_FIELD.map(idx);const N=+process.argv[3]||1500;
function rate(name,pc){if(pc!=='keep')NATAL_BLESS[name]=pc;const p=idx(name);let w=0;
  for(let t=0;t<N;t++){const ids=[p,...shuffle(FIELD.filter(i=>i!==p),Math.random).slice(0,7)];const T=newTourState(Math.random,'mata',ids,{natal:true,player:p});
    let g=0;while(!T.done&&g++<200){const bt=curBout(T);const r=fight(bt.A,bt.B,{ta:bt.ta,tb:bt.tb,quiet:true});T.playerChoice=Math.random()<.5?'kill':'spare';const pd=applyResult(T,r);T.playerChoice=null;for(const x of pd)choosePending(T,x,x.opts[0]);if(T.dead.has(p)||T.sacked.has(p))break;}
    if(T.done&&T.champ===p)w++;}
  return Math.round(w/N*100);}
const n=process.argv[2];console.log(n,JSON.parse(process.argv[4]).map(pc=>pc+':'+rate(n,pc)+'%').join('  '));
