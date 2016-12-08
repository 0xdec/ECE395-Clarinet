#ifndef _GPIO_H_
#define _GPIO_H_

#include "../header.h"

#define GPIO_INPUT  false
#define GPIO_OUTPUT true
#define GPIO_LOW    false
#define GPIO_HIGH   true

void GPIO_init(void);
void GPIO_direction(uint8_t port, uint8_t pin, bool direction);
void GPIO_write(uint8_t port, uint8_t pin, bool state);
bool GPIO_read(uint8_t port, uint8_t pin);

#endif
