/* ============================================================
   motor_checkup.js — Kimberly | Mentoria VIP Step by Step
   Motor da tela de Check-up (formato novo — Reforma Pedagógica,
   ponto 5) — Camada 2 da Consolidação (28/07/2026). Estreia na S3.

   A página de check-up passa a ser SÓ CONTEÚDO: um objeto CHECKUP +
   três <script>. Este motor injeta o esqueleto e o CSS próprios da
   tela (idênticos aos check-ups da S1/S2 no ar) e roda o MESMO
   código de lógica, extraído ao pé da letra de
   Checkup_Semana2_MyWorld.html. Requer nucleo.js carregado antes.

   O que a página define (objeto CHECKUP):
     semana   : número da semana (3..12) — usado nos rótulos.
     sufixo   : "S03".."S12" — vira as chaves checkup_frases.SNN e
                checkup_SNN_completedAt (numeração da semana, 2 dígitos).
     sub      : linha sob o h1 (nome da semana + focos).
     questoes : 3 questões {id,situacao,opcoes:[3 frases CORRETAS],certa}.

   Chaves de progresso gravadas (idênticas às telas no ar):
     checkup_frases.{sufixo} · checkup_{sufixo}_completedAt
   O check-up fecha a semana como CONVITE, nunca trava (opção A,
   27/07/2026) — e continua FORA da conta da videira.
   ============================================================ */

/* ---------- CSS próprio da tela (idêntico aos check-ups S1/S2 no ar) ---------- */
document.head.insertAdjacentHTML('beforeend', `
<style>
  body{ padding-bottom:60px; }
  .wrap{ max-width:680px; }

  .titulo{ text-align:center; margin-bottom:18px; }
  .titulo h1{ font-size:1.8rem; color:var(--azul); }
  .titulo p{ color:var(--azul-2); font-size:.95rem; margin-top:4px; }

  .questao{ background:#fff; border-radius:18px; box-shadow:var(--sombra); padding:26px 24px; margin-bottom:18px; }
  .questao .situacao{ font-size:.95rem; color:#3d4f60; line-height:1.55; margin-bottom:6px; }
  .questao .pergunta-suave{ font-size:.82rem; color:var(--azul-2); margin-bottom:14px; }
  .opcoes{ display:flex; flex-direction:column; gap:10px; }
  .opcao{
    text-align:left; background:var(--creme-2); border:1.5px solid transparent; border-radius:12px;
    padding:12px 16px; cursor:pointer; font-size:1rem; transition:.2s; width:100%;
  }
  .opcao .en{ font-family:Georgia,'Times New Roman',serif; font-size:1.05rem; color:var(--azul); }
  .opcao:hover{ border-color:var(--azul-2); }
  .opcao.escolhida-certa{ background:#dff1e6; border-color:var(--verde); }
  .opcao.escolhida-outra{ background:#f6f1e2; border-color:var(--dourado); }
  .eco{ font-size:.85rem; margin-top:12px; display:none; line-height:1.5; }
  .eco.on{ display:block; }
  .eco.certa{ color:var(--verde-escuro); }
  .eco.outra{ color:#8b7f63; }

  .progresso-frase{ background:#fff; border-radius:18px; box-shadow:var(--sombra); padding:26px 24px; margin-top:26px; }
  .progresso-frase h2{ color:var(--azul); font-size:1.2rem; margin-bottom:6px; }
  .progresso-frase p.legenda{ color:#5a6b7a; font-size:.9rem; margin-bottom:14px; }
  .progresso-frase .prefixo{ font-size:.95rem; color:var(--azul-2); font-weight:bold; margin-bottom:8px; }
  textarea{
    width:100%; min-height:90px; border:1.5px solid #e3ddd0; border-radius:12px; padding:12px 14px;
    font-family:Georgia,serif; font-size:1rem; color:var(--azul); resize:vertical; background:var(--creme);
  }
  textarea:focus{ outline:none; border-color:var(--azul-2); }
  .salvo-aviso{ font-size:.82rem; color:var(--verde-escuro); font-weight:bold; margin-top:8px; display:none; }
  .salvo-aviso.on{ display:block; }

  .rodape{ text-align:center; margin-top:26px; }

  @media(max-width:480px){
    .questao{ padding:20px 16px; }
  }
</style>
`);

