python -m venv venv
source ./venv/bin/activate
pip install --upgrade pip 
pip install -r requirements.txt
npm install .
npm run build
export FLASK_APP=./src/index.py
python -m flask run --host "0.0.0.0" --port 5000 --debug
