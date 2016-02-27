#include "servo.h"

void initServo() {
  initPWM(PERIOD);
}

void servoPos(int16_t pos) {
  setWidth(NEUTRAL + pos);
}
