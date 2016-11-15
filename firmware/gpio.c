#include "gpio.h"

// Initialize GPIO interface
void GPIO_init(void) {
  // Enable clock for GPIO (sec 3.5.14)
  LPC_SYSCON->SYSAHBCLKCTRL |= BIT6;
}
