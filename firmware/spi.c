#include "spi.h"

// Initialize SPI interface
void SPI_init(uint8_t size) {
  if (size < 4) {
    size = 0x3;
  } else if (size > 16) {
    size = 0xF;
  } else {
    size--;
  }

  // Select pin function SSEL0 (sec 7.4.6)
  *iocon_register[SPI_SSEL_PORT][SPI_SSEL_PIN] &= ~BIT(1);
  *iocon_register[SPI_SSEL_PORT][SPI_SSEL_PIN] |=  BIT(0);
  // Select pin function SCK0 (sec 7.4.18)
  *iocon_register[SPI_SCK_PORT][SPI_SCK_PIN] &= ~BIT(0);
  *iocon_register[SPI_SCK_PORT][SPI_SCK_PIN] |=  BIT(1);
  // Select pin function MOSI0 (sec 7.4.24)
  *iocon_register[SPI_MOSI_PORT][SPI_MOSI_PIN] &= ~BIT(1);
  *iocon_register[SPI_MOSI_PORT][SPI_MOSI_PIN] |=  BIT(0);
  // Select SCK0 function in pin location PIO0_6 (sec 7.4.43)
  LPC_IOCON->SCK_LOC |= BIT(1);

  // Enable clock for SPI0 (sec 3.5.14)
  LPC_SYSCON->SYSAHBCLKCTRL |= BIT(11);
  // Set SPI clock divider value (sec 3.5.15)
  LPC_SYSCON->SSP0CLKDIV |= 0x01;
  // SPI0 reset de-asserted (sec 3.5.2)
  LPC_SYSCON->PRESETCTRL |= BIT(0);

  // Set SPI clock prescale value (sec 14.6.5)
  LPC_SSP0->CPSR |= 0x02;
  // Data size select (sec 14.6.1)
  LPC_SSP0->CR0 |= size;
  // Enable SPI (sec 14.6.2)
  LPC_SSP0->CR1 |= BIT(1);
}

// Transmit one frame via SPI
void SPI_transmit(uint16_t data) {
  // Wait until transmit FIFO not full (sec 14.6.4)
  while (!(LPC_SSP0->SR & BIT(1)));

  // Transmit data (sec 14.6.3)
  LPC_SSP0->DR |= data;
}
