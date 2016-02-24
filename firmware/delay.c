#include "delay.h"

void delay_us(int delay) {
  delay *= 48;
  while (delay--);
}

void delay_ms(int delay) {
  while (delay--) {
    delay_us(1000);
  }
}
