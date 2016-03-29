#include "header.h"

#include "system.h"
#include "delay.h"
#include "midi.h"

int main() {
  system_init();
  MIDI_init();

  while (1) {
    MIDI_receive();
  }

  return 0;
}
