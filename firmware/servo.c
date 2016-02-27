#include "servo.h"

void initServo() {
  initPWM(PERIOD, NEUTRAL);
}

void servoPos(int16_t pos) {
  setWidth(PERIOD, NEUTRAL + pos);
}
