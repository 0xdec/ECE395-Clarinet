#ifndef _SYSTEM_H_
#define _SYSTEM_H_

#include "header.h"

#define BASE_FREQ 48000000UL

uint32_t system_init(void);
uint32_t system_micros(void);
uint32_t system_millis(void);

#endif
