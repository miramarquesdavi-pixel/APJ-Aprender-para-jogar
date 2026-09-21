const subjects = [
  {id:"matematica", name:"Matemática", icon:"∑", desc:"Do básico à matemática avançada", levels:["Soma","Subtração","Multiplicação","Divisão","Frações","Potenciação","Raiz quadrada","Equações","Expressões matemáticas","Desafios avançados"]},
  {id:"portugues", name:"Português", icon:"Aa", desc:"Língua, gramática e interpretação", levels:["Verbos","Substantivos","Adjetivos","Pontuação","Interpretação de texto","Figuras de linguagem","Gramática","Concordância","Produção de texto","Desafios avançados"]},
  {id:"geografia", name:"Geografia", icon:"◎", desc:"Espaço, sociedade e planeta", levels:["Cartografia","Relevo","Clima","Biomas","População","Urbanização","Economia","Geopolítica","Globalização","Desafios avançados"]},
  {id:"historia", name:"História", icon:"⌛", desc:"Do mundo antigo à atualidade", levels:["Antiguidade","Idade Média","Renascimento","Grandes navegações","Brasil Colonial","Revoluções","Brasil Império","República","Século XX","Mundo contemporâneo"]},
  {id:"biologia", name:"Biologia", icon:"◉", desc:"Vida, células e seres vivos", levels:["Células","Genética","Evolução","Ecologia","Botânica","Zoologia","Corpo humano","Microbiologia","Biotecnologia","Desafios avançados"]},
  {id:"fisica", name:"Física", icon:"ϟ", desc:"Movimento, energia e universo", levels:["Grandezas físicas","Movimento","Forças","Energia","Calor","Ondas","Eletricidade","Magnetismo","Óptica","Desafios avançados"]},
  {id:"quimica", name:"Química", icon:"⚗", desc:"Matéria e suas transformações", levels:["Matéria","Átomos","Tabela periódica","Ligações químicas","Reações","Soluções","pH","Orgânica","Eletroquímica","Desafios avançados"]},
  {id:"geral", name:"Conhecimentos gerais", icon:"✦", desc:"Um pouco de tudo", levels:["Ciência","Tecnologia","Cultura","Meio ambiente","Sociedade","Atualidades","Raciocínio","Lógica","Desafios","Desafio final"]}
];

const questions = {
  "matematica": [
    [{q:"Quanto é 7 + 5?",a:["10","11","12","13"],c:2},{q:"Quanto é 14 + 8?",a:["20","21","22","24"],c:2},{q:"Quanto é 25 + 17?",a:["40","41","42","43"],c:2}],
    [{q:"Quanto é 18 - 7?",a:["9","10","11","12"],c:2},{q:"Quanto é 30 - 14?",a:["14","15","16","18"],c:2},{q:"Quanto é 52 - 28?",a:["22","23","24","25"],c:2}],
    [{q:"Quanto é 6 × 7?",a:["36","40","42","48"],c:2},{q:"Quanto é 9 × 8?",a:["64","72","81","90"],c:1},{q:"Quanto é 12 × 5?",a:["50","55","60","65"],c:2}],
    [{q:"Quanto é 36 ÷ 6?",a:["5","6","7","8"],c:1},{q:"Quanto é 81 ÷ 9?",a:["7","8","9","10"],c:2},{q:"Quanto é 100 ÷ 4?",a:["20","25","30","40"],c:1}],
    [{q:"Qual fração representa metade?",a:["1/3","1/2","2/3","3/4"],c:1},{q:"Quanto é 1/4 + 1/4?",a:["1/8","1/3","1/2","1"],c:2},{q:"Qual é maior?",a:["1/5","1/4","1/6","1/8"],c:1}],
    [{q:"Quanto é 2³?",a:["4","6","8","9"],c:2},{q:"Quanto é 5²?",a:["10","15","20","25"],c:3},{q:"Quanto é 10²?",a:["20","50","100","1000"],c:2}],
    [{q:"Qual é a raiz quadrada de 49?",a:["6","7","8","9"],c:1},{q:"Qual é a raiz quadrada de 81?",a:["7","8","9","10"],c:2},{q:"Qual é a raiz quadrada de 144?",a:["10","11","12","14"],c:2}]
  ],
  "portugues":[
    [{q:"Qual palavra é um verbo?",a:["casa","correr","azul","alegria"],c:1},{q:"Em “Maria estudou”, qual é o verbo?",a:["Maria","estudou","o","—"],c:1},{q:"Qual palavra indica uma ação?",a:["pular","mesa","bonito","escola"],c:0}],
    [{q:"Qual é um substantivo?",a:["rápido","cantar","cidade","feliz"],c:2},{q:"Em “o livro”, qual é o substantivo?",a:["o","livro","ambos","nenhum"],c:1},{q:"Qual é um nome de lugar?",a:["Brasil","correr","azul","ontem"],c:0}]
  ]
};

function genericQuestions(subjectIndex, levelIndex){
  const s = subjects[subjectIndex];
  const topic = s.levels[levelIndex];
  return [
    {q:`Qual alternativa está mais relacionada a "${topic}"?`,a:[topic, "Um conteúdo sem relação", "Uma operação matemática", "Uma cor"],c:0},
    {q:`O estudo de "${topic}" faz parte de qual área?`,a:[s.name,"Educação física","Música","Nenhuma"],c:0},
    {q:`Você concluiu uma atividade de "${topic}". O que recebe?`,a:["XP","Uma penalidade","Nada","Um anúncio"],c:0}
  ];
}

