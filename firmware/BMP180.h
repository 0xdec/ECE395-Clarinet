#ifndef _BMP180_H_
#define _BMP180_H_

#include "header.h"

#define BMP180_ADDR 0x77 // 7-bit address

#define BMP180_REG_CONTROL  0xF4
#define BMP180_REG_RESULT   0xF6

#define BMP180_COMMAND_TEMPERATURE  0x2E
#define BMP180_COMMAND_PRESSURE0    0x34
#define BMP180_COMMAND_PRESSURE1    0x74
#define BMP180_COMMAND_PRESSURE2    0xB4
#define BMP180_COMMAND_PRESSURE3    0xF4

bool BMP180_init(void);
uint8_t BMP180_start_temperature(void);
bool BMP180_temperature(double& T);
uint8_t BMP180_start_pressure(uint8_t oversampling);
bool BMP180_pressure(double& P, double& T);
double BMP180_sealevel(double P, double A);
double BMP180_altitude(double P, double P0);

static bool BMP180_int(uint8_t address, int16_t& value);
static bool BMP180_uint(uint8_t address, uint16_t& value);
static bool BMP180_read(uint8_t* values, uint8_t length);
static bool BMP180_write(uint8_t* values, uint8_t length);

#endif
