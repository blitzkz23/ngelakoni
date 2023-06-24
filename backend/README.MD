# How to run
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# First installment only
flask db init
flask db migrate -m "initial migration"
flask db upgrade

# Run flask
flask --app app --debug run