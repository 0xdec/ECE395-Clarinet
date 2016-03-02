#include "notes.h"

// Starts at Eb below the staff
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
  0x0004,
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

static void shift_out(uint16_t data) {
  SPI_send(data >> 8);
  SPI_send(data & 0xFF);
}

void note_on(int8_t note, int8_t velocity) {
  if (velocity == 0) {
    note_off(note);
  } else {
    note -= LOWEST_NOTE;

    if ((note >= 0) && (note < NUM_NOTES)) {
      current_note = note + LOWEST_NOTE;
      servo_pos(velocity - 64);
      shift_out(note_map[note]);
    }
  }
}

void note_off(int8_t note) {
  if (note == current_note) {
    current_note = -1;
    shift_out(0);
  }
}
