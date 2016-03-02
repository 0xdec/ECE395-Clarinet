#ifndef _UART_H_
#define _UART_H_

#include "system.h"

void initUART(uint8_t prescaler);

void sendByte(uint8_t data);
int16_t readByte(void);

#endif
