const fs=require('fs');const s=fs.readFileSync('app/index.html','utf8');
const a=s.indexOf('// ===================== DADOS'),b=s.indexOf('// ===================== INTERFACE');
eval(s.slice(a,b).replace(/const /g,'var '));
const N=30,base=CARDS.slice(0,NB);
const stat={};const abUse={},abName={};for(const id in AB)abName[AB[id].n]=id;
const issues=[];
function run(c,opt,label){let w=0,g=0,rounds=0,dmgOut=0;const used={};
  for(const x of base){if(x.n===c.n)continue;for(let n=0;n<N;n++){const r=fight(c,x,{quiet:false,ta:opt||{}});g++;rounds+=r.round;if(r.w===c||r.w.n===c.n)w++;
    for(const f of r.frames){if(/undefined|NaN|null/.test(f.t))issues.push(label+': '+f.t);const m=f.t.match(/^(.+?) usa (.+?)[!.]?$/);if(m&&(m[1]===c.n||m[1].startsWith(label.split(' ')[0]))){used[m[2]]=(used[m[2]]||0)+1;}}}}
  return {wr:Math.round(w/g*100),rounds:(rounds/g).toFixed(1),used};}
const rows=[];
for(const c of base){const r=run(c,{},c.n);const actives=c.ab.filter(id=>AB[id]&&AB[id].t==='A');const never=actives.filter(id=>!r.used[AB[id].n]);
  rows.push({n:c.n,cls:c.cls+'/'+c.sub,tit:c.tit||c.pat,forca:c.forca,wr:r.wr,rounds:r.rounds,never:never.map(id=>AB[id].n),uses:Object.entries(r.used).map(([k,v])=>k+':'+Math.round(v/(N*(NB-1))*10)/10).join(' ')});}
rows.sort((x,y)=>y.wr-x.wr);
for(const r of rows)console.log([r.wr+'%',r.n,r.cls,r.tit,'F'+r.forca,'rod '+r.rounds,'usos/luta '+r.uses,r.never.length?'NUNCA USA: '+r.never.join(','):''].join(' | '));
console.log('\nproblemas de texto:',issues.length,issues.slice(0,5));
// abilities defined but unused by anybody
const usedIds=new Set([...base.flatMap(c=>c.ab),...Object.values(FORMS).flatMap(c=>c.ab),'intencao','eco','mente','chamaShoryu','sobrevivente','amuleto','tatica']);
console.log('habilidades sem dono:',Object.keys(AB).filter(id=>!usedIds.has(id)).join(', ')||'nenhuma');
console.log('habilidades citadas sem definição:',[...new Set(base.flatMap(c=>c.ab))].filter(id=>!AB[id]).join(', ')||'nenhuma');
