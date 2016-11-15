#include "BMP180.h"
#include "i2c.h"

int16_t AC1, AC2, AC3, VB1, VB2, MB, MC, MD;
uint16_t AC4, AC5, AC6;
double c5, c6, mc, md, x0, x1, x2, y0, y1, y2, p0, p1, p2;

// Initialize library for subsequent pressure measurements
bool BMP180_init(void) {
  I2C_init();

  // The BMP180 includes factory calibration data stored on the device.
  // Each device has different numbers, these must be retrieved and
  // used in the calculations when taking pressure measurements.

  // Retrieve calibration data from device:
  if (BMP180_int(0xAA, AC1)  &&
      BMP180_int(0xAC, AC2)  &&
      BMP180_int(0xAE, AC3)  &&
      BMP180_uint(0xB0, AC4) &&
      BMP180_uint(0xB2, AC5) &&
      BMP180_uint(0xB4, AC6) &&
      BMP180_int(0xB6, VB1)  &&
      BMP180_int(0xB8, VB2)  &&
      BMP180_int(0xBA, MB)   &&
      BMP180_int(0xBC, MC)   &&
      BMP180_int(0xBE, MD)) {

    // If you need to check your math using known numbers,
    // you can uncomment one of these examples.
    // (The correct results are commented in the below functions.)

    // Example from Bosch datasheet
    // AC1 = 408; AC2 = -72; AC3 = -14383; AC4 = 32741; AC5 = 32757; AC6 = 23153;
    // B1 = 6190; B2 = 4; MB = -32768; MC = -8711; MD = 2868;

    // Example from http://wmrx00.sourceforge.net/Arduino/BMP180-Calcs.pdf
    // AC1 = 7911; AC2 = -934; AC3 = -14306; AC4 = 31567; AC5 = 25671; AC6 = 18974;
    // VB1 = 5498; VB2 = 46; MB = -32768; MC = -11075; MD = 2432;

    // Compute floating-point polynomials:
    double c3 = 160.0 * pow(2, -15) * AC3;
    double c4 = pow(10, -3) * pow(2, -15) * AC4;
    double b1 = pow(160, 2) * pow(2, -30) * VB1;
    c5 = (pow(2, -15) / 160) * AC5;
    c6 = AC6;
    mc = (pow(2, 11) / pow(160, 2)) * MC;
    md = MD / 160.0;
    x0 = AC1;
    x1 = 160.0 * pow(2, -13) * AC2;
    x2 = pow(160, 2) * pow(2, -25) * VB2;
    y0 = c4 * pow(2,15);
    y1 = c4 * c3;
    y2 = c4 * b1;
    p0 = (3791.0 - 8.0) / 1600.0;
    p1 = 1.0 - 7357.0 * pow(2, -20);
    p2 = 3038.0 * 100.0 * pow(2, -36);

    return true;
  }

  // Error reading calibration data; bad component or connection?
  return false;
}

// Begin a temperature reading.
// Will return delay in ms to wait, or 0 if I2C error
uint8_t BMP180_start_temperature(void) {
  uint8_t data[2] = {BMP180_REG_CONTROL, BMP180_COMMAND_TEMPERATURE};

  // return the delay in ms (rounded up) to wait before retrieving data
  // or return 0 if there was a problem communicating with the BMP
  return BMP180_write(data, 2) ? 5 : 0;
}

// Retrieve a previously-started temperature reading.
// Requires BMP180_init() to be called once prior to retrieve calibration parameters.
// Requires BMP180_start_temperature() to have been called prior and sufficient time elapsed.
// T: external variable to hold result.
// Returns 1 if successful, 0 if I2C error.
bool BMP180_temperature(double& T) {
  uint8_t data[2];
  data[0] = BMP180_REG_RESULT;

  // good read, calculate temperature
  if (BMP180_read(data, 2)) {
    double tu = (data[0] * 256.0) + data[1];

    //example from Bosch datasheet
    //tu = 27898;

    //example from http://wmrx00.sourceforge.net/Arduino/BMP085-Calcs.pdf
    //tu = 0x69EC;

    double a = c5 * (tu - c6);
    T = a + (mc / (a + md));

    return true;
  }

  return false;
}

