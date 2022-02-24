const shuffleArray = (array) => {
  const randomizedArray = array;
  let i = array.length;

  while (i !== 0) {
    const randId = Math.floor(Math.random() * (i + 1));

    const temp = randomizedArray[i];
    randomizedArray[i] = randomizedArray[randId];
    randomizedArray[randId] = temp;
    i -= 1;
  }

  return randomizedArray;
};

function TheWayOfLife(playerId) {
  // Player DOM ID
  this.playerId = playerId;
  // Youtube player reference
  this.player = null;
  // Video index
  this.iterator = 0;
  // Default quality
  this.videoQuality = 'default';
  // Video playslists
  this.videos = null;
  // JSON data path
  this.dataPath = 'data/videos.json';
  // Seconds to hide videos
  this.secondsBeforeVideoEnds = 3;
  // Next call
  this.nextCallTime = new Date();
  // Transcurred time
  this.videoTime = null;

  // Constructor
  this.initialize = function () {
    $.getJSON(this.dataPath, this._jsonReady.bind(this));
  };

  // ~~~~~~~~~~ Private

  this._jsonReady = function (data) {
    const videos = [];
    for (const videoId of Object.keys(data)) {
      const secuences = data[videoId];
      for (const secIndex in secuences) {
        const secuence = secuences[secIndex];
        videos.push({
          id: videoId,
          start: secuence[0],
          end: secuence[1],
        });
      }
    }

    this.videos = shuffleArray(videos);
    this._buildYoutubePlayer();
  };

  this._getCurrentVideo = function () {
    return this.videos[this.iterator];
  };

  this._buildYoutubePlayer = function () {
    const video = this._getCurrentVideo();

    this.player = new YT.Player(this.playerId, {
      height: '1080',
      width: '1920',
      videoId: video.id,
      events: {
        onReady: this._onPlayerReady.bind(this),
        onStateChange: this._onPlayerStateChange.bind(this),
        onError: this._onPlayerError,
      },
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        loop: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        start: video.start,
        end: video.end,
        iv_load_policy: 3,
      },
    });
  };

  this._gotoNextVideo = function (currentVideo) {
    this.iterator = this.iterator + 1 >= this.videos.length ? 0 : this.iterator + 1;
    const video = this._getCurrentVideo();
    this.player.loadVideoById({
      videoId: video.id,
      startSeconds: video.start,
      endSeconds: video.end,
      suggestedQuality: this.videoQuality,
    });
  };

  // ~~~~~~~~~~ Youtube Listeners

  this._onPlayerReady = function (event) {
    event.target.setVolume(0);
    event.target.setPlaybackQuality(this.videoQuality);
    event.target.playVideo();

    // Resize function
    const _selfStrong = this;
    this._resizeVideoIframe();
    $(window).resize(() => {
      _selfStrong._resizeVideoIframe();
    });
  };

  this._onPlayerStateChange = function (event) {
    if (event.data === YT.PlayerState.PLAYING) {
      // Show background
      $('.overlay').css({ background: 'rgba(0, 0, 0, 0.4)' });
      const _selfStrong = this;
      this.videoTime = window.setInterval(() => {
        const currentVideo = _selfStrong._getCurrentVideo();
        const videoTime = Math.floor(_selfStrong.player.getCurrentTime());
        if ((currentVideo.end - _selfStrong.secondsBeforeVideoEnds) === videoTime) {
          // Hide the background
          $('.overlay').css({ background: 'rgba(0, 0, 0, 1)' });
        }
      }, 1000);
    } else if (event.data === YT.PlayerState.ENDED) {
      const differenceTime = (new Date()).getTime() - this.nextCallTime.getTime();
      if (differenceTime > 1000) {
        // Remove time
        if (this.videoTime) {
          this.videoTime = window.clearInterval(this.videoTime);
        }
        // Call the new video
        this._gotoNextVideo(event.target);
        this.nextCallTime = new Date();
      }
    }
  };

  this._onPlayerError = function () {
  };

  // ~~~~~~~~~~ Document helpers

  this._resizeVideoIframe = function () {
    $(`#${this.playerId}`).css({
      width: `${$(window).innerWidth()}px`,
      height: `${$(window).innerHeight()}px`,
    });
  };
}

// ~~~~~ Show intro
$(document).ready(function () {
  $('#dismiss').click(() => {
    $('.intro').addClass('animate__animated animate__fadeOut');
    playBackgroundMusic();
  });
}());
