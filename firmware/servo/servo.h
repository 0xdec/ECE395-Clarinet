#ifndef _SERVO_H_
#define _SERVO_H_

#include "header.h"
#include "pwm.h"

// Assumes that 1.5ms is the center-point and 2ms corresponds to 90deg
#define PERIOD  20000
#define NEUTRAL 1500
#define RANGE   500
#define ANGLE   90

void servo_init(int8_t max);
void servo_pos(int8_t deg);

#endif
