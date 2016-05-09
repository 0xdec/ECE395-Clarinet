#include "header.h"

#include "system.h"
#include "midi.h"

int main() {
  // Initialize all required peripherals
  system_init();
  // Configure MIDI to listen on channel 1
  MIDI_init(1);

  while (1) {
    // Call the receive function to handle incoming MIDI messages
    MIDI_receive();
  }

  return 0;
}
