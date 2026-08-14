/* =========================================================
   AVALIAÇÃO DA CENA — App de Informe Operacional
   ========================================================= */

/* ---------- Blocos de perguntas reutilizáveis ---------- */

const MATERIAL_EDIFICACOES = {
  label: "Tipo de Material Queimando",
  classes: [
    { nome: "Sólidos (Classe A)", itens: ["Sofás","Camas","Colchões","Tapetes","Cortinas","Guarda-roupas","Mesas","Cadeiras","Estantes","Livros","Roupas","Papéis","Quadros","Brinquedos","Utensílios"].sort((a,b)=>a.localeCompare(b,"pt-BR")) },
    { nome: "Líquidos Inflamáveis (Classe B)", itens: ["Gasolina","Álcool","Óleo Diesel","Querosene","Óleos lubrificantes","Tintas"].sort((a,b)=>a.localeCompare(b,"pt-BR")) },
    { nome: "Equipamentos Elétricos (Classe C)", itens: ["Televisores","Geladeiras","Fogões","Micro-ondas","Máquinas de lavar","Computadores","Ar-condicionado","Liquidificadores","Batedeiras","Airfryers","Sanduicheiras","Cafeteiras","Ventiladores"].sort((a,b)=>a.localeCompare(b,"pt-BR")) },
    { nome: "Metais Combustíveis (Classe D)", itens: ["Magnésio","Titânio","Lítio","Sódio","Potássio","Alumínio","Zinco"].sort((a,b)=>a.localeCompare(b,"pt-BR")) },
    { nome: "Óleos e Gorduras (Classe K)", itens: ["Óleo de soja","Óleo de canola","Óleo de milho","Óleo de girassol","Óleo de oliva","Azeite"].sort((a,b)=>a.localeCompare(b,"pt-BR")) },
  ]
};

const SITUACAO_INCENDIO = { key:"situacao", label:"Situação Encontrada", type:"checkbox",
  options:["Pequeno Incêndio","Médio Incêndio","Grande Incêndio","Propagando","Generalizado","Controlado","Extinto","Rescaldo"] };

const DANOS = { key:"danos", label:"Existe bloqueioda via", type:"checkbox", options:["Não","Parcial","Total","Vazamento de carga"] };

const VITIMAS = { key:"vitimas", type:"vitimas" };

const SITUACAO_VITIMAS = { key:"situacaoVitimas", label:"Situação das Vítimas", type:"checkbox",
  options:["Em atendimento","Removida para o hospital","Removida por populares","Recusou atendimento"],
  extra:{ label:"Órgão responsável", options:["ASE","ABSR","SAMU","CONCESSIONÁRIA","OUTROS"] } };

const RECURSOS = { key:"recursos", type:"recursos", viaturaOptions:["ABSL","ABS","ASE","ABSR","AR","AT"] };

const OBSERVACOES = { key:"observacoes", label:"Observações", type:"texto" };

function perguntasPadrao(materialBlock, extras) {
  const base = [SITUACAO_INCENDIO];
  if (materialBlock) base.push({ key:"material", type:"material", ...materialBlock });
  if (extras) base.push(...extras);
  base.push(VITIMAS, SITUACAO_VITIMAS, RECURSOS, OBSERVACOES);
  return base;
}

const BLOQUEIO_VIA = { key:"bloqueio", label:"Em qual sentido", type:"checkbox",
  options:["Sentido Rio de Janeiro","Sentido Juiz de Fora","Sentido Três Rios","Sentido Paraíba do Sul","Sentido Levi Gasparian","Sentido Volta Redonda","Sentido Sapucaia"] };

const MATERIAL_TRANSPORTADO = { key:"materialTransportado", label:"Tipo de Material Transportado", type:"checkboxComTexto",
  options:["Carga Comum","Inflamável","Química","Explosiva"], textoLabel:"Qual" };

