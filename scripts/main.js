var keySVG = [];
var notes = [];
var currentNote;

var render = function() {
  var format = function(num, type) {
    var base = type.charAt(0);
    var length = parseInt(type.substr(1));
    var baseInt;

    switch (base) {
      case 'b':
        baseInt = 2;
        break;
      case 'x':
      case 'h':
        base = 'x';
        baseInt = 16;
        break;
      case 'd':
      default:
        base = 'd';
        baseInt = 10;
        break;
    }

    num = num.toString(baseInt);

    return `0${base}${'0'.repeat(length - num.length)}${num}`;
  }

  var note = notes[currentNote];
  note.binary = format(note.number, 'b16');
  note.hex = format(note.number, 'h4');

  for (var key in note.keys) {
    keySVG[key].style('fill', note.keys[key] ? '#00f' : '#fff');
  }

  var json = JSON.stringify(note, function(key, value) {
    if (typeof value == 'boolean') {
      return value ? 'closed' : 'open';
    }

    return value;
  }, 2);
  var allHex = JSON.stringify(notes.map(note => note.hex), null, 2);

  var chart = document.getElementById('fingering');
  chart.textContent = `Note ${currentNote}: ${json}
\nuint16_t noteMap[${notes.length}] = ${allHex}`.replace(/"/g, '');
}

var edit = function(num) {
  if (!notes[num]) {
    notes[num] = {};
    var note = notes[num];

    note.number = 0;
    note.keys = {};
    for (var i = 0; i < 16; i++) {
      note.keys[i] = false;
    }
  }

  currentNote = num;
  render();
};

var next = function() {
  edit((currentNote || 0) + 1);
}

var prev = function() {
  edit((currentNote || 1) - 1);
}

document.getElementById('fingeringChart').addEventListener('load', function() {
  var doc = this.getSVGDocument().children[0];
  var draw = SVG('drawing').size('100%', '100%');
  draw.absorb(doc);
  // var use = draw.use('elementId', 'Clarinet-fingering-template.svg').move(0, 0);

  keySVG.push(SVG.get('path3837'));
  keySVG.push(SVG.get('use3839'));
  keySVG.push(SVG.get('path3769'));
  keySVG.push(SVG.get('use3771'));
  keySVG.push(SVG.get('use3773'));
  keySVG.push(SVG.get('use3775'));
  keySVG.push(SVG.get('use3777'));
  keySVG.push(SVG.get('use3779'));
  keySVG.push(SVG.get('path3781'));
  keySVG.push(SVG.get('path3806'));
  keySVG.push(SVG.get('path3812'));
  keySVG.push(SVG.get('path3819'));
  keySVG.push(SVG.get('path3827'));
  keySVG.push(SVG.get('path3822'));
  keySVG.push(SVG.get('path3825'));
  keySVG.push(SVG.get('use3833'));

  for (var elem of keySVG) {
    elem.click(function() {
      var note = notes[currentNote];
      var keys = note.keys;
      var key = keySVG.indexOf(this);

      keys[key] = !keys[key];

      var num = Math.pow(2, key);
      note.number += keys[key] ? num : -num;

      render();
    });
  }

  edit(0);
});
