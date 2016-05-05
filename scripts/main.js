var notes = [];
var current = 0;

const size = 30;
const pitches = ['C', '#', 'D', 'b', 'E', 'F', '#', 'G', '#', 'A', 'b', 'B'];
const instruments = {
  clarinet: {
    // From low F to high F
    lowestNote: 51,
    fingerings: [
      0x10fe, 0x40fe, 0x00fe, 0x80fe, 0x007e, 0x003e, 0x005e, 0x001e, 0x081e, 0x000e, 0x040e, 0x0006,
      0x0002, 0x0004, 0x0000, 0x0200, 0x0100, 0x0101, 0x20ff, 0x10ff, 0x40ff, 0x00ff, 0x80ff, 0x007f,
      0x003f, 0x005f, 0x001f, 0x081f, 0x000f, 0x040f, 0x0007, 0x0003, 0x007b, 0x803b, 0x805b, 0x801b,
      0x881b
    ],
    shapes: [
      {
        type: 'rect',
        size: [2.5, 5.5],
        pos: [-3, 9.25],
        fill: '#eee'
      },
      {
        type: 'line',
        size: [3],
        pos: [-3, 6.5],
        stroke: '#eee',
        strokeOpacity: 1,
        strokeWidth: 2
      },
      {
        type: 'line',
        size: [3],
        pos: [-3, 12],
        stroke: '#eee',
        strokeOpacity: 1,
        strokeWidth: 2
      },
      {
        type: 'line',
        size: [3],
        pos: [0, 0]
      },
      {
        type: 'ellipse',
        size: [1.5, 1],
        pos: [-1.5, -7.75],
        fill: '#ddd',
        stroke: '#bbb'
      },
      {
        type: 'ellipse',
        size: [2, 1],
        pos: [-2.5, -11],
        fill: '#ddd',
        stroke: '#bbb'
      },
      {
        type: 'ellipse',
        size: [2, 1],
        pos: [-0.5, -12.25],
        fill: '#ddd',
        stroke: '#bbb'
      },
      {
        type: 'ellipse',
        size: [2, 1],
        pos: [-2.5, -12],
        fill: '#ddd',
        stroke: '#bbb'
      },
      {
        type: 'circle',
        size: [0.75],
        pos: [-2, 1.5],
        fill: '#ddd',
        stroke: '#bbb'
      },
      {
        type: 'circle',
        size: [0.75],
        pos: [-2, 0.5],
        fill: '#ddd',
        stroke: '#bbb'
      },
      {
        type: 'circle',
        size: [0.75],
        pos: [-2, -0.5],
        fill: '#ddd',
        stroke: '#bbb'
      },
      {
        type: 'circle',
        size: [0.75],
        pos: [-2, -1.5],
        fill: '#ddd',
        stroke: '#bbb'
      },
      {
        name: 'key_0',
        type: 'ellipse',
        size: [1, 2.5],
        pos: [-3, 10.5]
      },
      {
        name: 'key_1',
        type: 'circle',
        size: [2],
        pos: [-3, 8]
      },
      {
        name: 'key_2',
        type: 'circle',
        size: [2],
        pos: [0, 8]
      },
      {
        name: 'key_3',
        type: 'circle',
        size: [2],
        pos: [0, 5]
      },
      {
        name: 'key_4',
        type: 'circle',
        size: [2],
        pos: [0, 2]
      },
      {
        name: 'key_5',
        type: 'circle',
        size: [2],
        pos: [0, -3.5]
      },
      {
        name: 'key_6',
        type: 'circle',
        size: [2],
        pos: [0, -6.5]
      },
      {
        name: 'key_7',
        type: 'circle',
        size: [2],
        pos: [0, -9.5]
      },
      {
        name: 'key_8',
        type: 'ellipse',
        size: [1, 2],
        pos: [0, 10.5]
      },
      {
        name: 'key_9',
        type: 'ellipse',
        size: [1, 2.5],
        pos: [1.5, 10]
      },
      {
        name: 'key_10',
        type: 'ellipse',
        size: [1, 1.5],
        pos: [1.5, 4]
      },
      {
        name: 'key_11',
        type: 'ellipse',
        size: [1.5, 1],
        pos: [1.5, 0.75]
      },
      {
        name: 'key_12',
        type: 'ellipse',
        size: [1.5, 1],
        pos: [2.25, -0.75]
      },
      {
        name: 'key_13',
        type: 'ellipse',
        size: [1, 2],
        pos: [1.25, -1.75]
      },
      {
        name: 'key_14',
        type: 'ellipse',
        size: [1, 2],
        pos: [2.25, -2.25]
      },
      {
        name: 'key_15',
        type: 'ellipse',
        size: [2, 1],
        pos: [-0.5, -11.25]
      }
    ]
  }
};

