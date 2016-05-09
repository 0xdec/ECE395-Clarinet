#include "spi.h"

// Initialize SPI interface
void SPI_init() {
  // Select pin function SSEL0 (sec 7.4.6)
  LPC_IOCON->PIO0_2 = (LPC_IOCON->PIO0_2 & ~BIT1) | BIT0;
  // Select pin function SCK0 (sec 7.4.18)
  LPC_IOCON->PIO0_6 = (LPC_IOCON->PIO0_6 & ~BIT0) | BIT1;
  // Select pin function MOSI0 (sec 7.4.24)
  LPC_IOCON->PIO0_9 = (LPC_IOCON->PIO0_9 & ~BIT1) | BIT0;

  // Select SCK0 function in pin location PIO0_6 (sec 7.4.43)
  LPC_IOCON->SCK_LOC |= BIT1;
  // SPI0 reset de-asserted (sec 3.5.2)
  LPC_SYSCON->PRESETCTRL |= BIT0;
  // Enable clock for SPI0 (sec 3.5.14)
  LPC_SYSCON->SYSAHBCLKCTRL |= BIT11;
  // Set SPI clock divider value (sec 3.5.15)
  LPC_SYSCON->SSP0CLKDIV |= 0x01;

  // Set SPI clock prescale value (sec 14.6.5)
  LPC_SSP0->CPSR |= 0x02;
  // 16-bit transfer (sec 14.6.1)
  LPC_SSP0->CR0 |= 0xF;
  // Enable SPI (sec 14.6.2)
  LPC_SSP0->CR1 |= BIT1;
}

// Send two bytes (16 bits) via SPI
void SPI_send(uint16_t data) {
  // Transmit FIFO not full (sec 14.6.4)
  if (LPC_SSP0->SR & BIT1) {
    // Transmit data (sec 14.6.3)
    LPC_SSP0->DR |= data;
  }
}
