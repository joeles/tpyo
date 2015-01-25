
;(function () {

  "use strict";

  var opts = {
        speed: 150,
        speed_variance: 250,
        typo_freq_min: 5,
        typo_freq_max: 20,
        blink_speed: 500,
      },
      buffer, cursor, text, index, timeout;

  function type(selector, txt, options) {
    html(selector);

    text = txt;
    index = 0;

    for (var i in opts) {
      if (options.hasOwnProperty(i) && typeof options[i] === typeof opts[i]) {
        opts[i] = options[i];
      }
    }

    start();
  }

  function start() {
    clearTimeout(timeout);
    next(keypress);
  }

  function stop() {
    clearTimeout(timeout);
    next(blink);
  }

  function keypress() {
    buffer.innerHTML += text[index++];

    if (index < text.length) {
      if ((index % rand(opts.typo_freq_min, opts.typo_freq_max)) === 0) {
        next(typo);
      } else {
        next(keypress);
      }
    } else {
      stop();
    }
  }

  function typo() {
    var keyboard  = "1234567890-qwertyuiop[asdfghjkl;'zxcvbnm,./"
                  + '!@#$%^&*()_QWERTYUIOP{ASDFGHJKL:"ZXCVBNM<>?',
        key_index = keyboard.indexOf(text[index]),
        offsets = [-11, -10, -1, 1, 10, 11],
        typo_char;

    // semi-colons can be part of an html entity leave them alone
    if (text[index] != ';' && key_index > -1) {
      typo_char = keyboard[key_index + offsets[rand(0, (offsets.length - 1))]] || text[index];
      buffer.innerHTML += typo_char;
      next(backspace);
    } else {
      next(keypress);
    }
  }

  function backspace() {
    buffer.innerHTML = buffer.innerHTML.replace(/.$/g, '');
    next(keypress);
  }

  function next(func) {
    timeout = setTimeout(func, opts.speed + rand(0, opts.speed_variance));
  }

  function blink() {
    cursor.style.visibility = (cursor.style.visibility) ? '' : 'hidden';
    timeout = setTimeout(blink, opts.blink_speed);
  }

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function html(selector) {
    document.querySelector(selector).innerHTML = '<span class="text"></span><b class="cursor">|</b>';
    buffer = document.querySelector(selector + ' .text');
    cursor = document.querySelector(selector + ' .cursor');
  }

  window.tpyo = {
    type: type,
    start: start,
    stop: stop
  };

}());
