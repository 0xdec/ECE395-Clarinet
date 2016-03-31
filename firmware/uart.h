#ifndef _UART_H_
#define _UART_H_

#include "system.h"

void UART_init(uint8_t prescaler);

void UART_send(uint8_t data);
uint8_t UART_available(void);
uint8_t UART_receive(void);

#endif
