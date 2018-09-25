import subprocess
import sys, os
import STT
# import transcriptmatch
from pprint import pprint as p


def check_required_files():
    root = os.listdir(".")
    api_key = os.listdir("api_key")
    print(api_key)

    for f in api_key:
        print("searching",f)
        if (".json") in f:
            print("✓ found API key looking object")
            return

    print("😮  missing json formatted API key")
    exit()

def main():
    if len(sys.argv) > 1:
        if ".wav" in sys.argv[1]:
            print("dingus",sys.argv[1])
            check_required_files()
            print("Segmentizing",sys.argv[1])
            subprocess.call(['sh segmentize.sh ' + sys.argv[1]],shell=True)
            STT.main(sys.argv[2])
            print("😂 complete! written file as transcript.csv")
            # transcriptmatch.main()


        else:
            print(sys.argv[1],"is not a wave file. (Remember to include the .wav extension!)")


    elif len(sys.argv) == 1:
        print("Supply a wave file as an argument")

main()
