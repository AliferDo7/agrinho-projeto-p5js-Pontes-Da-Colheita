// ------------------ Seu código original ------------------

let clouds = [];
let flowers = [];
let button;

let fadeOpacity = 0;
let fadingOut = false;

let parrotX, parrotYBase, parrotY, parrotTargetX, parrotSpeed;
let wingFlapTimer, wingFlapInterval, wingFlapState;

let dialogIndex = 0;
let currentDialogs = [];
let screen = 0; // 0 = inicial, 1 = floresta, 3 = cidade

let showingQuest = false;
let questAnswered = false;

let showGameMenu = false;
let gameChoice = 0;
let gameStarted = false;

// Falas da floresta
// Falas da floresta
const dialogsPage1 = [
  "Olá pessoal, me chamo Louro! Tudo bem com vocês?",
  "Hoje vou falar sobre as abelhas e a importância delas para a natureza.",
  "Tenho uma amiga abelhinha chamada Mel que é super legal, vocês deveriam conhecê-la!",
  "As abelhas são essenciais para a polinização e o equilíbrio ambiental.",
  "Elas comunicam-se dançando para indicar onde encontrar flores!",
  "Sem as abelhas, muitas espécies de plantas simplesmente deixariam de existir.",
  "Cerca de 75% dos alimentos que consumimos dependem da polinização feita por elas.",
  "Elas também ajudam a manter a biodiversidade dos ecossistemas ao redor do mundo."
];


// Após "Sim"
const afterSim = [
  "Que bom! Fico feliz que você entendeu!",
  "Ok, agora que você sabe sobre as abelhas, vamos para a cidade!"
];

// Após "Não"
const afterNao = [
  "Você não entendeu? Sem problemas! explicarei de novo!",
  "De forma resumida: As abelhas polinizam as flores e ajudam no crescimento de frutas e legumes!",
  "Elas são responsáveis por levar o pólen de uma flor para outra, ajudando as plantas.",
  "Sem abelhas, muitas plantas e alimentos que gostamos simplesmente não existiriam!",
  "Além disso, a polinização feita pelas abelhas contribui para o equilíbrio dos ecossistemas.",
  "Ok, agora que você sabe sobre as abelhas, vamos para a cidade!"
];

// Falas da cidade
const dialogsPage3 = [
  "Chegamos à cidade, que lugar bonito, não é?",
  "Aqui aproveitamos os recursos do campo e usamos energia de fontes renováveis.",
  "Os painéis solares são incríveis! Eles transformam a luz do sol em energia para nossas casas!",
  "Eles reduzem a emissão de carbono e protegem o meio ambiente também!",
 
];

function setup() {
  createCanvas(900, 600);
  textFont('Georgia');
  textStyle(ITALIC);
  textAlign(CENTER, CENTER);

  // inicializa nuvens e flores
  for (let i = 0; i < 6; i++) clouds.push(new Cloud(random(width), random(50,200), random(0.5,1.5)));
  for (let i = 0; i < 30; i++) flowers.push(new Flower(random(width), random(450,height-10)));

  // parrot
  parrotX = -150;
  parrotYBase = 350;
  parrotY = parrotYBase;
  parrotTargetX = 400;
  parrotSpeed = 2;
  wingFlapTimer = millis();
  wingFlapInterval = 500;
  wingFlapState = 0;

  // botão inicial
  button = createButton('Começar');
  styleButton(button);
  button.mousePressed(() => fadingOut = true);

  currentDialogs = dialogsPage1;
}


function draw() {
  background(135, 206, 235);
  drawClouds();

  if (gameStarted) {
    if (gameChoice === 1) {
      gameColheitaRapida();
    } else if (gameChoice === 2) {
      gameAbelhaSaltitante();
    }
    return; // não desenha mais nada do jogo original enquanto o jogo rodar
  }

  if (screen === 0) {
    drawMountains();
    drawSun();
    drawFlowers();
    drawGrass();
    drawTitle();
    button.show();
    handleFadeTo(1);
  }
  else if (screen === 1) {
    drawMountains();
    drawSun();
    drawFlowers();
    drawGrass();
    animateParrot(0.7);
    handleForestScreen();
    handleFadeTo(3);
  }
  else if (screen === 3) {
    drawCityBackground();
    animateParrot(0.5);
    handleCityScreen();

    // Depois da última fala, mostrar menu de jogos
    if (dialogIndex === currentDialogs.length - 1 && !showingQuest && questAnswered === false) {
      showGameMenu = true;
    }
  }

  // Se for pra mostrar menu de jogos
  if (showGameMenu) {
    drawGameMenu();
  }
}

