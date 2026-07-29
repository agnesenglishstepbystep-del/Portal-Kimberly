/* ============================================================
   motor_aula.js — Kimberly | Mentoria VIP Step by Step
   Motor da tela de aula (Dia 1–5, fluxo de 4 etapas) —
   Camada 2 da Consolidação (28/07/2026). Estreia na Semana 3.

   A página de aula passa a ser SÓ CONTEÚDO: um objeto AULA +
   três <script>. Este motor injeta o esqueleto (idêntico ao das
   telas da S1/S2 no ar) e roda o MESMO código de lógica, extraído
   ao pé da letra de Dia01_Semana2_MyPeople.html — nenhuma regra
   de progresso mudou. Requer nucleo.js carregado antes.

   O que a página define (objeto AULA):
     diaGlobal : número GLOBAL do dia (S1=1..5, S2=6..10, S3=11..15,
                 fórmula: semana N usa (N-1)*5+1 .. (N-1)*5+5).
                 Vira a chave interna "diaN" — NUNCA aparece pra aluna.
     rotulo    : o que a aluna vê ("Dia 1".."Dia 5" — reinicia por semana).
     titulo    : h1 da página (ex.: "Dia 1 — My Routine").
     sub       : linha sob o h1 (semana + focos).
     lily      : { audio:"audio/Lily_SNN_TextoNN.mp3",
                   chave:"textoNN"  (numeração GLOBAL, casa com a playlist),
                   texto:[ 7 linhas em inglês ] }
     cards     : os 10 cards do Acervo ({id,cenario,frase,traducao,sensacao,audio}).

   Chaves de progresso gravadas (idênticas às telas no ar):
     dia{N}_decifrar · dia{N}_escutar · dia{N}_baixar ·
     dia{N}_terminei · dia{N}_completedAt · lily_textos_ouvidos.{chave}
   ============================================================ */

/* ---------- Esqueleto da página (idêntico ao das telas S1/S2 no ar) ---------- */
document.body.insertAdjacentHTML('afterbegin', `
<header class="topbar">
  <span class="brand">Kimberly | <b>Mentoria VIP</b></span>
  <div class="topbar-acoes">
    <a href="Passos_Diarios.html">← Passos Diários</a>
    <a href="#" onclick="sair();return false;">Sair</a>
  </div>
</header>

<div class="wrap">

  <div class="titulo-dia">
    <h1>${AULA.titulo}</h1>
    <p>${AULA.sub}</p>
  </div>

  <div class="stepper" id="stepper">
    <div class="step" data-etapa="1"><span class="dot">1</span> Decifrar</div>
    <div class="step" data-etapa="2"><span class="dot">2</span> Escutar</div>
    <div class="step" data-etapa="3"><span class="dot">3</span> Anki</div>
    <div class="step" data-etapa="4"><span class="dot">4</span> Com a Lily</div>
  </div>

  <div class="instrucao" id="instrucao"></div>

  <!-- ETAPA 1 — DECIFRAR -->
  <section class="etapa" data-etapa="1" id="etapa1">
    <div class="progresso-decifrar" id="decifrarProgresso">Cartão 1 de 10</div>
    <div class="card-unico" id="cardUnico">
      <div class="cenario" id="dCenario"></div>
      <div class="frase" id="dFrase"></div>
      <div class="acoes-card">
        <button class="btn-ouvir" id="dBtnOuvir">🔊 Ouvir</button>
      </div>
      <p class="audio-fallback" id="dAudioFallback">Esse áudio chega em breve.</p>
      <div id="dVersoArea" style="display:none">
        <div class="traducao" id="dTraducao"></div>
        <div class="sensacao" id="dSensacao"></div>
      </div>
      <div class="acoes-card">
        <button class="btn-principal" id="dBtnVerVerso" disabled>Ver tradução →</button>
        <button class="btn-principal" id="dBtnProximo" style="display:none">Próximo cartão →</button>
      </div>
    </div>
    <audio id="dAudio"></audio>
  </section>

  <!-- ETAPA 2 — ESCUTAR MUITO -->
  <section class="etapa" data-etapa="2" id="etapa2">
    <div class="total-escutas">
      <strong id="totalEscutas">Total: 0/100 escutas</strong>
      <div class="barra"><div id="barraEscutas"></div></div>
    </div>
    <div class="grade" id="gradeEscutar"></div>
    <div class="rodape-etapa">
      <button class="btn-principal" id="btnAvancarEscutar" disabled>Avançar para o Anki →</button>
    </div>
  </section>

  <!-- ETAPA 3 — ANKI -->
  <section class="etapa" data-etapa="3" id="etapa3">
    <div class="total-escutas">
      <strong id="totalBaixados">0/10 baixados</strong>
      <div class="barra"><div id="barraBaixados"></div></div>
    </div>
    <div class="grade" id="gradeBaixar"></div>
    <div class="rodape-etapa">
      <button class="btn-dourado" id="btnTerminei" disabled>✅ Terminei</button>
    </div>
  </section>

  <!-- ETAPA 4 — COM A LILY -->
  <section class="etapa" data-etapa="4" id="etapa4">
    <div class="lily-box">
      <h2>Com a Lily</h2>
      <p class="legenda">Aperte o play e deixe o áudio te levar. Se pegar metade, já valeu.</p>
      <audio id="audioLily" controls src="${AULA.lily.audio}"></audio>
      <p class="audio-fallback" id="lilyFallback">Esse áudio chega em breve.</p>
      <button class="btn-fantasma" id="btnMostrarTexto">Mostrar texto</button>
      <div class="texto-lily" id="textoLily">
        ${AULA.lily.texto.join('<br>\n        ')}
      </div>
      <div class="acoes-card" style="margin-top:24px">
        <button class="btn-dourado" id="btnConcluirDia">🍇 Concluir o ${AULA.rotulo}</button>
      </div>
    </div>
  </section>

</div>

<div class="overlay" id="overlayFim">
  <div class="modal">
    <div class="arvore-emoji">🍇🎉</div>
    <h2>${AULA.rotulo} completo!</h2>
    <p>Sua videira acabou de crescer um pouquinho. Continue assim — cada dia conta.</p>
    <div class="acoes">
      <a class="btn btn-dourado" href="Conquistas.html" style="text-decoration:none;display:inline-block">Ver meu progresso →</a>
      <a class="btn btn-fantasma" href="Passos_Diarios.html" style="text-decoration:none;display:inline-block">Passos Diários</a>
    </div>
  </div>
</div>
`);

