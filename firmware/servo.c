#include "servo.h"

void initServo() {
  initPWM(PERIOD);
}

void servoPos(uint16_t pos) {
  setWidth(NEUTRAL + pos);
}
