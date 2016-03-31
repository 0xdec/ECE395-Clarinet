#ifndef _MIDI_H_
#define _MIDI_H_

#include "uart.h"
#include "notes.h"

#define MIDI_BAUD 31250

void MIDI_init(uint8_t chan);
void MIDI_receive(void);

static void MIDI_voice(void);
static void MIDI_sys_common(uint8_t status);
static void MIDI_sys_realtime(uint8_t status);

#endif