/* ============================================================
   Daqui pra baixo: lógica EXTRAÍDA AO PÉ DA LETRA das telas no ar.
   Únicas trocas: DIA/cards/áudio da Lily/chave da playlist vêm de AULA.
   ============================================================ */

const DIA="dia"+AULA.diaGlobal;
const cards=AULA.cards;

const instrucoes={
  1:"Vamos decifrar, um cartão de cada vez. Ouça a frase pelo menos uma vez, depois veja o que ela significa. Sem pressa.",
  2:"Agora é escutar bastante. Clique em Ouvir em cada cartão até cada contador chegar a 10. Se esquecer o significado, vire o cartão pra dar uma olhada rápida no verso.",
  3:"Hora do Anki. Veja a frente e o verso de cada cartão pra copiar pro seu Anki, e baixe o áudio de cada um dos 10. Quando terminar todos, confirme abaixo.",
  4:"Para fechar o dia, um tempo com a Lily."
};

let etapaAtual=1;
let idxDecifrar=0;
let dOuviu=false;
let etapaMax=1;

/* Navegação destravada: a trava vale só no primeiro contato.
   etapaMaxSalva() lê do progresso salvo até onde a aluna já chegou; o stepper
   vira navegação clicável nas etapas liberadas; nada regride. */
function etapaMaxSalva(){
  if(Progress.get(DIA+'_completedAt',null) || Progress.get(DIA+'_terminei',false)) return 4;
  const esc=Progress.get(DIA+'_escutar',{});
  if(cards.every(c=>(esc[c.id]||0)>=10)) return 3;
  const dec=Progress.get(DIA+'_decifrar',{});
  if(cards.every(c=>dec[c.id])) return 2;
  return 1;
}
function retomarDecifrar(){
  const dec=Progress.get(DIA+'_decifrar',{});
  const i=cards.findIndex(c=>!dec[c.id]);
  idxDecifrar=(i<0)?0:i;
  renderDecifrar();
}
function irParaEtapa(n){
  if(n>etapaMax) return;
  if(n===1) retomarDecifrar();
  else if(n===2) iniciarEscutar();
  else if(n===3) iniciarBaixar();
  mostrarEtapa(n);
}


function $(s){return document.querySelector(s);}
function $all(s){return document.querySelectorAll(s);}

