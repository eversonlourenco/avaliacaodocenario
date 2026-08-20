/* =========================================================
   STATE — Gerenciamento de estado e localStorage
   ========================================================= */

import { obterTodosTipos } from './data.js';

export const STORAGE_KEY = "app_informe_operacional_state_v1";

export const state = {
  screen: 1,
  tipoId: null,
  subtipoIds: [],
  subtiposAdicionais: [],
  veiculosSelecionados: [],
  residencial: { tipoImovel:null, andar:0, pavimentos:0, pavimentoFogo:0, comodos:[] },
  respostas: {},
  endereco: "",
  coordenadas: "",
  geradoEm: null,
  buscandoGeo: false,
  geoStatus: "pendente",
  geoMensagem: ""
};

export function salvarEstado() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch(e) {
    console.error("Erro ao salvar no localStorage", e);
  }
}

export function carregarEstado() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved) {
      const parsed = JSON.parse(saved);
      Object.assign(state, parsed);
    }
  } catch(e) {
    console.error("Erro ao carregar do localStorage", e);
  }
}

export function tipoAtual(){ return obterTodosTipos().find(t=>t.id===state.tipoId); }
export function subtiposSelecionados(){ const t=tipoAtual(); return t ? t.subtipos.filter(s=>state.subtipoIds.includes(s.id)) : []; }
export function algumSubtipoResidencial(){ return subtiposSelecionados().some(s=>s.residencial); }
export function toggleSubtipo(id){
  const i = state.subtipoIds.indexOf(id);
  if(i>=0) state.subtipoIds.splice(i,1); else state.subtipoIds.push(id);
  salvarEstado();
}

export function resetForm(renderCallback){
  localStorage.removeItem(STORAGE_KEY);
  state.screen = 1;
  state.tipoId = null;
  state.subtipoIds = [];
  state.subtiposAdicionais = [];
  state.veiculosSelecionados = [];
  state.residencial = { tipoImovel:null, andar:0, pavimentos:0, pavimentoFogo:0, comodos:[] };
  state.respostas = {};
  state.geradoEm = null;
  state.coordenadas = "";
  state.endereco = "";
  state.geoStatus = "pendente";
  state.geoMensagem = "";
  if(renderCallback) renderCallback();
  window.scrollTo(0,0);
}

export function getResp(key){
  if(!state.respostas[key]) state.respostas[key] = {};
  return state.respostas[key];
}

export function toggleCheckbox(key, opt){
  const r = getResp(key);
  if(!r.opts) r.opts = [];
  const i = r.opts.indexOf(opt);
  if(i>=0) r.opts.splice(i,1); else r.opts.push(opt);
  salvarEstado();
}

export function isChecked(key, opt){
  const r = state.respostas[key];
  return !!(r && r.opts && r.opts.includes(opt));
}