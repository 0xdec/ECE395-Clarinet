#ifndef _NOTE_H_
#define _NOTE_H_

#include "header.h"

#define LOWEST_NOTE 51 // Corresponds to a Concert Eb
#define NUM_NOTES   37 // Three octave range

// Check that a and b are non-negative and equal
#define COMPARE(a, b) (((b) >= 0) && ((a) == (b)))

void note_init(void);
void note_on(int8_t note, int8_t velocity);
void note_off(int8_t note);
void note_volume(int8_t note, int8_t volume);
void note_transpose(int8_t interval);
int8_t note_get(void);

#endif
