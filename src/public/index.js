const renderUserConnected = (arrayFromConnected) => {
  const contConnected = document.getElementById('connectedID');
  contConnected.innerHTML = '';
  arrayFromConnected.forEach(user => {
    if (user.name !== autorCurrent.name) {
      const div = document.createElement('div');
      div.innerHTML = `<div class="connectedBar__item" id="user-${user._id}">${user.name} ${user.lastName}</div>`;
      contConnected.appendChild(div);
    }
  });
};

const renderNewUserConnected = (user) => {
  const contConnected = document.getElementById('connectedID');
  if (document.getElementById(`user-${user._id}`)) return;
  if (user.name !== autorCurrent) {
    const div = document.createElement('div');
    div.innerHTML = `<p id="user-${user._id}"><span>${user.name} ${user.lastName}</span></p>`;
    contConnected.appendChild(div);
  }
};

const buildMessage = (chat) => {
  const isOwn = chat.senderId?._id === idChat;
  const div = document.createElement('div');
  div.className = `constMessage ${isOwn ? 'MyMessage' : 'othersMessage'}`;

  const date = new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  div.innerHTML = isOwn
    ? `<div class="msgOut" id="chatGlobal-${chat._id}"></div>
       <p>${chat.content}</p>
       <div class="dateMSG">${date}</div>`
    : `<div class="msgIn" id="chatGlobal-${chat._id}"></div>
       <div class="autor">${chat.senderId?.username}</div>
       <p>${chat.content}</p>
       <div class="dateMSG">${date}</div>`;

  return div;
};

const scrollToBottom = () => {
  document.getElementById('viewLastMsg').scrollIntoView({ behavior: 'smooth' });
};

const renderChats = (chats) => {
  const contChats = document.getElementById('contChats');
  contChats.innerHTML = '';
  chats.forEach(chat => contChats.appendChild(buildMessage(chat)));
  contChats.appendChild(Object.assign(document.createElement('span'), { id: 'viewLastMsg' }));
  scrollToBottom();
};

const renderNewChat = (chat) => {
  if (document.getElementById(`chatGlobal-${chat._id}`)) return;
  const contChats = document.getElementById('contChats');
  contChats.appendChild(buildMessage(chat));
  const span = document.getElementById('viewLastMsg');
  if (span) span.remove();
  contChats.appendChild(Object.assign(document.createElement('span'), { id: 'viewLastMsg' }));
  scrollToBottom();
};

//Funcion que genera un nuevo mensaje y se lo envia al servidor
const newGlobalMessage = () =>{
    //Creamos el mensaje nuevo
    const message = {
        senderId: autorCurrent.id,
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
    window.location.href = "/login";

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

//Evento para desconectar el usuario
const disconect = document.getElementById("btn-disconnect");
disconect.addEventListener("click", () =>{
    fetch("http://localhost:8080/api/v1/auth/logout")
    localStorage.removeItem("autor");
    localStorage.removeItem("idChat");
    window.location.href = "/login"
})

// ── Sidebar: toggle nuevo chat privado ──────────────────────────────
const btnNewPrivate   = document.getElementById('btn-new-private');
const newChatForm     = document.getElementById('newChatForm');
const newChatInput    = document.getElementById('newChatInput');
const btnConfirm      = document.getElementById('btn-confirm-private');
const privateRoomsList = document.getElementById('privateRoomsList');
const chatTitle       = document.getElementById('chatTitle');

let currentRoom = 'global';

btnNewPrivate.addEventListener('click', () => {
  newChatForm.hidden = !newChatForm.hidden;
  if (!newChatForm.hidden) newChatInput.focus();
});

// Confirmar nuevo chat privado con Enter o botón
newChatInput.addEventListener('keydown', e => { if (e.key === 'Enter') createPrivateRoom(); });
btnConfirm.addEventListener('click', createPrivateRoom);

function createPrivateRoom() {
  const target = newChatInput.value.trim();
  if (!target) return;

  const roomId = [currentUser, target].sort().join('__'); // room única por par
  addPrivateTab(target, roomId);
  switchRoom(roomId, `@ ${target}`);

  newChatInput.value = '';
  newChatForm.hidden = true;
}

function addPrivateTab(label, roomId) {
  // Evitar duplicados
  if (document.querySelector(`[data-room="${roomId}"]`)) return;

  const li = document.createElement('li');
  li.className = 'chatSidebar__item';
  li.dataset.room = roomId;
  li.innerHTML = `<span class="chatSidebar__hash">@</span><span>${label}</span>`;
  li.addEventListener('click', () => switchRoom(roomId, `@ ${label}`));
  privateRoomsList.appendChild(li);
}

function switchRoom(roomId, title) {
  // Desactivar item anterior
  document.querySelectorAll('.chatSidebar__item').forEach(el => {
    el.classList.toggle('chatSidebar__item--active', el.dataset.room === roomId);
  });

  chatTitle.textContent = title.replace(/^@ /, '') ;
  currentRoom = roomId;

  // Emitir al servidor el cambio de sala
  socket.emit('joinRoom', roomId);

  // Limpiar mensajes al cambiar de sala
  document.getElementById('contChats').innerHTML = '<span id="viewLastMsg"></span>';
}

// Click en "general"
document.getElementById('sidebar-global').addEventListener('click', () => {
  switchRoom('global', 'general');
});



