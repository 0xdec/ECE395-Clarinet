EESchema Schematic File Version 2
LIBS:power
LIBS:device
LIBS:transistors
LIBS:conn
LIBS:linear
LIBS:regul
LIBS:74xx
LIBS:cmos4000
LIBS:adc-dac
LIBS:memory
LIBS:xilinx
LIBS:microcontrollers
LIBS:dsp
LIBS:microchip
LIBS:analog_switches
LIBS:motorola
LIBS:texas
LIBS:intel
LIBS:audio
LIBS:interface
LIBS:digital-audio
LIBS:philips
LIBS:display
LIBS:cypress
LIBS:siliconi
LIBS:opto
LIBS:atmel
LIBS:contrib
LIBS:valves
LIBS:LPC1114FN28
LIBS:optocoupler-2
LIBS:optocoupler
LIBS:midi-cache
EELAYER 25 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 1 1
Title "ECE395 Clarinet MIDI"
Date ""
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L 6N138 OK1
U 1 1 570CF73B
P 5600 4000
F 0 "OK1" H 5225 4325 50  0000 L BNN
F 1 "6N138" H 5225 3600 50  0000 L BNN
F 2 "SMD_Packages:DIP-8_SMD" H 5600 4150 50  0001 C CNN
F 3 "" H 5600 4000 60  0000 C CNN
	1    5600 4000
	1    0    0    -1  
$EndComp
$Comp
L D D1
U 1 1 570CF807
P 5000 3950
F 0 "D1" H 5000 4050 50  0000 C CNN
F 1 "D" H 5000 3850 50  0000 C CNN
F 2 "Diodes_SMD:SOD-123" H 5000 3950 50  0001 C CNN
F 3 "" H 5000 3950 50  0000 C CNN
	1    5000 3950
	0    1    1    0   
$EndComp
$Comp
L R R1
U 1 1 570CF868
P 4000 3950
F 0 "R1" V 4080 3950 50  0000 C CNN
F 1 "220" V 4000 3950 50  0000 C CNN
F 2 "Resistors_SMD:R_0603" V 3930 3950 50  0001 C CNN
F 3 "" H 4000 3950 50  0000 C CNN
	1    4000 3950
	-1   0    0    1   
$EndComp
$Comp
L R R4
U 1 1 570CF8EF
P 6300 4450
F 0 "R4" V 6380 4450 50  0000 C CNN
F 1 "1k" V 6300 4450 50  0000 C CNN
F 2 "Resistors_SMD:R_0603" V 6230 4450 50  0001 C CNN
F 3 "" H 6300 4450 50  0000 C CNN
	1    6300 4450
	-1   0    0    1   
$EndComp
$Comp
L GND #PWR01
U 1 1 570CF95E
P 6400 4800
F 0 "#PWR01" H 6400 4550 50  0001 C CNN
F 1 "GND" H 6400 4650 50  0000 C CNN
F 2 "" H 6400 4800 50  0000 C CNN
F 3 "" H 6400 4800 50  0000 C CNN
	1    6400 4800
	1    0    0    -1  
$EndComp
$Comp
L +3.3V #PWR02
U 1 1 570CFAC8
P 6400 3200
F 0 "#PWR02" H 6400 3050 50  0001 C CNN
F 1 "+3.3V" H 6400 3340 50  0000 C CNN
F 2 "" H 6400 3200 50  0000 C CNN
F 3 "" H 6400 3200 50  0000 C CNN
	1    6400 3200
	1    0    0    -1  
$EndComp
$Comp
L CONN_01X04 P3
U 1 1 570CFC08
P 7300 4550
F 0 "P3" H 7300 4800 50  0000 C CNN
F 1 "UART" V 7400 4550 50  0000 C CNN
F 2 "Connectors_JST_SH:Connectors_JST_BM04B-SRSS-TB" H 7300 4550 50  0001 C CNN
F 3 "" H 7300 4550 50  0000 C CNN
	1    7300 4550
	1    0    0    -1  
$EndComp
$Comp
L R R2
U 1 1 570CFA6D
P 6300 3650
F 0 "R2" V 6380 3650 50  0000 C CNN
F 1 "220" V 6300 3650 50  0000 C CNN
F 2 "Resistors_SMD:R_0603" V 6230 3650 50  0001 C CNN
F 3 "" H 6300 3650 50  0000 C CNN
	1    6300 3650
	-1   0    0    1   
$EndComp
$Comp
L DIN_5 P1
U 1 1 570CF7D8
P 4500 4400
F 0 "P1" H 4500 4400 50  0000 C CNN
F 1 "DIN_5" H 4500 4250 50  0000 C CNN
F 2 "Connect:SDS-50J" H 4500 4400 50  0001 C CNN
F 3 "" H 4500 4400 50  0000 C CNN
	1    4500 4400
	1    0    0    -1  
$EndComp
$Comp
L GND #PWR03
U 1 1 571054F1
P 5500 5700
F 0 "#PWR03" H 5500 5450 50  0001 C CNN
F 1 "GND" H 5500 5550 50  0000 C CNN
F 2 "" H 5500 5700 50  0000 C CNN
F 3 "" H 5500 5700 50  0000 C CNN
	1    5500 5700
	1    0    0    -1  
$EndComp
NoConn ~ 7100 4500
$Comp
L PWR_FLAG #FLG04
U 1 1 57105E06
P 5400 3100
F 0 "#FLG04" H 5400 3195 50  0001 C CNN
F 1 "PWR_FLAG" H 5400 3280 50  0000 C CNN
F 2 "" H 5400 3100 50  0000 C CNN
F 3 "" H 5400 3100 50  0000 C CNN
	1    5400 3100
	1    0    0    -1  