var container = document.getElementById('container');
var doc = draft('Fingering Chart');
var chart = doc.group();
var view = doc.view().size(size * 10, size * 26);
container.appendChild(view.svg());

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

  var note = notes[current];
  note.binary = format(note.number, 'b16');
  note.hex = format(note.number, 'h4');

  for (var key in note.keys) {
    chart.child(`key_${key}`).fillColor(note.keys[key] ? '#000' : '#fff');
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

  var info = document.getElementById('info');
  info.firstElementChild.textContent = 'Current Note';
  info.lastElementChild.textContent = `${current}: ${json}`.replace(/"/g, '');

  var code = document.getElementById('code');
  code.firstElementChild.textContent = 'C-Style Array';
  code.lastElementChild.textContent = `uint16_t noteMap[${notes.length}] = {\n  ${allHex}\n};`;
};
var edit = function(num) {
  current = num;
  render();
};

var prev = function() {
  if (current > 0) {
    edit(current - 1);
  }
};
var create = function(val) {
  var num = notes.length;
  notes[num] = {};
  var note = notes[num];
  var prevNote = notes[current];

  if (val === undefined) {
    val = prevNote.number;
  }

  var getPitch = function(midi) {
    var pitch = midi % 12;
    var octave = (midi - pitch) / 12 - 1;

    if (pitches[pitch] == '#') {
      return `${pitches[pitch - 1]}♯${octave}`;
    } else if (pitches[pitch] == 'b') {
      return `${pitches[pitch + 1]}♭${octave}`;
    } else {
      return `${pitches[pitch]}${octave}`;
    }
  }

  // HACK: change hardcoded intstrument to general function
  note.midi = instruments.clarinet.lowestNote + num;
  //note.concert = getPitch(note.midi);
  note.pitch = getPitch(note.midi + 2);
  note.number = val || 0;
  note.binary = '';
  note.hex = '';
  note.keys = {};

  for (var i = 0; i < 16; i++) {
    note.keys[i] = Boolean((note.number >> i) & 1);
  }

  edit(num);
};
var next = function() {
  if (current + 1 < notes.length) {
    edit(current + 1);
  }
};

var draw = function(instrument) {
  chart.meta.name = instrument;

  var shapes = instruments[instrument].shapes;
  var scale = function(obj) {
    for (var key in obj) {
      switch (typeof obj[key]) {
        case 'object':
          scale(obj[key]);
          break;
        case 'number':
          obj[key] *= size;
          break;
      }
    }
  };
  scale(shapes);

  for (var shape of shapes) {
    var el = chart[shape.type](...shape.size).position(...shape.pos);

    if (el.fill) {
      el.fillColor(shape.fill || '#fff');
      el.fillOpacity(shape.fillOpacity || 0.87);
    }

    el.strokeColor(shape.stroke || '#000');
    el.strokeOpacity(shape.strokeOpacity || 0.87);
    el.strokeWidth((shape.strokeWidth || size) / 10);
    el.meta.name = shape.name;

    if (el.meta.name) {
      el.on('click', function() {
        var note = notes[current];
        var keys = note.keys;
        var key = parseInt(this.target.meta.name.substr('4'));

        keys[key] = !keys[key];
        var num = Math.pow(2, key);
        note.number += keys[key] ? num : -num;

        render();
      });
    }
  }

  var fingerings = instruments[instrument].fingerings;
  for (var i = 0; i < fingerings.length; i++) {
    create(fingerings[i]);
  }
};

draw('clarinet');
edit(0);
