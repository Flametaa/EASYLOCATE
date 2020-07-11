
from PIL import Image
import numpy as np
import cv2
import base64
import json
import urllib.request
import requests

data = {
        'ids': [12, 3, 4, 5, 6]
}
face_id=2
count =0
faceCascade = cv2.CascadeClassifier('Cascades/haarcascade_frontalface_default.xml')

cap = cv2.VideoCapture(0)
cap.set(3,640) # set Width
cap.set(4,480) # set Height
cap.set(cv2.CAP_PROP_POS_FRAMES, 30)
while True:
    ret, img = cap.read()
    
    #img = np.full((100,80,3), 12, dtype = np.uint8)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = faceCascade.detectMultiScale(
        gray,
        
        scaleFactor=1.2,
        minNeighbors=5
        ,     
        minSize=(40, 40)
    )

    for (x,y,w,h) in faces:
        #cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
        count += 1
        roi_gray = gray[y:y+150, x:x+150]
        roi_color = img[y:y+150, x:x+150]
        #.imwrite("dataset/User." + str(face_id) + '.' + str(count) + ".jpg", gray[y:y+h,x:x+w])
    #cv2.imshow('video',img)
        imag = Image.fromarray(roi_color, 'RGB')
        # print(base64.b64encode(np.array(roi_color)))
        retval,buffer=cv2.imencode('.jpg',np.array(roi_color))
        b64=base64.b64encode(buffer)
        #st = "{\"place\":\"from 2015\" , \"image\":"+"\""+str(b64)[2:-1]+"\""+"}";
        st= {
            "place":"nowhere",
            "image": str(b64)[2:-1]
            }
        #ws.send(st)
        
        requests.post("http://localhost:3000/images/recognize", json=st)
    cv2.imshow('video',img)

    k = cv2.waitKey(30) & 0xff
    if k == 27: # press 'ESC' to quit
        break

cap.release()
cv2.destroyAllWindows()
