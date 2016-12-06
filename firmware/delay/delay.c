#include "delay.h"

// Blocking delay by some number of microseconds
void delay_us(uint32_t delay) {
  uint32_t now = system_micros();
  while (system_micros() - now < delay);
}

// Blocking delay by some number of milliseconds
void delay_ms(uint32_t delay) {
  uint32_t now = system_millis();
  while (system_millis() - now < delay);
}
