let nome;
let destinatario = '';
let visibilidade = '';


function carregamento(){
    let form = document.querySelector('form');
    let gif = document.createElement('img');
    let telaLogin = document.querySelector('.telaLogin')

    gif.classList.add('gif');
    gif.setAttribute('src','../img/Loading.gif');

    telaLogin.appendChild(gif);

    form.classList.add('displayNone');
}

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
function exibirMenu(){
    let menuLateral = document.querySelector('.menuLateral');
    let contraMenu = document.querySelector('.contraMenu');

    menuLateral.classList.remove('displayNone');
    contraMenu.classList.remove('displayNone');
}
async function onSubmit(form){
    nome = form.children[0].value;
    let obj = {
        name : nome
    }

    let res = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",obj);

    carregamento();

    res.then((data)=>{
        intervalPersistencia();
        apagaContainer();
        telaConversa();
        intervalMensagens()
    })
    res.catch(()=>{
        let form = document.querySelector('form');
        let gif = document.querySelector('.gif');
        let telaLogin = document.querySelector('.telaLogin');
        telaLogin.removeChild(gif);
        form.classList.remove('displayNone');

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
        let container = document.querySelector('.telaLogin');
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
    configMenuLateral();
    await criaHeader();
    await criaFooter();

    getMensagens();
    apagaContainer();

    let input = document.querySelector('footer input');
    input.addEventListener('keydown', function(e){
        if(e.keyCode === 13){
            let text = input.value;
            enviarMensagem(text);
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
    ionIcon.setAttribute('onClick','exibirMenu()');

    header.appendChild(img);
    header.appendChild(ionIcon);

    header.classList.remove('displayNone');
}

function criaFooter(){
    let footer = document.querySelector('.footer');
    let input = document.createElement('input');
    let ionIcon = document.createElement('ion-icon');
    let destino = document.createElement('p');

    input.setAttribute('placeholder','Escreva aqui...');
    input.setAttribute('type','text');
    ionIcon.setAttribute('name','paper-plane-outline');
    ionIcon.setAttribute('onClick','onClick()');

    footer.appendChild(input);
    footer.appendChild(ionIcon);
    footer.appendChild(destino);

    footer.classList.remove('displayNone');
}
function onClick(){
    let input = document.querySelector('footer input');
    let text = input.value;
    enviarMensagem(text);
}
function addMensagens(res){
    let container = document.querySelector('.telaMensagens');
    let i=0;

    for(i=0;i<res.data.length;i++){
        if(res.data[i].type === 'status'){
            container.innerHTML += `
                <div class= 'mensagem ${res.data[i].type}'>
                    <p class = 'msg'> 
                        <span class = 'time'>(${res.data[i].time})</span>
                        <b>${res.data[i].from}</b>
                        ${res.data[i].text}
                    </p>
                </div>
            `
        }
        else if(res.data[i].type === 'message'){
            container.innerHTML += `
            <div class= 'mensagem ${res.data[i].type}'>
                <p>
                    <span class = 'time'>(${res.data[i].time})</span>
                    <b> ${res.data[i].from} </b>
                    para
                    <b> ${res.data[i].to}: </b>
                    ${res.data[i].text}
                </p>
            </div>
            `
        }

        else if(res.data[i].type === "private_message"){
            if(res.data[i].to === 'Todos' || res.data[i].to === nome){
                container.innerHTML += `
                <div class= 'mensagem ${res.data[i].type}'>
                    <p>
                        <span class = 'time'>(${res.data[i].time})</span>
                        <b> ${res.data[i].from} </b>
                        reservadamente para
                        <b> ${res.data[i].to}: </b>
                        ${res.data[i].text}
                    </p>
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
function configMenuLateral(){
    let menuLateral = document.createElement('div');
    let contraMenu = document.createElement('div');
    let body = document.querySelector('body');

    menuLateral.classList.add('displayNone','menuLateral');
    contraMenu.classList.add('displayNone','contraMenu');

    contraMenu.setAttribute('onClick','fecharMenu()');

    menuLateral.innerHTML = `
        <div>
            Escolha um contato para enviar mensagem:
        </div>
        <ul class = 'participantes'>
        </ul>
        <div>
            Escolha a visibilidade:
        </div>
        <ul class = 'visibilidade'>
            <li data-identifier="visibility">
                <button onClick = 'selectVisibilidade(this)'>
                    <div>
                    <ion-icon name="lock-open"></ion-icon>
                        Público
                    </div>
                    <div >
                        <ion-icon class='displayNone' name="checkmark"></ion-icon>
                    </div>  
                </button>
            </li>
            <li data-identifier="visibility">
                <button onClick = 'selectVisibilidade(this)'>
                    <div>
                        <ion-icon name="lock-closed"></ion-icon>
                        Reservado
                    </div>
                    <div >
                        <ion-icon class='displayNone' name="checkmark"></ion-icon>
                    </div>
                </button>
            </li>
        </ul>
    `;
    
    intervalParticipantes();
    listaParticipantes();
    
    body.appendChild(menuLateral);
    body.appendChild(contraMenu);
}

function fecharMenu(){
    let menuLateral = document.querySelector('.menuLateral');
    let contraMenu = document.querySelector('.contraMenu');

    contraMenu.classList.add('displayNone');
    menuLateral.classList.add('displayNone');

}

function selectVisibilidade(botao){
    let check = document.querySelectorAll('.visibilidade ion-icon[name="checkmark"]');
    let botoes = document.querySelectorAll('.visibilidade button');

    botoes[0].setAttribute('onClick','selectVisibilidade(this)');
    botoes[1].setAttribute('onClick','selectVisibilidade(this)');
    check[0].classList.add('displayNone');
    check[1].classList.add('displayNone');

    if(botao.innerText === 'Público'){
        visibilidade = 'message';
    }
    else{
        visibilidade = 'private_message'
    }

    botao.children[1].children[0].classList.remove('displayNone');
    botao.removeAttribute('onClick');

    mudarInfo();
}
function intervalMensagens(){
    setInterval(()=>{
        getMensagens();
    },3000);
}

function intervalParticipantes(){
    setInterval(()=>{
        apagaListaParticipantes();
        listaParticipantes();
    },10000);
}
function apagaListaParticipantes(){
    let participantes = document.querySelector('.participantes');

    participantes.innerHTML='';
}
function listaParticipantes(){
    let res = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");

    res.then((data)=>{
        let participantes = document.querySelector('.participantes');

        participantes.innerHTML+=`
            <li data-identifier="participant">
                <button onClick=selectDestinatario(this)>
                    <div>
                        <ion-icon name="people"></ion-icon>
                        <p>Todos</p>
                    </div>
                    <div>
                        <ion-icon class='displayNone' name="checkmark"></ion-icon>
                    </div>
                    
                </button>
            </li>
        `

        for(let i = 0;i<data.data.length;i++){

            participantes.innerHTML+=`
                <li data-identifier="participant">
                    <button onClick=selectDestinatario(this)>
                        <div>
                            <ion-icon name="person-circle"></ion-icon>
                            <p>${data.data[i].name}</p>
                        </div>
                        <div>
                            <ion-icon class='displayNone' name="checkmark"></ion-icon>
                        </div>
                        
                    </button>
                </li>
            `
        }

    })

    res.catch(()=>{
        prompt("Erro ao encontrar participantes, você será redirecionado a tela inicial");
        window.location.reload();
    })
}

function selectDestinatario(buttonDest){
    let botoes = document.querySelectorAll('.participantes button');
    let check = document.querySelectorAll('.participantes ion-icon[name="checkmark"]');
    let i;

    destinatario = buttonDest.children[0].children[1].innerHTML;
    
    for(i=0;i<botoes.length;i++){
        botoes[i].setAttribute('onClick','selectDestinatario(this)');
    }
    for(i=0;i<check.length;i++){
        check[i].classList.add('displayNone');
    }

    buttonDest.children[1].children[0].classList.remove('displayNone');
    buttonDest.removeAttribute('onClick');

    mudarInfo();
}

function mudarInfo(){
    let info = document.querySelector('footer p');
    if(destinatario !== '' && visibilidade !== ''){
        info.innerHTML = `Enviando para ${destinatario} (${visibilidade==='message' ? 'Publico' : 'Reservadamente'})`
    }
}

async function enviarMensagem(text){
    let obj =   {
        from: nome,
        to: destinatario,
        text: text,
        type: visibilidade
    }

    if(obj.to === '' || obj.type === ''){
        alert('Por favor selecione o destinatário e a visibilidade da mensagem');
        return;
    }
    else{
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
}

telaLogin();