#!/bin/bash
# Backup data from postgre container

# Backup date
backup_date=$(date +%Y%m%d)

# Name argument
docker exec -it ngelakoni-db bash -c "pg_dump -U postgres -W -Fc ngelakoni_app > home/backup-$backup_date.dump"
docker cp ngelakoni-db:/home/backup-$backup_date.dump /mnt/d/Dev/Dokcer/backup/

# Permission to run in crontab
chmod +x backup.sh