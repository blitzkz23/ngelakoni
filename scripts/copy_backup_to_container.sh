#!/bin/bash

# Backup date
backup_date=$(date +%Y%m%d)

# Path to the backup file on the host
backup_file="/mnt/d/Dev/Dokcer/backup/backup-$backup_date.dump"

# Name of the PostgreSQL container
container_name="ngelakoni-db"

# Copy the backup file to the container
docker cp $backup_file $container_name:/home/backup-$backup_date.dump
