#ifndef _CLOCK_H_
#define _CLOCK_H_

#include "header.h"

#define KHZ(freq) ((freq) * 1000)
#define MHZ(freq) (KHZ(KHZ(freq)))
#define BAUD(rate, freq) ((freq) / ((rate) * 16))
#define BASE_FREQ (MHZ(48))


void initCLK(void);

#endif
