#ifndef _PRESSURE_H_
#define _PRESSURE_H_

#include "../header.h"
#include "../system/system.h"
#include "../BMP180/BMP180.h"
#include "../pid/pid.h"

#define PRESSURE_SEA_LEVEL 101.325 // 1013.25 mbar

#define PRESSURE_KP 2.00 // [2, 100]
#define PRESSURE_KI 0.02 // [0.02, 10]
#define PRESSURE_KD 0.02 // [0.02, 0.1]

bool pressure_init(void);
void pressure_set(double pressure);
void pressure_update(void);

#endif
