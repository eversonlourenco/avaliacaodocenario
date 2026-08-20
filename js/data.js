/* =========================================================
   DATA — Estruturas de dados e categorias
   ========================================================= */

export const MATERIAL_EDIFICACOES = {
  label: "Tipo de Material Queimando",
  classes: [
    { nome: "Sólidos (Classe A)", itens: ["Sofás","Camas","Colchões","Tapetes","Cortinas","Guarda-roupas","Mesas","Cadeiras","Estantes","Livros","Roupas","Papéis","Quadros","Brinquedos","Utensílios"].sort((a,b)=>a.localeCompare(b,"pt-BR")) },
    { nome: "Líquidos Inflamáveis (Classe B)", itens: ["Gasolina","Álcool","Óleo Diesel","Querosene","Óleos lubrificantes","Tintas"].sort((a,b)=>a.localeCompare(b,"pt-BR")) },
    { nome: "Equipamentos Elétricos (Classe C)", itens: ["Televisores","Geladeiras","Fogões","Micro-ondas","Máquinas de lavar","Computadores","Ar-condicionado","Liquidificadores","Batedeiras","Airfryers","Sanduicheiras","Cafeteiras","Ventiladores"].sort((a,b)=>a.localeCompare(b,"pt-BR")) },
    { nome: "Metais Combustíveis (Classe D)", itens: ["Magnésio","Titânio","Lítio","Sódio","Potássio","Alumínio","Zinco"].sort((a,b)=>a.localeCompare(b,"pt-BR")) },
    { nome: "Óleos e Gorduras (Classe K)", itens: ["Óleo de soja","Óleo de canola","Óleo de milho","Óleo de girassol","Óleo de oliva","Azeite"].sort((a,b)=>a.localeCompare(b,"pt-BR")) },
  ]
};

export const SITUACAO_INCENDIO = { key:"situacao", label:"Situação Encontrada", type:"checkbox",
  options:["Pequeno Incêndio","Médio Incêndio","Grande Incêndio","Propagando","Generalizado","Controlado","Extinto","Rescaldo"] };

export const VITIMAS = { key:"vitimas", type:"vitimas" };

export const SITUACAO_VITIMAS = { key:"situacaoVitimas", label:"Situação das Vítimas", type:"checkbox",
  options:["Em atendimento","Removida para o hospital","Removida por populares","Recusou atendimento"],
  extra:{ label:"Órgão responsável", options:["ASE","ABSR","SAMU","CONCESSIONÁRIA","OUTROS"] } };

export const RECURSOS = { key:"recursos", type:"recursos", viaturaOptions:["ABSL","ABS","ASE","ABSR","AR","AT"] };

export const OBSERVACOES = { key:"observacoes", label:"Observações", type:"texto" };

export function perguntasPadrao(materialBlock, extras) {
  const base = [SITUACAO_INCENDIO];
  if (materialBlock) base.push({ key:"material", type:"material", ...materialBlock });
  if (extras) base.push(...extras);
  base.push(VITIMAS, SITUACAO_VITIMAS, RECURSOS, OBSERVACOES);
  return base;
}

export const BLOQUEIO_VIA = { key:"bloqueio", label:"Existe Bloqueio da Via", type:"checkbox",
  options:["Não","Parcial","Total"] };

export const SENTIDO_VIA = { key:"sentido", label:"Sentido", type:"checkbox",
  options:["Rio de Janeiro","Juiz de Fora","Três Rios","Paraíba do Sul","Levi Gasparian","Volta Redonda","Sapucaia"] };

export const MATERIAL_TRANSPORTADO = { key:"materialTransportado", label:"Tipo de Material Transportado", type:"checkbox",
  options:["Carga Comum","Inflamável","Química","Explosiva"] };

export const SITUACAO_ACIDENTE = { key:"situacao", label:"Situação Encontrada", type:"checkbox",
  options:["Vítima dentro do veículo","Vítima já fora do veículo","Vítima presa às ferragens","Vítima ejetada","Múltiplas vítimas","Veículo com GNV","Veículo Híbrido","Veículo 100% Elétrico","Carga Perigosa","Vazamento de carga"] };

export function perguntasAcidenteVeicular() {
  return [SITUACAO_ACIDENTE, BLOQUEIO_VIA, SENTIDO_VIA, MATERIAL_TRANSPORTADO, VITIMAS, SITUACAO_VITIMAS, RECURSOS, OBSERVACOES];
}

export const SITUACAO_VEGETACAO = SITUACAO_INCENDIO;

export const INFO_VEGETACAO = { key:"infoVegetacao", label:"Informações Adicionais", type:"grupos",
  grupos:[
    { nome:"Propriedade", options:["Pública","Privada","Não identificada"] },
    { nome:"Zoneamento", options:["Urbano","Rural","Unidade de Conservação"] },
    { nome:"Tipo de Vegetação", options:["Rasteiro","Pasto","Arbusto","Árvore"] },
    { nome:"Tipo de Terreno", options:["Plano","Encosta","Aclive","Declive","Morro","Montanhoso","Irregular"] },
    { nome:"Condições do Vento", options:["Calmo","Moderado","Forte"] },
    { nome:"Apoio de Órgãos Externos", options:["Guarda Municipal","Defesa Civil Municipal","Brigadistas","Voluntários"] },
  ]};

export const FERRAMENTAS_VEGETACAO = { key:"ferramentas", label:"Ferramentas", type:"contadores",
  options:["Abafador","Bomba Costal","Enxada","Pá","McLeod","Facão"] };

export const CATEGORIAS_OCORRENCIAS = [
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
        perguntas: perguntasPadrao(null, [BLOQUEIO_VIA, SENTIDO_VIA, MATERIAL_TRANSPORTADO])
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

CATEGORIAS_OCORRENCIAS.forEach(cat => {
  cat.tipos.forEach(t => {
    t.subtipos.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  });
  cat.tipos.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
});

export function obterTodosTipos(){
  const todos = [];
  CATEGORIAS_OCORRENCIAS.forEach(cat => todos.push(...cat.tipos));
  return todos;
}