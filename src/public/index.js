const renderUserConnected = (arrayFromConnected) =>{
    const contConnected = document.getElementById('connectedID')
    contConnected.innerHTML= ""
    arrayFromConnected.forEach( user => {
        if (user.name !== autorCurrent){
        const div = document.createElement('div')
        div.innerHTML = `<p>.<span>${user.name}</span></p>` 
        contConnected.appendChild(div)
        }
    } )
    
}

const renderChats = (chats) =>{
    const contChats = document.getElementById('contChats')
    contChats.innerHTML= ""
    chats.forEach(chat => {
        const newChat = document.createElement('div')
        //Si el id del chat del array obtenido por parametro es igual al nuestro. Se le colocan otros estilos al chat para diferencias que es nuestro.
        if (chat.id === idChat){
            newChat.className= "constMessage MyMessage"
            newChat.innerHTML = `
                                    <div class="msgOut"></div>
                                    <p>${ chat.text } </p> 
                                    <div class="dateMSG">${chat.dateMessage}</div>
                                 `
        } else{
            newChat.className= "constMessage othersMessage"
            newChat.innerHTML = `
                                    <div class="msgIn"></div>
                                    <div class="autor"> ${chat.autor} </div>
                                    <p>  ${ chat.text } </p>
                                    <div class="dateMSG">${chat.dateMessage}</div> 
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

//Funcion que genera un nuevo mensaje y se lo envia al servidor
const newMessage = () =>{
    const dayName = ["Dom","Lun","Mar","Mie","Jue","Vie","Sab"]
    const date = new Date()
    //Creamos el mensaje nuevo
    const message = {
        id: idChat,
        autor: autorCurrent,
        text: document.getElementById("text").value,
        dateMessage: `${dayName[date.getDay()]} ${date.getDate()} a las ${date.getHours()}:${date.getMinutes()}`
    }
    document.getElementById("text").value = ""
    //emite el mensaje nuevo creado al servidor
    socket.emit('msg', message)
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

    autorCurrent = localStorage.getItem("autor")
    //Se emite  al servidor ese usuario almacenado en el localstorage
    socket.emit('userToConnect', autorCurrent)
    //El id chat que se usa para identificar los chats del autor actual se obtiene del localstorage
    idChat =  localStorage.getItem("idChat") 
    const currentUser = document.getElementById("currentUser")
    currentUser.innerText= `${autorCurrent}`

} else{
    //En caso de que el localstorage este vacio se solicitan los datos al usuario
    Swal.fire({
        title: "Tu nombre",
        input: "text",
        confirmButtonText: "Guardar",
        //Evita que el modal se cierre al hacer clic fuera de él
        allowOutsideClick: false,
        //Se controla que el usuario no envie texto vacio
        inputValidator: (value) => {
            if (!value) {
              return 'Necesitas escribir un nombre o nickname'
            }
          }
    })
    .then(res => {
        //Tratando la respuesta recibida por el usuario
        if (res.value) {
            autorCurrent = res.value;
            socket.emit('userToConnect', autorCurrent)
            idChat = `${Date.now()} - ${autorCurrent}`
            //Se guarda el usuario nuevo en el localstorage
            localStorage.setItem("autor", res.value )
            localStorage.setItem("idChat", idChat) 
            const currentUser = document.getElementById("currentUser")
            currentUser.innerText= `${autorCurrent}`
        }
    });
}

//Recibe los usuario conectados desde el servidor
socket.on('cnted', (data) =>{
    renderUserConnected(data)
})   

//recibe los chats desde el servidor
socket.on("chats", (data) => {
    renderChats(data)
})

//Evento que se ejecuta al escribir en el chat
const form = document.getElementById("form")
form.onsubmit = (e) =>{
    e.preventDefault()
    newMessage()
} 



