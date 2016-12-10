#include "i2c.h"

static void I2C_wait(void);
static uint8_t I2C_status(void);
static void I2C_ack(void);
static void I2C_nack(void);
static void I2C_start(void);
static void I2C_address(uint8_t address);
static uint8_t I2C_read_data(void);
static void I2C_write_data(uint8_t data);
static void I2C_stop(void);

uint8_t mode      = 0;
uint8_t available = 0;
uint8_t buffer[256];

// Initialize I2C interface
void I2C_init(void) {
  // Select pin function SCL (sec 7.4.11)
  *iocon_register[I2C_SCL_PORT][I2C_SCL_PIN] &= ~BIT(1);
  *iocon_register[I2C_SCL_PORT][I2C_SCL_PIN] |=  BIT(0);
  // Select Fast-mode Plus I2C (sec 7.4.11)
  *iocon_register[I2C_SCL_PORT][I2C_SCL_PIN] &= ~BIT(8);
  *iocon_register[I2C_SCL_PORT][I2C_SCL_PIN] |=  BIT(9);
  // Select pin function SDA (sec 7.4.12)
  *iocon_register[I2C_SDA_PORT][I2C_SDA_PIN] &= ~BIT(1);
  *iocon_register[I2C_SDA_PORT][I2C_SDA_PIN] |=  BIT(0);
  // Select Fast-mode Plus I2C (sec 7.4.12)
  *iocon_register[I2C_SDA_PORT][I2C_SDA_PIN] &= ~BIT(8);
  *iocon_register[I2C_SDA_PORT][I2C_SDA_PIN] |=  BIT(9);

  // Enable clock for I2C (sec 3.5.14)
  LPC_SYSCON->SYSAHBCLKCTRL |= BIT(5);
  // I2C reset de-asserted (sec 3.5.2)
  LPC_SYSCON->PRESETCTRL |= BIT(1);

  // High duty cycle register for PCLK=48MHz (sec 15.7.5)
  LPC_I2C->SCLH = 0x0018;
  // Low duty cycle register for PCLK=48MHz (sec 15.7.5)
  LPC_I2C->SCLL = 0x0018;
  // Enable I2C interface (sec 15.7.1)
  LPC_I2C->CONSET |= BIT(6);
}

// Transmit data via I2C
uint8_t I2C_transmit(uint8_t address, uint8_t length, uint8_t* data) {
  // Master transmit mode
  mode      = 0;
  uint8_t i = 0;

  I2C_start();

  while (true) {
    // Get status
    uint8_t status = I2C_status();
		// UART_transmit(status);

    if (status == 0x08 || status == 0x10) {
      /*
       * 0x08: A START condition has been transmitted.
       * 0x10: A repeated START condition has been transmitted.
       *  - Load SLA+W into DAT
       *  - Clear STA
       */

      // Transmit slave address and data direction bit
      I2C_address(address);

      // Clear STA bit (sec 15.7.6)
      LPC_I2C->CONCLR = BIT(5);
    } else if (status == 0x18 || status == 0x28) {
      /*
       * 0x18: SLA+W has been transmitted, ACK has been received.
       * 0x28: Data byte in DAT has been transmitted, ACK has been received.
       *  - Load data byte into DAT
       *    or
       *  - Transmit STOP condition
       */

      if (i < length) {
        // Transmit data byte
        I2C_write_data(data[i++]);
      } else {
        I2C_stop();
        return 0x00;
      }
    } else if (status == 0x20 || status == 0x30) {
      /*
       * 0x20: SLA+W has been transmitted, NOT ACK has been received.
       * 0x30: Data byte in DAT has been transmitted, NOT ACK has been received.
       *  - Transmit STOP condition
       */

      I2C_stop();
      return 0x00;
    } else if (status == 0x38) {
      /*
       * 0x38: Arbitration lost in SLA+R/W or data bytes.
       * 0x00: Bus error has occurred during an I2C serial transfer.
       *  - Exit
       */

      return status;
    } else if (status == 0x00) {
      /*
       * 0x00: Bus error durring MST, due to an illegal START or STOP condition.
       *  - Set STO
       *  - Clear SI
       *  - Exit
       */

      I2C_stop();
      return status;
    }

    // Clear SI bit (sec 15.7.6)
    LPC_I2C->CONCLR = BIT(3);
  }
}

