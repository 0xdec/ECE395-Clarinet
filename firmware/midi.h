#ifndef _MIDI_H_
#define _MIDI_H_

#include "uart.h"
#include "notes.h"

void MIDI_init(uint8_t channel);
void MIDI_receive(void);

#endif
