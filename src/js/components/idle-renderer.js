const Element = document.querySelector("#element");
const ConnectButton = document.querySelector("#connection");

let dataStock = "";

function msToTime(ms) {
  var seconds = Math.floor((ms / 1000) % 60)
    .toString()
    .padStart(2, "0");
  var minutes = Math.floor((ms / (1000 * 60)) % 60);
  return minutes + ":" + seconds;
}

const ElementRenderer = (data) => {
  var payloadData;

  if (data.t == "INIT_STATE") {
    payloadData = data.d[userID];
  } else if (data.t == "PRESENCE_UPDATE") {
    payloadData = data.d;
  } else {
    return;
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
    const data = payloadData.spotify;

    if (data != null) {
      if (dataStock !== JSON.stringify(data)) {
        document.querySelector(".bg").style.backgroundImage =
          `url("${data.album_art_url}")`;

        Element.innerHTML = `<div class="card">
  <div class="item-data">
    <div class="image">
      <img src="${data.album_art_url}" alt="album art" />
    </div>
    <div class="info">
      <p class="now-play">
        Now Playing
      </p>
      <div id="songData">
        <h1>
          ${data.song}
        </h1>
        <h3>${data.artist}</h3>
        <p>${data.album}</p>
      </div>
      <div class="button-container">
        <a href="https://open.spotify.com/track/${data.track_id}" target="_blank" class="button">
          Play on Spotify
        </a>
      </div>
    </div>
  </div>
  <!-- <div class="duration">
    <span id="start">0:00</span>
    <div></div>
    <span id="end">0:00</span>
  </div> -->
</div>`;

        // const duration =
        //   Number(data.timestamps.end) - Number(data.timestamps.start);
        // const endDate = msToTime(duration);
        // document.getElementById("end").innerText = endDate;

        // dataStock = JSON.stringify(data);

        // let y = setInterval(() => {
        //   const current =
        //     new Date().getTime() - new Date(data.timestamps.end).getTime();
        //   const percent = (Math.abs(current) / duration) * 100;
        //   const startDate = msToTime(Math.abs(current));

        //   document.getElementById("start").innerText = startDate;

        //   if (current > 0) {
        //     clearInterval(y);
        //   }

        //   document
        //     .querySelector(".duration")
        //     .setAttribute(
        //       "style",
        //       `background-position: ${percent}% !important;`,
        //     );
        // }, 1000);
      }
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
  <div class="code">
    <span>${window.location}?id=</span><form id="user-update"><input type="text" name="id" placeholder="user id"><button type="submit">Submit</button></form>
  </div>
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

if (userID === null) {
  document
    .querySelector("#user-update")
    .addEventListener("submit", (e) => userSubmit(e));
}

function userSubmit(e) {
  e.preventDefault();

  if (e.target.id.value.length < 1) return;

  window.location.href = `${window.location}?id=${e.target.id.value}`;
}
