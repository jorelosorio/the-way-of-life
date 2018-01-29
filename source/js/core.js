function TheWayOfLife(playerId) {
  // Player DOM ID
  this.playerId = playerId
  // Youtube player reference
  this.player = null
  // Video index
  this.iterator = 0
  // Default quality
  this.videoQuality = "default"
  // Video playslists
  this.videos = null
  // JSON data path
  this.dataPath = "data/videos.json"
  // Seconds to hide videos
  this.secondsBeforeVideoEnds = 3
  // Next call
  this.nextCallTime = new Date()
  // Transcurred time
  this.videoTime = null

  // Constructor
  this.initialize = function() {
    $.getJSON(this.dataPath, this.__jsonReady.bind(this))
  }

  // ~~~~~~~~~~ Private

  this.__jsonReady = function(data) {
    var videos = []
    for (var videoId in data) {
      $.each(data[videoId], function(index, secuence) {
        videos.push({
          "id": videoId,
          "start": secuence[0],
          "end": secuence[1]
        })
      })
    }
    this.videos = videos.shuffle()
    this.__buildYoutubePlayer()
  }

  this.__getCurrentVideo = function() {
    return this.videos[this.iterator]
  }

  this.__buildYoutubePlayer = function() {
    var video = this.__getCurrentVideo()

    this.player = new YT.Player(this.playerId, {
      height: '1080',
      width: '1920',
      videoId: video.id,
      events: {
        'onReady': this.__onPlayerReady.bind(this),
        'onStateChange': this.__onPlayerStateChange.bind(this),
        'onError': this.__onPlayerError
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
        iv_load_policy: 3
      }
    })
  }

  this.__gotoNextVideo = function(currentVideo) {
    this.iterator = this.iterator + 1 >= this.videos.length ? 0 : this.iterator + 1
    var video = this.__getCurrentVideo()
    this.player.loadVideoById({
      videoId: video.id,
      startSeconds: video.start,
      endSeconds: video.end,
      suggestedQuality: this.videoQuality
    })
  }

  // ~~~~~~~~~~ Youtube Listeners

  this.__onPlayerReady = function(event) {
    event.target.setVolume(0)
    event.target.setPlaybackQuality(this.videoQuality)
    event.target.playVideo()

    // Resize function
    var __selfStrong = this
    this.__resizeVideoIframe()
    $(window).resize(function() {
      __selfStrong.__resizeVideoIframe()
    })
  }

  this.__onPlayerStateChange = function(event) {
    if (event.data == YT.PlayerState.PLAYING) {
      // Show background
      $(".overlay").css({"background": "rgba(0, 0, 0, 0.4)"})
      var __selfStrong = this
      this.videoTime = window.setInterval(function() {
        var currentVideo = __selfStrong.__getCurrentVideo()
        var videoTime = Math.floor(__selfStrong.player.getCurrentTime())
        if ((currentVideo.end - __selfStrong.secondsBeforeVideoEnds) == videoTime) {
          // Hide the background
          $(".overlay").css({"background": "rgba(0, 0, 0, 1)"})
        }
      }, 1000)
    } else if (event.data === YT.PlayerState.ENDED) {
      var differenceTime = (new Date()).getTime() - this.nextCallTime.getTime()
      if (differenceTime > 1000) {
        // Remove time
        if (this.videoTime) {
          this.videoTime = window.clearInterval(this.videoTime)
        }
        // Call the new video
        this.__gotoNextVideo(event.target)
        this.nextCallTime = new Date()
      }
    }
  }

  this.__onPlayerError = function(event) {
  }

  // ~~~~~~~~~~ Document helpers

  this.__resizeVideoIframe = function() {
    $('#'+this.playerId).css({
      "width": $(window).innerWidth() + 'px',
      "height": $(window).innerHeight() + 'px'
    })
  }
}

// ~~~~~ Show intro
$(document).ready(function() {
  $("#dismiss").click(function(event) {
    $(".intro").addClass('animated fadeOut')
    playBackgroundMusic()
  })
}())
