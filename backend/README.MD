# How to run
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# With docker
docker build -t ngelakoni-flask:latest .
docker run -d --name ngelakoni-flask ngelakoni-flask:latest
docker exec -it ngelakoni-flask bash

# First installment only
flask db init
flask db migrate -m "initial migration"
flask db upgrade

# Run flask
flask --app app --debug run