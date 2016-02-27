var keySVG = [];
var notes = [];
var currentNote;

// From F to F
var clarinetNotes = [
  0x10fe, 0x40fe, 0x00fe, 0x80fe, 0x007e, 0x003e, 0x005e, 0x001e, 0x081e, 0x000e, 0x040e, 0x0006,
  0x0002, 0x0004, 0x0000, 0x0200, 0x0100, 0x0101, 0x20ff, 0x10ff, 0x40ff, 0x00ff, 0x80ff, 0x007f,
  0x003f, 0x005f, 0x001f, 0x081f, 0x000f, 0x040f, 0x0007, 0x0003, 0x007b, 0x803b, 0x805b, 0x801b,
  0x881b
];

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
    keySVG[key].style('fill', note.keys[key] ? '#444' : '#bbb');
  }

  var json = JSON.stringify(note, function(key, value) {
    if (typeof value == 'boolean') {
      return value ? 'closed' : 'open';
    } else if (key === 'number') {
      return;
    }

    return value;
  }, 2);
  var allHex = notes.map(note => note.hex).join(',\n  ');

  var chart = document.getElementById('chart');
  chart.textContent = `Note ${currentNote}: ${json}
\nuint16_t noteMap[${notes.length}] = {\n  ${allHex}\n}`.replace(/"/g, '');
}

var edit = function(num) {
  if (!notes[num]) {
    notes[num] = {};
    var note = notes[num];
    var prevNote = notes[currentNote || 0];

    note.number = clarinetNotes[num] || prevNote.number || 0;
    note.keys = {};
    for (var i = 0; i < 16; i++) {
      note.keys[i] = Boolean((note.number >> i) & 1);
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

  var keyIDs = [
    'path3837',
    'use3839',
    'path3769',
    'use3771',
    'use3773',
    'use3775',
    'use3777',
    'use3779',
    'path3781',
    'path3806',
    'path3812',
    'path3819',
    'path3827',
    'path3822',
    'path3825',
    'use3833'
  ];

  var getPath = function(id) {
    id = id.replace('#', '');
    var elem = SVG.get(id);

    if (elem.type === 'use') {
      return getPath(elem.node.href.baseVal);
    }

    return id;
  };

  var convert = function(id) {
    var elem = SVG.get(id);
    var pos = elem.transform();

    elem = elem.replace(SVG.get(getPath(id)).clone());
    elem.attr('id', id);

    if (id !== 'use3833' && id !== 'use3817') {
      pos = {
        x: pos.x / elem.transform().scaleX,
        y: pos.y / elem.transform().scaleY
      }
    }

    elem.transform(pos, true);

    return elem;
  };

  convert('use3817');

  keyIDs.forEach(function(id) {
    var elem = SVG.get(id);

    if (elem.type === 'use') {
      elem = convert(id);
    }

    elem.style('stroke', '#333');
    elem.click(function() {
      var note = notes[currentNote];
      var keys = note.keys;
      var key = keySVG.indexOf(this);

      keys[key] = !keys[key];

      var num = Math.pow(2, key);
      note.number += keys[key] ? num : -num;

      render();
    });
    keySVG.push(elem);
  });

  for (var i = clarinetNotes.length || 1; i > 0; i--) {
    edit(i - 1);
  }
});
