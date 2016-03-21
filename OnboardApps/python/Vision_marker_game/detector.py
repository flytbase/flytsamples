import cv2
import cv2.cv as cv
import numpy as np

kernel = np.ones((5,5),np.uint8)

#### object A opencv parameter: Circular shape, BLUE color
hminA = 111; hmaxA = 118; sminA = 100; smaxA = 247; vminA = 79; vmaxA = 219
#### object B opencv parameter: Circular shape, RED color
hminB = 155; hmaxB = 179; sminB = 74; smaxB = 153; vminB = 166; vmaxB = 192


def find_circles(camera_handle):
    trig_A, trig_B = False, False
    buzz = 0
    _, frame = camera_handle.read()

    #converting to HSV
    hsv = cv2.cvtColor(frame,cv2.COLOR_BGR2HSV)
    hue,sat,val = cv2.split(hsv)
   
    # Apply thresholding
    hthreshA = cv2.inRange(np.array(hue),np.array(hminA),np.array(hmaxA))
    sthreshA = cv2.inRange(np.array(sat),np.array(sminA),np.array(smaxA))
    vthreshA = cv2.inRange(np.array(val),np.array(vminA),np.array(vmaxA))

    hthreshB = cv2.inRange(np.array(hue),np.array(hminB),np.array(hmaxB))
    sthreshB = cv2.inRange(np.array(sat),np.array(sminB),np.array(smaxB))
    vthreshB = cv2.inRange(np.array(val),np.array(vminB),np.array(vmaxB))

    # AND h s and v
    trackingA = cv2.bitwise_and(hthreshA,cv2.bitwise_and(sthreshA,vthreshA))

    trackingB = cv2.bitwise_and(hthreshB,cv2.bitwise_and(sthreshB,vthreshB))

    # Some morpholigical filtering
    dilationA = cv2.dilate(trackingA,kernel,iterations = 1)
    closingA = cv2.morphologyEx(dilationA, cv2.MORPH_CLOSE, kernel)
    closingA = cv2.GaussianBlur(closingA,(5,5),0)

    dilationB = cv2.dilate(trackingB,kernel,iterations = 1)
    closingB = cv2.morphologyEx(dilationB, cv2.MORPH_CLOSE, kernel)
    closingB = cv2.GaussianBlur(closingB,(5,5),0)

    # Detect circles using HoughCircles
    circlesA = cv2.HoughCircles(closingA,cv.CV_HOUGH_GRADIENT,2,120,param1=120,param2=50,minRadius=10,maxRadius=0)

    circlesB = cv2.HoughCircles(closingB,cv.CV_HOUGH_GRADIENT,2,120,param1=120,param2=50,minRadius=10,maxRadius=0)
 
    if circlesA is not None:
        no_of_circlesA = len([num for elem in circlesA[0,:] for num in elem]) / 3
        if no_of_circlesA == 1:                                                       # consider only if one circle is detected.
            for i in circlesA[0,:]:
                #draw with Blue
                cv2.circle(frame,(int(round(i[0])),int(round(i[1]))),int(round(i[2])),(255,0,0),5)
                cv2.circle(frame,(int(round(i[0])),int(round(i[1]))),2,(255,0,0),10)
                trig_A = True 
        
    if circlesB is not None:
        no_of_circlesB = len([num for elem in circlesB[0,:] for num in elem]) / 3
        if no_of_circlesB == 1:                                # consider only if one circle is detected.
            for i in circlesB[0,:]:
                #draw circle with red
                cv2.circle(frame,(int(round(i[0])),int(round(i[1]))),int(round(i[2])),(0,0,255),5)
                cv2.circle(frame,(int(round(i[0])),int(round(i[1]))),2,(0,0,255),10)
                trig_B = True       
    #Show the result in frames
    #cv2.imshow('HueComp',hthreshB)
    #cv2.imshow('SatComp',sthreshB)
    #cv2.imshow('ValComp',vthreshB)
    cv2.imshow('closing_object_A',closingA)
    cv2.imshow('closing_object_B',closingB)
    cv2.imshow('tracking',frame)

    return (trig_A, trig_B)

