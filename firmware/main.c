#include "header.h"
#include "system/system.h"
#include "midi/midi.h"

int main() {
  // Initialize all required peripherals
  system_init();
  // Configure MIDI to listen on channel 1
  MIDI_init(1);

	/* UART_init(31250);
	I2C_init();

	uint8_t data = 0xAA;
	I2C_transmit(BMP180_ADDR, 1, &data);
	I2C_request(BMP180_ADDR, 2);
	UART_transmit(I2C_available()); */

  while (1) {
    // Call the receive function to handle incoming MIDI messages
    MIDI_receive();
  }

  return 0;
}
