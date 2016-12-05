#ifndef _SPI_H_
#define _SPI_H_

#include "header.h"
#include "hardware.h"

void SPI_init(uint8_t size);
void SPI_transmit(uint16_t data);

#endif
