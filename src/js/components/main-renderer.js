const Element = document.querySelector("#element");
const ConnectButton = document.querySelector("#connection");

if (isOBS === "true") {
  document.body.classList.toggle("obs");
}
if (pos === "left") {
  document.body.classList.toggle("left");
}
if (pos === "right") {
  document.body.classList.toggle("right");
}

const ElementRenderer = (data) => {
  var payloadData;

  if (data.t == "INIT_STATE") {
    payloadData = data.d[userID];
  } else if (data.t == "PRESENCE_UPDATE") {
    payloadData = data.d;
  } else {
  }

  if (payloadData === undefined) {
    Element.innerHTML = `<div class="card" id="no-user">
  <h1>This user still didn't joined the server</h1>
  <p>
    <a href="https://discord.slpy.one">Click here</a> to join the server.
  </p>
</div>
`;
  } else {
    if (payloadData.spotify != null) {
      if (timeOut != payloadData.spotify.timestamps.end) {
        timeOut = payloadData.spotify.timestamps.end;
      }

      Element.innerHTML = `<div class="card">
      <div class="image">
        <img src="${payloadData.spotify.album_art_url}" alt="album art" />
      </div>
      <div class="info">
        <p>
          Now Playing
        </p>
        <div id="songData">
          <h1>
            <a href="https://open.spotify.com/track/${payloadData.spotify.track_id}" target="_blank">
              ${payloadData.spotify.song}
            </a>
          </h1>
          <h3>${payloadData.spotify.artist}</h3>
          <p>${payloadData.spotify.album}</p>
        </div>
      </div>
    </div>`;
    } else {
      Element.innerHTML = `<div class="card" id="nothing">
      <h1>
        Nothing playing now
      </h1>
    </div>`;
    }
  }
};

if (userID !== null) {
  SocketStartUp();
} else {
  ConnectButton.classList.add("hidden");

  Element.innerHTML = `<div class="card" id="no-id">
  <h1>Welcome to Spotify Now Playing Overlay</h1>
  <p>
    This project is made to help with my streaming overlay while I'm doing
    stream. At first, I think that I gonna use Spotify Official API but I just
    aware of rate limiting and just found websocket api in
    <a href="https://github.com/phineas/lanyard" target="_blank">Lanyard</a>
    which can help me of the rate limiting cause I can use the selfhosted too :D
  </p>
  <h2>
    <u>
      <i> For the usage </i>
    </u>
  </h4>
  <p>
    Just replace your Discord ID in the line below..
  </p>
  <code>
    ${window.location}?id=[discord user id]
  </code>
  <p>
    <b>**Please**</b> Make sure that you have already join our discord server because the onplaying data that gonna show on this website is coming from your discord activity that got from monitoring bot on the server.
  </p>
  <p>
    <b>If you aware of your privacy</b>, I highly recommend to host this one by yourself.
  </p>
  <div>
    <a href="https://discord.slpy.one" target="_blank">Discord Server</a>
    <br>
    <a href="https://github.com/slpy-one/socket-now-play">Github Repo</a>
    <br>
    <a href="https://github.com/phineas/lanyard" target="_blank">Lanyard's Github Repo</a>
  </div>
</div>
`;
}
