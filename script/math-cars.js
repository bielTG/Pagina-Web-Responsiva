var cores = new Array("red","black","yellow","pink","green","blue")
var operadores = new Array('+','-','/','*');
iniciado = false; //Indica se o jogo já foi iniciado
stop = true; //Variável de controle dos carros, true = carros não andam, false = carros em movimento
var nivel = 0;
var topCarro1 = 70;
var topCarro2 = 70;
var dificuldade = 7000; //Tempo em milissegundos do movimento do carro adversário 
var intervalo = null;
var posicaoAnterior =  1;
var anterior = cores[posicaoAnterior]; //Variavel que define cor do carro selecionado
var avisosNaTela = true;

function play(){
  if(avisosNaTela){
      stop = false;
      escondeAvisos();
      atualizaConta();
      novoNivel();
      if(!iniciado){
          corAleatoriaAdversario();
          movimentoAdversario();
          iniciado = true;
      }
  }
}

function pause(){
  if(!stop){
      stop = true;
      mostraAviso("4");
  } else{
      stop = false
      escondeAvisos(); 
  }
}

function atualizaConta(){
  //Atualiza input "nivel"
  document.getElementById("nivel").value = nivel;
  
  //Gera operador e números aleatórios
  document.getElementById("numero1").value = novosNumeros();
  document.getElementById("operador").value = novoOperador();
  document.getElementById("numero2").value = novosNumeros();

  var numero1 = document.getElementById("numero1").value;
  var numero2 = document.getElementById("numero2").value;

  if(document.getElementById("operador").value == '/'){
       //Quando a operação for divisão o primeiro numero deve ser divisível pelo segundo, que ainda deve ser diferente de 0
        while(((numero1 % numero2) != 0) || numero2 == 0){
          numero2 = novosNumeros();
        }
  }	
  else if(document.getElementById("operador").value == '-'){
      //Evita com que o resultado seja negativo
      while((numero1 - numero2) < 0){
          numero2 = novosNumeros();
      }
    }
    document.getElementById("numero2").value = numero2;
}

function setaCor(cor){
    //Volta o fundo do carro selecionado anteriormente
    document.getElementById(anterior).style.backgroundColor = "lightCoral"; 

    //Define o caminho, atribui a imagem do carro ao elemento e deixa a div "selecionada" mudando a cor do background
    caminho = 'url(imagens/' + cor + '.png)'
    document.getElementById("carro1").style.backgroundImage = caminho;
    document.getElementById(cor).style.backgroundColor = "brown"; 

    //Guarda o carro selecionado anteriormente
    anterior = cor;
}

function corAleatoriaAdversario(){
  var cor = ""
  // Gera um número inteiro aleatório para a cor
  min = Math.ceil(0);
  max = Math.floor(cores.length - 1);
  
  // Define a cor que será escolhida conforme o número gerado
  cor = cores[Math.floor(Math.random() * (max - min)) + min];
  
  //Define o caminho, atribui a imagem do carro ao elemento e deixa a div "selecionada" mudando a cor do background
  caminho = 'url(imagens/' + cor + '.png)'
  document.getElementById("carro2").style.backgroundImage = caminho;
  document.getElementById(cor).style.backgroundColor = "brown"; 
}
  

function novosNumeros() {
  //Gera e retorna um número aleatória de 0 a 10
  min = Math.ceil(0);
  max = Math.floor(11);
  return Math.floor(Math.random() * (max - min)) + min;
}

function novoOperador(){
    //Gera um numero aleatório de 0 a 3 que servirá de indicador para uma das posições do Array "operadores"
  min = Math.ceil(0);
  max = Math.floor(4);
  posicao = Math.floor(Math.random() * (max - min)) + min;
  return operadores[posicao];
}

function enviaResposta(){
    if(!stop){
         verificaResposta();
      document.getElementById("form").reset();
      atualizaConta();
  }
}

function verificaResposta(){
    //Pega valores atuais dos inputs
  var operador = document.getElementById("operador").value;
  var numero1 = parseInt(document.getElementById("numero1").value);
  var numero2 = parseInt(document.getElementById("numero2").value);
  var resposta = document.getElementById("resposta").value;
  
  //Verifica o operador e qual operação deve ser feita
  if(operador == '+'){
    resultado = numero1 + numero2;
  }
  else if(operador == '-'){
    resultado = numero1 - numero2;
  }
  else if(operador == '/'){
      resultado = numero1 / numero2;
  }
  else{
    resultado = numero1 * numero2;
  }

  //Verifica se a resposta dada está correta
  if(resultado == resposta && resposta != ''){
    movimentaCarro1();
  }

  else{
    //Caso incorreta e o carro não esteja na posição inicial, ele voltará uma posição
    if(topCarro1 < 70){
      topCarro1 = topCarro1 + 5;
      document.getElementById("carro1").style.top = topCarro1 + 5 + "%";
    }
  }
}

