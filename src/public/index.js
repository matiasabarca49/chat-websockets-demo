const renderUserConnected = (arrayFromConnected) =>{
    const contConnected = document.getElementById('connectedID')
    contConnected.innerHTML= ""
    arrayFromConnected.forEach( user => {
        if (user.name !== autorCurrent.name){
        const div = document.createElement('div')
        div.innerHTML = `<p id=user-${user._id}>.<span>${user.name} ${user.lastName}</span></p>` 
        contConnected.appendChild(div)
        }
    } )
    
}

const renderNewUserConnected = (user) =>{
    const contConnected = document.getElementById('connectedID')
    const userCont = document.getElementById(`user-${user._id}`)
    if(userCont){
        return
    }
    console.log("Renderizando el nuevo usuario");
    if (user.name !== autorCurrent){
        const div = document.createElement('div')
        div.innerHTML = `<p>.<span>${user.name} ${user.lastName}</span></p>` 
        contConnected.appendChild(div)
    }
}

const renderChats = (chats) =>{
    const contChats = document.getElementById('contChats')
    contChats.innerHTML= ""
    chats.forEach(chat => {
        const newChat = document.createElement('div')
        //Si el id del chat del array obtenido por parametro es igual al nuestro. Se le colocan otros estilos al chat para diferencias que es nuestro.
        if (chat.senderId._id === idChat){
            newChat.className= "constMessage MyMessage"
            newChat.innerHTML = `
                                    <div class="msgOut" id=chatGlobal-${chat._id}></div>
                                    <p>${ chat.content } </p> 
                                    <div class="dateMSG">${chat.createdAt}</div>
                                 `
        } else{
            newChat.className= "constMessage othersMessage"
            newChat.innerHTML = `
                                    <div class="msgIn"id=chatGlobal-${chat._id}></div>
                                    <div class="autor"> ${chat.senderId.username} </div>
                                    <p>  ${ chat.content } </p>
                                    <div class="dateMSG">${chat.createdAt}</div> 
                                `
        }
        contChats.appendChild(newChat)
    });
    //Colocar el scroll siempre al final
    const span = document.createElement("span")
    //El elemento span siempre tiene por debajo de todos los chats
    span.innerHTML= `<span id="viewLastMsg"></span>`
    contChats.appendChild(span)
    document.getElementById('viewLastMsg').scrollIntoView(true)
}

const renderNewChat = (chat) =>{

    //ver si el chat ya se renderizó
    const chatRendered = document.getElementById(`chatGlobal-${chat._id}`)
    if(chatRendered){
        return;
    }
    const contChats = document.getElementById('contChats')
    const newChat = document.createElement('div')
    //Si el id del chat del array obtenido por parametro es igual al nuestro. Se le colocan otros estilos al chat para diferencias que es nuestro.
    if (chat.senderId._id === idChat){
        newChat.className= "constMessage MyMessage"
        newChat.innerHTML = `
                                <div class="msgOut" id=chatGlobal-${chat._id}></div>
                                <p>${ chat.content } </p> 
                                <div class="dateMSG">${chat.createdAt}</div>
                                `
    } else{
        newChat.className= "constMessage othersMessage"
        newChat.innerHTML = `
                                <div class="msgIn"id=chatGlobal-${chat._id}></div>
                                <div class="autor"> ${chat.senderId.username} </div>
                                <p>  ${ chat.content } </p>
                                <div class="dateMSG">${chat.createdAt}</div> 
                            `
    }
    contChats.appendChild(newChat)
    
    //Colocar el scroll siempre al final
    const span = document.createElement("span")
    //El elemento span siempre tiene por debajo de todos los chats
    span.innerHTML= `<span id="viewLastMsg"></span>`
    contChats.appendChild(span)
    document.getElementById('viewLastMsg').scrollIntoView(true)
}

//Funcion que genera un nuevo mensaje y se lo envia al servidor
const newGlobalMessage = () =>{
    //Creamos el mensaje nuevo
    const message = {
        senderId: autorCurrent._id,
        content: document.getElementById("text").value,
    }
    document.getElementById("text").value = ""
    //emite el mensaje nuevo creado al servidor
    socket.emit('send_global_message', message)
    socket.on("new_global_message", (data) => {
        console.log("Nuevo Mensaje: ", data);
        renderNewChat(data)
    })
}

/**
 * Algoritmo Principal  
 */ 

//Metodo traido desde socket.io.js que enciende el socket del cliente
let socket = io()
//Variables que nos permite difenciar el chat propio de los demas clientes
let idChat;
let autorCurrent;

//Si el usuario está guardado en el localStorage se asigna a la variable autorCurrent
if(localStorage.getItem("autor")){

    autorCurrent = JSON.parse(localStorage.getItem("autor"));
    //Se emite  al servidor ese usuario almacenado en el localstorage
    socket.emit('connect_to_global', autorCurrent)
    socket.on('new_connected_global', (data) => {
        console.log(data);
        renderNewUserConnected(data.data);
    })
    //El id chat que se usa para identificar los chats del autor actual se obtiene del localstorage
    idChat =  localStorage.getItem("idChat") 
    const currentUser = document.getElementById("currentUser")
    currentUser.innerText= `${autorCurrent.name} ${autorCurrent.lastName}(${autorCurrent.username})`;

} else{
        Swal.fire({
        title: 'Identifícate',
        html: `
            <input type="text" id="name" class="swal2-input" placeholder="Nombre">
            <input type="text" id="lastName" class="swal2-input" placeholder="Apellido">
            <input type="text" id="username" class="swal2-input" placeholder="Nombre de Usuario">
            <input type="email" id="email" class="swal2-input" placeholder="Email">
            <input type="password" id="password" class="swal2-input" placeholder="Contraseña">
        `,
        focusConfirm: false,
        preConfirm: () => {
            const name = document.getElementById('name').value;
            const lastName = document.getElementById('lastName').value;
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!name || !lastName || !username || !email || !password) {
            Swal.showValidationMessage('Todos los campos son obligatorios');
            return false;
            }

            return { name, lastName, username, email, password };
        }
        })
    .then(res => {
        //Tratando la respuesta recibida por el usuario
        if (res.value) {

            let user;

            fetch("http://localhost:8080/api/v1/users",
                {
                    method: 'POST', // tipo de petición
                    headers: {
                        'Content-Type': 'application/json' // indicamos que enviamos JSON
                    },
                    body: JSON.stringify(res.value)
                }
            )
                .then( res => res.json())
                .then( data => {
                    user = data.data;
                    autorCurrent = user;
                    socket.emit('connect_to_global', user)
                    socket.on('new_connected_global', (data) => {
                        console.log(data);
                        renderNewUserConnected(data.data);
                    })
                    idChat = user._id;
                    //Se guarda el usuario nuevo en el localstorage
                    localStorage.setItem("autor", JSON.stringify(autorCurrent));
                    localStorage.setItem("idChat", idChat);
                    const currentUser = document.getElementById("currentUser")
                    currentUser.innerText= `${autorCurrent.name} ${autorCurrent.lastName}(${autorCurrent.username})`;
                })
        }
    });
}

//Recibe los usuario conectados desde el servidor
socket.on('cnted', (data) =>{
    console.log("Usuarios conectados: ", data)
    renderUserConnected(data)
})   


//recibe los chats desde el servidor
fetch("http://localhost:8080/api/v1/messages/global")
    .then( res => res.json())
    .then( data => {
        renderChats(data);
    } )

//Evento que se ejecuta al escribir en el chat
const form = document.getElementById("form")
form.onsubmit = (e) =>{
    e.preventDefault()
    newGlobalMessage()
} 



