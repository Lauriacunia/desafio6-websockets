const express = require("express");
const morgan = require("morgan");
const routeProducts = require("./routes/productRoutes");
const path = require("path");
const { Server: ioServer } = require("socket.io");
const http = require("http");
const app = express();
const PORT = 8000;

/**Tenemos dos servidores httpServer y ioServer */
const httpServer = http.createServer(app);

/** Crear nuevo servidor websocket */
const io = new ioServer(httpServer);

//** Middlewares */
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// express.static hace publicos los archivos estaticos (pej:css-html-jpg)
// que esten es la ruta que yo le indique.
app.use(express.static(__dirname + "/public"));
app.set("views", path.join(__dirname, "/public/views"));
app.set("view engine", "ejs");

/** ROUTER */
// Nota: recordar que todas las subrutas necesitan esta ruta base.
app.use("/api/products", routeProducts);

app.get("/", (req, res) => {
  res.redirect("/api/products");
});

/**En este caso los mensajes se guardan en un array
 * pero podrían persistirse en un archivo.
 */
const messages = [];

// CHAT desde el lado del backend - escuchando  y emitiendo.
/** ---> on para escuchar
 *  emit para enviar --->
 */
io.on("connection", (socket) => {
  // el socket trae toda la data del cliente
  console.log("👤 New user connected. Soquet ID : ", socket.id);
  socket.on("set-name", (name) => {
    console.log("🔸Asignando nuevo username: ", name);
    socket.emit("user-connected", name);
    socket.broadcast.emit("user-connected", name);
  });

  /** El servidor recibe un nuevo mensaje,
   * lo agrega al array de mensajes
   *  y re-envia todos los mensajes a los usuarios*/
  socket.on("new-message", (message) => {
    messages.push(message);
    socket.emit("messages", messages);
    socket.broadcast.emit("messages", messages);
  });

  socket.on("disconnect", () => {
    console.log("User was disconnected");
  });
});

function onInit() {
  console.log("===========================");
  console.log("INICIANDO SERVIDOR...");
  console.log("===========================");
}

/** CONNECTION SERVER */

try {
  httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
} catch (error) {
  console.log("Error de conexión con el servidor...", error);
}

onInit();
