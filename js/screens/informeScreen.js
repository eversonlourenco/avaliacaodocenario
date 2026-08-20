import { state, tipoAtual, subtiposSelecionados, resetForm } from '../state.js';
import { el, renderNavButtons } from '../uiHelpers.js';

const SEPARADOR = "--------------------------------";

function pad2(n){ return String(n).padStart(2,"0"); }

export function gerarTextoInforme(){
  const t = tipoAtual();
  const subs = subtiposSelecionados();
  const blocos = [];

  const cab = ["*AVALIAÇÃO DA CENA*"];
  const agora = state.geradoEm || new Date();
  cab.push("*DATA:* " + agora.toLocaleDateString("pt-BR"));
  cab.push("*HORA:* " + agora.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}) + " (coleta das informações)");
  if(state.coordenadas.trim()) cab.push("*COORDENADAS:* " + state.coordenadas.trim());
  if(state.endereco.trim()) cab.push("*ENDEREÇO:* " + state.endereco.trim());
  cab.push("*MISSÃO:* " + (t ? (t.missao || "") : ""));
  blocos.push(cab);

  if (t) {
    const loc = [];
    loc.push("TIPO: " + t.nome.toUpperCase());

    if(t.quantidadeVeiculos){
      if(state.veiculosSelecionados.length > 0){
        loc.push("SUBTIPO: " + state.veiculosSelecionados.join(" x "));
      }
    } else {
      let listaSubtipos = subs.map(s => s.nome).concat(state.subtiposAdicionais);
      if(listaSubtipos.length > 0){
        loc.push("SUBTIPO: " + listaSubtipos.join(", "));
      }
    }

    if(subs.some(s=>s.residencial)){
      const rd = state.residencial;
      if(rd.tipoImovel) loc.push("Edificação: " + rd.tipoImovel);
      if(rd.andar>0) loc.push("Andar: " + rd.andar);
      if(rd.pavimentos>0) loc.push("Pavimentos: " + pad2(rd.pavimentos));
      if(rd.pavimentoFogo>0) loc.push("Fogo no pavimento: " + pad2(rd.pavimentoFogo));
      if(rd.comodos.length) loc.push("Cômodo(s) com fogo: " + rd.comodos.join(", "));
    }
    blocos.push(loc);

    const sit = [];
    t.perguntas.forEach(p=>{
      const r = state.respostas[p.key];
      if(!r) return;
      let linhaMsg = "";
      
      if(p.type==="checkbox" && p.key==="situacao" && r.opts && r.opts.length){
        linhaMsg = "SITUAÇÃO ENCONTRADA: " + r.opts.join(", ");
      } else if(p.type==="material" && r.classes){
        const partes = Object.entries(r.classes)
          .filter(([k,itens])=>itens.length>0)
          .map(([k,itens])=>k+" — "+itens.join(", "));
        if(partes.length) linhaMsg = "MATERIAL QUEIMANDO: " + partes.join(" | ");
      } else if(p.type==="checkbox" && p.key==="bloqueio" && r.opts && r.opts.length){
        linhaMsg = "BLOQUEIO DA VIA: " + r.opts.join(", ");
      } else if(p.type==="checkbox" && p.key==="sentido" && r.opts && r.opts.length){
        linhaMsg = "SENTIDO: " + r.opts.join(", ");
      } else if(p.type==="checkbox" && p.key==="materialTransportado" && r.opts && r.opts.length){
        linhaMsg = "MATERIAL TRANSPORTADO: " + r.opts.join(", ");
      } else if(p.type==="grupos"){
        const partes = p.grupos
          .map(g=>({nome:g.nome, valores:(r.groups && r.groups[g.nome]) || []}))
          .filter(x=>x.valores.length>0)
          .map(x=>x.nome + ": " + x.valores.join(", "));
        if(partes.length) {
          linhaMsg = "INFORMAÇÕES ADICIONAIS:\n" + partes.join("\n");
        }
      } else if(p.type==="contadores" && r.counts){
        const entries = Object.entries(r.counts).filter(([k,v])=>v>0);
        if(entries.length) {
          linhaMsg = "FERRAMENTAS:\n" + entries.map(([k,v])=> k + " (" + v + ")").join("\n");
        }
      }

      const ignorarNoLoop = ["vitimas", "situacaoVitimas", "recursos", "observacoes"];
      if (!ignorarNoLoop.includes(p.key)) {
        const temObs = r.observacao && r.observacao.trim();
        if(linhaMsg) {
          if(temObs) linhaMsg += " | " + r.observacao.trim();
          sit.push(linhaMsg);
        } else if (temObs) {
          let fallbackLabel = p.label ? p.label.toUpperCase() : p.key.toUpperCase();
          sit.push(fallbackLabel + ": " + r.observacao.trim());
        }
      }
    });
    blocos.push(sit);
  }

  const vit = [];
  const rv = state.respostas["vitimas"];
  if(rv){
    let temObs = rv.observacao && rv.observacao.trim();
    if(rv.sem){
      vit.push("VÍTIMAS: Sem vítimas" + (temObs ? " | " + rv.observacao.trim() : ""));
    } else {
      const partes = [];
      if(rv.total>0) partes.push(String(rv.total));
      if(rv.verde>0) partes.push("Verdes: "+rv.verde);
      if(rv.amarelo>0) partes.push("Amarelas: "+rv.amarelo);
      if(rv.vermelho>0) partes.push("Vermelhas: "+rv.vermelho);
      if(rv.cinza>0) partes.push("Cinzas: "+rv.cinza);
      
      let linhaVit = "";
      if(partes.length) linhaVit = "VÍTIMAS: " + partes.join(" | ");
      
      if(temObs){
         if(linhaVit) linhaVit += " | " + rv.observacao.trim();
         else linhaVit = "VÍTIMAS: " + rv.observacao.trim();
      }
      if(linhaVit) vit.push(linhaVit);
    }
  }

  const rsv = state.respostas["situacaoVitimas"];
  const rsvExtra = state.respostas["situacaoVitimas_extra"];
  let linhaSvt = "";
  let temObsSvt = rsv && rsv.observacao && rsv.observacao.trim();

  if((rsv && rsv.opts && rsv.opts.length) || (rsvExtra && rsvExtra.opts && rsvExtra.opts.length)){
    linhaSvt = "SITUAÇÃO DAS VÍTIMAS: " + (rsv&&rsv.opts? rsv.opts.join(", ") : "");
    if(rsvExtra && rsvExtra.opts && rsvExtra.opts.length) linhaSvt += " (" + rsvExtra.opts.join(", ") + ")";
  }
  
  if(temObsSvt) {
     if(linhaSvt) linhaSvt += " | " + rsv.observacao.trim();
     else linhaSvt = "SITUAÇÃO DAS VÍTIMAS: " + rsv.observacao.trim();
  }
  if(linhaSvt) vit.push(linhaSvt);
  blocos.push(vit);

  const rec = [];
  const rr = state.respostas["recursos"];
  if(rr){
    const partes = [];
    const countVtrs = (rr.tipos && rr.tipos.length) ? rr.tipos.length : (rr.viaturas || 0);
    if(countVtrs>0) partes.push("Vtrs: " + countVtrs + (rr.tipos&&rr.tipos.length? " ("+rr.tipos.join(", ")+")":""));
    if(rr.efetivo>0) partes.push("Efetivo: " + rr.efetivo);
    
    let linhaRec = "";
    if(partes.length) linhaRec = "RECURSOS: " + partes.join(" | ");
    
    let temObsRec = rr.observacao && rr.observacao.trim();
    if(temObsRec){
       if(linhaRec) linhaRec += " | " + rr.observacao.trim();
       else linhaRec = "RECURSOS: " + rr.observacao.trim();
    }
    if(linhaRec) rec.push(linhaRec);
  }
  blocos.push(rec);

  const obs = [];
  const ro = state.respostas["observacoes"];
  if(ro && ro.texto && ro.texto.trim()) obs.push("OBSERVAÇÕES: " + ro.texto.trim());
  blocos.push(obs);

  const naoVazios = blocos.filter(b=>b.length>0);
  return naoVazios.map(b=>b.join("\n")).join("\n"+SEPARADOR+"\n");
}

