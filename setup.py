#!/usr/bin/env python3

import os

def run(cmd, echo=False):
    import subprocess
    proc = subprocess.Popen(cmd.split(' '),  stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = proc.communicate()
    out = out.decode('utf-8').strip()
    err = err.decode('utf-8').strip()
    if echo:
        print('\x1b[90m    ' + out.replace('\n', '\n    ') + '\x1b[0m')
        print('\x1b[1m    ' + err.replace('\n', '\n    ') + '\x1b[0m')
    return out

def find_python():
    import sys
    if False and sys.version_info.major >= 3 and sys.version_info.minor >= 11:
        return sys.executable
    else:
        print("Looking for Python 3.11...")
        exes = ["py -3.11", "python3.11", "python", "python3"]
        for exe in exes:
            try:
                print("Trying", exe)
                version = run(exe + " --version")
                if not version.startswith("Python 3"):
                    continue
                version = version[7:]
                if version.startswith("3.11"):
                    return exe
            except FileNotFoundError:
                continue

py = find_python()

list = run(f"{py} -m pip list")
if not "poetry" in list:
    print("Installing poetry...")
    run(py + " -m pip install poetry")

os.chdir(os.path.join(os.path.dirname(__file__), "backend"))

print("Running 'poetry install'...")
run(f"{py} -m poetry install", echo=True)

py = f"{py} -m poetry run python"

print("Running 'manage.py migrate'...")
run(f"{py} manage.py migrate", echo=True)

print("Running 'manage.py makemigrations'...")
run(f"{py} manage.py makemigrations", echo=True)

#print("Running 'manage.py createsuperuser'...")
#run(f"{py} manage.py createsuperuser")
