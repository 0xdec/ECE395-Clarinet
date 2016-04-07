#include "note.h"

// Starts at F below the staff
static const uint16_t note_map[NUM_NOTES] = {
  0x10fe,
  0x40fe,
  0x00fe,
  0x80fe,
  0x007e,
  0x003e,
  0x005e,
  0x001e,
  0x081e,
  0x000e,
  0x040e,
  0x0006,
  0x0002,
  0x0004,
  0x0000,
  0x0200,
  0x0100,
  0x0101,
  0x20ff,
  0x10ff,
  0x40ff,
  0x00ff,
  0x80ff,
  0x007f,
  0x003f,
  0x005f,
  0x001f,
  0x081f,
  0x000f,
  0x040f,
  0x0007,
  0x0003,
  0x007b,
  0x803b,
  0x805b,
  0x801b,
  0x881b
};

static int8_t current_note = -1;
static int8_t lowest_note = LOWEST_NOTE;

void note_init() {
  servo_init(63);
  SPI_init();
}

void note_on(int8_t note, int8_t velocity) {
  int8_t note_offset = note - lowest_note;

  if (velocity == 0) {
    // A velocity of 0 is equivalent to a note_off command
    note_off(note);
  } else if ((note_offset >= 0) && (note_offset < NUM_NOTES)) {
    current_note = note;
    note_volume(note, velocity);
    SPI_send(note_map[note_offset]);
  }
}

void note_off(int8_t note) {
  if (COMPARE(note, current_note)) {
    note_volume(note, 0);
    SPI_send(0);
    current_note = -1;
  }
}

// TODO: map from note velocity to servo position/air pressure. A velocity of 64
// is the default MIDI velocity, so should be handled as such.
void note_volume(int8_t note, int8_t volume) {
  if (COMPARE(note, current_note)) {
    servo_pos(volume - 64);
  }
}

void note_transpose(int8_t interval) {
  lowest_note = LOWEST_NOTE + interval;
}

int8_t note_get() {
  return current_note;
}
