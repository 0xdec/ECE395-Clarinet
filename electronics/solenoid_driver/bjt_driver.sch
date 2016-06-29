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
LIBS:solenoid_driver-cache
EELAYER 25 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 6 9
Title ""
Date ""
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L TIP120 Q?
U 1 1 5773434C
P 5600 4200
AR Path="/577337C5/5773434C" Ref="Q?"  Part="1" 
AR Path="/57734991/5773434C" Ref="Q?"  Part="1" 
AR Path="/57734C97/5773434C" Ref="Q?"  Part="1" 
F 0 "Q?" H 5850 4275 50  0000 L CNN
F 1 "TIP120" H 5850 4200 50  0000 L CNN
F 2 "TO-220" H 5850 4125 50  0000 L CIN
F 3 "" H 5600 4200 50  0000 L CNN
	1    5600 4200
	1    0    0    -1  
$EndComp
$Comp
L R R?
U 1 1 57734353
P 5250 4200
AR Path="/577337C5/57734353" Ref="R?"  Part="1" 
AR Path="/57734991/57734353" Ref="R?"  Part="1" 
AR Path="/57734C97/57734353" Ref="R?"  Part="1" 
F 0 "R?" V 5330 4200 50  0000 C CNN
F 1 "10k" V 5250 4200 50  0000 C CNN
F 2 "" V 5180 4200 50  0000 C CNN
F 3 "" H 5250 4200 50  0000 C CNN
	1    5250 4200
	0    1    1    0   
$EndComp
$Comp
L R R?
U 1 1 5773435A
P 5900 3650
AR Path="/577337C5/5773435A" Ref="R?"  Part="1" 
AR Path="/57734991/5773435A" Ref="R?"  Part="1" 
AR Path="/57734C97/5773435A" Ref="R?"  Part="1" 
F 0 "R?" V 5980 3650 50  0000 C CNN
F 1 "100" V 5900 3650 50  0000 C CNN
F 2 "" V 5830 3650 50  0000 C CNN
F 3 "" H 5900 3650 50  0000 C CNN
	1    5900 3650
	1    0    0    -1  
$EndComp
$Comp
L CP C?
U 1 1 57734361
P 5500 3650
AR Path="/577337C5/57734361" Ref="C?"  Part="1" 
AR Path="/57734991/57734361" Ref="C?"  Part="1" 
AR Path="/57734C97/57734361" Ref="C?"  Part="1" 
F 0 "C?" H 5525 3750 50  0000 L CNN
F 1 "470u" H 5525 3550 50  0000 L CNN
F 2 "" H 5538 3500 50  0000 C CNN
F 3 "" H 5500 3650 50  0000 C CNN
	1    5500 3650
	1    0    0    -1  
$EndComp
$Comp
L D D?
U 1 1 57734368
P 5500 3150
AR Path="/577337C5/57734368" Ref="D?"  Part="1" 
AR Path="/57734991/57734368" Ref="D?"  Part="1" 
AR Path="/57734C97/57734368" Ref="D?"  Part="1" 
F 0 "D?" H 5500 3250 50  0000 C CNN
F 1 "D" H 5500 3050 50  0000 C CNN
F 2 "" H 5500 3150 50  0000 C CNN
F 3 "" H 5500 3150 50  0000 C CNN
	1    5500 3150
	0    1    1    0   
$EndComp
Wire Wire Line
	5700 3900 5700 4000
Wire Wire Line
	5500 3900 5900 3900
Wire Wire Line
	5500 3800 5500 3900
Wire Wire Line
	5900 3900 5900 3800
Connection ~ 5700 3900
Wire Wire Line
	5500 3000 5500 2900
Wire Wire Line
	5500 3300 5500 3500
Connection ~ 5500 3400
Wire Wire Line
	5900 3200 5900 3500
Wire Wire Line
	5500 3400 5900 3400
Wire Wire Line
	5500 2900 5900 2900
Wire Wire Line
	5700 2900 5700 2800
Connection ~ 5700 2900
Wire Wire Line
	5700 4500 5700 4400
$Comp
L CONN_01X02 P?
U 1 1 57734389
P 6100 3150
AR Path="/577337C5/57734389" Ref="P?"  Part="1" 
AR Path="/57734991/57734389" Ref="P?"  Part="1" 
AR Path="/57734C97/57734389" Ref="P?"  Part="1" 
F 0 "P?" H 6100 3300 50  0000 C CNN
F 1 "CONN_01X02" V 6200 3150 50  0000 C CNN
F 2 "" H 6100 3150 50  0000 C CNN
F 3 "" H 6100 3150 50  0000 C CNN
	1    6100 3150
	1    0    0    -1  
$EndComp
Wire Wire Line
	5900 2900 5900 3100
Connection ~ 5900 3400
Text HLabel 5100 4200 0    60   Input ~ 0
IN
Text HLabel 5700 2800 1    60   Input ~ 0
+24V
Text HLabel 5700 4500 3    60   Input ~ 0
GND
$EndSCHEMATC
