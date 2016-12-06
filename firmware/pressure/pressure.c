#include "pressure.h"

uint32_t check_temperature, check_pressure;
double temperature;
bool has_temperature = false;

// Initialize the BMP180 pressure sensor and PID controller
bool pressure_init(void) {
  if (BMP180_init()) {
    check_temperature = system_millis() + BMP180_start_temperature();
    PID_init(PRESSURE_KP, PRESSURE_KI, PRESSURE_KD, PID_DIRECT);

    return true;
  }

  return false;
}

// Set the target pressure in kPa
void pressure_set(double pressure) {
  PID_setpoint = pressure * 10;
  pressure_update();
}

// Get the current pressure and update the PID loop
void pressure_update(void) {
  // Get the temperature only once
  if (!has_temperature && (system_millis() > check_temperature)) {
    has_temperature = BMP180_temperature(&temperature);

    if (has_temperature) {
      PID_mode(PID_ON);
    }
  }

  // Get the pressure if enough time has elapsed
  if (has_temperature && (system_millis() > check_pressure)) {
    if (BMP180_pressure(&PID_process, &temperature)) {
      // Schedule another pressure measurement
      check_pressure = system_millis() + BMP180_start_pressure(0);
    }
  }

  if (PID_compute()) {
    // Write PID_manipulated via SPI or parallel to DAC
  }
}
