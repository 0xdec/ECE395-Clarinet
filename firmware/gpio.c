#include "gpio.h"

static LPC_GPIO_TypeDef* GPIO_port(uint8_t port, uint8_t pin);

// Initialize GPIO interface
void GPIO_init(void) {
  // Enable clock for GPIO (sec 3.5.14)
  LPC_SYSCON->SYSAHBCLKCTRL |= BIT(6);
}

// Set pin direction (input or output)
void GPIO_direction(uint8_t port, uint8_t pin, bool direction) {
  LPC_GPIO_TypeDef* port_addr = GPIO_port(port, pin);

  if (!port_addr) {
    return;
  }

  // Set pin direction (sec 12.3.2)
  if (direction) {
    port_addr->DIR |=  BIT(pin); // Output
  } else {
    port_addr->DIR &= ~BIT(pin); // Input
  }
}

// Set output state (low or high)
void GPIO_write(uint8_t port, uint8_t pin, bool state) {
  LPC_GPIO_TypeDef* port_addr = GPIO_port(port, pin);

  if (!port_addr) {
    return;
  }

  // Set output state (sec 12.3.1)
  if (state) {
    port_addr->DATA |=  BIT(pin); // High
  } else {
    port_addr->DATA &= ~BIT(pin); // Low
  }
}

// Read input state
bool GPIO_read(uint8_t port, uint8_t pin) {
  LPC_GPIO_TypeDef* port_addr = GPIO_port(port, pin);

  if (!port_addr) {
    return false;
  }

  // Get input state (sec 12.3.1)
  return port_addr->DATA & BIT(pin);
}

// Get a pointer to the correct port struct
static LPC_GPIO_TypeDef* GPIO_port(uint8_t port, uint8_t pin) {
  if (port == 0 && pin < 12) {
    // Check current pin function
    uint32_t pin_function = *iocon_register[port][pin] & 0x03;
    uint8_t  mask = (pin == 0 || pin > 9) ? 0x01 : 0x00;

    if (pin_function == mask) {
      return LPC_GPIO0;
    }
  } else if (port == 1 && pin < 10) {
    // Check current pin function
    uint32_t pin_function = *iocon_register[port][pin] & 0x03;
    uint8_t  mask = pin < 4 ? 0x01 : 0x00;

    if (pin_function == mask) {
      return LPC_GPIO1;
    }
  }

  return NULL;
}
