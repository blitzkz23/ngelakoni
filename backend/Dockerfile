FROM python:3.10

COPY . ./app

WORKDIR /app

RUN pip install -r requirements.txt

# Run the database migrations
# RUN flask db init
# RUN flask db migrate -m "Initial migration"
# RUN flask db upgrade

EXPOSE 5000

CMD ["flask", "--app", "app", "run"]
