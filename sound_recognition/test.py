import os
try:
        import cPickle
except ImportError:
        import pickle as cPickle
import numpy as np
from scipy.io.wavfile import read
from sklearn.mixture import GaussianMixture as gmm
from featureextraction import extract_features
#from speakerfeatures import extract_features
import warnings
warnings.filterwarnings("ignore")
import time
import sys
"""
#path to training data
source   = "development_set/"   
modelpath = "speaker_models/"
test_file = "development_set_test.txt"        
file_paths = open(test_file,'r')

"""
#path to training data
source   = "C:/Users/asus/Documents/JAVA/pist/sound_recognition/SampleData/"   
path = sys.argv[1]
#path where training speakers will be saved
modelpath = "C:/Users/asus/Documents/JAVA/pist/sound_recognition/Speakers_models/"

gmm_files = [os.path.join(modelpath,fname) for fname in 
              os.listdir(modelpath) if fname.endswith('.gmm')]

#Load the Gaussian gender Models
models    = [cPickle.load(open(fname,'rb')) for fname in gmm_files]
speakers   = [fname.split("/")[-1].split(".gmm")[0] for fname 
              in gmm_files]

error = 0
total_sample = 0.0
take = 0

if take == 0:
        
        sr,audio = read(path)
        vector   = extract_features(audio,sr)
    
        log_likelihood = np.zeros(len(models)) 
    
        for i in range(len(models)):
                gmm    = models[i]  #checking with each model one by one
                scores = np.array(gmm.score(vector))
                log_likelihood[i] = scores.sum()
        
        winner = np.argmax(log_likelihood)
        if log_likelihood[winner]<=-25:
                json = "{\"person\" : \""+ "unknown"+"\","+"\"probability\": \""+str(log_likelihood[winner])+"\"}"
                        

                sys.stdout.write(json)
        else:
                json = "{\"person\" : \""+ str(speakers[winner])+"\","+"\"probability\": \""+str(log_likelihood[winner])+"\"}"
                        
                sys.stdout.write(json)
                

        

