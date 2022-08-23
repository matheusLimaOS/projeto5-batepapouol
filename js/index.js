let nome;

function telaLogin(){
    let container = document.querySelector('.container');
    let img = document.createElement('img');
    let form = document.createElement('form');
    let input = document.createElement('input');
    let botao = document.createElement('button');

    img.setAttribute('src','./img/logo 2.png');
    form.setAttribute('onSubmit','(e)=>{e.preventDefault(); onSubmit(this)}');

    botao.innerHTML = 'Entrar';
    botao.setAttribute('type','submit');

    input.setAttribute('placeholder','Digite seu nome');
    input.setAttribute('type','text');
    form.appendChild(input);
    form.appendChild(botao);

    form.addEventListener('submit', function(e){
        e.preventDefault();
        onSubmit(this);
    })

    container.classList.add('telaLogin');
    container.appendChild(img);
    container.appendChild(form);
}

async function onSubmit(form){
    nome = form.children[0].value;
    let obj = {
        name : nome
    }

    try{
        let res = await axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",obj);
        
        if(res.status === 200){
            apagaContainer();
            telaConversa();
        }

    }
    catch(e){
        mensagemErro('Esse nome não está disponivel! Por favor insira outro.');
    }

}

function apagaContainer(){
    let container = document.querySelector('container');
    let tam = container.children.length;
    let i=0;

    for(i=0;i<tam;i++){
        container.children[0].remove();
    }

}

function mensagemErro(msg){
    let container = document.querySelector('container');
    let tagP = document.createElement('p');

    tagP.innerHTML = msg;
    tagP.classList.add('erro');
    container.appendChild(tagP);
}
function telaConversa(){
    let container = document.querySelector('container');
    container.classList.remove('telaLogin');
    container.classList.add('telaMensagens');

    criaHeader();
    criaFooter();

    try{
        getMensagens();
    }
    catch(e){
        apagaContainer();
        telaLogin();
        mensagemErro("Usuário desconectado. Por favor refaça o login");
    }
}
async function getMensagens(){
    let res = await axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    apagaContainer();
    addMensagens(res);
}
function criaHeader(){
    let header = document.querySelector('.header');
    let img = document.createElement('img');
    let ionIcon = document.createElement('ion-icon');

    img.setAttribute('src','./img/logo 1.png');
    ionIcon.setAttribute('name','people');

    header.appendChild(img);
    header.appendChild(ionIcon);

    header.classList.remove('displayNone');
}

function criaFooter(){
    let footer = document.querySelector('.footer');
    let input = document.createElement('input');
    let ionIcon = document.createElement('ion-icon');

    input.setAttribute('placeholder','Escreva aqui...');
    input.setAttribute('type','text');
    ionIcon.setAttribute('name','paper-plane-outline');

    footer.appendChild(input);
    footer.appendChild(ionIcon);

    footer.classList.remove('displayNone');
}

function addMensagens(res){
    console.log(res);
    let container = document.querySelector('.container');
    let div = document.createElement('div');
    let div2 = document.createElement('div');

    div.classList.add('px');
    div2.classList.add('px');
    container.appendChild(div);

    let i=0;

    for(i=0;i<res.data.length;i++){
        let mensagem = document.createElement('div');
        let time = document.createElement('p');
        let remetente = document.createElement('p');
        let destinatario = document.createElement('p');
        let texto = document.createElement('p');
        let text = document.createElement('ṕ');

        time.classList.add('time');
        time.innerHTML = `(${res.data[i].time})`;

        mensagem.appendChild(time);

        mensagem.classList.add('mensagem');
        mensagem.classList.add(res.data[i].type);
        
        destinatario.classList.add('bold');
        destinatario.innerHTML = res.data[i].to;

        remetente.classList.add('bold');
        remetente.innerHTML = res.data[i].from;

        texto.innerHTML = res.data[i].text

        if(res.data[i].type === 'status'){
            mensagem.appendChild(remetente);
            mensagem.appendChild(texto);
        }
        if(res.data[i].type === 'message'){
            if(res.data[i].to === 'Todos'){
                text.innerHTML = 'para';
                mensagem.appendChild(remetente);
                mensagem.appendChild(text);
                destinatario.innerHTML += ':';
                mensagem.appendChild(destinatario);
                mensagem.appendChild(texto);
            }
        }

        if(res.data[i].type === "private_message"){
            console.log('entrei mamãe')
            if(res.data[i].to === 'Todos' || res.data[i].to === nome){
                text.innerHTML = 'reservadamente para';
                mensagem.appendChild(remetente);
                mensagem.appendChild(text);
                destinatario.innerHTML += ':';
                mensagem.appendChild(destinatario);
                mensagem.appendChild(texto);
            }
            else{
                continue;
            }
        }

        container.appendChild(mensagem);
    }

    container.appendChild(div2);
}

telaLogin();