@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo פותח שרת מקומי על http://localhost:8080
echo סגור את החלון הזה כדי לעצור את השרת.
start "" "http://localhost:8080/index.html"
python -m http.server 8080
