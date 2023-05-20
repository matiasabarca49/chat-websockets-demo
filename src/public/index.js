const render = (chats) =>{
    const contChats = document.getElementById('contChats')
    contChats.innerHTML= ""
    chats.forEach(chat => {
        const newChat = document.createElement('div')
        if (chat.id === idNow){
            newChat.className= "constMessage MyMessage"
            newChat.innerHTML = `
                                    <strong> ${chat.autor} </strong>  <span>  ${ chat.text } </span> 
                                 `
        } else{
            newChat.className= "constMessage othersMessage"
            newChat.innerHTML = `
                                    <strong> ${chat.autor} </strong>  <span>  ${ chat.text } </span> 
                                `
        }
        contChats.appendChild(newChat)
    });
}

//Meotodo traido desde socket.io.js que enciende el socket del cliente
let socket = io()

const idNow = Date.now()

socket.on("chats", (data) => {
    console.log(data)
    render(data)
    const newMessage = () =>{
        const message = {
            id: idNow,
            autor: document.getElementById("name").value,
            text: document.getElementById("text").value
        }
        document.getElementById("text").value = ""
        socket.emit('msg', message)
    }

    const form = document.getElementById("form")
    form.onsubmit = (e) =>{
        e.preventDefault()
        newMessage()
    } 
})

