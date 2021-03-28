from launcher import Launcher
import argparse

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