const SITUACAO_ACIDENTE = { key:"situacao", label:"Situação Encontrada", type:"checkbox",
  options:["Vítima dentro do veículo","Vítima já fora do veículo","Vítima presa às ferragens","Vítima ejetada","Múltiplas vítimas","Veículo com GNV","Veículo Híbrido","Veículo 100% Elétrico","Carga Perigosa"] };

function perguntasAcidenteVeicular() {
  return [SITUACAO_ACIDENTE, DANOS, BLOQUEIO_VIA, MATERIAL_TRANSPORTADO, VITIMAS, SITUACAO_VITIMAS, RECURSOS, OBSERVACOES];
}

const SITUACAO_VEGETACAO = SITUACAO_INCENDIO;

const INFO_VEGETACAO = { key:"infoVegetacao", label:"Informações Adicionais", type:"grupos",
  grupos:[
    { nome:"Propriedade", options:["Pública","Privada","Não identificada"] },
    { nome:"Zoneamento", options:["Urbano","Rural","Unidade de Conservação"] },
    { nome:"Tipo de Vegetação", options:["Rasteiro","Pasto","Arbusto","Árvore"] },
    { nome:"Tipo de Terreno", options:["Plano","Encosta","Aclive","Declive","Montanhoso","Irregular"] },
    { nome:"Condições do Vento", options:["Calmo","Moderado","Forte"] },
    { nome:"Apoio de Órgãos Externos", options:["Guarda Municipal","Defesa Civil Municipal","Brigadistas","Voluntários"] },
  ]};

const FERRAMENTAS_VEGETACAO = { key:"ferramentas", label:"Ferramentas", type:"contadores",
  options:["Abafador","Bomba Costal","Enxada","Pá","McLeod","Facão"] };

/* ---------- Estrutura de Tipos Agrupados ---------- */

const CATEGORIAS_OCORRENCIAS = [
  {
    categoria: "Acidente",
    tipos: [
      {
        id:"capotagem", nome:"Capotagem de Veículo", missao:"ACIDENTE DE TRÂNSITO",
        quantidadeVeiculos:true,
        subtipos:["Automóvel","Caminhão","Van","Ônibus"].map(n=>({id:n,nome:n})),
        perguntas: perguntasAcidenteVeicular()
      },
      {
        id:"colisao", nome:"Colisão de Veículos", missao:"ACIDENTE DE TRÂNSITO",
        quantidadeVeiculos:true,
        subtipos:["Automóvel","Bicicleta","Caminhão","Carroça","Moto","Moto elétrica","Muro","Poste","Trem","Van","Ônibus"].map(n=>({id:n,nome:n})),
        perguntas: perguntasAcidenteVeicular()
      },
      {
        id:"queda", nome:"Queda de Veículo", missao:"ACIDENTE DE TRÂNSITO",
        quantidadeVeiculos:true,
        subtipos:["Automóvel","Caminhão","Van","Ônibus","Moto"].map(n=>({id:n,nome:n})),
        perguntas: perguntasAcidenteVeicular()
      }
    ]
  },
  {
    categoria: "Incêndio",
    tipos: [
      {
        id:"vegetacao", nome:"Fogo em Vegetação", missao:"INCÊNDIO",
        quantidadeVeiculos:false,
        subtipos:["Beira de Via/Rodovia","Mata Rural","Mata Urbana","Montanha/Floresta","Morro/Encosta","Terreno Baldio"].map(n=>({id:n,nome:n})),
        perguntas:[SITUACAO_VEGETACAO, INFO_VEGETACAO, FERRAMENTAS_VEGETACAO, VITIMAS, SITUACAO_VITIMAS, RECURSOS, OBSERVACOES]
      },
      {
        id:"fogo_veiculo", nome:"Fogo em Veículo", missao:"INCÊNDIO",
        quantidadeVeiculos:true,
        subtipos:["Automóvel","Caminhão","Moto","Moto elétrica","Trem","Van","Ônibus"].map(n=>({id:n,nome:n})),
        perguntas: perguntasPadrao(null, [MATERIAL_TRANSPORTADO])
      },
      {
        id:"incendio_edif", nome:"Incêndio em Edificações", missao:"INCÊNDIO",
        quantidadeVeiculos:false,
        subtipos:[
          { id:"deposito", nome:"Depósitos/Galpões" },
          { id:"residencial", nome:"Edificações Residenciais", residencial:true },
          { id:"comercial", nome:"Estabelecimentos Comerciais" },
          { id:"industria", nome:"Indústrias" },
          { id:"restaurante", nome:"Restaurante/Bar" },
          { id:"publico", nome:"Órgãos Públicos" },
        ],
        perguntas: perguntasPadrao(MATERIAL_EDIFICACOES)
      }
    ]
  }
];

