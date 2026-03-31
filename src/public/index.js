const buildConnectedUser = (user) =>{
  if (document.getElementById(`user-${user._id}`)|| user._id === autorCurrent.id) return;
  let div;
  if (user.name !== autorCurrent.name) {
    div = document.createElement('div');
    div.innerHTML = `<div class="connectedBar__item" id="user-${user._id}">${user.name} ${user.lastName}</div>`;
  }
  return div;
}

const renderUsersConnected = (arrayFromConnected) => {
  const contConnected = document.getElementById('connectedID');
  contConnected.innerHTML = '';
  arrayFromConnected.forEach(user => {
      const div = buildConnectedUser(user);
      if(!div) return;
      contConnected.appendChild(div);
    }
  );
};

const renderNewUserConnected = (user) => {
  const contConnected = document.getElementById('connectedID');
  const div = buildConnectedUser(user);
  if(!div) return;
  contConnected.appendChild(div);
};


const buildMessage = (chat) => {
  const isOwn = chat.senderId?._id === idChat;
  const div = document.createElement('div');
  div.id = `chatGlobal-${chat._id}`;
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

  contChats.innerHTML =  `
    <div id="chatSpinner" class="spinner-wrapper" style="display: none;">
      <div class="loader"></div>
      <span>Cargando mensajes...</span>
    </div>
  `;

  chats.forEach(chat => {
    if (document.getElementById(`chatGlobal-${chat._id}`) || chat.conversationId !== room) return;
    contChats.appendChild(buildMessage(chat))
  });

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
};

