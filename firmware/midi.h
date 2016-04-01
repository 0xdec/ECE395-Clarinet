#ifndef _MIDI_H_
#define _MIDI_H_

#include "uart.h"
#include "note.h"

#define MIDI_BAUD 31250

void MIDI_init(uint8_t);
void MIDI_receive(void);

static void MIDI_voice(void);
static void MIDI_sys_common(uint8_t);
static void MIDI_sys_realtime(uint8_t);

#endif
