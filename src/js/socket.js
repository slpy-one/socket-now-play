const socket = new WebSocket("wss://lan.mama.ovh/socket");

const Element = document.querySelector("#element");
const ConnectButton = document.querySelector("#connection");

const userID = "387465159322632202";

const subConfig = `{"op":2,"d":{"subscribe_to_ids":["${userID}"]}}`;

let socketConnectState = 1;

socket.addEventListener("open", (e) => {
  console.log("connected");
});

socket.addEventListener("message", (event) => {
  let data = JSON.parse(event.data);
  console.log(data);
  // console.log(data.op);

  socketConnectState = data.op;

  if (data.op != 0) {
    ConnectButton.innerHTML = "Connect";
  } else {
    ConnectButton.innerHTML = "Disconnect";
  }
});

const connectConfig = () => {
  if (socket.readyState == 1) {
    if (socketConnectState == 1) {
      socket.send(subConfig);
    } else {
    }
  }
};
