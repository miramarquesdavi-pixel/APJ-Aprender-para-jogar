const S=[
['matematica','Matemática','∑','Do básico à matemática avançada',['Soma','Subtração','Multiplicação','Divisão','Frações','Potenciação','Raiz quadrada','Equações','Expressões','Desafios']],
['portugues','Português','Aa','Língua, gramática e interpretação',['Verbos','Substantivos','Adjetivos','Pontuação','Interpretação de texto','Figuras de linguagem','Gramática','Concordância','Produção de texto','Desafios']],
['geografia','Geografia','◎','Espaço, sociedade e planeta',['Cartografia','Relevo','Clima','Biomas','População','Urbanização','Economia','Geopolítica','Globalização','Desafios']],
['historia','História','⌛','Do mundo antigo à atualidade',['Antiguidade','Idade Média','Renascimento','Grandes navegações','Brasil Colonial','Revoluções','Brasil Império','República','Século XX','Mundo contemporâneo']],
['biologia','Biologia','◉','Vida, células e seres vivos',['Células','Genética','Evolução','Ecologia','Botânica','Zoologia','Corpo humano','Microbiologia','Biotecnologia','Desafios']],
['fisica','Física','ϟ','Movimento, energia e universo',['Grandezas físicas','Movimento','Forças','Energia','Calor','Ondas','Eletricidade','Magnetismo','Óptica','Desafios']],
['quimica','Química','⚗','Matéria e suas transformações',['Matéria','Átomos','Tabela periódica','Ligações químicas','Reações','Soluções','pH','Orgânica','Eletroquímica','Desafios']],
['geral','Conhecimentos gerais','✦','Um pouco de tudo',['Ciência','Tecnologia','Cultura','Meio ambiente','Sociedade','Atualidades','Raciocínio','Lógica','Desafios','Desafio final']]
];
const specific={
matematica:[
[['Quanto é 7 + 5?',['10','11','12','13'],2],['Quanto é 14 + 8?',['20','21','22','24'],2],['Quanto é 25 + 17?',['40','41','42','43'],2]],
[['Quanto é 18 - 7?',['9','10','11','12'],2],['Quanto é 30 - 14?',['14','15','16','18'],2],['Quanto é 52 - 28?',['22','23','24','25'],2]],
[['Quanto é 6 × 7?',['36','40','42','48'],2],['Quanto é 9 × 8?',['64','72','81','90'],1],['Quanto é 12 × 5?',['50','55','60','65'],2]],
[['Quanto é 36 ÷ 6?',['5','6','7','8'],1],['Quanto é 81 ÷ 9?',['7','8','9','10'],2],['Quanto é 100 ÷ 4?',['20','25','30','40'],1]],
[['Qual fração representa metade?',['1/3','1/2','2/3','3/4'],1],['Quanto é 1/4 + 1/4?',['1/8','1/3','1/2','1'],2],['Qual é maior?',['1/5','1/4','1/6','1/8'],1]],
[['Quanto é 2³?',['4','6','8','9'],2],['Quanto é 5²?',['10','15','20','25'],3],['Quanto é 10²?',['20','50','100','1000'],2]],
[['Qual é a raiz quadrada de 49?',['6','7','8','9'],1],['Qual é a raiz quadrada de 81?',['7','8','9','10'],2],['Qual é a raiz quadrada de 144?',['10','11','12','14'],2]]
],
portugues:[
[['Qual palavra é um verbo?',['casa','correr','azul','alegria'],1],['Em “Maria estudou”, qual é o verbo?',['Maria','estudou','o','nenhum'],1],['Qual palavra indica uma ação?',['pular','mesa','bonito','escola'],0]],
[['Qual é um substantivo?',['rápido','cantar','cidade','feliz'],2],['Em “o livro”, qual é o substantivo?',['o','livro','ambos','nenhum'],1],['Qual é um nome de lugar?',['Brasil','correr','azul','ontem'],0]]
]};

let state=JSON.parse(localStorage.getItem('apj_state_v3')||'{"xp":0,"completed":0,"history":[]}'),
    si=0,li=0,qs=[],qi=0,sel=null,answered=false;

state.history = Array.isArray(state.history) ? state.history : [];

const $=x=>document.getElementById(x);

function save(){
  localStorage.setItem('apj_state_v3',JSON.stringify(state));
  ui();
}

function ui(){
  $('headerXp').textContent=state.xp;
  $('heroXp').textContent=state.xp+' XP';
  let l=Math.floor(state.xp/100)+1,p=state.xp%100;
  $('heroLevel').textContent=l;
  $('heroProgress').style.width=p+'%';
  $('heroNext').textContent=(100-p)+' XP para o próximo nível';
  let r=[['Você',state.xp],['Jogador 02',850],['Jogador 03',720],['Jogador 04',610],['Jogador 05',480]]
    .sort((a,b)=>b[1]-a[1]);
  $('rankingList').innerHTML=r.map((x,i)=>`<div class="row"><span>${i+1}</span><b>${x[0]}</b><b class="rankxp">${x[1]} XP</b></div>`).join('');
}

function render(){
  $('subjectGrid').innerHTML=S.map((s,i)=>`<article class="subject" data-i="${i}">
    <div class="icon">${s[2]}</div><h3>${s[1]}</h3><p>${s[3]}</p><span class="arrow">→</span>
  </article>`).join('');
  document.querySelectorAll('.subject').forEach(x=>x.onclick=()=>levels(+x.dataset.i));
}

