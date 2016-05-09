#include "uart.h"

// Initialize UART interface
void UART_init(uint32_t baudrate) {
  // Select pin function RXD (sec 7.4.40)
  LPC_IOCON->PIO1_6 = (LPC_IOCON->PIO1_6 & ~BIT1) | BIT0;
  // Select pin function TXD (sec 7.4.41)
  LPC_IOCON->PIO1_7 = (LPC_IOCON->PIO1_7 & ~BIT1) | BIT0;

  // Enable clock for UART (sec 3.5.14)
  LPC_SYSCON->SYSAHBCLKCTRL |= BIT12;
  // Set UART clock divider value (sec 3.5.16)
  LPC_SYSCON->UARTCLKDIV |= (uint8_t)((BASE_FREQ >> 4) / baudrate);

  // Enable UART FIFOs (sec 13.5.6)
  LPC_UART->FCR |= BIT0;
  // Set 8 bit character width, 1 stop bit, no parity (sec 13.5.7)
  LPC_UART->LCR |= (BIT1 | BIT0);
  // Enable UART transmit (sec 13.5.16)
  LPC_UART->TER |= BIT7;
}

// Send one byte (8 bits) via UART
void UART_send(uint8_t data) {
  // Transmit data (sec 13.5.2)
  LPC_UART->THR |= data;
}

// Check if bytes are available in the UART receive buffer
uint8_t UART_available() {
  // Overrun Error (sec 13.5.9)
  if (LPC_UART->LSR & BIT1) {
    return 16;
  } else {
    // Receiver Data Ready (sec 13.5.9)
    return LPC_UART->LSR & BIT0;
  }
}

// Read the next byte in the UART receive buffer
uint8_t UART_receive() {
  // Receiver Buffer Register (sec 13.5.1)
  return LPC_UART->RBR & 0xFF;
}
