const Element = document.querySelector("#element");
const ConnectButton = document.querySelector("#connection");

const socketURI = `wss://lan.mama.ovh/socket`;
const userID = "387465159322632202";
const subConfig = `{"op":2,"d":{"subscribe_to_ids":["${userID}"]}}`;
var timeOut = 0;

const ElementRenderer = (data) => {
  var payloadData;

  if (data.t == "INIT_STATE") {
    payloadData = data.d[userID];
  } else if (data.t == "PRESENCE_UPDATE") {
    payloadData = data.d;
  } else {
  }

  console.log(payloadData.spotify);

  if (payloadData.spotify != null) {
    if (timeOut != payloadData.spotify.timestamps.end) {
      timeOut = payloadData.spotify.timestamps.end;
    }

    Element.innerHTML = `<div class="card">
  <div>
    <img src="${payloadData.spotify.album_art_url}" alt="album art" />
  </div>
  <div>
    <h1>
      <a href="https://open.spotify.com/track/${payloadData.spotify.track_id}" target="_blank">
        ${payloadData.spotify.song}
      </a>
    </h1>
    <h3>${payloadData.spotify.artist}</h3>
    <p>${payloadData.spotify.album}</p>
  </div>
</div>

`;
  } else {
    Element.innerHTML = `<h1>
  Nothing playing now
</h1>`;
  }
};

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
    ElementRenderer(data);
  }
};

const socketCloseFunction = (e) => {
  console.log("disconnected");
  buttonHandlerFunction("connect");
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

let x = setInterval(() => {
  let date = new Date().getTime();

  if (socket.readyState < 2) {
    if (timeOut !== 0 && date > timeOut) {
      socket.send(subConfig);
    }
  }
}, [1000]);
