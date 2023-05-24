@echo off
python -m venv venv &^
call %~dp0venv\Scripts\activate.bat &^
python -m pip install --upgrade pip &^
pip install -r .\requirements.txt &^
npm install . &^
npm run build &^
python -m flask --app "./src/index.py" run -h "0.0.0.0" -p 5000 