#!/bin/bash
# echo INSIDE THE SHELL $*
# echo specifically calling ffmpeg -y -i \"$@\" -acodec pcm_s16le -ac 1 -ar 16000 16bit_out.wav
if [ ! -d "segments" ]; then
    echo creating segments folder
    mkdir segments
else
    rm -rf segments/*
fi
/usr/local/bin/ffmpeg -y -i "$*" -acodec pcm_s16le -ac 1 -ar 16000 16bit_out.wav
/usr/local/bin/ffmpeg -y -i 16bit_out.wav -loglevel +repeat -f segment -segment_time 20 -c copy segments/out%03d.wav
