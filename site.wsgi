import os
import sys

activate_this = "/home/a1244319/python/bin/activate_this.py"
with open(activate_this) as file_handle:
    exec(file_handle.read(), {"__file__": activate_this})

sys.path.insert(0, os.path.join("/home/a1244319/domains/gloominatorgames.ru/public_html/"))

from wordmath import app as application

if __name__ == "__main__":
    application.run()
