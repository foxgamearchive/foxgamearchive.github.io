/* -----------------------------------------------
 * Star Fox Style Starfield Effect
 * Usage: <div id="particles-js"></div>
 * ----------------------------------------------- */

(function () {

  window.pJSDom = [];

  window.particlesJS = function (tag_id, params) {
    if (typeof tag_id !== 'string') { tag_id = 'particles-js'; }
    if (!tag_id) { tag_id = 'particles-js'; }

    var container = document.getElementById(tag_id);
    if (!container) return;

    var existing = container.getElementsByClassName('particles-js-canvas-el');
    while (existing.length) container.removeChild(existing[0]);

    var canvas = document.createElement('canvas');
    canvas.className = 'particles-js-canvas-el';
    canvas.style.width  = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var W, H, cx, cy;
    var NUM_STARS = (params && params.count) || 300;
    var MAX_SPEED = (params && params.maxSpeed) || 12;
    var STAR_COLOR = (params && params.color) || '#ffffff';
    var BG_COLOR = (params && params.bg) || '#000008';
    var TRAIL_ALPHA = (params && params.trail) || 0.2;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      cx = W / 2;
      cy = H / 2;
    }

    window.addEventListener('resize', resize);
    resize();

    function Star() { this.reset(true); }

    Star.prototype.reset = function (randomZ) {
      this.x = (Math.random() - 0.5) * W;
      this.y = (Math.random() - 0.5) * H;
      this.z = randomZ ? Math.random() : 1;
      this.pz = this.z;
    };

    var stars = [];
    for (var i = 0; i < NUM_STARS; i++) stars.push(new Star());

    var startTime = Date.now();
    var RAMP_MS   = 3000;

    function getSpeed() {
      var t = Math.min((Date.now() - startTime) / RAMP_MS, 1);
      return 0.0005 + (MAX_SPEED / 10000) * t * t * t;
    }

    var raf;

    function draw() {
      raf = requestAnimationFrame(draw);
      var speed = getSpeed();

      ctx.fillStyle = hexToRgba(BG_COLOR, TRAIL_ALPHA);
      ctx.fillRect(0, 0, W, H);

      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.pz = s.z;
        s.z -= speed;

        if (s.z <= 0) { s.reset(false); continue; }

        var sx = (s.x / s.z) + cx;
        var sy = (s.y / s.z) + cy;
        var psx = (s.x / s.pz) + cx;
        var psy = (s.y / s.pz) + cy;

        if (sx < 0 || sx > W || sy < 0 || sy > H) { s.reset(false); continue; }

        var bright = Math.min(1, (1 - s.z) * 1.4);
        var size = Math.max(0.4, (1 - s.z) * 3.5);

        ctx.beginPath();
        ctx.moveTo(psx, psy);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = 'rgba(' + getStarColor(i) + ',' + bright + ')';
        ctx.lineWidth = size;
        ctx.stroke();
      }
    }

    draw();

    var instance = {
      destroy: function () {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        canvas.remove();
      }
    };
    window.pJSDom.push(instance);
  };

  window.particlesJS.load = function (tag_id, path_config_json, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path_config_json);
    xhr.onreadystatechange = function (data) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var params = JSON.parse(data.currentTarget.response);
          window.particlesJS(tag_id, params);
          if (callback) callback();
        }
      }
    };
    xhr.send();
  };

  function hexToRgba(hex, alpha) {
    var p = hexToRgbParts(hex);
    return 'rgba(' + p + ',' + alpha + ')';
  }

  function hexToRgbParts(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(function(c){ return c+c; }).join('');
    var n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(',');
  }
  function getStarColor(i) {
  var roll = i % 10;
  if (roll < 7) return '255,255,255';
  if (roll < 8) return '255,50,50';
  if (roll < 9) return '80,220,80';
  return '80,150,255';
}

})();