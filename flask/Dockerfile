FROM python:3.10

COPY . ./flask-app

WORKDIR /flask-app

RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["flask", "--app", "app", "run", "--host", "0.0.0.0"]
