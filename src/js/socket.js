const Element = document.querySelector("#element");
const ConnectButton = document.querySelector("#connection");

const socketURI = `wss://lan.mama.ovh/socket`;
const userID = "387465159322632202";
const subConfig = `{"op":2,"d":{"subscribe_to_ids":["${userID}"]}}`;
var payload;

var socket = new WebSocket(socketURI);

const socketOpenFunction = (e) => {
  console.log("connected");
  buttonHandlerFunction("connect");
};

const socketMessageFunction = (e) => {
  let data = JSON.parse(e.data);

  if (data.op == 1) {
    // console.log("ready!");
    socket.send(subConfig);
  } else if (data.op == 0) {
    payload = data;
  }

  console.log(data);
};

const socketCloseFunction = (e) => {
  console.log("disconnected");
};

const buttonHandlerFunction = (e) => {
  if (e == "connect") {
    ConnectButton.innerHTML = "Disconnect";
  } else {
    ConnectButton.innerHTML = "Connect";
  }
};

const socketListener = () => {
  socket.addEventListener("open", (e) => socketOpenFunction(e));

  socket.addEventListener("message", (e) => socketMessageFunction(e));

  socket.addEventListener("close", (e) => socketCloseFunction(e));
};

socketListener();

const connectConfig = () => {
  console.log(socket.readyState);
  // socket.readyState();
  if (socket.readyState < 2) {
    socket.close();
    buttonHandlerFunction("");
  } else {
    buttonHandlerFunction("connect");

    socket = new WebSocket(socketURI);
    socketListener();
  }
};
