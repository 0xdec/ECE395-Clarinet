#include "servo.h"

void servo_init() {
  PWM_init(PERIOD);
}

void servo_pos(int16_t pos) {
  PWM_width(NEUTRAL + pos);
}