/* Ordenação A-Z dos Subtipos internos de cada Tipo */
CATEGORIAS_OCORRENCIAS.forEach(cat => {
  cat.tipos.forEach(t => {
    t.subtipos.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  });
  cat.tipos.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
});

function obterTodosTipos(){
  const todos = [];
  CATEGORIAS_OCORRENCIAS.forEach(cat => todos.push(...cat.tipos));
  return todos;
}

/* ---------- Estado ---------- */

const state = {
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
};

function tipoAtual(){ return obterTodosTipos().find(t=>t.id===state.tipoId); }
function subtiposSelecionados(){ const t=tipoAtual(); return t ? t.subtipos.filter(s=>state.subtipoIds.includes(s.id)) : []; }
function algumSubtipoResidencial(){ return subtiposSelecionados().some(s=>s.residencial); }
function toggleSubtipo(id){
  const i = state.subtipoIds.indexOf(id);
  if(i>=0) state.subtipoIds.splice(i,1); else state.subtipoIds.push(id);
}

function resetForm(){
  state.screen = 1;
  state.tipoId = null;
  state.subtipoIds = [];
  state.subtiposAdicionais = [];
  state.veiculosSelecionados = [];
  state.residencial = { tipoImovel:null, andar:0, pavimentos:0, pavimentoFogo:0, comodos:[] };
  state.respostas = {};
  state.geradoEm = null;
  render();
  window.scrollTo(0,0);
}

/* ---------- Coleta Automática de Geolocalização ---------- */

function capturarLocalizacaoAutomatica() {
  if (!("geolocation" in navigator)) {
    state.geoStatus = "erro";
    state.geoMensagem = "Seu navegador não suporta geolocalização.";
    refreshTicketPre();
    return;
  }

  state.buscandoGeo = true;
  state.geoStatus = "buscando";
  render();

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude.toFixed(6);
      const lon = pos.coords.longitude.toFixed(6);
      state.coordenadas = `${lat}, ${lon}`;
      state.geoStatus = "sucesso";

      try {
        const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.address) {
            const a = data.address;
            const rua = a.road || a.pedestrian || a.suburb || "";
            const num = a.house_number ? `, ${a.house_number}` : "";
            const bairro = a.suburb || a.neighbourhood || "";
            const cidade = a.city || a.town || a.municipality || "";
            
            let endFmt = rua + num;
            if (bairro && !rua.includes(bairro)) endFmt += (endFmt ? " - " : "") + bairro;
            if (cidade) endFmt += (endFmt ? ", " : "") + cidade;

            state.endereco = endFmt || data.display_name;
          }
        }
      } catch(e) {
      } finally {
        state.buscandoGeo = false;
        render();
      }
    },
    (err) => {
      state.buscandoGeo = false;
      state.geoStatus = "erro";
      if (err.code === err.PERMISSION_DENIED) {
        state.geoMensagem = "Permissão de localização negada. Ative o GPS nas configurações do dispositivo/navegador.";
      } else {
        state.geoMensagem = "Não foi possível obter a localização. Por favor, ative o GPS e tente novamente.";
      }
      render();
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
  );
}

/* ---------- Helpers ---------- */

function getResp(key){
  if(!state.respostas[key]) state.respostas[key] = {};
  return state.respostas[key];
}

