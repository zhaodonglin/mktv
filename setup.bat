:: Configure the bat a bit
@echo off
SETLOCAL ENABLEDELAYEDEXPANSION


set DB_NAME = "mktv"

echo "Installing requirements"
python --version
pip install --exists-action=s -r requirements/local.txt

echo "Emitting local development settings module"
cp settings/local.py.example settings/local.py
