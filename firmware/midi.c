#include "midi.h"

static uint8_t channel = 0;

static uint8_t message[3];
static uint8_t message_length = 0;
static uint8_t message_index;

void MIDI_init(uint8_t chan) {
  // Define the channel the clarinet will listen on. Defaults to 1. Range is
  // from 1 to 16, excluding channel 10 (reserved for percussion).
  chan -= 1;
  if ((chan < 16) && (chan != 9)) {
    channel = chan;
  }

  // 0x60 (96) gives a baud rate of 31.25 Kbaud
  // 48MHz / 96 / 16 = 31.25KHz
  UART_init(BASE_FREQ / (31250 * 16));
  note_init();
}

void MIDI_receive() {
  int16_t data = UART_receive();
  uint8_t byte = data & 0xFF;

  // Check if data has been received
  if (data < 0) return;

  UART_send(byte); // HACK: debugging

  // Determine message type from status byte
  if (byte >= 0xF8) {
    // System Realtime message
    MIDI_sys_realtime(byte);
    return;
  } else if (byte >= 0xF0) {
    // System Common message
    MIDI_sys_common(byte);
    return;
  } else if (byte & BIT7) {
    // Voice message
    message_index = 0;

    // Check message channel
    byte ^= channel;

    switch (byte) {
      case 0x80: // Note Off
      case 0x90: // Note On
      case 0xA0: // Aftertouch
      case 0xB0: // Control Change
      case 0xE0: // Pitch Wheel
        message_length = 3;
        break;
      case 0xC0: // Program Change
      case 0xD0: // Channel Pressure
        message_length = 2;
        break;
      default: // Wrong channel
        message_length = 0;
        break;
    }
  }

  if (message_index < message_length) {
    message[message_index++] = byte;

    if (message_index == message_length) {
      message_length = 0;
      MIDI_voice();
    }
  }
}

static void MIDI_voice() {
  switch (message[0]) {
    case 0x80: // Note Off
      note_off(message[1]);
      break;
    case 0x90: // Note On
      note_on(message[1], message[2]);
      break;
    case 0xC0: // Program Change
      // Program 72 is the Clarinet
      if (message[1] == 0x47) {
        note_transpose(2);
      } else {
        note_transpose(0);
      }
      break;
    default:
      break;
  }
}

static void MIDI_sys_common(uint8_t status) {}

static void MIDI_sys_realtime(uint8_t status) {
  switch (status) {
    case 0xF8: // Clock
    case 0xFA: // Start
    case 0xFB: // Continue
    case 0xFC: // Stop
    case 0xFE: // Active Sense
    case 0xFF: // Reset
    default:
      break;
  }
}
