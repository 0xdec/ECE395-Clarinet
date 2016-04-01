#include "header.h"

#include "system.h"
#include "midi.h"

int main() {
  system_init();
  MIDI_init(1);

  while (1) {
    MIDI_receive();
  }

  return 0;
}
