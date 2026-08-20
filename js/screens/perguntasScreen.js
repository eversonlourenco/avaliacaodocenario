import { state, tipoAtual, subtiposSelecionados, getResp, toggleCheckbox, isChecked, salvarEstado } from '../state.js';
import { el, labeledField, counterField, counterFieldColored, severityColor, gridOptionsNoIcons, renderNavButtons } from '../uiHelpers.js';

export function renderPerguntasScreen(renderCallback){
  const t = tipoAtual();
  const c = el("div","screen");
  c.appendChild(el("h1","screen-title","Detalhes da Ocorrência"));
  
  let subtipoText = "";
  if(t.quantidadeVeiculos){
    subtipoText = state.veiculosSelecionados.join(" x ");
  } else {
    let items = subtiposSelecionados().map(s=>s.nome).concat(state.subtiposAdicionais);
    subtipoText = items.join(", ");
  }

  c.appendChild(el("p","screen-sub", t.nome + (subtipoText ? " — " + subtipoText : "")));

  t.perguntas.forEach(p=>{
    c.appendChild(renderPergunta(p, renderCallback));
  });

  const nav = renderNavButtons(
    () => { state.screen = 2; renderCallback(); window.scrollTo(0, 0); },
    () => { 
      if(!state.geradoEm) state.geradoEm = new Date(); 
      state.screen = 4; 
      renderCallback(); 
      window.scrollTo(0,0); 
    },
    "GERAR INFORME OPERACIONAL"
  );
  c.appendChild(nav);

  return c;
}

function renderPergunta(p, renderCallback){
  const box = el("div","subpanel");
  
  if(p.type==="checkbox") renderCheckboxBlock(p, box, renderCallback);
  else if(p.type==="material") renderMaterialBlock(p, box, renderCallback);
  else if(p.type==="grupos") renderGruposBlock(p, box, renderCallback);
  else if(p.type==="contadores") renderContadoresBlock(p, box, renderCallback);
  else if(p.type==="vitimas") renderVitimasBlock(box, renderCallback);
  else if(p.type==="recursos") renderRecursosBlock(p, box, renderCallback);
  else if(p.type==="texto") renderTextoBlock(p, box, renderCallback);

  if (p.type !== "texto") {
    const key = p.key || (p.type === "vitimas" ? "vitimas" : p.type === "recursos" ? "recursos" : "bloco");
    const r = getResp(key);
    const inputBlockText = el("input", "text-input mt-2");
    inputBlockText.type = "text";
    inputBlockText.placeholder = "Observação / Detalhes deste bloco...";
    inputBlockText.value = r.observacao || "";
    inputBlockText.oninput = (e) => { 
      r.observacao = e.target.value; 
      salvarEstado();
    };
    box.appendChild(labeledField("Observações do Bloco", inputBlockText));
  }

  return box;
}

function renderCheckboxBlock(p, box, renderCallback){
  box.appendChild(el("h3","subpanel-title", p.label));
  const cf = p.key==="situacao" ? severityColor : null;
  box.appendChild(gridOptionsNoIcons(p.options, op=>isChecked(p.key,op), op=>toggleCheckbox(p.key,op), cf, renderCallback));
  if(p.extra){
    box.appendChild(el("div","field-label mt", p.extra.label));
    const key = p.key+"_extra";
    box.appendChild(gridOptionsNoIcons(p.extra.options, op=>isChecked(key,op), op=>toggleCheckbox(key,op), null, renderCallback));
  }
  return box;
}

function renderMaterialBlock(p, box, renderCallback){
  box.appendChild(el("h3","subpanel-title", p.label));
  const r = getResp(p.key);
  if(!r.classes) r.classes = {};
  p.classes.forEach(cl=>{
    const active = Object.prototype.hasOwnProperty.call(r.classes, cl.nome);
    const clBox = el("div","material-class-block");
    const b = el("button","grid-btn full-width"+(active?" selected":""));
    b.type="button";
    b.appendChild(el("span","grid-btn-text", cl.nome));
    b.onclick=()=>{
      if(active) delete r.classes[cl.nome];
      else r.classes[cl.nome] = [];
      salvarEstado();
      renderCallback();
    };
    clBox.appendChild(b);
    if(active){
      const itemsBox = el("div","material-items");
      itemsBox.appendChild(gridOptionsNoIcons(cl.itens,
        it=>r.classes[cl.nome].includes(it),
        it=>{
          const arr = r.classes[cl.nome];
          const i = arr.indexOf(it);
          if(i>=0) arr.splice(i,1); else arr.push(it);
          salvarEstado();
        }, null, null));
      clBox.appendChild(itemsBox);
    }
    box.appendChild(clBox);
  });
  return box;
}

