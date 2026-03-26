const renderUserConnected = (arrayFromConnected) => {
  const contConnected = document.getElementById('connectedID');
  contConnected.innerHTML = '';
  arrayFromConnected.forEach(user => {
    if (document.getElementById(`user-${user._id}`)|| user._id === autorCurrent.id) return;
    if (user.name !== autorCurrent.name) {
      const div = document.createElement('div');
      div.innerHTML = `<div class="connectedBar__item" id="user-${user._id}">${user.name} ${user.lastName}</div>`;
      contConnected.appendChild(div);
    }
  });
};

const renderNewUserConnected = (user) => {
  const contConnected = document.getElementById('connectedID');
  if (document.getElementById(`user-${user._id}`) || user._id === autorCurrent.id) return;
  if (user.name !== autorCurrent) {
    const div = document.createElement('div');
    div.innerHTML = `<div class="connectedBar__item" id="user-${user._id}">${user.name} ${user.lastName}</div>`;
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
  if (document.getElementById(`chatGlobal-${chat._id}`) || chat.conversationId !== room) return;
  const contChats = document.getElementById('contChats');
  contChats.appendChild(buildMessage(chat));
  const span = document.getElementById('viewLastMsg');
  if (span) span.remove();
  contChats.appendChild(Object.assign(document.createElement('span'), { id: 'viewLastMsg' }));
  scrollToBottom();
  const badge = document.getElementById(`conversation-${chat.conversationId}`);
};

const renderConversations = (conversations) =>{
  const privateRoomsList = document.getElementById('privateRoomsList');
  conversations.forEach( conversation =>{
    
    // Evitar duplicados en la lista
    if (!document.querySelector(`[data-room="${conversation.conversationId}"]`)) {
  const li = document.createElement('li');
  li.className = 'chatSidebar__item';
  li.dataset.room = conversation.conversationId;

  const label = conversation.isGroup
    ? conversation.name
    : `${conversation.participants[0].name} ${conversation.participants[0].lastName}`;

  li.innerHTML = `
    <span class="chatSidebar__hash">@</span>
    <span class="chatSidebar__itemName">${label}</span>
    <span class="badge" style="display:none;" id="conversation-${conversation.conversationId}"></span>
    <button class="chatSidebar__deleteBtn" title="Eliminar chat">×</button>
  `;

  li.addEventListener('click', () =>
    switchRoom(conversation.conversationId, conversation?.name || label)
  );

  // El botón elimina sin propagar el click al li
  li.querySelector('.chatSidebar__deleteBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    li.remove();

    fetch(`http://localhost:8080/api/v1/conversations/${conversation.conversationId}`,
      {
        method: "DELETE"
      }
    )

    // Si era el room activo, volvé al global
    if (room === conversation.conversationId) {
      switchRoom("CHAT_GLOBAL_ID", "Chat Global");
    }
  });

  privateRoomsList.appendChild(li);
}
  })
}

const renderNewConversation = (conversation)=>{
  const privateRoomsList = document.getElementById('privateRoomsList');
    // Evitar duplicados en la lista
  if (!document.querySelector(`[data-room="${conversation.conversationId}"]`)) {
    const li = document.createElement('li');
    li.className = 'chatSidebar__item';
    li.dataset.room = conversation.conversationId;

    const label = conversation.isGroup
      ? conversation.name
      : `${conversation.participants[0].name} ${conversation.participants[0].lastName}`;

    li.innerHTML = `
      <span class="chatSidebar__hash">1</span>
      <span class="chatSidebar__itemName">${label}</span>
      <span class="badge">Nuevo</span>
    `;

    li.addEventListener('click', () =>
      switchRoom(conversation.conversationId, conversation?.name || label)
    );


    privateRoomsList.appendChild(li);
  }
}

//Funcion que genera un nuevo mensaje y se lo envia al servidor
const newMessage = () =>{
    //Creamos el mensaje nuevo
    const message = {
        conversationId: room,
        senderId: autorCurrent.id,
        content: document.getElementById("text").value,
    }
    document.getElementById("text").value = ""
    //emite el mensaje nuevo creado al servidor
    socket.emit('send_message', message)
}

/**
 * Algoritmo Principal  
 */ 

//Metodo traido desde socket.io.js que enciende el socket del cliente
let socket = io()
//Variables que nos permite difenciar el chat propio de los demas clientes
let idChat;
let autorCurrent;
let room;