export function renderInformeScreen(renderCallback){
  const c = el("div","screen");
  c.appendChild(el("h1","screen-title","Informe Operacional"));

  const ticket = el("div","ticket");
  const pre = el("pre","ticket-text");
  pre.textContent = gerarTextoInforme();
  ticket.appendChild(pre);
  c.appendChild(ticket);

  const actions = el("div","action-grid");

  const btnWpp = el("button","btn-action btn-whatsapp","ENVIAR PELO WHATSAPP");
  btnWpp.type="button";
  btnWpp.onclick = ()=>{
    const url = "https://wa.me/?text=" + encodeURIComponent(gerarTextoInforme());
    window.open(url, "_blank");
  };

  const btnCopy = el("button","btn-action btn-copy","COPIAR TEXTO");
  btnCopy.type="button";
  btnCopy.onclick = async ()=>{
    const texto = gerarTextoInforme();
    try{
      await navigator.clipboard.writeText(texto);
      btnCopy.textContent = "Copiado!";
      setTimeout(()=>{btnCopy.textContent="COPIAR TEXTO";}, 1800);
    }catch(e){
      const ta = document.createElement("textarea");
      ta.value = texto;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      btnCopy.textContent = "Copiado!";
      setTimeout(()=>{btnCopy.textContent="COPIAR TEXTO";}, 1800);
    }
  };

  const btnReset = el("button","btn-action btn-reset","ZERAR FORMULÁRIO");
  btnReset.type="button";
  btnReset.onclick = ()=>{
    if(confirm("Deseja realmente zerar o formulário? Todos os dados serão perdidos.")) resetForm(renderCallback);
  };

  actions.append(btnWpp, btnCopy, btnReset);
  c.appendChild(actions);

  const nav = renderNavButtons(
    () => { state.screen = 3; renderCallback(); window.scrollTo(0, 0); },
    null
  );
  c.appendChild(nav);

  return c;
}