let state = JSON.parse(localStorage.getItem("apj_state") || '{"xp":0,"completed":0}');
let currentSubject = null, currentLevel = 0, currentQuestions = [], qIndex = 0, selected = null, questionAnswered = false;

const $ = id => document.getElementById(id);
const subjectGrid = $("subjectGrid");

function save(){localStorage.setItem("apj_state",JSON.stringify(state)); updateUI();}
function updateUI(){
  $("headerXp").textContent = state.xp;
  $("heroXp").textContent = `${state.xp} XP`;
  const level = Math.floor(state.xp/100)+1, progress=state.xp%100;
  $("heroLevel").textContent = level;
  $("heroProgress").style.width = progress+"%";
  $("heroNext").textContent = `${100-progress || 100} XP para o próximo nível`;
  renderRanking();
}
function renderSubjects(){
  subjectGrid.innerHTML = subjects.map((s,i)=>`
    <article class="subject-card" onclick="openLevels(${i})">
      <div class="subject-icon">${s.icon}</div>
      <h3>${s.name}</h3><p>${s.desc}</p><span class="arrow">→</span>
    </article>`).join("");
}
function renderRanking(){
  const base=[["Você",state.xp],["Jogador 02",850],["Jogador 03",720],["Jogador 04",610],["Jogador 05",480]];
  base.sort((a,b)=>b[1]-a[1]);
  $("rankingList").innerHTML=base.map((r,i)=>`<div class="rank-row"><span>${i+1}</span><span class="rank-name">${r[0]}</span><span class="rank-xp">${r[1]} XP</span></div>`).join("");
}
function openLevels(i){
  currentSubject=i;
  const s=subjects[i];
  $("levelsSubject").textContent=s.name.toUpperCase();
  $("levelsTitle").textContent="Escolha um nível";
  $("levelsGrid").innerHTML=s.levels.map((name,j)=>`
    <button class="level-btn" onclick="startQuiz(${i},${j})">
      <strong>Nível ${j+1}</strong><span>${name} • 3 perguntas</span>
    </button>`).join("");
  $("levelsModal").classList.remove("hidden");
}
function startQuiz(si,li){
  currentSubject=si; currentLevel=li; qIndex=0; selected=null;
  const custom=questions[subjects[si].id]?.[li];
  currentQuestions=custom || genericQuestions(si,li);
  $("levelsModal").classList.add("hidden");
  $("quizModal").classList.remove("hidden");
  $("quizSubject").textContent=subjects[si].name.toUpperCase();
  $("quizTitle").textContent=`Nível ${li+1} — ${subjects[si].levels[li]}`;
  renderQuestion();
}
function renderQuestion(){
  const q=currentQuestions[qIndex]; selected=null; questionAnswered=false;
  $("questionCount").textContent=`Pergunta ${qIndex+1} de ${currentQuestions.length}`;
  $("questionText").textContent=q.q;
  $("answers").innerHTML=q.a.map((a,i)=>`<button class="answer" onclick="selectAnswer(${i})">${a}</button>`).join("");
  $("nextQuestion").disabled=true;$("nextQuestion").textContent=qIndex===currentQuestions.length-1?"Concluir":"Responder";
  $("quizFeedback").textContent="";$("quizFeedback").className="feedback";
  $("quizXp").textContent=Math.round(30/currentQuestions.length);
}
function selectAnswer(i){
  if(questionAnswered)return;
  selected=i;
  document.querySelectorAll(".answer").forEach((b,n)=>b.classList.toggle("selected",n===i));
  $("nextQuestion").disabled=false;
  $("quizFeedback").textContent="Alternativa selecionada. Clique em Responder!";
  $("quizFeedback").className="feedback hint";
}

function handleNextQuestion(){
  if(selected===null || questionAnswered)return;
  const q=currentQuestions[qIndex];
  questionAnswered=true;
  document.querySelectorAll(".answer").forEach((b,n)=>{b.disabled=true;if(n===q.c)b.classList.add("correct");if(n===selected&&n!==q.c)b.classList.add("wrong")});
  const ok=selected===q.c;
  if(ok){
    state.xp+=10;
    state.correct=(state.correct||0)+1;
    save();
    $("quizFeedback").textContent="Resposta correta! +10 XP 🚀";
    $("quizFeedback").className="feedback ok";
    showToast("+10 XP! XP salvo com sucesso!");
  }else{
    $("quizFeedback").textContent="Essa não. A resposta correta está destacada.";
    $("quizFeedback").className="feedback bad";
  }
  $("nextQuestion").textContent=qIndex===currentQuestions.length-1?"Concluir":"Próxima pergunta";
}

$("nextQuestion").onclick=()=>{
  if(!questionAnswered){handleNextQuestion();return;}
  if(qIndex<currentQuestions.length-1){qIndex++;renderQuestion();}
  else{state.completed++;save();closeQuiz();showToast("Missão concluída! XP atualizado 🎉");}
};

function closeQuiz(){
  $("quizModal").classList.add("hidden");
  selected=null;
  questionAnswered=false;
}
$("closeLevels").onclick=()=>$("levelsModal").classList.add("hidden");
$("closeQuiz").onclick=closeQuiz;
[$("levelsModal"),$("quizModal")].forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.add("hidden")}));
function showToast(t){const el=$("toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200)}
renderSubjects();updateUI();
