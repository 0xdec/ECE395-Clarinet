/*
 * PID library for LPC11xx ARM
 *
 * Forked from the Arduino PID Library (github.com/br3ttb/Arduino-PID-Library)
 * by Brett Beauregard <br3ttb@gmail.com> brettbeauregard.com
 *
 * This library is licensed under a GPLv3 License
 */

#include "pid.h"
#include "time.h"

static double _kp, _ki, _kd, _min, _max, iTerm, lastInput;
static unsigned long _dt, lastTime;
static bool _direction, _mode;

void PID_init(double kp, double ki, double kd, bool direction) {
  _dt   = 100;
  _min  = 0;
  _max  = 255;
  _mode = PID_MANUAL;

  PID_direction(direction);
  PID_params(kp, ki, kd);

  lastTime = time_millis() - _dt;
}

bool PID_compute(void) {
  unsigned long now = time_millis();

  if ((_mode == PID_ON) && (now - lastTime >= _dt)) {
    // Compute the current error
    double error = PID_target - PID_input;
    iTerm = PID_limit(iTerm + _ki * error);

    // Compute PID Output
    PID_output = PID_limit(_kp * error + iTerm - _kd * (PID_input - lastInput));

    // Remember some variables for next time
    lastInput = PID_input;
    lastTime  = now;

    return true;
  }

  return false;
}

// (P)roportional, (I)ntegral, (D)erivative tuning parameters
void PID_params(double kp, double ki, double kd) {
  if (kp < 0 || ki < 0 || kd < 0) {
    return;
  }

  _kp = kp;
  _ki = ki * _dt / 1000;
  _kd = kd * 1000 / _dt;

  if (_direction == PID_REVERSE) {
    _kp = -_kp;
    _ki = -_ki;
    _kd = -_kd;
  }
}

void PID_limits(double min, double max) {
  if (min >= max) {
    return;
  }

  _min = min;
  _max = max;

  if (_mode == PID_ON) {
    PID_output = PID_limit(PID_output);
    iTerm      = PID_limit(iTerm);
  }
}

void PID_period(unsigned long dt) {
  double ratio = (double)dt / _dt;
  _ki *= ratio;
  _kd /= ratio;
  _dt  = dt;
}

void PID_direction(bool direction) {
  if ((_mode == PID_ON) && (direction != _direction)) {
    _kp = -_kp;
    _ki = -_ki;
    _kd = -_kd;
  }

  _direction = direction;
}

void PID_mode(bool mode) {
  if ((mode == PID_ON) && (_mode == PID_OFF)) {
    lastInput = PID_input;
    iTerm     = PID_limit(PID_output);
  }

  _mode = mode;
}

static double PID_limit(double var) {
  if (var > _max) {
    return _max;
  } else if (var < _min) {
    return _min;
  } else {
    return var;
  }
}