function toggleCheckbox(key, opt){
  const r = getResp(key);
  if(!r.opts) r.opts = [];
  const i = r.opts.indexOf(opt);
  if(i>=0) r.opts.splice(i,1); else r.opts.push(opt);
}

function isChecked(key, opt){
  const r = state.respostas[key];
  return !!(r && r.opts && r.opts.includes(opt));
}

/* ---------- Componente de Navegação na mesma linha ---------- */

function renderNavButtons(onBack, onNext, nextText = "Avançar", nextDisabled = false) {
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

/* ---------- Render ---------- */

const app = document.getElementById("app");

function render(){
  app.innerHTML = "";
  const wrap = el("div","screen-wrap");
  if(state.screen===1) wrap.appendChild(renderTipoScreen());
  else if(state.screen===2) wrap.appendChild(renderSubtipoScreen());
  else if(state.screen===3) wrap.appendChild(renderPerguntasScreen());
  else if(state.screen===4) wrap.appendChild(renderInformeScreen());
  app.appendChild(wrap);
}

function el(tag, className, text){
  const e = document.createElement(tag);
  if(className) e.className = className;
  if(text!==undefined) e.textContent = text;
  return e;
}

/* ---------- Tela 1: Tipo ---------- */

function renderTipoScreen(){
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
        render(); 
        window.scrollTo(0,0); 
      };
      list.appendChild(btn);
    });
    c.appendChild(list);
  });

  return c;
}

/* ---------- Tela 2: Subtipo ---------- */

function renderSubtipoScreen(){
  const t = tipoAtual();
  const c = el("div","screen");

  c.appendChild(el("h1","screen-title", t.nome));
  c.appendChild(el("p","screen-sub", t.quantidadeVeiculos ? "Clique nos veículos para adicionar (cada clique conta +1)" : "Podendo ser escolhido mais de um subtipo"));

  /* Se for ocorrência com Veículos */
  if(t.quantidadeVeiculos){
    const yellowBox = el("div","vehicle-summary-box");
    
    // Mostra apenas os veículos separados por 'x', sem o '00,' antes.
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
        render();
      };
      yellowBox.appendChild(btnClear);
    }

    c.appendChild(yellowBox);
  }

  const list = el("div","grid-2-list");
  
  // Renderiza as opções padrão
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
        render();
      };
      list.appendChild(btn);
    } else {
      const selected = state.subtipoIds.includes(s.id);
      const btn = el("button","opt-row"+(selected?" selected":""));
      btn.type = "button";
      btn.appendChild(el("span","btn-label-clean", s.nome));
      btn.onclick = ()=>{ toggleSubtipo(s.id); render(); };
      list.appendChild(btn);
    }
  });

  // Renderiza as opções customizadas (digitadas pelo usuário em "Outros")
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
        render();
      };
      list.appendChild(btn);
    });
  } else {
    state.subtiposAdicionais.forEach((customName, idx) => {
      const btn = el("button","opt-row selected");
      btn.type = "button";
      btn.appendChild(el("span","btn-label-clean", customName));
      // Clicar em um customizado de não-veículo remove ele da lista
      btn.onclick = ()=>{
        state.subtiposAdicionais.splice(idx, 1);
        render();
      };
      list.appendChild(btn);
    });
  }

  c.appendChild(list);

  /* Caixa de texto Outros com Botão OK */
  const fieldOutros = el("div", "field-outros");
  fieldOutros.appendChild(el("div", "field-label", "Outros (digite e clique em OK para adicionar)"));
  
  const outrosRow = el("div", "outros-row");
  
  const inputOutros = el("input", "input-outros");
  inputOutros.type = "text";
  inputOutros.placeholder = "Digite outra opção...";
  inputOutros.id = "input-custom-subtipo";
  
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
      render();
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
    c.appendChild(renderResidencialDetalhes());
  }

  const isNextDisabled = t.quantidadeVeiculos
    ? state.veiculosSelecionados.length === 0
    : (state.subtipoIds.length === 0 && state.subtiposAdicionais.length === 0);

  const nav = renderNavButtons(
    () => { state.screen = 1; render(); window.scrollTo(0, 0); },
    () => { state.screen = 3; render(); window.scrollTo(0, 0); },
    "Avançar",
    isNextDisabled
  );
  c.appendChild(nav);

  return c;
}

