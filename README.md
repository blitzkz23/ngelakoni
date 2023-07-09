# Ngelakoni

# How to run

```
    # Build file
    docker compose up

    # Enter into flask container bash shell
    docker exec -it ngelakoni-app bash

    # Flask db migration command
    flask db init
    flask db migrate -m "Init migration"
    flask db upgrade

    # Check whether the migration success, enter postgre container bash shell
    docker exec -it ngelakoni-db bash

    # Login postgres
    psql -U postgres ngelakoni_app
    # Check tables
    \dt
    select * from alembic_version;
    # If there is version_num the migration is success
```