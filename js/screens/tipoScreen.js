import { CATEGORIAS_OCORRENCIAS } from '../data.js';
import { state } from '../state.js';
import { el } from '../uiHelpers.js';

export function renderTipoScreen(renderCallback){
  const c = el("div","screen");
  c.appendChild(el("h1","screen-title","Tipo de Ocorrência"));
  c.appendChild(el("p","screen-sub","Escolha única — selecione o tipo de ocorrência atendida"));

  CATEGORIAS_OCORRENCIAS.forEach(cat=>{
    const sectionTitle = el("h2","category-title", cat.categoria);
    c.appendChild(sectionTitle);

    const list = el("div","stack-list");
    cat.tipos.forEach(t=>{
      const selected = state.tipoId===t.id;
      const btn = el("button","opt-row opt-row-primary"+(selected?" selected":""));
      btn.type="button";
      btn.appendChild(el("span","btn-label-clean", t.nome));
      btn.onclick = ()=>{
        state.tipoId=t.id;
        state.subtipoIds=[]; 
        state.subtiposAdicionais=[];
        state.veiculosSelecionados=[];
        state.respostas={}; 
        state.screen=2; 
        renderCallback(); 
        window.scrollTo(0,0); 
      };
      list.appendChild(btn);
    });
    c.appendChild(list);
  });

  return c;
}