function renderResidencialDetalhes(){
  const box = el("div","subpanel");
  box.appendChild(el("h3","subpanel-title","Detalhes da Edificação Residencial"));

  const tipoRow = el("div","chip-row");
  ["Casa","Apartamento"].forEach(op=>{
    const b = el("button","chip small"+(state.residencial.tipoImovel===op?" selected":""),op);
    b.type="button";
    b.onclick=()=>{state.residencial.tipoImovel=op; render();};
    tipoRow.appendChild(b);
  });
  box.appendChild(labeledField("Tipo de Imóvel", tipoRow));

  box.appendChild(counterField("Andar", state.residencial.andar, v=>{state.residencial.andar=v; render();}));
  box.appendChild(counterField("Pavimentos", state.residencial.pavimentos, v=>{state.residencial.pavimentos=v; render();}));
  box.appendChild(counterField("Fogo em qual Pavimento", state.residencial.pavimentoFogo, v=>{state.residencial.pavimentoFogo=v; render();}));

  const comodoRow = el("div","chip-row wrap");
  ["Sala","Cozinha","Quarto","Banheiro","Área externa"].forEach(op=>{
    const active = state.residencial.comodos.includes(op);
    const b = el("button","chip small"+(active?" selected":""),op);
    b.type="button";
    b.onclick=()=>{
      const i = state.residencial.comodos.indexOf(op);
      if(i>=0) state.residencial.comodos.splice(i,1); else state.residencial.comodos.push(op);
      render();
    };
    comodoRow.appendChild(b);
  });
  box.appendChild(labeledField("Fogo em qual Cômodo", comodoRow));

  return box;
}

/* ---------- Campos ---------- */

function labeledField(label, node){
  const f = el("div","field");
  f.appendChild(el("div","field-label",label));
  f.appendChild(node);
  return f;
}

function counterField(label, value, onChange){
  const row = el("div","counter-row");
  row.appendChild(el("div","field-label",label));
  const ctrl = el("div","counter");
  const minus = el("button","counter-btn","−"); minus.type="button";
  const val = el("span","counter-val", String(value).padStart(2,"0"));
  const plus = el("button","counter-btn","+"); plus.type="button";
  minus.onclick=()=>onChange(Math.max(0,value-1));
  plus.onclick=()=>onChange(value+1);
  ctrl.append(minus,val,plus);
  row.appendChild(ctrl);
  return row;
}

/* ---------- Tela 3: Perguntas ---------- */

function renderPerguntasScreen(){
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
    c.appendChild(renderPergunta(p));
  });

  const nav = renderNavButtons(
    () => { state.screen = 2; render(); window.scrollTo(0, 0); },
    () => { 
      state.geradoEm = new Date(); 
      if(!state.coordenadas) capturarLocalizacaoAutomatica();
      state.screen = 4; 
      render(); 
      window.scrollTo(0,0); 
    },
    "GERAR INFORME OPERACIONAL"
  );
  c.appendChild(nav);

  return c;
}

function renderPergunta(p){
  const box = el("div","subpanel");
  if(p.type==="checkbox") return renderCheckboxBlock(p, box);
  if(p.type==="checkboxComTexto") return renderCheckboxComTexto(p, box);
  if(p.type==="material") return renderMaterialBlock(p, box);
  if(p.type==="grupos") return renderGruposBlock(p, box);
  if(p.type==="contadores") return renderContadoresBlock(p, box);
  if(p.type==="vitimas") return renderVitimasBlock(box);
  if(p.type==="recursos") return renderRecursosBlock(p, box);
  if(p.type==="texto") return renderTextoBlock(p, box);
  return box;
}

