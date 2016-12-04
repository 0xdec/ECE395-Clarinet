#ifndef _PID_H_
#define _PID_H_

#include "header.h"

#define PID_DIRECT    false
#define PID_REVERSE   true
#define PID_OFF       false
#define PID_MANUAL    false
#define PID_ON        true
#define PID_AUTOMATIC true

double PID_process, PID_manipulated, PID_setpoint;

void PID_init(double kp, double ki, double kd, bool direction);
bool PID_compute(void);
void PID_params(double kp, double ki, double kd);
void PID_limits(double min, double max);
void PID_period(unsigned long dt);
void PID_direction(bool direction);
void PID_mode(bool mode);

static double PID_limit(double var);

#endif
