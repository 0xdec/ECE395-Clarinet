#include "midi.h"

static void MIDI_voice(void);
static void MIDI_sys_common(uint8_t status);
static void MIDI_sys_realtime(uint8_t status);

uint8_t channel = 0;
uint8_t message[3];
uint8_t message_length = 0;
uint8_t message_index;

// Initialize MIDI interface and listen on the given channel
void MIDI_init(uint8_t chan) {
  // Define the channel the clarinet will listen on. Defaults to 1. Range is
  // from 1 to 16, excluding channel 10 (reserved for percussion).
  chan -= 1;
  if ((chan < 16) && (chan != 9)) {
    channel = chan;
  }

  // A 48MHz clock and a prescaler of 0x60 (96) gives a baud rate of 31.25 Kbaud
  UART_init(MIDI_BAUD);
  note_init();
}

// Receive and parse MIDI messages
void MIDI_receive(void) {
  // Update pressure reading
  pressure_update();

  // Check if data has been received
  if (UART_available()) {
    uint8_t byte = UART_receive();
    UART_transmit(byte); // HACK: debugging

    // Determine message type from status byte
    if (byte >= 0xF8) {
      // System Realtime message
      MIDI_sys_realtime(byte);
      return;
    } else if (byte >= 0xF0) {
      // System Common message
      MIDI_sys_common(byte);
      return;
    } else if (byte & BIT(7)) {
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

    // Only store the byte if more bytes are still expected
    if (message_index < message_length) {
      message[message_index++] = byte;

      // Call the message handler if all bytes have been received
      if (message_index == message_length) {
        message_length = 0;
        MIDI_voice();
      }
    }
  }
}

// MIDI voice message handler
static void MIDI_voice(void) {
  switch (message[0]) {
    case 0x80: // Note Off
      note_off(message[1]);
      break;
    case 0x90: // Note On
      note_on(message[1], message[2]);
      break;
    case 0xA0: // Aftertouch
      note_volume(message[1], message[2]);
      break;
    case 0xC0: // Program Change
      // Program 72 is the Clarinet
      if (message[1] == 0x47) {
        note_transpose(2);
      } else {
        note_transpose(0);
      }
      break;
    case 0xD0: // Channel Pressure
      note_volume(note_get(), message[1]);
      break;
    default:
      break;
  }
}

// MIDI system common message handler
static void MIDI_sys_common(uint8_t status) {}

// MIDI system realtime message handler
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
