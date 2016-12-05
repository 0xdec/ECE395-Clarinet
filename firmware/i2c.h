#ifndef _I2C_H_
#define _I2C_H_

#include "header.h"
#include "hardware.h"

void I2C_init(void);
uint8_t I2C_transmit(uint8_t address, uint8_t length, uint8_t* data);
uint8_t I2C_request(uint8_t address, uint8_t length);
uint8_t I2C_available(void);
uint8_t I2C_read(uint8_t index);

#endif
