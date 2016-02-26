#ifndef _PWM_H_
#define _PWM_H_

#include "system.h"

void initPWM(uint16_t period, uint16_t pulse_width);
void enablePWM(void);
void disablePWM(void);

void setWidth(uint16_t period, uint16_t width);

#endif