// Request data via I2C
uint8_t I2C_request(uint8_t address, uint8_t length) {
  // Master receive mode
  mode = 1;
  available = 0;

  I2C_start();

  while (true) {
    // Get status
    uint8_t status = I2C_status();
		// UART_transmit(status);

    if (status == 0x08 || status == 0x10) {
      /*
       * 0x08: A START condition has been transmitted.
       * 0x10: A repeated START condition has been transmitted.
       *  - Load SLA+R into DAT
       */

      // Transmit slave address and data direction bit
      I2C_address(address);
    } else if (status == 0x38) {
      /*
       * 0x38: Arbitration lost in NOT ACK bit.
       *  - Exit
       */

      return status;
    } else if (status == 0x40 || status == 0x48) {
      /*
       * 0x40: SLA+R has been transmitted, ACK has been received.
       *  - Set AA
       */

      I2C_ack();
    } else if (status == 0x48) {
      /*
       * 0x48: SLA+R has been transmitted, NOT ACK has been received.
       *  - Transmit STOP condition
       */

      I2C_stop();
      return 0x00;
    } else if (status == 0x50) {
      /*
       * 0x50: Data byte has been received, ACK has been returned.
       *  - Read data byte
       *  - Set AA
       *    or
       *  - Clear AA
       */

      buffer[available++] = I2C_read_data();

      if (available < length) {
        I2C_ack();
      } else {
        I2C_nack();
      }
    } else if (status == 0x58) {
      /*
       * 0x58: Data byte has been received, NOT ACK has been returned.
       *  - Read data byte
       *  - Transmit STOP condition
       */

      buffer[available++] = I2C_read_data();
      I2C_stop();
      return 0x00;
    } else if (status == 0x00) {
      /*
       * 0x00: Bus error durring MST, due to an illegal START or STOP condition.
       *  - Set STO
       *  - Clear SI
       *  - Exit
       */

      I2C_stop();
      return status;
    }

    // Clear SI bit (sec 15.7.6)
    LPC_I2C->CONCLR = BIT(3);
  }
}

// Get number of received data bytes
uint8_t I2C_available(void) {
  return available;
}

// Read a received data byte
uint8_t I2C_read(uint8_t index) {
  return available && index < available ? buffer[index] : 0;
}



// Wait for SI
static void I2C_wait(void) {
  // Wait for SI bit (sec 15.10.1 table 236)
  while (!(LPC_I2C->CONSET & BIT(3)));
}

// Get I2C status
static uint8_t I2C_status(void) {
  uint8_t status;

  // 0xF8: No relevant state information available, SI = 0.
  do {
    status = LPC_I2C->STAT & 0xF8;
  } while (status == 0xF8);

  I2C_wait();

  return status;
}

static void I2C_ack(void) {
  // Set AA bit (sec 15.7.1)
  LPC_I2C->CONSET = BIT(2);
}

static void I2C_nack(void) {
  // Clear AA bit (sec 15.7.1)
  LPC_I2C->CONCLR = BIT(2);
}

// Transmit START condition
static void I2C_start(void) {
  // Set STA bit (sec 15.7.1)
  LPC_I2C->CONSET = BIT(5);
}

// Load SLA+R/W
static void I2C_address(uint8_t address) {
  I2C_write_data((address << 1) | (mode % 2));
}

// Read data byte
static uint8_t I2C_read_data(void) {
  return LPC_I2C->DAT;
}

// Load data byte
static void I2C_write_data(uint8_t data) {
  // Send data byte (sec 15.7.3)
  LPC_I2C->DAT = data;
  // Set AA bit (sec 15.7.1)
  LPC_I2C->CONSET = BIT(2);
}

// Transmit STOP condition
static void I2C_stop(void) {
  // Set STO and AA bits (sec 15.7.1)
  LPC_I2C->CONSET = BIT(4) | BIT(2);
  // Clear SI bit (sec 15.7.6)
  LPC_I2C->CONCLR = BIT(3);
}
