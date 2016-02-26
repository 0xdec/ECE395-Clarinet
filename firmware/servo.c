#include "servo.h"

void initServo() {
  initPWM(PERIOD, NEUTRAL);
}

void servoPos(uint16_t pos) {
  setWidth(PERIOD, NEUTRAL + pos);
}