function handleFadeTo(target) {
  if (!fadingOut) return;
  fadeOpacity += 5;
  fill(0, fadeOpacity);
  rect(0,0,width,height);
  if (fadeOpacity >= 255) {
    fadeOpacity = 0;
    fadingOut = false;
    screen = target;
    dialogIndex = 0;
    showingQuest = false;
    questAnswered = false;
    button.hide();
    if (target === 1) currentDialogs = dialogsPage1;
    if (target === 3) currentDialogs = dialogsPage3;
  }
}

function animateParrot(scaleF) {
  if (parrotX < parrotTargetX) parrotX += parrotSpeed;
  parrotY = parrotYBase + 10*sin(frameCount*0.05);
  if (millis() - wingFlapTimer > wingFlapInterval) {
    wingFlapState = (wingFlapState+1)%2;
    wingFlapTimer = millis();
  }
  drawParrot(parrotX, parrotY, scaleF);
}

function handleForestScreen() {
  if (parrotX < parrotTargetX) return;

  if (!showingQuest && !questAnswered) {
    if (dialogIndex < currentDialogs.length - 1) {
      drawDialogBalloon(parrotX,parrotY);
      drawPressSpace();
    } else {
      showingQuest = true;
    }
  }
  else if (showingQuest && !questAnswered) {
    drawQuest();
  }
  else if (questAnswered) {
    if (dialogIndex < currentDialogs.length) {
      drawDialogBalloon(parrotX,parrotY);
      drawPressSpace();
    }
  }
}

function handleCityScreen() {
  if (showGameMenu) return; // para o diálogo normal não mostrar com menu

  if (dialogIndex < currentDialogs.length - 1) {
    drawDialogBalloon(parrotX,parrotY);
    drawPressSpace();
  }
}

function keyPressed() {
  if (gameStarted) {
    // Jogos responderão a suas próprias teclas
    if (gameChoice === 1) {
      gameColheitaRapidaKeyPressed();
    } else if (gameChoice === 2) {
      gameAbelhaSaltitanteKeyPressed();
    }
    return;
  }

  if ((screen===1||screen===3) && parrotX>=parrotTargetX && !fadingOut && key === ' ') {
    if (screen===1) {
      if (!showingQuest && dialogIndex < currentDialogs.length -1) dialogIndex++;
      else if (!showingQuest) showingQuest = true;
      else if (showingQuest && questAnswered && dialogIndex < currentDialogs.length) dialogIndex++;
      else if (showingQuest && questAnswered && dialogIndex >= currentDialogs.length) fadingOut = true;
    }
    else if (screen===3) {
      if (dialogIndex < currentDialogs.length -1) dialogIndex++;
      else if (dialogIndex === currentDialogs.length -1) {
        // Ao terminar última fala da cidade, ativa menu
        showGameMenu = true;
      }
    }
  }

  // Captura escolha do jogo após mostrar menu
  if (showGameMenu) {
    if (key === '1') {
      gameChoice = 1;
      gameStarted = true;
      showGameMenu = false;
      setupGameColheitaRapida();
    } else if (key === '2') {
      gameChoice = 2;
      gameStarted = true;
      showGameMenu = false;
      setupGameAbelhaSaltitante();
    }
  }
}

function mousePressed() {
  if (screen===1 && showingQuest && !questAnswered) {
    let x = width/2-300, y = height-180;
    if (mouseX > x+120 && mouseX < x+240 && mouseY > y+90 && mouseY < y+130) {
      questAnswered = true;
      currentDialogs = afterSim;
      dialogIndex=0;
    }
    if (mouseX > x+360 && mouseX < x+480 && mouseY > y+90 && mouseY < y+130) {
      questAnswered = true;
      currentDialogs = afterNao;
      dialogIndex=0;
    }
  }
}

// ——— Desenhos auxiliares ———

function drawPressSpace() {
  push();
  textSize(18);
  fill(50,40,10,180);
  textStyle(ITALIC);
  textAlign(CENTER,BOTTOM);
  text('Pressione ESPAÇO para avançar →', width/2, height-40);
  pop();
}

