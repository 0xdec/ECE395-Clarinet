#include "midi.h"

void initMIDI() {
  // 0x60 (96) gives a baud rate of 31.25 Kbaud
  // 48MHz / 96 / 16 = 31.25KHz
  initUART(BAUD(31250, BASE_FREQ));
}