// Begin a pressure reading.
// Oversampling: 0 to 3, higher numbers are slower, higher-res outputs.
// Will return delay in ms to wait, or 0 if I2C error.
uint8_t BMP180_start_pressure(uint8_t oversampling) {
  uint8_t data[2], delay;
  data[0] = BMP180_REG_CONTROL;

  switch (oversampling) {
    case 0:
      data[1] = BMP180_COMMAND_PRESSURE0;
      delay = 5;
      break;
    case 1:
      data[1] = BMP180_COMMAND_PRESSURE1;
      delay = 8;
      break;
    case 2:
      data[1] = BMP180_COMMAND_PRESSURE2;
      delay = 14;
      break;
    case 3:
      data[1] = BMP180_COMMAND_PRESSURE3;
      delay = 26;
      break;
    default:
      data[1] = BMP180_COMMAND_PRESSURE0;
      delay = 5;
      break;
  }

  if (BMP180_write(data, 2)) {
    // return the delay in ms (rounded up) to wait before retrieving data
    return delay;
  }

  // or return 0 if there was a problem communicating with the BMP
  return 0;
}

// Retrieve a previously started pressure reading, calculate abolute pressure in mbars.
// Requires BMP180_init() to be called once prior to retrieve calibration parameters.
// Requires BMP180_start_pressure() to have been called prior and sufficient time elapsed.
// Requires recent temperature reading to accurately calculate pressure.

// P: external variable to hold pressure.
// T: previously-calculated temperature.
// Returns 1 for success, 0 for I2C error.

// Note that calculated pressure value is absolute mbars, to compensate for altitude call BMP180_sealevel().
bool BMP180_pressure(double& P, double& T) {
  uint8_t data[3];
  data[0] = BMP180_REG_RESULT;

  // good read, calculate pressure
  if (BMP180_read(data, 3)) {
    double pu = (data[0] * 256.0) + data[1] + (data[2] / 256.0);

    //example from Bosch datasheet
    //pu = 23843;

    //example from http://wmrx00.sourceforge.net/Arduino/BMP085-Calcs.pdf, pu = 0x982FC0;
    //pu = (0x98 * 256.0) + 0x2F + (0xC0/256.0);

    double s = T - 25.0;
    double x = (x2 * pow(s, 2)) + (x1 * s) + x0;
    double y = (y2 * pow(s, 2)) + (y1 * s) + y0;
    double z = (pu - x) / y;
    P = (p2 * pow(z, 2)) + (p1 * z) + p0;

    return true;
  }

  return false;
}

// Given a pressure P (mb) taken at a specific altitude (meters),
// return the equivalent pressure (mb) at sea level.
// This produces pressure readings that can be used for weather measurements.
double BMP180_sealevel(double P, double A) {
  return P / pow(1 - (A / 44330.0), 5.255);
}

// Given a pressure measurement P (mb) and the pressure at a baseline P0 (mb),
// return altitude (meters) above baseline.
double BMP180_altitude(double P, double P0) {
  return 44330.0 * (1 - pow(P / P0, 1 / 5.255));
}



// Read a signed integer (two bytes) from device
// address: register to start reading (plus subsequent register)
// value: external variable to store data (function modifies value)
static bool BMP180_int(uint8_t address, int16_t& value) {
  uint8_t data[2];
  data[0] = address;

  if (BMP180_read(data, 2)) {
    value = (int16_t)((data[0] << 8) | data[1]);
    //if (*value & 0x8000) *value |= 0xFFFF0000; // sign extend if negative

    return true;
  }

  value = 0;
  return false;
}


// Read an unsigned integer (two bytes) from device
// address: register to start reading (plus subsequent register)
// value: external variable to store data (function modifies value)
static bool BMP180_uint(uint8_t address, uint16_t& value) {
  uint8_t data[2];
  data[0] = address;

  if (BMP180_read(data,2)) {
    value = (((uint16_t)data[0] << 8) | (uint16_t)data[1]);

    return true;
  }

  value = 0;
  return false;
}


// Read an array of bytes from device
// values: external array to hold data. Put starting register in values[0].
// length: number of bytes to read
static bool BMP180_read(uint8_t* values, uint8_t length) {
  if (I2C_transmit(BMP180_ADDR, 1, values) == 0x00) {
    I2C_request(BMP180_ADDR, length);

    for (uint8_t i = 0; i < I2C_available(); i++) {
      values[i] = I2C_read();
    }

    return true;
  }

  return false;
}


// Write an array of bytes to device
// values: external array of data to write. Put starting register in values[0].
// length: number of bytes to write
static bool BMP180_write(uint8_t* values, uint8_t length) {
  return I2C_transmit(BMP180_ADDR, length, values) == 0x00;
}
