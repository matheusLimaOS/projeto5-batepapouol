let nome;
let destinatario = 'Todos';

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
        intervalMensagens()
    })
    res.catch(()=>{
        mensagemErro('Esse nome não está disponivel! Por favor insira outro.');
    })
    

}

function apagaContainer(){
    let containerDiv = document.querySelector('container div');
    containerDiv.innerHTML = '';
}

function mensagemErro(msg){
    let erro = document.querySelector('.erro');
    if(erro === null || erro === undefined){
        let container = document.querySelector('container');
        let tagP = document.createElement('p');
    
        tagP.innerHTML = msg;
        tagP.classList.add('erro');
        container.appendChild(tagP);
    }
    else{
        erro.classList.remove('displayNone');
        erro.innerHTML = msg;
    }

    setTimeout(()=>{
        let erro = document.querySelector('.erro');

        erro.classList.add('displayNone');
    },3000)
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
            enviarMensagem('message',text);
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
    enviarMensagem('message',text);
}
function addMensagens(res){
    let container = document.querySelector('.telaMensagens');
    let i=0;

    for(i=0;i<res.data.length;i++){
        if(res.data[i].type === 'status'){
            container.innerHTML += `
                <div class= 'mensagem ${res.data[i].type}'>
                    <p class = 'time'> (${res.data[i].time}) </p>
                    <p class = 'bold'> ${res.data[i].from} </p>
                    <p> ${res.data[i].text} </p>
                </div>
            `
        }
        else if(res.data[i].type === 'message'){
            if(res.data[i].to === 'Todos' || res.data[i].to === nome){
                container.innerHTML += `
                <div class= 'mensagem ${res.data[i].type}'>
                    <p class = 'time'> (${res.data[i].time}) </p>
                    <p class = 'bold'> ${res.data[i].from} </p>
                    <p> para </p>
                    <p class = 'bold'> ${res.data[i].to}: </p>
                    <p> ${res.data[i].text} </p>
                </div>
                `
            }
        }

        else if(res.data[i].type === "private_message"){
            if(res.data[i].to === 'Todos' || res.data[i].to === nome){
                container.innerHTML += `
                <div class= 'mensagem ${res.data[i].type}'>
                    <p class = 'time'> (${res.data[i].time}) </p>
                    <p class = 'bold'> ${res.data[i].from} </p>
                    <p> reservadamente para </p>
                    <p class = 'bold'> ${res.data[i].to}: </p>
                    <p> ${res.data[i].text} </p>
                </div>
                `
            }
        }
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

function intervalMensagens(){
    setInterval(()=>{
        getMensagens();
    },3000);
}

async function enviarMensagem(type,text){
    let obj =   {
        from: nome,
        to: destinatario,
        text: text,
        type: type
    }

    let res = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages',obj);

    res.then((data)=>{
        let input = document.querySelector('footer input');
        input.value = '';
        getMensagens();
    })
    res.catch(()=>{
        alert("Erro ao enviar a mensagem, você será redirecionado a pagina de login!");
        window.location.reload();
    })

}

telaLogin();