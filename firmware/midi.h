#ifndef _MIDI_H_
#define _MIDI_H_

#include "header.h"
#include "uart.h"
#include "note.h"

#define MIDI_BAUD 31250

void MIDI_init(uint8_t chan);
void MIDI_receive(void);

#endif
