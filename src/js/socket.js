const socketURI = config.socketURI;

const subConfig = `{"op":2,"d":{"subscribe_to_ids":["${userID}"]}}`;
var timeOut = 0;
var timeOutStock = 0;
var payload;

const SocketStartUp = () => {
  var socket = new WebSocket(socketURI);

  const socketOpenFunction = (e) => {
    console.log("connected");
    buttonHandlerFunction("connect");
  };

  const socketMessageFunction = (e) => {
    let data = JSON.parse(e.data);

    if (data.op == 1) {
      console.log("ready!");
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

  const reconnect = () => {
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

  ConnectButton.addEventListener("click", () => {
    reconnect();
  });

  let x = setInterval(() => {
    let date = new Date().getTime();

    if (socket.readyState < 2) {
      if (timeOut !== 0 && date > timeOut) {
        if (timeOutStock != 0 && timeOut != timeOutStock) {
          timeOutStock = timeOut;
          socket.send(subConfig);
        } else if (timeOutStock == 0) {
          timeOutStock = timeOut;
        }
      }
    }
  }, [500]);

  let y = setInterval(() => {
    if (socket.readyState < 2) {
      let heartbeat = `{"op":3,"d":{"subscribe_to_ids":["${userID}"]}}`;

      socket.send(heartbeat);
    }
  }, [5000]);
};
