#include "servo.h"

static int8_t max_angle;

// Initialize servo bounds and PWM interface
void servo_init(int8_t max) {
  if (max < 0) {
    max = -max;
  }

  if (max <= ANGLE) {
    max_angle = max;
  } else {
    max_angle = ANGLE;
  }

  PWM_init(PERIOD);
}

// Send the servo to a given degree angle
void servo_pos(int8_t deg) {
  if ((deg <= max_angle) && (deg >= -max_angle)) {
    PWM_width(NEUTRAL + (deg * RANGE / ANGLE));
  }
}
