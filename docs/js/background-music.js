// Play SoundCloud music
function playBackgroundMusic() {
  const widgetIframe = document.getElementById('soundcloud-widget');
  const widget = SC.Widget(widgetIframe);
  widget.bind(SC.Widget.Events.READY, () => {
    widget.play();
  });
}
