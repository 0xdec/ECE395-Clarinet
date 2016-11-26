#ifndef _I2C_H_
#define _I2C_H_

#include "header.h"

void I2C_init(void);
void I2C_transmit(uint8_t address, uint8_t length, uint8_t* data);
void I2C_request(uint8_t address, uint8_t length);
uint8_t I2C_available(void);
uint8_t I2C_read(uint8_t index);

static void I2C_wait(void);
static uint8_t I2C_status(void);
static void I2C_ack(void);
static void I2C_nack(void);
static void I2C_start(void);
static void I2C_address(uint8_t address);
static uint8_t I2C_read_data(void);
static void I2C_write_data(uint8_t data);
static void I2C_stop(void);

#endif
