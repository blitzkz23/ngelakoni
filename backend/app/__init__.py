from flask import Flask
from config import Config
from app.extensions import db, migrate, jwt

from app.task import taskBp
from app.user import userBp
from app.auth import authBp

def create_app(config_class = Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize database
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(taskBp, url_prefix='/tasks')
    app.register_blueprint(userBp, url_prefix='/users')
    app.register_blueprint(authBp, url_prefix='/auth')

    return app
    