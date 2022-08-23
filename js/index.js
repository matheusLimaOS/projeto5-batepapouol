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


telaLogin();