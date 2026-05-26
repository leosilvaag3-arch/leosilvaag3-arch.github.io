// ── LOGIN ──
let e;
function doLogin(){
  e=document.getElementById('inp-email').value;
  const s=document.getElementById('inp-senha').value;
  const err=document.getElementById('login-error');
  if(!e||!s){err.style.display='block';err.textContent='Preencha todos os campos.';return}
  err.style.display='none';
  document.getElementById('page-login').classList.remove('active');
  document.getElementById('page-app').classList.add('active'); 
  document.querySelectorAll('.user-name').forEach(el => {el.innerText = e.slice(0, 10)});
  e = e.slice(0, 2).toUpperCase();
  document.querySelectorAll('.user-avatar').forEach(en => {en.innerText = e})
}
document.getElementById('inp-senha').addEventListener('keydown',e=>{if(e.key==='Enter')doLogin()});
function doLogout(){
  document.getElementById('page-app').classList.remove('active');
  document.getElementById('page-login').classList.add('active');
}

// ── NAVEGAÇÃO ──
function showNav(id, el){
  document.querySelectorAll('.nav-panel').forEach(p=>p.style.display='none');
  document.getElementById('nav-'+id).style.display='block';
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  el.classList.add('active');
  const titles={
    dashboard:['Dashboard','Visão geral · Julho 2025'],
    metas:['Metas','Objetivos financeiros · Acompanhamento'],
    modelo:['Modelo Matemático','Sistema linear interativo · Ax = b'],
  };
  document.getElementById('topbar-title').textContent=titles[id][0];
  document.getElementById('topbar-sub').textContent=titles[id][1];
  if(id==='modelo')renderMatrix();
}

// ── TEMA ──
function toggleTheme(){
  const html=document.documentElement;
  const dark=html.getAttribute('data-theme')==='dark';
  html.setAttribute('data-theme',dark?'light':'dark');
  document.getElementById('theme-btn').textContent=dark?'☾ Modo escuro':'☀ Modo claro';
}

// ── MODELO MATEMÁTICO ──
let N=3;

function changeSize(d){
  N=Math.min(5,Math.max(2,N+d));
  document.getElementById('size-display').textContent=N;
  document.getElementById('solution-box').classList.remove('visible');
  renderMatrix();
}

// Valores default para A e b
const defaultA={
  2:[[2,1],[1,3]],
  3:[[2,1,0],[1,3,1],[0,1,4]],
  4:[[4,1,0,0],[1,4,1,0],[0,1,4,1],[0,0,1,3]],
  5:[[5,1,0,0,0],[1,4,1,0,0],[0,1,4,1,0],[0,0,1,4,1],[0,0,0,1,3]],
};
const defaultB={2:[5,10],3:[8500,3200,1500],4:[8500,3200,1500,2000],5:[8500,3200,1500,2000,500]};

function renderMatrix(){
  const eq=document.getElementById('matrix-eq-display');
  const dA=defaultA[N], dB=defaultB[N];

  // Matriz A
  let aHtml=`<div style="display:inline-block"><div style="font-family:var(--mono);font-size:.75rem;color:var(--text3);margin-bottom:.3rem;text-align:center">A</div>
    <div class="matrix-grid" style="grid-template-columns:repeat(${N},1fr)">`;
  for(let i=0;i<N;i++) for(let j=0;j<N;j++)
    aHtml+=`<input class="matrix-input" id="a${i}${j}" type="number" step="0.01" value="${dA[i][j]}">`;
  aHtml+=`</div></div>`;

  // Vetor b
  let bHtml=`<div style="display:inline-block"><div style="font-family:var(--mono);font-size:.75rem;color:var(--text3);margin-bottom:.3rem;text-align:center">b</div>
    <div class="vec-grid">`;
  for(let i=0;i<N;i++)
    bHtml+=`<input class="matrix-input" id="b${i}" type="number" step="0.01" value="${dB[i]}">`;
  bHtml+=`</div></div>`;

  eq.innerHTML=`${aHtml}
    <div class="eq-sym">·</div>
    <div style="display:inline-block"><div style="font-family:var(--mono);font-size:.75rem;color:var(--accent-ll);margin-bottom:.3rem;text-align:center">x</div>
      <div class="vec-grid">${Array.from({length:N},(_,i)=>`<div style="padding:.4rem .5rem;font-family:var(--mono);font-size:.9rem;color:var(--text3)">x${toSub(i)}</div>`).join('')}</div>
    </div>
    <div class="eq-sym">=</div>
    ${bHtml}`;
}

function toSub(i){return['₁','₂','₃','₄','₅'][i]}

// Eliminação gaussiana
function gaussianElimination(A,b){
  const n=A.length;
  const M=A.map((row,i)=>[...row,b[i]]);
  for(let col=0;col<n;col++){
    let pivot=col;
    for(let r=col+1;r<n;r++) if(Math.abs(M[r][col])>Math.abs(M[pivot][col]))pivot=r;
    [M[col],M[pivot]]=[M[pivot],M[col]];
    if(Math.abs(M[col][col])<1e-12) return null; // singular
    for(let r=0;r<n;r++){
      if(r===col)continue;
      const f=M[r][col]/M[col][col];
      for(let c=col;c<=n;c++) M[r][c]-=f*M[col][c];
    }
  }
  return M.map((row,i)=>row[n]/row[i]);
}

function solveSystem(){
  const A=[],b=[];
  for(let i=0;i<N;i++){
    A.push([]);
    for(let j=0;j<N;j++){
      const v=parseFloat(document.getElementById(`a${i}${j}`).value)||0;
      A[i].push(v);
    }
    b.push(parseFloat(document.getElementById(`b${i}`).value)||0);
  }
  const x=gaussianElimination(A,b);
  const box=document.getElementById('solution-box');
  const vec=document.getElementById('sol-vec');
  box.classList.add('visible');
  if(!x){
    vec.innerHTML='<span class="sol-err">Sistema sem solução única (matriz singular)</span>';
    return;
  }
  vec.innerHTML=x.map((v,i)=>
    `<div class="sol-cell">x${toSub(i)} = ${v.toLocaleString('pt-BR',{maximumFractionDigits:2})}</div>`
  ).join('');
}

// inicia matriz ao carregar
document.addEventListener('DOMContentLoaded',()=>{
  // Pre-render para quando acessar modelo
});