function drawQuest() {
  let x=width/2-300, y=height-180;
  fill(255,255,240,230); stroke(100,70,30); strokeWeight(3);
  rect(x,y,600,150,30);
  noStroke(); fill(60,30,10);
  textSize(24); textAlign(CENTER,CENTER);
  text("Você entendeu a importância das abelhas?", width/2, y+50);
  fill(200,255,200); rect(x+120,y+90,120,40,15); fill(0); text("Sim",x+180,y+110);
  fill(255,200,200); rect(x+360,y+90,120,40,15); fill(0); text("Não",x+420,y+110);
}

function drawCityBackground() {
  background(180,220,255);
  drawClouds();
  noStroke();
  fill(200); rect(50,300,100,300,10);
  fill(160); rect(180,250,80,350,8);
  fill(180); rect(300,330,120,270,12);
  fill(140); rect(450,280,100,320,6);
  fill(170); rect(580,310,90,290,5);
  fill(120); rect(700,260,130,340,10);
  fill(255,223,0,200); ellipse(100,100,100,100);
}

function drawDialogBalloon(x,y) {
  const w=370,h=130,p=20;
  push();
  translate(x+80,y-110);
  fill(255,255,240,240); stroke(100,70,30); strokeWeight(3);
  rect(0,0,w,h,25);
  noStroke(); triangle(0,h/2-15,-25,h/2,0,h/2+15);
  fill(50,30,10); textSize(20); textAlign(LEFT,TOP);
  text(currentDialogs[dialogIndex],p,p,w-2*p,h-2*p);
  pop();
}

function drawSun() {
  let p=sin(frameCount*0.02)*10;
  fill(255,223,0,200); noStroke();
  ellipse(100,100,100+p,100+p);
}

function drawMountains() {
  noStroke(); fill(100,150,100);
  beginShape(); vertex(0,300); vertex(150,250); vertex(300,310);
  vertex(450,230); vertex(600,310); vertex(750,240); vertex(900,300);
  vertex(900,600); vertex(0,600);
  endShape(CLOSE);
  fill(80,130,80);
  beginShape(); vertex(0,370); vertex(200,300); vertex(400,370);
  vertex(600,280); vertex(800,360); vertex(900,300); vertex(900,600);
  vertex(0,600);
  endShape(CLOSE);
}

function drawFlowers() { for (let f of flowers) f.display(); }

function drawClouds() { for (let c of clouds) c.move(), c.display(); }

function drawGrass() {
  noStroke(); fill(120,200,100); rect(0,450,width,150);
  fill(100,180,90); rect(0,500,width,100);
}

function drawTitle() {
  fill('#fffbe0'); stroke(80,50,20,180); strokeWeight(7);
  textSize(64); text('Pontes da Colheita', width/2, height/2-60);
}  

function styleButton(btn){
  btn.position(width/2-70,height/2+100);
  btn.size(140,60);
  btn.style('font-size','24px');
  btn.style('font-family','Georgia, serif');
  btn.style('font-weight','bold');
  btn.style('color','#5e412f');
  btn.style('background','linear-gradient(45deg,#ffda9e,#ffd27f)');
  btn.style('border','3px solid #d6a75e');
  btn.style('border-radius','30px');
  btn.style('box-shadow','0 6px 12px rgba(0,0,0,0.25)');
  btn.style('cursor','pointer');
  btn.style('transition','all 0.3s ease');
  btn.mouseOver(()=>btn.style('background','linear-gradient(45deg,#ffd27f,#ffda9e)'));
  btn.mouseOut(()=>btn.style('background','linear-gradient(45deg,#ffda9e,#ffd27f)'));
}

// Parrot drawing inspired by Duolingo mascot
function drawParrot(x,y,s){
  push();
  translate(x,y);
  scale(s);
  // Body
  fill('#00a86b'); stroke(0); strokeWeight(1.5);
  ellipse(0,0,120,90);
  // Head
  ellipse(40,-40,70,70);
  // Eye
  fill(255); ellipse(55,-45,20,20);
  fill(0); ellipse(55,-45,10,10);
  // Beak
  fill('#f7b733');
  triangle(75,-35,90,-25,75,-15);
  // Wing flapping
  fill('#007a4d');
  if (wingFlapState === 0) ellipse(-30,10,50,80);
  else ellipse(-30,20,50,50);
  pop();
}

