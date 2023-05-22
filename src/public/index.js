const render = (chats) =>{
    const contChats = document.getElementById('contChats')
    contChats.innerHTML= ""
    chats.forEach(chat => {
        const newChat = document.createElement('div')
        if (chat.id === idChat){
            newChat.className= "constMessage MyMessage"
            newChat.innerHTML = `
                                    <p>${ chat.text } </p> 
                                    <div class="dateMSG">${chat.dateMessage}</div>
                                 `
        } else{
            newChat.className= "constMessage othersMessage"
            newChat.innerHTML = `
                                    <div class="autor"> ${chat.autor} </div>
                                    <p>  ${ chat.text } </p>
                                    <div class="dateMSG">${chat.dateMessage}</div> 
                                `
        }
        contChats.appendChild(newChat)
    });
}

//Metodo traido desde socket.io.js que enciende el socket del cliente
let socket = io()

const idChat =  localStorage.getItem("idChat") || localStorage.setItem("idChat",Date.now().toString())

let autorCurrent;

if(localStorage.getItem("autor")){

   autorCurrent = localStorage.getItem("autor")

} else{
    Swal.fire({
        title: "Tu nombre",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "Guardar",
    })
    .then(res => {
        if (res.value) {
            autorCurrent = res.value
            localStorage.setItem("autor", res.value )
        }
    });
}

    

socket.on("chats", (data) => {
    render(data)
    const newMessage = () =>{
        const dayName = ["Dom","Lun","Mar","Mie","Jue","Vie","Sab"]
        const date = new Date()
        console.log(autorCurrent)
        const message = {
            id: idChat,
            autor: autorCurrent,
            text: document.getElementById("text").value,
            dateMessage: `${dayName[date.getDay()]} ${date.getDate()} a las ${date.getHours()}:${date.getMinutes()}`
        }
        console.log(message)
        document.getElementById("text").value = ""
        socket.emit('msg', message)
    }

    const form = document.getElementById("form")
    form.onsubmit = (e) =>{
        e.preventDefault()
        newMessage()
    } 
})