// Función para construir el HTML de un item de conversación (ya sea grupal o privado)
const buildConversationItem = (conversation) => {
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
        <span class="badge" id="conversation-${conversation.conversationId}" style="display: none;"></span>
        <button class="chatSidebar__deleteBtn" title="Eliminar chat">×</button>
      `;

      li.addEventListener('click', () =>{
        switchRoom(conversation.conversationId, conversation?.name || label);
        resetBadge(conversation.conversationId);
        });

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

  return li;
}

}

//Función para renderizar las conversaciones del usuario al cargar la página
const renderConversations = (conversations) =>{
  const privateRoomsList = document.getElementById('privateRoomsList');
  conversations.forEach( conversation =>{
    const li = buildConversationItem(conversation);
    if(!li) return;
    privateRoomsList.appendChild(li);
  }
  );
}

//Función para renderizar una nueva conversación que se acaba de crear
const renderNewConversation = (conversation)=>{
  const privateRoomsList = document.getElementById('privateRoomsList');
    const li = buildConversationItem(conversation);
    if(!li) return;
    privateRoomsList.appendChild(li);
}

const renderNewBadge = (chat) =>{
  if(chat.senderId._id === autorCurrent.id || chat.conversationId === room) return;
    const roomContent = document.querySelector(`[data-room="${chat.conversationId}"]`);
    const badge = roomContent.querySelector('.badge');
    badge.style.display = "flex";
    if(!badge.value){
      badge.innerHTML = "+";
    }
}

const resetBadge = (conversationId) =>{
  document.querySelector(`[data-room="${conversationId}"]`).querySelector(".badge").style.display = "none";
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

function renderHistory(messages) {
  const contChats = document.getElementById('contChats');
  
  // Guardamos la altura antes de insertar para el ajuste de scroll
  const previousHeight = contChats.scrollHeight;

  // Creamos un fragmento de documento para no disparar el renderizado 30 veces
  const fragment = document.createDocumentFragment();

  messages.forEach(msg => {
    if (document.getElementById(`chatGlobal-${msg._id}`) || msg.conversationId !== room) return;
    const msgElement = buildMessage(msg); //función que crea el HTML del mensaje
    fragment.appendChild(msgElement);
  });

  // Insertamos TODO el bloque al principio del contenedor
  contChats.prepend(fragment);

  // Ajuste de scroll: Mantener al usuario en el mismo mensaje que estaba viendo
  const newHeight = contChats.scrollHeight;
  contChats.scrollTop = newHeight - previousHeight;
}


/**
 * Algoritmo Principal  
 */ 

//Metodo traido desde socket.io.js que enciende el socket del cliente
let socket = io()
//Variables que nos permite difenciar el chat propio de los demas clientes
let idChat;
let autorCurrent;
//Variable para manejar la sala actual en la que se encuentra el usuario
let room;
//Variables para manejar la carga parcial de mensajes
let oldestMessageId = null;
//Variable para controlar si hay más mensajes para cargar o no
let hasMoreMessages = true;
//Variable para controlar la carga de mensajes y evitar peticiones simultaneas
let isLoading = false;
//Variable para controlar el switch de salas y evitar bugs visuales
let currentSwitchController = null;

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

//Ingresar usuario a todas las conversaciones
socket.emit('join_to_conversations');


//Recibe los usuario conectados desde el servidor
socket.on('cnted', (data) =>{
    renderUsersConnected(data)
})  

socket.on('new_connected_global', (data) => {
  renderNewUserConnected(data.data);
})

//Escucha nuevos mensajes
socket.on("new_message", (data) => {
    renderNewChat(data)
    renderNewBadge(data, room);
})

//Escuchar nuevas conversaciones
socket.on("available_conversation", (data) =>{
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
  resetBadge("CHAT_GLOBAL_ID");
})


//Manejar la carga parcial de chats
const chatContainer = document.getElementById('contChats');

chatContainer.addEventListener('scroll', () => {
    // Si el scroll llega a 0 (arriba de todo)
    if (chatContainer.scrollTop === 0) {
        // Guardamos la altura actual para que el scroll no "salte"
        const previousHeight = chatContainer.scrollHeight;

        loadMoreHistory().then(() => {
            // Ajustamos el scroll para que el usuario no pierda el hilo
            const newHeight = chatContainer.scrollHeight;
            chatContainer.scrollTop = newHeight - previousHeight;
        });
    }
});

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
    /* li.innerHTML = `<span class="chatSidebar__hash">@</span><span>${targetUser.name} ${targetUser.lastName}</span>`; */
    li.innerHTML = `
      <span class="chatSidebar__hash">@</span>
      <span class="chatSidebar__itemName">${targetUser.name} ${targetUser.lastName}</span>
      <span class="badge" id="conversation-${roomId}">Nuevo</span>
    `;
    li.addEventListener('click', () => switchRoom(roomId, `${targetUser.name} ${targetUser.lastName}`));
    privateRoomsList.appendChild(li);
  }

  switchRoom(roomId, `${targetUser.name} ${targetUser.lastName}`);
}

async function switchRoom(roomId, title) {

  // Si ya hay una petición en curso para cargar mensajes, la cancelamos para evitar bugs visuales al cambiar rápido de salas.
  if (currentSwitchController) currentSwitchController.abort();
  currentSwitchController = new AbortController();

  document.querySelectorAll('.chatSidebar__item').forEach(el => {
    el.classList.toggle('chatSidebar__item--active', el.dataset.room === roomId);
  });

  if(roomId !== "CHAT_GLOBAL_ID"){
    document.getElementById('connectedID').style.display = 'none';
  }else{
    document.getElementById('connectedID').style.display = 'block';
  }

  document.getElementById("titleId").innerText = title;

  //Ingresar usuario a la conversacion en caso de que no este
  /* socket.emit('join_to_conversation', roomId); */
  
  room = roomId;
  oldestMessageId = null; // Reset para nueva sala
  hasMoreMessages = true;
  isLoading = false;

  console.log("room actual: ", room);


  // Limpiar mensajes PERO dejando el spinner y el marcador de final
  document.getElementById('contChats').innerHTML = `
    <div id="chatSpinner" class="spinner-wrapper" style="display: none;">
      <div class="loader"></div>
      <span>Cargando mensajes...</span>
    </div>
    <div id="chatMessagesContainer"></div> <span id="viewLastMsg"></span>
  `;

  try{
      const res = await fetch(`http://localhost:8080/api/v1/messages/conversation/${roomId}`,
      { 
        signal: currentSwitchController.signal 
      }
    );
    const data = await res.json();

    //Carga Inicial
    renderChats(data.messages);

    //Guardamos el ID del mensaje más viejo de este primer lote
    if (data.messages.length > 0) {
        oldestMessageId = data.messages[0]._id;
        hasMoreMessages = data.hasMore;
    }
  }catch(error){ 
    if (error.name === 'AbortError') {
      // No hacemos nada, es una cancelación intencional
      console.log('Petición vieja cancelada, ignorando error.');
    } else {
      // Si es otro tipo de error (red, 404, 500), sí lo mostramos
      console.error('Error real en el fetch:', error);
    }
  }
}

//Función para cargar más mensajes
async function loadMoreHistory() {
    if (isLoading || !hasMoreMessages || !room) return;

    const spinner = document.getElementById('chatSpinner');

    // 1. Mostrar spinner
    spinner.style.display = 'flex';
    isLoading = true;

    try {
        const data = await fetchMessages(room, oldestMessageId);
        
        if (data.messages.length > 0) {
            oldestMessageId = data.messages[0]._id;
            hasMoreMessages = data.hasMore;
            renderHistory(data.messages);
        }
    } catch (error) {
        console.error("Error cargando historial", error);
    } finally {
        // 2. Ocultar spinner (siempre, aunque falle la petición)
        spinner.style.display = 'none';
        isLoading = false;
    }
}

async function fetchMessages(roomId, lastId = null) {

    try {
      
      // Si ya hay una petición en curso para cargar mensajes, la cancelamos para evitar bugs visuales al cambiar rápido de salas.
      if (currentSwitchController) currentSwitchController.abort();
      currentSwitchController = new AbortController();
  
      const url = `http://localhost:8080/api/v1/messages/conversation/${roomId}${lastId ? `?lastId=${lastId}` : ''}`;
      const res = await fetch(url, { signal: currentSwitchController.signal });
      return await res.json();

    } catch (error) {
        if (error.name !== 'AbortError') {
          // No hacemos nada, es una cancelación intencional
          console.error('Error real en el fetch:', error);
        }
    }
}