//Si el usuario está guardado en el localStorage se asigna a la variable autorCurrent
if(localStorage.getItem("autor")){

    autorCurrent = JSON.parse(localStorage.getItem("autor"));
    //Se emite  al servidor ese usuario almacenado en el localstorage
    socket.emit('connect_to_global', autorCurrent)
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

socket.on('new_connected_global', (data) => {
  console.log(data);
  renderNewUserConnected(data.data);
})

//Escucha nuevos mensajes
socket.on("new_message", (data) => {
    console.log("Nuevo Mensaje: ", data);
    renderNewChat(data)
})

//Escuchar nuevas conversaciones
socket.on("available_conversation", (data) =>{
  console.log("Nueva Conversacion: ", data);
  renderNewConversation(data);
})

//Por defecto poner el chat global
switchRoom("CHAT_GLOBAL_ID", "Chat Global");

//Obtener Conversaciones del Usuarios
fetch("http://localhost:8080/api/v1/conversations")
  .then( res => res.json() )
  .then( data => {
      renderConversations(data.data)
  })

//Evento para cambiar de otros chats al Global
const global = document.getElementById("sidebar-global");
global.addEventListener("click", ()=>{
  switchRoom("CHAT_GLOBAL_ID", "Chat Global");
})

//Evento que se ejecuta al escribir en el chat
const form = document.getElementById("form")
form.onsubmit = (e) =>{
    e.preventDefault()
    newMessage()
} 

//Evento para desconectar el usuario
const disconect = document.getElementById("btn-disconnect");
disconect.addEventListener("click", () =>{
    fetch("http://localhost:8080/api/v1/auth/logout")
    localStorage.removeItem("autor");
    localStorage.removeItem("idChat");
    window.location.href = "/login"
})

const btnNewPrivate    = document.getElementById('btn-new-private');
const modalOverlay     = document.getElementById('modalOverlay');
const modalBody        = document.getElementById('modal__body');
const modalClose       = document.getElementById('modal__close');
const privateRoomsList = document.getElementById('privateRoomsList');

// Abrir modal
btnNewPrivate.addEventListener('click', () => {
  populateModal();
  modalOverlay.classList.remove('hidden');
});

// Cerrar modal
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

function closeModal() {
  modalOverlay.classList.add('hidden');
}

async function populateModal() {

  //Obtener los usuarios
  const res = await fetch("http://localhost:8080/api/v1/users");
  const data = await res.json();
  const users = data.data;
  
  modalBody.innerHTML = '';

  if (!users.length) {
    modalBody.innerHTML = '<p class="modal__empty">No hay usuarios conectados.</p>';
    return;
  }

  users.forEach(user => {
    const item = document.createElement('div');
    item.className = 'modal__userItem';
    item.innerHTML = `
      <span class="modal__userDot"></span>
      <span class="modal__userName">${user.name} ${user.lastName}</span>
      <span class="modal__userArrow">→</span>
    `;
    item.addEventListener('click', () => {
      startPrivateChat(user);
      closeModal();
    });
    modalBody.appendChild(item);
  });
}

function startPrivateChat(targetUser) {
  const roomId = [autorCurrent.id, targetUser._id].sort().join('-');

  socket.emit("connect_to_private", targetUser);

  // Evitar duplicados en la lista
  if (!document.querySelector(`[data-room="${roomId}"]`)) {
    const li = document.createElement('li');
    li.className = 'chatSidebar__item';
    li.dataset.room = roomId;
    li.innerHTML = `<span class="chatSidebar__hash">@</span><span>${targetUser.name} ${targetUser.lastName}</span>`;
    li.addEventListener('click', () => switchRoom(roomId, `${targetUser.name} ${targetUser.lastName}`));
    privateRoomsList.appendChild(li);
  }

  switchRoom(roomId, `${targetUser.name} ${targetUser.lastName}`);
}

async function switchRoom(roomId, title) {
  document.querySelectorAll('.chatSidebar__item').forEach(el => {
    el.classList.toggle('chatSidebar__item--active', el.dataset.room === roomId);
  });

  if(roomId !== "CHAT_GLOBAL_ID"){
    document.getElementById('connectedID').style.display = 'none';
  }else{
    document.getElementById('connectedID').style.display = 'block';
  }

  document.getElementById("titleId").innerText = title;

  
  room = roomId;

  console.log("room actual: ", room);

  // Emitir al servidor
  socket.emit('join_to_conversation', roomId);

  // Limpiar mensajes
  document.getElementById('contChats').innerHTML = '<span id="viewLastMsg"></span>';

  const res = await fetch(`http://localhost:8080/api/v1/messages/conversation/${roomId}`);

  const data = await res.json();

  renderChats(data);
}



