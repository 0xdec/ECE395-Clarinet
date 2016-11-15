#ifndef _UART_H_
#define _UART_H_

#include "header.h"

void UART_init(uint32_t baudrate);
void UART_transmit(uint8_t data);
uint8_t UART_available(void);
uint8_t UART_receive(void);

#endif
