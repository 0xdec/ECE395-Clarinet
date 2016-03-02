#include "spi.h"

void SPI_init() {
  // Select pin function SSEL1 (sec 7.4.2)
  LPC_IOCON->PIO2_0 = (LPC_IOCON->PIO2_0 & ~BIT0) | BIT1;
  // Select pin function SCK1 (sec 7.4.9)
  LPC_IOCON->PIO2_1 = (LPC_IOCON->PIO2_1 & ~BIT0) | BIT1;
  // Select pin function MISO1 (sec 7.4.22)
  LPC_IOCON->PIO2_2 = (LPC_IOCON->PIO2_2 & ~BIT0) | BIT1;
  // Select pin function MOSI1 (sec 7.4.34)
  LPC_IOCON->PIO2_3 = (LPC_IOCON->PIO2_3 & ~BIT0) | BIT1;

  // Enable clock for SPI1 (sec 3.5.14)
  LPC_SYSCON->SYSAHBCLKCTRL |= BIT18;
  // Set SPI clock divider value (sec 3.5.17)
  LPC_SYSCON->SSP1CLKDIV |= 0x01;
  // Set SPI clock prescale value (sec 14.6.5)
  LPC_SYSCON->SSP1CPSR |= 0x02;

  // SPI1 reset de-asserted (sec 3.5.2)
  LPC_SYSCON->PRESETCTRL |= BIT2;
  // 8-bit transfer (sec 14.6.1)
  LPC_SSP1->CR0 |= (BIT2 | BIT1 | BIT0);
  // Enable SPI (sec 14.6.2)
  LPC_SSP1->CR1 |= BIT1;
}

void SPI_send(uint8_t data) {
  // Transmit data (section 14.6.3)
  LPC_SSP1->DR |= data;
}
