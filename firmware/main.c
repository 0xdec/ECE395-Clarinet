#include "include/LPC11xx.h"
#include "include/bitmask.h"

#define FREQUENCY 48

#define PERIOD  20000
#define NEUTRAL 1500
#define RANGE   800
#define ANGLE   90

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
  LPC_TMR16B0->PR = FREQUENCY;
  // The TC will be reset if MR1 matches it (sec 18.7.6)
  LPC_TMR16B0->MCR = BIT4;
  // Set CT16B0_MAT0 to 1 on match (sec 18.7.10)
  LPC_TMR16B0->EMR |= BIT5;
  // Select timer mode (sec 18.7.11)
  LPC_TMR16B0->CCR = 0;
  // PWM mode is enabled for CT16B0_MAT0 (sec 18.7.12)
  LPC_TMR16B0->PWMC = BIT0;

  // Timer counter match value for period (sec 18.7.7)
  LPC_TMR16B0->MR1 = PERIOD;
  // Timer counter match value for pulse width (sec 18.7.7)
  LPC_TMR16B0->MR0 = PERIOD;
}



void delay_us(int delay) {
  delay *= FREQUENCY;
  while (delay--);
}
void delay_ms(int delay) {
  while (delay--) {
    delay_us(1000);
  }
}

void disableCounter() {
  // Disable timer counter (sec 18.7.2)
  LPC_TMR16B0->TCR &= ~BIT0;
}
void enableCounter() {
  // Enable and reset timer counter (sec 18.7.2)
  LPC_TMR16B0->TCR |= (BIT1 + BIT0);
  // Clear reset bit (sec 18.7.2)
  LPC_TMR16B0->TCR &= ~BIT1;
}

void setWidth(uint16_t width) {
  disableCounter();
  // Timer counter match value for pulse width (sec 18.7.7)
  LPC_TMR16B0->MR0 = PERIOD - width;
  enableCounter();
}
/* void setDuty(uint8_t duty) {
  setWidth(PERIOD / (100 - duty));
} */

void servoPos(int16_t pos) {
  setWidth(NEUTRAL + pos);
}



int main() {
  int pos = 0;
  int dir = 1;

  initCLK();
  initPWM();

  // Infinite loop
  while(1) {
    if (pos >= RANGE) {
      dir = 0;
    } else if (pos <= -RANGE) {
      dir = 1;
    }

    if (dir) {
      servoPos(pos++);
    } else {
      servoPos(pos--);
    }

    delay_us(500);
  }

  return 0;
}
