#ifndef _SPI_H_
#define _SPI_H_

#include "header.h"

#define SPI_SSEL_PORT 0
#define SPI_SSEL_PIN  2

#define SPI_SCK_PORT  0
#define SPI_SCK_PIN   6

#define SPI_MISO_PORT 0
#define SPI_MISO_PIN  8

#define SPI_MOSI_PORT 0
#define SPI_MOSI_PIN  9

void SPI_init(uint8_t size);
void SPI_transmit(uint16_t data);

#endif
