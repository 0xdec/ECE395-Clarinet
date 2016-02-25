#include "midi.h"

void initMIDI() {
  // 0x60 (96) gives a baud rate of 31.25 Kbaud
  // 48MHz / 96 / 16 = 31.25KHz
  initUART(BASE_FREQ / (31250 * 16));

  // Enable the UART interrupt
  NVIC_EnableIRQ(UART_IRQn);
  // Enable RBR interrupt (sec 13.5.4)
  LPC_UART->IER |= BIT0;
}
