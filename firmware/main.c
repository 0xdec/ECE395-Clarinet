#include "include/LPC11xx.h"
#include "include/bitmask.h"

const PERIOD = 20000;
const NEUTRAL = 1500;
const RANGE = 400;
const ANGLE_RANGE = 45;

// Enable IOCON clock
static void initCLK() {
  // Enable clock for IO configuration block (sec 3.5.14)
  LPC_SYSCON->SYSAHBCLKCTRL |= BIT16;
}

// Enable GPIO clock
static void initGPIO() {
  // Enable clock for GPIO (sec 3.5.14)
  LPC_SYSCON->SYSAHBCLKCTRL |= BIT6;
}

// Set up 16 bit timer for PWM
static void initPWM() {
  // Select pin function CT16B0_MAT0 (sec 7.4.23)
  LPC_IOCON->PIO0_8 |= BIT1;
  // Select standard GPIO output mode (sec 7.4.23)
  LPC_IOCON->PIO0_8 &= ~BIT10;

  // Enable clock for 16-bit counter/timer 0 (sec 3.5.14)
  LPC_SYSCON->SYSAHBCLKCTRL |= BIT7;

  // Prescale max value (sec 18.7.4)
  LPC_TMR16B0->PR = 50;
  // The TC will be reset if MR1 matches it (sec 18.7.6)
  LPC_TMR16B0->MCR = BIT4;
  // Set CT16B0_MAT0 to 1 on match (sec 18.7.10)
  LPC_TMR16B0->EMR |= BIT5;
  // Select timer mode (sec 18.7.11)
  LPC_TMR16B0->CCR = 0;
  // PWM mode is enabled for CT16B0_MAT0 (sec 18.7.12)
  LPC_TMR16B0->PWMC = BIT0;
}

static void disableCounter() {
  // Disable timer counter (sec 18.7.2)
  LPC_TMR16B0->TCR &= ~BIT0;
}
static void enableCounter() {
  // Enable and reset timer counter (sec 18.7.2)
  LPC_TMR16B0->TCR |= (BIT1 + BIT0);
  // Clear reset bit (sec 18.7.2)
  LPC_TMR16B0->TCR &= ~BIT1;
}



void setPeriod(uint16_t period) {
  disableCounter();
  // Timer counter match value for period (sec 18.7.7)
  LPC_TMR16B0->MR1 = period;
  enableCounter();
}
void setDuty(uint16_t duty) {
  disableCounter();
  // Timer counter match value for duty cycle (sec 18.7.7)
  LPC_TMR16B0->MR0 = duty;
  enableCounter();
}

void setPWM(int16_t angle) {
  if ((angle < ANGLE_RANGE) && (angle > -ANGLE_RANGE)) {
    setDuty(NEUTRAL + RANGE * (angle / ANGLE_RANGE));
  }
}



int main() {
  initCLK();
  // initGPIO();
  initPWM();
  setPeriod(PERIOD);

  // Change this to change the PWM value
  setPWM(0);

  //infinite loop
  while(1) {}

  return 0;
}