function renderGruposBlock(p, box, renderCallback){
  box.appendChild(el("h3","subpanel-title", p.label));
  const r = getResp(p.key);
  if(!r.groups) r.groups = {};
  p.grupos.forEach(g=>{
    box.appendChild(el("div","field-label mt", g.nome));
    if(!r.groups[g.nome]) r.groups[g.nome] = [];
    box.appendChild(gridOptionsNoIcons(g.options,
      op=>r.groups[g.nome].includes(op),
      op=>{
        const arr = r.groups[g.nome];
        const i = arr.indexOf(op);
        if(i>=0) arr.splice(i,1); else arr.push(op);
        salvarEstado();
      }, null, null));
  });
  return box;
}

function renderContadoresBlock(p, box, renderCallback){
  box.appendChild(el("h3","subpanel-title", p.label));
  const r = getResp(p.key);
  if(!r.counts) r.counts = {};
  p.options.forEach(op=>{
    box.appendChild(counterField(op, r.counts[op]||0, v=>{
      r.counts[op]=v; 
      salvarEstado();
      renderCallback();
    }));
  });
  return box;
}

function renderVitimasBlock(box, renderCallback){
  box.appendChild(el("h3","subpanel-title","Vítimas"));
  const r = getResp("vitimas");
  const semBtn = el("button","grid-btn full-width"+(r.sem?" selected":""));
  semBtn.type="button";
  semBtn.appendChild(el("span","grid-btn-text","Sem vítimas"));
  semBtn.onclick=()=>{ 
    r.sem=!r.sem; 
    salvarEstado();
    renderCallback(); 
  };
  box.appendChild(semBtn);
  if(!r.sem){
    box.appendChild(counterField("Quantidade de Vítimas", r.total||0, v=>{r.total=v; salvarEstado(); renderCallback();}));
    box.appendChild(counterFieldColored("Verdes", "var(--green)", r.verde||0, v=>{r.verde=v; salvarEstado(); renderCallback();}));
    box.appendChild(counterFieldColored("Amarelas", "var(--amber)", r.amarelo||0, v=>{r.amarelo=v; salvarEstado(); renderCallback();}));
    box.appendChild(counterFieldColored("Vermelhas", "var(--red)", r.vermelho||0, v=>{r.vermelho=v; salvarEstado(); renderCallback();}));
    box.appendChild(counterFieldColored("Cinzas", "var(--text-dim)", r.cinza||0, v=>{r.cinza=v; salvarEstado(); renderCallback();}));
  }
  return box;
}

function renderRecursosBlock(p, box, renderCallback){
  box.appendChild(el("h3","subpanel-title","Recursos"));
  const r = getResp("recursos");
  if (!r.tipos) r.tipos = [];

  const qtdViaturas = r.tipos.length;
  r.viaturas = qtdViaturas;

  const infoCount = el("div", "field-label", `Viaturas Empregadas: ${qtdViaturas}`);
  infoCount.style.fontSize = "14px";
  infoCount.style.fontWeight = "bold";
  infoCount.style.color = "var(--amber)";
  infoCount.style.marginBottom = "12px";
  box.appendChild(infoCount);

  box.appendChild(el("div","field-label mt","Tipo de Viatura"));
  box.appendChild(gridOptionsNoIcons(p.viaturaOptions,
    op=>r.tipos.includes(op),
    op=>{
      const i=r.tipos.indexOf(op);
      if(i>=0) r.tipos.splice(i,1); else r.tipos.push(op);
      r.viaturas = r.tipos.length;
      salvarEstado();
    }, null, renderCallback));
  box.appendChild(counterField("Efetivo empregado", r.efetivo||0, v=>{r.efetivo=v; salvarEstado(); renderCallback();}));
  return box;
}

function renderTextoBlock(p, box){
  box.appendChild(el("h3","subpanel-title", p.label));
  const r = getResp(p.key);
  const ta = el("textarea","text-area");
  ta.rows = 4;
  ta.placeholder = "Digite observações adicionais...";
  ta.value = r.texto || "";
  ta.oninput = (e)=>{ 
    r.texto = e.target.value; 
    salvarEstado();
  };
  box.appendChild(ta);
  return box;
}