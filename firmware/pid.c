/*
 * PID library for LPC11xx ARM
 *
 * Forked from the Arduino PID Library (github.com/br3ttb/Arduino-PID-Library)
 * by Brett Beauregard <br3ttb@gmail.com> brettbeauregard.com
 *
 * This library is licensed under a GPLv3 License
 */

#include "pid.h"

static double *_input, *_output, *_target;
static double _kp, _ki, _kd, _min, _max, _iTerm, _lastInput;
static unsigned long _dt, _lastTime;
static bool _direction, _mode;

void PID_init(double* input, double* output, double* target,
              double kp, double ki, double kd, bool direction) {
  _input  = input;
  _output = output;
  _target = target;

  _dt   = 100;
  _min  = 0;
  _max  = 255;
  _mode = PID_MANUAL;

  PID_direction(direction);
  PID_params(kp, ki, kd);

  _lastTime = millis() - _dt;
}

bool PID_compute(void) {
  unsigned long now = millis();

  if ((_mode == PID_ON) && (now - _lastTime >= _dt)) {
    // Compute the current error
    double error = *_target - *_input;
    _iTerm = PID_limit(_iTerm + _ki * error);

    // Compute PID Output
    *_output = PID_limit(_kp * error + _iTerm - _kd * (*_input - _lastInput));

    // Remember some variables for next time
    _lastInput = *_input;
    _lastTime  = now;

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
    *_output = PID_limit(*_output);
    _iTerm   = PID_limit(_iTerm);
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
    _lastInput = *_input;
    _iTerm     = PID_limit(*_output);
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
