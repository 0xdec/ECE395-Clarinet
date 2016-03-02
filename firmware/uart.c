#include "uart.h"

// Set up UART
void initUART(uint8_t prescaler) {
  // Select pin function RXD (sec 7.4.40)
  LPC_IOCON->PIO1_6 |= BIT0;
  // Select pin function TXD (sec 7.4.41)
  LPC_IOCON->PIO1_7 |= BIT0;

  // Enable clock for UART (sec 3.5.14)
  LPC_SYSCON->SYSAHBCLKCTRL |= BIT12;

  // Set UART clock divider value (sec 3.5.16)
  LPC_SYSCON->UARTCLKDIV |= prescaler;

  // Enable UART FIFOs (sec 13.5.6)
  LPC_UART->FCR |= BIT0;
  // Set 8 bit character width, 1 stop bit, no parity (sec 13.5.7)
  LPC_UART->LCR |= 0x03;
  // Enable UART transmit (sec 13.5.16)
  LPC_UART->TER |= BIT7;
}

void sendByte(uint8_t data) {
  // Transmit data (sec 13.5.2)
  LPC_UART->THR |= data;
}

int16_t readByte() {
  //if Receiver Data Ready bit set (sec 13.5.9)
  if (LPC_UART->LSR & BIT0) {
    //store received data (sec 13.5.1)
    return LPC_UART->RBR & 0x00FF;
  } else {
    return -1;
  }
}
