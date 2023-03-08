#!/usr/bin/env python3

import os
import subprocess
import sys

GIT_ROOT = os.path.dirname(os.path.realpath(__file__))


def run(cmd, echo=False):
    proc = subprocess.Popen(
        cmd,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    out, err = proc.communicate()
    out = out.decode('utf-8').strip()
    err = err.decode('utf-8').strip()
    if echo:
        print('\x1b[90m    ' + out.replace('\n', '\n    ') + '\x1b[0m')
        print('\x1b[31m    ' + err.replace('\n', '\n    ') + '\x1b[0m')
    return out

def find_python():
    if sys.version_info.major >= 3 and sys.version_info.minor >= 11:
        return sys.executable
    else:
        print("Looking for Python 3.11...")
        exes = ["py -3.11", "py", "python3.11", "python", "python3"]
        for exe in exes:
            try:
                print(f"Trying '{exe}'")
                version = run(exe + " --version")
                if not version.startswith("Python 3"):
                    continue
                version = version[7:].split('.')
                major = int(version[0])
                minor = int(version[1])
                if (major >= 3 and minor >= 11):
                    return exe
            except FileNotFoundError:
                continue
        print("Could not find Python 3.11 or newer, please install it.")
        exit(1)

py = find_python()

installed_python_modules = run(f"{py} -m pip list")
if "poetry " not in installed_python_modules:
    print("Installing poetry...")
    run(py + " -m pip install poetry")

os.chdir(os.path.join(GIT_ROOT, "backend"))

print("backend: Running 'poetry install'...")
run(f"{py} -m poetry --quiet install", echo=True)

py = f"{py} -m poetry --quiet run python"

print("backend: Running 'manage.py migrate'...")
run(f"{py} manage.py migrate", echo=True)

print("backend: Running 'manage.py makemigrations'...")
run(f"{py} manage.py makemigrations", echo=True)

if len(sys.argv) > 1 and sys.argv[1] == "admin":
    print("Running 'manage.py createsuperuser'...")
    os.system(f"{py} manage.py createsuperuser")
    exit(0)

os.chdir(os.path.join(GIT_ROOT, "frontend"))

print("frontend: Running 'npm install'...")
run("npm install", echo=True)
