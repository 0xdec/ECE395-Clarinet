#ifndef _HEADER_H_
#define _HEADER_H_

#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>
#include <math.h>
#include "LPC11xx/LPC11xx.h"

// Bitmasks
#define BIT(n) (1 << (n))

// Pin Registers
__IO uint32_t *const iocon_register[2][12] = {
  {&LPC_IOCON->RESET_PIO0_0, &LPC_IOCON->PIO0_1, &LPC_IOCON->PIO0_2, &LPC_IOCON->PIO0_3, &LPC_IOCON->PIO0_4, &LPC_IOCON->PIO0_5, &LPC_IOCON->PIO0_6, &LPC_IOCON->PIO0_7, &LPC_IOCON->PIO0_8, &LPC_IOCON->PIO0_9, &LPC_IOCON->SWCLK_PIO0_10, &LPC_IOCON->R_PIO0_11},
  {&LPC_IOCON->R_PIO1_0, &LPC_IOCON->R_PIO1_1, &LPC_IOCON->R_PIO1_2, &LPC_IOCON->SWDIO_PIO1_3, &LPC_IOCON->PIO1_4, &LPC_IOCON->PIO1_5, &LPC_IOCON->PIO1_6, &LPC_IOCON->PIO1_7, &LPC_IOCON->PIO1_8, &LPC_IOCON->PIO1_9, NULL, NULL}
};

#endif
