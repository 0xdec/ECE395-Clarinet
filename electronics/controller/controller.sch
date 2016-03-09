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
LIBS:nxp_armmcu
LIBS:LPC1114FN28
LIBS:optocoupler
LIBS:controller-cache
EELAYER 25 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 1 1
Title "ECE395 Clarinet Controller"
Date ""
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L R R?
U 1 1 56D7F762
P 4300 5600
F 0 "R?" V 4380 5600 50  0000 C CNN
F 1 "270" V 4300 5600 50  0000 C CNN
F 2 "" V 4230 5600 50  0000 C CNN
F 3 "" H 4300 5600 50  0000 C CNN
	1    4300 5600
	1    0    0    -1  
$EndComp
$Comp
L LPC1114FN28/102 U?
U 1 1 56D7F9F7
P 3100 3700
F 0 "U?" H 3625 5100 60  0000 C CNN
F 1 "LPC1114FN28/102" H 3600 2300 60  0000 C CNN
F 2 "" H 3100 3700 60  0000 C CNN
F 3 "" H 3100 3700 60  0000 C CNN
	1    3100 3700
	1    0    0    -1  
$EndComp
$Comp
L VCC #PWR?
U 1 1 56D7FDB7
P 1800 2500
F 0 "#PWR?" H 1800 2350 50  0001 C CNN
F 1 "VCC" H 1800 2650 50  0000 C CNN
F 2 "" H 1800 2500 50  0000 C CNN
F 3 "" H 1800 2500 50  0000 C CNN
	1    1800 2500
	1    0    0    -1  
$EndComp
$Comp
L GND #PWR?
U 1 1 56D7FDD3
P 1700 3950
F 0 "#PWR?" H 1700 3700 50  0001 C CNN
F 1 "GND" H 1700 3800 50  0000 C CNN
F 2 "" H 1700 3950 50  0000 C CNN
F 3 "" H 1700 3950 50  0000 C CNN
	1    1700 3950
	1    0    0    -1  
$EndComp
$Comp
L 6N138 OC?
U 1 1 56D87D42
P 3700 5800
F 0 "OC?" H 3325 6125 50  0000 L BNN
F 1 "6N138" H 3325 5400 50  0000 L BNN
F 2 "optocoupler-DIL08" H 3700 5950 50  0001 C CNN
F 3 "" H 3700 5800 60  0000 C CNN
	1    3700 5800
	1    0    0    -1  
$EndComp
$Comp
L VCC #PWR?
U 1 1 56D87E1C
P 4250 5400
F 0 "#PWR?" H 4250 5250 50  0001 C CNN
F 1 "VCC" H 4250 5550 50  0000 C CNN
F 2 "" H 4250 5400 50  0000 C CNN
F 3 "" H 4250 5400 50  0000 C CNN
	1    4250 5400
	1    0    0    -1  
$EndComp
$Comp
L GND #PWR?
U 1 1 56D8803F
P 4300 6100
F 0 "#PWR?" H 4300 5850 50  0001 C CNN
F 1 "GND" H 4300 5950 50  0000 C CNN
F 2 "" H 4300 6100 50  0000 C CNN
F 3 "" H 4300 6100 50  0000 C CNN
	1    4300 6100
	1    0    0    -1  
$EndComp
$Comp
L D D?
U 1 1 56D883DA
P 3100 5800
F 0 "D?" H 3100 5900 50  0000 C CNN
F 1 "D" H 3100 5700 50  0000 C CNN
F 2 "" H 3100 5800 50  0000 C CNN
F 3 "" H 3100 5800 50  0000 C CNN
	1    3100 5800
	0    1    1    0   
$EndComp
$Comp
L R R?
U 1 1 56D887F9
P 2850 5600
F 0 "R?" V 2930 5600 50  0000 C CNN
F 1 "220" V 2850 5600 50  0000 C CNN
F 2 "" V 2780 5600 50  0000 C CNN
F 3 "" H 2850 5600 50  0000 C CNN
	1    2850 5600
	0    1    1    0   
$EndComp
$Comp
L Q_NMOS_DGS Q?
U 1 1 56D89418
P 8700 2800
F 0 "Q?" H 9000 2850 50  0000 R CNN
F 1 "Q_NMOS_DGS" H 9350 2750 50  0000 R CNN
F 2 "" H 8900 2900 50  0000 C CNN
F 3 "" H 8700 2800 50  0000 C CNN
	1    8700 2800
	1    0    0    -1  
