// Play SoundCloud music
function playBackgroundMusic() {
  var widgetIframe = document.getElementById('soundcloud-widget'), widget = SC.Widget(widgetIframe)
  widget.bind(SC.Widget.Events.READY, function() {
    widget.play()
  })
}