$EndComp
$Comp
L PWR_FLAG #FLG05
U 1 1 57105E45
P 5800 3100
F 0 "#FLG05" H 5800 3195 50  0001 C CNN
F 1 "PWR_FLAG" H 5800 3280 50  0000 C CNN
F 2 "" H 5800 3100 50  0000 C CNN
F 3 "" H 5800 3100 50  0000 C CNN
	1    5800 3100
	1    0    0    -1  
$EndComp
$Comp
L GND #PWR06
U 1 1 57105E7D
P 5400 3100
F 0 "#PWR06" H 5400 2850 50  0001 C CNN
F 1 "GND" H 5400 2950 50  0000 C CNN
F 2 "" H 5400 3100 50  0000 C CNN
F 3 "" H 5400 3100 50  0000 C CNN
	1    5400 3100
	1    0    0    -1  
$EndComp
$Comp
L +3.3V #PWR07
U 1 1 57105EA3
P 5800 3100
F 0 "#PWR07" H 5800 2950 50  0001 C CNN
F 1 "+3.3V" H 5800 3240 50  0000 C CNN
F 2 "" H 5800 3100 50  0000 C CNN
F 3 "" H 5800 3100 50  0000 C CNN
	1    5800 3100
	-1   0    0    1   
$EndComp
$Comp
L Led_Small D2
U 1 1 57113A15
P 6700 3800
F 0 "D2" H 6650 3925 50  0000 L CNN
F 1 "Orange" H 6525 3700 50  0000 L CNN
F 2 "LEDs:LED-0603" V 6700 3800 50  0001 C CNN
F 3 "" V 6700 3800 50  0000 C CNN
	1    6700 3800
	0    -1   -1   0   
$EndComp
$Comp
L R R3
U 1 1 57113FDC
P 6700 3550
F 0 "R3" V 6780 3550 50  0000 C CNN
F 1 "220" V 6700 3550 50  0000 C CNN
F 2 "Resistors_SMD:R_0603" V 6630 3550 50  0001 C CNN
F 3 "" H 6700 3550 50  0000 C CNN
	1    6700 3550
	-1   0    0    1   
$EndComp
NoConn ~ 4500 4000
NoConn ~ 4100 4400
NoConn ~ 4900 4400
$Comp
L C C1
U 1 1 5716D7B7
P 6500 4450
F 0 "C1" H 6525 4550 50  0000 L CNN
F 1 "0.1u" H 6525 4350 50  0000 L CNN
F 2 "Capacitors_SMD:C_0603" H 6538 4300 50  0001 C CNN
F 3 "" H 6500 4450 50  0000 C CNN
	1    6500 4450
	1    0    0    -1  
$EndComp
$Comp
L CONN_01X03 P2
U 1 1 57294CEB
P 7300 4100
F 0 "P2" H 7300 4300 50  0000 C CNN
F 1 "HEADER" V 7400 4100 50  0000 C CNN
F 2 "Pin_Headers:Pin_Header_Straight_1x03" H 7300 4100 50  0001 C CNN
F 3 "" H 7300 4100 50  0000 C CNN
	1    7300 4100
	1    0    0    -1  
$EndComp
Wire Wire Line
	6500 4100 7100 4100
Connection ~ 6700 4000
Wire Wire Line
	6700 4000 6700 3900
Wire Wire Line
	6500 3300 6500 4300
Wire Wire Line
	5800 3100 5800 3100
Wire Wire Line
	5400 3100 5400 3100
Wire Wire Line
	4000 3800 5100 3800
Wire Wire Line
	4000 4200 4000 4100
Connection ~ 5000 4200
Wire Wire Line
	5000 4200 5000 4100
Wire Wire Line
	4900 4200 5100 4200
Connection ~ 5000 3800
Wire Wire Line
	4100 4200 4000 4200
Wire Wire Line
	6100 3300 6100 3800
Wire Wire Line
	6100 4200 6100 4700
Connection ~ 6400 4700
Wire Wire Line
	6400 4700 6400 4800
Wire Wire Line
	6100 4700 7100 4700
Connection ~ 6300 4000
Wire Wire Line
	6300 4000 6300 3800
Wire Wire Line
	6100 3900 6200 3900
Wire Wire Line
	6500 4700 6500 4600
Connection ~ 6500 4700
Wire Wire Line
	6300 3500 6300 3300
Connection ~ 6300 3300
Wire Wire Line
	6700 3300 6700 3400
Wire Wire Line
	6300 4600 6300 4700
Connection ~ 6300 4700
Wire Wire Line
	6100 4000 7100 4000
Wire Wire Line
	7100 4600 6900 4600
Wire Wire Line
	6900 4600 6900 4100
Connection ~ 6900 4100
Wire Wire Line
	7100 4400 6800 4400
Wire Wire Line
	6800 4400 6800 4000
Connection ~ 6800 4000
Wire Wire Line
	7100 4200 7000 4200
Wire Wire Line
	7000 4200 7000 4700
Connection ~ 7000 4700
Wire Wire Line
	6100 3300 6700 3300
Connection ~ 6500 4100
Connection ~ 6500 3300
Wire Wire Line
	6400 3300 6400 3200
Connection ~ 6400 3300
Wire Wire Line
	6200 3900 6200 4200
Wire Wire Line
	6200 4200 6300 4200
Wire Wire Line
	6300 4200 6300 4300
$EndSCHEMATC