$EndComp
$Comp
L D D?
U 1 1 56D8973E
P 8800 2250
F 0 "D?" H 8800 2350 50  0000 C CNN
F 1 "D" H 8800 2150 50  0000 C CNN
F 2 "" H 8800 2250 50  0000 C CNN
F 3 "" H 8800 2250 50  0000 C CNN
	1    8800 2250
	0    1    1    0   
$EndComp
$Comp
L GND #PWR?
U 1 1 56D89A81
P 8800 3100
F 0 "#PWR?" H 8800 2850 50  0001 C CNN
F 1 "GND" H 8800 2950 50  0000 C CNN
F 2 "" H 8800 3100 50  0000 C CNN
F 3 "" H 8800 3100 50  0000 C CNN
	1    8800 3100
	1    0    0    -1  
$EndComp
$Comp
L +24V #PWR?
U 1 1 56D8A18B
P 9200 1900
F 0 "#PWR?" H 9200 1750 50  0001 C CNN
F 1 "+24V" H 9200 2040 50  0000 C CNN
F 2 "" H 9200 1900 50  0000 C CNN
F 3 "" H 9200 1900 50  0000 C CNN
	1    9200 1900
	1    0    0    -1  
$EndComp
$Comp
L R R?
U 1 1 56D8A431
P 8400 2950
F 0 "R?" V 8480 2950 50  0000 C CNN
F 1 "10k" V 8400 2950 50  0000 C CNN
F 2 "" V 8330 2950 50  0000 C CNN
F 3 "" H 8400 2950 50  0000 C CNN
	1    8400 2950
	1    0    0    -1  
$EndComp
$Comp
L ZENER D?
U 1 1 56D8C1BC
P 9000 1950
F 0 "D?" H 9000 2050 50  0000 C CNN
F 1 "ZENER" H 9000 1850 50  0000 C CNN
F 2 "" H 9000 1950 50  0000 C CNN
F 3 "" H 9000 1950 50  0000 C CNN
	1    9000 1950
	1    0    0    -1  
$EndComp
Wire Wire Line
	1800 2500 1800 2600
Wire Wire Line
	1800 2600 1800 3550
Wire Wire Line
	1800 2600 1900 2600
Wire Wire Line
	1800 3550 1900 3550
Connection ~ 1800 2600
Wire Wire Line
	1900 3850 1700 3850
Wire Wire Line
	1700 2900 1700 3850
Wire Wire Line
	1700 3850 1700 3950
Wire Wire Line
	1900 2900 1700 2900
Connection ~ 1700 3850
Wire Wire Line
	4200 5600 4200 5600
Wire Wire Line
	4200 5600 4200 5400
Wire Wire Line
	4200 6000 4300 6000
Wire Wire Line
	4300 6000 4300 6100
Wire Wire Line
	4200 5800 4300 5800
Wire Wire Line
	4300 5800 4400 5800
Wire Wire Line
	4300 5800 4300 5750
Wire Wire Line
	4200 5400 4250 5400
Wire Wire Line
	4250 5400 4300 5400
Connection ~ 4250 5400
Connection ~ 4300 5800
Wire Wire Line
	3000 6000 3100 6000
Wire Wire Line
	3100 6000 3200 6000
Wire Wire Line
	3100 6000 3100 5950
Wire Wire Line
	3000 5600 3100 5600
Wire Wire Line
	3100 5600 3200 5600
Wire Wire Line
	3100 5600 3100 5650
Connection ~ 3100 5600
Connection ~ 3100 6000
Wire Wire Line
	4300 5400 4300 5450
Wire Wire Line
	8800 3000 8800 3100
Wire Wire Line
	8800 2400 8800 2550
Wire Wire Line
	8800 2550 8800 2600
Wire Wire Line
	8800 2550 9200 2550
Connection ~ 8800 2550
Wire Wire Line
	8800 3100 8400 3100
Connection ~ 8800 3100
Wire Wire Line
	8300 2800 8400 2800
Wire Wire Line
	8400 2800 8500 2800
Wire Wire Line
	9200 1900 9200 1950
Connection ~ 9200 1950
$Comp
L INDUCTOR L?
U 1 1 56D8C98A
P 9200 2250
F 0 "L?" V 9150 2250 50  0000 C CNN
F 1 "INDUCTOR" V 9300 2250 50  0000 C CNN
F 2 "" H 9200 2250 50  0000 C CNN
F 3 "" H 9200 2250 50  0000 C CNN
	1    9200 2250
	1    0    0    -1  
