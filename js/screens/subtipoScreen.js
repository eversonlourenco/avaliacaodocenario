import { state, tipoAtual, subtiposSelecionados, algumSubtipoResidencial, toggleSubtipo, salvarEstado } from '../state.js';
import { el, labeledField, counterField, renderNavButtons } from '../uiHelpers.js';

export function renderSubtipoScreen(renderCallback){
  const t = tipoAtual();
  const c = el("div","screen");

  c.appendChild(el("h1","screen-title", t.nome));
  c.appendChild(el("p","screen-sub", t.quantidadeVeiculos ? "Clique nos veículos para adicionar (cada clique conta +1)" : "Podendo ser escolhido mais de um subtipo"));

  if(t.quantidadeVeiculos){
    const yellowBox = el("div","vehicle-summary-box");
    
    const textContent = state.veiculosSelecionados.length > 0 
      ? state.veiculosSelecionados.join(" x ") 
      : "Nenhum veículo selecionado";

    const textEl = el("div", "vehicle-summary-text", textContent);
    yellowBox.appendChild(textEl);

    if (state.veiculosSelecionados.length > 0) {
      const btnClear = el("button", "btn-clear-vehicles", "Limpar");
      btnClear.type = "button";
      btnClear.onclick = () => {
        state.veiculosSelecionados = [];
        renderCallback();
      };
      yellowBox.appendChild(btnClear);
    }

    c.appendChild(yellowBox);
  }

  const list = el("div","grid-2-list");
  
  t.subtipos.forEach(s=>{
    if(t.quantidadeVeiculos){
      const count = state.veiculosSelecionados.filter(item => item === s.nome).length;
      const btn = el("button","opt-row"+(count > 0 ? " selected" : ""));
      btn.type = "button";
      btn.appendChild(el("span","btn-label-clean", s.nome));
      if(count > 0){
        btn.appendChild(el("span","count-badge", `+${count}`));
      }
      btn.onclick = ()=>{
        state.veiculosSelecionados.push(s.nome);
        renderCallback();
      };
      list.appendChild(btn);
    } else {
      const selected = state.subtipoIds.includes(s.id);
      const btn = el("button","opt-row"+(selected?" selected":""));
      btn.type = "button";
      btn.appendChild(el("span","btn-label-clean", s.nome));
      btn.onclick = ()=>{ toggleSubtipo(s.id); renderCallback(); };
      list.appendChild(btn);
    }
  });

  if (t.quantidadeVeiculos) {
    const standardNames = t.subtipos.map(s => s.nome);
    const customVehicles = [...new Set(state.veiculosSelecionados.filter(v => !standardNames.includes(v)))];
    
    customVehicles.forEach(customName => {
      const count = state.veiculosSelecionados.filter(item => item === customName).length;
      const btn = el("button","opt-row selected");
      btn.type = "button";
      btn.appendChild(el("span","btn-label-clean", customName));
      btn.appendChild(el("span","count-badge", `+${count}`));
      btn.onclick = ()=>{
        state.veiculosSelecionados.push(customName);
        renderCallback();
      };
      list.appendChild(btn);
    });
  } else {
    state.subtiposAdicionais.forEach((customName, idx) => {
      const btn = el("button","opt-row selected");
      btn.type = "button";
      btn.appendChild(el("span","btn-label-clean", customName));
      btn.onclick = ()=>{
        state.subtiposAdicionais.splice(idx, 1);
        renderCallback();
      };
      list.appendChild(btn);
    });
  }

  c.appendChild(list);

  const fieldOutros = el("div", "field-outros");
  fieldOutros.appendChild(el("div", "field-label", "Outros (digite e clique em OK para adicionar)"));
  
  const outrosRow = el("div", "outros-row");
  const inputOutros = el("input", "input-outros");
  inputOutros.type = "text";
  inputOutros.placeholder = "Digite outra opção...";
  
  const btnOk = el("button", "btn-ok", "OK");
  btnOk.type = "button";
  
  const adicionarCustomizado = () => {
    const val = inputOutros.value.trim();
    if (val) {
      if (t.quantidadeVeiculos) {
        state.veiculosSelecionados.push(val);
      } else {
        if (!state.subtiposAdicionais.includes(val)) {
          state.subtiposAdicionais.push(val);
        }
      }
      renderCallback();
    }
  };

  btnOk.onclick = adicionarCustomizado;
  inputOutros.onkeypress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      adicionarCustomizado();
    }
  };

  outrosRow.appendChild(inputOutros);
  outrosRow.appendChild(btnOk);
  fieldOutros.appendChild(outrosRow);
  c.appendChild(fieldOutros);

  if(algumSubtipoResidencial()){
    c.appendChild(renderResidencialDetalhes(renderCallback));
  }

  const isNextDisabled = t.quantidadeVeiculos
    ? state.veiculosSelecionados.length === 0
    : (state.subtipoIds.length === 0 && state.subtiposAdicionais.length === 0);

  const nav = renderNavButtons(
    () => { state.screen = 1; renderCallback(); window.scrollTo(0, 0); },
    () => { state.screen = 3; renderCallback(); window.scrollTo(0, 0); },
    "Avançar",
    isNextDisabled
  );
  c.appendChild(nav);

  return c;
}

function renderResidencialDetalhes(renderCallback){
  const box = el("div","subpanel");
  box.appendChild(el("h3","subpanel-title","Detalhes da Edificação Residencial"));

  const tipoRow = el("div","chip-row");
  ["Casa","Apartamento"].forEach(op=>{
    const b = el("button","chip small"+(state.residencial.tipoImovel===op?" selected":""),op);
    b.type="button";
    b.onclick=()=>{state.residencial.tipoImovel=op; renderCallback();};
    tipoRow.appendChild(b);
  });
  box.appendChild(labeledField("Tipo de Imóvel", tipoRow));

  box.appendChild(counterField("Andar", state.residencial.andar, v=>{state.residencial.andar=v; renderCallback();}));
  box.appendChild(counterField("Pavimentos", state.residencial.pavimentos, v=>{state.residencial.pavimentos=v; renderCallback();}));
  box.appendChild(counterField("Fogo em qual Pavimento", state.residencial.pavimentoFogo, v=>{state.residencial.pavimentoFogo=v; renderCallback();}));

  const comodoRow = el("div","chip-row wrap");
  ["Sala","Cozinha","Quarto","Banheiro","Área externa"].forEach(op=>{
    const active = state.residencial.comodos.includes(op);
    const b = el("button","chip small"+(active?" selected":""),op);
    b.type="button";
    b.onclick=()=>{
      const i = state.residencial.comodos.indexOf(op);
      if(i>=0) state.residencial.comodos.splice(i,1); else state.residencial.comodos.push(op);
      renderCallback();
    };
    comodoRow.appendChild(b);
  });
  box.appendChild(labeledField("Fogo em qual Cômodo", comodoRow));

  return box;
}