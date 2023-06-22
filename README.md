# Repositorio de App Chat con WebSockets y Handlebars

La app permite compartir mensajes entre todos los conectados en un chat grupal. El chat es local, solamente los clientes de una misma red podra acceder a él. Los mensajes se pierden al reiniciar el servidor.

The app allows you to share messages between everyone connected in a group chat. The chat is local, only clients in the same network can access it. Messages are lost when the server is restarted.

## Instalación y puesta en marcha
###### Requisitos para la instalación:

- **Node.js** Entorno de ejecucion.
- **NPM** Para instalar las librerías necesarias
- **Terminal Linux/cmd Windows** Para su instalación

Node.js se puede descargar de su página oficial -> https://nodejs.org/en
El paquete de instalación de Node.js tambien instala la herramienta **npm**

En linux se puede instalar mediante la ejecución del comando:

```
sudo apt install nodejs
```

Para descargar la ultima version de npm, en una terminal podemos ejecutar:

```
npm install -g npm
npm install -g npm@latest
```
NOTA: Es posible que se requiera permisos de administrador para ejecutar los comandos anteriores

## Descarga o clonación del repositorio

Se puede descargar desde el propio Github en el apartado -> code-> Donwload ZIP o mediante el comando de clonación en una terminal:

```
git clone https://github.com/matiasabarca49/Proyecto-GestorDeTareas-React.git
```

## Instalación

Para instalar las librerias necesarias, ingresamos al directorio una vez realizada la descompresión del ZIP y ejecutamos el siguiente comando:
```
npm install
```
Una vez instalados todas las libreriasa necesarias, ejecutamos la aplicacion con el siguiente comando:

```
npm start
```

## Acceso

El acceso se realiza mediante el navegador. 

 - En local a través de la dirección -> http://localhost:8080/chat
 - En dispositivos de la red -> http://IP_PC_Servidor:8080/chat