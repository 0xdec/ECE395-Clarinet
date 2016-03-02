#include "midi.h"

static uint8_t MIDI_buffer[3];
static uint8_t MIDI_remaining = 0;

void MIDI_init() {
  // 0x60 (96) gives a baud rate of 31.25 Kbaud
  // 48MHz / 96 / 16 = 31.25KHz
  UART_init(BASE_FREQ / (31250 * 16));
}

void MIDI_receive() {
  int16_t data = UART_receive();
  uint8_t byte;

  if (data < 0) {
    return;
  } else {
    byte = data & 0xFF;

    if (byte & BIT7) {
      // Status byte
      MIDI_buffer[0] = byte;

      switch (byte) {
        case 0x80: // Note Off
        case 0x90: // Note On
        case 0xA0: // Aftertouch
        case 0xB0: // Control Change
        case 0xE0: // Pitch Wheel
          MIDI_remaining = 2;
          break;
        case 0xC0: // Program Change
        case 0xD0: // Channel Pressure
          MIDI_remaining = 1;
          break;
        case 0xFE: // Ignore active sense
          break;
        case 0xFC: // Stop
        case 0xFF: // Reset
        default:
          MIDI_remaining = 0;
      }
    } else {
      // Data byte
      if (MIDI_remaining > 0) {
        MIDI_buffer[3 - MIDI_remaining] = byte;
        MIDI_remaining--;
      }

      if (MIDI_remaining <= 0) {
        switch (MIDI_buffer[0]) {
          case 0x80: // Note Off
            note_off(MIDI_buffer[1]);
            break;
          case 0x90: // Note On
            note_on(MIDI_buffer[1]);
            break;
          default:
            break;
        }
      }
    }
  }
}
