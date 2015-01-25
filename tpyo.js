
"use strict";

var tpyo = (function() {

  var element, text, index, options, timeout;

  function typo() {

    var keyboard = 'qwertyuiopasdfghjkl;zxcvbnm,./',
        key_index = keyboard.indexOf(text[index]),
        offsets = [-10, -9, -1, 1, 9, 10],
        typo_char = keyboard[key_index + offsets[rand(0, 5)]] || text[index];

    // semi-colons can be party of an html entity leave them alone
    if (text[index] != ';' && key_index > -1) {
      element.innerHTML += typo_char;
      timeout = setTimeout(backspace, options.speed + rand(0, 100));
    } else {
      timeout = setTimeout(keypress, options.speed + rand(0, 100));
    }
  }

  function backspace() {

    element.innerHTML = element.innerHTML.replace(/.$/g, '');

    timeout = setTimeout(keypress, options.speed + rand(0, 100));
  }

  function keypress() {

    element.innerHTML += text[index++];

    if (index < text.length) {
      if ((index % rand(5, 20)) === 0) {
        timeout = setTimeout(typo, options.speed + rand(0, 100));
      } else {
        timeout = setTimeout(keypress, options.speed + rand(0, 100));
      }
    } else {
      document.querySelector('.typo-cursor').className += ' typo-blink';
    }
  }

  function type(selector, txt, opts) {

    html_css(selector);

    text = txt;
    options = opts;
    index = 0;

    start();
  }

  function start() {
    timeout = setTimeout(keypress, options.speed);
  }

  function stop() {
    clearTimeout(timeout);
  }

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function html_css(selector) {

    var css = '.typo-cursor { opacity: 1; font-weight: 100; } .typo-blink { ',
        style = style = document.createElement('style'),
        vendors = ['-webkit-', '-moz-', '-ms-', '-o-', ''];

    for (var v in vendors)
      css += vendors[v] + 'animation: blink 1s infinite; '

    css += 'margin-left: -5px; } ';

    vendors.pop()
    vendors.unshift('-');

    for (v in vendors)
      css += '@' + vendors[v] + 'keyframes blink { 0% { opacity:1; } 50% { opacity:0; } 100% { opacity:1; } } '

    css += '}';

    style.innerHTML = css;

    document.body.appendChild(style);

    document.querySelector(selector).innerHTML = '<span class="typo-text"></span><span class="typo-cursor">|</span>';
    element = document.querySelector('.typo-text');
  }

  return {
    type: type,
    start: start,
    stop: stop
  };

}());
