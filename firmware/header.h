#ifndef _HEADER_H_
#define _HEADER_H_

#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>
#include <math.h>
#include "LPC11xx/LPC11xx.h"

// Bitmasks
#define BIT0  (1 << 0)
#define BIT1  (1 << 1)
#define BIT2  (1 << 2)
#define BIT3  (1 << 3)
#define BIT4  (1 << 4)
#define BIT5  (1 << 5)
#define BIT6  (1 << 6)
#define BIT7  (1 << 7)
#define BIT8  (1 << 8)
#define BIT9  (1 << 9)
#define BIT10 (1 << 10)
#define BIT11 (1 << 11)
#define BIT12 (1 << 12)
#define BIT13 (1 << 13)
#define BIT14 (1 << 14)
#define BIT15 (1 << 15)
#define BIT16 (1 << 16)
#define BIT17 (1 << 17)
#define BIT18 (1 << 18)
#define BIT19 (1 << 19)
#define BIT20 (1 << 20)
#define BIT21 (1 << 21)
#define BIT22 (1 << 22)
#define BIT23 (1 << 23)
#define BIT24 (1 << 24)
#define BIT25 (1 << 25)
#define BIT26 (1 << 26)
#define BIT27 (1 << 27)
#define BIT28 (1 << 28)
#define BIT29 (1 << 29)
#define BIT30 (1 << 30)
#define BIT31 (1 << 31)

// Pin Registers
__IO uint32_t *const iocon_register[2][12] = {
  {&LPC_IOCON->RESET_PIO0_0, &LPC_IOCON->PIO0_1, &LPC_IOCON->PIO0_2, &LPC_IOCON->PIO0_3, &LPC_IOCON->PIO0_4, &LPC_IOCON->PIO0_5, &LPC_IOCON->PIO0_6, &LPC_IOCON->PIO0_7, &LPC_IOCON->PIO0_8, &LPC_IOCON->PIO0_9, &LPC_IOCON->SWCLK_PIO0_10, &LPC_IOCON->R_PIO0_11},
  {&LPC_IOCON->R_PIO1_0, &LPC_IOCON->R_PIO1_1, &LPC_IOCON->R_PIO1_2, &LPC_IOCON->SWDIO_PIO1_3, &LPC_IOCON->PIO1_4, &LPC_IOCON->PIO1_5, &LPC_IOCON->PIO1_6, &LPC_IOCON->PIO1_7, &LPC_IOCON->PIO1_8, &LPC_IOCON->PIO1_9, NULL, NULL}
};

#endif
