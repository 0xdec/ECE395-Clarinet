#ifndef _SERVO_H_
#define _SERVO_H_

#include "pwm.h"

#define PERIOD  20000
#define NEUTRAL 1500

void initServo(void);
void servoPos(uint16_t pos);

#endif
