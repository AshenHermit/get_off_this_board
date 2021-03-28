from tkinter import *
import json
import datetime

class DebugGUI():
    def __init__(self):
        self.window = Tk()
        self.window.title("Debug GUI")
        self.window.geometry('400x250') 

        self.next_row = -1

        self.debug_state_data_filename = "debug/debug_tab_close_config.json"

        self.tree = None

    def get_next_row(self):
        self.next_row += 1
        return self.next_row

    def get_debug_state_data(self):
        data = None
        with open(self.debug_state_data_filename, "r+") as file:
            data = json.load(file)
        return data

    def save_debug_state_data(self, data):
        with open(self.debug_state_data_filename, "w+") as file:
            json.dump(data, file, indent=4)

    def get_current_time(self):
        date = datetime.datetime.now()
        current_time = date.year*60*60*24*31*12 \
            + (date.month-1)*60*60*24*31 \
            + date.day*60*60*24 \
            + date.hour*60*60 \
            + date.minute*60 \
            + date.second 
        return current_time


        
    def button_activate_state(self):
        data = self.get_debug_state_data()
        data['start_time'] = self.get_current_time()
        data['active_state'] = True
        self.save_debug_state_data(data)

    def button_deactivate_state(self):
        data = self.get_debug_state_data()
        data['start_time'] = self.get_current_time()
        data['active_state'] = False
        self.save_debug_state_data(data)

    def build_tree(self):
        self.tree = {
            'remote_state': {
                'remote_label': Label(self.window, text="remote state").grid(column=0, row = self.get_next_row()),
                'activate_button': Button(self.window, text="activate", command=self.button_activate_state).grid(column=0, row = self.get_next_row()),
                'deactivate_button': Button(self.window, text="deactivate", command=self.button_deactivate_state).grid(column=0, row = self.get_next_row()),
            }
        }

    def start(self):
        self.build_tree()
        self.window.mainloop()

def main():
    gui = DebugGUI()
    gui.start()

if __name__ == "__main__":
    main()