#include "firmware/header.h"

#include "firmware/system.h"
#include "firmware/servo.h"
#include "firmware/midi.h"
#include "firmware/delay.h"

#define RANGE 800
#define ANGLE 90

int main() {
  int pos = 0;
  int dir = 1;

  initCLK();
  initServo();
  //initMIDI();

  // Infinite loop
  while (1) {
    if (pos >= RANGE) {
      dir = 0;
    } else if (pos <= -RANGE) {
      dir = 1;
    }

    if (dir) {
      servoPos(pos++);
    } else {
      servoPos(pos--);
    }

    delay_ms(2);
  }

  return 0;
}