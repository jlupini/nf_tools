#!/usr/bin/env python3
import speech_recognition as sr
from os import path, listdir
from pprint import pprint
from tqdm import tqdm
import csv
import json
import math as m
# import transcriptmatch

fps = 30 # for timecode generation
# CREDENTIALS = r"""YOUR_JSON_API_FILE_HERE"""
RESULTS = ""
fieldnames = ["t","word","instruction"]

title = " _\n//\ \nV  \        A V O C A D O    V I D E O\n \  \ \n  \,'.`-.\n   |\ `. `.       \n   ( \  `. `-.                        _,.-:\ \n    \ \   `.  `-._             __..--' ,-';/\n     \ `.   `-.   `-..___..---'   _.--' ,'/\n      `. `.    `-._        __..--'    ,' /\n        `. `-_     ``--..''       _.-' ,'\n          `-_ `-.___        __,--'   ,'\n             `-.__  `----'''    __.-'\n                  `--..____..--'\n\n"

# use the audio file as the audio source
r = sr.Recognizer()

def call_papa_google(file,timeOffset,CREDENTIALS):
    data = []
    print("\nRunning STT on file: " + file)
    with sr.AudioFile(file) as source:
        audio = r.record(source)  # read the entire audio file
    try:
        STT = r.recognize_google_cloud(audio, credentials_json=CREDENTIALS, show_all=True)
        #print("Full dump")
        #print(STT)
        results = STT["results"]
        #print("got back package with " + str(len(results)) + " result segments")
        for result in results:
            print(result)
            words = result["alternatives"][0]["words"]
            for w in words:
                time = float(w["startTime"][:-1])+timeOffset
                tc = time#totimecode(time)
                # print("t:",time,"toffset",timeOffset,"tc",tc)
                data.append({"word":w["word"],"t":tc,"instruction":""})
        return data
    except sr.UnknownValueError:
        print("Google Cloud Speech could not understand audio :(")
        return []
    except sr.RequestError as e:
        print("Could not request results from Google Cloud Speech service; {0}".format(e))

def initCSV(projectPath):
    with open(projectPath + "/transcript.csv","w") as csvf:
        writer = csv.DictWriter(csvf,fieldnames=fieldnames)
        writer.writeheader()

def appendRows(rows, projectPath):
    with open(projectPath + "/transcript.csv","a") as csvf:
        writer = csv.DictWriter(csvf, fieldnames=fieldnames)
        for r in rows:
            writer.writerow(r)

def totimecode(raw_seconds):
    minutes = raw_seconds / 60
    hours = minutes/60 # hopefully will never require...
    if minutes:
        seconds = raw_seconds-minutes
    else:
        seconds = m.floor(raw_seconds)
    frames = m.floor((raw_seconds%1)*fps)
    formatStr = ('%02d'%hours)+":"+('%02d'%minutes)+":"+('%02d'%seconds)+":"+('%02d'%frames)
    return formatStr

def main(projectPath):
    files = listdir("segments")
    files.sort()

    CREDENTIALS = json.load(open("api_key/NutritionFacts-50bf881b738b.json"))
    CREDENTIALS = json.dumps(CREDENTIALS)

    print(title)
    print("=================\nProcessing files...")
    timeOffset = 0

    initCSV(projectPath)
    for f in tqdm(files):
        if f != '.DS_Store':
            AUDIO_FILE = path.join("segments", f)
            toWrite = call_papa_google(AUDIO_FILE,timeOffset,CREDENTIALS)
            appendRows(toWrite, projectPath)
            timeOffset += 20
    print("✓  finished transcribing")
    # transcriptmatch.main()
