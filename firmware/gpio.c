#include "gpio.h"

// Enable GPIO clock
void GPIO_init() {
  // Enable clock for GPIO (sec 3.5.14)
  LPC_SYSCON->SYSAHBCLKCTRL |= BIT6;
}