function tecladoPressionado(event) {
    //Foca o input de resposta e permite a escrita nele
    document.getElementById("resposta").focus();
    document.getElementById("resposta").readOnly = false;
  
  // 13 == TECLA ENTER
  if (event.keyCode == 13) {
        escondeTelaInicial();
        enviaResposta();
        //Prevenção de que o formulário não será enviado
      event.preventDefault();
  }

  // 32 == TECLA ESPAÇO
  else if(event.keyCode == 32){
      //Verifica se o usuário já passou pela tela inicial
      play();
      event.preventDefault();
  }

  // 112 == TECLA P 
  else if (event.keyCode == 80){
      pause();
  }

  // 37 == SETA ESQUERDA
  else if (event.keyCode == 37){
    if(avisosNaTela){
      //SELECIONAR CARRO COM A SETA ESQUERDA
      if(posicaoAnterior > 0){
        posicaoAnterior = posicaoAnterior - 1;
        setaCor(cores[posicaoAnterior]);
      } 
      else {
        posicaoAnterior = 5;
        setaCor(cores[posicaoAnterior]);
      }
    }
    event.preventDefault();
  }

  // 39 == SETA DIREITA
  else if (event.keyCode == 39){
    if(avisosNaTela){
      //SELECIONAR CARRO COM A SETA DIREITA
      if(posicaoAnterior < 5){
        posicaoAnterior = posicaoAnterior + 1;
        setaCor(cores[posicaoAnterior]);
      } 
      else {
        posicaoAnterior = 0;
        setaCor(cores[posicaoAnterior]);
      }
    }
    event.preventDefault();
  }

  // 8 == backspace
  else if(event.keyCode == 8){
      document.getElementById("resposta").value = '';
      event.preventDefault;
  }
}

function setaNumero(numero){
  var resposta = document.getElementById("resposta").value; 
  resposta = resposta + numero; 
  document.getElementById("resposta").value = resposta;
}

function movimentoAdversario() {
    //Movimenta o carro adversário caso não esteja na chegada e reinicia jogo caso ele chegue
  intervalo = setInterval(function(){
    if(topCarro2 >= -20 && !stop){
        //alert(dificuldade);
      topCarro2 = topCarro2 - 5;
      document.getElementById("carro2").style.top = topCarro2 + "%";
    }
    else{
      if(!stop){
        //Reseta todo o jogo caso o adversário vença
        mostraAviso("3");
        voltaCarros();
        document.getElementsByClassName("carros").style.display = "block";
        dificuldade = 7000;
        clearInterval(intervalo);
        movimentoAdversario();
        stop = true;
      }
    }
  }, dificuldade); //Variável que indica o intervalo de cada movimento do adversário
}

function novoNivel() {
  //Atualiza input de nível
  nivel = nivel + 1;
  document.getElementById("nivel").value = nivel;

  //Atualiza dificuldade(tempo de movimento adversário) 
  dificuldade = dificuldade * 0.8;
  clearInterval(intervalo);
  movimentoAdversario();
  corAleatoriaAdversario();
}

function movimentaCarro1(){
    //Se o carro não estiver na chegada, sobe uma posição (5 pixels)
  if(topCarro1 > -20){
    topCarro1 = topCarro1 - 5;
    document.getElementById("carro1").style.top = topCarro1 + "%";
  }
  //Quando o carro estiver chegando ao destino 
  else { 
    topCarro1 = topCarro1 - 5;
    document.getElementById("carro1").style.top = topCarro1 + "%";
    voltaCarros();
    mostraAviso("2");
    stop = true;
  }
}
function mostraAviso(numeroDoAviso){
    avisosNaTela = true;
  document.getElementById("aviso"+numeroDoAviso).style.display = "block";
}
function escondeAvisos(){
    if(avisosNaTela){
      quantidadeDeAvisos = 4;
      //Esconde todos os avisos em uma chamada da função
      document.getElementById("cores").style.display = "none";
      for(i=1;i<=quantidadeDeAvisos;i++){
        document.getElementById("aviso"+i).style.display = "none";
      }
      avisosNaTela = false;
  }
}
function escondeTelaInicial(){
    //Deixa as imagens iniciais invíveis os demais elementos visíveis (não estavam visíveis para um melhor carregamento da página, pois o fundo é carregado com um certo delay)
    if(document.getElementById("inicio").style.display != "none"){
        document.getElementById("inicio").style.display = "none";
        document.getElementById("jogo").style.display = "block";
    }
}
function voltaCarros(){
    //Volta as variáveis e os elementos utilizados para o "top" inicial
  topCarro1 = 70;
  topCarro2 = 70;
  document.getElementById("carro1").style.top = topCarro1 + "%";
  document.getElementById("carro2").style.top = topCarro2 + "%";
  document.getElementById("resposta").readOnly = true;
}