#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from random import randint
import string
import time
import json
import requests
import datetime
import tweepy
import subprocess
from random import randint

DIR_PATH = os.path.dirname(os.path.realpath(__file__))

#DIMENSION = '504x282'
#WIDTH = int('504')
DIMENSION = '678x382'
WIDTH = int('678')
HEIGHT = int('382')

V_DIMENSION = '480x800'
V_WIDTH = int('480')
V_HEIGHT = int('800')

UNDERCOLOR = 'rgba(0,0,0,0.3)'
UNDERCOLOR = 'rgba(0,0,0)'
FILLCOLOR = 'rgba(251,251,255)'
start_time = time.time()

def get_dict(**kwargs):
    d= {}
    for k,v in kwargs.iteritems():
        d[k] = v
    return d

temp_data = [
    {"image":"1.jpg","time":5,"title":"Global warming is shifting the way the Earth wobbles on its polar axis"},
    {"image":"2.jpg","time":5,"title":"large impact humans have on the planet"},
    {"image":"3.jpg","time":5,"title":"Melting ice sheets especially in Greenland"},
    {"image":"4.jpg","time":5,"title":"The recent shift from the 20th-century direction is very dramatic"},
    {"image":"5.jpg","time":5,"title":"It is just another interesting effect of climate change."},
    {"image":"6.jpg","time":5,"title":"Greenland has lost on average more than 600 trillion pounds of ice a year,"}
]


def slidebake(data=temp_data):
    os.system('rm %s/temp_buffer/*'%(DIR_PATH))
    font_loc = ''

    #TODO: make it so that image with url can also be downloaded.
    
    for slide in data:
        image_url = "%s/temp/%s"%(DIR_PATH,slide['image'])
        title = slide['title']
        counter = temp_data.index(slide) + 1

        #download the slide
        #TODO handling the case of .gifv format slide
        #os.system("wget '%s' -O %s/temp_buffer/slide_%s.png"%(image_url,DIR_PATH,counter))
        os.system("cp %s %s/temp_buffer/slide_%s.png"%(image_url,DIR_PATH,counter))

        #convert the slide to a vertical slide
        os.system("convert %s/temp_buffer/slide_%s.png \( -clone 0 -blur 0x15 -resize %s\! \) \( -clone 0 -resize %s \) -delete 0 \
            -gravity center -compose over -composite %s/temp_buffer/fat_vertical_slide_%s.png"%(DIR_PATH,counter,V_DIMENSION,V_DIMENSION,DIR_PATH,counter))

        #compressing the slides
        os.system('''
            convert -strip -interlace Plane -gaussian-blur 0.05 -quality 85%% \
            %s/temp_buffer/fat_vertical_slide_%s.png %s/temp_buffer/vertical_slide_%s.png
        '''%(DIR_PATH,counter,DIR_PATH,counter))

        #captioning
        os.system('''
            convert %s/temp_buffer/vertical_slide_%s.png -background none -gravity center -fill white -undercolor '#00000080'\
             -size 373x150! caption:"%s" -stroke white -strokewidth 25 -geometry +0+126 -composite %s/temp_buffer/x_vertical_slide_%s.png
        '''%(DIR_PATH,counter,title,DIR_PATH,counter))

        #captioning2
        os.system('''
            bash %s/helper/autocaption -s 250 -b 2 -c white -u "rgba(0,0,0,0.3)" -t "%s" %s/temp_buffer/vertical_slide_%s.png %s/temp_buffer/z_vertical_slide_%s.png
        '''%(DIR_PATH,title,DIR_PATH,counter,DIR_PATH,counter))

        slide_time = 3

        #streching the slide (+ caption) to a 5 sec vertical video
        os.system("ffmpeg -framerate 1/%s -i %s/temp_buffer/x_vertical_slide_%s.png -c:v libx264 -r 30 -pix_fmt yuv420p \
            %s/temp_buffer/yclip_%s.mp4"%(5,DIR_PATH,counter,DIR_PATH,counter))

    #copying the splash slide
    os.system("cp %s/helper/splash_pages/%s.png %s/temp_buffer/vertical_slide_%s.png"%(DIR_PATH,randint(0,3),DIR_PATH,counter+1 ))

    #making the 5sec splash video
    os.system("ffmpeg -framerate 1/%s -i %s/temp_buffer/vertical_slide_%s.png -c:v libx264 -r 30 -pix_fmt yuv420p \
        %s/temp_buffer/yclip_%s.mp4"%(5,DIR_PATH,counter+1,DIR_PATH,counter+1))

    #NOW we need to combine the vertical mp4 files

    #first we generate .ts files
    for i in range(len(data)+2):
        os.system("ffmpeg -i %s/temp_buffer/yclip_%s.mp4 -c copy -bsf:v h264_mp4toannexb \
        -f mpegts %s/temp_buffer/intermediate_%s.ts "%(DIR_PATH,i,DIR_PATH,i))

    #generating the concat_ts.txt file dynamically
    f = open('%s/temp_buffer/concat_ts.txt'%(DIR_PATH), 'w')
    s = ''
    for i in range(len(data)+1):
        s = s + "file '/Users/saurav/Desktop/chestream/apex/temp_buffer/intermediate_%s.ts'\n"%(i+1)
    f.write(s)
    f.close()

    #then we combine the .ts files we generated
    os.system('ffmpeg -f concat -i %s/temp_buffer/concat_ts.txt -codec libx264 %s/temp_buffer/alchemy.mp4'%(DIR_PATH,DIR_PATH))

    #NOW we need to add the audio overlay to our video


if __name__ == '__main__':
    start_time = time.time()
    slidebake()
    print("--- %s seconds ---" % (time.time() - start_time))
