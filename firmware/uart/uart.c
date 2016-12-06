#include "uart.h"

// Initialize UART interface
void UART_init(uint32_t baudrate) {
  // Select pin function RXD (sec 7.4.40)
  *iocon_register[UART_RXD_PORT][UART_RXD_PIN] &= ~BIT(1);
  *iocon_register[UART_RXD_PORT][UART_RXD_PIN] |=  BIT(0);
  // Select pin function TXD (sec 7.4.41)
  *iocon_register[UART_TXD_PORT][UART_TXD_PIN] &= ~BIT(1);
  *iocon_register[UART_TXD_PORT][UART_TXD_PIN] |=  BIT(0);

  // Enable clock for UART (sec 3.5.14)
  LPC_SYSCON->SYSAHBCLKCTRL |= BIT(12);
  // Set UART clock divider value (sec 3.5.16)
  // divider = SystemCoreClock / (baudrate * 16)
  LPC_SYSCON->UARTCLKDIV |= ((SystemCoreClock >> 4) / baudrate) & 0x00FF;

  // Enable UART FIFOs (sec 13.5.6)
  LPC_UART->FCR |= BIT(0);
  // Set 8 bit character width, 1 stop bit, no parity (sec 13.5.7)
  LPC_UART->LCR |= (BIT(1) | BIT(0));
  // Enable UART transmit (sec 13.5.16)
  LPC_UART->TER |= BIT(7);
}

// Transmit one byte (8 bits) via UART
void UART_transmit(uint8_t data) {
  // Transmit data (sec 13.5.2)
  LPC_UART->THR |= data;
}

// Check if bytes are available in the UART receive buffer
uint8_t UART_available(void) {
  // Overrun Error (sec 13.5.9)
  if (LPC_UART->LSR & BIT(1)) {
    return 16;
  } else {
    // Receiver Data Ready (sec 13.5.9)
    return LPC_UART->LSR & BIT(0);
  }
}

// Read the next byte in the UART receive buffer
uint8_t UART_receive(void) {
  // Receiver Buffer Register (sec 13.5.1)
  return LPC_UART->RBR & 0xFF;
}
