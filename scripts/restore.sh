#!/bin/bash

# Backup date
backup_date=$(date +%Y%m%d)

# Name of the PostgreSQL container
container_name="ngelakoni-db"

# Create new db for restoration testing purpose
docker exec -it $container_name bash -c "createdb -U postgres ngelakoni_app_restore"

# Restore the backup file inside the container
docker exec -it $container_name bash -c "pg_restore -U postgres -d ngelakoni_app_restore /home/backup-$backup_date.dump"
