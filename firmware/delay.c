#include "delay.h"

void delay_us(uint32_t delay) {
  delay *= 48;
  while (delay--);
}

void delay_ms(uint32_t delay) {
  while (delay--) {
    delay_us(1000);
  }
}