$EndComp
Wire Wire Line
	8800 1950 8800 2100
$Comp
L TIP120 Q?
U 1 1 56D91017
P 8800 4200
F 0 "Q?" H 9050 4275 50  0000 L CNN
F 1 "TIP120" H 9050 4200 50  0000 L CNN
F 2 "TO-220" H 9050 4125 50  0000 L CIN
F 3 "" H 8800 4200 50  0000 L CNN
	1    8800 4200
	1    0    0    -1  
$EndComp
$Comp
L D D?
U 1 1 56D9128D
P 8900 3750
F 0 "D?" H 8900 3850 50  0000 C CNN
F 1 "D" H 8900 3650 50  0000 C CNN
F 2 "" H 8900 3750 50  0000 C CNN
F 3 "" H 8900 3750 50  0000 C CNN
	1    8900 3750
	0    1    1    0   
$EndComp
$Comp
L R R?
U 1 1 56D91400
P 8450 4200
F 0 "R?" V 8530 4200 50  0000 C CNN
F 1 "10k" V 8450 4200 50  0000 C CNN
F 2 "" V 8380 4200 50  0000 C CNN
F 3 "" H 8450 4200 50  0000 C CNN
	1    8450 4200
	0    1    1    0   
$EndComp
$Comp
L +24V #PWR?
U 1 1 56D919AD
P 8900 3500
F 0 "#PWR?" H 8900 3350 50  0001 C CNN
F 1 "+24V" H 8900 3640 50  0000 C CNN
F 2 "" H 8900 3500 50  0000 C CNN
F 3 "" H 8900 3500 50  0000 C CNN
	1    8900 3500
	1    0    0    -1  
$EndComp
$Comp
L GND #PWR?
U 1 1 56D91AA2
P 8900 4400
F 0 "#PWR?" H 8900 4150 50  0001 C CNN
F 1 "GND" H 8900 4250 50  0000 C CNN
F 2 "" H 8900 4400 50  0000 C CNN
F 3 "" H 8900 4400 50  0000 C CNN
	1    8900 4400
	1    0    0    -1  
$EndComp
Wire Wire Line
	8900 3500 8900 3550
Wire Wire Line
	8900 3550 8900 3600
Wire Wire Line
	8900 3900 8900 3950
Wire Wire Line
	8900 3950 8900 4000
Wire Wire Line
	8900 3550 9000 3550
Connection ~ 8900 3550
Wire Wire Line
	8900 3950 9000 3950
Connection ~ 8900 3950
$Comp
L INDUCTOR L?
U 1 1 56D91FB7
P 9200 3750
F 0 "L?" V 9150 3750 50  0000 C CNN
F 1 "INDUCTOR" V 9300 3750 50  0000 C CNN
F 2 "" H 9200 3750 50  0000 C CNN
F 3 "" H 9200 3750 50  0000 C CNN
	1    9200 3750
	1    0    0    -1  
$EndComp
Wire Wire Line
	9200 4050 9000 4050
Wire Wire Line
	9000 4050 9000 3950
Wire Wire Line
	9000 3550 9000 3450
Wire Wire Line
	9000 3450 9200 3450
Wire Wire Line
	4300 4550 4400 4550
Wire Wire Line
	4400 4550 4400 5800
Connection ~ 8400 2800
$Comp
L CONN_02X05 P?
U 1 1 56DFB95F
P 3150 1700
F 0 "P?" H 3150 2000 50  0000 C CNN
F 1 "CONN_02X05" H 3150 1400 50  0000 C CNN
F 2 "" H 3150 500 50  0000 C CNN
F 3 "" H 3150 500 50  0000 C CNN
	1    3150 1700
	1    0    0    -1  
$EndComp
$Comp
L DIN_5 P?
U 1 1 56D8006A
P 2600 6200
F 0 "P?" H 2600 6200 50  0000 C CNN
F 1 "DIN_5" H 2600 6050 50  0000 C CNN
F 2 "" H 2600 6200 50  0000 C CNN
F 3 "" H 2600 6200 50  0000 C CNN
	1    2600 6200
	1    0    0    -1  
$EndComp
Wire Wire Line
	2700 5600 2200 5600
Wire Wire Line
	2200 5600 2200 6000
$EndSCHEMATC
