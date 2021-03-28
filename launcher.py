import time
import os
import argparse
import requests
import json
import subprocess
import ctypes
import win32gui, win32con
from threading import Timer

import math

class Launcher():
    def __init__(self, raw_files_root_url=""):
        self.raw_files_root_url = raw_files_root_url

    def get_download_files_list(self):
        url = self.raw_files_root_url + "/files_list.txt"
        config = requests.get(url).text
        config = config.split("\n")
        config = list(filter(lambda x: x.replace(" ", "")!="", config))
        return config

    def make_dirs(self, path):
        path = path[:path.rfind("/")]
        os.makedirs(path, exist_ok=True)

    def download_files(self, files_list):
        print('downloading...')
        count = 0
        for file_path in files_list:
            count+=1
            print(f'[ {math.floor((count / len(files_list))*100)+1}% ] Downloading: {file_path} ...')

            raw_file_url = self.raw_files_root_url + "/" + file_path

            self.make_dirs(file_path)
            with open(file_path, "wb") as file:
                content = requests.get(raw_file_url).content
                file.write(content)

        print("done.")

    def download_required_files(self):
        files_list = self.get_download_files_list()
        self.download_files(files_list)

    def launch_without_console(self, command):
        """Launches 'command' windowless and waits until finished"""
        def hide_console():
            pass
        subprocess.call(command, shell=True)
        # os.system(command)

    def launch(self):
        run_commands = ""
        with open("./src/run_commands.txt", "r+", encoding="utf-8") as file:
            run_commands = file.read()
        
        run_commands = run_commands.split("\n")

        os.chdir("src")
        for command in run_commands:
            self.launch_without_console(command)


def debug_main():
    launcher = Launcher()
    launcher.launch()

def main():
    launcher = Launcher("https://raw.githubusercontent.com/AshenHermit/ashenhermit.github.io/master/get_off_this_board")
    launcher.download_required_files()
    launcher.launch()
    

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-d", "--debug", action="store_true")
    
    args = parser.parse_args()

    # constant debug argument
    # args.debug = True

    if not args.debug:
        main()
    else:
        debug_main()