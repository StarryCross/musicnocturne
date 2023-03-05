$(function () {
  var playerTrack = $("#player-track"),
    bgArtwork = $("#bg-artwork"),
    bgArtworkUrl,
    albumName = $("#album-name"),
    trackName = $("#track-name"),
    albumArt = $("#album-art"),
    sArea = $("#s-area"),
    seekBar = $("#seek-bar"),
    trackTime = $("#track-time"),
    insTime = $("#ins-time"),
    sHover = $("#s-hover"),
    playPauseButton = $("#play-pause-button"),
    i = playPauseButton.find("i"),
    tProgress = $("#current-time"),
    tTime = $("#track-length"),
    seekT,
    seekLoc,
    seekBarPos,
    cM,
    ctMinutes,
    ctSeconds,
    curMinutes,
    curSeconds,
    durMinutes,
    durSeconds,
    playProgress,
    bTime,
    nTime = 0,
    buffInterval = null,
    tFlag = false,
    albums = [
      "THE IDOLM@STER CINDERELLA MASTER Cool jewelries! 004",
      "Shōjo☆Kageki Revue Starlight Movie Insert Songs Album Vol. 2",
      "Shōjo☆Kageki Revue Starlight Instrumental Album La Revue en Boîte",
      "Shōjo☆Kageki Revue Starlight Revue Album Arcana Arcadia",
      "Shōjo☆Kageki Revue Starlight Movie Insert Songs Album Vol. 1",
      "Shōjo☆Kageki Revue Starlight Instrumental Album La Revue en Boîte",
      "Shōjo☆Kageki Revue Starlight Movie Insert Songs Album Vol. 2",
      "Shōjo☆Kageki Revue Starlight Instrumental Album La Revue en Boîte",
      "Shōjo☆Kageki Revue Starlight Movie Insert Songs Album Vol. 2",
      "Shōjo☆Kageki Revue Starlight Movie Insert Songs Album Vol. 1",
      "Shōjo☆Kageki Revue Starlight Movie Insert Songs Album Vol. 2"
    ],
    trackNames = [
      "Cinderella Girls - Starry Night",
      "Tatsuya Kato - color temperature",
      "Starlight Kuku Gumi - Pride and Arrogance",
      "Frontier School of Arts - What shines on the darkness",
      "Starlight Kuku Gumi - Wagamama Highway",
      "Starlight Kuku Gumi - Re:CREATE",
      "Starlight Kuku Gumi - Pen : Chikara : Katana",
      "Starlight Kuku Gumi - Starlight",
      "Starlight Kuku Gumi -wi(l)d-screen baroque",
      "Starlight Kuku Gumi - Utsukushiki Hito Arui wa Sore wa",
      "Starlight Kuku Gumi - Super Star Spectacle"
    ],
    albumArtworks = ["_1", "_2", "_3", "_4", "_5", "6", "7", "8", "9", "10", "11"],
    trackUrl = [
      "https://github.com/StarryCross/StarryNight/blob/main/09.Starry%20Night%20(%E3%82%AA%E3%83%AA%E3%82%B7%E3%82%99%E3%83%8A%E3%83%AB%E3%83%BB%E3%82%AB%E3%83%A9%E3%82%AA%E3%82%B1).mp3",
      "https://github.com/StarryCross/StarryNight/blob/main/color%20temperature.mp3",
      "https://github.com/StarryCross/StarryNight/blob/main/Hokori%20to%20Ogori%20Off%20Vocal.mp3",
      "https://github.com/StarryCross/StarryNight/blob/main/ReLIVE%20Arcana%20Arcadia%20%E9%97%87%E3%82%92%E7%85%A7%E3%82%89%E3%81%99%E3%82%82%E3%81%AE%20%20Yami%20o%20Terasu%20Mono%20Instrumental.mp3",
      "https://github.com/StarryCross/StarryNight/blob/main/Revue%20Starlight%20Movie%20%E3%82%8F%E3%81%8B%E3%82%99%E3%81%BE%E3%81%BE%E3%83%8F%E3%82%A4%E3%82%A6%E3%82%A7%E3%82%A4%20%20Wagamama%20Highway%20Instrumental.mp3",
      "https://github.com/StarryCross/StarryNight/blob/main/RECREATE%20Off%20Vocal.mp3",
      "https://github.com/StarryCross/StarryNight/blob/main/Revue%20Starlight%20Movie%20%E3%83%98%E3%82%9A%E3%83%B3%EF%BC%9A%E5%8A%9B%EF%BC%9A%E5%88%80%20%20PenChikaraKatana%20Instrumental.mp3",
      "https://github.com/StarryCross/StarryNight/blob/main/Starlight%20Off%20Vocal.mp3",
      "https://github.com/StarryCross/StarryNight/blob/main/Revue%20Starlight%20Movie%20w(i)ld-screen%20baroque%20Instrumental.mp3",
      "https://github.com/StarryCross/StarryNight/blob/main/Revue%20Starlight%20Movie%20%E7%BE%8E%E3%81%97%E3%81%8D%E4%BA%BA%E6%88%96%E3%81%84%E3%81%AF%E5%85%B6%E3%82%8C%E3%81%AF%20%20Utsukushiki%20Hito%20Arui%20wa%20Sore%20wa%20Instrumental.mp3",
      "https://github.com/StarryCross/StarryNight/blob/main/Revue%20Starlight%20Movie%20%E3%82%B9%E3%83%BC%E3%83%8F%E3%82%9A%E3%83%BC%20%E3%82%B9%E3%82%BF%E3%82%A1%20%E3%82%B9%E3%83%98%E3%82%9A%E3%82%AF%E3%82%BF%E3%82%AF%E3%83%AB%20%20Super%20Star%20Spectacle%20Instrumental.mp3"
    ],
    playPreviousTrackButton = $("#play-previous"),
    playNextTrackButton = $("#play-next"),
    currIndex = -1;

  function playPause() {
    setTimeout(function () {
      if (audio.paused) {
        playerTrack.addClass("active");
        albumArt.addClass("active");
        checkBuffering();
        i.attr("class", "fas fa-pause");
        audio.play();
      } else {
        playerTrack.removeClass("active");
        albumArt.removeClass("active");
        clearInterval(buffInterval);
        albumArt.removeClass("buffering");
        i.attr("class", "fas fa-play");
        audio.pause();
      }
    }, 300);
  }

  function showHover(event) {
    seekBarPos = sArea.offset();
    seekT = event.clientX - seekBarPos.left;
    seekLoc = audio.duration * (seekT / sArea.outerWidth());

    sHover.width(seekT);

    cM = seekLoc / 60;

    ctMinutes = Math.floor(cM);
    ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

    if (ctMinutes < 0 || ctSeconds < 0) return;

    if (ctMinutes < 0 || ctSeconds < 0) return;

    if (ctMinutes < 10) ctMinutes = "0" + ctMinutes;
    if (ctSeconds < 10) ctSeconds = "0" + ctSeconds;

    if (isNaN(ctMinutes) || isNaN(ctSeconds)) insTime.text("--:--");
    else insTime.text(ctMinutes + ":" + ctSeconds);

    insTime.css({ left: seekT, "margin-left": "-21px" }).fadeIn(0);
  }

  function hideHover() {
    sHover.width(0);
    insTime.text("00:00").css({ left: "0px", "margin-left": "0px" }).fadeOut(0);
  }

  function playFromClickedPos() {
    audio.currentTime = seekLoc;
    seekBar.width(seekT);
    hideHover();
  }

  function updateCurrTime() {
    nTime = new Date();
    nTime = nTime.getTime();

    if (!tFlag) {
      tFlag = true;
      trackTime.addClass("active");
    }

    curMinutes = Math.floor(audio.currentTime / 60);
    curSeconds = Math.floor(audio.currentTime - curMinutes * 60);

    durMinutes = Math.floor(audio.duration / 60);
    durSeconds = Math.floor(audio.duration - durMinutes * 60);

    playProgress = (audio.currentTime / audio.duration) * 100;

    if (curMinutes < 10) curMinutes = "0" + curMinutes;
    if (curSeconds < 10) curSeconds = "0" + curSeconds;

    if (durMinutes < 10) durMinutes = "0" + durMinutes;
    if (durSeconds < 10) durSeconds = "0" + durSeconds;

    if (isNaN(curMinutes) || isNaN(curSeconds)) tProgress.text("00:00");
    else tProgress.text(curMinutes + ":" + curSeconds);

    if (isNaN(durMinutes) || isNaN(durSeconds)) tTime.text("00:00");
    else tTime.text(durMinutes + ":" + durSeconds);

    if (
      isNaN(curMinutes) ||
      isNaN(curSeconds) ||
      isNaN(durMinutes) ||
      isNaN(durSeconds)
    )
      trackTime.removeClass("active");
    else trackTime.addClass("active");

    seekBar.width(playProgress + "%");

    if (playProgress == 100) {
      i.attr("class", "fa fa-play");
      seekBar.width(0);
      tProgress.text("00:00");
      albumArt.removeClass("buffering").removeClass("active");
      clearInterval(buffInterval);
    }
  }

  function checkBuffering() {
    clearInterval(buffInterval);
    buffInterval = setInterval(function () {
      if (nTime == 0 || bTime - nTime > 1000) albumArt.addClass("buffering");
      else albumArt.removeClass("buffering");

      bTime = new Date();
      bTime = bTime.getTime();
    }, 100);
  }

  function selectTrack(flag) {
    if (flag == 0 || flag == 1) ++currIndex;
    else --currIndex;

    if (currIndex > -1 && currIndex < albumArtworks.length) {
      if (flag == 0) i.attr("class", "fa fa-play");
      else {
        albumArt.removeClass("buffering");
        i.attr("class", "fa fa-pause");
      }

      seekBar.width(0);
      trackTime.removeClass("active");
      tProgress.text("00:00");
      tTime.text("00:00");

      currAlbum = albums[currIndex];
      currTrackName = trackNames[currIndex];
      currArtwork = albumArtworks[currIndex];

      audio.src = trackUrl[currIndex];

      nTime = 0;
      bTime = new Date();
      bTime = bTime.getTime();

      if (flag != 0) {
        audio.play();
        playerTrack.addClass("active");
        albumArt.addClass("active");

        clearInterval(buffInterval);
        checkBuffering();
      }

      albumName.text(currAlbum);
      trackName.text(currTrackName);
      albumArt.find("img.active").removeClass("active");
      $("#" + currArtwork).addClass("active");

      bgArtworkUrl = $("#" + currArtwork).attr("src");

      bgArtwork.css({ "background-image": "url(" + bgArtworkUrl + ")" });
    } else {
      if (flag == 0 || flag == 1) --currIndex;
      else ++currIndex;
    }
  }

  function initPlayer() {
    audio = new Audio();

    selectTrack(0);

    audio.loop = false;

    playPauseButton.on("click", playPause);

    sArea.mousemove(function (event) {
      showHover(event);
    });

    sArea.mouseout(hideHover);

    sArea.on("click", playFromClickedPos);

    $(audio).on("timeupdate", updateCurrTime);

    playPreviousTrackButton.on("click", function () {
      selectTrack(-1);
    });
    playNextTrackButton.on("click", function () {
      selectTrack(1);
    });
  }

  initPlayer();
});