function mostrarEtapa(n){
  etapaAtual=n;
  $all('.etapa').forEach(e=>e.classList.toggle('ativa', +e.dataset.etapa===n));
  $all('.step').forEach(s=>{
    const e=+s.dataset.etapa;
    s.classList.toggle('ativo', e===n);
    s.classList.toggle('feito', e<n);
    s.classList.toggle('liberado', e<=etapaMax);
  });
  $('#instrucao').textContent=instrucoes[n];
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ===== Etapa 1: Decifrar ===== */
/* Aviso "áudio chega em breve": checagem ativa (o evento error do <audio> nem sempre dispara no 404) */
async function marcarAudiosPendentes(){
  await Promise.all(cards.map(async c=>{
    try{const r=await fetch(c.audio,{method:'HEAD'}); if(!r.ok) c.semAudio=true;}catch(e){}
  }));
  try{const r=await fetch(AULA.lily.audio,{method:'HEAD'}); if(!r.ok) $('#lilyFallback').style.display='block';}catch(e){}
}

function renderDecifrar(){
  const c=cards[idxDecifrar];
  $('#decifrarProgresso').textContent=`Cartão ${idxDecifrar+1} de ${cards.length}`;
  $('#dCenario').textContent=c.cenario;
  $('#dFrase').textContent=c.frase;
  $('#dAudioFallback').style.display=c.semAudio?'block':'none';
  $('#dAudio').src=c.audio;
  $('#dVersoArea').style.display='none';
  $('#dTraducao').textContent=c.traducao;
  $('#dSensacao').innerHTML=c.sensacao;
  $('#dBtnVerVerso').disabled=!Progress.get(DIA+'_decifrar',{})[c.id];
  $('#dBtnVerVerso').style.display='inline-block';
  $('#dBtnProximo').style.display='none';
  dOuviu=false;
}
$('#dAudio').addEventListener('error',()=>{ $('#dAudioFallback').style.display='block'; });
$('#dBtnOuvir').addEventListener('click',()=>{
  const a=$('#dAudio'); a.currentTime=0; a.play().catch(()=>{});
  dOuviu=true;
  $('#dBtnVerVerso').disabled=false;
});
$('#dBtnVerVerso').addEventListener('click',()=>{
  $('#dVersoArea').style.display='block';
  $('#dBtnVerVerso').style.display='none';
  $('#dBtnProximo').style.display='inline-block';
  const decifrar=Progress.get(DIA+'_decifrar',{});
  decifrar[cards[idxDecifrar].id]=true;
  Progress.set(DIA+'_decifrar',decifrar);
});
$('#dBtnProximo').addEventListener('click',()=>{
  if(idxDecifrar<cards.length-1){ idxDecifrar++; renderDecifrar(); }
  else{ etapaMax=Math.max(etapaMax,2); iniciarEscutar(); mostrarEtapa(2); }
});

/* ===== Etapa 2: Escutar muito ===== */
function iniciarEscutar(){
  const grade=$('#gradeEscutar'); grade.innerHTML='';
  const escutas=Progress.get(DIA+'_escutar',{});
  cards.forEach(c=>{
    const n=escutas[c.id]||0;
    const div=document.createElement('div');
    div.className='mini-card';
    div.id='ecard-'+c.id;
    div.innerHTML=`
      <div class="frente">
        <div class="cenario">${c.cenario}</div>
        <div class="frase">${c.frase}</div>
        <div class="acoes-card">
          <button class="btn-ouvir" data-acao="ouvir" data-id="${c.id}">🔊 Ouvir</button>
          <button class="btn-fantasma" data-acao="verso" data-id="${c.id}">Verso ↻</button>
        </div>
        <div class="contador" id="cont-${c.id}">${n}/10</div>
        ${c.semAudio?'<div class="audio-fallback" style="display:block">Esse áudio chega em breve.</div>':''}
      </div>
      <div class="verso">
        <div class="traducao">${c.traducao}</div>
        <div class="sensacao">${c.sensacao}</div>
        <div class="acoes-card">
          <button class="btn-fantasma" data-acao="frente" data-id="${c.id}">← Frente</button>
        </div>
      </div>
      <audio id="audio-${c.id}" src="${c.audio}"></audio>`;
    grade.appendChild(div);
  });
  atualizarTotalEscutas();
  if(grade.dataset.wired) return;
  grade.dataset.wired='1';
  grade.addEventListener('click',ev=>{
    const el=ev.target.closest('[data-acao]');
    if(!el) return;
    const id=el.dataset.id, acao=el.dataset.acao;
    if(acao==='ouvir'){
      const a=document.getElementById('audio-'+id); a.currentTime=0; a.play().catch(()=>{});
      const escutas=Progress.get(DIA+'_escutar',{});
      escutas[id]=(escutas[id]||0)+1;
      Progress.set(DIA+'_escutar',escutas);
      const elc=document.getElementById('cont-'+id);
      elc.textContent=`${escutas[id]}/10`;
      elc.classList.toggle('completo',escutas[id]>=10);
      atualizarTotalEscutas();
    }else if(acao==='verso'){
      document.getElementById('ecard-'+id).classList.add('virado');
    }else if(acao==='frente'){
      document.getElementById('ecard-'+id).classList.remove('virado');
    }
  });
}
function atualizarTotalEscutas(){
  const escutas=Progress.get(DIA+'_escutar',{});
  let total=0, todosCompletos=true;
  cards.forEach(c=>{ const n=escutas[c.id]||0; total+=n; if(n<10) todosCompletos=false; });
  $('#totalEscutas').textContent=`Total: ${total}/100 escutas`;
  $('#barraEscutas').style.width=Math.min(100,(total/100)*100)+'%';
  $('#btnAvancarEscutar').disabled=!todosCompletos;
}
$('#btnAvancarEscutar').addEventListener('click',()=>{ etapaMax=Math.max(etapaMax,3); iniciarBaixar(); mostrarEtapa(3); });

/* ===== Etapa 3: Anki (ver cartão completo + baixar) ===== */
function iniciarBaixar(){
  const grade=$('#gradeBaixar'); grade.innerHTML='';
  const baixados=Progress.get(DIA+'_baixar',{});
  cards.forEach(c=>{
    const ok=!!baixados[c.id];
    const div=document.createElement('div');
    div.className='mini-card';
    div.id='acard-'+c.id;
    div.innerHTML=`
      <div class="frente">
        <div class="cenario">${c.cenario}</div>
        <div class="frase">${c.frase}</div>
        <div class="acoes-card">
          <a class="btn btn-ouvir" style="text-decoration:none;display:inline-block" href="${c.audio}" download data-acao="baixar" data-id="${c.id}">⬇ Baixar</a>
          <button class="btn-fantasma" data-acao="verso" data-id="${c.id}">Verso ↻</button>
        </div>
        ${c.semAudio?'<div class="audio-fallback" style="display:block">Esse áudio chega em breve.</div>':''}
        <div class="check-baixado ${ok?'on':''}" id="chk-${c.id}">✓ baixado</div>
      </div>
      <div class="verso">
        <div class="traducao">${c.traducao}</div>
        <div class="sensacao">${c.sensacao}</div>
        <div class="acoes-card">
          <button class="btn-fantasma" data-acao="frente" data-id="${c.id}">← Frente</button>
        </div>
      </div>`;
    grade.appendChild(div);
  });
  atualizarTotalBaixados();
  if(grade.dataset.wired) return;
  grade.dataset.wired='1';
  grade.addEventListener('click',async ev=>{
    const el=ev.target.closest('[data-acao]');
    if(!el) return;
    const id=el.dataset.id, acao=el.dataset.acao;
    if(acao==='baixar'){
      const baixados=Progress.get(DIA+'_baixar',{});
      baixados[id]=true;
      await Progress.set(DIA+'_baixar',baixados);
      document.getElementById('chk-'+id).classList.add('on');
      atualizarTotalBaixados();
    }else if(acao==='verso'){
      document.getElementById('acard-'+id).classList.add('virado');
    }else if(acao==='frente'){
      document.getElementById('acard-'+id).classList.remove('virado');
    }
  });
}
function atualizarTotalBaixados(){
  const baixados=Progress.get(DIA+'_baixar',{});
  const n=cards.filter(c=>baixados[c.id]).length;
  $('#totalBaixados').textContent=`${n}/10 baixados`;
  $('#barraBaixados').style.width=(n/10*100)+'%';
  $('#btnTerminei').disabled = n<10;
}
$('#btnTerminei').addEventListener('click',()=>{
  Progress.set(DIA+'_terminei',true);
  etapaMax=4;
  mostrarEtapa(4);
});

/* ===== Etapa 4: Com a Lily ===== */
$('#audioLily').addEventListener('error',()=>{ $('#lilyFallback').style.display='block'; });
$('#btnMostrarTexto').addEventListener('click',()=>{
  const t=$('#textoLily'); const on=t.classList.toggle('on');
  $('#btnMostrarTexto').textContent = on ? 'Esconder texto' : 'Mostrar texto';
});
$('#btnConcluirDia').addEventListener('click', async ()=>{
  const lily=Progress.get('lily_textos_ouvidos',{});
  lily[AULA.lily.chave]=true;
  await Progress.set('lily_textos_ouvidos',lily);
  if(!Progress.get(DIA+'_completedAt',null)) await Progress.set(DIA+'_completedAt', new Date().toISOString());
  $('#overlayFim').classList.add('on');
});

/* ===== Início ===== */
(async function start(){
  const session = await requireLogin();
  if(!session) return;
  await Progress.load();
  await marcarAudiosPendentes();
  etapaMax=etapaMaxSalva();
  $all('.step').forEach(s=>{ s.addEventListener('click',()=>{ irParaEtapa(+s.dataset.etapa); }); });
  irParaEtapa(etapaMax);
})();
