#include "system.h"

// Configure and initialize system (clocks, etc)
uint32_t system_init() {
  // Enable clock for IO configuration block (sec 3.5.14)
  LPC_SYSCON->SYSAHBCLKCTRL |= BIT16;

  // Return the part ID
  // 0x0A40 902B, 0x1A40 902B: LPC1114FDH28/102 or LPC1114FN28/102
  return LPC_SYSCON->DEVICE_ID;
}
