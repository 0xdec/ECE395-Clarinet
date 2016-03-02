#include "spi.h"

void SPI_init() {
  // Select pin function SSEL0 (sec 7.4.6)
  LPC_IOCON->PIO0_2 = (LPC_IOCON->PIO0_2 & ~BIT1) | BIT0;
  // Select pin function MOSI0 (sec 7.4.24)
  LPC_IOCON->PIO0_9 = (LPC_IOCON->PIO0_9 & ~BIT1) | BIT0;
  // Select pin function SCK0 (sec 7.4.25)
  LPC_IOCON->SWCLK_PIO0_10 = (LPC_IOCON->SWCLK_PIO0_10 & ~BIT0) | BIT1;

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

void SPI_send(uint16_t data) {
  // Transmit data (section 14.6.3)
  LPC_SSP0->DR |= data;
}
