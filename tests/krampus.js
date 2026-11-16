const fs=require('fs');const s=fs.readFileSync(process.argv[2]||'app/index.html','utf8');
const a=s.indexOf('// ===================== DADOS'),b=s.indexOf('// ===================== INTERFACE');
eval(s.slice(a,b).replace(/const /g,'var '));
const TOURS=+process.argv[3]||1200;const only=process.argv[4];
const COMUNS=[...Array(NB).keys()].filter(i=>!CARDS[i].tit&&!GOD_PAT.includes(CARDS[i].pat));
const pct=(x,n)=>n?Math.round(x/n*1000)/10+'%':'-';
function run(T,st,bug){let g=0;const seenMatches=new Set();
  while(!T.done){const bt=curBout(T);if(!bt){bug('sem luta');break;}
    for(const c of [bt.A,bt.B])if(typeof c.i==='number'&&T.sacked.has(c.i))bug('ensacado lutando: '+c.n);
    const kA=isKramp(bt.A),kB=isKramp(bt.B);
    const r=fight(bt.A,bt.B,{ta:bt.ta,tb:bt.tb,quiet:false});
    for(const f of r.frames)if(/undefined|NaN/.test(f.t))bug('texto quebrado: '+f.t);
    const d0=T.dead.size,lI=r.l.i,wI=r.w.i,saco0=T.saco.length;const inheritor=(kA||kB)&&!isKramp(r.w);
    const wBon0=(T.bonus[wI]||[]).length;
    const pend=applyResult(T,r);for(const p of pend)choosePending(T,p,p.opts[Math.floor(Math.random()*p.opts.length)]);
    if(kA||kB){const kWon=isKramp(r.w);const tita=(kA?bt.A:bt.B).tita;const key=tita?'boss':'k';
      st[key+'F']=(st[key+'F']||0)+1;if(kWon){st[key+'W']=(st[key+'W']||0)+1;if(T.dead.has(lI))bug('Krampus matou '+r.l.n);if(typeof lI==='number'&&!T.sacked.has(lI)&&!(T.alienMode&&r.l.alien))bug('perdedor não ensacado: '+r.l.n+' i='+lI);}
      else{if(!T.dead.has(lI))bug('Krampus sobreviveu à derrota para '+r.w.n);
        if(!tita){st.kKilledBy=st.kKilledBy||{};st.kKilledBy[r.w.n]=(st.kKilledBy[r.w.n]||0)+1;st.sacoAtMorte=(st.sacoAtMorte||0)+saco0;st.mortes=(st.mortes||0)+1;
          if(saco0){T._inh=T._inh||new Set();T._inh.add(wI);st.herdou=(st.herdou||0)+1;st.herdouN=(st.herdouN||0)+((T.bonus[wI]||[]).length-wBon0);}
          if(r.w.n==='Rugal Bernstein')st.rugalK=(st.rugalK||0)+1;}}}
    else if(T._inh){for(const i of [bt.A.i,bt.B.i])if(T._inh.has(i)){st.inhF=(st.inhF||0)+1;if(r.w.i===i)st.inhW=(st.inhW||0)+1;}}
    if(++g>3000){bug('loop');break;}}
  getPodium(T);evalConquests(T);}
function scenario(name,mk){const st={tours:0},bugs={};const bug=(k)=>{bugs[k]=(bugs[k]||0)+1;};
  for(let t=0;t<TOURS;t++){const T=mk(t);if(!T)continue;st.tours++;run(T,st,bug);
    if(T.natal){if(T.champ!=null&&isKramp(CARDS[T.champ]))st.krampusChamp=(st.krampusChamp||0)+1;}
    else{if(T.champ===T.kr)st.krampusChamp=(st.krampusChamp||0)+1;if(T._inh&&T._inh.has(T.champ))st.inhChamp=(st.inhChamp||0)+1;st.sacoFim=(st.sacoFim||0)+T.saco.length;
      if(T.conquest)st['conq_'+T.conquest]=(st['conq_'+T.conquest]||0)+1;}}
  const o={tours:st.tours};
  if(st.bossF)o['campeão vence o Krampus titã']=pct(st.bossF-(st.bossW||0),st.bossF);
  if(st.kF){o['Krampus: vitórias por luta']=pct(st.kW||0,st.kF);o['Krampus campeão']=pct(st.krampusChamp||0,st.tours);o['lutas do Krampus por torneio']=(st.kF/st.tours).toFixed(2);
    o['Krampus morto no torneio']=pct(st.mortes||0,st.tours);o['saco médio quando morre']=st.mortes?(st.sacoAtMorte/st.mortes).toFixed(2):'-';
    o['quem herda: vitórias por luta depois']=pct(st.inhW||0,st.inhF||0);o['quem herda vira campeão']=pct(st.inhChamp||0,st.herdou||0);o['habilidades herdadas (média)']=st.herdou?(st.herdouN/st.herdou).toFixed(2):'-';
    o['Rugal mata o Krampus']=st.rugalK||0;o['mais mataram o Krampus']=Object.entries(st.kKilledBy||{}).sort((a,b)=>b[1]-a[1]).slice(0,5).map(x=>x[0]+' '+x[1]).join(', ');
    for(const k in st)if(k.startsWith('conq_'))o[k]=pct(st[k],st.tours);}
  console.log('\n== '+name);console.log(o);console.log('BUGS:',Object.keys(bugs).length?bugs:'nenhum');}
const fmts=['copa','mata','rei'],sizes=[8,16,20,32,41];
const cfg=t=>{const fmt=fmts[t%3];let n=sizes[Math.floor(t/3)%5];if(fmt==='rei')n=[8,12,16][t%3];return {fmt,n};};
const S={
 natal:()=>scenario('NATAL SOMBRIO (só comuns, final contra o Krampus titã)',t=>{const {fmt}=cfg(t);const n=Math.min([8,16,20,32][t%4],COMUNS.length);const ids=shuffle(COMUNS,Math.random).slice(0,n);return newTourState(Math.random,fmt,ids,{natal:true});}),
 sem:()=>scenario('KRAMPUS SEM MODOS',t=>{const {fmt,n}=cfg(t);return newTourState(Math.random,fmt,drawIds(n,Math.random),{krampus:true});}),
 alien:()=>scenario('KRAMPUS + MODO ALIEN',t=>{const fmt=['copa','mata'][t%2],n=[16,20,32,41][t%4];return newTourState(Math.random,fmt,drawIds(n,Math.random),{krampus:true,alien:true});}),
 amuleto:()=>scenario('KRAMPUS + AMULETO DE SHINNOK',t=>{const {fmt,n}=cfg(t);return newTourState(Math.random,fmt,drawIds(n,Math.random),{krampus:true,amuleto:true});}),
 ambos:()=>scenario('KRAMPUS + ALIEN + AMULETO',t=>{const fmt=['copa','mata'][t%2],n=[16,20,32,41][t%4];return newTourState(Math.random,fmt,drawIds(n,Math.random),{krampus:true,alien:true,amuleto:true});}),
};
for(const k in S)if(!only||only===k)S[k]();
