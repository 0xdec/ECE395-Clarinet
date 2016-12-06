#ifndef _SYSTEM_H_
#define _SYSTEM_H_

#include "header.h"

#define BASE_FREQ          48000000UL
#define SYSTEM_MS_PER_TICK 10
#define SYSTEM_TICKS_10MS  (SystemCoreClock / (1000 / SYSTEM_MS_PER_TICK))

uint32_t system_init(void);
uint32_t system_micros(void);
uint32_t system_millis(void);

#endif