/* ---------- Esqueleto da página (idêntico aos check-ups S1/S2 no ar) ---------- */
document.body.insertAdjacentHTML('afterbegin', `
<header class="topbar">
  <span class="brand">Kimberly | <b>Mentoria VIP</b></span>
  <div class="topbar-acoes">
    <a href="Passos_Diarios.html">← Passos Diários</a>
    <a href="#" onclick="sair();return false;">Sair</a>
  </div>
</header>

<div class="wrap">

  <div class="titulo">
    <h1>Check-up — Semana ${CHECKUP.semana}</h1>
    <p>${CHECKUP.sub}</p>
  </div>

  <div class="instrucao">
    Leia com calma. Não pense em regra. Pense na situação e sinta qual frase você usaria.
  </div>

  <div id="questoes"></div>

  <div class="progresso-frase">
    <h2>Meu progresso em uma frase</h2>
    <p class="legenda">Pra fechar a semana, uma frase só — do seu jeito.</p>
    <div class="prefixo">Hoje eu percebo que:</div>
    <textarea id="fraseProgresso" placeholder="escreva aqui..."></textarea>
    <div class="salvo-aviso" id="salvoAviso">✓ guardada</div>
  </div>

  <div class="rodape">
    <button class="btn-dourado" id="btnFechar" disabled>🍇 Fechar a Semana ${CHECKUP.semana}</button>
  </div>

</div>

<div class="overlay" id="overlayFim">
  <div class="modal">
    <div class="arvore-emoji">🍇🎉</div>
    <h2>Semana ${CHECKUP.semana} completa!</h2>
    <p>Mais uma semana inteira de inglês acontecendo. Sua frase ficou guardada — e sua videira sentiu.</p>
    <div class="acoes">
      <a class="btn btn-dourado" href="Conquistas.html" style="text-decoration:none;display:inline-block">Ver meu progresso →</a>
      <a class="btn btn-fantasma" href="index.html" style="text-decoration:none;display:inline-block">Início</a>
    </div>
  </div>
</div>
`);

/* ============================================================
   Daqui pra baixo: lógica EXTRAÍDA AO PÉ DA LETRA dos check-ups no ar.
   Únicas trocas: questões e chaves SNN vêm de CHECKUP.
   ============================================================ */

const questoes=CHECKUP.questoes;

const acertos={};
const questoesEl=document.getElementById('questoes');

function render(){
  questoes.forEach(q=>{
    const div=document.createElement('div');
    div.className='questao';
    div.innerHTML=`
      <div class="situacao">${q.situacao}</div>
      <div class="pergunta-suave">Qual você usaria aqui?</div>
      <div class="opcoes">
        ${q.opcoes.map((o,i)=>`<button class="opcao" data-q="${q.id}" data-i="${i}"><span class="en">${o}</span></button>`).join('')}
      </div>
      <div class="eco" id="eco-${q.id}"></div>`;
    questoesEl.appendChild(div);
  });
}

questoesEl.addEventListener('click',ev=>{
  const btn=ev.target.closest('.opcao');
  if(!btn) return;
  const q=questoes.find(x=>x.id===btn.dataset.q);
  const i=+btn.dataset.i;
  const eco=document.getElementById('eco-'+q.id);
  btn.parentElement.querySelectorAll('.opcao').forEach(b=>b.classList.remove('escolhida-certa','escolhida-outra'));
  if(i===q.certa){
    btn.classList.add('escolhida-certa');
    eco.className='eco on certa';
    eco.textContent='É essa. Sentiu como ela encaixa na situação?';
    acertos[q.id]=true;
  }else{
    btn.classList.add('escolhida-outra');
    eco.className='eco on outra';
    eco.textContent='Essa frase é boa — mas pra outra situação. Leia de novo com calma e sinta.';
    acertos[q.id]=false;
  }
  atualizarFechar();
});

const fraseEl=document.getElementById('fraseProgresso');
fraseEl.addEventListener('input',atualizarFechar);

function atualizarFechar(){
  const tresOk=questoes.every(q=>acertos[q.id]);
  const temFrase=fraseEl.value.trim().length>0;
  document.getElementById('btnFechar').disabled=!(tresOk&&temFrase);
}

document.getElementById('btnFechar').addEventListener('click',async ()=>{
  const frases=Progress.get('checkup_frases',{});
  frases[CHECKUP.sufixo]=fraseEl.value.trim();
  await Progress.set('checkup_frases',frases);
  await Progress.set('checkup_'+CHECKUP.sufixo+'_completedAt', new Date().toISOString());
  document.getElementById('salvoAviso').classList.add('on');
  document.getElementById('overlayFim').classList.add('on');
});

(async function start(){
  const session = await requireLogin();
  if(!session) return;
  await Progress.load();
  render();
  const frases=Progress.get('checkup_frases',{});
  if(frases[CHECKUP.sufixo]){ fraseEl.value=frases[CHECKUP.sufixo]; document.getElementById('salvoAviso').classList.add('on'); }
})();