function severityColor(op){
  if(op==="Pequeno Incêndio") return "var(--green)";
  if(op==="Médio Incêndio") return "var(--amber)";
  if(op==="Grande Incêndio") return "var(--red)";
  return null;
}

function gridOptionsNoIcons(options, isSelectedFn, onToggle, colorFn){
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
    b.onclick=()=>{ onToggle(op); render(); };
    grid.appendChild(b);
  });
  return grid;
}

function renderCheckboxBlock(p, box){
  box.appendChild(el("h3","subpanel-title", p.label));
  const cf = p.key==="situacao" ? severityColor : null;
  box.appendChild(gridOptionsNoIcons(p.options, op=>isChecked(p.key,op), op=>toggleCheckbox(p.key,op), cf));
  if(p.extra){
    box.appendChild(el("div","field-label mt", p.extra.label));
    const key = p.key+"_extra";
    box.appendChild(gridOptionsNoIcons(p.extra.options, op=>isChecked(key,op), op=>toggleCheckbox(key,op)));
  }
  return box;
}

function renderCheckboxComTexto(p, box){
  box.appendChild(el("h3","subpanel-title", p.label));
  box.appendChild(gridOptionsNoIcons(p.options, op=>isChecked(p.key,op), op=>toggleCheckbox(p.key,op)));
  const r = getResp(p.key);
  const input = el("input","text-input mt-2");
  input.type="text"; input.placeholder = p.textoLabel + "...";
  input.value = r.texto || "";
  input.oninput = (e)=>{ r.texto = e.target.value; };
  box.appendChild(labeledField(p.textoLabel, input));
  return box;
}

function renderMaterialBlock(p, box){
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
      render();
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
        }));
      clBox.appendChild(itemsBox);
    }
    box.appendChild(clBox);
  });
  return box;
}

function renderGruposBlock(p, box){
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
      }));
  });
  return box;
}

function renderContadoresBlock(p, box){
  box.appendChild(el("h3","subpanel-title", p.label));
  const r = getResp(p.key);
  if(!r.counts) r.counts = {};
  p.options.forEach(op=>{
    box.appendChild(counterField(op, r.counts[op]||0, v=>{r.counts[op]=v; render();}));
  });
  return box;
}

function counterFieldColored(label, color, value, onChange){
  const row = counterField(label, value, onChange);
  const labelEl = row.querySelector(".field-label");
  if(labelEl && color) labelEl.style.color = color;
  return row;
}

function renderVitimasBlock(box){
  box.appendChild(el("h3","subpanel-title","Vítimas"));
  const r = getResp("vitimas");
  const semBtn = el("button","grid-btn full-width"+(r.sem?" selected":""));
  semBtn.type="button";
  semBtn.appendChild(el("span","grid-btn-text","Sem vítimas"));
  semBtn.onclick=()=>{ r.sem=!r.sem; render(); };
  box.appendChild(semBtn);
  if(!r.sem){
    box.appendChild(counterField("Quantidade de Vítimas", r.total||0, v=>{r.total=v; render();}));
    box.appendChild(counterFieldColored("Verdes", "var(--green)", r.verde||0, v=>{r.verde=v; render();}));
    box.appendChild(counterFieldColored("Amarelas", "var(--amber)", r.amarelo||0, v=>{r.amarelo=v; render();}));
    box.appendChild(counterFieldColored("Vermelhas", "var(--red)", r.vermelho||0, v=>{r.vermelho=v; render();}));
    box.appendChild(counterFieldColored("Cinzas", "var(--text-dim)", r.cinza||0, v=>{r.cinza=v; render();}));
  }
  return box;
}

