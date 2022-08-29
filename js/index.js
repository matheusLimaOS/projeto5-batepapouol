let nome;

function telaLogin(){
    let containerDiv = document.querySelector('container div');
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

    containerDiv.classList.add('telaLogin');
    containerDiv.appendChild(img);
    containerDiv.appendChild(form);
}

async function onSubmit(form){
    nome = form.children[0].value;
    let obj = {
        name : nome
    }

    let res = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",obj);

    res.then((data)=>{
        intervalPersistencia();
        apagaContainer();
        telaConversa();
    })
    res.catch(()=>{
        mensagemErro('Esse nome não está disponivel! Por favor insira outro.');
    })
    

}

function apagaContainer(){
    let containerDiv = document.querySelector('container div');
    let tam = containerDiv.children.length;
    let i=0;

    for(i=0;i<tam;i++){
        containerDiv.children[0].remove();
    }

}

function mensagemErro(msg){
    let container = document.querySelector('container');
    let tagP = document.createElement('p');

    tagP.innerHTML = msg;
    tagP.classList.add('erro');
    container.appendChild(tagP);
}
async function telaConversa(){
    let containerDiv = document.querySelector('container div');
    containerDiv.classList.remove('telaLogin');
    containerDiv.classList.add('telaMensagens');


    await criaHeader();
    await criaFooter();

    getMensagens();
    apagaContainer();

    let input = document.querySelector('footer input');
    input.addEventListener('keydown', function(e){
        if(e.keyCode === 13){
            let text = input.value;
            enviarMensagem('message',text,'Todos');
        }
    });
}
function getMensagens(){

    let res = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');

    res.then(async (data)=>{
        apagaContainer();
        await addMensagens(data);
    
        let ultimaMSG = document.querySelector(".telaMensagens div:last-child");
        ultimaMSG.scrollIntoView();
    })
    res.catch(()=>{
        alert("Erro ao carregar mensagens, você será redirecionado a pagina de login!");
        window.location.reload();
    })

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
    ionIcon.setAttribute('onClick','onClick()');

    footer.appendChild(input);
    footer.appendChild(ionIcon);

    footer.classList.remove('displayNone');
}
function onClick(){
    let input = document.querySelector('footer input');
    let text = input.value;
    enviarMensagem('message',text,'Todos');
}
function addMensagens(res){
    let container = document.querySelector('.telaMensagens');
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
}
function intervalPersistencia(){
    let obj = {
        name:nome
    }
    setInterval(()=>{
        let res = axios.post('https://mock-api.driven.com.br/api/v6/uol/status',obj);

        res.catch(()=>{
            alert("Você foi desconectado. Por favor refazer o login");
            window.location.reload();
        })
        
    },5000);
}

async function enviarMensagem(type,text,to){
    console.log('chamada');
    let obj =   {
        from: nome,
        to: to,
        text: text,
        type: type
    }

    let res = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages',obj);

    res.then((data)=>{
        apagaContainer();
        getMensagens();
    })
    res.catch(()=>{
        alert("Erro ao enviar a mensagem, você será redirecionado a pagina de login!");
        window.location.reload();
    })

}

telaLogin();