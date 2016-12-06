#include "system.h"

volatile uint32_t tick_counter;

void SysTick_Handler(void) {
  tick_counter++;
}

// Configure and initialize system (clocks, etc)
uint32_t system_init(void) {
  // Enable clock for IO configuration block (sec 3.5.14)
  LPC_SYSCON->SYSAHBCLKCTRL |= BIT(16);

  // Enable system tick interrupt
  NVIC_EnableIRQ(SysTick_IRQn);
  // Enable system tick counter (10ms tick interval)
  SysTick_Config(SystemCoreClock / 100);

  // Return the part ID
  // 0x0A40 902B, 0x1A40 902B: LPC1114FDH28/102 or LPC1114FN28/102
  return LPC_SYSCON->DEVICE_ID;
}

uint32_t system_micros(void) {
  return tick_counter * 10000;
}

uint32_t system_millis(void) {
  // return 0x00FFFFFF - SysTick->VAL;
  return tick_counter * 10;
}
