const socket = new WebSocket("wss://lan.mama.ovh/socket");

const subConfig = `{"op":2,"d":{"subscribe_to_ids":["387465159322632202"]}}`;

socket.addEventListener("open", (e) => {
  console.log("connected");
});

socket.addEventListener("message", (event) => {
  console.log(JSON.parse(event.data));
});

const connectConfig = () => {
  socket.send(subConfig);
};
