#ifndef _NOTES_H_
#define _NOTES_H_

#include "servo.h"
#include "spi.h"

#define LOWEST_NOTE 51
#define NUM_NOTES   37

void note_on(int8_t note, int8_t velocity);
void note_off(int8_t note);

#endif
