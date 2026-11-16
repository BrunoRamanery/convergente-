const fs=require('fs');const s=fs.readFileSync(process.argv[2]||'app/index.html','utf8');
const a=s.indexOf('// ===================== DADOS'),b=s.indexOf('// ===================== INTERFACE');
eval(s.slice(a,b).replace(/const /g,'var '));
const bugs={};const bug=(k,ex)=>{bugs[k]=bugs[k]||{n:0,ex};bugs[k].n++;};
const ev={kills:0,kos:0,captive:0,vkenWin:0,vkenLose:0,omega:0,evil:0,rewards:{},rugal:0,devilJin:0,devilKaz:0,evilRyu:0,fights:0};
const champs={};
for(const fmt of ['mata','copa','rei'])for(const n of [...SIZES[fmt],LIMIT[fmt][0],LIMIT[fmt][1],5,7,13].filter(x=>x>=LIMIT[fmt][0]&&x<=LIMIT[fmt][1])){
  const key=fmt+n;champs[key]=champs[key]||{};
  for(let t=0;t<(n>=20?200:400);t++){
    let ids=drawIds(n,Math.random);if(t%3===0&&n>=8){const must=[KEN.i,BISON.i,CAMMY.i,RYU.i,RUGAL.i,OROCHI.i,ALIEN.i,PRED.i,KAZ.i,JIN.i,KRATOS.i,QUAN.i];ids=[...new Set([...must,...ids])].slice(0,n);}
    const mode=t%2===1;const amu=t%3!==0;const T=newTourState(Math.random,fmt,ids,{alien:mode,amuleto:amu});if(T.amuletoMode&&T.amulet==null)bug('amuleto sem dono',key);let guard=0;
    while(!T.done){const bt=curBout(T);if(!bt){bug('sem luta e não terminou',key);break;}
      const m=bt.m;if(m.a==null||m.b==null){bug('vaga vazia',key);break;}if(m.a===m.b){bug('contra ele mesmo',key);break;}
      if(!m.third&&(T.out.has(m.a)||T.out.has(m.b)))bug('eliminado lutando',key);if(m.third&&(T.dead.has(m.a)||T.dead.has(m.b)))bug('morto na disputa de 3o',key);if(m.third)ev.third=(ev.third||0)+1;
      if(bt.A.i==='vken')ev.captive++;if(bt.A.i==='kbee')ev.kbee=(ev.kbee||0)+1;{const ph=curPhase(T);const ids=ph.matches.filter(x=>!x.res&&!x.inv).flatMap(x=>[x.a,x.b]).concat(ph.direct||[]);if(new Set(ids).size!==ids.length)bug('lutador repetido na fase',key);}if(T.amuletoMode&&T.amulet!=null&&(T.out.has(T.amulet)||T.amulet===QUAN.i||CARDS[T.amulet].alien))bug('amuleto com portador inválido',key);
      const r=fight(bt.A,bt.B,{ta:bt.ta,tb:bt.tb});ev.fights++;
      for(const f of r.frames){if(/undefined|NaN/.test(f.t))bug('texto quebrado: '+f.t.replace(/\d+/g,'#'),key);
        if(f.t.includes('vira Devil Jin'))ev.devilJin++;if(f.t.includes('vira Devil Kazuya'))ev.devilKaz++;if(f.t.includes('Evil Ryu!'))ev.evilRyu++;if(f.t.includes('ANGEL JIN'))ev.angel=(ev.angel||0)+1;}
      if(!(r.whp>0))bug('whp inválido',key);
      const wasVken=bt.A.i==='vken';const om=T.omega;
      const kb=T.dead.size,kob=T.ko.size;
      const p=applyResult(T,r);if(T.msgs.some(x=>x.includes('volta ao torneio')))ev.kenBack=(ev.kenBack||0)+1;if(T.msgs.some(x=>x.includes('W.O.')))ev.wo=(ev.wo||0)+1;if(T.msgs.some(x=>x.includes('refaz o sorteio')))ev.redraw=(ev.redraw||0)+1;
      if(wasVken){if(r.w.i==='vken')ev.vkenWin++;else ev.vkenLose++;}
      if(!om&&T.omega)ev.omega++;
      if(r.evilBy)ev.evil++;
      ev.kills+=T.dead.size-kb;ev.kos+=T.ko.size-kob;
      for(const q of p){if(!q.opts.length)bug('escolha vazia',key);const id=q.opts[Math.floor(Math.random()*q.opts.length)];choosePending(T,q,id);if(q.kind==='rugal')ev.rugal++;else ev.rewards[id]=(ev.rewards[id]||0)+1;}
      if(++guard>3000){bug('loop',key);break;}}
    if(T.champ==null)bug('sem campeão',key);else{if(T.out.has(T.champ))bug('campeão eliminado',key);champs[key][CARDS[T.champ].n]=(champs[key][CARDS[T.champ].n]||0)+1;}
    const aliveL=[...T.ids,...CARDS.slice(NB).map(c=>c.i)].filter(i=>!T.out.has(i));const alive=aliveL.length;
    if(T.conquest==='aliens'){ev.alienConq=(ev.alienConq||0)+1;if(aliveL.some(i=>!CARDS[i].alien))bug('aliens venceram com humano vivo',key);}else if(alive!==1)bug(`restantes ${alive} != 1 (modo ${mode})`,key);if(T.champ===QUAN.i&&T.left.has(QUAN.i))bug('quan chi campeao apos sair',key);
    if(T.conquest==='predador')ev.predConq=(ev.predConq||0)+1;if(T.conquest==='quanchi')ev.quanConq=(ev.quanConq||0)+1;if(T.amuletoMode)ev.amuT=(ev.amuT||0)+1;if(T.bonus[KRATOS.i]&&T.bonus[KRATOS.i].length)ev.kratosGod=(ev.kratosGod||0)+1;if(mode)ev.modeT=(ev.modeT||0)+1;if(T.superDone)ev.superPred=(ev.superPred||0)+1;if(!mode&&CARDS.length>NB)bug('alien nasceu fora do modo',key);
    if(T.champ!=null&&CARDS[T.champ].n==='Kazuya Mishima')ev.kazChamp=(ev.kazChamp||0)+1;if(Object.values(T.demon).some(v=>v>=T.demonMax))ev.trueDevil=(ev.trueDevil||0)+1;ev.aliens=(ev.aliens||0)+T.aliens;if(T.champ!=null&&CARDS[T.champ].alien)ev.alienChamp=(ev.alienChamp||0)+1;for(const i in T.trophy)ev.trophy=(ev.trophy||0)+T.trophy[i];
    for(const i of T.dead)if(T.ko.has(i))bug('morto e nocauteado',key);
    {const P=getPodium(T);if(T.conquest!=='aliens'){if(P[0]==null)bug('podio sem campeao',key);if(P[1]!=null&&P[1]===P[0])bug('podio repetido',key);if(P[2]!=null&&(P[2]===P[0]||P[2]===P[1]))bug('podio repetido 3',key);if(P[2]!=null&&T.dead.has(P[2])&&fmt!=='rei')bug('3o lugar morto',key);if(P[2]!=null)ev.pod3=(ev.pod3||0)+1;}
     for(const id of evalConquests(T))ev['c_'+id]=(ev['c_'+id]||0)+1;
     for(const i in T.karma){if(T.karma[i]<-10||T.karma[i]>10)bug('carma fora',key);const a=T.startRole[i],b=karmaRole(T.karma[i]);if(a!==b)ev['k_'+a+b]=(ev['k_'+a+b]||0)+1;}
     ev.tours=(ev.tours||0)+1;}
  }
}
console.log('BUGS:',Object.keys(bugs).length?'':'nenhum');for(const k in bugs)console.log(' -',k,'×',bugs[k].n,'| ex:',bugs[k].ex);
console.log('eventos:',JSON.stringify(ev));
console.log('taxa de morte:',(ev.kills/(ev.kills+ev.kos)*100).toFixed(0)+'%');
for(const k of ['mata8','copa40','copa'+NB])console.log(k,Object.entries(champs[k]).sort((x,y)=>y[1]-x[1]).slice(0,6).map(x=>x[0]+' '+x[1]).join(', '));
