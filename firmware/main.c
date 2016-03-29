#include "header.h"

#include "system.h"
#include "spi.h"
#include "delay.h"

int main() {
  uint8_t i = 0;
  system_init();
  SPI_init();

  while (1) {
    SPI_send(i);
    delay_ms(100);
    i++;
  }

  return 0;
}
