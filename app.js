// ═══════════════════ NAV ═══════════════════
function openTool(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function goHome(){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('home').classList.add('active');
}
function switchTab(tool,panel,el){
  const pre={'cardio':'cp-','resp':'rp-'};
  document.querySelectorAll(`#${tool} .tab`).forEach(t=>t.classList.remove('on'));
  el.classList.add('on');
  document.querySelectorAll(`#${tool} .panel`).forEach(p=>p.classList.remove('on'));
  document.getElementById(pre[tool]+panel).classList.add('on');
  // Lazy-init ECG cardio quiz when first opened
  if(tool==='cardio'&&panel==='ecgquiz'){
    const el2=document.getElementById('ecg-cardio-quiz');
    if(el2&&el2.children.length===0){
      el2.innerHTML=ECG_CARDIO_QUIZ.map((q,i)=>`
        <div style="background:var(--surf);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:10px">
          <div style="font-size:10px;color:var(--red);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">ECG: ${q.rhythm}</div>
          <div style="font-size:13px;font-weight:600;margin-bottom:10px;line-height:1.5">${q.stem}</div>
          <div style="font-size:13px;margin-bottom:12px;color:var(--muted2)">${q.q}</div>
          ${q.opts.map((o,j)=>`<button class="ecgt-quiz-opt" style="margin-bottom:6px" onclick="answerCardioECG(${i},${j})" id="cecgo-${i}-${j}">${o}</button>`).join('')}
          <div style="display:none;margin-top:8px;padding:10px;background:rgba(0,0,0,.3);border-radius:9px;font-size:12px;color:var(--muted2);line-height:1.55" id="cecge-${i}">${q.exp}</div>
        </div>`).join('')+
        `<div id="cecg-score" style="display:none;text-align:center;padding:20px"><div style="font-family:'Syne',sans-serif;font-size:52px;font-weight:800;color:var(--green)" id="cecgs-val">0/0</div><div style="color:var(--muted2);margin-top:6px">ECG scenarios correct</div><button class="btn btn-teal" style="margin-top:16px;width:auto;padding:12px 28px" onclick="resetCardioECG()">↺ Retake</button></div>`;
    }
  }
}

// ═══════════════════ GCS ═══════════════════
let gcs={e:0,v:0,m:0};
function setGCS(g,v,el){
  gcs[g]=v;
  el.closest('.gcs-btns').querySelectorAll('.gcs-btn').forEach(b=>b.classList.remove('on'));
  el.classList.add('on');
  const t=gcs.e+gcs.v+gcs.m;
  const r=document.getElementById('gcs-result');
  if(gcs.e&&gcs.v&&gcs.m){
    r.style.display='block';
    document.getElementById('gcs-total').textContent=t;
    document.getElementById('gcs-e').textContent=gcs.e;
    document.getElementById('gcs-v').textContent=gcs.v;
    document.getElementById('gcs-m').textContent=gcs.m;
    let interp=t>=13?'Mild / Normal (13–15)':t>=9?'Moderate (9–12)':'Severe (≤8) — consider airway';
    document.getElementById('gcs-interp').textContent=interp;
    document.getElementById('gcs-total').style.color=t>=13?'var(--teal)':t>=9?'var(--amber)':'var(--red)';
  }
}
function resetGCS(){
  gcs={e:0,v:0,m:0};
  document.querySelectorAll('.gcs-btn').forEach(b=>b.classList.remove('on'));
  document.getElementById('gcs-result').style.display='none';
}

// ═══════════════════ CRANIAL NERVES ═══════════════════
function switchNTab(tab,el){
  document.querySelectorAll('.ntab').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');
  ['np-gcs','np-cn','np-quiz'].forEach(id=>document.getElementById(id).classList.remove('on'));
  document.getElementById('np-'+tab).classList.add('on');
  if(tab==='quiz') buildQuiz();
}

const CN_DATA=[
  {num:'I',name:'Olfactory',type:'Sensory',color:'#00d4aa',
   svg:`<svg viewBox="0 0 260 140" xmlns="http://www.w3.org/2000/svg">
    <rect width="260" height="140" fill="#161e2e" rx="10"/>
    <ellipse cx="130" cy="55" rx="28" ry="35" fill="none" stroke="#5a6a8a" stroke-width="1.5"/>
    <ellipse cx="130" cy="48" rx="10" ry="14" fill="#1d2840"/>
    <circle cx="118" cy="72" r="6" fill="#1d2840" stroke="#5a6a8a" stroke-width="1.5"/>
    <circle cx="142" cy="72" r="6" fill="#1d2840" stroke="#5a6a8a" stroke-width="1.5"/>
    <path d="M118 72 Q110 80 108 90" stroke="#00d4aa" stroke-width="2" fill="none" stroke-dasharray="3,2"/>
    <path d="M142 72 Q150 80 152 90" stroke="#00d4aa" stroke-width="2" fill="none" stroke-dasharray="3,2"/>
    <rect x="90" y="92" width="35" height="22" rx="6" fill="rgba(0,212,170,.15)" stroke="#00d4aa" stroke-width="1"/>
    <rect x="135" y="92" width="35" height="22" rx="6" fill="rgba(0,212,170,.15)" stroke="#00d4aa" stroke-width="1"/>
    <text x="107" y="107" text-anchor="middle" font-size="9" fill="#00d4aa">Coffee</text>
    <text x="152" y="107" text-anchor="middle" font-size="9" fill="#00d4aa">Vanilla</text>
    <text x="130" y="130" text-anchor="middle" font-size="9" fill="#5a6a8a">Test each nostril separately</text>
   </svg>`,
   steps:['Block one nostril','Hold familiar scent (coffee, vanilla) under open nostril','Ask patient to identify — repeat other side','<strong>+ve finding:</strong> Anosmia — loss of smell (CN I palsy, olfactory groove meningioma)']},
  {num:'II',name:'Optic',type:'Sensory',color:'#4a9eff',
   svg:`<svg viewBox="0 0 260 140" xmlns="http://www.w3.org/2000/svg">
    <rect width="260" height="140" fill="#161e2e" rx="10"/>
    <circle cx="130" cy="65" r="30" fill="none" stroke="#5a6a8a" stroke-width="1.5"/>
    <circle cx="130" cy="65" r="14" fill="#1d2840" stroke="#5a6a8a" stroke-width="1.5"/>
    <circle cx="130" cy="65" r="7" fill="#4a9eff" opacity=".6"/>
    <line x1="80" y1="65" x2="178" y2="65" stroke="rgba(74,158,255,.3)" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="130" y1="20" x2="130" y2="110" stroke="rgba(74,158,255,.3)" stroke-width="1" stroke-dasharray="4,3"/>
    <path d="M80,35 L130,65 L80,95" fill="none" stroke="#4a9eff" stroke-width="1.5" opacity=".5"/>
    <path d="M180,35 L130,65 L180,95" fill="none" stroke="#4a9eff" stroke-width="1.5" opacity=".5"/>
    <text x="130" y="125" text-anchor="middle" font-size="9" fill="#5a6a8a">Confrontation field testing</text>
    <text x="60" y="65" text-anchor="middle" font-size="8" fill="#4a9eff">L</text>
    <text x="200" y="65" text-anchor="middle" font-size="8" fill="#4a9eff">R</text>
   </svg>`,
   steps:['Visual acuity with Snellen chart (each eye separately)','Visual fields by confrontation — wiggle finger in each quadrant','Pupillary reflexes (direct and consensual)','Fundoscopy — inspect optic disc','<strong>+ve findings:</strong> Reduced acuity, field defects (bitemporal hemianopia = pituitary lesion), papilloedema']},
  {num:'III/IV/VI',name:'Oculomotor / Trochlear / Abducens',type:'Motor',color:'#f4547a',
   svg:`<svg viewBox="0 0 260 140" xmlns="http://www.w3.org/2000/svg">
    <rect width="260" height="140" fill="#161e2e" rx="10"/>
    <circle cx="130" cy="60" r="22" fill="none" stroke="#5a6a8a" stroke-width="1.5"/>
    <circle cx="130" cy="60" r="10" fill="#1d2840" stroke="#5a6a8a" stroke-width="1.5"/>
    <circle cx="130" cy="60" r="5" fill="#f4547a" opacity=".7"/>
    <path d="M130,60 L162,38" stroke="#f4547a" stroke-width="2" marker-end="url(#arr)"/>
    <path d="M130,60 L162,60" stroke="#f4547a" stroke-width="2"/>
    <path d="M130,60 L162,82" stroke="#f4547a" stroke-width="2" marker-end="url(#arr)"/>
    <path d="M130,60 L98,38" stroke="#f4547a" stroke-width="2"/>
    <path d="M130,60 L98,60" stroke="#f4547a" stroke-width="2"/>
    <path d="M130,60 L98,82" stroke="#f4547a" stroke-width="2"/>
    <text x="130" y="102" text-anchor="middle" font-size="9" fill="#5a6a8a">H-pattern EOM testing</text>
    <text x="130" y="116" text-anchor="middle" font-size="9" fill="#f4547a">6 cardinal directions of gaze</text>
   </svg>`,
   steps:['Hold finger 50cm from patient — ask to follow without moving head','Move in H-pattern covering all 6 directions of gaze','Observe for nystagmus, lid droop, or failure to move','Check pupillary response to light and accommodation','<strong>+ve findings:</strong> CN III palsy: eye down and out + ptosis + dilated pupil; CN VI palsy: failure to abduct (medial deviation)']},
  {num:'V',name:'Trigeminal',type:'Both',color:'#ffb347',
   svg:`<svg viewBox="0 0 260 140" xmlns="http://www.w3.org/2000/svg">
    <rect width="260" height="140" fill="#161e2e" rx="10"/>
    <ellipse cx="130" cy="60" rx="40" ry="48" fill="none" stroke="#5a6a8a" stroke-width="1.5"/>
    <ellipse cx="130" cy="44" rx="16" ry="16" fill="#1d2840"/>
    <path d="M110,68 Q130,80 150,68" fill="none" stroke="#5a6a8a" stroke-width="1.5"/>
    <circle cx="104" cy="55" r="5" fill="rgba(255,179,71,.25)" stroke="#ffb347" stroke-width="1"/>
    <circle cx="156" cy="55" r="5" fill="rgba(255,179,71,.25)" stroke="#ffb347" stroke-width="1"/>
    <text x="65" y="42" font-size="8" fill="#ffb347">V1</text>
    <text x="65" y="58" font-size="8" fill="#ffb347">V2</text>
    <text x="65" y="74" font-size="8" fill="#ffb347">V3</text>
    <line x1="82" y1="40" x2="110" y2="46" stroke="#ffb347" stroke-width="1" stroke-dasharray="2,2"/>
    <line x1="82" y1="56" x2="107" y2="58" stroke="#ffb347" stroke-width="1" stroke-dasharray="2,2"/>
    <line x1="82" y1="72" x2="108" y2="70" stroke="#ffb347" stroke-width="1" stroke-dasharray="2,2"/>
    <text x="130" y="118" text-anchor="middle" font-size="9" fill="#5a6a8a">V1=forehead V2=cheek V3=chin</text>
   </svg>`,
   steps:['Test sensation in V1 (forehead), V2 (cheek), V3 (chin) bilaterally using cotton wool','Corneal reflex: touch cornea lightly — expect blink (afferent = V, efferent = VII)','Motor: jaw clench against resistance; jaw opening against resistance','Jaw jerk reflex','<strong>+ve findings:</strong> Reduced facial sensation, absent corneal reflex, jaw deviation to weak side']},
  {num:'VII',name:'Facial',type:'Both',color:'#a78bfa',
   svg:`<svg viewBox="0 0 260 140" xmlns="http://www.w3.org/2000/svg">
    <rect width="260" height="140" fill="#161e2e" rx="10"/>
    <ellipse cx="130" cy="65" rx="42" ry="50" fill="none" stroke="#5a6a8a" stroke-width="1.5"/>
    <ellipse cx="130" cy="50" rx="16" ry="16" fill="#1d2840"/>
    <circle cx="122" cy="47" r="4" fill="none" stroke="#5a6a8a" stroke-width="1.2"/>
    <circle cx="138" cy="47" r="4" fill="none" stroke="#5a6a8a" stroke-width="1.2"/>
    <path d="M112,72 Q130,82 148,72" fill="none" stroke="#a78bfa" stroke-width="2"/>
    <path d="M122,32 Q130,26 138,32" fill="none" stroke="#a78bfa" stroke-width="2"/>
    <text x="130" y="105" text-anchor="middle" font-size="9" fill="#5a6a8a">Raise brows · Close eyes · Show teeth</text>
    <text x="130" y="120" text-anchor="middle" font-size="9" fill="#a78bfa">Puff cheeks · Whistle</text>
   </svg>`,
   steps:['Raise eyebrows (frontalis — spared in UMN lesion)','Screw eyes tightly shut — attempt to open against resistance','Show teeth — look for symmetry','Puff cheeks against resistance','<strong>+ve findings:</strong> LMN (Bell\'s palsy): entire ipsilateral face affected including forehead; UMN (stroke): lower face only, forehead spared']},
  {num:'VIII',name:'Vestibulocochlear',type:'Sensory',color:'#34d399',
   svg:`<svg viewBox="0 0 260 140" xmlns="http://www.w3.org/2000/svg">
    <rect width="260" height="140" fill="#161e2e" rx="10"/>
    <path d="M140,30 Q165,30 165,55 Q165,70 155,75 Q148,78 145,85 L145,105" fill="none" stroke="#34d399" stroke-width="2"/>
    <path d="M120,30 Q95,30 95,55 Q95,70 105,75 Q112,78 115,85 L115,105" fill="none" stroke="#34d399" stroke-width="2"/>
    <rect x="100" y="105" width="60" height="20" rx="6" fill="rgba(52,211,153,.15)" stroke="#34d399" stroke-width="1"/>
    <text x="130" y="119" text-anchor="middle" font-size="9" fill="#34d399">Tuning Fork</text>
    <text x="70" y="55" text-anchor="middle" font-size="8" fill="#5a6a8a">Weber</text>
    <text x="190" y="55" text-anchor="middle" font-size="8" fill="#5a6a8a">Rinne</text>
    <line x1="90" y1="55" x2="108" y2="55" stroke="#5a6a8a" stroke-width="1" stroke-dasharray="2,2"/>
    <line x1="170" y1="55" x2="152" y2="55" stroke="#5a6a8a" stroke-width="1" stroke-dasharray="2,2"/>
   </svg>`,
   steps:['Whisper test: stand 60cm behind, whisper 2-syllable number — patient repeats','Rinne: 512Hz fork on mastoid → air (normal: AC > BC)','Weber: fork on vertex — should not lateralise','<strong>+ve findings:</strong> Rinne –ve = conductive loss; Weber lateralises to deaf side (conductive) or good side (sensorineural)']},
  {num:'IX/X',name:'Glossopharyngeal / Vagus',type:'Both',color:'#4a9eff',
   svg:`<svg viewBox="0 0 260 140" xmlns="http://www.w3.org/2000/svg">
    <rect width="260" height="140" fill="#161e2e" rx="10"/>
    <rect x="90" y="30" width="80" height="55" rx="8" fill="#1d2840" stroke="#5a6a8a" stroke-width="1.5"/>
    <ellipse cx="130" cy="57" rx="30" ry="18" fill="#161e2e" stroke="#5a6a8a" stroke-width="1"/>
    <line x1="110" y1="40" x2="150" y2="40" stroke="#5a6a8a" stroke-width="1"/>
    <line x1="105" y1="50" x2="155" y2="50" stroke="#5a6a8a" stroke-width="1"/>
    <path d="M118,57 L142,57" stroke="#4a9eff" stroke-width="2"/>
    <path d="M120,57 Q130,48 140,57" fill="none" stroke="#4a9eff" stroke-width="1.5"/>
    <text x="130" y="100" text-anchor="middle" font-size="9" fill="#4a9eff">Uvula — midline or deviated?</text>
    <text x="130" y="115" text-anchor="middle" font-size="9" fill="#5a6a8a">Say "Ahhh" — palate should rise</text>
   </svg>`,
   steps:['Ask patient to say "Ahh" — soft palate should rise symmetrically','Check uvula position (midline)','Gag reflex (afferent IX, efferent X) — use with clinical discretion','Voice quality (hoarse = recurrent laryngeal nerve)','<strong>+ve findings:</strong> Uvula deviates away from lesion; absent gag; bovine cough; dysphagia']},
  {num:'XI',name:'Accessory',type:'Motor',color:'#f4547a',
   svg:`<svg viewBox="0 0 260 140" xmlns="http://www.w3.org/2000/svg">
    <rect width="260" height="140" fill="#161e2e" rx="10"/>
    <ellipse cx="130" cy="45" rx="20" ry="24" fill="#1d2840" stroke="#5a6a8a" stroke-width="1.5"/>
    <path d="M110,65 Q80,70 75,95" stroke="#f4547a" stroke-width="2.5" fill="none"/>
    <path d="M150,65 Q180,70 185,95" stroke="#f4547a" stroke-width="2.5" fill="none"/>
    <path d="M120,68 Q130,75 140,68 Q135,90 130,100 Q125,90 120,68Z" fill="rgba(244,84,122,.2)" stroke="#f4547a" stroke-width="1"/>
    <text x="130" y="120" text-anchor="middle" font-size="9" fill="#5a6a8a">SCM + Trapezius</text>
    <text x="62" y="92" font-size="8" fill="#f4547a">SCM</text>
    <text x="182" y="92" font-size="8" fill="#f4547a">SCM</text>
   </svg>`,
   steps:['SCM: ask patient to turn head against your resistance — palpate opposite SCM','Trapezius: ask to shrug shoulders against downward resistance bilaterally','<strong>+ve findings:</strong> Weakness = CN XI palsy; shoulder drop; difficulty turning head. Seen in posterior fossa lesions, neck dissection.']},
  {num:'XII',name:'Hypoglossal',type:'Motor',color:'#ffb347',
   svg:`<svg viewBox="0 0 260 140" xmlns="http://www.w3.org/2000/svg">
    <rect width="260" height="140" fill="#161e2e" rx="10"/>
    <rect x="90" y="35" width="80" height="50" rx="8" fill="#1d2840" stroke="#5a6a8a" stroke-width="1.5"/>
    <ellipse cx="130" cy="60" rx="32" ry="20" fill="#161e2e" stroke="#5a6a8a" stroke-width="1"/>
    <ellipse cx="130" cy="70" rx="14" ry="10" fill="rgba(255,179,71,.25)" stroke="#ffb347" stroke-width="1.5"/>
    <path d="M130,70 L130,90" stroke="#ffb347" stroke-width="2.5"/>
    <path d="M116,83 L130,90 L144,83" fill="none" stroke="#ffb347" stroke-width="1.5"/>
    <text x="130" y="112" text-anchor="middle" font-size="9" fill="#ffb347">Tongue protrudes midline?</text>
    <text x="130" y="126" text-anchor="middle" font-size="9" fill="#5a6a8a">Look for fasciculations &amp; wasting</text>
   </svg>`,
   steps:['Ask patient to open mouth and inspect tongue at rest (fasciculations? wasting?)','Ask to protrude tongue — should be midline','Rapid tongue movements: "la la la" (speed and rhythm)','<strong>+ve findings:</strong> Tongue deviates toward side of lesion (LMN); fasciculations = LMN; UMN = slow spastic tongue movements']}
];

const cnGrid=document.getElementById('cn-grid');
CN_DATA.forEach((cn,i)=>{
  cnGrid.innerHTML+=`<div class="cn-card" onclick="showCN(${i})" id="cncard-${i}">
    <div class="cn-num">CN ${cn.num}</div>
    <div class="cn-name">${cn.name}</div>
    <div class="cn-type" style="color:${cn.color}">${cn.type}</div>
  </div>`;
});

function showCN(i){
  document.querySelectorAll('.cn-card').forEach(c=>c.classList.remove('on'));
  document.getElementById('cncard-'+i).classList.add('on');
  const cn=CN_DATA[i];
  const d=document.getElementById('cn-detail');
  d.classList.add('on');
  d.innerHTML=`
    <div style="font-family:'Syne',sans-serif;font-size:16px;font-weight:700;margin-bottom:4px;color:${cn.color}">CN ${cn.num} — ${cn.name}</div>
    <div style="font-size:11px;color:var(--muted2);margin-bottom:12px">${cn.type} nerve</div>
    <div class="cn-svg-wrap">${cn.svg}</div>
    <div class="cn-steps">
      ${cn.steps.map((s,j)=>`<div class="cn-step"><div class="step-dot">${j+1}</div><div class="step-text">${s}</div></div>`).join('')}
    </div>`;
  d.scrollIntoView({behavior:'smooth',block:'nearest'});
}

// ═══════════════════ CN QUIZ ═══════════════════
const CN_QUIZ=[
  {q:'Which cranial nerve is responsible for smelling coffee?',opts:['CN II','CN I','CN VII','CN V'],ans:1,exp:'CN I (Olfactory) is the sensory nerve for smell. Tested by holding familiar scents under each nostril separately.'},
  {q:'A patient cannot abduct their right eye. Which CN is most likely affected?',opts:['CN III','CN IV','CN VI','CN VII'],ans:2,exp:'CN VI (Abducens) controls the lateral rectus muscle, which abducts the eye. Palsy causes the eye to deviate medially.'},
  {q:'On examination, the uvula deviates to the LEFT. Which side is the lesion?',opts:['Left side','Right side','Bilateral','Cannot determine'],ans:1,exp:'The uvula deviates AWAY from the side of a CN X (vagus) lesion. So if it deviates left, the lesion is on the right.'},
  {q:'A patient has weakness of the LOWER face only, with forehead sparing. This is most consistent with:',opts:['LMN CN VII palsy (Bell\'s)','UMN CN VII palsy (stroke)','CN V palsy','CN III palsy'],ans:1,exp:'Forehead sparing indicates an UMN lesion (e.g. stroke). The forehead has bilateral cortical representation, so a unilateral UMN lesion spares it. LMN palsy (Bell\'s) affects the entire ipsilateral face.'},
  {q:'Rinne test is negative (BC > AC) in the RIGHT ear. What type of hearing loss is this?',opts:['Right sensorineural','Right conductive','Left sensorineural','Normal finding'],ans:1,exp:'A negative Rinne (bone conduction louder than air conduction) indicates conductive hearing loss on that side. Sensorineural loss gives a positive Rinne but Weber lateralises to the GOOD ear.'},
  {q:'Which nerve would be damaged to cause tongue deviation to the right?',opts:['Left CN XII','Right CN XII','Left CN XI','Right CN VII'],ans:1,exp:'The tongue deviates TOWARD the side of an LMN (hypoglossal) lesion. So deviation to the right = right CN XII lesion. The affected side\'s muscles cannot push tongue to the opposite side.'},
  {q:'Testing SCM and trapezius power assesses which cranial nerve?',opts:['CN X','CN IX','CN XI','CN XII'],ans:2,exp:'CN XI (Accessory nerve) innervates the sternocleidomastoid and trapezius. Tested by head turn against resistance and shoulder shrug.'},
  {q:'Bitemporal hemianopia most commonly results from:',opts:['Optic nerve transection','Pituitary tumour compressing optic chiasm','Occipital lobe lesion','CN III palsy'],ans:1,exp:'The optic chiasm is where nasal fibres (carrying temporal visual field) cross. A pituitary tumour compresses the chiasm causing bitemporal hemianopia — loss of both outer visual fields.'},
];

let quizAnswers={};
function buildQuiz(){
  const el=document.getElementById('quiz-body');
  if(el.dataset.built) return;
  el.dataset.built='1';
  el.innerHTML=CN_QUIZ.map((q,i)=>`
    <div class="quiz-card" id="qcard-${i}">
      <div class="quiz-q">Q${i+1}. ${q.q}</div>
      <div class="quiz-opts">
        ${q.opts.map((o,j)=>`<button class="quiz-opt" onclick="answerCNQ(${i},${j})" id="qopt-${i}-${j}">${o}</button>`).join('')}
      </div>
      <div class="quiz-explain" id="qexp-${i}">${q.exp}</div>
    </div>`).join('')+
    `<div class="quiz-score" id="quiz-score-panel" style="display:none">
      <div class="quiz-score-big" id="quiz-score-val">0/0</div>
      <div style="color:var(--muted2);font-size:13px;margin-top:6px">questions correct</div>
      <button class="btn btn-teal" style="margin-top:16px" onclick="retakeQuiz()">↺ Retake</button>
    </div>`;
}
function answerCNQ(qi,oi){
  if(quizAnswers[qi]!==undefined) return;
  quizAnswers[qi]=oi;
  const q=CN_QUIZ[qi];
  for(let j=0;j<q.opts.length;j++){
    const b=document.getElementById(`qopt-${qi}-${j}`);
    b.disabled=true;
    if(j===q.ans) b.classList.add(oi===j?'correct':'reveal');
    else if(j===oi) b.classList.add('wrong');
  }
  document.getElementById(`qexp-${qi}`).classList.add('on');
  if(Object.keys(quizAnswers).length===CN_QUIZ.length){
    const sc=Object.entries(quizAnswers).filter(([i,v])=>CN_QUIZ[i].ans===+v).length;
    const panel=document.getElementById('quiz-score-panel');
    panel.style.display='block';
    document.getElementById('quiz-score-val').textContent=`${sc}/${CN_QUIZ.length}`;
    panel.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
}
function retakeQuiz(){
  quizAnswers={};
  const el=document.getElementById('quiz-body');
  delete el.dataset.built;
  buildQuiz();
}

// ═══════════════════ CARDIO — CHEST MAP (CORRECTED ORIENTATION) ═══════════════════
// SVG is viewed from front — patient's LEFT is on viewer's RIGHT
// Aortic: patient's RIGHT upper sternal edge = viewer's LEFT side of SVG (x≈105)
// Pulmonary: patient's LEFT upper sternal edge = viewer's RIGHT side (x≈155)
// Mitral/apex: patient's LEFT 5th ICS MCL = viewer's RIGHT lower (x≈165, y≈120)
// Tricuspid: lower LEFT sternal edge (viewer's right) = x≈142, y≈105
// Erb's: 3rd LEFT ICS (viewer's right) = x≈148, y≈88
// ANATOMY NOTE: SVG is viewed from FRONT of patient.
// Patient's RIGHT = viewer's LEFT (lower x). Patient's LEFT = viewer's RIGHT (higher x).
// Aortic: 2nd RIGHT ICS right sternal border → x≈110 (viewer left of centre)
// Pulmonary: 2nd LEFT ICS left sternal border → x≈170 (viewer right of centre)
// Erb's: 3rd LEFT ICS → x≈163
// Tricuspid: 4th-5th LEFT ICS lower sternal → x≈158
// Mitral/Apex: 5th LEFT ICS MCL → x≈178 (most lateral, patient left)
const STET_SITES=[
  {id:'aortic', x:110, y:68,  label:'Aortic Area',   color:'#f4547a',
   desc:"2nd RIGHT intercostal space, right sternal border — patient's right, viewer's LEFT on diagram.",
   expect:'S1 soft, S2 loud (aortic component A2). Aortic stenosis: harsh crescendo-decrescendo ejection systolic murmur, radiates to carotids. Aortic sclerosis similar but no radiation.',
   sounds:['s2','as'], soundLabels:['S2 (A2 loudest)','Aortic Stenosis']},
  {id:'pulm',   x:170, y:68,  label:'Pulmonary Area', color:'#4a9eff',
   desc:"2nd LEFT intercostal space, left sternal border — patient's left, viewer's RIGHT on diagram.",
   expect:'P2 heard here (pulmonary component of S2). Pulmonary stenosis ejection systolic murmur. Wide fixed splitting of S2 in ASD. Physiological split increases on inspiration.',
   sounds:['s2','ps'], soundLabels:['S2 (P2 component)','Pulmonary Stenosis']},
  {id:'erb',    x:163, y:88,  label:"Erb's Point",    color:'#a78bfa',
   desc:"3rd LEFT intercostal space, left sternal border — patient leaning forward, breath held in expiration.",
   expect:"Aortic regurgitation early diastolic decrescendo murmur best heard here. Also HOCM. Leaning patient forward in expiration brings aortic root closer to chest wall.",
   sounds:['ar','normal'], soundLabels:['Aortic Regurgitation','Normal S1/S2']},
  {id:'tricusp',x:158, y:108, label:'Tricuspid Area', color:'#ffb347',
   desc:"4th–5th LEFT intercostal space, lower left sternal edge — patient's left.",
   expect:"Tricuspid regurgitation: pansystolic murmur increases on inspiration (Carvallo's sign). Right-sided S3/S4 in RV failure. Tricuspid stenosis: rare, diastolic rumble.",
   sounds:['tr','normal'], soundLabels:['Tricuspid Regurgitation','Normal S1/S2']},
  {id:'mitral', x:178, y:122, label:'Mitral (Apex)',  color:'#00d4aa',
   desc:"5th LEFT intercostal space, midclavicular line — apex beat. Most lateral point, patient's left.",
   expect:"S1 loudest here. Mitral regurgitation: pansystolic blowing murmur radiating to axilla. Mitral stenosis: mid-diastolic low-pitched rumble + opening snap. S3 in MR/heart failure.",
   sounds:['mr','ms','s1'], soundLabels:['Mitral Regurgitation','Mitral Stenosis','S1 (loudest here)']},
];

const chestWrap=document.getElementById('chest-wrap');
chestWrap.innerHTML=`<svg viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:320px;display:block;margin:0 auto">
  <defs>
    <radialGradient id="bodygrd2" cx="50%" cy="35%"><stop offset="0%" stop-color="#1d2840"/><stop offset="100%" stop-color="#0f1623"/></radialGradient>
  </defs>
  <!-- Orientation labels — critical for exam -->
  <text x="22"  y="14" font-size="8" fill="#5a6a8a" font-family="Mulish">← Pt RIGHT</text>
  <text x="178" y="14" font-size="8" fill="#5a6a8a" font-family="Mulish">Pt LEFT →</text>
  <!-- Torso -->
  <path d="M68,22 Q140,12 212,22 L218,178 Q140,192 62,178 Z" fill="url(#bodygrd2)" stroke="#2a3a5a" stroke-width="1.5"/>
  <!-- Clavicles -->
  <path d="M88,34 Q140,28 192,34" fill="none" stroke="#2a3a5a" stroke-width="1.5"/>
  <!-- Sternum midline -->
  <line x1="140" y1="36" x2="140" y2="162" stroke="#3a4a6a" stroke-width="1.5" stroke-dasharray="4,3"/>
  <!-- Ribs — symmetric from sternum -->
  <path d="M140,52 Q118,60 100,70" fill="none" stroke="#2a3a5a" stroke-width="1.2" opacity=".8"/>
  <path d="M140,52 Q162,60 180,70" fill="none" stroke="#2a3a5a" stroke-width="1.2" opacity=".8"/>
  <path d="M140,68 Q116,76 96,88"  fill="none" stroke="#2a3a5a" stroke-width="1.2" opacity=".7"/>
  <path d="M140,68 Q164,76 184,88" fill="none" stroke="#2a3a5a" stroke-width="1.2" opacity=".7"/>
  <path d="M140,84 Q114,92 92,106"  fill="none" stroke="#2a3a5a" stroke-width="1.2" opacity=".6"/>
  <path d="M140,84 Q166,92 188,106" fill="none" stroke="#2a3a5a" stroke-width="1.2" opacity=".6"/>
  <path d="M140,100 Q112,110 90,125"  fill="none" stroke="#2a3a5a" stroke-width="1.2" opacity=".5"/>
  <path d="M140,100 Q168,110 190,125" fill="none" stroke="#2a3a5a" stroke-width="1.2" opacity=".5"/>
  <!-- Heart silhouette — anatomically LEFT (viewer's RIGHT, higher x values) -->
  <path d="M148,90 Q156,80 165,88 Q173,76 183,90 Q183,112 162,128 Q148,114 148,90Z"
        fill="rgba(244,84,122,.08)" stroke="rgba(244,84,122,.25)" stroke-width="1.2"/>
  <!-- ICS annotations on patient's right side (viewer's left) -->
  <text x="74" y="74"  font-size="7" fill="#4a5a7a" text-anchor="middle" font-family="Mulish">2nd ICS</text>
  <text x="74" y="92"  font-size="7" fill="#4a5a7a" text-anchor="middle" font-family="Mulish">3rd ICS</text>
  <text x="74" y="112" font-size="7" fill="#4a5a7a" text-anchor="middle" font-family="Mulish">4th ICS</text>
  <!-- Auscultation dots — placed per corrected STET_SITES coordinates -->
  ${STET_SITES.map(s=>`
  <g class="stet-point" id="sp-${s.id}" onclick="selectSite('${s.id}',this)" style="cursor:pointer">
    <circle cx="${s.x}" cy="${s.y}" r="14" fill="${s.color}" opacity=".12"/>
    <circle cx="${s.x}" cy="${s.y}" r="9"  fill="${s.color}" opacity=".65"/>
    <circle cx="${s.x}" cy="${s.y}" r="9"  fill="none" stroke="${s.color}" stroke-width="1.8"/>
    <circle cx="${s.x}" cy="${s.y}" r="3"  fill="white" opacity=".8"/>
  </g>`).join('')}
  <text x="140" y="193" text-anchor="middle" font-size="8" fill="#5a6a8a" font-family="Mulish">Viewed from front · Tap dots to auscultate</text>
</svg>`;

// Track currently playing site sound
let activeSiteId=null;
function selectSite(id,el){
  STET_SITES.forEach(s=>document.getElementById('sp-'+s.id).classList.remove('on'));
  document.getElementById('sp-'+id).classList.add('on');
  activeSiteId=id;
  const s=STET_SITES.find(x=>x.id===id);
  // Build playable sound buttons for this site
  const soundBtns=s.sounds.map((sk,i)=>`
    <button class="site-sound-btn" id="ssb-${sk}" onclick="playSiteSound('${sk}',this)">
      <span class="site-sound-icon">▶</span> ${s.soundLabels[i]}
    </button>`).join('');
  document.getElementById('site-info-box').innerHTML=`
    <div class="sib-site" style="color:${s.color}">${s.label}</div>
    <div style="font-size:11px;color:var(--muted2);margin-bottom:8px">${s.desc}</div>
    <div class="sib-expect" style="margin-bottom:12px">${s.expect}</div>
    <div style="font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;font-weight:600">Listen at this site:</div>
    <div style="display:flex;flex-direction:column;gap:7px">${soundBtns}</div>`;
}

function playSiteSound(key,btn){
  const wasPlaying=btn.classList.contains('playing');
  // Stop all
  document.querySelectorAll('.site-sound-btn').forEach(b=>{b.classList.remove('playing');b.querySelector('.site-sound-icon').textContent='▶';});
  stopAllAudio();
  if(!wasPlaying){
    btn.classList.add('playing');
    btn.querySelector('.site-sound-icon').textContent='⏸';
    playRealisticSound(key,()=>{
      btn.classList.remove('playing');
      btn.querySelector('.site-sound-icon').textContent='▶';
    });
  }
}

// ═══════════════════ REALISTIC HEART SOUND ENGINE v2 ═══════════════════
// Uses Web Audio API with physiologically accurate timing:
// • Valve closure transients = filtered noise burst + body resonance oscillator
// • Murmurs = shaped noise through cascaded bandpass filters
// • S1 (40Hz thump), S2 (60Hz crisper), murmurs have correct frequency content
const AC=new (window.AudioContext||window.webkitAudioContext)();
let audioNodes=[];
let audioStopTimeout=null;

function stopAllAudio(){
  audioNodes.forEach(n=>{try{n.stop();}catch(e){}});
  audioNodes=[];
  if(audioStopTimeout) clearTimeout(audioStopTimeout);
  document.querySelectorAll('.play-btn.playing,.bplay-btn.playing,.site-sound-btn.playing').forEach(b=>{
    b.classList.remove('playing');
    const icon=b.querySelector('.site-sound-icon');
    if(icon) icon.textContent='▶'; else b.textContent='▶';
  });
}

// Master compressor — prevents clipping, adds warmth
let masterComp=null;
function getMaster(){
  if(!masterComp){
    masterComp=AC.createDynamicsCompressor();
    masterComp.threshold.value=-18;masterComp.knee.value=10;
    masterComp.ratio.value=4;masterComp.attack.value=0.003;masterComp.release.value=0.1;
    masterComp.connect(AC.destination);
  }
  return masterComp;
}

// Realistic valve thump: layered noise burst + body resonance sine
// freq: ~40Hz for AV valves (S1), ~60Hz for semilunar (S2)
// Higher freq content for ejection clicks (~150-200Hz)
function heartThump(t, freq, dur, amp, ctx, harmonic=false){
  const dest=getMaster();
  // Noise burst — models turbulent blood + tissue vibration
  const sr=ctx.sampleRate;
  const nb=Math.ceil(sr*dur*1.5);
  const buf=ctx.createBuffer(1,nb,sr);
  const d=buf.getChannelData(0);
  for(let i=0;i<nb;i++){
    // Exponentially decaying noise
    const env=Math.exp(-i/(nb*0.12));
    d[i]=(Math.random()*2-1)*env;
  }
  const src=ctx.createBufferSource(); src.buffer=buf;
  // Bandpass shaped around valve closure frequency
  const bp1=ctx.createBiquadFilter(); bp1.type='bandpass'; bp1.frequency.value=freq; bp1.Q.value=2.5;
  const bp2=ctx.createBiquadFilter(); bp2.type='bandpass'; bp2.frequency.value=freq*2.2; bp2.Q.value=1.8;
  const ng=ctx.createGain();
  ng.gain.setValueAtTime(0,t);
  ng.gain.linearRampToValueAtTime(amp*0.7,t+0.006);
  ng.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  src.connect(bp1); bp1.connect(ng);
  src.connect(bp2); bp2.connect(ng);
  ng.connect(dest);
  src.start(t); src.stop(t+dur+0.08);
  audioNodes.push(src);

  // Body resonance — low sine oscillator (chest wall vibration feel)
  const osc=ctx.createOscillator();
  osc.type='sine'; osc.frequency.value=freq*0.45;
  const og=ctx.createGain();
  og.gain.setValueAtTime(0,t);
  og.gain.linearRampToValueAtTime(amp*0.55,t+0.009);
  og.gain.exponentialRampToValueAtTime(0.0001,t+dur*0.75);
  osc.connect(og); og.connect(dest);
  osc.start(t); osc.stop(t+dur+0.05);
  audioNodes.push(osc);

  // Optional harmonic overtone (adds richness to S2)
  if(harmonic){
    const osc2=ctx.createOscillator();
    osc2.type='sine'; osc2.frequency.value=freq*1.8;
    const og2=ctx.createGain();
    og2.gain.setValueAtTime(0,t);
    og2.gain.linearRampToValueAtTime(amp*0.2,t+0.005);
    og2.gain.exponentialRampToValueAtTime(0.0001,t+dur*0.4);
    osc2.connect(og2); og2.connect(dest);
    osc2.start(t); osc2.stop(t+dur+0.04);
    audioNodes.push(osc2);
  }
}

// Murmur band — turbulent flow noise shaped by frequency profile
// Uses 3 cascaded bandpass filters for realistic spectral character
// gainProfile: [[timeFrac, gainVal], ...] — envelope over murmur duration
function murmurNoise(t0, t1, fLow, fMid, fHigh, gainProfile, ctx){
  const dur=t1-t0;
  const dest=getMaster();
  // White noise source
  const sr=ctx.sampleRate;
  const nb=Math.ceil(sr*(dur+0.1));
  const buf=ctx.createBuffer(1,nb,sr);
  const d=buf.getChannelData(0);
  // Shaped noise — not pure white, slight brownian tint
  let last=0;
  for(let i=0;i<nb;i++){
    const white=Math.random()*2-1;
    last=0.97*last+0.03*white; // slight low-pass for brownian tint
    d[i]=white*0.7+last*0.3;
  }
  const src=ctx.createBufferSource(); src.buffer=buf;
  // Three bandpass filters for turbulence spectral complexity
  const f1=ctx.createBiquadFilter(); f1.type='bandpass'; f1.frequency.value=fLow;  f1.Q.value=0.9;
  const f2=ctx.createBiquadFilter(); f2.type='bandpass'; f2.frequency.value=fMid;  f2.Q.value=1.2;
  const f3=ctx.createBiquadFilter(); f3.type='bandpass'; f3.frequency.value=fHigh; f3.Q.value=0.8;
  const mix=ctx.createGain(); mix.gain.value=1;
  src.connect(f1); f1.connect(mix);
  src.connect(f2); f2.connect(mix);
  src.connect(f3); f3.connect(mix);
  const g=ctx.createGain();
  g.gain.setValueAtTime(0,t0);
  gainProfile.forEach(([tf,gv])=>{
    if(tf===0) g.gain.setValueAtTime(gv,t0+0.001);
    else g.gain.linearRampToValueAtTime(gv,t0+tf*dur);
  });
  mix.connect(g); g.connect(dest);
  src.start(t0); src.stop(t1+0.08);
  audioNodes.push(src);
}

function playRealisticSound(type, onEnd){
  AC.resume();
  stopAllAudio();
  const now=AC.currentTime+0.15;
  const bpm=68;
  const cycle=60/bpm;   // ~0.88s per beat
  const sys=cycle*0.36; // systole 36%
  const dia=cycle-sys;  // diastole 64%
  const beats=6;
  const totalDur=cycle*beats+0.4;

  for(let b=0;b<beats;b++){
    const t=now+b*cycle;
    const s1=t;           // S1: start of systole (AV valve closure)
    const s2=t+sys;       // S2: end of systole (semilunar closure)
    const earlyDia=s2+0.11;  // early diastole (S3 position)
    const lateDia=t+cycle-0.12; // late diastole (S4 position, pre-S1)

    // Always render S1 and S2 for context unless overridden by murmur
    const needS1=(type!=='as'&&type!=='mr'&&type!=='tr'&&type!=='ps');// murmurs include their own
    const needS2=true;

    switch(type){
      case 'normal':
      case 's1':
        // S1: M1 then T1 (~20ms apart), low freq 35-45Hz
        heartThump(s1,      38, 0.09, 0.6, AC);
        heartThump(s1+0.02, 36, 0.07, 0.42, AC);
        // S2 for context
        heartThump(s2,      62, 0.07, 0.48, AC, true);
        heartThump(s2+0.03, 58, 0.06, 0.35, AC);
        break;
      case 's2':
        heartThump(s1, 38, 0.09, 0.5, AC);
        // S2: A2 then P2 (~30ms split on inspiration), higher freq
        heartThump(s2,      65, 0.07, 0.55, AC, true);
        heartThump(s2+0.03, 58, 0.065, 0.42, AC, true);
        break;
      case 's3':
        // S1-S2-S3 gallop: "lub-dub-ta" (Ken-tuck-y)
        heartThump(s1, 38, 0.09, 0.58, AC);
        heartThump(s2, 62, 0.07, 0.48, AC, true);
        // S3: low frequency, soft, early diastole
        heartThump(earlyDia, 28, 0.12, 0.32, AC);
        break;
      case 's4':
        // S4-S1-S2 gallop: "ta-lub-dub" (Ten-nes-see)
        heartThump(lateDia, 26, 0.11, 0.28, AC);
        heartThump(s1, 38, 0.09, 0.58, AC);
        heartThump(s2, 62, 0.07, 0.48, AC, true);
        break;
      case 'as':
        // S1 (may be soft in severe AS)
        heartThump(s1, 38, 0.09, 0.48, AC);
        // Ejection click ~40ms after S1
        heartThump(s1+0.04, 160, 0.03, 0.25, AC);
        // Crescendo-decrescendo murmur peaking in mid-systole (200-600Hz, harsh)
        murmurNoise(s1+0.05, s2-0.04, 180, 380, 600,
          [[0,0],[0.05,0.04],[0.3,0.13],[0.55,0.18],[0.7,0.12],[0.9,0.04],[1,0]], AC);
        // S2: A2 soft/absent in severe AS, P2 may be audible
        heartThump(s2, 55, 0.06, 0.3, AC, false); // soft A2
        heartThump(s2+0.04, 58, 0.055, 0.28, AC); // P2
        break;
      case 'mr':
        // S1 may be soft (obscured by murmur)
        heartThump(s1, 36, 0.08, 0.4, AC);
        // Pansystolic — constant amplitude from S1 to S2, high frequency blowing
        murmurNoise(s1+0.005, s2+0.01, 280, 450, 700,
          [[0,0],[0.01,0.13],[0.5,0.13],[0.98,0.13],[1,0]], AC);
        // S2 may be obscured
        heartThump(s2, 60, 0.07, 0.38, AC, true);
        // S3 common in significant MR
        heartThump(earlyDia, 28, 0.11, 0.22, AC);
        break;
      case 'ms':
        // Loud S1 (hallmark of MS)
        heartThump(s1, 42, 0.09, 0.72, AC);
        heartThump(s2, 62, 0.07, 0.48, AC, true);
        // Opening snap — high-pitched, ~80-100ms after S2
        heartThump(s2+0.09, 130, 0.035, 0.42, AC);
        // Mid-diastolic rumble — crescendos toward pre-systole (if in sinus rhythm)
        murmurNoise(s2+0.13, t+cycle-0.08, 60, 130, 220,
          [[0,0],[0.05,0.08],[0.35,0.06],[0.65,0.05],[0.85,0.1],[0.95,0.13],[1,0]], AC);
        break;
      case 'ar':
        heartThump(s1, 38, 0.09, 0.45, AC);
        // S2: A2 may be soft, followed immediately by murmur
        heartThump(s2, 64, 0.07, 0.52, AC, true);
        // Early diastolic decrescendo — blowing, high frequency
        murmurNoise(s2+0.02, s2+dia*0.62, 380, 580, 900,
          [[0,0],[0.02,0.14],[0.08,0.13],[0.35,0.1],[0.65,0.06],[0.85,0.03],[1,0]], AC);
        break;
      case 'tr':
        heartThump(s1, 38, 0.09, 0.5, AC);
        // Pansystolic — lower pitched than MR (200-500Hz)
        murmurNoise(s1+0.005, s2, 180, 300, 500,
          [[0,0],[0.01,0.1],[0.5,0.1],[0.98,0.1],[1,0]], AC);
        heartThump(s2, 60, 0.07, 0.42, AC, true);
        break;
      case 'ps':
        heartThump(s1, 38, 0.09, 0.5, AC);
        // Ejection click
        heartThump(s1+0.05, 145, 0.03, 0.22, AC);
        // Ejection systolic, peaks later than AS (rhomboid shape shifted rightward)
        murmurNoise(s1+0.06, s2-0.02, 160, 320, 500,
          [[0,0],[0.1,0.04],[0.45,0.1],[0.65,0.15],[0.82,0.1],[0.98,0.02],[1,0]], AC);
        // Wide S2 split: A2 normal, P2 delayed
        heartThump(s2,      62, 0.065, 0.45, AC, true);  // A2
        heartThump(s2+0.06, 56, 0.06,  0.38, AC);        // P2 delayed
        break;
    }
  }

  audioStopTimeout=setTimeout(()=>{
    stopAllAudio();
    if(onEnd) onEnd();
  }, totalDur*1000);
}

// ═══════════════════ HEART SOUNDS LIST ═══════════════════
const HEART_SOUNDS=[
  {key:'normal',name:'Normal S1 + S2',desc:'Lub-dub. S1 = mitral & tricuspid closure (start of systole). S2 = aortic & pulmonary closure (end of systole). Normal rate 60–100bpm.',badge:'Normal'},
  {key:'s1',name:'S1 Isolated — "Lub"',desc:'Closure of AV valves (mitral M1, tricuspid T1). Low-pitched thump. Loudest at apex. Split S1 heard at tricuspid area.',badge:'Normal'},
  {key:'s2',name:'S2 Isolated — "Dub"',desc:'Closure of semilunar valves (aortic A2, pulmonary P2). A2 precedes P2. A2 loudest at aortic area; P2 loudest at pulmonary area. Physiological split on inspiration.',badge:'Normal'},
  {key:'s3',name:'S3 — Ventricular Gallop',desc:'Early diastolic sound 0.12–0.18s after S2. Low-pitched, best with bell at apex. Normal in children/young adults/pregnancy. Adults: heart failure, MR, VSD.',badge:'Abnormal'},
  {key:'s4',name:'S4 — Atrial Gallop',desc:'Late diastolic presystolic sound. Low-pitched. Stiff, non-compliant ventricle. Hypertension, aortic stenosis, hypertrophic cardiomyopathy, post-MI. Never normal.',badge:'Abnormal'},
  {key:'as',name:'Aortic Stenosis',desc:'Ejection systolic crescendo-decrescendo murmur. Harsh quality. Best at aortic area (2nd right ICS). Radiates to carotids. Slow-rising pulse, narrow pulse pressure.',badge:'Murmur'},
  {key:'ar',name:'Aortic Regurgitation',desc:'Early diastolic decrescendo murmur. Blowing quality. Best at Erb\'s point with patient leaning forward, held expiration. Wide pulse pressure, collapsing pulse.',badge:'Murmur'},
  {key:'mr',name:'Mitral Regurgitation',desc:'Pansystolic (holosystolic) blowing murmur. Constant intensity S1 to S2. Best at apex. Radiates to left axilla. Associated with displaced apex beat, AF.',badge:'Murmur'},
  {key:'ms',name:'Mitral Stenosis',desc:'Mid-diastolic low-pitched rumbling murmur. Opening snap after S2. Best at apex in left lateral decubitus with bell. Causes: rheumatic fever. Loud S1, AF common.',badge:'Murmur'},
  {key:'tr',name:'Tricuspid Regurgitation',desc:'Pansystolic murmur lower left sternal edge. Increases on INSPIRATION (Carvallo\'s sign — distinguishes from MR). Elevated JVP, peripheral oedema.',badge:'Murmur'},
  {key:'ps',name:'Pulmonary Stenosis',desc:'Ejection systolic murmur, pulmonary area. Ejection click. Wide splitting of S2. Causes: congenital, rheumatic (rare), carcinoid. Right-sided heave.',badge:'Murmur'},
];

const sl=document.getElementById('sounds-list');
HEART_SOUNDS.forEach(s=>{
  const badgeCls=s.badge==='Normal'?'badge-ok':s.badge==='Abnormal'?'badge-warn':'badge-bad';
  sl.innerHTML+=`<div class="audio-player" id="ap-${s.key}">
    <button class="play-btn" onclick="playCardioSound('${s.key}',this)">▶</button>
    <div class="audio-info">
      <div class="audio-name">${s.name} <span class="badge ${badgeCls}" style="margin-left:6px;font-size:9px">${s.badge}</span></div>
      <div class="audio-desc">${s.desc}</div>
    </div>
    <div class="waveform"><div class="wb"></div><div class="wb"></div><div class="wb"></div><div class="wb"></div><div class="wb"></div><div class="wb"></div><div class="wb"></div></div>
  </div>`;
});

function playCardioSound(key,btn){
  const wasPlaying=btn.classList.contains('playing');
  document.querySelectorAll('.play-btn').forEach(b=>{b.classList.remove('playing');b.textContent='▶';b.closest('.audio-player')?.classList.remove('playing');});
  stopAllAudio();
  if(!wasPlaying){
    btn.classList.add('playing');btn.textContent='⏸';
    btn.closest('.audio-player').classList.add('playing');
    playRealisticSound(key,()=>{
      btn.classList.remove('playing');btn.textContent='▶';
      btn.closest('.audio-player')?.classList.remove('playing');
    });
  }
}

// ═══════════════════ MURMUR SITE EXPLORER ═══════════════════
const MURMUR_SITES=[
  {key:'as',  name:'Aortic Stenosis',
   siteLabel:'Best heard: Aortic area (2nd RIGHT ICS, right sternal edge)',
   siteDesc:'Crescendo-decrescendo ejection systolic murmur. Radiates to carotids. Use diaphragm. Lean patient forward to accentuate.',
   chestX:110, chestY:68, color:'#f4547a',
   timing:'Ejection systolic (S1 → S2)',
   quality:'Harsh, rasping',
   radiation:'Carotids — ask patient to hold breath and listen at neck',
   extra:'Slow-rising carotid pulse. Narrow pulse pressure. Loud murmur does NOT mean severe — quiet murmur with low flow = severe in heart failure.',
   mnemonic:'AS = A2 soft (aortic component of S2 diminished in severe AS)'},
  {key:'ar',  name:'Aortic Regurgitation',
   siteLabel:"Best heard: Erb's point (3rd LEFT ICS, left sternal edge)",
   siteDesc:'Early diastolic decrescendo blowing murmur. Patient leans FORWARD. Held end-expiration. Diaphragm.',
   chestX:163, chestY:88, color:'#a78bfa',
   timing:'Early diastolic decrescendo (S2 → mid-diastole)',
   quality:'Blowing, high-pitched',
   radiation:'Down left sternal edge. Austin Flint murmur at apex (functional MS from regurgitant jet).',
   extra:'Wide pulse pressure. Collapsing (water-hammer) pulse. Corrigan\'s pulse, de Musset\'s head nodding. Quincke\'s nail pulsation.',
   mnemonic:'AR = lean fARward'},
  {key:'mr',  name:'Mitral Regurgitation',
   siteLabel:'Best heard: Apex (5th LEFT ICS, midclavicular line)',
   siteDesc:'Pansystolic blowing murmur throughout entire systole. Diaphragm at apex. Radiation to left axilla.',
   chestX:178, chestY:122, color:'#00d4aa',
   timing:'Pansystolic (S1 through to S2, both may be obscured)',
   quality:'Blowing, high-pitched',
   radiation:'Left axilla — classic. Also to left scapula.',
   extra:'Displaced apex (volume overload → LV dilation). S3 common. Associated with AF. Mitral valve prolapse: late systolic murmur + mid-systolic click.',
   mnemonic:'MR → aXilla (X = axilla)'},
  {key:'ms',  name:'Mitral Stenosis',
   siteLabel:'Best heard: Apex in LEFT LATERAL DECUBITUS position',
   siteDesc:'Mid-diastolic low-pitched rumble. Use BELL of stethoscope. Position patient in left lateral decubitus — brings apex to chest wall.',
   chestX:178, chestY:122, color:'#4a9eff',
   timing:'Mid-diastole (after opening snap, may crescendo pre-systole)',
   quality:'Low-pitched rumble — like distant thunder',
   radiation:'Localised to apex — does NOT radiate',
   extra:'Opening snap follows S2 (shorter S2-OS gap = more severe). Loud S1. Tapping non-displaced apex. AF very common. Malar flush. Right heart failure signs in severe disease.',
   mnemonic:'MS = Muffled/rumble → use bell, left lateral, lean'},
  {key:'tr',  name:'Tricuspid Regurgitation',
   siteLabel:'Best heard: Lower LEFT sternal edge (4th–5th LEFT ICS)',
   siteDesc:"Pansystolic murmur. Increases with INSPIRATION (Carvallo's sign) — distinguishes from MR. Also listen with patient sitting up.",
   chestX:158, chestY:108, color:'#ffb347',
   timing:'Pansystolic',
   quality:'Soft, blowing — often quiet',
   radiation:'Little radiation',
   extra:"Carvallo's sign: murmur louder on inspiration (increased venous return to right heart). Causes: RV dilation (any cause of pulmonary hypertension), infective endocarditis (IVDU), rheumatic, carcinoid.",
   mnemonic:"TR = TRicuspid = insPiRaTion louder"},
  {key:'ps',  name:'Pulmonary Stenosis',
   siteLabel:'Best heard: Pulmonary area (2nd LEFT ICS, left sternal edge)',
   siteDesc:'Ejection systolic murmur with ejection click. Wide or fixed splitting of S2. Right-sided heave.',
   chestX:170, chestY:68, color:'#34d399',
   timing:'Ejection systolic (with ejection click before murmur)',
   quality:'Harsh ejection quality',
   radiation:'To left shoulder/neck (mild)',
   extra:'Ejection click (decreases with inspiration — opposite to other right-sided sounds). Wide splitting of S2. Causes: congenital (most common), carcinoid syndrome, rheumatic (rare).',
   mnemonic:'PS = Pulmonary = left side = P2 delayed → wide S2 split'},
];

// Build murmur site explorer
const murmurSiteList=document.getElementById('murmur-site-list');
murmurSiteList.innerHTML=`
  <div style="background:var(--surf2);border-radius:14px;padding:14px;margin-bottom:12px">
    <div id="murmur-chest-svg-wrap" style="text-align:center;margin-bottom:10px">
      ${buildMurmurChestSVG()}
    </div>
    <div id="murmur-site-info">
      <div style="font-size:12px;color:var(--muted2)">Select a murmur below to see and hear where it's best auscultated.</div>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;gap:8px" id="murmur-select-btns">
    ${MURMUR_SITES.map((m,i)=>`
      <div style="background:var(--surf);border:1px solid var(--border);border-radius:14px;padding:14px;cursor:pointer;transition:all .15s" 
           id="mscard-${i}" onclick="selectMurmurSite(${i})">
        <div style="display:flex;align-items:center;gap:12px">
          <button class="play-btn" style="background:${m.color};flex-shrink:0;width:40px;height:40px;font-size:16px" 
                  onclick="event.stopPropagation();playMurmurSiteSound('${m.key}',this,'${m.color}')">▶</button>
          <div style="flex:1">
            <div style="font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:${m.color}">${m.name}</div>
            <div style="font-size:11px;color:var(--muted2);margin-top:2px">${m.timing} · ${m.quality}</div>
          </div>
          <span style="font-size:16px;color:var(--muted)">›</span>
        </div>
        <div class="murmur-site-detail" id="msd-${i}" style="display:none;margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
          <div style="background:rgba(255,255,255,.04);border-radius:10px;padding:10px;margin-bottom:8px">
            <div style="font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">Auscultation Site</div>
            <div style="font-size:13px;font-weight:600;color:${m.color}">${m.siteLabel}</div>
            <div style="font-size:12px;color:var(--muted2);margin-top:4px">${m.siteDesc}</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px">
            <div style="background:var(--surf2);border-radius:8px;padding:9px">
              <div style="font-size:10px;color:var(--muted2);margin-bottom:2px">Radiation</div>
              <div style="font-size:12px">${m.radiation}</div>
            </div>
            <div style="background:var(--surf2);border-radius:8px;padding:9px">
              <div style="font-size:10px;color:var(--muted2);margin-bottom:2px">Mnemonic</div>
              <div style="font-size:12px;color:${m.color}">${m.mnemonic}</div>
            </div>
          </div>
          <div style="background:var(--surf2);border-radius:8px;padding:9px;font-size:12px;color:var(--muted2);line-height:1.5">${m.extra}</div>
        </div>
      </div>`).join('')}
  </div>`;

function buildMurmurChestSVG(highlightX,highlightY,highlightColor){
  return `<svg viewBox="0 0 200 130" width="180" xmlns="http://www.w3.org/2000/svg">
    <path d="M48,18 Q100,10 152,18 L158,118 Q100,128 42,118 Z" fill="#0f1623" stroke="#2a3a5a" stroke-width="1.2"/>
    <path d="M60,28 Q100,22 140,28" fill="none" stroke="#2a3a5a" stroke-width="1"/>
    <line x1="100" y1="28" x2="100" y2="112" stroke="#2a3a5a" stroke-width="1" stroke-dasharray="3,3"/>
    ${MURMUR_SITES.map(s=>`<circle cx="${(s.chestX-40)*200/240}" cy="${s.chestY*130/185}" r="7" fill="${s.color}" opacity=".6" stroke="${s.color}" stroke-width="1"/>`).join('')}
    ${highlightX?`<circle cx="${(highlightX-40)*200/240}" cy="${highlightY*130/185}" r="10" fill="none" stroke="${highlightColor}" stroke-width="2.5" opacity=".9"/>
    <circle cx="${(highlightX-40)*200/240}" cy="${highlightY*130/185}" r="10" fill="${highlightColor}" opacity=".2"/>`:'' }
    <text x="40" y="11" font-size="7" fill="#3a4a6a" font-family="Mulish">Pt's R →</text>
    <text x="140" y="11" font-size="7" fill="#3a4a6a" font-family="Mulish">← Pt's L</text>
  </svg>`;
}

let openMurmurSite=null;
function selectMurmurSite(i){
  if(openMurmurSite===i){
    document.getElementById('msd-'+i).style.display='none';
    document.getElementById('mscard-'+i).style.borderColor='';
    openMurmurSite=null;return;
  }
  if(openMurmurSite!==null){
    document.getElementById('msd-'+openMurmurSite).style.display='none';
    document.getElementById('mscard-'+openMurmurSite).style.borderColor='';
  }
  openMurmurSite=i;
  const m=MURMUR_SITES[i];
  document.getElementById('msd-'+i).style.display='block';
  document.getElementById('mscard-'+i).style.borderColor=m.color;
  // Update mini chest with highlight
  document.getElementById('murmur-chest-svg-wrap').innerHTML=buildMurmurChestSVG(m.chestX,m.chestY,m.color);
  document.getElementById('murmur-site-info').innerHTML=`<div style="font-size:12px;font-weight:600;color:${m.color}">${m.name} — ${m.siteLabel}</div>`;
}

function playMurmurSiteSound(key,btn,color){
  const wasPlaying=btn.classList.contains('playing');
  document.querySelectorAll('.play-btn').forEach(b=>{b.classList.remove('playing');b.textContent='▶';});
  stopAllAudio();
  if(!wasPlaying){
    btn.classList.add('playing');btn.textContent='⏸';
    playRealisticSound(key,()=>{btn.classList.remove('playing');btn.textContent='▶';});
  }
}

// ═══════════════════ MURMUR QUIZ (updated with realistic audio) ═══════════════════
const MURMUR_QUIZ=[
  {key:'as',name:'Aortic Stenosis',opts:['Aortic Stenosis','Mitral Regurgitation','Pulmonary Stenosis','HOCM'],ans:0,
   desc:'Ejection systolic murmur at 2nd right ICS. Radiates to carotids.',
   exp:'AS: crescendo-decrescendo ejection systolic murmur. Harsh quality. Loudest at aortic area, radiates to carotids. A2 may be soft/absent in severe AS. Slow-rising pulse.'},
  {key:'mr',name:'Mitral Regurgitation',opts:['Mitral Stenosis','Mitral Regurgitation','Aortic Regurgitation','Tricuspid Regurgitation'],ans:1,
   desc:'Pansystolic blowing murmur at apex, radiating to axilla.',
   exp:'MR: pansystolic constant-amplitude blowing murmur. Obscures both S1 and S2. Apex → axilla radiation. Displaced apex from LV dilation. AF common.'},
  {key:'ms',name:'Mitral Stenosis',opts:['Aortic Stenosis','Mitral Regurgitation','Mitral Stenosis','Aortic Regurgitation'],ans:2,
   desc:'Mid-diastolic low-pitched rumble with opening snap.',
   exp:'MS: mid-diastolic rumble after opening snap. Best with bell, apex, left lateral decubitus. Opening snap: shorter S2-OS gap = more severe. Loud S1. Rheumatic cause.'},
  {key:'ar',name:'Aortic Regurgitation',opts:['Aortic Stenosis','Mitral Stenosis','Pulmonary Regurgitation','Aortic Regurgitation'],ans:3,
   desc:"Early diastolic decrescendo blowing murmur at Erb's point.",
   exp:"AR: early diastolic decrescendo blowing murmur. Best at Erb's point (3rd left ICS) with patient leaning forward, held expiration. Wide pulse pressure, collapsing pulse."},
  {key:'tr',name:'Tricuspid Regurgitation',opts:['Mitral Regurgitation','Aortic Stenosis','Tricuspid Regurgitation','Pulmonary Stenosis'],ans:2,
   desc:"Pansystolic murmur lower left sternal edge, louder on inspiration.",
   exp:"TR: Carvallo's sign — murmur increases on inspiration (right heart preload increases). Lower pitched than MR. Causes: RV dilation, IE (IVDU), pulmonary HTN."},
  {key:'ps',name:'Pulmonary Stenosis',opts:['Aortic Stenosis','Mitral Regurgitation','Tricuspid Regurgitation','Pulmonary Stenosis'],ans:3,
   desc:'Ejection systolic murmur at 2nd left ICS with ejection click.',
   exp:'PS: ejection systolic murmur at pulmonary area with ejection click (decreases on inspiration). Wide splitting of S2 (delayed P2). Congenital most common.'},
];

let mqAnswers={};
const mql=document.getElementById('murmur-quiz-list');
MURMUR_QUIZ.forEach((m,i)=>{
  mql.innerHTML+=`<div class="mq-card" id="mqc-${i}">
    <div class="mq-audio-row">
      <button class="play-btn" style="background:var(--red)" onclick="playMurmurQuizSound('${m.key}',this)">▶</button>
      <div style="flex:1">
        <div style="font-size:12px;font-weight:600">Listen — what murmur is this?</div>
        <div style="font-size:11px;color:var(--muted2);margin-top:2px">${m.desc}</div>
      </div>
    </div>
    <div class="mq-opts">${m.opts.map((o,j)=>`<button class="mq-opt" onclick="answerMQ(${i},${j})" id="mqo-${i}-${j}">${o}</button>`).join('')}</div>
    <div class="mq-explain" id="mqe-${i}">${m.exp}</div>
  </div>`;
});
function playMurmurQuizSound(key,btn){
  const wasPlaying=btn.classList.contains('playing');
  document.querySelectorAll('.play-btn').forEach(b=>{b.classList.remove('playing');b.textContent='▶';});
  stopAllAudio();
  if(!wasPlaying){btn.classList.add('playing');btn.textContent='⏸';
    playRealisticSound(key,()=>{btn.classList.remove('playing');btn.textContent='▶';});}
}
function answerMQ(qi,oi){
  if(mqAnswers[qi]!==undefined) return;
  mqAnswers[qi]=oi;
  const m=MURMUR_QUIZ[qi];
  for(let j=0;j<m.opts.length;j++){
    const b=document.getElementById(`mqo-${qi}-${j}`);b.disabled=true;
    if(j===m.ans) b.classList.add(oi===j?'correct':'reveal');
    else if(j===oi) b.classList.add('wrong');
  }
  document.getElementById(`mqe-${qi}`).classList.add('on');
}

// ECG - expanded cardio tab library
const ECG_PATTERNS_CARDIO=[
  {name:'Normal Sinus Rhythm',badge:'Normal',color:'var(--green)',
   path:'M0,60 L20,60 L24,59 L26,52 L28,38 L30,22 L32,42 L34,64 L36,62 L40,61 L44,59 L46,68 L48,54 L50,60 L80,60 L84,59 L86,52 L88,38 L90,22 L92,42 L94,64 L96,62 L100,61 L104,59 L106,68 L108,54 L110,60 L140,60 L144,59 L146,52 L148,38 L150,22 L152,42 L154,64 L156,62 L160,61 L164,59 L166,68 L168,54 L170,60 L200,60',
   desc:'Rate 60–100bpm. Regular. P before every QRS. PR 120–200ms. QRS <120ms. Normal axis.',
   features:['Rate: 60–100bpm','Rhythm: Regular','P waves: Upright in II, inverted aVR','PR interval: 120–200ms','QRS: <120ms, normal axis']},
  {name:'Atrial Fibrillation',badge:'Arrhythmia',color:'var(--amber)',
   path:'M0,60 L4,58 L6,54 L9,62 L12,56 L15,60 L18,57 L21,61 L24,59 L26,52 L28,38 L30,22 L32,42 L34,64 L36,62 L42,59 L46,57 L50,61 L54,57 L58,59 L62,58 L64,52 L66,38 L68,22 L70,42 L72,64 L74,62 L80,59 L84,57 L88,61 L92,57 L96,60 L100,58 L104,52 L106,38 L108,22 L110,42 L112,64 L114,62 L120,59 L124,57 L128,61 L132,57 L136,60 L140,58 L145,56 L148,62 L155,59 L160,57 L165,61 L170,58 L175,60 L185,60 L190,58 L195,61 L200,60',
   desc:'Irregularly irregular rhythm. No P waves — fibrillatory baseline. Variable R-R intervals.',
   features:['Rate: Variable (often 110–160 uncontrolled)','Rhythm: IRREGULARLY IRREGULAR','P waves: ABSENT — fibrillatory baseline','PR: Not measurable','QRS: Usually narrow unless BBB/WPW']},
  {name:'Atrial Flutter',badge:'Arrhythmia',color:'var(--amber)',
   path:'M0,60 L8,45 L12,75 L16,45 L20,75 L24,45 L26,38 L28,22 L30,42 L32,65 L34,63 L38,60 L40,45 L44,75 L48,45 L52,75 L56,45 L58,38 L60,22 L62,42 L64,65 L66,63 L70,60 L72,45 L76,75 L80,45 L84,75 L88,45 L90,38 L92,22 L94,42 L96,65 L98,63 L102,60 L108,45 L112,75 L116,45 L120,75 L124,45 L128,38 L130,22 L132,42 L134,65 L136,63 L140,60 L146,45 L150,75 L154,45 L158,75 L162,45 L166,38 L168,22 L170,42 L172,65 L174,63 L178,60 L184,45 L188,75 L192,45 L196,75 L200,60',
   desc:'Sawtooth flutter waves at 300/min. Regular QRS — usually 2:1 or 4:1 block. Rate ~150 (2:1) or ~75 (4:1).',
   features:['Atrial rate: ~300bpm (sawtooth flutter waves)','Ventricular rate: 150bpm (2:1) or 75bpm (4:1)','Rhythm: Regular (unlike AF)','P waves: Sawtooth flutter waves — no isoelectric baseline','QRS: Narrow usually']},
  {name:'Ventricular Tachycardia',badge:'Emergency',color:'var(--red)',
   path:'M0,60 L5,60 L8,72 L12,80 L16,42 L20,35 L24,78 L28,82 L32,68 L36,60 L40,72 L44,80 L48,42 L52,35 L56,78 L60,82 L64,68 L68,60 L72,72 L76,80 L80,42 L84,35 L88,78 L92,82 L96,68 L100,60 L104,72 L108,80 L112,42 L116,35 L120,78 L124,82 L128,68 L132,60 L136,72 L140,80 L144,42 L148,35 L152,78 L156,82 L160,68 L164,60 L168,72 L172,80 L176,42 L180,35 L184,78 L188,82 L192,68 L196,60 L200,60',
   desc:'Wide complex (>120ms) regular tachycardia 150–200bpm. AV dissociation. Capture/fusion beats diagnostic.',
   features:['Rate: 150–200bpm','Rhythm: Regular','P waves: AV dissociation — P march through QRS','QRS: WIDE >120ms, bizarre morphology','Extreme axis deviation, concordance in chest leads']},
  {name:'Ventricular Fibrillation',badge:'Emergency',color:'var(--red)',
   path:'M0,60 L5,48 L8,72 L11,44 L14,76 L17,50 L20,70 L23,46 L26,74 L29,52 L32,68 L35,46 L38,72 L41,50 L44,66 L47,48 L50,70 L53,54 L56,64 L59,44 L62,72 L65,52 L68,62 L71,46 L74,70 L77,56 L80,60 L83,46 L86,70 L89,52 L92,66 L95,48 L98,68 L101,54 L104,60 L107,44 L110,72 L113,50 L116,64 L119,46 L122,70 L125,56 L128,58 L131,44 L134,72 L137,52 L140,62 L143,48 L146,68 L149,54 L152,60 L155,44 L158,72 L161,52 L164,64 L167,46 L170,70 L173,56 L176,58 L179,44 L182,72 L185,52 L188,62 L191,48 L194,68 L197,54 L200,60',
   desc:'Chaotic disorganised electrical activity. No discernible QRS. Cardiac arrest — shockable rhythm.',
   features:['Rate: Not measurable — cardiac arrest','Rhythm: Chaotic, no pattern','P waves: ABSENT','QRS: ABSENT — chaotic undulations','SHOCKABLE: Defibrillate immediately (200J biphasic)']},
  {name:'SVT (AVNRT)',badge:'Arrhythmia',color:'var(--blue)',
   path:'M0,60 L4,60 L6,59 L8,52 L10,40 L12,22 L14,42 L16,65 L18,63 L20,61 L22,59 L24,52 L26,40 L28,22 L30,42 L32,65 L34,63 L36,61 L38,59 L40,52 L42,40 L44,22 L46,42 L48,65 L50,63 L52,61 L54,59 L56,52 L58,40 L60,22 L62,42 L64,65 L66,63 L68,61 L70,59 L72,52 L74,40 L76,22 L78,42 L80,65 L82,63 L84,61 L86,59 L88,52 L90,40 L92,22 L94,42 L96,65 L98,63 L100,61 L105,59 L108,52 L110,40 L112,22 L114,42 L116,65 L118,63 L120,61 L125,59 L128,52 L130,40 L132,22 L134,42 L136,65 L138,63 L140,61 L145,59 L148,52 L150,40 L152,22 L154,42 L156,65 L158,63 L160,61 L165,59 L168,52 L170,40 L172,22 L174,42 L176,65 L178,63 L180,61 L185,59 L188,52 L190,40 L192,22 L194,42 L196,65 L198,63 L200,61',
   desc:'Regular narrow-complex tachycardia 150–220bpm. P waves retrograde (pseudo-R in V1 or pseudo-S in II).',
   features:['Rate: 150–220bpm','Rhythm: Regular','P waves: Retrograde/buried in QRS — short RP','QRS: NARROW <120ms','Pseudo-R\' in V1, pseudo-S in II/III/aVF']},
  {name:'WPW (Pre-excitation)',badge:'Warning',color:'var(--purple)',
   path:'M0,60 L14,60 L16,59 L18,56 L20,59 L22,56 L24,42 L26,26 L28,46 L30,64 L32,62 L36,61 L40,60 L54,60 L56,59 L58,56 L60,59 L62,56 L64,42 L66,26 L68,46 L70,64 L72,62 L76,61 L80,60 L94,60 L96,59 L98,56 L100,59 L102,56 L104,42 L106,26 L108,46 L110,64 L112,62 L116,61 L120,60 L134,60 L136,59 L138,56 L140,59 L142,56 L144,42 L146,26 L148,46 L150,64 L152,62 L156,61 L160,60 L174,60 L176,59 L178,56 L180,59 L182,56 L184,42 L186,26 L188,46 L190,64 L192,62 L196,61 L200,60',
   desc:'Short PR <120ms. Delta wave (slurred initial QRS upstroke). Widened QRS. Risk: AF→VF if AV nodal blockers given.',
   features:['PR: SHORT <120ms (bypass AV node)','Delta wave: Slurred upstroke of QRS','QRS: Wide due to pre-excitation','ST/T: Discordant secondary changes','DANGER: Never give adenosine/verapamil/digoxin if AF + WPW']},
  {name:'Brugada Type 1',badge:'Warning',color:'var(--purple)',
   path:'M0,60 L18,60 L20,59 L22,56 L24,50 L26,40 L28,22 L30,42 L32,65 L34,50 L36,44 L40,58 L44,62 L48,60 L66,60 L68,59 L70,56 L72,50 L74,40 L76,22 L78,42 L80,65 L82,50 L84,44 L88,58 L92,62 L96,60 L114,60 L116,59 L118,56 L120,50 L122,40 L124,22 L126,42 L128,65 L130,50 L132,44 L136,58 L140,62 L144,60 L162,60 L164,59 L166,56 L168,50 L170,40 L172,22 L174,42 L176,65 L178,50 L180,44 L184,58 L188,62 L192,60 L200,60',
   desc:'Coved ST elevation ≥2mm in V1–V2 with RBBB morphology. Diagnostic of Brugada. Unmasked by fever, Na-channel blockers.',
   features:['V1–V2: Coved ST elevation ≥2mm','RBBB-like morphology','Negative T wave in V1–V2','Unmasked by: fever, flecainide, cocaine, tricyclics','Risk: Sudden death — refer electrophysiology, consider ICD']},
  {name:'Long QT (QTc >500ms)',badge:'Warning',color:'var(--amber)',
   path:'M0,60 L14,60 L16,59 L18,57 L20,55 L22,50 L24,38 L26,22 L28,42 L30,65 L32,63 L34,61 L36,60 L40,60 L45,60 L50,58 L55,56 L60,54 L62,50 L64,44 L66,36 L68,40 L70,60 L84,60 L86,59 L88,57 L90,55 L92,50 L94,38 L96,22 L98,42 L100,65 L102,63 L104,61 L106,60 L110,60 L115,60 L120,58 L125,56 L130,54 L132,50 L134,44 L136,36 L138,40 L140,60 L154,60 L156,59 L158,57 L160,55 L162,50 L164,38 L166,22 L168,42 L170,65 L172,63 L174,61 L176,60 L180,60 L185,60 L190,58 L195,56 L200,54',
   desc:'QTc >440ms (male) or >460ms (female). Risk of Torsades de Pointes. Drug-induced or congenital.',
   features:['QTc: Markedly prolonged (>500ms = high risk)','T wave: Broad/notched/biphasic','U waves: May be prominent (especially LQT2)','Risk: Torsades de Pointes → VF','Causes: Drugs (antipsychotics, macrolides, amiodarone), hypokalaemia, congenital']},
  {name:'1st Degree AV Block',badge:'Conduction',color:'var(--muted2)',
   path:'M0,60 L10,60 L12,59 L14,56 L16,59 L18,60 L22,59 L24,52 L26,38 L28,22 L30,42 L32,65 L34,63 L38,61 L42,60 L54,60 L56,59 L58,56 L60,59 L62,60 L66,59 L68,52 L70,38 L72,22 L74,42 L76,65 L78,63 L82,61 L86,60 L98,60 L100,59 L102,56 L104,59 L106,60 L110,59 L112,52 L114,38 L116,22 L118,42 L120,65 L122,63 L126,61 L130,60 L142,60 L144,59 L146,56 L148,59 L150,60 L154,59 L156,52 L158,38 L160,22 L162,42 L164,65 L166,63 L170,61 L174,60 L186,60 L188,59 L190,56 L192,59 L194,60 L198,59 L200,60',
   desc:'PR interval >200ms. P before every QRS — just delayed. Often asymptomatic. Can progress.',
   features:['PR interval: >200ms (prolonged)','Rhythm: Regular, 1:1 P:QRS','Rate: Usually normal','P waves: Normal morphology','Cause: Vagal tone (athletes), drugs (beta-blockers, digoxin, CCBs), ischaemia']},
  {name:'2nd Degree (Mobitz I / Wenckebach)',badge:'Conduction',color:'var(--amber)',
   path:'M0,60 L8,60 L10,59 L12,56 L14,59 L18,59 L20,52 L22,38 L24,22 L26,42 L28,65 L30,63 L34,61 L38,60 L46,60 L48,59 L50,56 L52,60 L56,59 L60,52 L62,38 L64,22 L66,42 L68,65 L70,63 L74,61 L78,60 L88,60 L90,59 L92,56 L94,60 L98,59 L102,52 L104,38 L106,22 L108,42 L110,65 L112,63 L116,61 L120,60 L132,60 L134,59 L136,56 L138,60 L142,59 L146,52 L148,38 L150,22 L152,42 L154,65 L156,63 L160,61 L164,60 L176,60 L178,59 L180,56 L182,60 L186,59 L190,52 L192,38 L194,22 L196,42 L198,65 L200,63',
   desc:'Progressive PR lengthening then dropped QRS. Repeating cycle (3:2, 4:3 etc). AV nodal level — often benign.',
   features:['PR: Progressively lengthens','Then: P wave NOT followed by QRS (dropped beat)','Repeats in cycles (Wenckebach periods)','Level: AV node — usually benign','Cause: Inferior MI (RCA), vagal, drugs']},
  {name:'Complete Heart Block (3rd degree)',badge:'Emergency',color:'var(--red)',
   path:'M0,60 L5,59 L7,56 L9,60 L14,59 L16,56 L18,60 L22,59 L25,56 L27,60 L31,38 L33,22 L35,42 L37,65 L39,63 L43,61 L47,60 L52,59 L54,56 L56,60 L61,59 L63,56 L65,60 L69,59 L72,56 L74,60 L78,38 L80,22 L82,42 L84,65 L86,63 L90,61 L94,60 L99,59 L101,56 L103,60 L108,59 L110,56 L112,60 L116,59 L119,56 L121,60 L125,38 L127,22 L129,42 L131,65 L133,63 L137,61 L141,60 L146,59 L148,56 L150,60 L155,59 L157,56 L159,60 L163,59 L166,56 L168,60 L172,38 L174,22 L176,42 L178,65 L180,63 L184,61 L188,60 L193,59 L195,56 L197,60 L200,60',
   desc:'Complete AV dissociation. P waves and QRS completely independent. Slow escape rhythm 30–50bpm. EMERGENCY.',
   features:['P rate: 60–100 (normal atrial)','QRS rate: 30–50 (slow escape)','No relationship between P and QRS (march independently)','QRS: Wide (ventricular) or narrow (junctional)','EMERGENCY: Transcutaneous pacing, then transvenous']},
  {name:'Anterior STEMI (V1–V4)',badge:'Emergency',color:'var(--red)',
   path:'M0,60 L18,60 L20,59 L22,56 L24,52 L26,38 L28,22 L30,42 L32,66 L34,62 L36,50 L40,46 L44,46 L48,50 L52,56 L56,60 L74,60 L76,59 L78,56 L80,52 L82,38 L84,22 L86,42 L88,66 L90,62 L92,50 L96,46 L100,46 L104,50 L108,56 L112,60 L130,60 L132,59 L134,56 L136,52 L138,38 L140,22 L142,42 L144,66 L146,62 L148,50 L152,46 L156,46 L160,50 L164,56 L168,60 L186,60 L188,59 L190,56 L192,52 L194,38 L196,22 L198,42 L200,66',
   desc:'ST elevation V1–V4 with ST plateau. New Q waves. Reciprocal depression inferior leads. LAD territory.',
   features:['ST elevation: ≥2mm in V2-V3, ≥1mm in V1/V4','New Q waves: Pathological (>40ms, >25% R)','Reciprocal: ST depression in II, III, aVF','Territory: LAD — anterior wall, interventricular septum','Management: Primary PCI door-to-balloon <90 min']},
  {name:'LBBB',badge:'Conduction',color:'var(--purple)',
   path:'M0,60 L16,60 L18,59 L20,56 L22,52 L24,46 L26,40 L28,34 L30,40 L32,34 L34,40 L36,46 L38,52 L40,56 L42,60 L44,59 L46,56 L48,62 L50,70 L52,58 L54,60 L68,60 L70,59 L72,56 L74,52 L76,46 L78,40 L80,34 L82,40 L84,34 L86,40 L88,46 L90,52 L92,56 L94,60 L96,59 L98,56 L100,62 L102,70 L104,58 L106,60 L120,60 L122,59 L124,56 L126,52 L128,46 L130,40 L132,34 L134,40 L136,34 L138,40 L140,46 L142,52 L144,56 L146,60 L148,59 L150,56 L152,62 L154,70 L156,58 L158,60 L172,60 L174,59 L176,56 L178,52 L180,46 L182,40 L184,34 L186,40 L188,34 L190,40 L192,46 L194,52 L196,56 L198,60 L200,59',
   desc:'QRS ≥120ms. Broad notched R in I/aVL/V5-V6. Deep S in V1. Absence of septal Q waves in I/V5-V6.',
   features:['QRS: ≥120ms (broad)','V1: Deep broad S (rS pattern)','I/V5-V6: Broad notched R (no septal Q)','ST/T: Discordant (opposite to main QRS deflection)','NEW LBBB + symptoms = treat as STEMI equivalent']},
  {name:'RBBB',badge:'Conduction',color:'var(--muted2)',
   path:'M0,60 L16,60 L18,59 L20,56 L22,50 L24,40 L26,24 L28,44 L30,68 L32,64 L34,56 L36,62 L38,58 L40,60 L54,60 L56,59 L58,56 L60,50 L62,40 L64,24 L66,44 L68,68 L70,64 L72,56 L74,62 L76,58 L78,60 L92,60 L94,59 L96,56 L98,50 L100,40 L102,24 L104,44 L106,68 L108,64 L110,56 L112,62 L114,58 L116,60 L130,60 L132,59 L134,56 L136,50 L138,40 L140,24 L142,44 L144,68 L146,64 L148,56 L150,62 L152,58 L154,60 L168,60 L170,59 L172,56 L174,50 L176,40 L178,24 L180,44 L182,68 L184,64 L186,56 L188,62 L190,58 L192,60 L200,60',
   desc:'QRS ≥120ms. RSR\' (M-shaped) in V1. Wide slurred S in I/V5-V6. New RBBB + anterior ST = LAD occlusion.',
   features:['QRS: ≥120ms','V1: RSR\' pattern (rabbit ears / M-shaped)','I/V5-V6: Wide slurred S wave','T waves: Inverted V1-V3 (normal secondary change)','New RBBB: Consider LAD occlusion if chest pain']},
  {name:'Hyperkalaemia',badge:'Metabolic',color:'var(--teal)',
   path:'M0,60 L14,60 L16,59 L18,57 L20,55 L22,50 L24,38 L26,22 L28,42 L30,65 L32,63 L34,60 L36,42 L38,22 L40,22 L42,28 L44,60 L60,60 L62,59 L64,57 L66,55 L68,50 L70,38 L72,22 L74,42 L76,65 L78,63 L80,60 L82,42 L84,22 L86,22 L88,28 L90,60 L106,60 L108,59 L110,57 L112,55 L114,50 L116,38 L118,22 L120,42 L122,65 L124,63 L126,60 L128,42 L130,22 L132,22 L134,28 L136,60 L152,60 L154,59 L156,57 L158,55 L160,50 L162,38 L164,22 L166,42 L168,65 L170,63 L172,60 L174,42 L176,22 L178,22 L180,28 L182,60 L198,60 L200,59',
   desc:'Peaked (tented) T waves. Widened QRS. Flattened P. Sine wave pattern → VF. Check K⁺ urgently.',
   features:['K⁺ 5.5–6.5: Peaked (tented) symmetric T waves','K⁺ 6.5–7.0: P waves flatten/disappear','K⁺ >7.0: Wide QRS, sine wave pattern → VF','Treatment: IV calcium gluconate, insulin+dextrose, salbutamol, kayexalate, dialysis','URGENT: Risk of cardiac arrest']},
];

// Build ECG library (now with features list)
const ecgList=document.getElementById('ecg-list');
ECG_PATTERNS_CARDIO.forEach(e=>{
  const badgeCls=e.badge==='Normal'?'badge-ok':e.badge==='Emergency'?'badge-bad':e.badge==='Warning'?'badge-warn':e.badge==='Metabolic'?'badge-info':'';
  ecgList.innerHTML+=`<div class="ecg-strip" style="margin-bottom:12px;cursor:pointer" onclick="this.querySelector('.ecg-features').style.display=this.querySelector('.ecg-features').style.display==='none'?'block':'none'">
    <div class="ecg-grid"></div>
    <div style="position:relative;z-index:1;display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <div style="font-size:11px;color:${e.color};font-weight:700;letter-spacing:.3px">${e.name}</div>
      <span class="badge ${badgeCls}" style="font-size:9px">${e.badge}</span>
    </div>
    <svg viewBox="0 0 200 80" style="width:100%;height:55px;display:block;position:relative;z-index:1">
      <polyline points="${e.path.split(' ').map(pt=>{const[cmd,...coords]=pt.split(',');if(cmd==='M'||cmd==='L') return coords.join(','); const parts=pt.split(',');return parts[0]+','+parts[1];}).join(' ')}" fill="none" stroke="${e.color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <div style="font-size:11px;color:var(--muted2);margin-top:5px;position:relative;z-index:1">${e.desc}</div>
    <div class="ecg-features" style="display:none;margin-top:10px;padding-top:10px;border-top:1px solid var(--border);position:relative;z-index:1">
      ${e.features.map(f=>`<div style="font-size:11px;color:var(--muted2);padding:3px 0;border-bottom:1px solid var(--border)">• ${f}</div>`).join('')}
    </div>
    <div style="font-size:9px;color:var(--muted);margin-top:6px;position:relative;z-index:1">Tap to expand features ›</div>
  </div>`;
});

// ═══════════════════ ECG QUIZ (expanded) — inside cardio tab ═══════════════════
const ECG_CARDIO_QUIZ=[
  {rhythm:'Atrial Fibrillation',stem:'72F with palpitations and irregular pulse. ECG: no discernible P waves, fibrillatory baseline, irregular R-R intervals, HR 128bpm.',
   q:'What is the rhythm and what is the CHA₂DS₂-VA score if she has hypertension and diabetes?',
   opts:['AF. Score 2 — anticoagulate.','AF. Score 2 — aspirin only.','Atrial flutter 2:1. Score irrelevant — cardiovert immediately.','Multifocal atrial tachycardia — no anticoagulation needed.'],
   ans:0,exp:'Irregularly irregular + no P waves = AF. CHA₂DS₂-VA: H(HTN)=1 + D(DM)=1 = Score 2 → anticoagulate with DOAC. Rate control: beta-blocker (metoprolol) or rate-limiting CCB. Note: CHA₂DS₂-VA no longer includes female sex in some updated guidelines — always check current guidelines.'},
  {rhythm:'Inferior STEMI',stem:'58M crushing chest pain 2hrs. ECG: ST elevation 3mm II, III, aVF; ST depression in I and aVL.',
   q:'Territory, vessel, and one specific complication to check for?',
   opts:['Anterior STEMI — LAD. Check for LV aneurysm.','Inferior STEMI — RCA. Check for RV infarction (right-sided leads).','Lateral STEMI — LCx. Check for AF.','Posterior MI — LCx. Check for aortic regurgitation.'],
   ans:1,exp:'Inferior STEMI: elevation in II/III/aVF with reciprocal depression in I/aVL = RCA territory. RV infarction complicates ~30–50% of inferior STEMIs — record right-sided leads (V4R elevation). RV infarct: AVOID nitrates and diuretics (preload-dependent). Give IV fluids. Critical distinction.'},
  {rhythm:'Complete Heart Block',stem:'78M dizzy and collapsed. HR 38bpm. ECG: P rate 82bpm (regular), QRS rate 38bpm (regular), no consistent PR interval — P waves march through QRS independently.',
   q:'What is the rhythm and the immediate management?',
   opts:['2nd degree Mobitz II — observe and repeat ECG','Complete (3rd degree) AV block — transcutaneous pacing NOW, arrange transvenous pacing urgently','SVT with aberrancy — adenosine 6mg IV','Sinus bradycardia — atropine 600mcg IV only'],
   ans:1,exp:'Complete heart block: AV dissociation + P rate > QRS rate. P waves have no fixed relationship to QRS. EMERGENCY. Atropine 0.5–1mg IV (may be ineffective if infranodal block). Transcutaneous pacing immediately if haemodynamically unstable. Arrange transvenous pacing. Permanent pacemaker if no reversible cause. Causes: Inferior MI, Lyme disease, digoxin toxicity, structural disease.'},
  {rhythm:'VT vs SVT with BBB',stem:'45M haemodynamically stable. Wide-complex tachycardia 175bpm. Technician labels it "SVT with LBBB". You notice AV dissociation and extreme axis deviation.',
   q:'Which is more likely and why is this distinction critical?',
   opts:['SVT with BBB — adenosine 6mg is safe and diagnostic','VT — must NOT use adenosine/verapamil in VT (can cause haemodynamic collapse). Treat as VT: amiodarone 300mg IV.','AF with aberrancy — rate control with digoxin','Artefact — repeat ECG'],
   ans:1,exp:'Wide-complex tachycardia = VT until proven otherwise. AV dissociation + extreme axis = STRONGLY suggests VT. DANGER: Adenosine/verapamil in VT can cause profound hypotension and death. Amiodarone 300mg IV over 20–60 min if haemodynamically stable. If unstable: synchronised cardioversion. Brugada criteria, Vereckei criteria help differentiate — when in doubt, treat as VT.'},
  {rhythm:'WPW + AF',stem:'28M palpitations, dizzy. ECG: irregular wide-complex tachycardia 240bpm. Earlier ECG showed short PR + delta waves.',
   q:'This combination is life-threatening. Why, and what must you NOT give?',
   opts:['WPW + AF — gives very rapid ventricular rate via accessory pathway → VF risk. NEVER give AV nodal blockers (adenosine, verapamil, digoxin, beta-blockers). Treat: DC cardioversion or IV procainamide.','WPW + AF — adenosine 12mg IV is first line','SVT with LBBB — rate control with metoprolol','Artifact from patient movement — re-attach leads'],
   ans:0,exp:'WPW + AF is an emergency. The accessory pathway bypasses the AV node, allowing very rapid conduction (up to 300bpm) → may degenerate to VF. AV nodal blockers (adenosine, verapamil, digoxin, beta-blockers) are CONTRAINDICATED — they block the AV node but allow preferential conduction down the accessory pathway, accelerating ventricular rate. Treatment: DC cardioversion (unstable) or IV procainamide/flecainide (stable). Definitive: accessory pathway ablation.'},
  {rhythm:'Brugada Pattern',stem:'32M found unresponsive at home. Resuscitated from VF. ECG in ICU: coved ST elevation V1-V2, RBBB morphology, patient febrile 39°C.',
   q:'What is the diagnosis, what triggered it, and what device does he need?',
   opts:['Brugada syndrome unmasked by fever. ICD implantation — fever triggers VF in Brugada. Treat fever aggressively with paracetamol.','Anterior STEMI — primary PCI','Myocarditis — IV steroids','RBBB — no action needed'],
   ans:0,exp:'Brugada syndrome: fever is a classic trigger (sodium channel dysfunction worsens with temperature). Type 1 pattern: coved ST ≥2mm + RBBB-like in V1-V3. Prior cardiac arrest = HIGH RISK → ICD. Other triggers: sodium channel blockers (flecainide, procainamide), cocaine, large carbohydrate meals, vagal tone. Screen first-degree relatives. Quinidine may be used as adjunct to ICD. Treat any fever immediately in Brugada patients.'},
  {rhythm:'Hyperkalaemia',stem:'68M with oliguric AKI, K⁺ 7.2mmol/L. ECG shows peaked T waves, widened QRS, flattened P waves.',
   q:'Order the management steps correctly.',
   opts:['Kayexalate first → then restrict dietary potassium → dialysis if needed','IV calcium gluconate 10mL 10% → insulin 10u + 50mL 50% dextrose → nebulised salbutamol → calcium resonium/dialysis for elimination','Urgent dialysis is the only safe option — no other treatments are effective','Furosemide IV → repeat K⁺ → observe'],
   ans:1,exp:'Hyperkalaemia management in order: (1) IV calcium gluconate — cardioprotective, stabilises myocyte membrane (does NOT lower K⁺). (2) Insulin + dextrose — shifts K⁺ intracellularly (most reliable acute treatment). (3) Salbutamol nebulisation — also shifts K⁺ intracellularly. (4) Elimination: calcium resonium/patiromer (binds in gut), IV furosemide (if renal function adequate), dialysis (severe or anuric). Bicarbonate less effective unless acidosis present.'},
  {rhythm:'Long QT + Torsades',stem:'54F on antipsychotics and azithromycin. Collapses. ECG shows polymorphic VT with twisting QRS axis around baseline, QTc was 560ms on admission ECG.',
   q:'Diagnosis and acute treatment?',
   opts:['Monomorphic VT — amiodarone 300mg IV','Torsades de Pointes — IV magnesium sulphate 2g over 5–10 min. Stop all QT-prolonging drugs. Correct K⁺ and Mg²⁺.','AF with WPW — DC cardioversion','VF — unsynchronised defibrillation only'],
   ans:1,exp:'Torsades de Pointes: polymorphic VT with characteristic twisting of QRS around isoelectric line. Occurs on background of prolonged QT. Drug-induced LQTS: antipsychotics (haloperidol, quetiapine), macrolides (azithromycin), fluoroquinolones, methadone, amiodarone. Acute treatment: IV Mg sulphate 2g IV (first-line even if Mg²⁺ normal). Stop all QT drugs. Correct hypokalaemia (target K⁺ >4.5). Overdrive pacing if recurrent. Avoid amiodarone (worsens QT).'},
];

// Build ECG quiz in cardio tab
let ecgCardioQA={};
const ecgCardioQuizEl=document.getElementById('ecg-cardio-quiz');
if(ecgCardioQuizEl){
  ecgCardioQuizEl.innerHTML=ECG_CARDIO_QUIZ.map((q,i)=>`
    <div style="background:var(--surf);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:10px">
      <div style="font-size:10px;color:var(--red);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">ECG: ${q.rhythm}</div>
      <div style="font-size:13px;font-weight:600;margin-bottom:10px;line-height:1.5">${q.stem}</div>
      <div style="font-size:13px;margin-bottom:12px;color:var(--muted2)">${q.q}</div>
      ${q.opts.map((o,j)=>`<button class="ecgt-quiz-opt" style="margin-bottom:6px" onclick="answerCardioECG(${i},${j})" id="cecgo-${i}-${j}">${o}</button>`).join('')}
      <div style="display:none;margin-top:8px;padding:10px;background:rgba(0,0,0,.3);border-radius:9px;font-size:12px;color:var(--muted2);line-height:1.55" id="cecge-${i}">${q.exp}</div>
    </div>`).join('')+
    `<div id="cecg-score" style="display:none;text-align:center;padding:20px">
      <div style="font-family:'Syne',sans-serif;font-size:52px;font-weight:800;color:var(--green)" id="cecgs-val">0/0</div>
      <div style="color:var(--muted2);margin-top:6px">ECG scenarios correct</div>
      <button class="btn btn-teal" style="margin-top:16px;width:auto;padding:12px 28px" onclick="resetCardioECG()">↺ Retake</button>
    </div>`;
}

function answerCardioECG(qi,oi){
  if(ecgCardioQA[qi]!==undefined) return;
  ecgCardioQA[qi]=oi;
  const q=ECG_CARDIO_QUIZ[qi];
  for(let j=0;j<q.opts.length;j++){
    const b=document.getElementById(`cecgo-${qi}-${j}`);if(!b)continue;
    b.disabled=true;
    if(j===q.ans) b.classList.add(+oi===j?'correct':'reveal');
    else if(j===+oi) b.classList.add('wrong');
  }
  document.getElementById(`cecge-${qi}`).style.display='block';
  if(Object.keys(ecgCardioQA).length===ECG_CARDIO_QUIZ.length){
    const sc=Object.entries(ecgCardioQA).filter(([i,v])=>ECG_CARDIO_QUIZ[i].ans===+v).length;
    const sp=document.getElementById('cecg-score');
    if(sp){sp.style.display='block';document.getElementById('cecgs-val').textContent=`${sc}/${ECG_CARDIO_QUIZ.length}`;sp.scrollIntoView({behavior:'smooth',block:'nearest'});}
  }
}
function resetCardioECG(){
  ecgCardioQA={};
  const el=document.getElementById('ecg-cardio-quiz');
  if(el) el.innerHTML='';
  // Rebuild
  if(el){
    el.innerHTML=ECG_CARDIO_QUIZ.map((q,i)=>`
      <div style="background:var(--surf);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:10px">
        <div style="font-size:10px;color:var(--red);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">ECG: ${q.rhythm}</div>
        <div style="font-size:13px;font-weight:600;margin-bottom:10px;line-height:1.5">${q.stem}</div>
        <div style="font-size:13px;margin-bottom:12px;color:var(--muted2)">${q.q}</div>
        ${q.opts.map((o,j)=>`<button class="ecgt-quiz-opt" style="margin-bottom:6px" onclick="answerCardioECG(${i},${j})" id="cecgo-${i}-${j}">${o}</button>`).join('')}
        <div style="display:none;margin-top:8px;padding:10px;background:rgba(0,0,0,.3);border-radius:9px;font-size:12px;color:var(--muted2);line-height:1.55" id="cecge-${i}">${q.exp}</div>
      </div>`).join('')+
      `<div id="cecg-score" style="display:none;text-align:center;padding:20px"><div style="font-family:'Syne',sans-serif;font-size:52px;font-weight:800;color:var(--green)" id="cecgs-val">0/0</div><div style="color:var(--muted2);margin-top:6px">ECG scenarios correct</div><button class="btn btn-teal" style="margin-top:16px;width:auto;padding:12px 28px" onclick="resetCardioECG()">↺ Retake</button></div>`;
  }
}

// ═══════════════════ RESPIRATORY — LUNG MAP ═══════════════════
const LUNG_SITES=[
  {id:'ru',x:105,y:65,label:'Right Upper Zone',color:'#a78bfa',
   expect:'Bronchial breathing at right upper zone = consolidation or cavity. Reduced AE = effusion or collapse. Hyperresonant = pneumothorax.',
   path:'Normal: vesicular breath sounds, resonant percussion'},
  {id:'lu',x:155,y:65,label:'Left Upper Zone',color:'#a78bfa',
   expect:'Dull percussion + bronchial breathing = consolidation. Stony dull = pleural effusion. Wheeze = airways obstruction. Crackles = pulmonary oedema.',
   path:'Normal: vesicular breath sounds, resonant percussion'},
  {id:'rm',x:98,y:98,label:'Right Middle Zone',color:'#4a9eff',
   expect:'Right middle zone: RML collapse can cause dullness without bronchial breathing. Fine crackles here in early pulmonary oedema.',
   path:'Normal: vesicular, resonant'},
  {id:'lm',x:162,y:98,label:'Left Middle Zone',color:'#4a9eff',
   expect:'Left middle zone: lingular consolidation presents here. Pleural rub (leather on leather) = pleuritis. Coarse crackles = COPD/bronchiectasis.',
   path:'Normal: vesicular, resonant'},
  {id:'rl',x:102,y:132,label:'Right Lower Zone',color:'#34d399',
   expect:'Stony dull + absent breath sounds = pleural effusion. Bronchial breathing just above effusion (fluid pushes lung up). Bibasal crackles = pulmonary oedema.',
   path:'Normal: vesicular, resonant'},
  {id:'ll',x:158,y:132,label:'Left Lower Zone',color:'#34d399',
   expect:'Stony dull + absent breath sounds = pleural effusion. Fine inspiratory crackles = fibrosis or oedema. Pleural rub. Reduced expansion in effusion/collapse.',
   path:'Normal: vesicular, resonant'},
];

const lungWrap=document.getElementById('lung-wrap');
lungWrap.innerHTML=`<svg viewBox="0 0 260 185" xmlns="http://www.w3.org/2000/svg">
  <defs><radialGradient id="lg" cx="50%" cy="30%"><stop offset="0%" stop-color="#1d2840"/><stop offset="100%" stop-color="#0f1623"/></radialGradient></defs>
  <!-- Body -->
  <path d="M72,18 Q130,8 188,18 L196,170 Q130,184 64,170 Z" fill="url(#lg)" stroke="#2a3a5a" stroke-width="1.5"/>
  <!-- Spine/sternum -->
  <line x1="130" y1="20" x2="130" y2="168" stroke="#2a3a5a" stroke-width="1.5" stroke-dasharray="3,3"/>
  <!-- Right lung -->
  <path d="M127,35 Q105,40 90,58 Q78,75 77,110 Q76,135 88,148 Q102,158 122,155 Q128,100 127,35Z" fill="rgba(167,139,250,.06)" stroke="rgba(167,139,250,.25)" stroke-width="1.5"/>
  <!-- Left lung -->
  <path d="M133,35 Q155,40 170,58 Q182,75 183,110 Q184,130 172,148 Q158,158 138,155 Q132,100 133,35Z" fill="rgba(167,139,250,.06)" stroke="rgba(167,139,250,.25)" stroke-width="1.5"/>
  <!-- Trachea -->
  <line x1="130" y1="18" x2="130" y2="38" stroke="#5a6a8a" stroke-width="2.5"/>
  <path d="M130,38 Q118,42 115,52" fill="none" stroke="#5a6a8a" stroke-width="2"/>
  <path d="M130,38 Q142,42 145,52" fill="none" stroke="#5a6a8a" stroke-width="2"/>
  <!-- Zone dividers -->
  <line x1="80" y1="82" x2="128" y2="82" stroke="#2a3a5a" stroke-width="1" stroke-dasharray="2,2"/>
  <line x1="132" y1="82" x2="182" y2="82" stroke="#2a3a5a" stroke-width="1" stroke-dasharray="2,2"/>
  <line x1="78" y1="116" x2="128" y2="116" stroke="#2a3a5a" stroke-width="1" stroke-dasharray="2,2"/>
  <line x1="132" y1="116" x2="184" y2="116" stroke="#2a3a5a" stroke-width="1" stroke-dasharray="2,2"/>
  <!-- Auscultation points -->
  ${LUNG_SITES.map(s=>`
  <g class="lung-point" id="lp-${s.id}" onclick="selectLungSite('${s.id}')">
    <circle cx="${s.x}" cy="${s.y}" r="11" fill="${s.color}" opacity=".18"/>
    <circle cx="${s.x}" cy="${s.y}" r="6" fill="${s.color}" opacity=".7"/>
    <circle cx="${s.x}" cy="${s.y}" r="6" fill="none" stroke="${s.color}" stroke-width="1.5"/>
  </g>`).join('')}
  <text x="130" y="178" text-anchor="middle" font-size="8" fill="#5a6a8a">Tap zones to explore auscultation findings</text>
</svg>`;

function selectLungSite(id){
  LUNG_SITES.forEach(s=>document.getElementById('lp-'+s.id).classList.remove('on'));
  document.getElementById('lp-'+id).classList.add('on');
  const s=LUNG_SITES.find(x=>x.id===id);
  document.getElementById('lung-info-box').innerHTML=`
    <div class="rib-site" style="color:${s.color}">${s.label}</div>
    <div style="font-size:11px;color:var(--muted2);margin-bottom:8px">${s.path}</div>
    <div class="rib-expect">${s.expect}</div>`;
}

// ═══════════════════ BREATH SOUNDS ═══════════════════
const BREATH_SOUNDS=[
  {key:'vesicular',name:'Vesicular (Normal)',badge:'Normal',badgeCls:'badge-ok',
   desc:'Soft, low-pitched. Inspiratory > expiratory. Heard over most peripheral lung. No gap between I and E. Like a gentle breeze.',
   clinical:'Expected over all peripheral lung fields. Reduced = effusion/collapse/obesity/COPD. Absent unilaterally = pneumothorax or massive effusion.',
   phase:'I > E',quality:'Soft, gentle, breezy'},
  {key:'bronchial',name:'Bronchial Breathing',badge:'Abnormal',badgeCls:'badge-warn',
   desc:'Loud, high-pitched, hollow/tubular. Expiration = inspiration in duration. PAUSE between I and E. Normal only over trachea.',
   clinical:'Abnormal over lung = consolidation (pneumonia), collapse with patent airway, compressed lung above effusion. Cavitating TB.',
   phase:'I = E with gap',quality:'Loud, hollow, tubular'},
  {key:'crackles_fine',name:'Fine Crackles (Late Inspiratory)',badge:'Abnormal',badgeCls:'badge-warn',
   desc:'High-pitched, short, late-inspiratory. Like rubbing hair near ear. Alveoli snapping open. Does NOT clear with coughing.',
   clinical:'Pulmonary fibrosis (bibasal, persistent — "velcro crackles"), early pulmonary oedema (bibasal), pneumonia.',
   phase:'Late inspiratory',quality:'Fine, high-pitched, velcro-like'},
  {key:'crackles_coarse',name:'Coarse Crackles (Early Inspiratory)',badge:'Abnormal',badgeCls:'badge-warn',
   desc:'Low-pitched, bubbly, early-inspiratory. Larger airways and secretions. MAY clear with coughing.',
   clinical:'COPD exacerbation, bronchiectasis (moist/bubbly), pulmonary oedema (severe), lung abscess. Clearing with cough = secretions.',
   phase:'Early inspiratory',quality:'Coarse, bubbly, gurgling'},
  {key:'wheeze_exp',name:'Expiratory Wheeze',badge:'Abnormal',badgeCls:'badge-warn',
   desc:'Continuous musical, high-pitched expiratory sound. Polyphonic = diffuse obstruction. Monophonic = single bronchus.',
   clinical:'Asthma (polyphonic expiratory), COPD, anaphylaxis. Silent chest = very little airflow = DANGER. Localised = foreign body/tumour.',
   phase:'Expiratory',quality:'Musical, continuous, high-pitched'},
  {key:'wheeze_insp',name:'Biphasic Wheeze',badge:'Abnormal',badgeCls:'badge-warn',
   desc:'Wheeze in both inspiration and expiration — more severe airflow obstruction. Severe asthma or COPD.',
   clinical:'More severe than expiratory wheeze alone. Indicates critical airflow limitation. Combined with reduced air entry = life-threatening.',
   phase:'Inspiratory + Expiratory',quality:'Musical, biphasic'},
  {key:'stridor',name:'Stridor',badge:'Emergency',badgeCls:'badge-bad',
   desc:'Harsh, monophonic, HIGH-PITCHED. Predominantly INSPIRATORY. Upper airway obstruction. EMERGENCY in new-onset adults.',
   clinical:'Croup, epiglottitis, foreign body, anaphylaxis, tracheal tumour, post-extubation laryngeal oedema. Call for help immediately.',
   phase:'Inspiratory (mainly)',quality:'Harsh, loud, high-pitched, monophonic'},
  {key:'pleural_rub',name:'Pleural Rub',badge:'Abnormal',badgeCls:'badge-warn',
   desc:'Creaking, scratching — leather rubbing leather. Heard in BOTH inspiration and expiration. Does NOT change with cough.',
   clinical:'Pleuritis, PE, pneumonia adjacent to pleura. DISAPPEARS when effusion develops (fluid separates inflamed surfaces).',
   phase:'Inspiratory + Expiratory',quality:'Creaking, scratching, leathery'},
  {key:'reduced',name:'Reduced / Absent Breath Sounds',badge:'Sign',badgeCls:'badge-info',
   desc:'Quiet or silent lung zone. Compare sides carefully. Always investigate unilateral reduction.',
   clinical:'Pleural effusion (stony dull + reduced), pneumothorax (hyperresonant + reduced), lung collapse, severe COPD, pneumonectomy.',
   phase:'All phases reduced',quality:'Quiet or absent'},
  {key:'crepitations_pleural',name:'Pleural vs Pericardial Rub',badge:'Sign',badgeCls:'badge-info',
   desc:'Pleural rub disappears when breath is held. Pericardial rub PERSISTS — synchronous with heartbeat, not respiration.',
   clinical:'Key test: ask patient to hold breath. Disappears = pleural. Persists = pericardial (pericarditis). Important clinical distinction.',
   phase:'Varies',quality:'Breath-holding test distinguishes'},
];

function makeBreathSound(type){
  AC.resume();
  stopAllAudio();
  const now=AC.currentTime+0.1;
  const breathCycle=2.0;
  const nBreaths=3;

  function noiseBuffer(dur){
    const buf=AC.createBuffer(1,Math.ceil(AC.sampleRate*dur),AC.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
    return buf;
  }
  function breathNoise(startT,dur,freqLo,freqHi,gainEnv){
    const src=AC.createBufferSource();
    src.buffer=noiseBuffer(dur+0.1);
    const hp=AC.createBiquadFilter();hp.type='highpass';hp.frequency.value=freqLo;hp.Q.value=0.7;
    const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=freqHi;lp.Q.value=0.7;
    const g=AC.createGain();
    gainEnv.forEach(([tf,gv])=>g.gain.setValueAtTime(gv,startT+tf*dur));
    src.connect(hp);hp.connect(lp);lp.connect(g);g.connect(AC.destination);
    src.start(startT);src.stop(startT+dur+0.1);
    audioNodes.push(src);
  }
  function crackle(t,freq,dur,gain){
    const src=AC.createBufferSource();src.buffer=noiseBuffer(dur);
    const bp=AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=freq;bp.Q.value=2.5;
    const g=AC.createGain();
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(gain,t+0.003);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    src.connect(bp);bp.connect(g);g.connect(AC.destination);
    src.start(t);src.stop(t+dur+0.05);
    audioNodes.push(src);
  }

  for(let b=0;b<nBreaths;b++){
    const bt=now+b*breathCycle;
    const insp=1.1,exp=0.7;
    if(type==='vesicular'){
      breathNoise(bt,insp,80,400,[[0,0],[0.05,0.055],[0.4,0.06],[0.7,0.04],[0.9,0.02],[1,0]]);
      breathNoise(bt+insp,exp*0.4,80,300,[[0,0],[0.1,0.02],[0.6,0.01],[1,0]]);
    } else if(type==='bronchial'){
      breathNoise(bt,insp,200,1200,[[0,0],[0.05,0.14],[0.5,0.14],[0.85,0.1],[1,0]]);
      breathNoise(bt+insp+0.18,exp*0.95,250,1400,[[0,0],[0.05,0.15],[0.5,0.15],[0.9,0.1],[1,0]]);
    } else if(type==='crackles_fine'){
      breathNoise(bt,insp,80,350,[[0,0],[0.05,0.03],[0.5,0.035],[0.85,0.02],[1,0]]);
      for(let i=0;i<14;i++) crackle(bt+insp*0.55+i*0.045+Math.random()*0.06, 800+Math.random()*600, 0.012, 0.18+Math.random()*0.1);
    } else if(type==='crackles_coarse'){
      breathNoise(bt,insp,60,300,[[0,0],[0.05,0.04],[0.5,0.035],[0.85,0.02],[1,0]]);
      for(let i=0;i<8;i++) crackle(bt+i*0.1+Math.random()*0.05, 150+Math.random()*120, 0.055, 0.22+Math.random()*0.08);
      for(let i=0;i<4;i++) crackle(bt+insp+i*0.12+Math.random()*0.04, 130+Math.random()*80, 0.05, 0.16);
    } else if(type==='wheeze_exp'){
      breathNoise(bt,insp,80,400,[[0,0],[0.05,0.05],[0.5,0.055],[0.85,0.03],[1,0]]);
      [340,420,510,600].forEach((freq,fi)=>{
        const osc=AC.createOscillator();osc.type='sawtooth';osc.frequency.value=freq;
        const g=AC.createGain();
        g.gain.setValueAtTime(0,bt+insp);g.gain.linearRampToValueAtTime(0.04+fi*0.005,bt+insp+0.06);
        g.gain.setValueAtTime(0.04+fi*0.005,bt+insp+exp-0.1);g.gain.linearRampToValueAtTime(0,bt+insp+exp);
        osc.connect(g);g.connect(AC.destination);osc.start(bt+insp);osc.stop(bt+insp+exp+0.05);audioNodes.push(osc);
      });
    } else if(type==='wheeze_insp'){
      [350,460,550].forEach(freq=>{
        const osc=AC.createOscillator();osc.type='sawtooth';osc.frequency.value=freq;
        const g=AC.createGain();g.gain.setValueAtTime(0,bt);g.gain.linearRampToValueAtTime(0.045,bt+0.08);g.gain.setValueAtTime(0.045,bt+insp-0.1);g.gain.linearRampToValueAtTime(0,bt+insp);
        osc.connect(g);g.connect(AC.destination);osc.start(bt);osc.stop(bt+insp+0.05);audioNodes.push(osc);
      });
      [320,430].forEach(freq=>{
        const osc=AC.createOscillator();osc.type='sawtooth';osc.frequency.value=freq;
        const g=AC.createGain();g.gain.setValueAtTime(0,bt+insp);g.gain.linearRampToValueAtTime(0.04,bt+insp+0.07);g.gain.setValueAtTime(0.04,bt+insp+exp-0.1);g.gain.linearRampToValueAtTime(0,bt+insp+exp);
        osc.connect(g);g.connect(AC.destination);osc.start(bt+insp);osc.stop(bt+insp+exp+0.05);audioNodes.push(osc);
      });
    } else if(type==='stridor'){
      const osc=AC.createOscillator();osc.type='sawtooth';
      osc.frequency.setValueAtTime(520,bt);osc.frequency.linearRampToValueAtTime(480,bt+insp);
      const dist=AC.createWaveShaper();
      const curve=new Float32Array(256);for(let i=0;i<256;i++){const x=i*2/255-1;curve[i]=x*(1+0.3*Math.abs(x));}dist.curve=curve;
      const g=AC.createGain();g.gain.setValueAtTime(0,bt);g.gain.linearRampToValueAtTime(0.18,bt+0.05);g.gain.setValueAtTime(0.18,bt+insp-0.1);g.gain.linearRampToValueAtTime(0,bt+insp);
      osc.connect(dist);dist.connect(g);g.connect(AC.destination);osc.start(bt);osc.stop(bt+insp+0.05);audioNodes.push(osc);
      breathNoise(bt+insp,exp*0.4,100,400,[[0,0],[0.1,0.025],[0.8,0.015],[1,0]]);
    } else if(type==='pleural_rub'){
      [0,insp+0.15].forEach(ph=>{
        const pdur=ph===0?insp:exp;
        for(let i=0;i<Math.round(pdur/0.12);i++){
          const t=bt+ph+i*0.12+Math.random()*0.04;
          const src=AC.createBufferSource();src.buffer=noiseBuffer(0.09);
          const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=300+Math.random()*150;
          const g=AC.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.07,t+0.02);g.gain.linearRampToValueAtTime(0,t+0.08);
          src.connect(lp);lp.connect(g);g.connect(AC.destination);src.start(t);src.stop(t+0.1);audioNodes.push(src);
        }
      });
    } else if(type==='reduced'){
      breathNoise(bt,insp,80,350,[[0,0],[0.05,0.015],[0.5,0.015],[0.85,0.008],[1,0]]);
      breathNoise(bt+insp,exp*0.3,80,250,[[0,0],[0.1,0.005],[0.6,0.003],[1,0]]);
    } else if(type==='crepitations_pleural'){
      if(b===0){for(let i=0;i<8;i++) crackle(bt+i*0.14+Math.random()*0.04,200+Math.random()*100,0.08,0.08);}
      else if(b===1){for(let i=0;i<4;i++) crackle(bt+i*0.5,180+Math.random()*60,0.07,0.07);}// pericardial — heartbeat sync
      else{breathNoise(bt,insp*0.8,80,350,[[0,0],[0.05,0.025],[0.6,0.02],[1,0]]);for(let i=0;i<6;i++) crackle(bt+i*0.14,200+Math.random()*80,0.07,0.07);}
    }
  }
  audioStopTimeout=setTimeout(()=>{
    stopAllAudio();
    document.querySelectorAll('.bplay-btn.playing').forEach(b=>{b.classList.remove('playing');b.textContent='▶';b.closest('.breath-player')?.classList.remove('playing');});
  },(nBreaths*breathCycle+0.5)*1000);
}

const bsl=document.getElementById('breath-sounds-list');
BREATH_SOUNDS.forEach(s=>{
  bsl.innerHTML+=`<div class="breath-player" id="bap-${s.key}">
    <button class="bplay-btn" onclick="playBreathSound('${s.key}',this)">▶</button>
    <div class="breath-info" style="flex:1">
      <div class="breath-name">${s.name} <span class="badge ${s.badgeCls}" style="margin-left:4px">${s.badge}</span></div>
      <div class="breath-desc">${s.desc}</div>
      <div style="display:flex;gap:10px;margin-top:5px;font-size:10px"><span style="color:var(--purple);font-weight:600">${s.phase}</span><span style="color:var(--muted2)">${s.quality}</span></div>
      <div style="font-size:11px;color:var(--muted2);margin-top:5px;padding:7px;background:var(--surf3);border-radius:7px;line-height:1.45">${s.clinical}</div>
    </div>
    <div class="bwaveform"><div class="bwb"></div><div class="bwb"></div><div class="bwb"></div><div class="bwb"></div><div class="bwb"></div><div class="bwb"></div><div class="bwb"></div></div>
  </div>`;
});

function playBreathSound(key,btn){
  const wasPlaying=btn.classList.contains('playing');
  document.querySelectorAll('.bplay-btn').forEach(b=>{b.classList.remove('playing');b.textContent='▶';b.closest('.breath-player')?.classList.remove('playing');});
  document.querySelectorAll('.play-btn,.site-sound-btn').forEach(b=>{b.classList.remove('playing');if(b.textContent==='⏸')b.textContent='▶';});
  stopAllAudio();
  if(!wasPlaying){
    btn.classList.add('playing');btn.textContent='⏸';
    btn.closest('.breath-player').classList.add('playing');
    makeBreathSound(key);
  }
}

// ═══════════════════ SPIROMETRY ═══════════════════
const SPIRO_PATTERNS=[
  {id:'normal',name:'Normal',icon:'✅',eg:'Healthy lungs',badge:'Normal',color:'#34d399',
   fvc:4.8,fev1:3.9,ratio:81,
   desc:'FEV1/FVC ≥70%. Both values within normal limits. No obstruction or restriction detected.',
   result:'background:rgba(52,211,153,.1);color:#34d399',
   flowVol:[[0,0],[0.3,7.5],[0.6,8.5],[1.0,7.0],[2.0,5.0],[3.5,2.5],[4.8,0]]},
  {id:'obstruct',name:'Obstructive',icon:'💨',eg:'Asthma / COPD',badge:'Obstructive',color:'#ffb347',
   fvc:4.2,fev1:2.4,ratio:57,
   desc:'FEV1/FVC <70%. FEV1 reduced. FVC relatively preserved. Scooped-out flow-volume curve. Seen in asthma, COPD, bronchiectasis.',
   result:'background:rgba(255,179,71,.1);color:#ffb347',
   flowVol:[[0,0],[0.2,5.5],[0.5,5.8],[1.0,4.0],[2.0,2.5],[3.0,1.2],[4.2,0]]},
  {id:'restrict',name:'Restrictive',icon:'🫁',eg:'Fibrosis / obesity',badge:'Restrictive',color:'#f4547a',
   fvc:2.6,fev1:2.1,ratio:81,
   desc:'FEV1/FVC ≥70% but FVC reduced. Both values low. Preserved ratio. Seen in pulmonary fibrosis, chest wall disease, obesity, neuromuscular.',
   result:'background:rgba(244,84,122,.1);color:#f4547a',
   flowVol:[[0,0],[0.2,5.8],[0.4,6.0],[0.7,4.8],[1.2,3.0],[1.9,1.0],[2.6,0]]},
  {id:'mixed',name:'Mixed',icon:'⚠️',eg:'Severe COPD',badge:'Mixed',color:'#a78bfa',
   fvc:2.8,fev1:1.5,ratio:54,
   desc:'Both FEV1/FVC ratio AND FVC reduced. Obstructive + restrictive features. Seen in severe COPD with air trapping, sarcoidosis with bronchial involvement.',
   result:'background:rgba(167,139,250,.1);color:#a78bfa',
   flowVol:[[0,0],[0.2,3.8],[0.5,4.0],[1.0,2.8],[1.8,1.6],[2.4,0.6],[2.8,0]]},
];

const spiroPatBtns=document.getElementById('spiro-pattern-btns');
SPIRO_PATTERNS.forEach(p=>{
  spiroPatBtns.innerHTML+=`<div class="spiro-pat-btn" onclick="showSpiro('${p.id}',this)" id="spb-${p.id}">
    <div class="pat-icon">${p.icon}</div>
    <div class="pat-name">${p.name}</div>
    <div class="pat-eg">${p.eg}</div>
  </div>`;
});

function showSpiro(id,el){
  document.querySelectorAll('.spiro-pat-btn').forEach(b=>b.classList.remove('on'));
  el.classList.add('on');
  const p=SPIRO_PATTERNS.find(x=>x.id===id);
  document.getElementById('spiro-title').textContent=p.name+' Pattern';
  const badge=document.getElementById('spiro-badge');
  badge.textContent=p.badge;
  badge.style.background=p.color+'22';badge.style.color=p.color;
  drawSpiro(p);
  document.getElementById('spiro-values').innerHTML=`
    <div class="spiro-val"><div class="sv" style="color:${p.color}">${p.fvc}L</div><div class="sl">FVC</div></div>
    <div class="spiro-val"><div class="sv" style="color:${p.color}">${p.fev1}L</div><div class="sl">FEV1</div></div>
    <div class="spiro-val"><div class="sv" style="color:${p.ratio>=70?'var(--green)':'var(--red)'}">${p.ratio}%</div><div class="sl">FEV1/FVC</div></div>`;
  const res=document.getElementById('spiro-result');
  res.style.cssText=p.result;res.textContent=p.desc;res.classList.add('on');
}

function drawSpiro(p){
  const canvas=document.getElementById('spiro-canvas');
  const ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height;
  ctx.clearRect(0,0,W,H);

  // Grid
  ctx.strokeStyle='rgba(255,255,255,.05)';ctx.lineWidth=1;
  for(let x=0;x<=W;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<=H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

  // Axes
  ctx.strokeStyle='rgba(255,255,255,.15)';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(40,10);ctx.lineTo(40,H-30);ctx.lineTo(W-10,H-30);ctx.stroke();

  // Labels
  ctx.fillStyle='rgba(255,255,255,.3)';ctx.font='11px Mulish';
  ctx.fillText('Flow (L/s)',2,16);ctx.fillText('Volume (L)',W/2-20,H-6);

  // Y axis ticks
  const maxFlow=10;
  for(let f=0;f<=maxFlow;f+=2){
    const y=H-30-(f/maxFlow)*(H-50);
    ctx.fillStyle='rgba(255,255,255,.2)';ctx.font='9px Mulish';
    ctx.fillText(f,14,y+4);
    ctx.strokeStyle='rgba(255,255,255,.06)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(38,y);ctx.lineTo(W-10,y);ctx.stroke();
  }

  // Normal reference (ghost)
  const normalPat=SPIRO_PATTERNS[0];
  ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=1.5;ctx.setLineDash([4,4]);
  ctx.beginPath();
  normalPat.flowVol.forEach(([v,f],i)=>{
    const x=40+(v/6)*(W-55);const y=H-30-(f/maxFlow)*(H-50);
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  });
  ctx.stroke();ctx.setLineDash([]);

  // Main curve
  ctx.strokeStyle=p.color;ctx.lineWidth=2.5;
  ctx.shadowColor=p.color;ctx.shadowBlur=8;
  ctx.beginPath();
  p.flowVol.forEach(([v,f],i)=>{
    const x=40+(v/6)*(W-55);const y=H-30-(f/maxFlow)*(H-50);
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  });
  ctx.stroke();ctx.shadowBlur=0;

  // FEV1 marker
  ctx.fillStyle=p.color+'aa';ctx.font='bold 10px Mulish';
  const fev1x=40+(p.fev1/6)*(W-55);
  ctx.setLineDash([3,3]);ctx.strokeStyle=p.color+'66';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(fev1x,H-30);ctx.lineTo(fev1x,H-50);ctx.stroke();ctx.setLineDash([]);
  ctx.fillText('FEV1',fev1x-14,H-52);
}

// ═══════════════════ OSCE LONG CASE ═══════════════════
const CASES=[
  {name:'Acute MI — Long Case',icon:'💔',diff:'m',
   patient:'Mr. David Nguyen, 62M',
   vitals:['BP 145/88','HR 98 bpm','RR 20','SpO₂ 95%','Temp 37.3°C','Pain 9/10'],
   hx:[
     {k:'PC',v:'Crushing central chest pain 3 hours duration, radiating to left arm and jaw'},
     {k:'HPC',v:'Sudden onset at rest watching TV. Associated diaphoresis, nausea, one episode of vomiting. Took two paracetamol — no relief. Nil relief with antacids. Woke wife due to distress.'},
     {k:'Cardiac Risk Factors',v:'Hypertension, T2DM (HbA1c 9.2% last review), hyperlipidaemia, ex-smoker 30 pack-years (quit 8 years ago), sedentary lifestyle, BMI 31'},
     {k:'PMHx',v:'HTN x12yr, T2DM x8yr, hyperlipidaemia x10yr, appendicectomy 1993'},
     {k:'Medications',v:'Ramipril 5mg, metformin 1g BD, atorvastatin 40mg, aspirin 100mg (already taking)'},
     {k:'Allergies',v:'NKDA'},
     {k:'FHx',v:'Father: fatal MI age 58. Brother: CABG age 65.'},
     {k:'SHx',v:'Retired builder. Lives with wife. Occasional alcohol. No illicit drugs.'},
   ],
   ex:[
     {k:'General',v:'Diaphoretic, pale, distressed. Clutching chest.'},
     {k:'CVS',v:'HS I+II+0, no murmurs. JVP not elevated. Bilateral equal radial pulses. No peripheral oedema.'},
     {k:'Respiratory',v:'Clear to auscultation bilaterally. No wheeze or crackles.'},
     {k:'Abdomen',v:'Soft, non-tender. No organomegaly.'},
     {k:'Peripheral',v:'Warm peripheries. Capillary refill <2s. No tar staining.'},
   ],
   ix:[
     {k:'ECG',v:'ST elevation 3mm in leads II, III, aVF. Reciprocal ST depression in I and aVL. Sinus tachycardia 98bpm.'},
     {k:'Troponin I (0hr)',v:'6.8 ng/mL (ref <0.04) — markedly elevated'},
     {k:'Troponin I (3hr)',v:'14.2 ng/mL — rising (confirms AMI)'},
     {k:'CXR',v:'Mild cardiomegaly. No pulmonary oedema. No pneumothorax.'},
     {k:'FBC',v:'Hb 141g/L, WCC 12.4 (mild reactive leukocytosis), Plt 284'},
     {k:'U&E',v:'Na 138, K 4.2, Urea 7.1, Cr 98 (eGFR 68) — normal'},
     {k:'BSL',v:'12.4 mmol/L — elevated (known diabetic)'},
     {k:'Lipids (old)',v:'LDL 3.8, HDL 0.9, Total cholesterol 6.2'},
   ],
   questions:[
     {q:'What is the ECG diagnosis and which vessel is most likely occluded?',
      opts:['Anterior STEMI — LAD occlusion','Inferior STEMI — RCA occlusion','NSTEMI — LCx involvement','Posterior MI — RCA or LCx'],
      ans:1,exp:'Inferior STEMI is defined by ST elevation in II, III, aVF with reciprocal changes in I/aVL. In ~80% of cases this is due to right coronary artery (RCA) occlusion. The RCA supplies the inferior wall, AV node, and often the right ventricle.'},
     {q:'Using the acronym MONA, what is the immediate pharmacological management?',
      opts:['Morphine 2.5–5mg IV, Oxygen (if SpO₂<94%), Nitrates (GTN SL unless RV infarct), Aspirin 300mg loading','Metoprolol, Oxygen always, Nitrates always, Aspirin 75mg','Morphine 10mg, Oxygen always, Nitrates always, Aspirin 300mg','Midazolam, Oxygen, Nitrates, Aspirin'],
      ans:0,exp:'MONA: Morphine (titrated for pain), Oxygen only if SpO₂ <94% (hyperoxia is harmful), Nitrates (caution if RV infarct or hypotension — causes precipitous drop), Aspirin 300mg loading. Also add P2Y12 inhibitor (ticagrelor 180mg preferred) and anticoagulation (heparin).'},
     {q:'What is the door-to-balloon time target for STEMI, and what if PCI is unavailable?',
      opts:['<90 min for PCI; if unavailable: thrombolysis within 12hrs if no contraindications','<60 min for PCI; if unavailable: observe and repeat ECG','<120 min for PCI; if unavailable: no further treatment','<90 min for PCI; if unavailable: only supportive care'],
      ans:0,exp:'Door-to-balloon time (first medical contact to PCI) should be <90 minutes. If a PCI-capable centre cannot be reached within 90 min, fibrinolysis (e.g. tenecteplase) should be given within 12 hours of symptom onset, provided there are no contraindications.'},
     {q:'Which complication should be specifically considered given the inferior STEMI territory?',
      opts:['Left ventricular aneurysm','Right ventricular infarction','Papillary muscle rupture causing AS','Aortic dissection'],
      ans:1,exp:'RV infarction complicates ~30-50% of inferior STEMIs due to shared RCA blood supply. Classic triad: hypotension, elevated JVP, clear lung fields. CRITICAL: avoid nitrates and diuretics (preload-dependent). Treat with IV fluids and consider right-sided ECG (SR4 elevation).'},
     {q:'What are three important secondary prevention medications to commence before discharge?',
      opts:['ACEi, statin, DAPT (aspirin + ticagrelor/clopidogrel)','Diuretic, statin, aspirin alone','Beta-blocker, warfarin, ACEi','Digoxin, statin, aspirin'],
      ans:0,exp:'Post-MI secondary prevention: (1) DAPT — aspirin 100mg lifelong + ticagrelor/clopidogrel for 12 months; (2) High-intensity statin (atorvastatin 40–80mg) regardless of lipids; (3) ACE inhibitor (reduces LV remodelling); (4) Beta-blocker (reduces mortality post-MI); (5) Cardiac rehab referral.'},
   ]},
  {name:'Acute Respiratory Failure',icon:'🫁',diff:'h',
   patient:'Ms. Margaret Okafor, 71F',
   vitals:['BP 162/95','HR 112 bpm','RR 30 /min','SpO₂ 84% on air','Temp 38.8°C','GCS 14 (E4V4M6)'],
   hx:[
     {k:'PC',v:'Worsening breathlessness and confusion over 48 hours'},
     {k:'HPC',v:'5-day history of productive cough — green sputum. Pleuritic right-sided chest pain. Fevers and rigors. Worsening confusion past 24 hours — unable to manage at home. Lives alone. Not eating or drinking well.'},
     {k:'PMHx',v:'COPD (GOLD III, on home nebulisers), T2DM, hypertension, atrial fibrillation, previous DVT 2019'},
     {k:'Medications',v:'Salbutamol PRN, tiotropium, seretide, warfarin, ramipril, metformin, bisoprolol'},
     {k:'Vaccinations',v:'Not up to date with influenza or pneumococcal vaccine'},
     {k:'SHx',v:'Ex-smoker 45 pack-years. Lives alone, mobilises with frame. Independent with ADLs at baseline.'},
   ],
   ex:[
     {k:'General',v:'Unwell, tachypnoeic, using accessory muscles. Confused — oriented to name only.'},
     {k:'Respiratory',v:'Decreased expansion right base. Dull to percussion right base. Bronchial breathing right lower zone. Coarse crackles bilaterally. RR 30.'},
     {k:'CVS',v:'Tachycardia, irregular (AF). No murmurs. JVP mildly elevated.'},
     {k:'Temperature',v:'38.8°C — febrile'},
     {k:'Fluid status',v:'Dry mucous membranes, reduced skin turgor. Estimated 2–3L deficit.'},
   ],
   ix:[
     {k:'ABG (on air)',v:'pH 7.31, pO₂ 6.2kPa, pCO₂ 7.8kPa, HCO₃ 28, Sat 80% — Type II respiratory failure + partially compensated respiratory acidosis'},
     {k:'CXR',v:'Right lower lobe consolidation. No pneumothorax. Mild cardiomegaly.'},
     {k:'Sputum MC&S',v:'Pending — gram stain: gram-positive diplococci'},
     {k:'Blood cultures',v:'2 sets taken, pending'},
     {k:'FBC',v:'WCC 22.4 (neutrophilia), Hb 128, Plt 88 (low)'},
     {k:'CRP',v:'318 mg/L — markedly elevated'},
     {k:'U&E',v:'Na 131 (hyponatraemia), K 3.8, Urea 18.4, Cr 164 (raised — AKI on CKD)'},
     {k:'INR',v:'3.8 — supratherapeutic (on warfarin)'},
     {k:'CURB-65',v:'Score 4 (Confusion, Urea >7, RR>30, Age>65) — severe CAP, consider ICU'},
   ],
   questions:[
     {q:'Interpret the ABG: what type of respiratory failure is this and what is the primary disturbance?',
      opts:['Type I (hypoxaemia only), metabolic acidosis','Type II (hypoxaemia + hypercapnia), respiratory acidosis with metabolic compensation','Type I, respiratory alkalosis','Normal ABG — no intervention needed'],
      ans:1,exp:'pO₂ 6.2 (↓) + pCO₂ 7.8 (↑) = Type II respiratory failure (hypercapnic). pH 7.31 (↓) = acidosis. Primary disturbance is respiratory (↑CO₂). HCO₃ 28 (slightly ↑) indicates partial metabolic compensation. Causes: COPD exacerbation + pneumonia with fatigue.'},
     {q:'What is the CURB-65 score indicating, and what is your disposition decision?',
      opts:['Score 2 — outpatient antibiotics safe','Score 4 — severe CAP, inpatient care with consideration of HDU/ICU','Score 1 — home with safety netting','Score 3 — ward admission, standard care only'],
      ans:1,exp:'CURB-65: Confusion=1, Urea>7=1, RR>30=1, Age>65=1, BP normal=0 → Score 4. Mortality risk >20%. Requires inpatient treatment. Score ≥3 consider HDU/ICU. With Type II RF and confusion, this patient likely needs NIV (BiPAP) and ICU review.'},
     {q:'What is the most appropriate immediate oxygen therapy strategy for this COPD patient?',
      opts:['High-flow 100% O₂ via non-rebreather mask','Controlled oxygen 24–28% via Venturi mask, targeting SpO₂ 88–92%','No oxygen — risk of hypercapnic drive suppression','Intubation immediately'],
      ans:1,exp:'In COPD, target SpO₂ 88–92% using controlled oxygen (Venturi mask 24–28%). Hyperoxia can suppress the hypoxic drive and worsen hypercapnia. Titrate carefully. If not improving or deteriorating, escalate to NIV (BiPAP). BTS guidelines 2017.'},
     {q:'The gram stain shows gram-positive diplococci. What is the most likely organism and empirical antibiotic?',
      opts:['Staph aureus — flucloxacillin','Streptococcus pneumoniae — IV benzylpenicillin or amoxicillin + azithromycin','E. coli — IV ceftriaxone alone','Pseudomonas — IV piperacillin-tazobactam'],
      ans:1,exp:'Gram-positive diplococci = Streptococcus pneumoniae (pneumococcus) — most common cause of CAP. Empirical treatment per Australian guidelines (Therapeutic Guidelines): IV benzylpenicillin 1.2g 6-hourly + oral doxycycline or azithromycin (for atypicals). In severe CAP: IV amoxicillin-clavulanate + azithromycin.'},
     {q:'What are your THREE immediate management priorities for this patient?',
      opts:[
        'Controlled O₂ → ABG recheck → IV antibiotics + consider NIV if deteriorating',
        'High-flow O₂ → CT chest → oral antibiotics → discharge',
        'Intubation first → antibiotics → fluids',
        'Diuretics → withhold antibiotics until cultures → observe'
      ],ans:0,
      exp:'Immediate priorities: (1) Airway/Breathing — controlled O₂ 24-28% targeting 88-92%, senior/ICU review, prepare for NIV; (2) Circulation — IV access, 500mL fluid bolus (AKI+dehydration), bloods, cultures; (3) Disability — recheck GCS, consider sepsis pathway (NEWS score), IV antibiotics within 1 hour of diagnosis (sepsis bundle).'},
   ]},
];

// Timer
let timerVal=20*60,timerMax=20*60,timerRunning=false,timerInt=null;
function toggleTimer(){
  timerRunning=!timerRunning;
  document.getElementById('timer-toggle').textContent=timerRunning?'Pause':'Resume';
  document.getElementById('timer-toggle').className='timer-btn '+(timerRunning?'go':'');
  if(timerRunning){
    timerInt=setInterval(()=>{
      timerVal--;
      updateTimerDisplay();
      if(timerVal<=0){clearInterval(timerInt);timerRunning=false;document.getElementById('timer-toggle').textContent='Start';}
    },1000);
  } else clearInterval(timerInt);
}
function resetTimer(){
  clearInterval(timerInt);timerRunning=false;timerVal=timerMax;
  document.getElementById('timer-toggle').textContent='Start';
  document.getElementById('timer-toggle').className='timer-btn go';
  updateTimerDisplay();
}
function updateTimerDisplay(){
  const m=Math.floor(timerVal/60),s=timerVal%60;
  const d=document.getElementById('timer-disp');
  d.textContent=`${m}:${s.toString().padStart(2,'0')}`;
  const pct=(timerVal/timerMax)*100;
  document.getElementById('timer-prog').style.width=pct+'%';
  d.className='timer-display'+(timerVal<=60?' critical':timerVal<=300?' warn':'');
}

// Build scenario list
const scenList=document.getElementById('scenario-list');
CASES.forEach((c,i)=>{
  const diffs={e:'diff-e',m:'diff-m',h:'diff-h'};
  const diffL={e:'Standard',m:'Intermediate',h:'Advanced'};
  scenList.innerHTML+=`<div class="scenario-card" onclick="startCase(${i})">
    <div class="sc-icon">${c.icon}</div>
    <div class="sc-info">
      <div class="sc-name">${c.name}</div>
      <div class="sc-meta">${c.patient} · ${c.questions.length} management questions · 20 min</div>
    </div>
    <span class="sc-diff ${diffs[c.diff]}">${diffL[c.diff]}</span>
  </div>`;
});

let currentCase=null;let caseAnswers={};
function startCase(i){
  currentCase=CASES[i];caseAnswers={};
  document.getElementById('osce-picker').style.display='none';
  document.getElementById('osce-session').style.display='block';
  document.getElementById('osce-timer-bar').style.display='flex';
  resetTimer();

  // Patient card
  document.getElementById('lc-patient-card').innerHTML=`
    <div class="lc-pname">${currentCase.patient}</div>
    <div class="lc-vital-row">${currentCase.vitals.map(v=>`<div class="lc-vital-chip">${v}</div>`).join('')}</div>`;

  // History
  document.getElementById('op-hx').innerHTML=currentCase.hx.map(r=>`<div class="finding-row"><span class="fk">${r.k}</span><span class="fv">${r.v}</span></div>`).join('');
  // Exam
  document.getElementById('op-ex').innerHTML=currentCase.ex.map(r=>`<div class="finding-row"><span class="fk">${r.k}</span><span class="fv">${r.v}</span></div>`).join('');
  // Ix
  document.getElementById('op-ix').innerHTML=currentCase.ix.map(r=>`<div class="finding-row"><span class="fk">${r.k}</span><span class="fv">${r.v}</span></div>`).join('');
  // Mx questions
  buildMxPanel();
  document.getElementById('case-summary').classList.remove('on');

  // Reset tabs
  document.querySelectorAll('#osce .tab').forEach(t=>t.classList.remove('on'));
  document.querySelector('#osce .tab').classList.add('on');
  document.querySelectorAll('#osce .panel').forEach(p=>p.classList.remove('on'));
  document.getElementById('op-hx').classList.add('on');
}

function buildMxPanel(){
  document.getElementById('op-mx').innerHTML=currentCase.questions.map((q,i)=>`
    <div class="mgmt-block" id="mbk-${i}">
      <div class="mgmt-q">Q${i+1}. ${q.q}</div>
      <div class="mgmt-opts">${q.opts.map((o,j)=>`<button class="mgmt-opt" onclick="answerCase(${i},${j})" id="mopt-${i}-${j}">${o}</button>`).join('')}</div>
      <div class="mgmt-exp" id="mexp-${i}">${q.exp}</div>
    </div>`).join('');
}

function answerCase(qi,oi){
  if(caseAnswers[qi]!==undefined) return;
  caseAnswers[qi]=oi;
  const q=currentCase.questions[qi];
  for(let j=0;j<q.opts.length;j++){
    const b=document.getElementById(`mopt-${qi}-${j}`);b.disabled=true;
    if(j===q.ans) b.classList.add(oi===j?'correct':'reveal');
    else if(j===oi) b.classList.add('wrong');
  }
  document.getElementById(`mexp-${qi}`).classList.add('on');
  if(Object.keys(caseAnswers).length===currentCase.questions.length) showCaseSummary();
}

function showCaseSummary(){
  clearInterval(timerInt);timerRunning=false;
  const sc=Object.entries(caseAnswers).filter(([i,v])=>currentCase.questions[i].ans===+v).length;
  const total=currentCase.questions.length;
  const pct=Math.round(sc/total*100);
  const fb=pct>=80?'Excellent clinical reasoning. Strong management knowledge.':pct>=60?'Good understanding. Review the explanations above for the questions you missed.':'Review the case carefully. Focus on reading the explanations for each question.';
  const summary=document.getElementById('case-summary');
  summary.innerHTML=`<div class="cs-score">${sc}/${total}</div><div class="cs-label">${pct}% correct</div><div class="cs-feedback"><strong>Feedback: </strong>${fb}</div>`;
  summary.classList.add('on');
  summary.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function switchOsceTab(tab,el){
  document.querySelectorAll('#osce .tab').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');
  document.querySelectorAll('#osce .panel').forEach(p=>p.classList.remove('on'));
  document.getElementById('op-'+tab).classList.add('on');
}

function endCase(){
  clearInterval(timerInt);timerRunning=false;
  document.getElementById('osce-session').style.display='none';
  document.getElementById('osce-picker').style.display='block';
  document.getElementById('osce-timer-bar').style.display='none';
  currentCase=null;
}

function restartCase(){
  clearInterval(timerInt);
  const i=CASES.indexOf(currentCase);
  startCase(i);
}

function oscBack(){
  if(currentCase) endCase();
  else goHome();
}

// ═══════════════════ SPINAL NEUROLOGY ═══════════════════
function switchSpineTab(tab,el){
  document.querySelectorAll('.stab').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');
  document.querySelectorAll('.spine-panel').forEach(p=>p.classList.remove('on'));
  document.getElementById('sp-'+tab).classList.add('on');
}

// Vertebral level data
const VL_DATA=[
  {level:'C3–C5',color:'#ffb347',
   motor:'Diaphragm (C3-5 keeps the diaphragm alive). Neck flexors/extensors.',
   sensory:'Lateral neck, shoulder cape (C4), upper chest',
   reflex:'None specific — diaphragmatic reflex',
   mnemonic:'C3,4,5 keeps the diaphragm alive',
   lesion:'High cervical injury: ventilator dependence. C4 complete: quadriplegia + respiratory failure.',
   tip:'Phrenic nerve (C3–C5) — damage above C5 = unable to breathe independently'},
  {level:'C5',color:'#4a9eff',
   motor:'Deltoid (shoulder abduction), biceps (elbow flexion)',
   sensory:'Lateral upper arm (badge area)',
   reflex:'Biceps reflex (C5–C6)',
   mnemonic:'C5 = raise your hand up high (abduction)',
   lesion:'Weak shoulder abduction and elbow flexion. Intact hand function. C5 root compression: lateral arm pain + numbness.',
   tip:'Think: C5 = biceps jerk. Deltoid wasting visible on inspection.'},
  {level:'C6',color:'#00d4aa',
   motor:'Wrist extensors (ECRL/ECRB), biceps',
   sensory:'Lateral forearm, thumb, index finger',
   reflex:'Brachioradialis reflex (C6), Biceps reflex',
   mnemonic:'C6 = point to heaven with your thumb (thumb = C6)',
   lesion:'Weak wrist extension, thumb/index numbness. Classic in cervical disc disease at C5/6 level.',
   tip:'Dermatomally: thumb = C6. Cervical spondylosis most common at C5/6.'},
  {level:'C7',color:'#a78bfa',
   motor:'Wrist flexors, finger extensors, triceps',
   sensory:'Middle finger, dorsum of hand',
   reflex:'Triceps reflex (C7)',
   mnemonic:'C7 = point straight ahead with middle finger',
   lesion:'Weak finger/wrist extension, triceps weakness. Numbness middle finger. C6/7 disc = most common cervical disc herniation.',
   tip:'Triceps jerk = C7. Wrist drop if severe (differentiate from radial nerve palsy).'},
  {level:'C8–T1',color:'#f4547a',
   motor:'Intrinsic hand muscles (lumbricals, interossei), finger flexors (C8)',
   sensory:'Medial forearm (T1), ring and little fingers (C8)',
   reflex:'Finger flexor reflex (C8)',
   mnemonic:'C8 = little finger, T1 = medial arm',
   lesion:'Claw hand, small muscle wasting of hand. Ulnar nerve territory. Pancoast tumour compresses T1 root → Horner syndrome + wasted hand.',
   tip:'T1 lesion → Horner syndrome (ptosis, miosis, anhidrosis) due to disrupted sympathetic chain.'},
  {level:'T4',color:'#34d399',
   motor:'Intercostals, trunk muscles',
   sensory:'Nipple line',
   reflex:'Abdominal reflex (T8–T12)',
   mnemonic:'T4 = nipple line (think "4 o\'clock on the chest")',
   lesion:'Paraplegia below T4 lesion. Preserved arm function. Sensory level at nipples.',
   tip:'Use sensory level to localise thoracic cord injury. T4 = nipples, T10 = umbilicus, T12 = inguinal ligament.'},
  {level:'T10',color:'#34d399',
   motor:'Lower intercostals, abdominals',
   sensory:'Umbilicus',
   reflex:'Lower abdominal reflex',
   mnemonic:'T10 = tummy button (umbilicus)',
   lesion:'Beevor sign: umbilicus moves upward when patient lifts head (T10 intact but below weak). Sensory loss below umbilicus.',
   tip:'Beevor\'s sign: umbilicus migrates toward intact segment = useful clinical sign for T10 level.'},
  {level:'L1–L2',color:'#ffb347',
   motor:'Hip flexors (iliopsoas — L1/2/3), hip adductors',
   sensory:'Inguinal region, scrotum/labia majora, anterior upper thigh',
   reflex:'Cremasteric reflex (L1–L2)',
   mnemonic:'L1/2 = inguinal ligament territory',
   lesion:'Weak hip flexion. Inguinal/groin pain and numbness. Lateral cutaneous nerve of thigh (L2/3) = meralgia paraesthetica.',
   tip:'Meralgia paraesthetica: lateral thigh burning/numbness from L2/L3 — compression under inguinal ligament.'},
  {level:'L3–L4',color:'#4a9eff',
   motor:'Quadriceps (knee extension — L3/4), hip adductors',
   sensory:'Medial thigh (L3), medial leg/foot (L4)',
   reflex:'Knee jerk (L3–L4)',
   mnemonic:'L3/4 = knee jerk. L4 = medial leg (4 sounds like "floor" — medial where foot hits floor)',
   lesion:'Weak knee extension, absent knee jerk. L4 radiculopathy: medial leg pain, weak ankle dorsiflexion.',
   tip:'Knee jerk absent = L3/4 lesion (LMN). Hyperreflexic knee jerk = UMN lesion above L3.'},
  {level:'L4–L5',color:'#00d4aa',
   motor:'Ankle dorsiflexion (L4/5), big toe extension (L5 — EHL)',
   sensory:'Lateral leg (L5), dorsum of foot, big toe',
   reflex:'No specific reflex (L5)',
   mnemonic:'L5 = big toe up, lateral leg. "L5 high five with your foot"',
   lesion:'Foot drop (weak dorsiflexion — peroneal nerve or L4/5 root). Weak big toe extension. L5 radiculopathy: pain radiates to dorsum of foot.',
   tip:'Foot drop differential: common peroneal nerve palsy (fibular neck) vs L4/5 disc vs sciatic nerve. EHL testing isolates L5.'},
  {level:'S1',color:'#a78bfa',
   motor:'Plantar flexion (gastrocnemius/soleus), hip extension (gluteus maximus)',
   sensory:'Lateral foot, sole, little toe',
   reflex:'Ankle jerk (S1)',
   mnemonic:'S1 = ankle jerk + tip toe (plantar flexion)',
   lesion:'Absent ankle jerk, weak plantar flexion, cannot tip-toe. S1 radiculopathy: pain down posterior leg to lateral foot (classic sciatica distribution).',
   tip:'Ankle jerk absent = S1 lesion. Test: patient kneels on chair, tap Achilles. Compare sides carefully.'},
  {level:'S2–S4',color:'#f4547a',
   motor:'Bladder, bowel, anal sphincter, perineal muscles',
   sensory:'Saddle area (perineum, inner thighs, genitalia)',
   reflex:'Anal wink (S3–S4), bulbocavernosus reflex',
   mnemonic:'S2,3,4 keep the poo off the floor',
   lesion:'Cauda equina syndrome: saddle anaesthesia + urinary retention + loss of anal tone + bilateral leg weakness. SURGICAL EMERGENCY.',
   tip:'Red flag: new urinary retention + saddle numbness = cauda equina until proven otherwise. MRI lumbar spine urgently.'},
];

const vlList=document.getElementById('vl-list');
VL_DATA.forEach((vl,i)=>{
  vlList.innerHTML+=`
    <div class="vl-card" id="vlc-${i}" onclick="showVL(${i})" style="border-left-color:${vl.color}">
      <div class="vl-level" style="color:${vl.color}">${vl.level}</div>
      <div class="vl-roots">${vl.motor.substring(0,55)}…</div>
    </div>
    <div class="vl-detail" id="vld-${i}">
      <h4>${vl.level}</h4>
      <div class="vl-grid">
        <div class="vl-box"><div class="vl-box-label">Motor</div><div class="vl-box-val">${vl.motor}</div></div>
        <div class="vl-box"><div class="vl-box-label">Sensory</div><div class="vl-box-val">${vl.sensory}</div></div>
        <div class="vl-box"><div class="vl-box-label">Reflex</div><div class="vl-box-val">${vl.reflex}</div></div>
        <div class="vl-box"><div class="vl-box-label">Mnemonic</div><div class="vl-box-val" style="color:${vl.color}">${vl.mnemonic}</div></div>
      </div>
      <div class="vl-box" style="margin-top:8px"><div class="vl-box-label">Lesion</div><div class="vl-box-val">${vl.lesion}</div></div>
      <div class="vl-box" style="margin-top:8px;border:1px solid ${vl.color}44"><div class="vl-box-label" style="color:${vl.color}">Clinical Tip</div><div class="vl-box-val">${vl.tip}</div></div>
    </div>`;
});

let openVL=null;
function showVL(i){
  if(openVL===i){
    document.getElementById('vld-'+i).classList.remove('on');
    document.getElementById('vlc-'+i).classList.remove('on');
    openVL=null; return;
  }
  if(openVL!==null){document.getElementById('vld-'+openVL).classList.remove('on');document.getElementById('vlc-'+openVL).classList.remove('on');}
  openVL=i;
  document.getElementById('vlc-'+i).classList.add('on');
  document.getElementById('vld-'+i).classList.add('on');
  document.getElementById('vld-'+i).scrollIntoView({behavior:'smooth',block:'nearest'});
}

// Dermatomes
const DERM_DATA={
  'C2-C4':{level:'C2–C4',region:'Scalp, face (C2), neck and shoulder cape (C3/C4)',color:'#ffb347',
    clinical:'C2: posterior scalp. C3: posterior neck. C4: cape of shoulder. Shingles in C3/4 = neck vesicles. Brachial amyotrophy can affect C3/4.',
    reflex:'No peripheral reflex — jaw jerk (CN V) if face involvement'},
  'C3-C4':{level:'C3–C4',region:'Shoulder cape and upper trapezius',color:'#ffb347',
    clinical:'C4 root compression → shoulder pain radiating up the neck. Often confused with rotator cuff pathology. Check for Spurling\'s sign (cervical root).',
    reflex:'No specific reflex'},
  'C5':{level:'C5',region:'Lateral upper arm ("regimental badge" area)',color:'#4a9eff',
    clinical:'C5 radiculopathy: deltoid weakness + lateral arm numbness. Axillary nerve palsy (shoulder dislocation) also causes badge-area numbness but deltoid wasting more focal.',
    reflex:'Biceps jerk (C5/6)'},
  'C6':{level:'C6',region:'Lateral forearm, thumb and index finger',color:'#00d4aa',
    clinical:'Most common cervical disc herniation (C5/6 level). Thumb and index numbness + weak wrist extension. Brachioradialis reflex diminished.',
    reflex:'Brachioradialis (C6), Biceps (C5/6)'},
  'C7':{level:'C7',region:'Middle finger and dorsum of hand',color:'#a78bfa',
    clinical:'C6/7 disc herniation. Middle finger numbness. Triceps weakness (unable to push away). Absent triceps jerk.',
    reflex:'Triceps jerk (C7)'},
  'C8':{level:'C8',region:'Ring and little fingers, medial forearm',color:'#f4547a',
    clinical:'C8 radiculopathy: intrinsic hand weakness, little finger numbness. Pancoast tumour classic cause (apex lung). Check for Horner\'s (ptosis/miosis).',
    reflex:'Finger flexor reflex (C8)'},
  'T1-T4':{level:'T1–T4',region:'Medial arm (T1), upper chest (T2–T4), nipple line at T4',color:'#34d399',
    clinical:'T1 lesion: Horner\'s syndrome + small hand muscle wasting. T4 = nipple line. Thoracic cord compression: bilateral spastic paraparesis below level.',
    reflex:'Upper abdominal reflex (T8/9)'},
  'T5-T8':{level:'T5–T8',region:'Mid-chest to epigastrium. T6 = xiphisternum',color:'#34d399',
    clinical:'Band-like pain at a thoracic level = cord lesion until proven otherwise. Herpes zoster commonly affects thoracic dermatomes. Sensory level at xiphi = T6.',
    reflex:'Upper abdominal reflex (T8/9)'},
  'T9-T12':{level:'T9–T12',region:'T10 = umbilicus. T12 = inguinal ligament',color:'#34d399',
    clinical:'Beevor\'s sign (umbilicus moves up) = T10 intact. T12 injury → preserved hip flexion but absent cremasteric reflex. Lumbar disc disease starts here.',
    reflex:'Lower abdominal reflex (T10–T12)'},
  'L1-L2':{level:'L1–L2',region:'Inguinal region, scrotum/labia, upper anterior thigh',color:'#ffb347',
    clinical:'Meralgia paraesthetica = lateral cutaneous nerve (L2/3) trapped at inguinal ligament → burning lateral thigh. Hernia repair can injure ilioinguinal (L1).',
    reflex:'Cremasteric reflex (L1/2)'},
  'L3':{level:'L3',region:'Anterior and medial thigh',color:'#4a9eff',
    clinical:'L3 radiculopathy: anterior thigh pain, weak knee extension (quadriceps), diminished knee jerk. Femoral nerve stretch test positive (prone, flex knee).',
    reflex:'Knee jerk (L3/4)'},
  'L4':{level:'L4',region:'Medial leg, medial ankle, dorsum of foot',color:'#00d4aa',
    clinical:'L4 root: medial leg numbness + weak ankle dorsiflexion (tibialis anterior) + absent/diminished knee jerk. L3/4 disc most common at this level.',
    reflex:'Knee jerk (L3/4)'},
  'L5':{level:'L5',region:'Lateral leg, dorsum of foot, great toe',color:'#a78bfa',
    clinical:'L5 radiculopathy (L4/5 disc): dorsum foot pain, foot drop (weak EHL + tibialis anterior), lateral leg numbness. No reflex lost (no L5 reflex).',
    reflex:'No specific reflex (L5 has no reliable peripheral reflex)'},
  'S1':{level:'S1',region:'Lateral and plantar foot, little toe, posterior calf',color:'#f4547a',
    clinical:'Classic sciatica (L5/S1 disc): posterior leg pain to lateral foot, absent ankle jerk, cannot tip-toe. SLR positive. S1 is the most common root in disc prolapse.',
    reflex:'Ankle jerk (S1)'},
};

function showDerm(key){
  const d=DERM_DATA[key];
  if(!d) return;
  document.getElementById('derm-info').innerHTML=`
    <div class="derm-level" style="color:${d.color}">${d.level}</div>
    <div class="derm-region">${d.region}</div>
    <div class="derm-clinical" style="margin-top:8px">${d.clinical}</div>
    <div style="margin-top:10px;padding:8px;background:var(--surf3);border-radius:8px">
      <div style="font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">Reflex</div>
      <div style="font-size:12px">${d.reflex}</div>
    </div>`;
}

// Spinal tracts
const TRACT_DATA={
  dc:{name:'Dorsal Columns (DC)',color:'#00d4aa',
    carries:'Fine touch, vibration, proprioception, 2-point discrimination',
    decussates:'In the medulla (at nucleus gracilis/cuneatus) — ipsilateral in cord',
    lesion:'Ipsilateral loss of fine touch + proprioception below lesion. Romberg positive. Sensory ataxia. Positive Lhermitte sign (MS, B12 deficiency, cord compression).',
    tracts:'Gracile fasciculus (legs, medial), Cuneate fasciculus (arms, lateral)',
    causes:'B12 deficiency (subacute combined degeneration), MS, tabes dorsalis (syphilis), Friedreich\'s ataxia, cervical spondylosis'},
  lcst:{name:'Lateral Corticospinal Tract (LCST)',color:'#f4547a',
    carries:'Voluntary motor commands from motor cortex to spinal cord anterior horn cells',
    decussates:'In the medulla (pyramidal decussation) — ipsilateral in cord below decussation',
    lesion:'UMN signs IPSILATERAL below lesion: spasticity, hyperreflexia, upgoing plantars (Babinski+), weakness, clonus. NO muscle wasting early.',
    tracts:'90% of fibres decussate in medulla. 10% stay ipsilateral (anterior CST).',
    causes:'Stroke, MS, motor neuron disease, cord compression, trauma'},
  stt:{name:'Spinothalamic Tract (STT)',color:'#4a9eff',
    carries:'Pain, temperature, crude touch, pressure',
    decussates:'Within 1–2 spinal cord levels after entering — CONTRALATERAL in cord',
    lesion:'CONTRALATERAL loss of pain and temperature below lesion. Preserved fine touch/proprioception (dorsal columns intact) = dissociated sensory loss.',
    tracts:'Lateral STT (pain/temp), Anterior STT (crude touch/pressure)',
    causes:'Syringomyelia (central cord: cape distribution), anterolateral cord lesion, Brown-Séquard (hemisection)'},
  gc:{name:'Gracile & Cuneate Fasciculi',color:'#a78bfa',
    carries:'Gracile: legs/trunk (medial). Cuneate: arms (lateral). Both carry DCML sensation.',
    decussates:'Ipsilateral in cord — decussate in medulla as dorsal column–medial lemniscus pathway',
    lesion:'Subacute combined degeneration of the cord (B12 deficiency): dorsal column + lateral CST lesion simultaneously = loss of proprioception/vibration + UMN signs.',
    tracts:'Part of the dorsal column system. Test: vibration (128Hz tuning fork), joint position sense, tandem gait.',
    causes:'Vitamin B12 deficiency, tabes dorsalis (posterior only), Friedreich\'s ataxia'},
};

const tractList=document.getElementById('tract-list');
Object.entries(TRACT_DATA).forEach(([k,t])=>{
  tractList.innerHTML+=`<div class="tract-item" onclick="selectTract('${k}')" id="ti-${k}">
    <div class="tract-dot" style="background:${t.color}"></div>
    <div><div class="tract-name" style="color:${t.color}">${t.name}</div><div class="tract-fn">${t.carries.substring(0,60)}…</div></div>
  </div>`;
});

function selectTract(key){
  const t=TRACT_DATA[key];
  document.querySelectorAll('.tract-item').forEach(i=>i.classList.remove('on'));
  const ti=document.getElementById('ti-'+key);
  if(ti) ti.classList.add('on');
  document.getElementById('tract-info').innerHTML=`
    <div class="cord-title" style="color:${t.color}">${t.name}</div>
    <div class="cord-desc" style="margin-bottom:8px"><strong style="color:var(--text)">Carries:</strong> ${t.carries}</div>
    <div class="cord-desc" style="margin-bottom:8px"><strong style="color:var(--text)">Decussates:</strong> ${t.decussates}</div>
    <div class="cord-desc" style="margin-bottom:8px"><strong style="color:var(--red)">Lesion → </strong>${t.lesion}</div>
    <div class="cord-desc"><strong style="color:var(--muted2)">Causes:</strong> ${t.causes}</div>`;
}

// Lesion localiser
const LL_SYMPTOMS=[
  {id:'foot_drop',icon:'🦶',name:'Foot Drop',
   dx:[
     {prob:'L4/5',text:'L4/5 disc prolapse or L5 root compression — most common. Check EHL, ankle dorsiflexion, L5 sensory (dorsum foot).'},
     {prob:'Peroneal',text:'Common peroneal nerve palsy at fibular neck (crossed legs, cast, weight loss). Purely foot drop, no proximal weakness.'},
     {prob:'Sciatic',text:'Sciatic nerve injury (hip replacement, posterior thigh trauma). Hamstrings also weak.'},
     {prob:'ALS',text:'Motor neuron disease — bilateral, progressive, UMN + LMN signs, no sensory loss.'},
   ]},
  {id:'saddle',icon:'🏇',name:'Saddle Numbness + Retention',
   dx:[
     {prob:'URGENT',text:'Cauda equina syndrome until proven otherwise. MRI lumbar spine urgently. Perineal numbness + urinary retention + bilateral leg weakness = surgical emergency.'},
     {prob:'S2–S4',text:'S2–S4 nerve roots supply bladder, anal sphincter, perineum. Loss = overflow incontinence + saddle anaesthesia.'},
     {prob:'Conus',text:'Conus medullaris lesion (T12–L1): UMN bladder + LMN features in legs. Mixed picture.'},
   ]},
  {id:'brown_sequard',icon:'⚡',name:'Half-Body Weakness + Crossed Sensory Loss',
   dx:[
     {prob:'Brown-Séquard',text:'Cord hemisection: IPSILATERAL weakness (CST) + IPSILATERAL proprioception loss (DC). CONTRALATERAL pain/temp loss (STT). Rare but important!'},
     {prob:'Causes',text:'Penetrating trauma (most common), MS plaque, epidural abscess, cord tumour, disc herniation.'},
   ]},
  {id:'cape_loss',icon:'🌊',name:'Cape Distribution Sensory Loss',
   dx:[
     {prob:'Syringomyelia',text:'Central cord cavity: interrupts crossing STT fibres → bilateral pain/temp loss in cape distribution (arms/shoulders). Preserved fine touch (DC intact = dissociated sensory loss).'},
     {prob:'Causes',text:'Chiari malformation (most common), trauma, tumour, idiopathic. MRI cord confirms. Associated with scoliosis.'},
     {prob:'Central cord',text:'Central cord syndrome (hyperextension injury in elderly): arms weaker than legs, bladder dysfunction.'},
   ]},
  {id:'paraparesis',icon:'🦯',name:'Bilateral Leg Weakness (Paraparesis)',
   dx:[
     {prob:'UMN',text:'Spastic paraparesis: cord compression, MS, transverse myelitis, B12 deficiency. UMN signs: hyperreflexia, upgoing plantars, spasticity.'},
     {prob:'LMN',text:'Flaccid paraparesis: Guillain-Barré (ascending, areflexic), cauda equina, polio. Absent reflexes, hypotonia.'},
     {prob:'Level',text:'Find the sensory level → identifies lesion height. T4 = nipples, T10 = umbilicus. MRI from suspected level.'},
   ]},
  {id:'wasted_hand',icon:'✋',name:'Wasted Small Hand Muscles',
   dx:[
     {prob:'T1 root',text:'C8/T1 lesion: interossei + hypothenar wasting. Pancoast tumour (apex lung) = T1 + Horner\'s + shoulder pain.'},
     {prob:'Ulnar',text:'Ulnar nerve palsy (cubital tunnel): hypothenar + interossei wasting, claw hand (ring/little). Sensation little finger.'},
     {prob:'Median',text:'Carpal tunnel syndrome: thenar wasting, sensory loss thumb/index/middle. Worse at night. Tinel\'s + Phalen\'s positive.'},
     {prob:'MND',text:'Motor neuron disease: bilateral, progressive, fasciculations visible. UMN signs elsewhere (brisk reflexes despite wasting = combination sign).'},
   ]},
  {id:'paraesthesia_glove',icon:'🧤',name:'Glove-Stocking Paraesthesia',
   dx:[
     {prob:'Peripheral',text:'Peripheral polyneuropathy: length-dependent. Starts in feet, ascends symmetrically. Causes: diabetes (most common), alcohol, B12 deficiency, uraemia, chemotherapy.'},
     {prob:'Metabolic',text:'Check: HbA1c, B12, folate, TFTs, U&E, LFTs, SPEP (myeloma), HIV.'},
     {prob:'Hereditary',text:'Charcot-Marie-Tooth if young onset + pes cavus + distal wasting + family history.'},
   ]},
  {id:'horners',icon:'👁️',name:"Horner's Syndrome",
   dx:[
     {prob:'T1 root',text:'Pancoast tumour at lung apex = most common cause of Horner\'s + hand wasting. CXR/CT chest urgently.'},
     {prob:'Carotid',text:'Carotid artery dissection: painful Horner\'s + ipsilateral headache/neck pain. Urgent MRA.'},
     {prob:'Lateral medulla',text:'Wallenberg syndrome (PICA stroke): crossed sensory loss + Horner\'s + cerebellar signs + dysphagia + hoarseness.'},
     {prob:'Central',text:'Hypothalamic lesion, cord lesion above T1 (syrinx, MS, trauma).'},
   ]},
];

const llGrid=document.getElementById('ll-grid');
LL_SYMPTOMS.forEach(s=>{
  llGrid.innerHTML+=`<div class="ll-sym-btn" onclick="showLL('${s.id}',this)" id="llb-${s.id}">
    <div class="ll-sym-icon">${s.icon}</div>
    <div class="ll-sym-name">${s.name}</div>
  </div>`;
});

function showLL(id,el){
  document.querySelectorAll('.ll-sym-btn').forEach(b=>b.classList.remove('on'));
  el.classList.add('on');
  const s=LL_SYMPTOMS.find(x=>x.id===id);
  const res=document.getElementById('ll-result');
  res.classList.add('on');
  res.innerHTML=`<h4>${s.icon} ${s.name}</h4>${s.dx.map(d=>`
    <div class="ll-dx-row">
      <div class="ll-dx-prob" style="color:${d.prob==='URGENT'?'var(--red)':d.prob==='Causes'?'var(--muted2)':'var(--amber)'}">${d.prob}</div>
      <div class="ll-dx-text">${d.text}</div>
    </div>`).join('')}`;
}

// ═══════════════════ ECG TRAINER (EXPANDED) ═══════════════════
function switchECGMode(mode,el){
  document.querySelectorAll('.ecg-mode-btn').forEach(b=>b.classList.remove('on'));
  el.classList.add('on');
  ['read','quiz','blind'].forEach(m=>document.getElementById('ecgm-'+m).style.display=m===mode?'block':'none');
}

const ECG_RHYTHMS=[
  {id:'nsr',name:'Normal Sinus',icon:'💚',color:'#34d399',
   chips:['Rate 60–100','Regular','P→QRS 1:1','PR 120–200ms','QRS <120ms','Normal axis'],
   steps:[
     {n:'Rate',v:'72 bpm — normal',note:'300 ÷ large squares between R peaks. Or count 6s strip × 10. Normal 60–100.'},
     {n:'Rhythm',v:'Regular',note:'R-R intervals equal. Measure with calipers or paper edge.'},
     {n:'P waves',v:'Upright, uniform, one before each QRS',note:'Positive in I, II, aVF = sinus origin. Negative P in aVR is normal.'},
     {n:'PR interval',v:'160ms — normal (4 small squares)',note:'120–200ms normal. >200ms = 1st degree AV block. <120ms = pre-excitation (WPW) or junctional.'},
     {n:'QRS duration',v:'80ms — narrow',note:'<120ms = supraventricular or normal conduction. >120ms = bundle branch block or ventricular origin.'},
     {n:'ST segment',v:'Isoelectric',note:'No elevation or depression at J-point. Look in all leads.'},
     {n:'T waves',v:'Upright in I, II, V3–V6',note:'Inverted T in V1–V2 can be normal. New T inversion in V1–V4 = anterior ischaemia.'},
     {n:'QT interval',v:'~360ms — normal QTc',note:'Correct for rate: QTc = QT ÷ √(RR in sec). Normal <440ms male, <460ms female.'},
   ],
   diagnosis:'Normal sinus rhythm. Rate 72bpm. All intervals, morphology and axis within normal limits.',
   mgmt:'No treatment required.'},
  {id:'af',name:'Atrial Fibrillation',icon:'⚡',color:'#ffb347',
   chips:['Irregularly irregular','No P waves','Fibrillatory baseline','Variable rate'],
   steps:[
     {n:'Rate',v:'Variable — AV node conducts randomly',note:'Uncontrolled AF: 110–160bpm. Rate-controlled target: <100bpm at rest.'},
     {n:'Rhythm',v:'IRREGULARLY irregular — key finding',note:'No two R-R intervals equal. Distinguish from regularly irregular (bigeminy) or sinus arrhythmia.'},
     {n:'P waves',v:'ABSENT — fibrillatory f-waves',note:'Chaotic atrial activity 350–600bpm. Fine fibrillation may be subtle — look in V1 and II.'},
     {n:'PR interval',v:'Not measurable',note:'No consistent AV relationship.'},
     {n:'QRS',v:'Usually narrow',note:'Wide QRS in AF = AF + BBB or AF + WPW (DANGER — do not use AV nodal blockers).'},
     {n:'Key differential',v:'AF vs AFL',note:'Atrial flutter: regular sawtooth baseline ~300bpm, ventricular rate usually 150bpm (2:1 block). Completely regular = flutter until proven otherwise.'},
   ],
   diagnosis:'Atrial fibrillation — irregularly irregular rhythm with absent P waves and fibrillatory baseline.',
   mgmt:'1. Rate control: beta-blocker (metoprolol) or digoxin (if HF). 2. CHA₂DS₂-VA ≥2 → anticoagulate (DOAC preferred). 3. Cardioversion if <48h or TOE-guided. 4. Treat precipitant (sepsis, thyrotoxicosis, PE, ACS).'},
  {id:'svt',name:'SVT (AVNRT)',icon:'🔺',color:'#4a9eff',
   chips:['Rate 150–250','Regular','Narrow QRS','Retrograde P waves'],
   steps:[
     {n:'Rate',v:'180–220 bpm — sudden onset',note:'Paroxysmal — sudden onset/offset. "PSVT" — paroxysmal supraventricular tachycardia.'},
     {n:'Rhythm',v:'Regular — distinguishes from AF',note:''},
     {n:'P waves',v:'Buried in QRS or just after (retrograde)',note:'Pseudo-R\' in V1 or pseudo-S in II, III — retrograde P from AVNRT. Short RP interval (<70ms).'},
     {n:'QRS',v:'Narrow <120ms',note:'Supraventricular origin — both ventricles activated via normal His-Purkinje.'},
     {n:'ST/T',v:'Rate-related ST depression possible',note:'Not necessarily ischaemic at HR>150.'},
     {n:'Vagal response',v:'Slows/terminates SVT',note:'Carotid sinus massage or Valsalva → slowing confirms SVT (distinguishes from VT).'},
   ],
   diagnosis:'Supraventricular tachycardia — AVNRT most likely. Regular narrow-complex tachycardia at ~200bpm.',
   mgmt:'1. Modified Valsalva (semi-recumbent, strain 40mmHg × 15s, then supine leg raise). 2. Adenosine 6mg rapid IV + fast flush — warn patient of chest tightening. 3. If fails: 12mg adenosine. 4. Unstable: synchronised cardioversion. 5. Recurrent: electrophysiology study + catheter ablation (curative >95%).'},
  {id:'vt',name:'Ventricular Tachycardia',icon:'🔴',color:'#f4547a',
   chips:['WIDE QRS >120ms','Rate 100–250','AV dissociation','Treat as VT until proven otherwise'],
   steps:[
     {n:'Rate',v:'150–200 bpm typical',note:'Monomorphic VT: regular. Polymorphic/Torsades: irregular and changing QRS axis.'},
     {n:'Rhythm',v:'Regular (monomorphic)',note:''},
     {n:'P waves',v:'AV dissociation — independent P waves',note:'P waves march through QRS independently. Capture beats (normal QRS during VT) and fusion beats are PATHOGNOMONIC of VT.'},
     {n:'QRS',v:'WIDE >120ms — bizarre morphology',note:'Brugada criteria: (1) No RS in chest leads, (2) RS>100ms in any chest lead, (3) AV dissociation, (4) Morphology criteria.'},
     {n:'Concordance',v:'All chest leads same direction',note:'All positive (positive concordance) or all negative = VT. Strongly suggests VT.'},
     {n:'Axis',v:'Extreme axis deviation ("northwest")',note:'QRS axis −90° to ±180° (negative in I AND aVF) = very suggestive of VT.'},
   ],
   diagnosis:'Ventricular tachycardia — wide complex regular tachycardia with AV dissociation. EMERGENCY until proven otherwise.',
   mgmt:'Pulseless VT → CPR + defibrillate 200J immediately. Pulse + unstable → synchronised DC cardioversion. Pulse + stable → amiodarone 300mg IV over 20-60min. Correct reversible causes (K⁺, Mg²⁺, ischaemia). Long-term: ICD, electrophysiology.'},
  {id:'vf',name:'Ventricular Fibrillation',icon:'💀',color:'#f4547a',
   chips:['Chaotic','No QRS','Cardiac arrest','SHOCKABLE'],
   steps:[
     {n:'Rate',v:'No organised rate — cardiac arrest',note:'No cardiac output. Patient is in cardiac arrest.'},
     {n:'Rhythm',v:'Completely chaotic undulations',note:'No QRS complexes. Coarse VF (large amplitude) = more recently arrested. Fine VF = prolonged arrest, worse prognosis.'},
     {n:'Management',v:'IMMEDIATE CPR + DEFIBRILLATION',note:'Do NOT spend time analysing — recognise and act.'},
   ],
   diagnosis:'Ventricular fibrillation — shockable cardiac arrest rhythm.',
   mgmt:'ALS: CPR 30:2 (100–120/min, 5–6cm depth). Defibrillate 200J biphasic as soon as available. After 3rd shock: adrenaline 1mg IV + amiodarone 300mg IV. Continue CPR. 4Hs (hypoxia, hypovolaemia, hypo/hyperkalaemia, hypothermia) + 4Ts (tension PTX, tamponade, toxins, thrombosis).'},
  {id:'wpw',name:'Wolff-Parkinson-White',icon:'⚠️',color:'#a78bfa',
   chips:['Short PR <120ms','Delta wave','Wide QRS','Pre-excitation pattern'],
   steps:[
     {n:'PR interval',v:'SHORT <120ms — hallmark',note:'Accessory pathway (Bundle of Kent) bypasses AV node → early ventricular activation = short PR.'},
     {n:'Delta wave',v:'Slurred initial upstroke of QRS',note:'Delta wave = pre-excitation. Degree of delta wave depends on how much of ventricle activates via accessory pathway.'},
     {n:'QRS',v:'Widened (pre-excitation component)',note:'Combination of normal conduction + accessory pathway = widened, slurred QRS.'},
     {n:'ST/T',v:'Secondary changes — discordant',note:'Do NOT interpret as ischaemia — secondary to abnormal depolarisation.'},
     {n:'WPW + AF',v:'DANGEROUS — broad irregular tachycardia',note:'AF with WPW: rapid conduction via accessory pathway → ventricular rate >300bpm → VF risk. NEVER use AV nodal blockers (adenosine, verapamil, digoxin) — can precipitate VF.'},
   ],
   diagnosis:'WPW pre-excitation pattern: short PR + delta wave + widened QRS. Assess for symptoms.',
   mgmt:'Asymptomatic: EP study for risk stratification. SVT with WPW: flecainide or procainamide (not adenosine). WPW + AF: DC cardioversion or procainamide IV — NEVER adenosine/verapamil/digoxin. Definitive: catheter ablation (>95% cure). Screen first-degree relatives.'},
  {id:'brugada',name:'Brugada Syndrome',icon:'🌊',color:'#a78bfa',
   chips:['Type 1 coved ST V1–V2','RBBB morphology','Normal rate','Sudden death risk'],
   steps:[
     {n:'Rate/Rhythm',v:'Normal sinus in baseline ECG',note:'Brugada is an ECG pattern — paroxysmal VF occurs unpredictably, often at rest or sleep.'},
     {n:'Key finding',v:'TYPE 1: coved ST elevation ≥2mm in V1–V3',note:'Coved pattern = downsloping ST elevation with inverted T wave. Saddle-back (Type 2/3) requires sodium channel blocker provocation to confirm.'},
     {n:'QRS morphology',v:'RBBB-like pattern in V1',note:'Right bundle morphology due to RV conduction delay. But different from true RBBB.'},
     {n:'PR/QRS',v:'May be prolonged (conduction disease)',note:'SCN5A mutations also cause sick sinus syndrome and AV block.'},
     {n:'Dynamic pattern',v:'Unmasked by fever, drugs, or vagal',note:'Always check ECG during fever. Fever = risk of VF. Sodium channel blockers (flecainide challenge) can provoke Type 1 pattern.'},
   ],
   diagnosis:'Brugada syndrome Type 1 — coved ST elevation ≥2mm in V1–V2 with RBBB morphology.',
   mgmt:'Urgent electrophysiology referral. Symptomatic (VF/syncope) → ICD. Avoid: Na⁺ channel blockers, cocaine, excessive alcohol, fever (treat aggressively with paracetamol). Quinidine for VF storm. Genetic testing (SCN5A). Screen family members.'},
  {id:'lqt',name:'Long QT Syndrome',icon:'📏',color:'#ffb347',
   chips:['QTc >440ms male','>460ms female','T wave abnormal','Torsades risk'],
   steps:[
     {n:'QT interval',v:'Measure in II or V5',note:'Start of QRS → end of T wave. Correct for rate: QTc = QT ÷ √RR(seconds). Bazett formula.'},
     {n:'QTc threshold',v:'>440ms male, >460ms female',note:'>500ms = very high Torsades risk. Threshold lower with bradycardia.'},
     {n:'T wave morphology',v:'LQT1: broad-based. LQT2: notched/biphasic. LQT3: peaked late',note:'T wave morphology can suggest subtype. LQT3 has normal-appearing T wave with long isoelectric ST.'},
     {n:'U waves',v:'Prominent U waves (after T wave)',note:'U wave >T wave = possible hypokalaemia or LQTS.'},
     {n:'Torsades de Pointes',v:'Polymorphic VT twisting around baseline',note:'Self-terminating (syncope) or degenerates to VF (cardiac arrest). Characteristic twisting QRS axis.'},
   ],
   diagnosis:'Long QT syndrome — QTc prolonged beyond normal limits with risk of Torsades de Pointes.',
   mgmt:'Drug-induced: stop offending drug (antipsychotics, macrolides, fluoroquinolones, methadone, amiodarone). Correct K⁺ >4.5, Mg²⁺ >0.9. Acute TdP: IV Mg sulphate 2g over 10min. Congenital LQTS: beta-blocker (nadolol), avoid QT drugs. High-risk: ICD, left cardiac sympathetic denervation.'},
  {id:'heart_block1',name:'1st Degree AV Block',icon:'⏱️',color:'#34d399',
   chips:['PR >200ms','Every P conducts','Regular','Usually benign'],
   steps:[
     {n:'Rate',v:'Normal',note:''},
     {n:'Rhythm',v:'Regular',note:'Every P wave conducts to a QRS — just delayed.'},
     {n:'PR interval',v:'PROLONGED >200ms (>5 small squares)',note:'Constant PR in each beat — distinguishes from Mobitz I (progressive lengthening).'},
     {n:'QRS',v:'Normal unless coexisting bundle branch block',note:''},
     {n:'Significance',v:'Usually benign — delayed AV conduction',note:'Causes: athletic training (vagal), beta-blockers, digoxin, hyperkalaemia, Lyme disease, inferior MI (if new). New PR >300ms = monitor.'},
   ],
   diagnosis:'1st degree AV block — PR interval prolonged >200ms but all P waves conduct.',
   mgmt:'Usually no treatment required. Review medications (beta-blockers, digoxin, calcium channel blockers). Investigate if new and symptomatic. If PR >300ms or symptoms: cardiology review.'},
  {id:'heart_block2m1',name:'2nd Degree Mobitz I (Wenckebach)',icon:'📉',color:'#ffb347',
   chips:['Progressive PR lengthening','Dropped QRS','Grouped beats','Usually benign'],
   steps:[
     {n:'Rate',v:'Ventricular rate < atrial rate',note:'Grouped beating pattern (e.g. 3:2 or 4:3 conduction).'},
     {n:'Rhythm',v:'Regularly irregular — groups of beats',note:'Characteristic Wenckebach "pattern" — R-R gets shorter before the dropped beat.'},
     {n:'PR interval',v:'PROGRESSIVELY LENGTHENS then QRS drops',note:'Key feature. After dropped QRS, PR resets to shortest. Cycle repeats.'},
     {n:'Dropped QRS',v:'P wave not followed by QRS (blocked)',note:'AV node fatigues progressively until one impulse is blocked, then recovers.'},
     {n:'Site of block',v:'AV node (nodal) — usually responsive to atropine',note:'Distinguish from Mobitz II (infranodal) which is more dangerous.'},
   ],
   diagnosis:'2nd degree AV block Mobitz type I (Wenckebach) — progressive PR lengthening with periodically dropped QRS.',
   mgmt:'Usually benign — often vagal or inferior MI. Monitor. If symptomatic bradycardia: atropine 0.5mg IV. If persistent/symptomatic: temporary pacing. Inferior STEMI: usually resolves. Anterior STEMI with Mobitz I → higher risk of complete block.'},
  {id:'heart_block3',name:'Complete Heart Block',icon:'🚫',color:'#f4547a',
   chips:['P and QRS independent','Escape rhythm 30–50bpm','AV dissociation','EMERGENCY'],
   steps:[
     {n:'Atrial rate',v:'60–100 bpm (normal P rate)',note:'P waves march through at their own rate.'},
     {n:'Ventricular rate',v:'30–50 bpm escape',note:'Junctional escape: 40–60bpm narrow QRS (more reliable). Ventricular escape: 20–40bpm wide QRS (less reliable, high risk asystole).'},
     {n:'Rhythm',v:'Both P and QRS are independently regular',note:'Neither interacts with the other — complete AV dissociation.'},
     {n:'PR interval',v:'VARIABLE — no constant relationship',note:'Pathognomonic of complete heart block. PR changes beat to beat.'},
     {n:'QRS',v:'Wide = ventricular escape (infranodal). Narrow = junctional.',note:'Wide escape = unreliable, prone to asystole. Narrow = more stable but still needs pacing.'},
   ],
   diagnosis:'Complete (3rd degree) AV block — complete AV dissociation with ventricular escape rhythm.',
   mgmt:'EMERGENCY. Transcutaneous pacing immediately. Atropine 0.5–1mg IV (may not work if infranodal). Urgent transvenous pacing. Causes: inferior MI (RCA), Lyme disease, digoxin toxicity, structural disease, post-cardiac surgery. Permanent pacemaker required.'},
  {id:'stemi_ant',name:'Anterior STEMI',icon:'❤️‍🔥',color:'#f4547a',
   chips:['ST elevation V1–V4','LAD territory','New LBBB equivalent','PCI <90 min'],
   steps:[
     {n:'ST elevation',v:'≥1mm in V1–V4 (≥2mm in V2–V3)',note:'Anterior STEMI = LAD territory. Compare with old ECG if available.'},
     {n:'Reciprocal changes',v:'ST depression inferiorly (II, III, aVF)',note:'Reciprocal changes confirm true STEMI vs early repolarisation.'},
     {n:'Q waves',v:'Developing Q waves V1–V4',note:'Pathological Q: >40ms wide OR >25% of R wave height. Develop over hours → indicate transmural infarction.'},
     {n:'T waves',v:'Hyperacute T waves early → T inversion later',note:'Tall peaked T waves in first minutes (hyperacute). Inverted T after reperfusion.'},
     {n:'LBBB',v:'New LBBB = STEMI equivalent',note:'New (or presumed new) LBBB with chest pain = activate cath lab. Sgarbossa criteria help if old LBBB present.'},
   ],
   diagnosis:'Anterior STEMI — ST elevation V1–V4, LAD occlusion. Cardiac emergency.',
   mgmt:'Activate cath lab. MONA: Morphine 2.5–5mg IV, O₂ only if SpO₂<94%, Nitrates (not if hypotensive/RV MI), Aspirin 300mg PO. Ticagrelor 180mg + anticoagulation (UFH). Primary PCI door-to-balloon <90min. Complications: LV failure, VT/VF, complete heart block, free wall rupture, papillary muscle rupture (acute MR), Dressler syndrome.'},
  {id:'stemi_inf',name:'Inferior STEMI',icon:'❤️‍🔥',color:'#f4547a',
   chips:['ST elevation II, III, aVF','RCA territory','Check RV leads','Avoid nitrates if RV infarct'],
   steps:[
     {n:'ST elevation',v:'≥1mm in II, III, aVF',note:'Inferior STEMI = RCA in 80%, LCx in 20%.'},
     {n:'Reciprocal changes',v:'ST depression in I and aVL',note:'Reciprocal depression confirms inferior STEMI. If also V1–V2 ST depression → posterior extension.'},
     {n:'RV infarction',v:'Check right-sided leads (V3R–V4R)',note:'ST elevation ≥1mm in V4R = RV infarction in ~30–50% inferior STEMI. Critical: avoid nitrates and diuretics.'},
     {n:'AV block risk',v:'Monitor PR interval carefully',note:'RCA supplies AV node in 90% — inferior STEMI → heart block risk. Often responsive to atropine (nodal).'},
     {n:'Posterior extension',v:'ST depression V1–V2 + tall R waves',note:'Posterior MI: look for tall R in V1–V2 with ST depression (mirror of posterior ST elevation).'},
   ],
   diagnosis:'Inferior STEMI — ST elevation in II, III, aVF with reciprocal changes in I/aVL. RCA occlusion most likely.',
   mgmt:'Activate cath lab. Same as anterior STEMI but: (1) RIGHT-SIDED ECG to check V4R — if RV MI: fluid resuscitate (avoid nitrates, avoid diuretics, avoid ACEi acutely); (2) Monitor PR interval — heart block may need atropine or pacing; (3) Primary PCI as for anterior STEMI.'},
  {id:'lbbb',name:'Left Bundle Branch Block',icon:'↙️',color:'#4a9eff',
   chips:['QRS ≥120ms','Broad notched R in I/aVL/V5-6','Deep S in V1','Always investigate new LBBB'],
   steps:[
     {n:'QRS duration',v:'≥120ms (≥3 small squares)',note:'Broad QRS from slow left ventricular activation via right bundle + myocardium.'},
     {n:'V1',v:'rS pattern — deep S wave',note:'Small r then deep S in V1 (or QS pattern).'},
     {n:'V5-V6',v:'Broad notched R wave (M-shaped)',note:'Classic "RSR\'" or broad monophasic R in left lateral leads.'},
     {n:'ST/T discordance',v:'ST and T opposite to main QRS deflection',note:'Secondary changes — do NOT interpret as ischaemia. Exception: concordant ST elevation = Sgarbossa criterion for STEMI.'},
     {n:'New vs old',v:'ALWAYS compare with previous ECG',note:'New LBBB with chest pain = STEMI equivalent — treat accordingly. LBBB masks acute MI changes.'},
   ],
   diagnosis:'Left bundle branch block — QRS ≥120ms with typical LBBB morphology.',
   mgmt:'Investigate underlying cause: coronary artery disease, dilated cardiomyopathy, hypertension, aortic stenosis. New LBBB + chest pain = treat as STEMI. Cardiac resynchronisation therapy (CRT) for symptomatic HF with LBBB and EF <35%.'},
  {id:'rbbb',name:'Right Bundle Branch Block',icon:'↗️',color:'#4a9eff',
   chips:['QRS ≥120ms','RSR\' in V1 ("M-shaped")','Wide S in I/V5-V6','Common — often benign'],
   steps:[
     {n:'QRS duration',v:'≥120ms',note:'Broad from delayed RV activation (left bundle activates LV first, then RV activated via myocardium).'},
     {n:'V1',v:'RSR\' pattern — "M-shaped" or "rabbit ears"',note:'Classic RBBB morphology. R\' = delayed RV activation.'},
     {n:'V5-V6 / Lead I',v:'Wide slurred S wave',note:'Broad S wave from late RV depolarisation.'},
     {n:'ST/T',v:'Discordant (opposite to R\')',note:'T inversion in V1–V3 is expected in RBBB — secondary change.'},
     {n:'Significance',v:'Can be isolated finding or associated with pathology',note:'Isolated RBBB: often benign (athletes, elderly). New RBBB + anterior MI = proximal LAD lesion (poor prognosis). Brugada: RBBB-like morphology in V1.'},
   ],
   diagnosis:'Right bundle branch block — QRS ≥120ms with RSR\' in V1 and broad S in I/V5–V6.',
   mgmt:'Isolated RBBB without symptoms: often no treatment needed. Investigate for: PE (new RBBB + tachycardia + RV strain), ASD, anterior MI. Bifascicular block (RBBB + left axis) → higher risk of complete block → monitor.'},
  {id:'aflutter',name:'Atrial Flutter',icon:'🌊',color:'#ffb347',
   chips:['Regular sawtooth baseline','Atrial rate ~300bpm','2:1 conduction → HR ~150','Variable block'],
   steps:[
     {n:'Rate',v:'Ventricular: usually 150bpm (2:1 block)',note:'Regular ventricular rate ~150bpm = atrial flutter with 2:1 block until proven otherwise. Can also be 3:1 (~100) or 4:1 (~75).'},
     {n:'Rhythm',v:'REGULAR — distinguishes from AF',note:'Completely regular ventricular response (in stable block). Irregularly irregular = AF not flutter.'},
     {n:'P waves',v:'Sawtooth flutter waves (F waves) ~300bpm',note:'Best seen in II, III, aVF and V1. "Inverted sawtooth" — look behind QRS and T. May be hard to see in 2:1 flutter.'},
     {n:'Trick',v:'Carotid massage or adenosine → unmasked',note:'Slowing AV conduction reveals flutter waves clearly — diagnostic and therapeutic manoeuvre.'},
   ],
   diagnosis:'Atrial flutter — regular sawtooth flutter waves at ~300bpm with 2:1 AV block (ventricular rate ~150bpm).',
   mgmt:'Rate control: AV nodal blockers (beta-blocker, diltiazem). Flutter is more resistant to pharmacological cardioversion than AF. DC cardioversion highly effective. Radiofrequency ablation of cavotricuspid isthmus is curative (>95%). Anticoagulation same as AF.'},
  {id:'hyperk',name:'Hyperkalaemia',icon:'⚗️',color:'#34d399',
   chips:['Peaked T waves','Widened QRS','Flattened P waves','Sine wave pattern (severe)'],
   steps:[
     {n:'Early (K⁺ 5.5–6.5)',v:'Peaked narrow-based T waves',note:'Tall, narrow, symmetrical T waves — most prominent in precordial leads. "Tented" T waves.'},
     {n:'Moderate (K⁺ 6.5–7.5)',v:'Flattened P waves, PR prolongation, wide QRS',note:'P waves may disappear (sino-ventricular conduction). QRS widens progressively.'},
     {n:'Severe (K⁺ >7.5)',v:'Sine wave pattern → VF/asystole',note:'QRS and T waves merge into sinusoidal pattern. Cardiac arrest imminent.'},
     {n:'Management ECG triggers',v:'Act on ECG regardless of symptoms',note:'ECG changes may precede symptoms. Treat when K⁺ >6.0 AND/OR ECG changes present.'},
   ],
   diagnosis:'Hyperkalaemia ECG changes — peaked T waves progressing to widened QRS and potential sine wave pattern.',
   mgmt:'Cardiac membrane stabilisation: calcium gluconate 10mL 10% IV over 10min (if ECG changes). Shift K⁺ intracellularly: insulin 10 units IV + 50mL 50% dextrose; salbutamol nebuliser 10–20mg. Remove K⁺: furosemide, calcium resonium, dialysis (if renal failure). Check: renal function, medications (ACEi, spironolactone, NSAIDs), rhabdomyolysis.'},
];

// Build ECG picker
const ecgtPickerEl=document.getElementById('ecgt-picker');
ECG_RHYTHMS.forEach((r,i)=>{
  ecgtPickerEl.innerHTML+=`<div style="background:var(--surf);border:1px solid var(--border);border-radius:12px;padding:12px 10px;cursor:pointer;text-align:center;transition:all .15s" onclick="showECGT(${i})" id="ecgpick-${i}">
    <div style="font-size:20px;margin-bottom:5px">${r.icon}</div>
    <div style="font-size:11px;font-weight:600;line-height:1.3">${r.name}</div>
  </div>`;
});

function showECGT(i){
  document.querySelectorAll('[id^="ecgpick-"]').forEach(b=>b.style.borderColor='var(--border)');
  document.getElementById('ecgpick-'+i).style.borderColor=ECG_RHYTHMS[i].color;
  const r=ECG_RHYTHMS[i];
  document.getElementById('ecgt-analysis').style.display='block';
  document.getElementById('ecgt-chips').innerHTML=r.chips.map(c=>`<span class="ecg-chip hi">${c}</span>`).join('');
  document.getElementById('ecgt-steps').innerHTML=r.steps.map(s=>`<div class="ecg-step"><div class="ecg-step-num">${s.n}</div><div class="ecg-step-val">${s.v}</div>${s.note?`<div class="ecg-step-note">${s.note}</div>`:''}</div>`).join('');
  document.getElementById('ecgt-diagnosis').textContent=r.diagnosis;
  document.getElementById('ecgt-mgmt').innerHTML=r.mgmt;
  drawECGPattern(r.id,r.color);
  document.getElementById('ecgt-analysis').scrollIntoView({behavior:'smooth',block:'nearest'});
}

// ═══ ECG QUIZ DATA & BUILDER (restored) ═══
const ECGT_QUIZ=[
  {q:'A 72-year-old with palpitations. ECG: irregular rhythm, no P waves, fibrillatory baseline, HR 130. What rhythm?',opts:['Atrial flutter with variable block','Atrial fibrillation','Multifocal atrial tachycardia','Sinus tachycardia'],ans:1,exp:'AF: irregularly irregular + absent P waves + fibrillatory baseline. HR >100 = uncontrolled AF. Priorities: rate control, CHA₂DS₂-VA score, treat precipitant (thyrotoxicosis, PE, sepsis).'},
  {q:'Sudden regular tachycardia 210bpm, narrow QRS, pseudo-R\' visible in V1. Most likely diagnosis?',opts:['Sinus tachycardia','VT','AVNRT (SVT)','Atrial flutter 2:1'],ans:2,exp:'AVNRT: regular narrow-complex tachycardia with retrograde P buried in/just after QRS (pseudo-R\' in V1). Treatment: modified Valsalva → adenosine 6mg rapid IV.'},
  {q:'Wide-complex regular tachycardia 180bpm. AV dissociation visible. Capture beat seen. Diagnosis?',opts:['SVT with aberrancy','AF with BBB','Ventricular tachycardia','Accelerated junctional rhythm'],ans:2,exp:'VT: wide-complex + AV dissociation + capture beats = VT until proven otherwise. Treat as VT. Pulseless → defibrillate. Stable → amiodarone.'},
  {q:'24-year-old syncope during sport. Short PR 100ms, delta wave, widened QRS. Key clinical danger?',opts:['Brugada — fever triggers VF','WPW — AF can conduct rapidly via accessory pathway → VF. Never give AV nodal blockers in WPW+AF','Hypertrophic cardiomyopathy — needs ECHO','1st degree AV block — benign'],ans:1,exp:'WPW: short PR + delta wave. If AF develops, rapid accessory pathway conduction can trigger VF. Never use adenosine/verapamil/digoxin in WPW+AF. Refer for EP study and ablation.'},
  {q:'ECG: coved ST elevation ≥2mm in V1–V2 with RBBB morphology. Syncope during sleep. Diagnosis?',opts:['Anterior STEMI','RBBB + early repolarisation','Brugada syndrome Type 1','Pericarditis'],ans:2,exp:'Brugada Type 1: coved ST elevation ≥2mm V1–V3 + RBBB morphology = diagnostic. Fever/cocaine/Na+ blockers unmask it. High SCD risk → EP referral, ICD if symptomatic.'},
  {q:'QTc 530ms. Patient on haloperidol, K⁺ 2.8mmol/L. What arrhythmia risk?',opts:['AF','Torsades de Pointes → VF','Complete heart block','AF with rapid ventricular response'],ans:1,exp:'Prolonged QTc >500ms + hypokalaemia + QT-prolonging drug = high TdP risk. Stop drug, correct K⁺ >4.5 and Mg²⁺, IV magnesium 2g for acute TdP.'},
  {q:'Regular rate 150bpm exactly. Sawtooth baseline between QRS in II/III/aVF. Ventricular rate = half atrial rate. Diagnosis?',opts:['Sinus tachycardia','AF','Atrial flutter with 2:1 block','Junctional tachycardia'],ans:2,exp:'Atrial flutter 2:1: atrial rate ~300bpm, 2:1 block → ventricular rate 150bpm. Regular sawtooth F-waves best in II/III/aVF. Ablation of cavotricuspid isthmus curative.'},
  {q:'PR interval gradually lengthens over several beats then one QRS drops, then cycle resets. Diagnosis?',opts:['Complete heart block','2nd degree Mobitz I (Wenckebach)','2nd degree Mobitz II','1st degree AV block'],ans:1,exp:'Wenckebach: progressive PR → dropped QRS → reset. Grouped beats. AV nodal level — usually benign. Distinguish from Mobitz II (fixed PR, sudden drop) which needs pacing.'},
  {q:'Peaked narrow T waves V1–V4. QRS 160ms. P waves barely visible. K⁺ 7.2mmol/L. Most urgent treatment?',opts:['Furosemide IV','Calcium gluconate 10mL 10% IV — membrane stabilisation first','Insulin alone','Sodium bicarbonate IV'],ans:1,exp:'Hyperkalaemia with ECG changes: calcium gluconate IV first — stabilises membrane in 1–3 min. THEN insulin+dextrose and salbutamol to shift K+ intracellularly. THEN remove K+ (dialysis if anuric).'},
  {q:'QRS ≥120ms. Broad notched R in I/aVL/V5–V6. Deep S in V1. Discordant ST/T. Sinus rhythm. Diagnosis?',opts:['Right bundle branch block','Left bundle branch block','Hyperkalaemia','WPW'],ans:1,exp:'LBBB: M-shaped R in I/aVL/V5–V6, rS/QS in V1, discordant ST/T. New LBBB + chest pain = STEMI equivalent. Causes: CAD, dilated cardiomyopathy, hypertension, AS.'},
  {q:'ST elevation ≥1mm in II, III, aVF. ST depression in I and aVL. BP 80/50. What must be excluded immediately?',opts:['LV aneurysm — echo urgently','RV infarction — right-sided ECG (V4R), avoid nitrates and diuretics','Posterior extension — no action','Pericarditis — ibuprofen'],ans:1,exp:'Inferior STEMI + hypotension = RV infarction until proven otherwise. V4R elevation ≥1mm confirms it. Preload-dependent: give IV fluids, avoid nitrates (severe hypotension) and diuretics.'},
  {q:'P waves at 80bpm, QRS at 38bpm, no relationship between them. Wide QRS. Most urgent action?',opts:['1st degree AV block — observe','Wenckebach — atropine if symptomatic','Complete heart block — transcutaneous pacing now','Mobitz II — observe'],ans:2,exp:'Complete heart block: AV dissociation + ventricular escape. Wide QRS = infranodal escape, unreliable. Emergency: transcutaneous pacing immediately. Causes: inferior MI, Lyme disease, digoxin toxicity.'},
];

let ecgtQA={};
function buildECGTQuiz(){
  const el=document.getElementById('ecgt-quiz-body');
  el.innerHTML=ECGT_QUIZ.map((q,i)=>`
    <div style="background:var(--surf);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:10px">
      <div style="font-size:14px;font-weight:600;margin-bottom:12px;line-height:1.5">Q${i+1}. ${q.q}</div>
      <div>${q.opts.map((o,j)=>`<button class="ecgt-quiz-opt" onclick="answerECGT(${i},${j})" id="eqo-${i}-${j}">${o}</button>`).join('')}</div>
      <div style="display:none;margin-top:8px;padding:10px;background:rgba(0,0,0,.3);border-radius:9px;font-size:12px;color:var(--muted2);line-height:1.55" id="eqe-${i}">${q.exp}</div>
    </div>`).join('')+`
    <div id="ecgt-quiz-score" style="display:none;text-align:center;padding:20px">
      <div style="font-family:'Syne',sans-serif;font-size:52px;font-weight:800;color:var(--green)" id="eqs-val"></div>
      <div style="color:var(--muted2);font-size:13px;margin-top:6px">questions correct</div>
      <button class="btn btn-teal" style="margin-top:16px;width:auto;padding:12px 28px" onclick="resetECGTQuiz()">↺ Retake</button>
    </div>`;
  ecgtQA={};
}
buildECGTQuiz();

function answerECGT(qi,oi){
  if(ecgtQA[qi]!==undefined) return;
  ecgtQA[qi]=oi;
  const q=ECGT_QUIZ[qi];
  for(let j=0;j<q.opts.length;j++){
    const b=document.getElementById(`eqo-${qi}-${j}`);if(!b)continue;
    b.disabled=true;
    if(j===q.ans) b.classList.add(oi===j?'correct':'reveal');
    else if(j===+oi) b.classList.add('wrong');
  }
  document.getElementById(`eqe-${qi}`).style.display='block';
  if(Object.keys(ecgtQA).length===ECGT_QUIZ.length){
    const sc=Object.entries(ecgtQA).filter(([i,v])=>ECGT_QUIZ[i].ans===+v).length;
    const p=document.getElementById('ecgt-quiz-score');
    p.style.display='block';
    document.getElementById('eqs-val').textContent=`${sc}/${ECGT_QUIZ.length}`;
    p.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
}
function resetECGTQuiz(){ buildECGTQuiz(); }

// ═══ BLIND ID ANSWER HANDLER (restored) ═══
function answerBlind(id,btn){
  if(blindAnswered) return;
  blindAnswered=true;
  blindScore.total++;
  const correct=(id===blindCurrent.id);
  if(correct) blindScore.right++;
  document.getElementById('blind-score').textContent=`${blindScore.right} / ${blindScore.total}`;
  document.querySelectorAll('[id^="bo-"]').forEach(b=>{
    b.disabled=true;
    const bid=b.id.replace('bo-','');
    if(bid===blindCurrent.id) b.classList.add('correct');
    else if(b===btn&&!correct) b.classList.add('wrong');
  });
  const fb=document.getElementById('blind-feedback');
  if(fb){
    fb.style.display='block';
    fb.innerHTML=`<strong style="color:${correct?'var(--teal)':'var(--red)'}">${correct?'✓ Correct!':'✗ Incorrect'}</strong> — <strong>${blindCurrent.name}</strong><br><br>${blindCurrent.diagnosis}<br><br><span style="color:var(--amber)">Key management:</span> ${blindCurrent.mgmt.substring(0,220)}…`;
  }
  const stats=document.getElementById('blind-stats');
  if(stats){
    stats.style.display='block';
    stats.innerHTML=`<div style="margin-top:10px;font-size:11px;color:var(--muted2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Key features</div>`+blindCurrent.chips.map(c=>`<div class="ecg-stat-row"><span class="ecg-stat-key">•</span><span class="ecg-stat-val">${c}</span></div>`).join('');
  }
}
const DRUGS=[
  // ANTIARRHYTHMICS
  {name:'Amiodarone',class:'Class III antiarrhythmic',cat:'Antiarrhythmic',
   moa:'Blocks K⁺ channels (prolongs action potential) + some Na⁺, Ca²⁺, beta-blocking activity',
   ind:'VT, VF (cardiac arrest), AF rate/rhythm control, SVT prevention',
   dose:'IV: 300mg bolus (cardiac arrest) / 150mg over 10min then infusion. Oral: 200mg TDS loading → 100–200mg OD maintenance',
   ci:'Thyroid disease (iodine content), pulmonary disease, iodine allergy, bradycardia/AV block (without pacemaker)',
   se:['Thyroid dysfunction (hypo AND hyper)','Pulmonary toxicity (fibrosis)','Photosensitivity / grey-blue skin','Corneal microdeposits','Hepatotoxicity','Peripheral neuropathy','Bradycardia, QT prolongation'],
   monitor:'TFTs, LFTs, CXR, PFTs, ECG — every 6 months',
   topic:'T1'},
  {name:'Metoprolol',class:'Beta-1 selective blocker',cat:'Antiarrhythmic',
   moa:'Competitive beta-1 adrenoreceptor antagonist → reduces HR, AV conduction, contractility',
   ind:'AF rate control, SVT, hypertension, post-MI cardioprotection, heart failure (bisoprolol preferred)',
   dose:'AF rate control: 25–50mg oral BD-TDS. IV: 5mg slow IV (repeat x3 at 5 min intervals)',
   ci:'Severe bradycardia, 2nd/3rd degree AV block, decompensated heart failure, asthma (relative)',
   se:['Bradycardia','Hypotension','Fatigue','Bronchospasm (less than non-selective)','Cold peripheries','Masking hypoglycaemia signs'],
   monitor:'HR, BP, blood glucose (diabetics)',topic:'T1'},
  {name:'Digoxin',class:'Cardiac glycoside',cat:'Antiarrhythmic',
   moa:'Na/K ATPase inhibitor → increased intracellular Ca²⁺ → positive inotropy. Vagal enhancement → reduced AV conduction (rate control)',
   ind:'AF rate control (especially in heart failure + AF), heart failure with reduced EF (HFrEF)',
   dose:'250 micrograms OD (reduce in elderly, renal impairment). Loading: 0.5mg IV then 0.25mg q6h x2',
   ci:'WPW (can accelerate accessory pathway), 2nd/3rd degree AV block, hypertrophic obstructive cardiomyopathy',
   se:['Narrow therapeutic index — toxicity common','Nausea, vomiting, anorexia (early toxicity)','Xanthopsia (yellow vision)','AV block, AF → any arrhythmia (toxicity)','Hypokalaemia potentiates toxicity'],
   monitor:'Digoxin level (therapeutic 1–2 nmol/L), K⁺, Cr, ECG',topic:'T1'},
  {name:'Warfarin',class:'Vitamin K antagonist anticoagulant',cat:'Anticoagulant',
   moa:'Inhibits vitamin K epoxide reductase → reduces synthesis of factors II, VII, IX, X, Protein C and S',
   ind:'AF (stroke prevention), mechanical heart valves, VTE treatment and prevention',
   dose:'Variable — target INR 2–3 (AF, VTE) or 2.5–3.5 (mechanical mitral valve)',
   ci:'Active bleeding, pregnancy (teratogenic), severe hepatic disease',
   se:['Bleeding (major risk)','Warfarin skin necrosis (Protein C deficiency)','Osteoporosis (long-term)','Many drug and food interactions (vitamin K foods)'],
   monitor:'INR (2–3 target), regular review of interacting medications',topic:'T1'},
  {name:'Rivaroxaban',class:'Direct oral anticoagulant (DOAC) — Factor Xa inhibitor',cat:'Anticoagulant',
   moa:'Direct reversible inhibition of Factor Xa → prevents thrombin generation',
   ind:'AF stroke prevention, VTE treatment/prevention, post-surgical prophylaxis',
   dose:'AF: 20mg OD with evening meal (15mg OD if CrCl 15–49). VTE treatment: 15mg BD x21d then 20mg OD',
   ci:'CrCl <15mL/min, active bleeding, pregnancy',
   se:['Bleeding','No routine monitoring required — advantage over warfarin','Cannot use standard coagulation tests to monitor'],
   monitor:'Renal function annually (more frequently if CKD), Hb if bleeding concern',topic:'T1'},
  // DMARDs
  {name:'Methotrexate',class:'Conventional synthetic DMARD (csDMARD) / antimetabolite',cat:'DMARD',
   moa:'Inhibits dihydrofolate reductase → reduces rapidly dividing cells and inflammatory cytokines. Immunosuppressive at low weekly doses.',
   ind:'Rheumatoid arthritis (first-line csDMARD), psoriatic arthritis, SLE, vasculitis, inflammatory myopathy',
   dose:'RA: 10–25mg ONCE WEEKLY orally or SC. ALWAYS take with folic acid 5mg once weekly (on different day) to reduce toxicity.',
   ci:'Pregnancy (teratogenic), breastfeeding, significant hepatic/renal disease, immunodeficiency, pleural effusion/ascites (drug accumulates)',
   se:['Mucositis/mouth ulcers (folic acid reduces)','Nausea (take at night, anti-emetics)','Hepatotoxicity (cumulative — monitor LFTs)','Pneumonitis (hypersensitivity — STOP if new dyspnoea)','Bone marrow suppression (cytopaenia)','Teratogenicity — contraception essential'],
   monitor:'FBC, LFTs, Cr at baseline then every 1–3 months. Annual CXR if lung disease risk.',topic:'T4'},
  {name:'Hydroxychloroquine',class:'Antimalarial / csDMARD',cat:'DMARD',
   moa:'Alkalinises lysosomes → reduces inflammatory cytokine release. Immunomodulatory.',
   ind:'RA (often combined with MTX), SLE (reduces flares and mortality), sjögren\'s syndrome',
   dose:'200–400mg OD. Maximum 5mg/kg/day (to reduce retinal toxicity risk)',
   ci:'Known retinal disease, G6PD deficiency, porphyria',
   se:['Retinal toxicity (risk increases after 5+ years or >5mg/kg/day — irreversible macular damage)','GI disturbance','Skin pigmentation','QT prolongation (rare)'],
   monitor:'Annual ophthalmology review (fundus + OCT) after 5 years. Baseline eye exam.',topic:'T4'},
  {name:'Adalimumab',class:'Biologic DMARD — TNF-alpha inhibitor (monoclonal antibody)',cat:'DMARD',
   moa:'Fully human monoclonal antibody against TNF-alpha → blocks inflammatory cascade',
   ind:'RA (failed ≥1 csDMARD), psoriatic arthritis, ankylosing spondylitis, Crohn\'s disease, UC',
   dose:'40mg SC every 2 weeks (can increase to weekly in Crohn\'s)',
   ci:'Active serious infection, active TB or latent TB (must treat first), active hepatitis B, moderate-severe heart failure',
   se:['Serious infections (bacterial, TB reactivation, fungal)','Injection site reactions','Demyelination (avoid in MS)','Lupus-like syndrome','Malignancy risk (lymphoma — uncertain)','Worsening heart failure'],
   monitor:'Screen for TB (QFT/Mantoux + CXR), Hep B serology, FBC, LFTs before starting. Annual TB screen.',topic:'T4'},
  {name:'Prednisolone',class:'Corticosteroid (glucocorticoid)',cat:'Steroid',
   moa:'Binds glucocorticoid receptor → anti-inflammatory, immunosuppressive, anti-oedema effects. Wide metabolic effects.',
   ind:'Acute inflammation, autoimmune disease (RA flare, SLE, vasculitis, PMR), organ transplant, Addison\'s disease (replacement), anaphylaxis, raised ICP',
   dose:'PMR: 15–25mg OD. RA flare: 5–15mg OD. High-dose: 1mg/kg/day. Addisonian crisis: hydrocortisone 100mg IV',
   ci:'Active untreated infection (relative), live vaccines (avoid), systemic fungal infections',
   se:['Adrenal suppression (taper don\'t stop suddenly)','Osteoporosis (give Ca²⁺ + Vit D + bisphosphonate if >3 months)','Diabetes/worsening hyperglycaemia','Cushing\'s syndrome (central obesity, striae, hirsutism)','Peptic ulceration (use PPI)','Immunosuppression','Cataracts/glaucoma','Myopathy','Psychiatric effects (steroid psychosis)'],
   monitor:'BGL, BP, weight, bone density (DEXA if >3 months use)',topic:'T4'},
  // ANTIEPILEPTICS
  {name:'Levetiracetam',class:'Antiepileptic (SV2A modulator)',cat:'Antiepileptic',
   moa:'Binds synaptic vesicle protein SV2A → modulates neurotransmitter release',
   ind:'First-line for focal and generalised seizures, status epilepticus (IV formulation)',
   dose:'500–1500mg BD orally. IV status: 1000–3000mg over 15 min',
   ci:'No absolute contraindications. Caution in renal impairment.',
   se:['Behavioural disturbance (irritability, aggression — "Keppra rage")','Somnolence','Headache','Generally well tolerated'],
   monitor:'Renal function (dose reduce if CKD). No therapeutic drug monitoring routinely required.',topic:'T3'},
  {name:'Sodium Valproate',class:'Antiepileptic (broad spectrum)',cat:'Antiepileptic',
   moa:'Enhances GABA, blocks Na⁺ channels, inhibits histone deacetylase',
   ind:'Generalised epilepsy (absence, tonic-clonic), Juvenile myoclonic epilepsy (drug of choice), bipolar disorder, migraine prophylaxis',
   dose:'400–2000mg/day divided BD',
   ci:'TERATOGENIC — AVOID in women of childbearing age (Neural tube defects, cognitive impairment). Hepatic disease, pancreatitis, porphyria.',
   se:['TERATOGENIC — neural tube defects, autism, cognitive impairment (Fetal Valproate Syndrome)','Weight gain','Tremor','Hair loss','Hepatotoxicity (rare but fatal in young children)','Pancreatitis','Thrombocytopaenia'],
   monitor:'LFTs, FBC, valproate levels, weight. Annual DEXA (bone density).',topic:'T3'},
  {name:'Carbamazepine',class:'Antiepileptic (Na⁺ channel blocker)',cat:'Antiepileptic',
   moa:'Blocks voltage-gated Na⁺ channels → reduces repetitive firing of action potentials',
   ind:'Focal (partial) seizures, trigeminal neuralgia (drug of choice), bipolar disorder',
   dose:'100–200mg BD, increasing to 400–600mg BD. Monitor levels.',
   ci:'Avoid in absence/myoclonic epilepsy (can worsen), bone marrow depression, AV block. HLA-B*15:02 genotype (Stevens-Johnson syndrome in Asian patients — must test before prescribing)',
   se:['Drowsiness, ataxia, diplopia (dose-related)','Hyponatraemia (SIADH)','Stevens-Johnson syndrome (rare but severe — genetic risk)','Agranulocytosis, aplastic anaemia (rare)','Hepatotoxicity','Teratogenic (cleft palate, spina bifida)','Auto-induction — accelerates own metabolism'],
   monitor:'Carbamazepine levels (target 4–12 mg/L), FBC, LFTs, Na⁺, HLA-B*15:02 before starting.',topic:'T3'},
  // CHEMOTHERAPY
  {name:'Cyclophosphamide',class:'Alkylating agent chemotherapy',cat:'Chemotherapy',
   moa:'Cross-links DNA strands → inhibits DNA replication → cell death (cycle non-specific)',
   ind:'Lymphoma (part of CHOP/R-CHOP), leukaemia, ovarian cancer, breast cancer, vasculitis, lupus nephritis, myositis',
   dose:'Variable — depends on protocol (e.g. CHOP: 750mg/m² IV day 1 each cycle)',
   ci:'Severe bone marrow suppression, active severe infection, haemorrhagic cystitis',
   se:['Haemorrhagic cystitis — PREVENT with adequate hydration + mesna (uroprotective agent)','Bone marrow suppression (neutropaenia — infection risk)','Nausea/vomiting','Alopecia','Gonadotoxicity (infertility — offer sperm/egg banking before treatment)','Secondary malignancy (AML, bladder cancer — delayed)','SIADH (hyponatraemia)'],
   monitor:'FBC (nadir 10–14 days), urine (haematuria), LFTs, renal function, urinalysis before each cycle.',topic:'T6'},
  {name:'Doxorubicin',class:'Anthracycline / topoisomerase II inhibitor',cat:'Chemotherapy',
   moa:'Intercalates DNA + inhibits topoisomerase II + generates free radicals → DNA damage and cell death',
   ind:'Lymphoma (ABVD/CHOP), breast cancer, sarcoma, leukaemia',
   dose:'Variable — protocol dependent. CHOP: 50mg/m² IV day 1',
   ci:'Severe hepatic impairment (reduce dose), prior anthracycline therapy approaching lifetime cumulative dose limit',
   se:['CARDIOTOXICITY — cardiomyopathy/HF. Cumulative lifetime dose limit (450–550mg/m² — risk increases above this)','Alopecia (predictable, reversible)','Nausea/vomiting','Bone marrow suppression','Stomatitis','Red discolouration of urine (not haematuria — warn patient)','Vesicant — extravasation causes severe tissue necrosis'],
   monitor:'ECHO/MUGA (cardiac function) before and during treatment. FBC, LFTs. Cumulative dose tracking.',topic:'T6'},
  {name:'Osimertinib',class:'3rd generation EGFR tyrosine kinase inhibitor',cat:'Chemotherapy',
   moa:'Irreversible selective inhibitor of EGFR with activating mutations (exon 19 del, L858R) and T790M resistance mutation',
   ind:'1st-line NSCLC with EGFR mutation (FLAURA trial), NSCLC with T790M resistance mutation after prior EGFR-TKI',
   dose:'80mg OD orally',
   ci:'QT prolongation (use caution), interstitial lung disease',
   se:['Diarrhoea','Rash (acneiform)','Dry skin/nails — paronychia','ILD/pneumonitis (rare but serious — stop immediately if suspected)','QT prolongation','Cardiomyopathy (rare)'],
   monitor:'ECG (QTc at baseline and periodically), LFTs, chest symptoms (ILD surveillance).',topic:'T6'},
];

const DRUG_CATS=['All',...new Set(DRUGS.map(d=>d.cat))];
let activeDrugCat='All',drugSearch='';

const drugCatsEl=document.getElementById('drug-cats');
DRUG_CATS.forEach(c=>{
  drugCatsEl.innerHTML+=`<div class="dcat-btn${c==='All'?' on':''}" onclick="setDrugCat('${c}',this)">${c}</div>`;
});

function setDrugCat(cat,el){
  activeDrugCat=cat;
  document.querySelectorAll('.dcat-btn').forEach(b=>b.classList.remove('on'));
  el.classList.add('on');
  renderDrugs();
}
function filterDrugs(v){drugSearch=v.toLowerCase();renderDrugs();}
function renderDrugs(){
  const list=document.getElementById('drug-list');
  const filtered=DRUGS.filter(d=>(activeDrugCat==='All'||d.cat===activeDrugCat)&&(!drugSearch||(d.name+d.class+d.ind).toLowerCase().includes(drugSearch)));
  list.innerHTML=filtered.map((d,i)=>`
    <div class="drug-card" id="dc-${i}" onclick="toggleDrug(${i})">
      <div class="drug-name">${d.name}</div>
      <div class="drug-class">${d.class} · <span style="color:var(--amber);font-size:10px;font-weight:700">${d.cat}</span></div>
      <div class="drug-detail" id="dd-${i}">
        <div class="drug-row"><span class="drug-row-k">Mechanism</span><span class="drug-row-v">${d.moa}</span></div>
        <div class="drug-row"><span class="drug-row-k">Indications</span><span class="drug-row-v">${d.ind}</span></div>
        <div class="drug-row"><span class="drug-row-k">Dose</span><span class="drug-row-v">${d.dose}</span></div>
        <div class="drug-row"><span class="drug-row-k">Cautions/CI</span><span class="drug-row-v">${d.ci}</span></div>
        <div class="drug-row"><span class="drug-row-k">Side Effects</span><span class="drug-row-v">${d.se.map(s=>`<span class="drug-se">${s}</span>`).join('')}</span></div>
        <div class="drug-row"><span class="drug-row-k">Monitoring</span><span class="drug-row-v">${d.monitor}</span></div>
      </div>
    </div>`).join('');
}
let openDrug=null;
function toggleDrug(i){
  if(openDrug!==null){document.getElementById('dd-'+openDrug).classList.remove('on');document.getElementById('dc-'+openDrug).classList.remove('open');}
  if(openDrug===i){openDrug=null;return;}
  openDrug=i;
  document.getElementById('dd-'+i).classList.add('on');
  document.getElementById('dc-'+i).classList.add('open');
}
renderDrugs();

// ═══════════════════ INVESTIGATIONS TRAINER ═══════════════════
const IX_CATS=['FBC & Iron','LFTs & Liver','TFTs','ABG','CSF','Synovial Fluid','Urine Dipstick','Tumour Markers'];
const IX_PANELS_DATA={
  'FBC & Iron':[
    {stem:'A 28-year-old female teacher presents with fatigue. FBC shows: Hb 82g/L, MCV 62fL, MCH 18pg, WCC 6.2, Plt 420.',
     results:[{k:'Hb',v:'82 g/L',cls:'abnormal'},{k:'MCV',v:'62 fL',cls:'abnormal'},{k:'MCH',v:'18 pg',cls:'abnormal'},{k:'WCC',v:'6.2 ×10⁹/L',cls:'ok'},{k:'Plt',v:'420 ×10⁹/L',cls:'ok'}],
     q:'What is the most likely diagnosis and what single test would you order next?',
     opts:['Normocytic anaemia — order B12/folate','Iron deficiency anaemia — order serum ferritin + iron studies','Anaemia of chronic disease — order CRP','Thalassaemia — order haemoglobin electrophoresis'],
     ans:1,exp:'Microcytic (MCV<80) hypochromic anaemia with reactive thrombocytosis = iron deficiency anaemia until proven otherwise. Commonest cause in pre-menopausal women: menstrual losses. Order ferritin (most sensitive marker of iron stores — low in IDA) + iron studies (low serum iron, high TIBC). Then investigate for source of blood loss (colorectal cancer in older patients, coeliac disease).'},
    {stem:'A 72-year-old male with weight loss. FBC: Hb 94g/L, MCV 96fL (normocytic), WCC 3.8, Plt 98, reticulocytes low.',
     results:[{k:'Hb',v:'94 g/L',cls:'abnormal'},{k:'MCV',v:'96 fL',cls:'ok'},{k:'WCC',v:'3.8 ×10⁹/L',cls:'low'},{k:'Plt',v:'98 ×10⁹/L',cls:'abnormal'},{k:'Retics',v:'Low',cls:'abnormal'}],
     q:'Pancytopaenia in a 72-year-old with weight loss. What is the most important next investigation?',
     opts:['Serum iron — anaemia of chronic disease most likely','Bone marrow aspirate + trephine — pancytopaenia requires investigation for haematological malignancy or infiltration','Vitamin B12 and folate — macrocytic anaemia','Repeat FBC in 6 weeks'],
     ans:1,exp:'Pancytopaenia (low Hb + low WCC + low platelets) + age + weight loss = haematological malignancy until proven otherwise. Differential: aplastic anaemia, AML, MDS, infiltrating marrow (lymphoma, myeloma, metastatic cancer), B12/folate deficiency, hypersplenism. Bone marrow aspirate + trephine is the definitive investigation. Also send: B12, folate, LDH, blood film, immunoglobulins, SPEP.'},
  ],
  'LFTs & Liver':[
    {stem:'A 45-year-old male, heavy drinker. LFTs: ALT 68, AST 145, ALP 220, GGT 380, Bilirubin 42, Albumin 28, INR 1.8.',
     results:[{k:'ALT',v:'68 U/L',cls:'low'},{k:'AST',v:'145 U/L',cls:'abnormal'},{k:'ALP',v:'220 U/L',cls:'abnormal'},{k:'GGT',v:'380 U/L',cls:'abnormal'},{k:'Bili',v:'42 µmol/L',cls:'abnormal'},{k:'Albumin',v:'28 g/L',cls:'abnormal'}],
     q:'What pattern of liver disease does this represent and what is the AST:ALT ratio suggesting?',
     opts:['Viral hepatitis — ALT>AST typical, order Hep serology','Alcoholic liver disease — AST:ALT ratio >2:1, high GGT (alcohol marker), low albumin (synthetic failure)','Cholestatic pattern — ERCP indicated','Acute hepatic necrosis — transfer to liver unit immediately'],
     ans:1,exp:'Alcoholic liver disease: AST:ALT ratio >2:1 (due to mitochondrial damage and pyridoxal phosphate depletion — ALT synthesis requires it more). GGT markedly elevated = sensitive alcohol marker. Low albumin = hepatic synthetic failure (chronic disease). Raised ALP = cholestatic component from fatty infiltration. INR elevated = impaired clotting factor synthesis. This pattern indicates decompensated alcoholic liver disease.'},
    {stem:'A 30-year-old woman with jaundice and fatigue. LFTs: ALT 820, AST 640, ALP 180, Bilirubin 88, Albumin 38, INR 1.1.',
     results:[{k:'ALT',v:'820 U/L',cls:'abnormal'},{k:'AST',v:'640 U/L',cls:'abnormal'},{k:'ALP',v:'180 U/L',cls:'low'},{k:'Bili',v:'88 µmol/L',cls:'abnormal'},{k:'Albumin',v:'38 g/L',cls:'ok'},{k:'INR',v:'1.1',cls:'ok'}],
     q:'Markedly elevated transaminases, relatively preserved albumin and INR. What pattern is this and most likely cause?',
     opts:['Cholestatic hepatitis — ALP should be much higher','Hepatocellular pattern — acute viral hepatitis (send hepatitis A IgM, B sAg/cAb, HCV RNA, EBV, CMV)','Chronic liver disease — order liver biopsy immediately','Drug-induced — no further workup needed'],
     ans:1,exp:'Hepatocellular pattern: markedly elevated ALT/AST (>10× normal) with relatively mild ALP elevation. Preserved albumin and INR = still good synthetic function = acute rather than chronic. Young woman with acute hepatocellular injury: Hepatitis A (HAV IgM), Hepatitis B (HBsAg, anti-HBc IgM), HCV (RNA — may miss early), Wilson\'s disease (caeruloplasmin, serum copper, slit-lamp — must exclude in young!), autoimmune hepatitis (ANA, anti-smooth muscle Ab), paracetamol toxicity.'},
  ],
  'TFTs':[
    {stem:'A 58-year-old male with fatigue, weight gain, constipation and slowed cognition for 6 months.',
     results:[{k:'TSH',v:'42 mU/L',cls:'abnormal'},{k:'fT4',v:'4.2 pmol/L',cls:'abnormal'},{k:'fT3',v:'2.1 pmol/L',cls:'abnormal'},{k:'Anti-TPO',v:'Positive (high titre)',cls:'abnormal'}],
     q:'What is the diagnosis and most likely aetiology?',
     opts:['Subclinical hypothyroidism — TSH mildly elevated only','Primary hypothyroidism — Hashimoto\'s thyroiditis (autoimmune, anti-TPO positive)','Secondary hypothyroidism — pituitary failure (TSH would be low)','Sick euthyroid — no treatment needed'],
     ans:1,exp:'Primary hypothyroidism: high TSH (↑ pituitary drive) + low fT4 + low fT3. Anti-TPO positive = Hashimoto\'s thyroiditis (autoimmune destruction). Most common cause of hypothyroidism in iodine-sufficient countries. Treatment: levothyroxine (T4) — start low (25–50mcg OD) and titrate to TSH 0.5–2.0. Note: Secondary hypothyroidism (pituitary) = low TSH + low fT4. Sick euthyroid = low T3/T4 + inappropriately normal/low TSH in acute illness.'},
    {stem:'A 32-year-old woman with weight loss, palpitations, heat intolerance, exophthalmos and a goitre.',
     results:[{k:'TSH',v:'<0.01 mU/L',cls:'abnormal'},{k:'fT4',v:'44 pmol/L',cls:'abnormal'},{k:'fT3',v:'12 pmol/L',cls:'abnormal'},{k:'TSH-R Ab',v:'Strongly positive',cls:'abnormal'}],
     q:'What is the diagnosis and what does the strongly positive TSH receptor antibody confirm?',
     opts:['Toxic multinodular goitre — TSH-R Ab not relevant','Graves\' disease — TSH-R stimulating antibody drives thyroid overactivity and ophthalmopathy','Subacute thyroiditis — self-limiting, no antibodies','Thyroid cancer — refer for surgery immediately'],
     ans:1,exp:'Graves\' disease: suppressed TSH + elevated fT4 + fT3 + positive TSH receptor (stimulating) antibodies (TRAb). TRAb confirms Graves\' (not toxic MNG or adenoma). Exophthalmos (proptosis) = Graves\' ophthalmopathy — mediated by same TRAb cross-reacting with orbital fibroblasts. Treatment options: antithyroid drugs (carbimazole), radioiodine, thyroidectomy. Ophthalmopathy: selenium, IV methylprednisolone, orbital decompression.'},
  ],
  'ABG':[
    {stem:'A 25-year-old asthmatic, RR 32, SpO₂ 88% on 8L O₂. pH 7.22, pCO₂ 62, pO₂ 52, HCO₃ 24, BE -2.',
     results:[{k:'pH',v:'7.22',cls:'abnormal'},{k:'pCO₂',v:'62 mmHg',cls:'abnormal'},{k:'pO₂',v:'52 mmHg',cls:'abnormal'},{k:'HCO₃',v:'24 mmol/L',cls:'ok'},{k:'BE',v:'-2',cls:'ok'}],
     q:'Interpret this ABG. What does a NORMAL bicarbonate in a severe asthmatic with high CO₂ indicate?',
     opts:['Metabolic alkalosis compensating — patient is fine','Type II respiratory failure + acute respiratory acidosis. Normal HCO₃ = NO compensation yet = VERY ACUTE = patient tiring rapidly. Intubation risk high.','Chronic respiratory acidosis — patient is compensated and stable','Normal ABG — oxygen therapy is sufficient'],
     ans:1,exp:'Type II respiratory failure: pO₂ low + pCO₂ high = hypoxaemia + hypercapnia. pH 7.22 = acidosis. Primary = respiratory (CO₂↑). Normal HCO₃ = NO metabolic compensation = acute CO₂ retention. CRITICAL SIGN in severe acute asthma: CO₂ rising to normal/high = patient is tiring (cannot maintain the hyperventilation that kept CO₂ low). This patient is peri-arrest. Urgent ITU review, NIV or intubation, IV salbutamol, magnesium 2g IV, HDU.'},
    {stem:'A 68-year-old COPD patient admitted with drowsiness. pH 7.35, pCO₂ 72, pO₂ 58, HCO₃ 38, BE +10.',
     results:[{k:'pH',v:'7.35',cls:'low'},{k:'pCO₂',v:'72 mmHg',cls:'abnormal'},{k:'pO₂',v:'58 mmHg',cls:'abnormal'},{k:'HCO₃',v:'38 mmol/L',cls:'abnormal'},{k:'BE',v:'+10',cls:'abnormal'}],
     q:'Interpret this ABG and what does the elevated bicarbonate indicate?',
     opts:['Acute respiratory acidosis — uncompensated, same as asthma above','Chronic respiratory acidosis with METABOLIC COMPENSATION — HCO₃ elevated (renal retention) indicating long-standing hypercapnia. pH near-normal = compensated.','Primary metabolic alkalosis with respiratory compensation','Normal for a COPD patient — no action needed'],
     ans:1,exp:'Chronic respiratory acidosis with metabolic compensation: pH near-normal (7.35) despite very high CO₂ (72) because kidneys have retained HCO₃ (38, elevated) over weeks-months. BE +10 = base excess (metabolic alkalosis component). This is the TYPICAL COPD "CO₂ retainer" pattern. The patient\'s baseline CO₂ is elevated. Management: controlled O₂ (24–28% Venturi target SpO₂ 88–92%), treat exacerbation (bronchodilators, steroids, antibiotics if infective), consider NIV if not improving.'},
  ],
  'CSF':[
    {stem:'A 19-year-old with fever 39.8°C, severe headache, neck stiffness and a purpuric rash. CSF: Opening pressure 32cmH₂O, appearance turbid/cloudy, WCC 2800 (98% neutrophils), protein 3.2g/L, glucose 1.1mmol/L (serum glucose 6.2 = CSF:serum ratio 0.18).',
     results:[{k:'Opening P',v:'32 cmH₂O',cls:'abnormal'},{k:'Appearance',v:'Turbid/cloudy',cls:'abnormal'},{k:'WCC',v:'2800/mm³ (neutrophils)',cls:'abnormal'},{k:'Protein',v:'3.2 g/L',cls:'abnormal'},{k:'CSF Glucose',v:'1.1 mmol/L (ratio 0.18)',cls:'abnormal'}],
     q:'What is the diagnosis and what empirical treatment must be given?',
     opts:['Viral meningitis — aciclovir and observation only','Bacterial meningitis — IV ceftriaxone 2g BD immediately + dexamethasone 0.15mg/kg QID. Do NOT delay for CT if no focal neurology.','TB meningitis — 4-drug anti-TB regimen','Subarachnoid haemorrhage — CT head urgently'],
     ans:1,exp:'Bacterial meningitis: turbid CSF + neutrophilic pleocytosis + very high protein + low glucose (CSF:serum <0.5 = bacteria consuming glucose) + elevated opening pressure. Purpuric rash = meningococcal disease (N. meningitidis). EMERGENCY: IV ceftriaxone immediately (don\'t wait for LP if CT needed or clinical deterioration). Dexamethasone reduces neurological sequelae (deafness, brain damage) — give with or before antibiotics. Notify public health. Contacts need prophylaxis (ciprofloxacin or rifampicin).'},
    {stem:'A 28-year-old with 3 days of headache, photophobia and fever (38.2°C). No rash. CSF: clear, WCC 180 (95% lymphocytes), protein 0.8g/L, glucose 3.4mmol/L (serum 5.6 = ratio 0.61), no organisms on gram stain.',
     results:[{k:'Appearance',v:'Clear',cls:'ok'},{k:'WCC',v:'180/mm³ (lymphocytes)',cls:'abnormal'},{k:'Protein',v:'0.8 g/L',cls:'low'},{k:'Glucose ratio',v:'0.61 (normal)',cls:'ok'},{k:'Gram stain',v:'No organisms',cls:'ok'}],
     q:'What does this CSF profile suggest and what is the most important investigation to order?',
     opts:['Bacterial meningitis — start ceftriaxone anyway','Viral (aseptic) meningitis — lymphocytic pleocytosis, normal glucose. Order CSF HSV PCR, enterovirus PCR, CMV PCR. Aciclovir empirically until HSV excluded.','TB meningitis — start 4-drug therapy','Normal CSF — patient can be discharged'],
     ans:1,exp:'Viral/aseptic meningitis: clear CSF + lymphocytic pleocytosis + mildly elevated protein + NORMAL glucose ratio (>0.5) + no organisms. Most common cause: enteroviruses (80%), HSV-2, VZV, EBV, CMV, HIV. KEY: must exclude HSV encephalitis (HSV PCR on CSF) — give IV aciclovir empirically until HSV excluded (HSV encephalitis: temporal lobe involvement, focal neurology, behavioural change). TB meningitis: lymphocytic + low glucose + very high protein + subacute course.'},
  ],
  'Synovial Fluid':[
    {stem:'A 58-year-old male with acute onset monoarthritis of right first MTP joint, severe pain, erythema and swelling. Synovial fluid: WCC 42,000 (90% neutrophils), appearance yellow/turbid, glucose low, crystals: negatively birefringent needle-shaped.',
     results:[{k:'Appearance',v:'Yellow/turbid',cls:'abnormal'},{k:'WCC',v:'42,000/mm³',cls:'abnormal'},{k:'Neutrophils',v:'90%',cls:'abnormal'},{k:'Crystals',v:'Negatively birefringent needles',cls:'abnormal'},{k:'Glucose',v:'Low',cls:'abnormal'}],
     q:'What is the diagnosis and how do you distinguish it from septic arthritis on synovial fluid analysis?',
     opts:['Pseudogout — positively birefringent rhomboid crystals','Gout — negatively birefringent needle-shaped monosodium urate crystals. Septic arthritis must be excluded: culture, gram stain. WCC>50,000 + organisms = septic. Crystal arthropathy and septic arthritis can COEXIST.',
       'Rheumatoid arthritis — inflammatory fluid','Normal joint — patient is drug-seeking'],
     ans:1,exp:'Gout: negatively birefringent needle-shaped monosodium urate crystals under polarised light (MSU). First MTP joint (podagra) classic. WCC 20,000–100,000 (inflammatory). CRITICAL: always send culture + gram stain — septic arthritis can coexist with gout. Septic arthritis: WCC >50,000–100,000, organisms on gram stain, glucose very low. Pseudogout: positively birefringent RHOMBOID-shaped calcium pyrophosphate crystals — affects knees, wrists. Treatment of gout: NSAIDs, colchicine, or prednisolone for acute attack. Allopurinol for prevention (not during acute attack).'},
  ],
  'Urine Dipstick':[
    {stem:'A 22-year-old woman with dysuria, frequency and suprapubic pain for 2 days. Urine dipstick: Nitrites +++, Leukocytes +++, Blood ++, Protein +.',
     results:[{k:'Nitrites',v:'+++',cls:'abnormal'},{k:'Leukocytes',v:'+++',cls:'abnormal'},{k:'Blood',v:'++',cls:'abnormal'},{k:'Protein',v:'+',cls:'low'},{k:'Glucose',v:'Negative',cls:'ok'}],
     q:'What does this dipstick indicate and when is a urine MC&S mandatory?',
     opts:['Renal cell carcinoma — urgent CT KUB','Uncomplicated UTI — treat empirically. MC&S mandatory if: pregnancy, male, recurrent UTI, upper tract symptoms (fever, loin pain), immunocompromised, recent hospitalisation, treatment failure.','Glomerulonephritis — refer nephrology','Asymptomatic bacteriuria — no treatment needed'],
     ans:1,exp:'Nitrites = bacteria (gram-negative rods convert nitrates to nitrites — does not detect enterococcus, staph). Leukocytes = pyuria = inflammation. Together = strong evidence of UTI. Blood + protein = mild inflammation. Uncomplicated UTI (young, non-pregnant, no comorbidities): empirical trimethoprim or nitrofurantoin, no MC&S needed. MC&S MANDATORY: pregnancy, male (always send — rule out pyelonephritis, prostatitis), recurrent/complicated UTI, treatment failure, systemic symptoms (pyelonephritis), hospitalised patients, immunocompromised, catheter-associated UTI.'},
    {stem:'A 68-year-old male with 3kg weight loss and back pain. Urine dipstick: Protein +++, Blood +. No nitrites.',
     results:[{k:'Protein',v:'+++',cls:'abnormal'},{k:'Blood',v:'+',cls:'low'},{k:'Nitrites',v:'Negative',cls:'ok'},{k:'Glucose',v:'Negative',cls:'ok'}],
     q:'Heavy proteinuria + haematuria + no infection + weight loss. What should be your primary concern and workup?',
     opts:['UTI — repeat dipstick after antibiotics','Multiple myeloma or glomerular disease — urgent: 24hr urine protein or spot PCR, serum protein electrophoresis (SPEP), serum free light chains, Bence Jones protein, renal function, FBC','Simple proteinuria — recheck in 3 months','Orthostatic proteinuria — no action needed (young patients only)'],
     ans:1,exp:'Heavy non-infective proteinuria + haematuria + weight loss + older male = red flags. Differential: multiple myeloma (SPEP/SFLC/Bence Jones protein — myeloma light chains not detected by dipstick), glomerulonephritis (nephrotic syndrome: >3.5g/day protein, oedema, hypoalbuminaemia), renal cell carcinoma, amyloidosis. Dipstick detects albumin but NOT Bence Jones protein (light chains) — must order SPEP and urine immunofixation separately. Urgent renal + haematology/oncology workup.'},
  ],
  'Tumour Markers':[
    {stem:'A 55-year-old male smoker with weight loss and haemoptysis. Serum results: CEA 48 (normal <5), CA19-9 12 (normal), NSE 68 (elevated), LDH 580.',
     results:[{k:'CEA',v:'48 ng/mL',cls:'abnormal'},{k:'CA19-9',v:'12 U/mL',cls:'ok'},{k:'NSE',v:'68 µg/L',cls:'abnormal'},{k:'LDH',v:'580 U/L',cls:'abnormal'}],
     q:'NSE and LDH elevated in a heavy smoker with haemoptysis. Which lung cancer subtype does this suggest?',
     opts:['Squamous cell carcinoma — CEA more specific','Small cell lung cancer (SCLC) — NSE and LDH are markers of SCLC. Paraneoplastic syndromes (SIADH, ACTH, LEMS) are SCLC-associated.','Mesothelioma — asbestos exposure needed','Carcinoid — NSE also elevated but indolent'],
     ans:1,exp:'NSE (neuron-specific enolase) is a neuroendocrine marker — elevated in SCLC (neuroendocrine origin). LDH reflects tumour bulk/turnover. SCLC: central, rapidly growing, early metastases, paraneoplastic syndromes (SIADH → hyponatraemia, ectopic ACTH → Cushing\'s, Lambert-Eaton → proximal weakness, anti-Hu → cerebellar degeneration). SCLC NOT resected (usually extensive at diagnosis) — chemotherapy (etoposide + carboplatin/cisplatin) ± immunotherapy. PSA = prostate cancer. AFP = HCC/germ cell. CA125 = ovarian. CEA = colorectal (monitoring, not screening).'},
  ],
};

// Build investigation panels
const ixCatsEl=document.getElementById('ix-cats');
const ixPanelsEl=document.getElementById('ix-panels');
IX_CATS.forEach((cat,ci)=>{
  ixCatsEl.innerHTML+=`<div class="ixcat${ci===0?' on':''}" onclick="switchIXCat('${cat}',this)">${cat}</div>`;
  const cases=IX_PANELS_DATA[cat]||[];
  let ixAnswers=[];
  const panelHTML=cases.map((c,qi)=>`
    <div class="ix-vignette" id="ixv-${ci}-${qi}">
      <div class="ix-vignette-stem">${c.stem}</div>
      <div class="ix-results-grid">${c.results.map(r=>`<div class="ix-result-chip"><div class="ix-result-k">${r.k}</div><div class="ix-result-v ${r.cls||''}">${r.v}</div></div>`).join('')}</div>
      <div class="ix-q">${c.q}</div>
      <div>${c.opts.map((o,oi)=>`<button class="ix-opt" onclick="answerIX('${ci}','${qi}',${oi})" id="ixo-${ci}-${qi}-${oi}">${o}</button>`).join('')}</div>
      <div class="ix-exp" id="ixe-${ci}-${qi}">${c.exp}</div>
    </div>`).join('');
  ixPanelsEl.innerHTML+=`<div class="ix-panel${ci===0?' on':''}" id="ixp-${ci}">${panelHTML}</div>`;
});

let ixAnswered={};
function switchIXCat(cat,el){
  document.querySelectorAll('.ixcat').forEach(b=>b.classList.remove('on'));
  el.classList.add('on');
  document.querySelectorAll('.ix-panel').forEach(p=>p.classList.remove('on'));
  const idx=IX_CATS.indexOf(cat);
  document.getElementById('ixp-'+idx).classList.add('on');
}
function answerIX(ci,qi,oi){
  const key=`${ci}-${qi}`;
  if(ixAnswered[key]!==undefined) return;
  const c=IX_PANELS_DATA[IX_CATS[ci]][qi];
  ixAnswered[key]=oi;
  for(let j=0;j<c.opts.length;j++){
    const b=document.getElementById(`ixo-${ci}-${qi}-${j}`);if(!b)continue;
    b.disabled=true;
    if(j===c.ans) b.classList.add(+oi===j?'correct':'reveal');
    else if(j===+oi) b.classList.add('wrong');
  }
  document.getElementById(`ixe-${ci}-${qi}`).classList.add('on');
}

// ═══════════════════ TOPIC CHECKLIST ═══════════════════
const CHK_TOPICS=[
  {name:'T1: Cardio & Resp',items:['Atrial fibrillation','Ventricular tachycardia','Supraventricular tachycardia','Heart block & pacing','Long QT syndrome','WPW / Brugada','Acute coronary syndromes','Mitral stenosis / regurgitation','Aortic stenosis / regurgitation','Infective endocarditis','Rheumatic heart disease','Heart failure (systolic & diastolic)','Hypertrophic cardiomyopathy','Pericarditis / tamponade','Pulmonary embolism','DVT','Pneumonia (CAP, HAP, aspiration)','COPD exacerbation','Asthma (acute & chronic)','Bronchiectasis','Cystic fibrosis','Pulmonary fibrosis / ILD','Sarcoidosis','Pleural effusion (Light criteria)','Pneumothorax','Tuberculosis','Obstructive sleep apnoea','Pulmonary hypertension','Lung abscess','Pulmonary vasculitis (GPA, EGPA)']},
  {name:'T2: Gastro & Renal',items:['GORD / H. pylori / peptic ulcer','Haematemesis (variceal vs non-variceal)','Inflammatory bowel disease (Crohn\'s / UC)','Colorectal cancer','Cirrhosis (compensated vs decompensated)','Hepatic encephalopathy','Hepatitis B & C','Primary biliary cholangitis / PSC','Acute liver failure','Acute kidney injury (AKI)','Chronic kidney disease (CKD)','Glomerulonephritis','AKI on CKD — electrolytes (K⁺, acidosis)','Rhabdomyolysis','Haemolytic uraemic syndrome','Renal replacement therapy (HD, PD, transplant)','Renal osteodystrophy']},
  {name:'T3: Neuro & Endocrine',items:['Ischaemic stroke / TIA','Subarachnoid haemorrhage','Subdural haematoma','Seizures & epilepsy (classification & Rx)','Meningitis / encephalitis (bacterial & viral)','Multiple sclerosis','Parkinson\'s disease','Myasthenia gravis','Guillain-Barré syndrome','Motor neuron disease','Peripheral neuropathy','Carpal tunnel / ulnar nerve palsy','Foot drop (L4/5 vs peroneal)','Cranial nerve palsies (III, VI, VII)','Horner\'s syndrome','Type 1 diabetes mellitus','Type 2 diabetes mellitus','Diabetic ketoacidosis (DKA)','Hypoglycaemia','Hypothyroidism / Hashimoto\'s','Hyperthyroidism / Graves\' disease','Thyroid storm','Adrenal insufficiency (Addison\'s / crisis)','Cushing\'s syndrome','Phaeochromocytoma','Hypercalcaemia (causes & emergency Rx)','Diabetes insipidus','Hyponatraemia (SIADH)']},
  {name:'T4: Rheuma & Palliative',items:['Rheumatoid arthritis (DAS28, DMARDs)','Systemic lupus erythematosus','Gout & pseudogout','Septic arthritis','Psoriatic arthritis / ankylosing spondylitis','Polymyalgia rheumatica','Giant cell arteritis','Vasculitis (large & small vessel)','Dermatomyositis / polymyositis','Osteoarthritis','Fibromyalgia','Delirium (prevention & management)','Falls (risk assessment & prevention)','Elder abuse (recognition & management)','Refeeding syndrome','Malnutrition in elderly','Signs of active dying','Anticipatory prescribing (end of life)','Goals of care & ACP','Opioid prescribing (WHO analgesic ladder)','Deprescribing in frail elderly']},
  {name:'T5: ID, Sexual Hlth & Derm',items:['Sepsis (recognition & bundles)','Community-acquired pneumonia (CURB-65)','Infectious gastroenteritis','Fever of unknown origin','HIV (acute retroviral syndrome, AIDS)','HIV opportunistic infections (PCP, CMV, MAC)','PrEP / PEP indications','STIs (chlamydia, gonorrhoea, syphilis)','Malaria','Tuberculosis (pulmonary & extra-pulmonary)','COVID-19','Melanoma & non-melanoma skin cancer','Dermatological signs of systemic disease','Drug hypersensitivity (SJS / TEN)','Anaphylaxis']},
  {name:'T6: Oncology & Haem',items:['Non-small cell lung cancer (staging, EGFR/ALK)','Small cell lung cancer (paraneoplastic)','Colorectal cancer (screening, staging)','Oncological emergencies (SVC, cord compression, hypercalcaemia)','Haemolytic anaemia (AIHA, oxidative)','Sickle cell disease','Polycythaemia vera','Hodgkin lymphoma (Ann Arbor, ABVD)','Non-Hodgkin lymphoma','Multiple myeloma (CRAB criteria)','AML / ALL (acute leukaemias)','CML / CLL (chronic leukaemias)','Pancytopenia (differential & workup)','Elevated ferritin (differential)','Thrombocytopaenia','VTE & hypercoagulable states','Tumour markers (CEA, PSA, AFP, CA125, NSE)']},
];

let chkState={};// key: topicIdx-itemIdx => 0,1,2 (not sure/partial/confident)
let currentChkTopic=0;

const chkTopicBtns=document.getElementById('chk-topic-btns');
CHK_TOPICS.forEach((t,i)=>{
  chkState[i]={};
  chkTopicBtns.innerHTML+=`<div class="chktopic${i===0?' on':''}" onclick="switchChkTopic(${i},this)">${t.name}</div>`;
});
renderChecklist(0);

function switchChkTopic(i,el){
  currentChkTopic=i;
  document.querySelectorAll('.chktopic').forEach(b=>b.classList.remove('on'));
  el.classList.add('on');
  renderChecklist(i);
}

function renderChecklist(ti){
  const topic=CHK_TOPICS[ti];
  document.getElementById('chk-prog-title').textContent=topic.name;
  const list=document.getElementById('chk-list');
  list.innerHTML=topic.items.map((item,ii)=>`
    <div class="chk-item">
      <div class="chk-item-name">${item}</div>
      <div class="conf-btns">
        <div class="conf-btn${chkState[ti][ii]===0?' on-0':''}" onclick="setConf(${ti},${ii},0)" title="Not sure">✗</div>
        <div class="conf-btn${chkState[ti][ii]===1?' on-1':''}" onclick="setConf(${ti},${ii},1)" title="Partial">~</div>
        <div class="conf-btn${chkState[ti][ii]===2?' on-2':''}" onclick="setConf(${ti},${ii},2)" title="Confident">✓</div>
      </div>
    </div>`).join('');
  updateChkProgress(ti);
}

function setConf(ti,ii,val){
  if(chkState[ti][ii]===val) delete chkState[ti][ii];
  else chkState[ti][ii]=val;
  const btns=document.querySelectorAll(`#chk-list .chk-item:nth-child(${ii+1}) .conf-btn`);
  btns.forEach((b,j)=>{b.classList.remove('on-0','on-1','on-2');if(chkState[ti][ii]===j) b.classList.add('on-'+j);});
  updateChkProgress(ti);
}

function updateChkProgress(ti){
  const topic=CHK_TOPICS[ti];
  const total=topic.items.length;
  const confident=Object.values(chkState[ti]).filter(v=>v===2).length;
  const pct=total>0?Math.round(confident/total*100):0;
  document.getElementById('chk-prog-pct').textContent=pct+'%';
  document.getElementById('chk-prog-fill').style.width=pct+'%';
}

// ═══════════════════ DDX BUILDER ═══════════════════
const DDX_DATA={
  'Chest Pain':{icon:'💔',filters:['All','Cardiac','Respiratory','GI','Vascular','MSK'],
    dx:[
      {name:'STEMI / NSTEMI',tag:'urgent',filter:'Cardiac',clues:'Central crushing pain, radiation to arm/jaw, diaphoresis, nausea. ECG changes, troponin rise.',keys:['ECG','Troponin','Echo'],ix:'ECG (STE, new LBBB), serial troponin, CXR, echo'},
      {name:'Unstable Angina',tag:'urgent',filter:'Cardiac',clues:'Exertional or rest chest pain, no troponin rise. Dynamic ECG changes.',keys:['ECG','Troponin negative'],ix:'ECG, troponin x2, stress test or coronary angiogram'},
      {name:'Aortic Dissection',tag:'urgent',filter:'Vascular',clues:'Tearing/ripping pain radiating to back. Pulse differentials. Widened mediastinum on CXR. Hypertension.',keys:['CT angio','Pulse differential'],ix:'CT aorta with contrast urgently, CXR, Echo (TOE)'},
      {name:'Pulmonary Embolism',tag:'urgent',filter:'Respiratory',clues:'Pleuritic pain, dyspnoea, tachycardia, haemoptysis. Risk factors: immobility, DVT, OCP, malignancy.',keys:['Wells score','CTPA','D-dimer'],ix:'Wells score, D-dimer, CTPA, ECG (S1Q3T3), Echo (RV strain)'},
      {name:'Tension Pneumothorax',tag:'urgent',filter:'Respiratory',clues:'Sudden dyspnoea, absent breath sounds unilaterally, tracheal deviation, hypotension. Traumatic or spontaneous.',keys:['Clinical diagnosis','Needle decompression'],ix:'Clinical diagnosis — decompress before CXR if haemodynamically unstable'},
      {name:'Pericarditis',tag:'common',filter:'Cardiac',clues:'Pleuritic chest pain better sitting forward. Pericardial rub. Saddle-shaped ST elevation all leads. Recent viral illness.',keys:['ECG saddle ST','CRP','Echo'],ix:'ECG, CRP/ESR, troponin (mild elevation if myopericarditis), echo'},
      {name:'GORD / Oesophageal spasm',tag:'consider',filter:'GI',clues:'Burning retrosternal, worse after meals/lying flat. May mimic cardiac pain. Relief with antacids.',keys:['Therapeutic trial PPI'],ix:'Clinical diagnosis, PPI trial, endoscopy if red flags'},
      {name:'MSK / Costochondritis',tag:'consider',filter:'MSK',clues:'Reproducible with palpation of costochondral junction. No ECG changes, normal troponin.',keys:['Palpation tender','Normal ECG'],ix:'Diagnosis of exclusion after cardiac causes excluded'},
    ]},
  'Shortness of Breath':{icon:'🫁',filters:['All','Cardiac','Respiratory','Haematological','Other'],
    dx:[
      {name:'Acute Pulmonary Oedema',tag:'urgent',filter:'Cardiac',clues:'Sudden SOB, orthopnoea, frothy pink sputum, bilateral crackles, S3 gallop, raised JVP. Cardiac history.',keys:['BNP','CXR bat-wing','Echo'],ix:'CXR, BNP, echo, ECG, troponin (ACS precipitant)'},
      {name:'Acute Asthma',tag:'urgent',filter:'Respiratory',clues:'Wheeze, chest tightness, cough. Known asthma. PEFR <50% predicted = severe. Silent chest = near-fatal.',keys:['PEFR','SpO₂','ABG'],ix:'PEFR, SpO₂, ABG (rising CO₂ = alarming), CXR (exclude pneumothorax)'},
      {name:'Pneumonia',tag:'common',filter:'Respiratory',clues:'Fever, productive cough, consolidation on examination. CURB-65 for severity. Dyspnoea + hypoxia.',keys:['CURB-65','CXR consolidation','Sputum MC&S'],ix:'CXR, FBC, CRP, blood cultures, sputum MC&S, urine Legionella/pneumococcal Ag'},
      {name:'Pulmonary Embolism',tag:'urgent',filter:'Respiratory',clues:'Sudden dyspnoea, pleuritic pain, tachycardia. Risk factors. SpO₂ drop.',keys:['Wells score','CTPA'],ix:'Wells, D-dimer, CTPA, ECG, echo'},
      {name:'Pneumothorax',tag:'urgent',filter:'Respiratory',clues:'Young tall male or COPD patient. Sudden pleuritic pain + dyspnoea. Decreased breath sounds.',keys:['CXR','USS'],ix:'CXR (expiratory), needle decompression if tension'},
      {name:'COPD Exacerbation',tag:'common',filter:'Respiratory',clues:'Known COPD. Increased dyspnoea, sputum purulence/volume, wheeze. Type II respiratory failure on ABG.',keys:['ABG','CXR','CURB-65'],ix:'ABG (check CO₂), CXR, FBC, CRP, sputum, ECG'},
      {name:'Anaemia',tag:'consider',filter:'Haematological',clues:'Gradual exertional dyspnoea, fatigue, pallor, tachycardia. No pulmonary signs.',keys:['FBC','Reticulocytes'],ix:'FBC, blood film, reticulocytes, iron studies, B12/folate'},
      {name:'Cardiac Tamponade',tag:'urgent',filter:'Cardiac',clues:'Beck\'s triad: hypotension + raised JVP + muffled heart sounds. Pulsus paradoxus. Echo diagnostic.',keys:['Echo','Beck\'s triad'],ix:'Echo urgently, ECG (electrical alternans), CXR (globular heart)'},
    ]},
  'Headache':{icon:'🤕',filters:['All','Vascular','Raised ICP','Inflammatory','Primary'],
    dx:[
      {name:'Subarachnoid Haemorrhage',tag:'urgent',filter:'Vascular',clues:'Thunderclap headache (worst ever, seconds onset). Neck stiffness, photophobia, ± focal neurology. Sentinel bleed possible.',keys:['CT head','LP (xanthochromia)'],ix:'Urgent non-contrast CT head. If normal + high suspicion: LP >12h after onset (xanthochromia on spectrophotometry)'},
      {name:'Meningitis',tag:'urgent',filter:'Inflammatory',clues:'Fever + severe headache + neck stiffness + photophobia. Kernig\'s/Brudzinski\'s signs. Purpuric rash = meningococcal.',keys:['CT then LP','Blood cultures first'],ix:'Blood cultures → CT head → LP. Do NOT delay antibiotics. Empirical IV ceftriaxone + dexamethasone.'},
      {name:'Raised ICP (tumour/abscess)',tag:'urgent',filter:'Raised ICP',clues:'Progressive headache worse morning/lying flat, vomiting, papilloedema, focal neurology. Cushings triad late sign.',keys:['CT/MRI brain','Papilloedema'],ix:'CT head with contrast (MRI better for posterior fossa), fundoscopy'},
      {name:'Cerebral Venous Sinus Thrombosis',tag:'urgent',filter:'Vascular',clues:'Young woman on OCP. Progressive headache ± focal neurology ± seizures ± papilloedema. Hypercoagulable states.',keys:['MRV','D-dimer'],ix:'MRI brain + MR venography. D-dimer elevated. Treatment: anticoagulation even with haemorrhage.'},
      {name:'Giant Cell Arteritis',tag:'urgent',filter:'Inflammatory',clues:'>50 years. Temporal headache, scalp tenderness, jaw claudication, visual loss (anterior ischaemic optic neuropathy). ESR very high.',keys:['ESR/CRP','Temporal artery biopsy'],ix:'ESR, CRP, LFTs. Start prednisolone 40–60mg IMMEDIATELY (don\'t wait for biopsy if visual symptoms). Temporal artery biopsy within 2 weeks.'},
      {name:'Migraine',tag:'common',filter:'Primary',clues:'Unilateral throbbing, photophobia, phonophobia, nausea. ± Aura (visual, sensory). Duration 4–72h. Family history.',keys:['Clinical diagnosis','Exclude secondary'],ix:'Clinical diagnosis. Red flags: first/worst ever, progressive, systemic symptoms, focal neurology, >50 years → CT/LP to exclude secondary.'},
      {name:'Tension Headache',tag:'common',filter:'Primary',clues:'Bilateral pressing/tightening. Not aggravated by activity. No nausea. Stress-related. Most common headache type.',keys:['Clinical diagnosis'],ix:'Diagnosis of exclusion. Reassurance, analgesia, lifestyle.'},
      {name:'Medication Overuse Headache',tag:'consider',filter:'Primary',clues:'Daily or near-daily headache + analgesic use >10–15 days/month. Worse in morning. Triptans, codeine, NSAIDs.',keys:['Medication history'],ix:'Diagnosis on history. Withdraw analgesic (supervised). Preventive therapy.'},
    ]},
  'Jaundice':{icon:'🟡',filters:['All','Pre-hepatic','Hepatocellular','Cholestatic','Obstructive'],
    dx:[
      {name:'Haemolytic Anaemia',tag:'common',filter:'Pre-hepatic',clues:'Unconjugated hyperbilirubinaemia. No dark urine. Pallor, splenomegaly. Raised LDH, reticulocytes. Low haptoglobin.',keys:['Unconjugated bili','Reticulocytes','Blood film'],ix:'Bilirubin (unconjugated dominant), FBC, blood film, reticulocytes, haptoglobin, LDH, DAT (Coombs)'},
      {name:'Viral Hepatitis (A/B/C)',tag:'common',filter:'Hepatocellular',clues:'Raised ALT/AST >> ALP. Fatigue, anorexia, right upper quadrant pain. Risk factors: sexual contact, travel, IVDU.',keys:['ALT/AST dominant','Serology'],ix:'Hepatitis A IgM, HBsAg/anti-HBc, HCV RNA, EBV/CMV serology'},
      {name:'Alcoholic Liver Disease',tag:'common',filter:'Hepatocellular',clues:'AST:ALT ratio >2:1. Raised GGT. Stigmata of chronic liver disease. History of alcohol excess.',keys:['AST:ALT >2','GGT elevated'],ix:'LFTs, GGT, FBC (macrocytosis), clotting, albumin, USS abdomen'},
      {name:'Autoimmune Hepatitis',tag:'consider',filter:'Hepatocellular',clues:'Young woman, markedly elevated ALT, positive ANA/anti-smooth muscle antibodies, hypergammaglobulinaemia.',keys:['ANA','Anti-SMA','Liver biopsy'],ix:'ANA, anti-SMA, anti-LKM1, IgG, liver biopsy (interface hepatitis)'},
      {name:'Cholangitis (ascending)',tag:'urgent',filter:'Obstructive',clues:'Charcot\'s triad: RUQ pain + fever + jaundice. Reynolds\' pentad adds: shock + confusion. Septic, unwell.',keys:['USS (dilated ducts)','Blood cultures'],ix:'FBC, LFTs, blood cultures, USS → ERCP urgently if obstruction'},
      {name:'Pancreatic Cancer',tag:'urgent',filter:'Obstructive',clues:'Painless progressive jaundice, weight loss, pale stools, dark urine, palpable gallbladder (Courvoisier\'s sign). Elderly.',keys:['CA19-9','CT pancreas','ERCP'],ix:'USS/CT abdomen, CA19-9, ERCP for biliary drainage, endoscopic USS for staging'},
      {name:'Primary Biliary Cholangitis',tag:'consider',filter:'Cholestatic',clues:'Middle-aged woman. ALP >> ALT. Fatigue, pruritus. Anti-mitochondrial antibody (AMA) positive.',keys:['ALP dominant','AMA positive'],ix:'ALP, GGT, AMA (M2 subtype), IgM, liver biopsy, USS'},
      {name:'Choledocholithiasis',tag:'common',filter:'Obstructive',clues:'Colicky RUQ pain, jaundice, pale stools, dark urine. History of gallstones. ALP + bilirubin elevated.',keys:['USS','MRCP','ALP/bili'],ix:'USS (stones, CBD dilation), MRCP for CBD stones, ERCP for removal + sphincterotomy'},
    ]},
  'Fever + Sepsis':{icon:'🌡️',filters:['All','Respiratory','Abdominal','CNS','Urological','Skin & Soft Tissue'],
    dx:[
      {name:'Pneumonia/Empyema',tag:'urgent',filter:'Respiratory',clues:'Productive cough, fever, reduced breath sounds / dullness. CURB-65. SpO₂ drop.',keys:['CXR','CURB-65','Sputum'],ix:'CXR, FBC, CRP, blood cultures, sputum, urine Legionella Ag, CURB-65'},
      {name:'Infective Endocarditis',tag:'urgent',filter:'Respiratory',clues:'Fever + new murmur + risk factors (IV drugs, prosthetic valve, dental work). Embolic phenomena, Janeway lesions, Osler nodes.',keys:['Blood cultures x3','Echo'],ix:'3 sets blood cultures before antibiotics, echo (TOE if TTE negative), FBC, CRP, ESR, urine (haematuria)'},
      {name:'Spontaneous Bacterial Peritonitis',tag:'urgent',filter:'Abdominal',clues:'Cirrhotic patient with fever, abdominal pain, worsening encephalopathy. Ascitic tap: WCC >250 neutrophils/mm³.',keys:['Diagnostic paracentesis','PMN>250'],ix:'Urgent ascitic tap (WCC differential), blood cultures, CRP, LFTs. Cefotaxime empirically.'},
      {name:'Bacterial Meningitis',tag:'urgent',filter:'CNS',clues:'Fever + headache + neck stiffness + photophobia ± purpuric rash (meningococcal). GCS may decline.',keys:['CT then LP','Ceftriaxone now'],ix:'Blood cultures → CT → LP. Empirical IV ceftriaxone + dexamethasone immediately — don\'t wait for LP.'},
      {name:'Pyelonephritis / Urosepsis',tag:'urgent',filter:'Urological',clues:'Fever, rigors, loin pain/tenderness (costovertebral angle), dysuria, frequency. Positive urine dipstick.',keys:['Urine MC&S','Blood cultures','USS'],ix:'MSU for MC&S, blood cultures, FBC, CRP, Cr, USS (exclude obstruction/abscess). IV ceftriaxone if septic.'},
      {name:'Cellulitis / Necrotising Fasciitis',tag:'urgent',filter:'Skin & Soft Tissue',clues:'Spreading erythema, warmth, oedema. NF: severe pain out of proportion, systemic toxicity, skin necrosis, crepitus.',keys:['Skin markings','CT/MRI (NF)'],ix:'Mark border of erythema (hourly monitoring). NF: urgent CT/MRI + surgical review. Blood cultures, FBC, CRP, CK (NF).'},
    ]},
};

const ddxGrid=document.getElementById('ddx-grid');
Object.entries(DDX_DATA).forEach(([complaint,data])=>{
  ddxGrid.innerHTML+=`<div class="ddx-complaint-btn" onclick="selectComplaint('${complaint}',this)">
    <div class="dci">${data.icon}</div>
    <div class="dcn">${complaint}</div>
  </div>`;
});

let currentComplaint=null;let activeFilter='All';
function selectComplaint(name,el){
  document.querySelectorAll('.ddx-complaint-btn').forEach(b=>b.classList.remove('on'));
  el.classList.add('on');
  currentComplaint=name;activeFilter='All';
  const data=DDX_DATA[name];
  const filtersEl=document.getElementById('ddx-filters');
  filtersEl.style.display='flex';
  filtersEl.innerHTML=data.filters.map(f=>`<div class="ddx-filter${f==='All'?' on':''}" onclick="setDDXFilter('${f}',this)">${f}</div>`).join('');
  renderDDX(data,'All');
}
function setDDXFilter(f,el){
  activeFilter=f;
  document.querySelectorAll('.ddx-filter').forEach(b=>b.classList.remove('on'));
  el.classList.add('on');
  renderDDX(DDX_DATA[currentComplaint],f);
}
function renderDDX(data,filter){
  const res=document.getElementById('ddx-result');
  res.classList.add('on');
  const filtered=data.dx.filter(d=>filter==='All'||d.filter===filter);
  res.innerHTML=`<div class="ddx-header">${DDX_DATA[currentComplaint]?.icon} ${currentComplaint} — ${filtered.length} diagnoses</div>`+
    filtered.map(d=>`
      <div class="ddx-dx-card ${d.tag}">
        <div class="ddx-dx-top">
          <div class="ddx-dx-name">${d.name}</div>
          <span class="ddx-dx-tag tag-${d.tag}">${d.tag==='urgent'?'⚠ Urgent':d.tag==='common'?'Common':'Consider'}</span>
        </div>
        <div class="ddx-clues">${d.clues}</div>
        <div class="ddx-keys">${d.keys.map(k=>`<span class="ddx-key">${k}</span>`).join('')}</div>
        <div class="ddx-ix-row">📋 Ix: ${d.ix}</div>
      </div>`).join('');
}

// ═══════════════════ PHARMACOLOGY ═══════════════════
function switchPharm(mode,el){
  document.querySelectorAll('.pharm-mode-btn').forEach(b=>b.classList.remove('on'));
  el.classList.add('on');
  ['abx','analg','diur','pharmquiz'].forEach(m=>{
    document.getElementById('pm-'+m).style.display=m===mode?'block':'none';
  });
}

function buildPharmGroup(containerId,groups){
  const el=document.getElementById(containerId);
  el.innerHTML=groups.map((g,gi)=>`
    <div class="pharm-group" id="pg-${containerId}-${gi}">
      <div class="pharm-group-hdr" onclick="togglePG('${containerId}-${gi}')">
        <div class="pharm-group-icon" style="background:${g.color}22">${g.icon}</div>
        <div style="flex:1">
          <div class="pharm-group-title" style="color:${g.color}">${g.name}</div>
          <div class="pharm-group-sub">${g.sub}</div>
        </div>
        <div style="color:var(--muted);font-size:18px" id="pgiarr-${containerId}-${gi}">›</div>
      </div>
      <div class="pharm-group-body" id="pgibody-${containerId}-${gi}">${g.content}</div>
    </div>`).join('');
}
function togglePG(key){
  const b=document.getElementById('pgibody-'+key);
  const a=document.getElementById('pgiarr-'+key);
  if(b.classList.contains('on')){b.classList.remove('on');a.textContent='›';}
  else{b.classList.add('on');a.textContent='⌄';}
}

const ABX_GROUPS=[
  {name:'Penicillins',icon:'💊',color:'#4a9eff',sub:'Beta-lactam cell wall inhibitors — most commonly prescribed antibiotic class',content:`<div class="pharm-drug-row"><div class="pharm-drug-name">Amoxicillin</div><div class="pharm-drug-detail"><strong>MOA:</strong> Inhibits bacterial cell wall synthesis (binds PBPs → prevents peptidoglycan cross-linking → osmotic lysis).<br><strong>Spectrum:</strong> Gram+ve (Strep, Enterococcus), some Gram−ve (H.influenzae, E.coli — variable). NOT S.aureus.<br><strong>Uses:</strong> CAP (with clavulanate), UTI, otitis media, H.pylori triple therapy.<br><span class="pharm-tag" style="background:rgba(244,84,122,.15);color:var(--red)">Avoid in EBV/mono — causes rash (not true allergy)</span></div></div><div class="pharm-drug-row"><div class="pharm-drug-name">Amoxicillin-clavulanate</div><div class="pharm-drug-detail"><strong>MOA:</strong> Amoxicillin + clavulanate (beta-lactamase inhibitor) → extends spectrum to beta-lactamase producers.<br><strong>Spectrum:</strong> Broader — MSSA, H.influenzae, Klebsiella, Moraxella.<br><strong>Uses:</strong> CAP, UTI, skin/soft tissue, diabetic foot, animal bites.<br><span class="pharm-tag" style="background:rgba(255,179,71,.15);color:var(--amber)">SE: GI upset (take with food), hepatotoxicity (rare)</span></div></div><div class="pharm-drug-row"><div class="pharm-drug-name">Flucloxacillin</div><div class="pharm-drug-detail"><strong>MOA:</strong> Beta-lactamase-resistant penicillin → MSSA specific.<br><strong>Spectrum:</strong> MSSA ONLY — NOT MRSA, NOT Gram−ve.<br><strong>Uses:</strong> Cellulitis, skin/soft tissue, osteomyelitis, endocarditis (MSSA).<br><strong>Dose:</strong> 500mg–1g QID. <span class="pharm-tag" style="background:rgba(244,84,122,.15);color:var(--red)">EMPTY STOMACH — food reduces absorption 50%</span></div></div><div class="pharm-drug-row"><div class="pharm-drug-name">Benzylpenicillin (Pen G)</div><div class="pharm-drug-detail"><strong>Spectrum:</strong> Strep pyogenes, Strep pneumoniae, N.meningitidis, T.pallidum.<br><strong>Uses:</strong> Bacterial meningitis (+ ceftriaxone), meningococcal disease, syphilis.</div></div><div class="pharm-drug-row"><div class="pharm-drug-name">Pip-Tazobactam (Tazocin)</div><div class="pharm-drug-detail"><strong>Spectrum:</strong> Very broad — Gram+ve, Gram−ve including Pseudomonas, anaerobes.<br><strong>Uses:</strong> Severe sepsis, HAP, febrile neutropenia, intra-abdominal sepsis. <span class="pharm-tag" style="background:rgba(74,158,255,.15);color:var(--blue)">Anti-pseudomonal</span></div></div>`},
  {name:'Cephalosporins',icon:'🔵',color:'#a78bfa',sub:'Beta-lactams — 1st to 5th generation, increasing Gram−ve coverage',content:`<div class="pharm-drug-row"><div class="pharm-drug-name">Cefalexin (1st gen)</div><div class="pharm-drug-detail"><strong>Spectrum:</strong> Good Gram+ve (MSSA, Strep), limited Gram−ve (E.coli).<br><strong>Uses:</strong> Uncomplicated UTI, skin/soft tissue, oral surgical prophylaxis.</div></div><div class="pharm-drug-row"><div class="pharm-drug-name">Cefazolin (1st gen IV)</div><div class="pharm-drug-detail"><strong>Gold standard surgical prophylaxis:</strong> 2g IV 30–60 min pre-incision.<br><strong>Also:</strong> MSSA infections (flucloxacillin allergy).</div></div><div class="pharm-drug-row"><div class="pharm-drug-name">Ceftriaxone (3rd gen)</div><div class="pharm-drug-detail"><strong>Spectrum:</strong> Excellent Gram−ve, good Gram+ve, CNS penetration. NOT Pseudomonas or anaerobes.<br><strong>Uses:</strong> Bacterial meningitis, severe CAP, gonorrhoea, typhoid, Lyme disease, sepsis.<br><strong>Dose:</strong> 1–2g IV/IM OD.</div></div><div class="pharm-drug-row"><div class="pharm-drug-name">Ceftazidime (3rd gen)</div><div class="pharm-drug-detail"><strong>Spectrum:</strong> Extended Gram−ve including <span class="pharm-tag" style="background:rgba(74,158,255,.15);color:var(--blue)">Pseudomonas</span>. Less Gram+ve than ceftriaxone.<br><strong>Uses:</strong> Pseudomonal infections, febrile neutropenia.</div></div><div class="pharm-drug-row"><div class="pharm-drug-name">Cefepime (4th gen)</div><div class="pharm-drug-detail"><strong>Spectrum:</strong> Broad Gram+ve AND Gram−ve including Pseudomonas. More beta-lactamase stable.<br><strong>Uses:</strong> Febrile neutropenia, HAP, severe Gram−ve infections in oncology.</div></div>`},
  {name:'Carbapenems',icon:'⚡',color:'#f4547a',sub:'Broadest spectrum beta-lactams — reserved for resistant organisms, ESBL',content:`<div class="pharm-drug-row"><div class="pharm-drug-name">Meropenem / Imipenem</div><div class="pharm-drug-detail"><strong>MOA:</strong> Beta-lactam — resistant to most beta-lactamases including ESBLs.<br><strong>Spectrum:</strong> Extremely broad — Gram+ve, Gram−ve (ESBL, Pseudomonas), anaerobes. NOT MRSA.<br><strong>Uses:</strong> Severe sepsis/septic shock, ESBL organisms, febrile neutropenia, intra-abdominal sepsis.<br><span class="pharm-tag" style="background:rgba(244,84,122,.15);color:var(--red)">RESERVE — C.diff risk, carbapenem resistance</span><br><strong>SE:</strong> Seizures (imipenem &gt; meropenem), C.diff.</div></div><div class="pharm-drug-row"><div class="pharm-drug-name">Ertapenem</div><div class="pharm-drug-detail">Once-daily carbapenem. <span class="pharm-tag" style="background:rgba(255,179,71,.15);color:var(--amber)">No Pseudomonas coverage</span> — community ESBL infections, discharge therapy.</div></div>`},
  {name:'Macrolides',icon:'🌀',color:'#00d4aa',sub:'50S protein synthesis inhibitors — atypicals, STIs, intracellular organisms',content:`<div class="pharm-drug-row"><div class="pharm-drug-name">Azithromycin</div><div class="pharm-drug-detail"><strong>MOA:</strong> Binds 50S ribosomal subunit → inhibits translocation → bacteriostatic.<br><strong>Spectrum:</strong> Strep pneumoniae (CAP), atypicals (Mycoplasma, Legionella, Chlamydophila), STIs (Chlamydia trachomatis).<br><strong>Uses:</strong> Mild-moderate CAP (atypical coverage), Chlamydia (1g stat), MAC prophylaxis (HIV).<br><strong>SE:</strong> <span class="pharm-tag" style="background:rgba(244,84,122,.15);color:var(--red)">QT prolongation</span>, GI upset. Long tissue half-life (3–5 days).</div></div><div class="pharm-drug-row"><div class="pharm-drug-name">Clarithromycin</div><div class="pharm-drug-detail"><strong>Uses:</strong> H.pylori eradication (triple therapy), CAP, MAC treatment.<br><span class="pharm-tag" style="background:rgba(255,179,71,.15);color:var(--amber)">Strong CYP3A4 inhibitor — major drug interactions (statins → rhabdomyolysis, warfarin, etc.)</span></div></div>`},
  {name:'Fluoroquinolones',icon:'🔬',color:'#ffb347',sub:'DNA gyrase inhibitors — broad Gram−ve, tissue penetration',content:`<div class="pharm-drug-row"><div class="pharm-drug-name">Ciprofloxacin</div><div class="pharm-drug-detail"><strong>MOA:</strong> Inhibits DNA gyrase (topoisomerase II) + topoisomerase IV → bactericidal.<br><strong>Spectrum:</strong> Excellent Gram−ve (incl. Pseudomonas). Poor Gram+ve — <span class="pharm-tag" style="background:rgba(244,84,122,.15);color:var(--red)">NOT for CAP</span><br><strong>Uses:</strong> Complicated UTI, prostatitis, Pseudomonas, typhoid, meningococcal prophylaxis.<br><strong>SE:</strong> Tendinopathy/tendon rupture (Achilles — elderly, steroids), QT prolongation, seizures, photosensitivity. <span class="pharm-tag" style="background:rgba(244,84,122,.15);color:var(--red)">Avoid &lt;18yr</span></div></div><div class="pharm-drug-row"><div class="pharm-drug-name">Moxifloxacin</div><div class="pharm-drug-detail"><strong>Respiratory quinolone:</strong> Adds Strep pneumoniae to ciprofloxacin spectrum. NOT Pseudomonas.<br><strong>Uses:</strong> CAP (macrolide-resistant), TB multi-drug regimens.</div></div>`},
  {name:'Tetracyclines',icon:'🟡',color:'#34d399',sub:'30S inhibitors — intracellular organisms, STIs, MRSA skin, malaria',content:`<div class="pharm-drug-row"><div class="pharm-drug-name">Doxycycline</div><div class="pharm-drug-detail"><strong>MOA:</strong> Binds 30S subunit → inhibits aminoacyl-tRNA binding → bacteriostatic.<br><strong>Spectrum:</strong> Broad — atypicals (Mycoplasma, Chlamydia, Rickettsia, Borrelia), MRSA skin, malaria prophylaxis, syphilis (penicillin allergy).<br><strong>Uses:</strong> CAP (atypical), STIs, acne, malaria prophylaxis, Lyme disease, Q fever.<br><strong>SE:</strong> <span class="pharm-tag" style="background:rgba(255,179,71,.15);color:var(--amber)">Photosensitivity</span>, oesophageal ulceration (take with full glass water + remain upright), avoid &lt;8yr and pregnancy (dental/bone effects).</div></div>`},
  {name:'Aminoglycosides + Vancomycin',icon:'💉',color:'#4a9eff',sub:'Concentration-dependent bactericidals — narrow therapeutic index, monitoring essential',content:`<div class="pharm-drug-row"><div class="pharm-drug-name">Gentamicin</div><div class="pharm-drug-detail"><strong>MOA:</strong> Binds 30S subunit → misreading of mRNA → bactericidal. Concentration-dependent.<br><strong>Spectrum:</strong> Gram−ve rods (Pseudomonas, Enterobacteriaceae), synergy with beta-lactams for Gram+ve endocarditis.<br><strong>SE:</strong> <span class="pharm-tag" style="background:rgba(244,84,122,.15);color:var(--red)">Nephrotoxicity</span> (reversible), <span class="pharm-tag" style="background:rgba(244,84,122,.15);color:var(--red)">Ototoxicity</span> (often irreversible — cochlear+vestibular). Monitor levels + renal function.</div></div><div class="pharm-drug-row"><div class="pharm-drug-name">Vancomycin</div><div class="pharm-drug-detail"><strong>MOA:</strong> Glycopeptide — binds D-Ala-D-Ala of peptidoglycan precursors → inhibits cell wall synthesis (different mechanism to beta-lactams).<br><strong>Spectrum:</strong> Gram+ve ONLY — MRSA, Enterococcus, severe C.diff (oral).<br><strong>SE:</strong> Nephrotoxicity (+ aminoglycosides synergistic), <span class="pharm-tag" style="background:rgba(255,179,71,.15);color:var(--amber)">"Red Man Syndrome"</span> (infuse too fast → histamine release → flushing/erythema — NOT allergy, slow infusion rate). Monitor troughs (target 15–20mg/L).</div></div>`},
  {name:'Other Key Agents',icon:'🔑',color:'#a78bfa',sub:'Metronidazole, TMP/Co-trimoxazole, Nitrofurantoin, Rifampicin',content:`<div class="pharm-drug-row"><div class="pharm-drug-name">Metronidazole</div><div class="pharm-drug-detail"><strong>MOA:</strong> Reduced by bacterial enzymes → toxic free radicals → DNA strand breaks → bactericidal.<br><strong>Spectrum:</strong> Anaerobes, C.difficile (oral), Giardia, Entamoeba, Trichomonas.<br><strong>Uses:</strong> Anaerobic coverage, C.diff (mild), bacterial vaginosis, H.pylori (triple/quad therapy).<br><span class="pharm-tag" style="background:rgba(244,84,122,.15);color:var(--red)">Disulfiram-like reaction with alcohol — NO ALCOHOL</span>, metallic taste, peripheral neuropathy.</div></div><div class="pharm-drug-row"><div class="pharm-drug-name">TMP / Co-trimoxazole (TMP-SMX)</div><div class="pharm-drug-detail"><strong>MOA:</strong> TMP inhibits dihydrofolate reductase → sequential folate blockade (synergistic with sulfonamide).<br><strong>Uses:</strong> TMP: uncomplicated UTI, prostatitis. TMP-SMX: PCP pneumonia (Pneumocystis — HIV prophylaxis CD4 &lt;200), toxoplasmosis, MRSA skin infections.<br><strong>SE:</strong> Hyperkalaemia (TMP blocks renal K+ excretion), SJS (sulfonamide), megaloblastic anaemia.</div></div><div class="pharm-drug-row"><div class="pharm-drug-name">Nitrofurantoin</div><div class="pharm-drug-detail"><strong>Uses:</strong> Uncomplicated LOWER UTI only — concentrates in urine only.<br><span class="pharm-tag" style="background:rgba(244,84,122,.15);color:var(--red)">Do NOT use for pyelonephritis</span> — inadequate tissue levels.<br><strong>SE:</strong> GI (take with food), pulmonary toxicity, peripheral neuropathy (long-term), haemolysis (G6PD deficiency).</div></div><div class="pharm-drug-row"><div class="pharm-drug-name">Rifampicin</div><div class="pharm-drug-detail"><strong>MOA:</strong> Inhibits bacterial RNA polymerase — bactericidal. NEVER monotherapy (rapid resistance).<br><strong>Uses:</strong> TB (combination), meningococcal prophylaxis, MRSA decolonisation, Legionella (severe).<br><span class="pharm-tag" style="background:rgba(255,179,71,.15);color:var(--amber)">Orange body fluids — warn patients!</span> Strong CYP450 inducer (↓ warfarin, OCP, antiretrovirals).</div></div>`},
  {name:'Resistance Principles',icon:'⚠️',color:'#f4547a',sub:'ESKAPE pathogens, MRSA, ESBL, stewardship',content:`<div class="pharm-drug-row"><div class="pharm-drug-name">ESKAPE Organisms</div><div class="pharm-drug-detail"><strong>E</strong>nterococcus faecium (VRE) · <strong>S</strong>taphylococcus aureus (MRSA) · <strong>K</strong>lebsiella pneumoniae (ESBL/carbapenem-R) · <strong>A</strong>cinetobacter baumannii · <strong>P</strong>seudomonas aeruginosa · <strong>E</strong>nterobacter spp.<br>These cause the majority of hospital-acquired infections and are increasing in resistance.</div></div><div class="pharm-drug-row"><div class="pharm-drug-name">MRSA</div><div class="pharm-drug-detail">Altered PBP2a (mecA gene) → ALL beta-lactams ineffective. <span class="pharm-tag" style="background:rgba(244,84,122,.15);color:var(--red)">Flucloxacillin DOES NOT work for MRSA</span>. Treat with vancomycin (IV serious), TMP-SMX or doxycycline (skin).</div></div><div class="pharm-drug-row"><div class="pharm-drug-name">ESBL-producers</div><div class="pharm-drug-detail">Extended-spectrum beta-lactamases break down most cephalosporins and penicillins. Common in E.coli, Klebsiella. Treat with carbapenems (meropenem). Ertapenem if no Pseudomonas. Avoid broad-spectrum agents unless necessary — stewardship.</div></div>`},
];
buildPharmGroup('pm-abx', ABX_GROUPS);

// ANALGESICS
document.getElementById('pm-analg').innerHTML=`
<div class="sec-label">WHO Analgesic Ladder</div>
<div style="background:var(--surf2);border-radius:12px;padding:12px;margin-bottom:12px;font-size:12px;color:var(--muted2);line-height:1.6">
Start at the step matching pain severity. Titrate upward if uncontrolled. Continue non-opioids at all steps (additive effect). <strong style="color:var(--text)">"By the clock, by the mouth, by the ladder."</strong>
</div>
<div class="who-step who-1"><div class="who-step-title" style="color:var(--green)">Step 1 — Mild Pain (NRS 1–3)</div><div class="who-chip">Paracetamol</div><div class="who-chip">NSAIDs</div><div class="who-chip">± Adjuvants</div></div>
<div class="who-step who-2"><div class="who-step-title" style="color:var(--amber)">Step 2 — Moderate Pain (NRS 4–6)</div><div class="who-chip">Codeine</div><div class="who-chip">Tramadol</div><div class="who-chip">+ Paracetamol</div><div class="who-chip">+ NSAID</div></div>
<div class="who-step who-3"><div class="who-step-title" style="color:var(--red)">Step 3 — Severe Pain (NRS 7–10)</div><div class="who-chip">Morphine</div><div class="who-chip">Oxycodone</div><div class="who-chip">Fentanyl</div><div class="who-chip">Hydromorphone</div><div class="who-chip">+ Paracetamol</div></div>
<div class="sec-label" style="margin-top:16px">Drug Mechanisms</div>
${[
  {n:'Paracetamol',col:'#34d399',ico:'🟢',
   moa:'Central COX inhibition (COX-3 variant) + endocannabinoid enhancement + descending serotonergic modulation. Minimal peripheral anti-inflammatory effect.',
   ind:'Mild–moderate pain, fever. Safe: pregnancy, PUD, CKD (short-term), children.',
   dose:'500mg–1g QID. MAX 4g/day (2g in hepatic impairment/malnutrition/alcoholism).',
   se:'Hepatotoxicity in overdose (N-acetylcysteine antidote — give within 8–10h). No GI irritation.',
   note:'Safest analgesic in pregnancy and peptic ulcer disease.'},
  {n:'NSAIDs (Ibuprofen, Naproxen, Diclofenac)',col:'#4a9eff',ico:'🔵',
   moa:'Non-selective COX-1 + COX-2 inhibition → ↓ prostaglandins → anti-inflammatory, analgesic, antipyretic.',
   ind:'Inflammatory pain (musculoskeletal, arthritis, dysmenorrhoea), fever, mild–moderate pain.',
   dose:'Ibuprofen 400mg TDS with food. Naproxen 500mg BD.',
   se:'GI ulceration (COX-1 → ↓mucosal prostaglandins — use with PPI), AKI (afferent arteriole dilation prostaglandin-dependent — avoid in dehydration/CKD), ↑cardiovascular risk, bronchospasm, platelet inhibition.',
   note:'AVOID in: CKD, heart failure, PUD, 3rd trimester pregnancy, anticoagulated patients.'},
  {n:'COX-2 Inhibitors (Celecoxib, Etoricoxib)',col:'#ffb347',ico:'🟡',
   moa:'Selective COX-2 inhibition → ↓inflammatory prostaglandins. Spares COX-1 (GI protection).',
   ind:'Arthritis (RA, OA), dysmenorrhoea, acute gout — when GI protection needed.',
   dose:'Celecoxib 100–200mg BD.',
   se:'Reduced GI risk vs non-selective NSAIDs but same cardiovascular risk. Renal effects same. CI in established CVD.',
   note:'Better GI profile — cardiovascular risk SAME as traditional NSAIDs.'},
  {n:'Morphine (Strong Opioid)',col:'#f4547a',ico:'🔴',
   moa:'Agonist at mu (µ), kappa (κ), delta (δ) opioid receptors → hyperpolarisation → inhibition of ascending pain pathways.',
   ind:'Severe acute pain (MI, trauma, post-op), chronic cancer pain, palliative care, pulmonary oedema.',
   dose:'Opioid-naive: 2.5–5mg oral/SC q4h. Breakthrough: 1/6th of total daily dose. IV: 1–2mg aliquots.',
   se:'Constipation (ALWAYS prescribe laxative — not PRN), nausea/vomiting, sedation, respiratory depression (naloxone antidote), urinary retention, tolerance, dependence.',
   note:'REDUCE DOSE in renal failure — M6G (active metabolite) accumulates → respiratory depression risk.'},
  {n:'Fentanyl (Strong Opioid)',col:'#ffb347',ico:'🟠',
   moa:'Highly potent mu-opioid agonist. 100× more potent than morphine. Rapid onset IV, slow transdermal.',
   ind:'Acute pain (IV procedural/ITU), chronic stable pain (transdermal patch), palliative care.',
   dose:'Transdermal patch: changed every 72h. IV: 25–50 micrograms titrated.',
   se:'Similar to morphine. Transdermal: do NOT cut patches or expose to heat (↑absorption → overdose). Accumulates in fat.',
   note:'PREFERRED in renal failure — no active metabolites accumulate. Less constipation than morphine.'},
  {n:'Adjuvants — Neuropathic Pain',col:'#a78bfa',ico:'🟣',
   moa:'Gabapentinoids: block voltage-gated Ca²⁺ channels (α2δ subunit). TCAs: block noradrenaline/serotonin reuptake + Na⁺ channels. SNRIs: inhibit NA + serotonin reuptake.',
   ind:'Neuropathic pain (diabetic neuropathy, PHN, central sensitisation), fibromyalgia, chemo-induced neuropathy.',
   dose:'Gabapentin: 300mg TDS start (titrate). Pregabalin: 75mg BD. Amitriptyline: 10–25mg nocte. Duloxetine: 60mg OD.',
   se:'Gabapentinoids: sedation, dizziness, oedema, abuse potential. TCAs: anticholinergic (dry mouth, constipation, urinary retention), sedation, cardiac arrhythmias. SNRIs: nausea, insomnia, HTN.',
   note:'Combine classes for refractory neuropathic pain. Low-dose TCA (amitriptyline 10–25mg) often first choice.'},
].map(d=>`
  <div class="pharm-group" onclick="this.querySelector('.pharm-group-body').classList.toggle('on');this.querySelector('.pg-ch').textContent=this.querySelector('.pharm-group-body').classList.contains('on')?'⌄':'›'">
    <div class="pharm-group-hdr">
      <div class="pharm-group-icon" style="background:${d.col}22">${d.ico}</div>
      <div style="flex:1"><div class="pharm-group-title" style="color:${d.col}">${d.n}</div></div>
      <div class="pg-ch" style="color:var(--muted);font-size:18px">›</div>
    </div>
    <div class="pharm-group-body" style="padding:14px">
      <div style="font-size:12px;color:var(--muted2);line-height:1.65">
        <div style="margin-bottom:6px"><strong style="color:var(--text)">Mechanism:</strong> ${d.moa}</div>
        <div style="margin-bottom:6px"><strong style="color:var(--text)">Indications:</strong> ${d.ind}</div>
        <div style="margin-bottom:6px"><strong style="color:var(--text)">Dose guide:</strong> ${d.dose}</div>
        <div style="margin-bottom:6px"><strong style="color:var(--red)">Side effects:</strong> ${d.se}</div>
        <div style="padding:8px;background:rgba(255,255,255,.04);border-radius:8px;font-style:italic">${d.note}</div>
      </div>
    </div>
  </div>`).join('')}`;

// DIURETICS
const DIUR_GROUPS=[
  {name:'Loop Diuretics — Frusemide (Furosemide)',icon:'💧',color:'#4a9eff',sub:'Most potent — thick ascending limb of Loop of Henle — up to 25% Na⁺ reabsorption blocked',
   content:`<div class="pharm-drug-row"><div class="pharm-drug-name">Frusemide</div><div class="pharm-drug-detail">
     <strong>MOA:</strong> Inhibits NKCC2 (Na⁺-K⁺-2Cl⁻ cotransporter) in thick ascending LOH → blocks Na⁺, K⁺, Cl⁻ reabsorption → powerful diuresis. Also venodilation (reduces preload rapidly, before diuresis).<br><br>
     <strong>Indications:</strong> Acute pulmonary oedema (IV — first-line), chronic HF (oral), fluid overload, hypercalcaemia (saline diuresis), CKD (thiazides ineffective when GFR &lt;30).<br><br>
     <strong>Dose:</strong> Oral: 20–80mg OD-BD. IV: 40mg over 2min (acute APO); infusions up to 250mg in refractory overload.<br><br>
     <strong>SE:</strong> <span class="pharm-tag" style="background:rgba(244,84,122,.15);color:var(--red)">Hypokalaemia</span> (monitor K⁺ — add amiloride/spironolactone or K⁺ supplement), hyponatraemia, hypomagnesaemia, metabolic alkalosis, hyperuricaemia (gout), ototoxicity (IV high-dose), prerenal AKI (over-diuresis).
   </div></div>`},
  {name:'Thiazide Diuretics',icon:'🌊',color:'#00d4aa',sub:'Distal convoluted tubule — primarily antihypertensive, mild diuretic effect',
   content:`<div class="pharm-drug-row"><div class="pharm-drug-name">Hydrochlorothiazide / Chlorthalidone / Indapamide</div><div class="pharm-drug-detail">
     <strong>MOA:</strong> Inhibits NCC (Na⁺-Cl⁻ cotransporter) in DCT → ↓ Na⁺ + water reabsorption. Long-term: reduces peripheral vascular resistance.<br><br>
     <strong>Indications:</strong> Hypertension (first-line — especially elderly, Black patients, volume-sensitive HTN), mild HF, calcium oxalate nephrolithiasis (reduces urinary Ca²⁺ — opposite of loop diuretics), nephrogenic diabetes insipidus (paradoxical reduction in urine output).<br><br>
     <strong>Dose:</strong> HCTZ 12.5–25mg OD. Chlorthalidone 12.5–25mg OD (longer-acting, preferred for HTN). Indapamide 1.5–2.5mg OD.<br><br>
     <strong>SE:</strong> <span class="pharm-tag" style="background:rgba(244,84,122,.15);color:var(--red)">Hypokalaemia, Hyponatraemia</span> (more dilutional than loops), hyperglycaemia (impairs insulin secretion), hyperuricaemia/gout, dyslipidaemia, hypercalcaemia (↓ urinary Ca²⁺ excretion), erectile dysfunction.<br><br>
     <strong>Key:</strong> INEFFECTIVE when GFR &lt;30 — use loop diuretics instead. Chlorthalidone preferred over HCTZ for blood pressure (longer half-life).
   </div></div>`},
  {name:'Potassium-Sparing Diuretics',icon:'⚡',color:'#ffb347',sub:'Collecting duct — aldosterone antagonists + ENaC blockers — K⁺ sparing',
   content:`<div class="pharm-drug-row"><div class="pharm-drug-name">Spironolactone</div><div class="pharm-drug-detail">
     <strong>MOA:</strong> Competitive aldosterone antagonist → blocks mineralocorticoid receptor in collecting duct → prevents Na⁺ retention and K⁺ excretion. Weak diuretic alone.<br><br>
     <strong>Indications:</strong> HFrEF (reduces mortality — RALES trial: 25–50mg OD), primary hyperaldosteronism/Conn syndrome (diagnostic + pre-surgical), <strong>cirrhotic ascites</strong> (first-line — secondary hyperaldosteronism), resistant hypertension (4th-line), hypokalaemia prevention, acne/hirsutism (anti-androgen).<br><br>
     <strong>Dose:</strong> HFrEF: 25–50mg OD. Ascites: 100–400mg OD (ratio 100:40 with frusemide). Conn: 100–400mg OD.<br><br>
     <strong>SE:</strong> <span class="pharm-tag" style="background:rgba(244,84,122,.15);color:var(--red)">Hyperkalaemia</span> (serious — ACEi + spironolactone = high risk, monitor K⁺), gynaecomastia and breast tenderness (anti-androgen — switch to eplerenone), menstrual irregularities.
   </div></div><div class="pharm-drug-row"><div class="pharm-drug-name">Eplerenone</div><div class="pharm-drug-detail">
     <strong>Selective aldosterone antagonist</strong> — fewer sex hormone effects (less gynaecomastia).<br>
     <strong>Uses:</strong> Post-MI LV dysfunction (EPHESUS trial), HFrEF (EMPHASIS-HF), spironolactone intolerance.
   </div></div><div class="pharm-drug-row"><div class="pharm-drug-name">Amiloride</div><div class="pharm-drug-detail">
     <strong>MOA:</strong> Blocks ENaC (epithelial Na⁺ channel) in collecting duct — aldosterone-independent.<br>
     <strong>Uses:</strong> Combined with loop/thiazide to prevent hypokalaemia. Lithium-induced nephrogenic DI (↓ Li⁺ entry via ENaC).<br>
     <strong>SE:</strong> Hyperkalaemia. Less gynaecomastia than spironolactone.
   </div></div>`},
  {name:'Carbonic Anhydrase Inhibitors + Osmotic',icon:'🔬',color:'#a78bfa',sub:'Acetazolamide (proximal tubule) · Mannitol (osmotic)',
   content:`<div class="pharm-drug-row"><div class="pharm-drug-name">Acetazolamide</div><div class="pharm-drug-detail">
     <strong>MOA:</strong> Inhibits carbonic anhydrase in proximal tubule → ↓ H⁺ secretion → ↓ HCO₃⁻ reabsorption → metabolic acidosis (self-limiting diuresis).<br>
     <strong>Uses:</strong> Altitude sickness (reduces CSF production, stimulates breathing via metabolic acidosis), glaucoma (↓ aqueous humour), idiopathic intracranial hypertension (IIH), metabolic alkalosis correction.<br>
     <strong>SE:</strong> Metabolic acidosis, hypokalaemia, paraesthesia (common — fingers/toes tingling), renal calculi (↓ citrate), sulfonamide cross-reactivity.
   </div></div><div class="pharm-drug-row"><div class="pharm-drug-name">Mannitol</div><div class="pharm-drug-detail">
     <strong>MOA:</strong> Freely filtered, not reabsorbed → ↑ tubular osmolality → osmotic diuresis. IV: ↑ plasma osmolality → draws brain water into vascular space → ↓ cerebral oedema and ICP.<br>
     <strong>Uses:</strong> Raised ICP (herniation — head injury, stroke), acute glaucoma, rhabdomyolysis.<br>
     <strong>Dose:</strong> 0.5–1.5g/kg IV over 15–20 min (ICP).<br>
     <strong>SE:</strong> Initial intravascular volume expansion (avoid in cardiac failure), hyponatraemia (delayed), rebound ICP rise (prolonged use). Monitor osmolar gap (&lt;20).
   </div></div>`},
  {name:'Comparison Summary',icon:'📊',color:'#34d399',sub:'Site, K⁺ effect, key indication at a glance',
   content:`<div style="padding:14px;font-size:12px;line-height:1.9;color:var(--muted2)">
     <div style="margin-bottom:6px"><span style="color:#4a9eff;font-weight:700">Loop (Frusemide)</span> — LOH → <span style="color:var(--red)">↓↓K⁺</span> — acute pulm oedema, HF, CKD fluid</div>
     <div style="margin-bottom:6px"><span style="color:#00d4aa;font-weight:700">Thiazide (HCTZ/Chlorthalidone)</span> — DCT → <span style="color:var(--red)">↓K⁺</span> — hypertension, Ca stones</div>
     <div style="margin-bottom:6px"><span style="color:#ffb347;font-weight:700">K-sparing (Spironolactone)</span> — CD → <span style="color:var(--green)">↑K⁺</span> — HFrEF, Conn, cirrhotic ascites</div>
     <div style="margin-bottom:6px"><span style="color:#a78bfa;font-weight:700">CAI (Acetazolamide)</span> — PT → <span style="color:var(--red)">↓K⁺</span> — altitude, IIH, glaucoma</div>
     <div style="margin-bottom:12px"><span style="color:#34d399;font-weight:700">Osmotic (Mannitol)</span> — PT+DL → variable — raised ICP, rhabdo</div>
     <div style="padding:10px;background:var(--surf3);border-radius:8px">
       <strong style="color:var(--text)">Which scenario → which drug:</strong><br>
       Pulm oedema acute → <span style="color:#4a9eff">Frusemide IV</span> | HTN first-line → <span style="color:#00d4aa">Thiazide</span><br>
       HFrEF survival → <span style="color:#ffb347">Spironolactone</span> | Cirrhotic ascites → <span style="color:#ffb347">Spironolactone ± frusemide</span><br>
       Raised ICP → <span style="color:#34d399">Mannitol</span> | Altitude sickness → <span style="color:#a78bfa">Acetazolamide</span>
     </div>
   </div>`},
];
buildPharmGroup('pm-diur', DIUR_GROUPS);

// PHARM QUIZ
const PHARM_QUIZ=[
  {q:'A patient on amoxicillin develops widespread maculopapular rash. What is the most important question and what organism triggers this?',opts:['Penicillin allergy — switch to cephalosporin immediately','EBV/glandular fever history — amoxicillin causes rash in >90% of EBV, NOT a true penicillin allergy','Drug interaction with paracetamol','Staphylococcal toxin — add flucloxacillin'],ans:1,exp:'Amoxicillin + EBV causes widespread maculopapular rash in >90% of patients — this is NOT a true penicillin allergy. Always ask about recent viral illness/sore throat before labelling as allergic. Incorrect allergy labelling removes a valuable antibiotic class from the patient\'s lifetime options.'},
  {q:'You prescribe frusemide 40mg BD for HFrEF. What should you co-prescribe and monitor?',opts:['Spironolactone without monitoring','K⁺ supplementation or amiloride; monitor serum K⁺ and creatinine within 1–2 weeks','Digoxin to counteract fluid loss','Nothing else required'],ans:1,exp:'Loop diuretics cause hypokalaemia and hypomagnesaemia. Hypokalaemia increases digoxin toxicity and arrhythmia risk. Co-prescribe amiloride or K⁺ supplements. In HFrEF: use spironolactone (mortality benefit, RALES). Monitor K⁺ and Cr within 1–2 weeks of starting and after dose changes.'},
  {q:'Which analgesic is safest in a patient with CKD stage 4 for mild-moderate pain?',opts:['Ibuprofen — safest NSAID','Paracetamol — NSAIDs reduce GFR via afferent arteriole prostaglandin dependence and must be avoided in CKD','Diclofenac with PPI','Naproxen — longer half-life is better'],ans:1,exp:'NSAIDs reduce prostaglandin-mediated afferent arteriolar dilation → ↓ GFR → AKI risk. This risk is amplified in CKD, heart failure, volume depletion, and with ACEi/ARB use. Paracetamol is safe in CKD (short-term). If opioids are needed in CKD: reduce dose/frequency; use fentanyl over morphine (M6G accumulates in renal failure).'},
  {q:'Patient on ramipril starts spironolactone 25mg for HFrEF. What is the key monitoring concern and timeline?',opts:['Hepatotoxicity — LFTs at 1 month','Hyperkalaemia — ACEi + spironolactone ↑ K⁺ retention; check K⁺ within 1 week, then 1 month, then 3–6 monthly','Hyponatraemia — check Na⁺ at 6 months','QT prolongation — ECG within 48h'],ans:1,exp:'ACEi ↓ K⁺ excretion (via ↓ aldosterone). Spironolactone blocks aldosterone directly. Combined = significant hyperkalaemia risk. Monitor K⁺: baseline → 1 week → 1 month → 3–6 monthly. If K⁺ >5.5 → reduce spironolactone. If K⁺ >6.0 → stop. The RALES trial (25–50mg) showed 30% mortality reduction in severe HFrEF with careful monitoring.'},
  {q:'Drug of choice for cirrhotic ascites and rationale?',opts:['Frusemide alone — most potent','Spironolactone (100–400mg OD) ± frusemide (100:40 ratio) — targets secondary hyperaldosteronism pathophysiology of cirrhotic ascites','Mannitol IV — osmotic removal of ascites','Thiazide — best tolerated in liver disease'],ans:1,exp:'Cirrhosis → portal HTN → splanchnic vasodilation → ↓ effective circulating volume → RAAS activation → ↑ aldosterone → Na⁺ and water retention = ascites. Spironolactone is pathophysiologically rational. Start 100mg spironolactone + 40mg frusemide, maintain 100:40 ratio to preserve K⁺. Aim weight loss 0.5–1kg/day (max 1kg if peripheral oedema present).'},
  {q:'Clarithromycin prescribed for H.pylori to a patient on atorvastatin. What interaction must you address?',opts:['No clinically significant interaction','Clarithromycin is a strong CYP3A4 inhibitor → markedly ↑ atorvastatin levels → rhabdomyolysis risk. Withhold atorvastatin during treatment or switch to pravastatin.','Reduce clarithromycin dose only','Replace with azithromycin — no interaction'],ans:1,exp:'Clarithromycin potently inhibits CYP3A4 (major metabolic pathway for atorvastatin, simvastatin, lovastatin). This causes marked increase in statin plasma levels → skeletal muscle toxicity → rhabdomyolysis risk. Action: withhold statin during the 7-day antibiotic course OR switch to pravastatin/rosuvastatin (less CYP3A4-dependent). This is a common, clinically important drug interaction.'},
  {q:'Morphine prescribed for severe cancer pain in CKD stage 4. What is the concern and preferred alternative?',opts:['Morphine is completely safe in renal impairment — no adjustment needed','M6G (active metabolite) accumulates in renal failure → sedation and respiratory depression. Prefer fentanyl (inactive metabolites) or hydromorphone.','Tramadol is the best alternative in CKD','Reduce morphine dose to 1mg every 12 hours — this is sufficient'],ans:1,exp:'Morphine → morphine-6-glucuronide (M6G, pharmacologically active) via hepatic glucuronidation. M6G is renally excreted. In CKD, M6G accumulates → prolonged, excessive opioid effect → respiratory depression. Fentanyl is preferred (undergoes oxidative metabolism → inactive metabolites). Tramadol is CONTRAINDICATED in renal impairment (seizure risk, accumulation). Hydromorphone is also acceptable.'},
  {q:'Which antibiotic requires EMPTY STOMACH administration, and why?',opts:['Amoxicillin — destroyed by stomach acid','Flucloxacillin — food reduces oral bioavailability by approximately 50%','Doxycycline — binds food minerals','Ciprofloxacin — only works in fasted state'],ans:1,exp:'Flucloxacillin oral bioavailability is markedly reduced by food (Cmax and AUC reduced ~50%). Must be taken 30–60 minutes BEFORE food or 2 hours AFTER. This is a very common clinical error — patients prescribed flucloxacillin with meals achieve sub-therapeutic plasma levels. Doxycycline should avoid dairy/antacids (chelation with divalent cations) but CAN be taken with non-dairy food to ↓ GI side effects.'},
  {q:'65-year-old on ciprofloxacin develops severe Achilles tendon pain day 2. Diagnosis and management?',opts:['Normal side effect — continue and reassure','Fluoroquinolone-associated tendinopathy — STOP ciprofloxacin immediately, rest, non-weight bearing, switch to alternative antibiotic. Risk highest in elderly, corticosteroids, renal impairment.','Gout — check uric acid and start colchicine','Peripheral vascular disease — vascular surgery referral'],ans:1,exp:'Fluoroquinolone-associated tendinopathy (FQT): fluoroquinolones inhibit matrix metalloproteinases in tendon tissue → impaired collagen synthesis → degeneration and rupture risk. Achilles most common. Risk factors: age >60, concurrent corticosteroids, renal impairment. Action: STOP fluoroquinolone immediately, avoid weight bearing, switch to alternative antibiotic. This is a black-box warning (FDA). Can progress to complete tendon rupture requiring surgical repair.'},
  {q:'Mechanism by which mannitol reduces intracranial pressure?',opts:['Inhibits ADH → prevents brain water retention','Creates osmotic gradient → draws water from brain parenchyma into vascular space → ↓ cerebral oedema and ICP','Inhibits carbonic anhydrase → reduces CSF production','Direct cerebral vasoconstriction'],ans:1,exp:'Mannitol (IV) → rapidly ↑ plasma osmolality → osmotic gradient established between plasma and brain cells (intact blood-brain barrier) → water moves from oedematous brain parenchyma into vascular space → ↓ cerebral oedema + ↓ ICP. Onset 20–30 minutes. Also reduces blood viscosity → ↑ CPP. Effect lasts 4–6 hours. Monitor osmolar gap (stop if >20 — mannitol accumulation). Avoid in cardiac failure (initial volume expansion worsens pulmonary oedema).'},
];

let pharmQA={};
function buildPharmQuiz(){
  const el=document.getElementById('pm-pharmquiz');
  el.innerHTML=`<div class="sec-label">Pharmacology MCQs — antibiotics, analgesics, diuretics</div>`+
  PHARM_QUIZ.map((q,i)=>`
    <div style="background:var(--surf);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:10px">
      <div style="font-size:13px;font-weight:600;margin-bottom:12px;line-height:1.5">Q${i+1}. ${q.q}</div>
      <div>${q.opts.map((o,j)=>`<button class="pharm-quiz-opt" onclick="answerPharmQ(${i},${j})" id="pqo-${i}-${j}">${o}</button>`).join('')}</div>
      <div style="display:none;margin-top:8px;padding:11px;background:rgba(0,0,0,.3);border-radius:9px;font-size:12px;color:var(--muted2);line-height:1.55" id="pqe-${i}">${q.exp}</div>
    </div>`).join('')+`
    <div id="pharmq-score" style="display:none;text-align:center;padding:24px">
      <div style="font-family:'Syne',sans-serif;font-size:52px;font-weight:800;color:var(--green)" id="pharmq-val"></div>
      <div style="color:var(--muted2);font-size:13px;margin-top:6px">pharmacology questions correct</div>
      <button class="btn btn-teal" style="margin-top:16px;width:auto;padding:12px 28px" onclick="resetPharmQuiz()">↺ Retake</button>
    </div>`;
  pharmQA={};
}
buildPharmQuiz();

function answerPharmQ(qi,oi){
  if(pharmQA[qi]!==undefined) return;
  pharmQA[qi]=oi;
  const q=PHARM_QUIZ[qi];
  for(let j=0;j<q.opts.length;j++){
    const b=document.getElementById(`pqo-${qi}-${j}`);if(!b)continue;
    b.disabled=true;
    if(j===q.ans) b.classList.add(oi===j?'correct':'reveal');
    else if(j===+oi) b.classList.add('wrong');
  }
  document.getElementById(`pqe-${qi}`).style.display='block';
  if(Object.keys(pharmQA).length===PHARM_QUIZ.length){
    const sc=Object.entries(pharmQA).filter(([i,v])=>PHARM_QUIZ[i].ans===+v).length;
    const p=document.getElementById('pharmq-score');p.style.display='block';
    document.getElementById('pharmq-val').textContent=`${sc}/${PHARM_QUIZ.length}`;
    p.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
}
function resetPharmQuiz(){ buildPharmQuiz(); }


const NEW_CASES=[
  // TOPIC 1 — Atrial Fibrillation
  {name:'New-Onset Atrial Fibrillation',icon:'⚡',diff:'m',topic:'T1 — Cardio',
   patient:'Mrs. Helen Sato, 67F',
   vitals:['BP 152/88','HR 138 bpm (irreg)','RR 18','SpO₂ 97%','Temp 37.1°C'],
   hx:[
     {k:'PC',v:'Palpitations and mild breathlessness for 6 hours'},
     {k:'HPC',v:'Sudden onset this morning. No chest pain. Mild exertional dyspnoea. No syncope. Reports two similar episodes in past 3 months which self-terminated.'},
     {k:'PMHx',v:'Hypertension x10yr, T2DM, hyperthyroidism treated with carbimazole (recent thyroid bloods pending)'},
     {k:'Medications',v:'Ramipril 5mg, metformin 500mg BD, carbimazole 15mg'},
     {k:'SHx',v:'Retired teacher. ETOH 4 standard drinks/week. Non-smoker.'},
     {k:'FHx',v:'Nil relevant cardiac history'},
   ],
   ex:[
     {k:'General',v:'Alert, mildly anxious. No diaphoresis.'},
     {k:'CVS',v:'Irregularly irregular pulse 138bpm. BP 152/88. JVP not elevated. Apex displaced. HS I+II variable intensity, no murmurs. No peripheral oedema.'},
     {k:'Respiratory',v:'Mild bibasal crackles — possible early pulmonary oedema.'},
     {k:'Thyroid',v:'Small smooth goitre, no bruit. No exophthalmos, no tremor, no lid lag.'},
   ],
   ix:[
     {k:'ECG',v:'Irregularly irregular rhythm, no discernible P waves, fibrillatory baseline, HR 138bpm — AF confirmed'},
     {k:'TFTs',v:'TSH <0.01 mU/L (suppressed), fT4 36 pmol/L (elevated), fT3 9.2 pmol/L — thyrotoxicosis'},
     {k:'FBC',v:'Hb 129, WCC 8.2, Plt 312 — normal'},
     {k:'U&E',v:'Na 138, K 3.6 (low normal), Cr 82 — normal'},
     {k:'CXR',v:'Mild cardiomegaly. Mild upper lobe diversion. No frank pulmonary oedema.'},
     {k:'Echo (urgent)',v:'Mildly dilated LA. Preserved EF 58%. No thrombus seen (TOE not yet done).'},
   ],
   questions:[
     {q:'Calculate the CHA₂DS₂-VA score. Does she require anticoagulation?',
      opts:['Score 1 — no anticoagulation needed','Score 3 (HTN+age+female) — anticoagulate with DOAC','Score 2 — aspirin is sufficient','Score 0 — no treatment required'],
      ans:1,exp:'CHA₂DS₂-VA: C=Congestive HF(0), H=HTN(1), A₂=Age≥75(0, age67), D=Diabetes(1), S₂=Stroke/TIA(0), V=Vascular disease(0), A=Age65-74(1), Sc=Sex category F(0, now removed from Australian guidelines as per 2018 update) = score 3 in some calculators. Key point: score ≥2 in males or ≥3 in females = anticoagulate. DOAC (apixaban/rivaroxaban/dabigatran) preferred over warfarin.'},
     {q:'Rate control target for AF and the most appropriate first-line agent given her thyrotoxicosis?',
      opts:['Target HR <100bpm; metoprolol (beta-blocker) first line','Target HR <60bpm; digoxin first line','Target HR <80bpm; amiodarone first line','Target HR <100bpm; verapamil first line'],
      ans:0,exp:'Rate control target is HR <100bpm at rest (lenient) or <80bpm (stricter, for symptomatic patients). Beta-blockers are first-line for rate control in AF — and are specifically indicated in thyrotoxic AF as they blunt catecholamine effects. Amiodarone avoided (contains iodine → worsens thyrotoxicosis). Digoxin less effective in high sympathetic states.'},
     {q:'She has been in AF for 6 hours. Can you attempt cardioversion now?',
      opts:['No — she needs 3 weeks anticoagulation first regardless','Yes — onset <48h, anticoagulate then cardiovert if stable; TOE-guided if uncertain','No — she needs an Echo first before any decision','Yes — cardiovert immediately, no anticoagulation needed <48h'],
      ans:1,exp:'Duration <48h: cardioversion is safe with appropriate anticoagulation (therapeutic LMWH or DOAC) given immediately before. Onset >48h or unknown: 3 weeks therapeutic anticoagulation before cardioversion (or TOE to exclude left atrial thrombus). Her thyrotoxicosis must be treated first — cardioversion unlikely to maintain SR until euthyroid.'},
     {q:'Her thyrotoxicosis is identified as the precipitant. What changes to her AF management does this require?',
      opts:['Treat the thyrotoxicosis with carbimazole — AF likely to resolve once euthyroid; maintain anticoagulation throughout','Stop carbimazole — it caused the AF','Perform urgent thyroidectomy before any AF treatment','No change to management — treat AF independently of thyroid status'],
      ans:0,exp:'Thyrotoxic AF: treating the underlying hyperthyroidism is key — AF often reverts to SR once euthyroid, which may take weeks to months. Continue/optimise carbimazole. Beta-blocker provides both rate control AND symptomatic thyrotoxicosis relief. Maintain anticoagulation throughout (thromboembolic risk persists until documented SR after euthyroid state).'},
   ]},

  // TOPIC 1 — Pulmonary Embolism
  {name:'Submassive Pulmonary Embolism',icon:'🫀',diff:'h',topic:'T1 — Respiratory',
   patient:'Mr. Aaron Bridges, 44M',
   vitals:['BP 96/60','HR 118 bpm','RR 26','SpO₂ 88% on air','Temp 37.6°C'],
   hx:[
     {k:'PC',v:'Sudden-onset dyspnoea and pleuritic chest pain, right side, 2 hours'},
     {k:'HPC',v:'Woke from sleep with SOB and sharp right-sided chest pain worse on inspiration. Mild haemoptysis (one episode, small). Recent long-haul flight (14hr) 5 days ago. No leg swelling noticed by patient.'},
     {k:'PMHx',v:'Nil. No prior VTE. No malignancy.'},
     {k:'Medications',v:'Nil regular medications'},
     {k:'RF for VTE',v:'Long-haul flight, obesity (BMI 34), dehydration during travel'},
     {k:'SHx',v:'Sales manager. Non-smoker. Alcohol socially.'},
   ],
   ex:[
     {k:'General',v:'Distressed, tachypnoeic, diaphoretic.'},
     {k:'CVS',v:'Tachycardia 118bpm, BP 96/60. JVP elevated at 6cm. Right heart heave. Loud P2. No peripheral oedema.'},
     {k:'Respiratory',v:'Reduced air entry right base. Pleural rub right side. RR 26.'},
     {k:'Legs',v:'Right calf tender, warm, erythematous, 3cm difference in circumference vs left — DVT confirmed on duplex USS.'},
   ],
   ix:[
     {k:'Wells Score (PE)',v:'Score 7 — high probability (DVT signs 3pts, alternative dx less likely 3pts, HR>100 1pt)'},
     {k:'CTPA',v:'Bilateral pulmonary emboli. Saddle embolus at main pulmonary artery bifurcation. Right heart strain visible.'},
     {k:'ECG',v:'Sinus tachycardia. S1Q3T3 pattern. Incomplete RBBB.'},
     {k:'Troponin I',v:'0.42 ng/mL (elevated — right heart strain)'},
     {k:'BNP',v:'680 pg/mL (markedly elevated — RV strain)'},
     {k:'Echo (urgent)',v:'RV dilation, septal flattening (D-sign), estimated RVSP 58mmHg, McConnell\'s sign present'},
     {k:'ABG (on 4L O₂)',v:'pH 7.46, pO₂ 8.2, pCO₂ 3.4 — Type I RF, respiratory alkalosis'},
   ],
   questions:[
     {q:'Based on vitals, imaging and biomarkers, how would you classify this PE?',
      opts:['Low-risk PE — PESI class I','Submassive (intermediate-high risk) PE — haemodynamically borderline with RV strain','Massive PE — start thrombolysis immediately','Incidental PE — outpatient DOAC and discharge'],
      ans:1,exp:'PE classification: Massive = haemodynamic collapse (SBP<90, cardiac arrest). Submassive/intermediate-high risk = haemodynamically borderline (BP 96/60) + RV dysfunction (echo) + elevated troponin + BNP. This patient is deteriorating — ICU/HDU monitoring, consider systemic thrombolysis if further decompensation. PESI score guides outpatient vs inpatient.'},
     {q:'What is the immediate anticoagulation of choice and why?',
      opts:['Warfarin — start immediately','Unfractionated heparin IV infusion — preferred in haemodynamically unstable patients (reversible, short half-life, allows thrombolysis if needed)','Rivaroxaban 15mg BD orally — easiest option','LMWH subcutaneous — same as UFH'],
      ans:1,exp:'IV unfractionated heparin preferred in massive/submassive PE requiring potential thrombolysis — it can be rapidly reversed and has shorter half-life. If thrombolysis is given, UFH must be stopped. After thrombolysis, restart UFH when APTT <80s. In haemodynamically stable PE, DOAC (rivaroxaban or apixaban) is first-line per current guidelines.'},
     {q:'His BP drops to 78/50 despite fluids and anticoagulation. What is your next step?',
      opts:['Emergency surgical embolectomy only','Systemic thrombolysis (e.g. alteplase 100mg IV over 2hrs) unless contraindicated','Increase IV fluids aggressively — 2L bolus','Increase O₂ and observe another 30 minutes'],
      ans:1,exp:'Haemodynamic collapse in PE = massive PE → systemic thrombolysis (alteplase 100mg over 2hrs) is first-line unless absolute contraindications (recent surgery, bleeding, stroke). Relative contraindications must be weighed against death. Surgical embolectomy or catheter-directed thrombolysis if thrombolysis contraindicated or fails. Large fluid boluses can worsen RV dilation.'},
     {q:'How long should anticoagulation continue after discharge, and what risk assessment tool guides duration?',
      opts:['3 months — standard for all PE','Indefinitely — all PE patients anticoagulate forever','6–12 months minimum; consider indefinite if unprovoked (no identifiable risk factor)','1 month — PE resolves quickly'],
      ans:2,exp:'Provoked PE (e.g. surgery, immobility, flight): 3–6 months. Unprovoked PE: ≥6 months, consider indefinite anticoagulation weighing bleeding risk vs recurrence. Tools: HERDOO2 or Vienna prediction model for recurrence risk. DOACs (rivaroxaban, apixaban) now preferred over warfarin for extended treatment. Cancer-associated PE: LMWH or DOAC (rivaroxaban/apixaban preferred per current guidelines).'},
   ]},

  // TOPIC 3 — MS / Neurological
  {name:'First Presentation of Multiple Sclerosis',icon:'🧠',diff:'h',topic:'T3 — Neurology',
   patient:'Ms. Priya Mehta, 29F',
   vitals:['BP 118/74','HR 72 bpm','RR 14','SpO₂ 99%','Temp 37.0°C'],
   hx:[
     {k:'PC',v:'Painful loss of vision right eye and right arm numbness, 10 days'},
     {k:'HPC',v:'Sudden painful blurring right eye (worse with eye movement) 10 days ago — improved 60% over the week. Simultaneously developed right arm numbness and tingling, no weakness. History of an episode 2 years ago of double vision lasting 3 weeks which she attributed to "stress".'},
     {k:'PMHx',v:'Nil significant'},
     {k:'Medications',v:'OCP (levonorgestrel/ethinyl oestradiol)'},
     {k:'FHx',v:'Maternal aunt — MS (diagnosed age 35)'},
     {k:'SHx',v:'Junior doctor. Non-smoker. Socially isolated past month due to symptoms.'},
   ],
   ex:[
     {k:'Visual',v:'Right eye: VA 6/24 (reduced). Relative afferent pupillary defect (RAPD) right eye. Red desaturation right eye. Fundoscopy: disc appears normal (retrobulbar neuritis).'},
     {k:'Eye movements',v:'Painless restriction in adduction left eye + nystagmus right eye on right gaze — internuclear ophthalmoplegia (INO). Right eye abduction full.'},
     {k:'UL',v:'Right arm: reduced pinprick and vibration. Reduced proprioception right hand. Mild right arm weakness MRC 4+/5.'},
     {k:'Reflexes',v:'Right arm reflexes brisk (hyperreflexia). Right plantar — upgoing (extensor). Left side normal.'},
     {k:'Lhermitte sign',v:'Positive — neck flexion causes electric shock sensation down spine'},
   ],
   ix:[
     {k:'MRI Brain + Cord (with gadolinium)',v:'Multiple periventricular demyelinating plaques. Juxtacortical lesion right parietal. Active enhancing lesion in right optic nerve. Cervical cord lesion C4/5 (Dawson\'s fingers pattern)'},
     {k:'CSF (LP)',v:'Oligoclonal bands present (not in serum). Mildly elevated protein 0.6g/L. 8 lymphocytes/mm³. IgG index elevated.'},
     {k:'Visual evoked potentials',v:'Delayed P100 latency right eye — confirms optic nerve demyelination'},
     {k:'AQP4-IgG / MOG-IgG',v:'Both negative — excludes NMOSD and MOG-AD'},
     {k:'Blood',v:'Normal FBC, CMP, B12, TFTs, ANA — no metabolic/autoimmune alternative explanation'},
   ],
   questions:[
     {q:'This presentation fulfils diagnostic criteria for which condition, and what is the key diagnostic framework?',
      opts:['Neuromyelitis optica — positive AQP4-IgG','Multiple sclerosis — McDonald criteria 2017 (dissemination in space AND time)','Functional neurological disorder — no radiological basis','B12 deficiency — subacute combined degeneration'],
      ans:1,exp:'McDonald Criteria 2017 for MS: Dissemination in Space (DIS) — lesions in ≥2 of 4 CNS locations (periventricular, juxtacortical, infratentorial, spinal cord). Dissemination in Time (DIT) — new T2/enhancing lesion on follow-up OR simultaneous enhancing + non-enhancing lesions. AQP4 negative excludes NMOSD. This patient fulfils DIS (optic nerve + cord + periventricular) and DIT (prior episode + new active lesion).'},
     {q:'What is the acute treatment for her optic neuritis and acute relapse?',
      opts:['Oral prednisolone 1mg/kg/day for 6 weeks','IV methylprednisolone 1g/day for 3–5 days — speeds recovery but does not change long-term outcome','Plasma exchange immediately','No treatment — self-limiting'],
      ans:1,exp:'IV methylprednisolone 1g/day x 3–5 days is standard for acute MS relapses. It accelerates recovery but does NOT change long-term disability or prevent future relapses. Oral high-dose steroids are equivalent per PROMISE-MS trial. Plasma exchange (PLEX) reserved for severe steroid-refractory relapses. Visual recovery from optic neuritis is usually good (85% recover to 6/12 or better).'},
     {q:'Which disease-modifying therapy (DMT) category would you consider at diagnosis, and what principle guides selection?',
      opts:['No DMT until second relapse to confirm MS','High-efficacy DMT (natalizumab, ocrelizumab) first-line for all MS','Moderate-efficacy DMT (interferon-beta, glatiramer, dimethyl fumarate) or high-efficacy depending on disease activity — escalation vs induction approach','Azathioprine only — standard in Australia'],
      ans:2,exp:'MS DMT: Escalation approach = start moderate-efficacy (interferon-beta, glatiramer acetate, dimethyl fumarate, teriflunomide) and escalate if breakthrough activity. Induction approach = start high-efficacy (natalizumab, ocrelizumab, alemtuzumab) early, preferred in aggressive disease. This young patient with INO (brainstem), optic neuritis and cord lesion may benefit from high-efficacy therapy. PBS criteria apply in Australia.'},
     {q:'What does the internuclear ophthalmoplegia (INO) finding localise to, and what causes it?',
      opts:['Cranial nerve III nucleus','Medial longitudinal fasciculus (MLF) — connects CN III and CN VI nuclei','Optic chiasm','Cerebellum — coordination fibres'],
      ans:1,exp:'INO = lesion in the medial longitudinal fasciculus (MLF). The MLF connects the ipsilateral CN VI nucleus to the contralateral CN III nucleus, coordinating conjugate gaze. MLF lesion: IMPAIRED ADDUCTION ipsilateral eye + nystagmus abducting eye. Bilateral INO in a young woman = MS until proven otherwise. One-and-a-half syndrome = MLF + PPRF lesion.'},
   ]},

  // TOPIC 3 — Thyroid / Endocrine
  {name:'Thyroid Storm',icon:'🌡️',diff:'h',topic:'T3 — Endocrine',
   patient:'Mr. James Kowalski, 38M',
   vitals:['BP 168/90','HR 156 bpm','RR 24','SpO₂ 97%','Temp 40.2°C','GCS 13'],
   hx:[
     {k:'PC',v:'Agitation, confusion, fever and fast heart rate — brought by partner'},
     {k:'HPC',v:'3 days worsening confusion and agitation. Partner notes weight loss past 2 months, excessive sweating, diarrhoea. Stopped his "thyroid tablets" 6 weeks ago as "felt better". Precipitated by URI last week.'},
     {k:'PMHx',v:'Graves\' disease diagnosed 18 months ago — on carbimazole and propranolol (self-ceased 6 weeks ago)'},
     {k:'Medications',v:'Carbimazole 20mg (stopped 6 weeks ago), propranolol 40mg BD (stopped)'},
   ],
   ex:[
     {k:'General',v:'Agitated, sweating profusely, hot to touch. Tremor. Cannot follow commands reliably.'},
     {k:'CVS',v:'HR 156 irregular (AF). BP 168/90. Wide pulse pressure. Warm peripheries. Bounding pulse.'},
     {k:'Thyroid',v:'Diffuse smooth goitre. Bruit audible over gland.'},
     {k:'Eyes',v:'Proptosis bilateral. Lid retraction. Lid lag. Chemosis right eye.'},
     {k:'Neurology',v:'GCS 13 (E3V4M6). Agitated. Fine tremor hands. Hyperreflexia.'},
   ],
   ix:[
     {k:'TFTs',v:'TSH <0.01 (undetectable), fT4 >100 pmol/L, fT3 >30 pmol/L — severely thyrotoxic'},
     {k:'TSH receptor antibodies',v:'Markedly elevated — confirms Graves\' disease'},
     {k:'Burch-Wartofsky Score',v:'Score 75 (fever 40.2°C=30, HR>140=25, AF=10, confusion=20) — confirmed thyroid storm'},
     {k:'ECG',v:'Atrial fibrillation, rate 156bpm, no ischaemic changes'},
     {k:'FBC',v:'WCC 14.2 (stress leukocytosis). No left shift.'},
     {k:'LFTs',v:'ALT 78, AST 62 — mildly elevated (thyrotoxic hepatopathy)'},
   ],
   questions:[
     {q:'What is the Burch-Wartofsky Point Scale used for and what score indicates thyroid storm?',
      opts:['Grades hyperthyroidism severity; score >45 = thyroid storm','Diagnoses autoimmune cause; score >10 = Graves','Guides dose of carbimazole; higher score = higher dose','Predicts surgical risk; >50 = too high risk for thyroidectomy'],
      ans:0,exp:'Burch-Wartofsky Point Scale (BWPS): scores temperature (up to 30pts), CNS effects (10-30pts), GI-hepatic dysfunction (10-20pts), cardiovascular (5-25pts), precipitant identified (10pts). Score ≥45 = thyroid storm; 25-44 = impending storm. This patient scores ~70-75. Diagnosis is clinical — do NOT wait for TFT results to treat.'},
     {q:'What is the correct order of medications in thyroid storm management?',
      opts:['Propylthiouracil (PTU) → Lugol\'s iodine (wait 1hr) → Propranolol → Hydrocortisone','Start Lugol\'s iodine first, then PTU','Carbimazole → wait for TFTs → then propranolol','Propranolol → Lugol\'s iodine → PTU → hydrocortisone'],
      ans:0,exp:'Thyroid storm treatment sequence matters: (1) PTU 500-1000mg loading (blocks new hormone synthesis AND peripheral T4→T3 conversion — hence preferred over carbimazole); (2) Lugol\'s iodine at LEAST 1hr after PTU (to prevent iodine being used as substrate for new hormone); (3) Propranolol (rate control + blocks peripheral conversion); (4) Hydrocortisone (relative adrenal insufficiency + reduces peripheral conversion). Supportive: cooling, fluids, treat precipitant.'},
     {q:'After he stabilises, what are the long-term definitive management options for Graves\' disease?',
      opts:['Lifelong antithyroid drugs (ATDs) — carbimazole forever','ATDs for 12-18 months trial (50% remission); or radioiodine (I-131); or thyroidectomy — patient preference guides choice','Radioiodine is contraindicated in Graves\'','Only thyroidectomy is appropriate after thyroid storm'],
      ans:1,exp:'Graves\' disease: Three options. (1) ATDs (carbimazole/PTU) 12-18 months — 50% remission, monitor for agranulocytosis. (2) Radioiodine (I-131) — effective, induces hypothyroidism in ~80%, contraindicated in pregnancy and active severe ophthalmopathy. (3) Total thyroidectomy — rapid cure, requires lifelong thyroxine, risks: hypoparathyroidism, recurrent laryngeal nerve injury. This patient\'s non-compliance = consider definitive therapy.'},
     {q:'His ophthalmopathy is worsening with proptosis and chemosis. What is the specific risk with radioiodine in this context?',
      opts:['Radioiodine is safe — ophthalmopathy is unrelated to thyroid','Radioiodine can transiently worsen Graves\' ophthalmopathy — cover with prednisolone if used','Radioiodine treats ophthalmopathy directly','Ophthalmopathy must be surgically treated first before radioiodine'],
      ans:1,exp:'Graves\' ophthalmopathy (GO): active moderate-to-severe GO is a relative contraindication to radioiodine — it can worsen ophthalmopathy in 15-20% of cases (likely immune flare). If radioiodine must be used in active GO, concurrent prednisolone (0.3-0.5mg/kg/day) for 3 months reduces this risk. Selenium (200mcg/day) is recommended for mild active GO. Severe GO: IV methylprednisolone pulses, orbital decompression surgery if sight-threatening.'},
   ]},

  // TOPIC 4 — Rheumatoid Arthritis + Palliative
  {name:'Rheumatoid Arthritis — Acute Flare & Complications',icon:'🦴',diff:'m',topic:'T4 — Rheumatology',
   patient:'Mrs. Dorothy Walsh, 58F',
   vitals:['BP 138/84','HR 88 bpm','RR 16','SpO₂ 96%','Temp 37.8°C'],
   hx:[
     {k:'PC',v:'Bilateral hand and wrist swelling, morning stiffness >2 hours, worsening for 6 weeks'},
     {k:'HPC',v:'Known RA x12 years. Currently on methotrexate and hydroxychloroquine. Missed last 3 rheumatology appointments. Progressive worsening of MCP and wrist joints. Morning stiffness >3 hours. Can no longer open jars. Noticed new nodules on elbows. Mild SOB on exertion (new symptom).'},
     {k:'Extra-articular',v:'Scleritis right eye 2 months ago (treated with topical steroids). Dry eyes and mouth (Sicca symptoms). Previous episode of pericarditis 5 years ago.'},
     {k:'PMHx',v:'RA x12yr, osteoporosis (on alendronate), mild ILD on HRCT (found incidentally 3yr ago)'},
     {k:'Medications',v:'Methotrexate 15mg/week, hydroxychloroquine 400mg, alendronate, calcium/vitamin D, folic acid 5mg'},
   ],
   ex:[
     {k:'Hands',v:'Bilateral MCP and PIP synovitis. Ulnar deviation. Swan-neck deformity index fingers. Boutonnière left middle finger. Rheumatoid nodules bilateral elbows.'},
     {k:'Wrists',v:'Bilateral dorsal tenosynovitis. Reduced wrist extension.'},
     {k:'Respiratory',v:'Fine bibasal inspiratory crackles. Clubbing present. SpO₂ 96% at rest, drops to 92% on exertion.'},
     {k:'Eyes',v:'Scleritis resolved. Mild keratoconjunctivitis sicca noted.'},
   ],
   ix:[
     {k:'RF',v:'1:2560 (strongly positive)'},
     {k:'Anti-CCP',v:'>340 U/mL (strongly positive — high specificity for RA)'},
     {k:'CRP',v:'68 mg/L, ESR 88 mm/hr — active disease'},
     {k:'FBC',v:'Hb 102 (normocytic — anaemia of chronic disease). WCC 9.2 (methotrexate causing no current cytopaenia).'},
     {k:'LFTs',v:'ALT 58 (borderline elevated — methotrexate monitoring)'},
     {k:'HRCT Chest',v:'Progressive bibasal honeycombing and traction bronchiectasis — RA-associated ILD (UIP pattern) — worsened from prior scan'},
     {k:'PFTs',v:'FVC 62% predicted, DLCO 48% predicted — moderate restrictive pattern'},
     {k:'Hand XR',v:'Bilateral MCP erosions, periarticular osteopaenia, joint space narrowing. Carpal coalition early signs.'},
   ],
   questions:[
     {q:'The DAS28 score is used to assess RA activity. What score range indicates remission and what score indicates high disease activity?',
      opts:['Remission <2.6; High activity >5.1','Remission <1.0; High activity >10','Remission <4.0; High activity >6','Remission <3.2; High activity >4.2'],
      ans:0,exp:'DAS28 (Disease Activity Score using 28 joints): Remission <2.6; Low activity 2.6–3.2; Moderate activity 3.2–5.1; High activity >5.1. Calculated using TJC28, SJC28, ESR or CRP, and patient global assessment. Used to guide treatment escalation — EULAR/ACR treat-to-target: aim for remission or low disease activity. This patient\'s CRP 68 + bilateral synovitis = high disease activity.'},
     {q:'She has failed methotrexate + hydroxychloroquine. What is the next step in her DMARD therapy?',
      opts:['Increase methotrexate dose to maximum only','Add a biologic DMARD (e.g. TNF inhibitor: adalimumab/etanercept) or JAK inhibitor (e.g. baricitinib) in combination with methotrexate','Switch to hydroxychloroquine alone','Prescribe prednisolone long-term — replace all DMARDs'],
      ans:1,exp:'Treatment failure of csDMARDs → add biologic DMARD (bDMARD) or targeted synthetic DMARD (tsDMARD). TNF inhibitors (adalimumab, etanercept, certolizumab) most used first biologic. If TNF fails: switch to different mechanism (abatacept, rituximab, tocilizumab). JAK inhibitors (baricitinib, upadacitinib) — oral, effective, but caution: cardiovascular risk, VTE, herpes zoster. Screen for TB, Hep B/C, HIV before starting biologics.'},
     {q:'Her HRCT shows progressive ILD with UIP pattern. Which RA medication is most implicated in causing ILD, and what is the management?',
      opts:['Methotrexate can cause drug-induced ILD — stop methotrexate; manage RA-ILD separately with nintedanib','Hydroxychloroquine — stop immediately','TNF inhibitors — contraindicated in all ILD','Alendronate — causes lung fibrosis'],
      ans:0,exp:'RA-ILD vs methotrexate-ILD: UIP pattern on HRCT is typical of RA-ILD (not methotrexate pneumonitis which is acute/subacute, NSIP pattern). However, methotrexate can worsen RA-ILD — most rheumatologists would switch away from it in progressive ILD. RA-ILD with progressive fibrosing pattern: nintedanib (antifibrotic) is now approved. Rituximab preferred biologic in RA-ILD (avoids potential ILD-worsening with some TNF inhibitors, though evidence evolving).'},
     {q:'She asks about her prognosis. Anti-CCP positivity at this level is associated with what prognostic significance?',
      opts:['Good prognosis — anti-CCP means likely remission','Poor prognosis marker — high anti-CCP associated with more erosive disease, extra-articular manifestations and worse functional outcomes','Anti-CCP has no prognostic value — only diagnostic','High anti-CCP means she will respond better to hydroxychloroquine'],
      ans:1,exp:'Anti-CCP (ACPA): high specificity (~96%) for RA diagnosis. High-titre anti-CCP correlates with: more erosive/destructive joint disease, extra-articular involvement (ILD, vasculitis, nodules), poorer functional outcomes, and predicts structural damage progression. It can be positive years before clinical RA onset (pre-clinical phase). Anti-CCP positive patients tend to respond better to rituximab vs TNF inhibitors (evidence-based consideration).'},
   ]},

  // TOPIC 6 — Haematology: Lymphoma
  {name:'Hodgkin Lymphoma',icon:'🔬',diff:'m',topic:'T6 — Haematology',
   patient:'Mr. Samuel Adeyemi, 23M',
   vitals:['BP 118/72','HR 84 bpm','RR 16','SpO₂ 99%','Temp 37.9°C'],
   hx:[
     {k:'PC',v:'Painless neck lumps and drenching night sweats for 3 months'},
     {k:'HPC',v:'Progressive right cervical lymphadenopathy — first noticed 3 months ago, now bilateral. Associated drenching night sweats (changing bedclothes), unintentional 8kg weight loss in 3 months, generalised pruritus, fatigue. Occasional mild fevers. No sore throat, no infective contact. Reports alcohol-induced pain at lymph node sites (Ebstein\'s sign — pathognomonic but rare).'},
     {k:'PMHx',v:'Nil significant. EBV infection (glandular fever) at age 17.'},
     {k:'Medications',v:'Nil'},
     {k:'SHx',v:'University student. Non-smoker. Occasional cannabis. No IVDU. Sexually active, monogamous.'},
   ],
   ex:[
     {k:'Lymph nodes',v:'Bilateral cervical lymphadenopathy — right 4x3cm, left 2x2cm, rubbery, non-tender, mobile. Left axillary node 2cm. No inguinal lymphadenopathy.'},
     {k:'Mediastinum',v:'Chest dull to percussion upper right — mediastinal mass. Trachea midline.'},
     {k:'Spleen',v:'Splenomegaly — 4cm below left costal margin.'},
     {k:'General',v:'Cachectic appearance, pale conjunctivae, excoriation marks from pruritus.'},
   ],
   ix:[
     {k:'FBC',v:'Hb 98 (normocytic anaemia). WCC 14.2 (lymphopenia on differential — poor prognostic sign). Plt 428 (reactive thrombocytosis). Eosinophilia.'},
     {k:'ESR',v:'112 mm/hr (markedly elevated — B symptom surrogate)'},
     {k:'LDH',v:'680 U/L (elevated — tumour burden marker)'},
     {k:'CXR',v:'Mediastinal widening — >1/3 thoracic diameter. "Mediastinal mass" — bulky disease.'},
     {k:'CT Chest/Abd/Pelvis',v:'Mediastinal mass 8x6cm. Bilateral cervical + axillary nodes. Splenomegaly. No infradiaphragmatic disease.'},
     {k:'PET-CT',v:'FDG-avid mediastinal mass + bilateral cervical/axillary nodes — Stage IIB (above diaphragm, B symptoms)'},
     {k:'Excisional lymph node biopsy',v:'Reed-Sternberg cells (owl-eye nucleoli). CD30+, CD15+. Nodular sclerosis subtype — most common HL subtype. EBV-associated.'},
   ],
   questions:[
     {q:'What are "B symptoms" in lymphoma and what is their prognostic significance?',
      opts:['Any fever, fatigue and sweating — poor prognosis in all cancers','Defined triad: fever >38°C, drenching night sweats, unexplained weight loss >10% in 6 months — indicates advanced/aggressive disease with worse prognosis','B symptoms indicate infection, not malignancy','B symptoms only apply to non-Hodgkin lymphoma'],
      ans:1,exp:'B symptoms (the "B" in Ann Arbor staging): Fever >38°C (unexplained), Drenching night sweats, Weight loss >10% body weight in preceding 6 months. Presence = B designation (e.g. Stage IIB vs IIA). B symptoms indicate more aggressive disease biology and correlate with worse OS. Absence = A designation. In HL, B symptoms affect choice between ABVD alone vs intensified regimens.'},
     {q:'Using Ann Arbor staging, what stage is this patient and what does it mean?',
      opts:['Stage I — single node region','Stage IIB — two or more node regions same side of diaphragm, with B symptoms','Stage IIIB — both sides of diaphragm involved with B symptoms','Stage IV — diffuse extranodal disease'],
      ans:1,exp:'Ann Arbor Staging: I=single node region; II=≥2 regions same side of diaphragm; III=both sides of diaphragm; IV=diffuse extranodal (bone marrow, liver). A/B suffix = absence/presence of B symptoms. This patient: bilateral cervical + axillary + mediastinum = Stage II (all above diaphragm). B symptoms present = Stage IIB. Bulky mediastinal disease (>1/3 thoracic diameter) = poor prognostic feature, may require radiotherapy addition.'},
     {q:'What is the standard first-line chemotherapy regimen for classical Hodgkin Lymphoma?',
      opts:['R-CHOP (rituximab, cyclophosphamide, doxorubicin, vincristine, prednisolone)','ABVD (doxorubicin, bleomycin, vinblastine, dacarbazine)','BEP (bleomycin, etoposide, cisplatin)','Chlorambucil monotherapy'],
      ans:1,exp:'ABVD is standard first-line for classical HL. 2–6 cycles depending on stage and response. Response monitored by interim PET-CT after 2 cycles (Deauville score) — guides escalation (BEACOPP) or de-escalation (omit bleomycin). Bleomycin causes pulmonary toxicity — monitor LFTs and PFTs. R-CHOP is for NHL (rituximab targets CD20, absent in HL Reed-Sternberg cells which are CD30+CD15+CD20-).'},
     {q:'What fertility considerations should be discussed BEFORE starting chemotherapy?',
      opts:['Fertility is unaffected by ABVD — no discussion needed','Sperm cryopreservation should be offered before chemotherapy; ABVD carries risk of azoospermia and infertility','Chemotherapy always causes permanent infertility — no point banking','Only discuss fertility if patient raises it themselves'],
      ans:1,exp:'Gonadotoxicity: ABVD carries moderate fertility risk. Sperm banking must be offered to ALL male patients prior to chemotherapy — urgent referral to fertility service. For female patients: oocyte/embryo cryopreservation, GnRH agonist co-administration (ovarian suppression). Alkylating agents (BEACOPP) are more gonadotoxic than ABVD. Fertility discussion is a medico-legal requirement before starting cytotoxic therapy in reproductive-age patients.'},
   ]},

  // TOPIC 6 — Oncology: Lung Cancer
  {name:'Non-Small Cell Lung Cancer',icon:'🫁',diff:'h',topic:'T6 — Oncology',
   patient:'Mr. Ronald Pattison, 68M',
   vitals:['BP 142/86','HR 78 bpm','RR 18','SpO₂ 94%','Temp 37.2°C'],
   hx:[
     {k:'PC',v:'Haemoptysis, weight loss and right shoulder pain for 8 weeks'},
     {k:'HPC',v:'Persistent haemoptysis (blood-streaked sputum, 5 episodes). Unintentional 7kg weight loss over 2 months. Right shoulder and arm pain with paraesthesia in right hand. Progressive hoarseness of voice last 3 weeks. Previously well.'},
     {k:'Smoking',v:'60 pack-year smoking history. Quit 10 years ago.'},
     {k:'PMHx',v:'COPD (GOLD II), hypertension, dyslipidaemia'},
     {k:'Medications',v:'Salbutamol PRN, fluticasone/salmeterol, ramipril, atorvastatin'},
     {k:'Occupational',v:'Former asbestos worker (shipyard) — 20 years exposure'},
     {k:'FHx',v:'Brother: lung cancer (non-smoker, age 62)'},
   ],
   ex:[
     {k:'General',v:'Cachectic. Nicotine staining fingers. Clubbing grade 2.'},
     {k:'Eyes/face',v:'RIGHT: ptosis, miosis, enophthalmos, anhidrosis — Horner\'s syndrome. Facial flushing right side.'},
     {k:'Neck',v:'Hoarse voice (bovine cough). Right supraclavicular lymph node 2x2cm, hard, fixed.'},
     {k:'Chest',v:'Reduced expansion right upper zone. Dullness right apex. Absent breath sounds right upper lobe.'},
     {k:'Neurology',v:'Reduced pinprick C8/T1 right hand. Intrinsic hand muscle wasting right.'},
   ],
   ix:[
     {k:'CXR',v:'Right apical mass 5x4cm. Right hilum enlarged. Right upper lobe atelectasis. No pleural effusion.'},
     {k:'CT Chest/Abd/Pelvis',v:'Right apical mass invading thoracic inlet, subclavian vessels and T1 nerve root. Right mediastinal and supraclavicular nodes. No liver/adrenal metastases on CT.'},
     {k:'PET-CT',v:'FDG-avid right apical mass + right N2/N3 nodes. No distant metastases — Stage IIIB (T4N3M0).'},
     {k:'CT-guided biopsy',v:'Adenocarcinoma (NSCLC). Molecular testing: EGFR exon 19 deletion — targetable mutation. ALK negative. PD-L1 TPS 45%.'},
     {k:'Pulmonary function (pre-op assessment)',v:'FEV1 1.4L (58% predicted), DLCO 62% — borderline for surgical resection'},
     {k:'Brain MRI',v:'No intracranial metastases'},
   ],
   questions:[
     {q:'This presentation describes a Pancoast tumour. What is the classic triad?',
      opts:['Haemoptysis + clubbing + weight loss','Horner\'s syndrome + shoulder/arm pain + hand muscle wasting (T1/C8 involvement)','Hoarse voice + stridor + SVC obstruction','Pleural effusion + mediastinal shift + finger clubbing'],
      ans:1,exp:'Pancoast (superior sulcus) tumour: apical lung tumour invading the thoracic inlet. Classic triad: (1) Horner\'s syndrome (ipsilateral ptosis, miosis, enophthalmos, anhidrosis) — sympathetic chain compressed at stellate ganglion; (2) Shoulder/arm pain radiating down inner arm; (3) C8/T1 hand muscle wasting and sensory loss. Additional: hoarseness (RLN), SVC obstruction (facial oedema). Nearly always NSCLC.'},
     {q:'Molecular profiling reveals an EGFR exon 19 deletion. What is the significance and first-line treatment?',
      opts:['EGFR mutation means worse prognosis — chemotherapy only','EGFR exon 19 deletion = targetable mutation — first-line osimertinib (3rd generation EGFR-TKI) significantly superior to chemotherapy','EGFR testing is irrelevant for NSCLC','Start erlotinib only — osimertinib not available'],
      ans:1,exp:'EGFR mutations (exon 19 deletion, exon 21 L858R) = present in ~15% NSCLC (higher in never-smokers, Asian patients, adenocarcinoma). EGFR-TKIs (tyrosine kinase inhibitors) are first-line: Osimertinib (3rd gen, FLAURA trial) preferred — better CNS penetration, treats T790M resistance mutation. PFS ~18-20 months vs chemotherapy 10 months. All advanced NSCLC should have EGFR, ALK, ROS1, BRAF, MET, RET, KRAS molecular testing before treatment.'},
     {q:'He develops progressive facial oedema, arm oedema and dilated chest wall veins. What is the diagnosis and emergency management?',
      opts:['Cardiac failure — start diuretics','Superior vena cava (SVC) obstruction — dexamethasone 8mg BD, urgent oncology referral, endovascular stenting','Bilateral axillary lymphadenopathy — observe','Anaphylaxis — adrenaline'],
      ans:1,exp:'SVC obstruction (SVCO): mediastinal compression of SVC → facial/arm oedema, dilated neck/chest veins, stridor. Oncological emergency. Management: (1) Dexamethasone 8mg BD (reduces tumour oedema); (2) Urgent radiation oncology/interventional radiology referral; (3) Endovascular stenting fastest symptom relief (~24-48h); (4) Radiotherapy (SCLC, lymphoma respond well); (5) Histological diagnosis before treatment if possible (unless critical). Elevate head of bed. Avoid IV access in arms (SVC obstruction).'},
     {q:'What paraneoplastic syndromes are associated with NSCLC specifically with lung cancer?',
      opts:['Only SCLC causes paraneoplastic syndromes','NSCLC: hypercalcaemia of malignancy (PTHrP — squamous), HPOA (clubbing + periostitis), hypertrophic osteoarthropathy; SCLC: SIADH, Cushing\'s (ACTH), Lambert-Eaton, cerebellar degeneration','Paraneoplastic syndromes only occur in haematological malignancy','NSCLC only causes clubbing — no other paraneoplastic features'],
      ans:1,exp:'Paraneoplastic syndromes by lung cancer type: NSCLC (Squamous): Hypercalcaemia via PTHrP secretion (most common paraneoplastic), Hypertrophic pulmonary osteoarthropathy (HPOA — periosteal reaction, arthritis, clubbing). NSCLC (Adenocarcinoma): HPOA, Clubbing. SCLC (small cell): SIADH (hyponatraemia), Ectopic ACTH (Cushing\'s), Lambert-Eaton myasthenic syndrome (voltage-gated Ca channel antibodies), Anti-Hu cerebellar degeneration, Limbic encephalitis.'},
   ]},

  // TOPIC 4 — Palliative / End of Life
  {name:'Palliative Care — Goals of Care',icon:'🕊️',diff:'m',topic:'T4 — Palliative Care',
   patient:'Mrs. Edna Cooper, 82F',
   vitals:['BP 96/58','HR 92 bpm (irreg)','RR 22','SpO₂ 91% on 2L O₂','Temp 37.4°C'],
   hx:[
     {k:'PC',v:'Admitted with aspiration pneumonia — background advanced dementia and metastatic colon cancer'},
     {k:'Oncological background',v:'Metastatic colon cancer (hepatic + pulmonary metastases), diagnosed 18 months ago. Declined chemotherapy. Now receiving palliative care community support. ECOG performance status 4 (bed-bound).'},
     {k:'Dementia',v:'Advanced Alzheimer\'s dementia — non-verbal, does not recognise family, receives all nutrition via assisted feeding (PEG not placed due to goals of care).'},
     {k:'ACP',v:'Advance Care Plan completed 6 months ago: patient previously expressed wishes for no CPR, no ICU, no mechanical ventilation, comfort-focused care. EPOA (medical) — daughter Sarah.'},
     {k:'Current admission',v:'Aspiration pneumonia — 3rd episode in 4 months. Reduced consciousness. Not eating or drinking past 5 days.'},
   ],
   ex:[
     {k:'General',v:'Cachectic, mottled peripheries, non-responsive to voice, withdraws to pain. Breathing irregular with long pauses (Cheyne-Stokes).'},
     {k:'Respiratory',v:'Coarse secretions audible at upper airway. RR 22 irregular. Use of accessory muscles.'},
     {k:'Cardiovascular',v:'Irregular pulse 92bpm. BP 96/58. Cool peripheries.'},
     {k:'Skin',v:'Sacral pressure injury grade 2. Jaundice.'},
   ],
   ix:[
     {k:'Clinical assessment',v:'Dying trajectory consistent: mottled, reduced consciousness, irregular breathing, poor perfusion, not eating/drinking'},
     {k:'Bloods (reviewed)',v:'Na 152 (hypernatraemic — dehydration), Cr 280 (AKI), Bili 68 (jaundice — hepatic metastases), WCC 18.4'},
     {k:'CXR',v:'Bilateral aspiration changes. Pulmonary metastases. No pneumothorax.'},
   ],
   questions:[
     {q:'She appears to be dying. What clinical signs indicate she is likely in the last hours to days of life?',
      opts:['High WBC — infection must be treated first','Mottling, cool peripheries, Cheyne-Stokes respiration, not eating/drinking, reduced consciousness, reduced urine output — signs of active dying','Jaundice always indicates reversible hepatic failure — treat aggressively','SpO₂ 91% — must escalate to NIV'],
      ans:1,exp:'Signs of active dying (last hours-days): Cheyne-Stokes or agonal breathing, mottling of skin (livedo reticularis), cooling peripheries, reduced/absent consciousness, cessation of eating/drinking, oliguria/anuria, jaw relaxation, pooling of secretions (death rattle), reduced blood pressure. These are EXPECTED physiological changes — do not require aggressive intervention. The NSW "Last Days of Life" toolkit provides guidance on recognising and managing this phase.'},
     {q:'The daughter asks that "everything be done" including CPR. The patient\'s ACP states no CPR. How do you approach this?',
      opts:['Override ACP — family wishes override patient\'s prior expressed wishes','Respect the patient\'s documented ACP (no CPR). Compassionately explain that the ACP reflects her mother\'s own values and wishes expressed when she had capacity. Explore what "everything" means to the daughter.','Attempt CPR anyway — always safe to do more','Transfer to ICU — decision is too difficult to make on ward'],
      ans:1,exp:'ACP and patient autonomy: A valid Advance Care Plan made when the patient had capacity represents their autonomous wishes and should be followed. CPR is NOT the default — it should only be performed if there is a realistic chance of meaningful recovery AND aligns with patient wishes. Compassionate communication: explore what "everything" means (daughter may mean care, love, presence — not necessarily invasive procedures). EPOA cannot override an explicit ACP. Document goals of care meeting carefully. Involve palliative care team.'},
     {q:'She is distressed with noisy secretions and laboured breathing. What is the appropriate pharmacological management?',
      opts:['IV antibiotics and aggressive hydration','Haloperidol + morphine + midazolam (subcutaneous via syringe driver) + hyoscine for secretions — anticipatory prescribing for comfort','Intubate for airway protection','Increase IV fluids to dilute secretions'],
      ans:1,exp:'End-of-life symptom management (anticipatory prescribing, per NSW CEC Last Days of Life guidelines): (1) Respiratory secretions: hyoscine butylbromide (Buscopan) SC — reduces secretions; repositioning; mouth care; reassure family; (2) Dyspnoea: morphine SC (opioid-naive: 2.5-5mg prn); (3) Agitation/delirium: haloperidol 0.5-1mg SC or midazolam 2.5-5mg SC; (4) Pain: morphine SC prn. Syringe driver for continuous symptom control. IV fluids in dying patient often increase secretions and discomfort — not recommended.'},
     {q:'The daughter asks whether withdrawing the IV fluids will "starve her mother to death". How do you respond?',
      opts:['She is right — you must continue IV fluids or it is euthanasia','Explain that in the dying process, the body naturally stops needing food and water. Artificial hydration in this context does not prolong life with quality and may increase suffering (secretions, oedema). Withdrawing burdensome treatment is ethically and legally distinct from euthanasia.','Never discuss this topic — refer to ethics committee','Restart IV fluids immediately to avoid legal liability'],
      ans:1,exp:'Withdrawing burdensome treatment is NOT euthanasia — this is a fundamental ethical and legal distinction in Australian law and medical ethics. In the dying process: the body loses the ability to use nutrition/fluids; artificial hydration can worsen oedema, secretions and discomfort without prolonging life meaningfully. The principle of "proportionate care" guides decisions — benefit vs burden. Acknowledge the daughter\'s distress, validate her love for her mother, explain the focus on comfort. Involve pastoral care, social work. Document meeting.'},
   ]},
];

// Append new cases to CASES array
NEW_CASES.forEach(c=>CASES.push(c));
// Rebuild scenario list with all cases including topics
scenList.innerHTML='';
CASES.forEach((c,i)=>{
  const diffs={e:'diff-e',m:'diff-m',h:'diff-h'};
  const diffL={e:'Standard',m:'Intermediate',h:'Advanced'};
  const topicTag=c.topic?`<span style="font-size:10px;color:var(--muted2);margin-left:6px">${c.topic}</span>`:'';
  scenList.innerHTML+=`<div class="scenario-card" onclick="startCase(${i})">
    <div class="sc-icon">${c.icon}</div>
    <div class="sc-info">
      <div class="sc-name">${c.name}${topicTag}</div>
      <div class="sc-meta">${c.patient} · ${c.questions.length} questions · 20 min</div>
    </div>
    <span class="sc-diff ${diffs[c.diff]}">${diffL[c.diff]}</span>
  </div>`;
});
