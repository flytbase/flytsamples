#!/usr/bin/env python

from flyt_python import api
import argparse

nav = api.navigation() # instance of flyt navigation class

## parsing command line arguments
parser = argparse.ArgumentParser(description='Process a float value.')
parser.add_argument('side', metavar='side_length', type=float, help='side length of the square')
args = parser.parse_args()

## lets fly 
side_length = args.side
print 'flying in square', side_length
nav.take_off(3.0)
nav.position_set(side_length,0,-3)
nav.position_set(side_length,side_length,-3)
nav.position_set(0,side_length,-3)
nav.position_set(0,0,-3)
nav.land()
print 'done flying, wait for quad to land'