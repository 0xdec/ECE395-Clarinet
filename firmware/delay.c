#include "delay.h"

// Blocking delay by some number of microseconds
void delay_us(uint32_t delay) {
  delay *= 48;
  while (delay--);

  /* uint8_t i;
  while (delay--) {
    for (i = BASE_FREQ / 1000000; i > 0; i--);
  } */
}

// Blocking delay by some number of milliseconds
void delay_ms(uint32_t delay) {
  while (delay--) {
    delay_us(1000);
  }
}
