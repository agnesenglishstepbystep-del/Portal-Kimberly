/* ============================================================
   nucleo.js — Kimberly | Mentoria VIP Step by Step
   Núcleo compartilhado do portal (Camada 2 — Consolidação, 28/07/2026).

   O que mora aqui: cliente Supabase + login + persistência do
   progresso (local-first + sync) — EXTRAÍDO AO PÉ DA LETRA do
   bloco "Persistência" que existia repetido em cada página
   (§8 da especificação / complementos/Infra_Portal_Supabase.md).
   NENHUMA linha de lógica mudou: mesmo cliente, mesmas chaves,
   mesma tabela, mesmo localStorage ("kim_progress_" + STUDENT).

   Ordem de carga em cada página:
     <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
     <script src="nucleo.js"></script>
     ...depois o motor da tela (motor_aula.js / motor_checkup.js).

   Regra de arquitetura (fonte 8 §14, estendida ao JS):
   o que aparece em 2+ páginas mora aqui — um fato, um lugar.
   ============================================================ */

const SB_URL="https://yhsntdsdifpcozfpdfcu.supabase.co";
const SB_KEY="sb_publishable_aHINXeQ9NT_vXMamxc8GFw_iLZvOZKE";
const sb=supabase.createClient(SB_URL,SB_KEY);
let STUDENT=null;

async function requireLogin(){
  const {data:{session}}=await sb.auth.getSession();
  if(!session){ location.href="Login.html"; return null; }
  STUDENT=session.user.id;
  return session;
}
async function sair(){ await sb.auth.signOut(); location.href="Login.html"; }

const Progress={
  cache:{},
  async load(){
    try{this.cache=JSON.parse(localStorage.getItem("kim_progress_"+STUDENT)||"{}");}catch(e){this.cache={};}
    try{const {data}=await sb.from("student_progress").select("progress").eq("student_id",STUDENT).single();
        if(data&&data.progress){this.cache=data.progress;localStorage.setItem("kim_progress_"+STUDENT,JSON.stringify(this.cache));}}catch(e){}
    return this.cache;
  },
  get(k,def){return (k in this.cache)?this.cache[k]:def;},
  async set(k,v){
    this.cache[k]=v; localStorage.setItem("kim_progress_"+STUDENT,JSON.stringify(this.cache));
    try{await sb.from("student_progress").upsert({student_id:STUDENT,progress:this.cache,updated_at:new Date().toISOString()});}catch(e){}
  }
};
