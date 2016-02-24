#ifndef _UART_H_
#define _UART_H_

#include "system.h"

void initUART(uint8_t prescaler);

void sendByte(uint8_t data);
uint8_t receiveByte(void);

#endif
