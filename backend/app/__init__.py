from flask import Flask
from config import Config
from app.extensions import db, migrate, jwt

from app.task import taskBp
from app.user import userBp
from app.auth import authBp
from app.project import projectBp
from app.frontend import frontendBp

def create_app(config_class = Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize database
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(taskBp, url_prefix='/api/tasks')
    app.register_blueprint(userBp, url_prefix='/api/users')
    app.register_blueprint(projectBp, url_prefix='/api/projects')
    app.register_blueprint(authBp, url_prefix='/api/auth')
    app.register_blueprint(frontendBp, url_prefix='/')

    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0')
    