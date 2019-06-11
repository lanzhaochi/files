(function () {
  window.WaterMark = WaterMark && WaterMark || null;
  var isMark = false
  window.setWatchMart = function (id) {
    if (id && !isMark && window.WaterMark) {
      isMark = true
      try {
        var head = document.getElementsByTagName("head")[0];
        var style = document.getElementById('custom-nis-water-style')
        if (!style) {
          var link = document.createElement("style");
          link.id = "custom-nis-water-style";
          link.rel = "stylesheet";
          link.type = "text/css";
          link.innerHTML = '.nis-water-mark{opacity: 0.01 !important;transition: all 0s ease;}'
          head.appendChild(link);
        }
        window.WaterMark.mark({ "text": id })
      } catch (e) {
        // console.log(e.message)
      }
    }
  }
})()