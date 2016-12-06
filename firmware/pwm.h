#ifndef _PWM_H_
#define _PWM_H_

#include "header.h"
#include "system.h"

#define PWM_PORT 0
#define PWM_PIN  8

void PWM_init(uint16_t period);
void PWM_enable(void);
void PWM_disable(void);
void PWM_width(uint16_t width);

#endif
