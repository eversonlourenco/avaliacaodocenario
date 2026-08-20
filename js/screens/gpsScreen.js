import { state, salvarEstado } from '../state.js';
import { capturarLocalizacaoAutomatica } from '../geolocation.js';
import { el } from '../uiHelpers.js';

export function renderGpsActionScreen(renderCallback){
  const c = el("div","screen");
  
  c.appendChild(el("h1","screen-title","Ativação de Localização"));
  c.appendChild(el("p","screen-sub","Para garantir a precisão do informe operacional enviado à central, é obrigatório ativar o GPS no início da ocorrência."));

  const box = el("div","subpanel");
  box.style.textAlign = "center";
  box.style.padding = "40px 20px";

  const icon = el("div","","🛰️");
  icon.style.fontSize = "56px";
  icon.style.marginBottom = "20px";
  box.appendChild(icon);

  const titleAlert = el("div","", state.buscandoGeo ? "Buscando sinal de GPS..." : "GPS Necessário");
  titleAlert.style.fontSize = "18px";
  titleAlert.style.fontWeight = "bold";
  titleAlert.style.marginBottom = "10px";
  box.appendChild(titleAlert);

  const desc = el("div","", state.geoMensagem || "Toque no botão abaixo para permitir que o aplicativo capte suas coordenadas e endereço atual automaticamente.");
  desc.style.fontSize = "14px";
  desc.style.color = "var(--text-dim, #9ca3af)";
  desc.style.marginBottom = "30px";
  box.appendChild(desc);

  const btnGps = el("button","btn-primary", state.buscandoGeo ? "Buscando satélites..." : "ATIVAR GPS AGORA");
  btnGps.type = "button";
  btnGps.disabled = state.buscandoGeo;
  btnGps.style.width = "100%";
  btnGps.style.padding = "16px";
  btnGps.style.fontSize = "16px";
  btnGps.style.fontWeight = "bold";
  btnGps.onclick = () => {
    capturarLocalizacaoAutomatica(renderCallback);
  };
  box.appendChild(btnGps);

  const btnSkip = el("button","btn-blue","Prosseguir sem GPS (Não recomendado)");
  btnSkip.type = "button";
  btnSkip.style.width = "100%";
  btnSkip.style.marginTop = "15px";
  btnSkip.style.background = "transparent";
  btnSkip.style.border = "1px solid var(--border, #374151)";
  btnSkip.style.color = "var(--text, #fff)";
  btnSkip.style.padding = "12px";
  btnSkip.onclick = () => {
    state.coordenadas = "Não informada";
    state.geoStatus = "sucesso";
    salvarEstado();
    renderCallback();
  };
  box.appendChild(btnSkip);

  c.appendChild(box);
  return c;
}