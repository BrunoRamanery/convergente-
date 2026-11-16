const fs=require('fs');const s=fs.readFileSync(process.argv[2],'utf8');
const a=s.indexOf('// ===================== DADOS'),b=s.indexOf('// ===================== INTERFACE');
eval(s.slice(a,b).replace(/const /g,'var '));
const bugs={};const bug=(k,ex)=>{bugs[k]=bugs[k]||{n:0,ex};bugs[k].n++;};
// 1) habilidades definidas
CARDS.forEach(c=>c.ab.forEach(id=>{if(!AB[id])bug('habilidade inexistente '+id,c.n)}));
// 2) lutas com verificação de cada quadro
let maxR=0,pts=0,N=0,dur=[];
for(let i=0;i<40;i++)for(let j=0;j<40;j++){if(i===j)continue;for(let n=0;n<6;n++){
  let r;try{r=fight(CARDS[i],CARDS[j]);}catch(e){bug('exceção: '+e.message,CARDS[i].n+' x '+CARDS[j].n);continue;}
  N++;maxR=Math.max(maxR,r.round);dur.push(r.round);if(r.frames[r.frames.length-1].t.includes('por pontos'))pts++;
  if(r.w.i===r.l.i)bug('vencedor = perdedor',CARDS[i].n);
  if(![i,j].includes(r.w.i))bug('vencedor de fora da luta',CARDS[i].n);
  for(const f of r.frames){
    if(/undefined|NaN|null/.test(f.t))bug('texto quebrado: '+f.t.replace(/[0-9]+/g,'#'),CARDS[i].n+' x '+CARDS[j].n);
    for(const sn of f.s){if(!isFinite(sn.hp)||!isFinite(sn.en))bug('número inválido',f.t);
      if(sn.en<0)bug('energia negativa',CARDS[i].n+' x '+CARDS[j].n+': '+f.t);
      if(sn.en>sn.maxen)bug('energia acima do máximo',f.t);
      if(sn.hp>sn.maxhp)bug('vida acima do máximo',f.t);}
  }
  const last=r.frames[r.frames.length-1].s;const wS=r.w.i===i?last[0]:last[1],lS=r.w.i===i?last[1]:last[0];
  if(!/pontos|duplo/.test(r.frames[r.frames.length-1].t)&&lS.hp>0)bug('perdedor vivo sem ser por pontos',CARDS[i].n+' x '+CARDS[j].n);
  if(wS.hp<=0)bug('vencedor com vida zero',CARDS[i].n+' x '+CARDS[j].n);
}}
dur.sort((x,y)=>x-y);
console.log('lutas',N,'| rodadas média',(dur.reduce((x,y)=>x+y,0)/N).toFixed(1),'| mediana',dur[N>>1],'| máx',maxR,'| decididas por pontos',pts);
console.log('BUGS:',Object.keys(bugs).length?'':'nenhum');for(const k in bugs)console.log(' -',k,'×',bugs[k].n,'| ex:',bugs[k].ex);

