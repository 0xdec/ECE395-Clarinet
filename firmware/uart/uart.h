#ifndef _UART_H_
#define _UART_H_

#include "../header.h"
#include "../system/system.h"

#define UART_RXD_PORT 1
#define UART_RXD_PIN  6

#define UART_TXD_PORT 1
#define UART_TXD_PIN  7

void UART_init(uint32_t baudrate);
void UART_transmit(uint8_t data);
uint8_t UART_available(void);
uint8_t UART_receive(void);

#endif