function levels(i){
  si=i;
  $('levelsSubject').textContent=S[i][1].toUpperCase();
  $('levelsGrid').innerHTML=S[i][4].map((x,j)=>`<button class="level" data-l="${j}">
    <b>Nível ${j+1}</b><span>${x} • 3 perguntas com IA</span>
  </button>`).join('');
  document.querySelectorAll('.level').forEach(x=>x.onclick=()=>start(si,+x.dataset.l));
  $('levelsModal').classList.remove('hidden');
}

function setQuizLoading(message='A IA está preparando seus desafios...'){
  $('quizSubject').textContent=S[si][1].toUpperCase();
  $('quizTitle').textContent=`Nível ${li+1} — ${S[si][4][li]}`;
  $('questionCount').textContent='';
  $('questionText').textContent=message;
  $('answers').innerHTML='<div class="ai-loading"><span>✦</span> Criando perguntas diferentes para você...</div>';
  $('nextQuestion').disabled=true;
  $('feedback').textContent='';
}

async function generateQuestions(){
  const key=`${S[si][0]}:${li}`;
  const previous=state.history.filter(x=>x.key===key).map(x=>x.question).slice(-15);

  const response=await fetch('/api/generate-question',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      subject:S[si][1],
      topic:S[si][4][li],
      level:li+1,
      previousQuestions:previous
    })
  });

  const data=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(data.error||'Falha ao gerar perguntas.');

  return (data.questions||[]).map(q=>[
    q.question,
    q.options,
    q.correctAnswer,
    q.explanation
  ]);
}

function fallbackQuestions(){
  return specific[S[si][0]]?.[li] || makeGeneric();
}

function makeGeneric(){
  let t=S[si][4][li],n=S[si][1];
  return [
    [`Qual alternativa está diretamente relacionada a "${t}"?`,[t,'Uma cor','Uma operação matemática','Nenhuma'],0,'A alternativa correta é a que representa diretamente o tema estudado.'],
    [`"${t}" pertence principalmente a qual área?`,[n,'Música','Esporte','Nenhuma'],0,`O tema faz parte principalmente da área de ${n}.`],
    [`Qual é uma boa forma de aprender mais sobre "${t}"?`,['Estudar exemplos e resolver exercícios','Ignorar o tema','Chutar todas as respostas','Não praticar'],0,'Praticar com exemplos e exercícios ajuda a compreender e fixar o conteúdo.']
  ];
}

async function start(i,l){
  si=i;li=l;qi=0;sel=null;answered=false;
  $('levelsModal').classList.add('hidden');
  $('quizModal').classList.remove('hidden');
  setQuizLoading();

  try{
    qs=await generateQuestions();
    if(qs.length!==3) throw new Error('Quantidade inválida de perguntas.');
  }catch(error){
    console.warn(error);
    qs=fallbackQuestions();
    $('feedback').textContent='Modo de segurança: usando perguntas locais enquanto a IA não responde.';
  }
  draw();
}

function draw(){
  let x=qs[qi];
  sel=null;answered=false;
  $('questionCount').textContent=`Pergunta ${qi+1} de ${qs.length}`;
  $('questionText').textContent=x[0];
  $('answers').innerHTML=x[1].map((a,i)=>`<button class="answer" data-a="${i}">${a}</button>`).join('');
  document.querySelectorAll('.answer').forEach(b=>b.onclick=()=>choose(+b.dataset.a));
  $('nextQuestion').disabled=true;
  $('nextQuestion').textContent='Responder';
  $('nextQuestion').onclick=check;
  if($('feedback').textContent.startsWith('Modo de segurança')) return;
  $('feedback').textContent='';
}

function choose(i){
  if(answered)return;
  sel=i;
  document.querySelectorAll('.answer').forEach((b,n)=>b.classList.toggle('selected',n===i));
  $('nextQuestion').disabled=false;
}

function check(){
  if(sel===null||answered)return;
  answered=true;
  let x=qs[qi],ok=sel===x[2];

  document.querySelectorAll('.answer').forEach((b,n)=>{
    b.disabled=true;
    if(n===x[2])b.classList.add('correct');
    if(n===sel&&!ok)b.classList.add('wrong');
  });

  if(ok){
    state.xp+=10;
    save();
    $('feedback').innerHTML=`<b>Resposta correta! +10 XP</b><br>${x[3]||''}`;
  }else{
    $('feedback').innerHTML=`<b>Vamos aprender com essa!</b><br>${x[3]||'A resposta correta está destacada.'}`;
  }

  // Guarda a pergunta para reduzir repetições em sessões futuras.
  const key=`${S[si][0]}:${li}`;
  if(!state.history.some(h=>h.key===key && h.question===x[0])){
    state.history.push({key,question:x[0]});
    if(state.history.length>80) state.history=state.history.slice(-80);
    localStorage.setItem('apj_state_v3',JSON.stringify(state));
  }

  $('nextQuestion').textContent=qi===qs.length-1?'Concluir':'Próxima pergunta';
  $('nextQuestion').onclick=next;
}

function next(){
  if(qi<qs.length-1){
    qi++;
    draw();
  }else{
    state.completed++;
    save();
    closeQuiz();
    toast('Atividade concluída! Seu XP foi atualizado.');
  }
}

function closeQuiz(){
  $('quizModal').classList.add('hidden');
}

function toast(t){
  let x=$('toast');
  x.textContent=t;
  x.classList.add('show');
  setTimeout(()=>x.classList.remove('show'),2200);
}

$('closeLevels').onclick=()=>$('levelsModal').classList.add('hidden');
$('closeQuiz').onclick=closeQuiz;

render();
ui();