// Classes

class Cloud {
  constructor(x,y,s) {
    this.x=x; this.y=y; this.s=s; this.speed=0.3*this.s;
  }
  move(){
    this.x+=this.speed;
    if(this.x>width+60) this.x=-60;
  }
  display(){
    noStroke();
    fill(255,255,255,230);
    ellipse(this.x,this.y,60*this.s,40*this.s);
    ellipse(this.x+20,this.y+10,50*this.s,30*this.s);
    ellipse(this.x-20,this.y+10,50*this.s,30*this.s);
  }
}

class Flower {
  constructor(x,y){
    this.x=x; this.y=y;
  }
  display(){
    push();
    translate(this.x,this.y);
    noStroke();
    fill('#d04c4c');
    ellipse(0,0,20,20);
    fill('#a32d2d');
    ellipse(0,0,14,14);
    stroke('#703232'); strokeWeight(2);
    line(0,10,0,30);
    pop();
  }
}

// ——— Aqui começa o menu do jogo ———

function drawGameMenu() {
  fill(255, 255, 230, 240);
  stroke(50,30,10); strokeWeight(4);
  rect(width/2-250, height/2-120, 500, 220, 25);
  noStroke();
  fill(40,20,10);
  textSize(28);
  textAlign(CENTER, TOP);
  text("Mas que tal um jogo para animar?", width/2, height/2 - 100);
  textSize(19);
  text("Pressione 1 para o Jogo Campo-Cidade: Colheita Rápida", width/2, 
  height/2 - 40);
 
    text("Jogo 2: Cidade Limpa em breve, aguarde! (Não clique)", width/2, height/2- -50);
  
}
// ——— Jogo 1: Campo-Cidade Colheita Rápida ———

let player1;
let items1 = [];
let itemSpeed1 = 4;
let score1 = 0;
let gameOver1 = false;

let moveLeft = false;
let moveRight = false;

let game1StartTime;
let showInstructions1 = false;
let instructionsShown1 = false;
let gameOverDueToTime = false;

let showingCredits = false;

const fruitEmojis = ['🍎', '🍌', '🍇', '🍓', '🍍', '🥭'];

function setupGameColheitaRapida() {
  player1 = {
    x: width / 2,
    y: height - 80,
    size: 60,
    speed: 7,
  };
  items1 = [];
  score1 = 0;
  gameOver1 = false;
  moveLeft = false;
  moveRight = false;
  showInstructions1 = true;
  instructionsShown1 = false;
  gameOverDueToTime = false;
  showingCredits = false;
}

function gameColheitaRapida() {
  background(120, 200, 100); // fundo original
  drawMountains();
  drawSun();

  if (showingCredits) {
    drawCreditsScreen();
    return;
  }

  noStroke();
  fill(80, 150, 60);
  rect(0, height - 50, width, 50);

  if (showInstructions1 && !instructionsShown1) {
    fill(255, 255, 240, 240);
    stroke(60, 40, 20);
    strokeWeight(4);
    rect(width / 2 - 300, height / 2 - 140, 600, 240, 20);
    noStroke();
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(24);
    text(
      "INSTRUÇÕES\n\nUse A e D para mover e coletar as frutas!\nVocê tem 20 segundos para pegar 10 frutas.\nPressione ESPAÇO para começar!",
      width / 2,
      height / 2
    );
    return;
  }

   if (moveLeft) player1.x -= player1.speed;
  if (moveRight) player1.x += player1.speed;
  player1.x = constrain(player1.x, player1.size / 2, width - player1.size / 2);

  textStyle(NORMAL);
textAlign(CENTER, CENTER);
textSize(player1.size);
text('🧺', player1.x, player1.y + player1.size / 6);




  // frutas
  textAlign(CENTER, CENTER);
  textSize(28);
  if (frameCount % 30 === 0) {
    items1.push({
      x: random(40, width - 40),
      y: -20,
      size: 30,
      emoji: random(fruitEmojis),
    });
  }

  for (let i = items1.length - 1; i >= 0; i--) {
    let it = items1[i];
    it.y += itemSpeed1;
    text(it.emoji, it.x, it.y);

    let d = dist(player1.x, player1.y, it.x, it.y);
    if (d < player1.size / 2 + it.size / 2) {
      score1++;
      items1.splice(i, 1);
    } else if (it.y > height) {
      items1.splice(i, 1);
    }
  }

  let timeElapsed = (millis() - game1StartTime) / 1000;
  let timeLeft = max(0, 20 - floor(timeElapsed));
  fill(255);
  textSize(28);
  textAlign(LEFT, TOP);
  text("Tempo: " + timeLeft + "s", 20, 60);
  text("Frutas coletadas: " + score1, 20, 20);

  if (timeLeft <= 0 && score1 < 10) {
    gameOver1 = true;
    gameOverDueToTime = true;
  }

  if (score1 >= 10) {
    gameOver1 = true;
  }

  if (gameOver1) {
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);
    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    if (score1 >= 10) {
      text("Parabéns! Você venceu o jogo!", width / 2, height / 2 - 60);
      textSize(24);
      text("Pressione F para Créditos", width / 2, height / 2 - 15);
    } else {
   
      text("Tempo esgotado! Tente novamente!", width / 2, height / 2 - 20);
    text("Pressione F para Créditos", width / 2, height / 3 - 15);
    }
    textSize(22);
    text("Pressione ESPAÇO para continuar", width / 2, height / 2 + 40);
  }
}

