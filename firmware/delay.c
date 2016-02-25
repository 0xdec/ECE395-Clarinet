#include "delay.h"

inline void delay_us(int delay) {
  delay *= 48;
  while (delay--);
}

inline void delay_ms(int delay) {
  while (delay--) {
    delay_us(1000);
  }
}
