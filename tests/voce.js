const fs=require('fs');const s=fs.readFileSync(process.argv[2]||'app/index.html','utf8');
const a=s.indexOf('// ===================== DADOS'),b=s.indexOf('// ===================== INTERFACE');
eval(s.slice(a,b).replace(/const /g,'var '));
const bugs={};const bug=(k,ex)=>{bugs[k]=bugs[k]||{n:0,ex};bugs[k].n++;};
const st={tours:0,champ:0,died:0,left:0,fights:0,kills:0,spares:0,locked:0,decisions:0,invalid:0,divWin:0,divF:0,quan:0};
for(let t=0;t<3000;t++){
  const fmt=['copa','mata','rei'][t%3];const n=[8,16,20,32,41][t%5];if(fmt==='rei'&&n>16&&n!==41)continue;
  const alien=t%4===1&&fmt!=='rei'&&n>=16,amu=t%3===2;const diff=t%2?'divina':'normal';
  const pool=[...Array(NB).keys()].filter(i=>!(diff==='normal'&&CARDS[i].tit)&&!((alien||amu)&&(CARDS[i].alien||CARDS[i].pred)));
  const player=t%7===0&&amu?QUAN.i:pool[Math.floor(Math.random()*pool.length)];
  const T=newTourState(Math.random,fmt,drawIds(n,Math.random),{alien,amuleto:amu,player,diff});st.tours++;
  if(!T.ids.includes(player))bug('jogador fora da lista');
  if(T.amuletoMode&&player!==QUAN.i&&T.amulet!==player)bug('jogador sem amuleto');
  let g=0;
  while(!T.done&&!T.out.has(player)){const bt=curBout(T);if(!bt){bug('sem luta');break;}
    const side=playerSide(T,bt);let r;
    if(side){st.fights++;const G=fightG(bt.A,bt.B,{ta:bt.ta,tb:bt.tb,ctl:side});let y=G.next();
      while(!y.done){const v=y.value;st.decisions++;if(v.f!==(side==='A'?v.A:v.B))bug('decisão do lado errado');
        const ok=v.opts.filter(o=>o.ok);if(!ok.length)bug('sem opção válida');const o=ok[Math.floor(Math.random()*ok.length)];
        if(Math.random()<.02){st.invalid++;y=G.next({t:'a',id:'naoexiste'});continue;}
        y=G.next(o.t==='b'?{t:'b',k:o.k}:{t:'a',id:o.id});}
      r=y.value;if(T.diff==='divina'){st.divF++;if(r.w.i===player)st.divWin++;}
      for(const f of r.frames)if(/undefined|NaN/.test(f.t))bug('texto quebrado '+f.t);
      const won=r.w.i===player;let ch=null;
      if(won){const lk=playerLock(T,r.w,r.l);if(lk){st.locked++;ch=lk.k;}else ch=Math.random()<.5?'kill':'spare';}
      T.playerChoice=ch;const d0=T.dead.size,lout=typeof r.l.i==='number'?r.l.i:null;
      const pend=applyResult(T,r);T.playerChoice=null;
      if(!won&&!T.dead.has(player))bug('jogador perdeu e não morreu');
      if(won&&ch&&lout!=null&&!T.alienMode){const died=T.dead.has(lout);if(ch==='kill'&&!died)bug('escolheu matar e não matou '+r.w.n+'>'+r.l.n);if(ch==='spare'&&died)bug('escolheu poupar e matou '+r.w.n+'>'+r.l.n);}
      if(ch==='kill')st.kills++;if(ch==='spare')st.spares++;
      for(const p of pend)choosePending(T,p,p.opts[0]);}
    else{r=fight(bt.A,bt.B,{ta:bt.ta,tb:bt.tb,quiet:true});const pend=applyResult(T,r);for(const p of pend)choosePending(T,p,p.opts[0]);}
    if(++g>3000){bug('loop');break;}}
  if(T.done&&T.champ===player)st.champ++;else if(T.dead.has(player))st.died++;else if(T.out.has(player)){st.left++;if(T.conquest==='quanchi')st.quan++;}
  // termina o torneio sem o jogador (assistir o resto)
  let g2=0;while(!T.done){const bt=curBout(T);if(!bt){bug('sem luta 2');break;}const r=fight(bt.A,bt.B,{ta:bt.ta,tb:bt.tb,quiet:true});const pend=applyResult(T,r);for(const p of pend)choosePending(T,p,p.opts[0]);if(++g2>3000){bug('loop2');break;}}
  if(T.done){getPodium(T);evalConquests(T);}
}
console.log('BUGS:',Object.keys(bugs).length?JSON.stringify(bugs,null,1):'nenhum');console.log(st,'divina vitórias por luta:',Math.round(st.divWin/st.divF*100)+'%');
