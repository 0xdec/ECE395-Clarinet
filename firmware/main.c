#include "header.h"

#include "system.h"
#include "midi.h"
#include "delay.h"

#define RANGE 800
#define ANGLE 90

int main() {
  system_init();
  MIDI_init();

  // Infinite loop
  while (1) {
    MIDI_receive();
    delay_ms(2);
  }

  return 0;
}
