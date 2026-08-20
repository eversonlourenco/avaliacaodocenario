/* =========================================================
   UI HELPERS — Funções auxiliares de interface
   ========================================================= */

export function el(tag, className, text){
  const e = document.createElement(tag);
  if(className) e.className = className;
  if(text!==undefined) e.textContent = text;
  return e;
}

export function labeledField(label, node){
  const f = el("div","field");
  f.appendChild(el("div","field-label",label));
  f.appendChild(node);
  return f;
}

export function counterField(label, value, onChange){
  const row = el("div","counter-row");
  row.appendChild(el("div","field-label",label));
  const ctrl = el("div","counter");
  const minus = el("button","counter-btn","−"); minus.type="button";
  const val = el("span","counter-val", String(value).padStart(2,"0"));
  const plus = el("button","counter-btn","+"); plus.type="button";
  minus.onclick=()=> { onChange(Math.max(0,value-1)); };
  plus.onclick=()=> { onChange(value+1); };
  ctrl.append(minus,val,plus);
  row.appendChild(ctrl);
  return row;
}

export function counterFieldColored(label, color, value, onChange){
  const row = counterField(label, value, onChange);
  const labelEl = row.querySelector(".field-label");
  if(labelEl && color) labelEl.style.color = color;
  return row;
}

export function severityColor(op){
  if(op==="Pequeno Incêndio") return "var(--green)";
  if(op==="Médio Incêndio") return "var(--amber)";
  if(op==="Grande Incêndio") return "var(--red)";
  return null;
}

export function gridOptionsNoIcons(options, isSelectedFn, onToggle, colorFn, renderCallback){
  const grid = el("div","grid-3-list");
  options.forEach(op=>{
    const selected = isSelectedFn(op);
    const b = el("button","grid-btn"+(selected?" selected":""));
    b.type="button";
    const span = el("span","grid-btn-text", op);
    if(colorFn){
      const c = colorFn(op);
      if(c) span.style.color = c;
    }
    b.appendChild(span);
    b.onclick=()=>{ onToggle(op); if(renderCallback) renderCallback(); };
    grid.appendChild(b);
  });
  return grid;
}

export function renderNavButtons(onBack, onNext, nextText = "Avançar", nextDisabled = false) {
  const container = el("div", "nav-buttons");

  if (onBack) {
    const btnBack = el("button", "btn-blue", "Voltar");
    btnBack.type = "button";
    btnBack.onclick = onBack;
    container.appendChild(btnBack);
  }

  if (onNext) {
    const btnNext = el("button", "btn-primary", nextText);
    btnNext.type = "button";
    btnNext.disabled = nextDisabled;
    btnNext.onclick = onNext;
    container.appendChild(btnNext);
  }

  return container;
}