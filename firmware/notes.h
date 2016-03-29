#ifndef _NOTES_H_
#define _NOTES_H_

#include "servo.h"
#include "spi.h"

#define LOWEST_NOTE 51 // Corresponds to a Concert Eb
#define NUM_NOTES   37 // Three octave range

void note_init(void);
void note_on(int8_t note, int8_t velocity);
void note_off(int8_t note);
void note_transpose(int8_t interval);

#endif
