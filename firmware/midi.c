#include "midi.h"

static uint8_t midiBuffer[3];
static uint8_t midiRemaining = 0;

void initMIDI() {
  // 0x60 (96) gives a baud rate of 31.25 Kbaud
  // 48MHz / 96 / 16 = 31.25KHz
  initUART(BASE_FREQ / (31250 * 16));

  // Enable the UART interrupt
  //NVIC_EnableIRQ(UART_IRQn);
  // Enable RBR interrupt (sec 13.5.4)
  //LPC_UART->IER |= BIT0;
}

void readMIDI() {
  /* get the received byte and clear the interrupt */
  // uint8_t byte = UART_U0RBR;

  int16_t data = readByte();
  uint8_t byte;

  if (data < 0) {
    return;
  } else {
    byte = data & 0xFF;

    if (byte & BIT7) {
      // Status byte
      midiBuffer[0] = byte;

      switch (byte) {
        case 0x80: // Note Off
        case 0x90: // Note On
        case 0xA0: // Aftertouch
        case 0xB0: // Control Change
        case 0xE0: // Pitch Wheel
          midiRemaining = 2;
          break;
        case 0xC0: // Program Change
        case 0xD0: // Channel Pressure
          midiRemaining = 1;
          break;
        case 0xFE: // Ignore active sense
          break;
        case 0xFC: // Stop
        case 0xFF: // Reset
        default:
          midiRemaining = 0;
      }
    } else {
      // Data byte
      if (midiRemaining > 0) {
        midiBuffer[3 - midiRemaining] = byte;
        midiRemaining--;
      }

      if (midiRemaining <= 0) {
        switch (midiBuffer[0]) {
          case 0x80: // Note Off
            noteOff(midiBuffer[1]);
            break;
          case 0x90: // Note On
            noteOn(midiBuffer[1]);
            break;
          default:
            break;
        }
      }
    }
  }
}
