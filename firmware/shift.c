#include "shift.h"

void shift_out(uint16_t data) {
  UART_send(data & 0xFF);
  UART_send(data >> 8);
}
