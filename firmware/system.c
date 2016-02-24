#include "system.h"

// Enable IOCON clock
void initCLK() {
  // Enable clock for IO configuration block (sec 3.5.14)
  LPC_SYSCON->SYSAHBCLKCTRL |= BIT16;
}
