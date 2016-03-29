#ifndef _SERVO_H_
#define _SERVO_H_

#include "pwm.h"

#define PERIOD  20000
#define NEUTRAL 1500
#define RANGE   800
#define ANGLE   90

void servo_init(void);
void servo_pos(int16_t pos);

#endif
