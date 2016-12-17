function nw(e) {
  var h = 500;
  var w = 500;

  var wndw = window.open(e, "", "scrollbars=1,height=" + Math.min(h, screen.availHeight) + ", width=" + Math.min(w, screen.availWidth) + ",left=" + Math.max(0, (screen.availWidth - w) / 2) + ",top=" + Math.max(0, (screen.availHeight - h) / 2));

  setTimeout(function() {
    wndw.close();
  }, 500);
}