function drawCreditsScreen() {
  background(255, 190, 120); // entardecer
  drawMountains();
  drawSun();
  fill(80, 150, 60);
  noStroke();
  rect(0, height - 50, width, 50);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(26);
  text("Agradeço pela atenção ao meu projeto,\nespero que tenham gostado,\nespero ver vocês no ano que vem no Agrinho 2026,\naté mais!", width / 2, height / 2 - 40);
  textSize(20);
  text("Pressione ESC para voltar ao menu de jogo.", width / 2, height / 2 + 80);
}

// ——— keyPressed atualizado ———
function keyPressed() {
  if (gameStarted && gameChoice === 1) {
    if (showingCredits) {
      if (keyCode === 27) { // ESC
        gameStarted = false;
        screen = 3;
        parrotX = -150;
        parrotTargetX = 400;
        dialogIndex = currentDialogs.length - 1;
        showingCredits = false;
      }
      return;
    }

    if (showInstructions1 && !instructionsShown1 && key === ' ') {
      instructionsShown1 = true;
      game1StartTime = millis();
      return;
    }

    if (!showInstructions1 || instructionsShown1) {
      if (key === 'a' || key === 'A') moveLeft = true;
      if (key === 'd' || key === 'D') moveRight = true;
    }

    if (gameOver1) {
      if (key === ' ') {
        gameStarted = false;
        screen = 3;
        parrotX = -150;
        parrotTargetX = 400;
        dialogIndex = currentDialogs.length - 1;
      }
      if (key === 'f' || key === 'F') {
        showingCredits = true;
      }
    }
    return;
  }

  if ((screen === 1 || screen === 3) && parrotX >= parrotTargetX && !fadingOut && key === ' ') {
    if (screen === 1) {
      if (!showingQuest && dialogIndex < currentDialogs.length - 1) dialogIndex++;
      else if (!showingQuest) showingQuest = true;
      else if (showingQuest && questAnswered && dialogIndex < currentDialogs.length) dialogIndex++;
      else if (showingQuest && questAnswered && dialogIndex >= currentDialogs.length) fadingOut = true;
    } else if (screen === 3) {
      if (dialogIndex < currentDialogs.length - 1) dialogIndex++;
      else if (dialogIndex === currentDialogs.length - 1) {
        showGameMenu = true;
      }
    }
  }

  if (showGameMenu) {
    if (key === '1') {
      gameChoice = 1;
      gameStarted = true;
      showGameMenu = false;
      setupGameColheitaRapida();
    } else if (key === '2') {
      gameChoice = 2;
      gameStarted = true;
      showGameMenu = false;
      setupGameAbelhaSaltitante();
    }
  }
}

// ——— keyReleased atualizado ———
function keyReleased() {
  if (key === 'a' || key === 'A') moveLeft = false;
  if (key === 'd' || key === 'D') moveRight = false;

  if (gameChoice === 1 && gameOver1 && key === ' ') {
    gameStarted = false;
    screen = 3;
    parrotX = -150;
    parrotTargetX = 400;
    dialogIndex = currentDialogs.length - 1;
    showingCredits = false;
  }
}