function renderRecursosBlock(p, box){
  box.appendChild(el("h3","subpanel-title","Recursos"));
  const r = getResp("recursos");
  box.appendChild(counterField("Viaturas empregadas", r.viaturas||0, v=>{r.viaturas=v; render();}));
  box.appendChild(el("div","field-label mt","Tipo de Viatura"));
  box.appendChild(gridOptionsNoIcons(p.viaturaOptions,
    op=>(r.tipos||[]).includes(op),
    op=>{
      if(!r.tipos) r.tipos=[];
      const i=r.tipos.indexOf(op);
      if(i>=0) r.tipos.splice(i,1); else r.tipos.push(op);
    }));
  box.appendChild(counterField("Efetivo empregado", r.efetivo||0, v=>{r.efetivo=v; render();}));
  return box;
}

function renderTextoBlock(p, box){
  box.appendChild(el("h3","subpanel-title", p.label));
  const r = getResp(p.key);
  const ta = el("textarea","text-area");
  ta.rows = 4;
  ta.placeholder = "Digite observações adicionais...";
  ta.value = r.texto || "";
  ta.oninput = (e)=>{ r.texto = e.target.value; };
  box.appendChild(ta);
  return box;
}

/* ---------- Geração do Informe ---------- */

const SEPARADOR = "--------------------------------";

function pad2(n){ return String(n).padStart(2,"0"); }

function gerarTextoInforme(){
  const t = tipoAtual();
  const subs = subtiposSelecionados();
  const blocos = [];

  const cab = ["*AVALIAÇÃO DA CENA*"];
  const agora = state.geradoEm || new Date();
  cab.push("*DATA:* " + agora.toLocaleDateString("pt-BR"));
  cab.push("*HORA:* " + agora.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}) + " (coleta das informações)");
  if(state.coordenadas.trim()) cab.push("*COORDENADAS:* " + state.coordenadas.trim());
  if(state.endereco.trim()) cab.push("*ENDEREÇO:* " + state.endereco.trim());
  cab.push("*MISSÃO:* " + (t.missao || ""));
  blocos.push(cab);

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
    if(p.type==="checkbox" && p.key==="situacao" && r.opts && r.opts.length){
      sit.push("SITUAÇÃO ENCONTRADA: " + r.opts.join(", "));
    } else if(p.type==="checkbox" && p.key==="danos" && r.opts && r.opts.length){
      sit.push("BLOQUEIO DA VIA: " + r.opts.join(", "));
    } else if(p.type==="material" && r.classes){
      const partes = Object.entries(r.classes)
        .filter(([k,itens])=>itens.length>0)
        .map(([k,itens])=>k+" — "+itens.join(", "));
      if(partes.length) sit.push("MATERIAL QUEIMANDO: " + partes.join(" | "));
    } else if(p.type==="checkbox" && p.key==="bloqueio" && r.opts && r.opts.length){
      sit.push("SENTIDO: " + r.opts.join(", "));
    } else if(p.type==="checkboxComTexto" && p.key==="materialTransportado" && ((r.opts&&r.opts.length)||r.texto)){
      let linha = "MATERIAL TRANSPORTADO: " + (r.opts&&r.opts.length? r.opts.join(", ") : "");
      if(r.texto && r.texto.trim()) linha += " (" + r.texto.trim() + ")";
      sit.push(linha.trim());
    } else if(p.type==="grupos"){
      const partes = p.grupos
        .map(g=>({nome:g.nome, valores:(r.groups && r.groups[g.nome]) || []}))
        .filter(x=>x.valores.length>0)
        .map(x=>x.nome + ": " + x.valores.join(", "));
      if(partes.length) {
        if(sit.length) sit.push(SEPARADOR);
        sit.push("INFORMAÇÕES ADICIONAIS:\n" + partes.join("\n"));
      }
    } else if(p.type==="contadores" && r.counts){
      const entries = Object.entries(r.counts).filter(([k,v])=>v>0);
      if(entries.length) {
        if(sit.length) sit.push(SEPARADOR);
        sit.push("FERRAMENTAS:\n" + entries.map(([k,v])=> k + " (" + v + ")").join("\n"));
      }
    }
  });
  blocos.push(sit);

  const vit = [];
  const rv = state.respostas["vitimas"];
  if(rv){
    if(rv.sem){
      vit.push("VÍTIMAS: Sem vítimas");
    } else {
      const partes = [];
      if(rv.total>0) partes.push(String(rv.total));
      if(rv.verde>0) partes.push("Verdes: "+rv.verde);
      if(rv.amarelo>0) partes.push("Amarelas: "+rv.amarelo);
      if(rv.vermelho>0) partes.push("Vermelhas: "+rv.vermelho);
      if(rv.cinza>0) partes.push("Cinzas: "+rv.cinza);
      if(partes.length) vit.push("VÍTIMAS: " + partes.join(" | "));
    }
  }
  const rsv = state.respostas["situacaoVitimas"];
  const rsvExtra = state.respostas["situacaoVitimas_extra"];
  if((rsv && rsv.opts && rsv.opts.length) || (rsvExtra && rsvExtra.opts && rsvExtra.opts.length)){
    let linha = "SITUAÇÃO DAS VÍTIMAS: " + (rsv&&rsv.opts? rsv.opts.join(", ") : "");
    if(rsvExtra && rsvExtra.opts && rsvExtra.opts.length) linha += " (" + rsvExtra.opts.join(", ") + ")";
    vit.push(linha.trim());
  }
  blocos.push(vit);

  const rec = [];
  const rr = state.respostas["recursos"];
  if(rr){
    const partes = [];
    if(rr.viaturas>0) partes.push("Vtrs: " + rr.viaturas + (rr.tipos&&rr.tipos.length? " ("+rr.tipos.join(", ")+")":""));
    if(rr.efetivo>0) partes.push("Efetivo: " + rr.efetivo);
    if(partes.length) rec.push("RECURSOS: " + partes.join(" | "));
  }
  blocos.push(rec);

  const obs = [];
  const ro = state.respostas["observacoes"];
  if(ro && ro.texto && ro.texto.trim()) obs.push("OBSERVAÇÕES: " + ro.texto.trim());
  blocos.push(obs);

  const naoVazios = blocos.filter(b=>b.length>0);
  return naoVazios.map(b=>b.join("\n")).join("\n"+SEPARADOR+"\n");
}

