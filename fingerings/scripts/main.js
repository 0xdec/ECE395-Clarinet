var keySVG = [];
var notes = [];
var currentNote;

var format = function(num, type) {
  let base = type.charAt(0);
  let length = parseInt(type.substr(1));
  let baseInt;

  switch (base) {
    case 'b':
      baseInt = 2;
      break;
    case 'x':
    case 'h':
      base = 'x';
      baseInt = 16;
      break;
  }

  num = num.toString(baseInt);

  return `0${base}${'0'.repeat(length - num.length)}${num}`;
}

var render = function() {
  var note = notes[currentNote];
  note.binary = format(note.number, 'b16');
  note.hex = format(note.number, 'h4');

  for (let key in note.keys) {
    keySVG[key].style('fill', note.keys[key] ? '#000' : '#fff');
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
\nnoteMap[128] = ${allHex}`.replace(/"/g, '');
}

var edit = function(num) {
  if (!notes[num]) {
    notes[num] = {};
    let note = notes[num];

    note.number = 0;
    note.keys = {};
    for (let i = 0; i < 16; i++) {
      note.keys[i] = false;
    }
  }

  currentNote = num;
  render();
};

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

  for (let elem of keySVG) {
    elem.click(function() {
      let note = notes[currentNote];
      let keys = note.keys;
      let key = keySVG.indexOf(this);

      keys[key] = !keys[key];

      let num = Math.pow(2, key);
      note.number += keys[key] ? num : -num;

      render();
    });
  }

  edit(0);
});
