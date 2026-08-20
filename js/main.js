/* =========================================================
   MAIN — Ponto de entrada e roteador principal
   ========================================================= */

import { state, carregarEstado, salvarEstado } from './state.js';
import { renderGpsActionScreen } from './screens/gpsScreen.js';
import { renderTipoScreen } from './screens/tipoScreen.js';
import { renderSubtipoScreen } from './screens/subtipoScreen.js';
import { renderPerguntasScreen } from './screens/perguntasScreen.js';
import { renderInformeScreen } from './screens/informeScreen.js';
import { el } from './uiHelpers.js';

const app = document.getElementById("app");

export function render(){
  salvarEstado();
  app.innerHTML = "";
  const wrap = el("div","screen-wrap");
  
  if(!state.coordenadas && state.geoStatus !== "sucesso") {
    wrap.appendChild(renderGpsActionScreen(render));
  } else if(state.screen===1) {
    wrap.appendChild(renderTipoScreen(render));
  } else if(state.screen===2) {
    wrap.appendChild(renderSubtipoScreen(render));
  } else if(state.screen===3) {
    wrap.appendChild(renderPerguntasScreen(render));
  } else if(state.screen===4) {
    wrap.appendChild(renderInformeScreen(render));
  }
  
  app.appendChild(wrap);
}

carregarEstado();
render();

if("serviceWorker" in navigator){
  window.addEventListener("load", ()=>{
    navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
  });
}