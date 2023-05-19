const render = (chats) =>{
    const contChats = document.getElementById('contChats')
    contChats.innerHTML= ""
    chats.forEach(chat => {
        const newChat = document.createElement('div')
        newChat.innerHTML = ` <p><strong> ${chat.autor} </strong>  <span>  ${ chat.text } </span> <p>`
        contChats.appendChild(newChat)
    });
}

//Meotodo traido desde socket.io.js que enciende el socket del cliente
let socket = io()

socket.on("chats", (data) => {
    console.log(data)
    render(data)
    const newMessage = () =>{
        const message = {
            autor: document.getElementById("name").value,
            text: document.getElementById("text").value
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