/* ---------- Tela 4: Informe ---------- */

let ticketPreRef = null;

function refreshTicketPre(){
  if(ticketPreRef) ticketPreRef.textContent = gerarTextoInforme();
}

function renderInformeScreen(){
  const c = el("div","screen");
  c.appendChild(el("h1","screen-title","Informe Operacional"));

  /* Alerta solicitando para ligar a localização se não houver coordenadas */
  if(!state.coordenadas) {
    const alertBox = el("div", "geo-alert-box");
    
    const title = el("div", "geo-alert-title", "📍 Localização não capturada");
    const desc = el("div", "geo-alert-desc", 
      state.geoMensagem || "Por favor, ligue a Localização (GPS) do seu aparelho e permita o acesso ao navegador para incluir endereço e coordenadas no informe."
    );
    
    const btnRetry = el("button", "btn-geo", state.buscandoGeo ? "Buscando localização..." : "Ligar/Tentar Obter Localização");
    btnRetry.type = "button";
    btnRetry.disabled = state.buscandoGeo;
    btnRetry.onclick = () => {
      capturarLocalizacaoAutomatica();
    };

    alertBox.append(title, desc, btnRetry);
    c.appendChild(alertBox);
  }

  const ticket = el("div","ticket");
  const pre = el("pre","ticket-text");
  pre.textContent = gerarTextoInforme();
  ticketPreRef = pre;
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
    if(confirm("Deseja realmente zerar o formulário? Todos os dados serão perdidos.")) resetForm();
  };

  actions.append(btnWpp, btnCopy, btnReset);
  c.appendChild(actions);

  const nav = renderNavButtons(
    () => { state.screen = 3; render(); window.scrollTo(0, 0); },
    null
  );
  c.appendChild(nav);

  return c;
}
/* ---------- Inicialização ---------- */

render();

if("serviceWorker" in navigator){
  window.addEventListener("load", ()=>{
    navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
  });
}
