# Dockerized Flask, and Scripts Documentation

This README is intended for Linux & Container final project

# Problem Description

In order for this application able to be deployed in any kind of environment, I as a Software/Data Engineer dockerized this application and also created scripts for backup-restore the database.

# Requirements
- Linux environment
- Text Editor
- Docker
- Docker Compose
- Dbeaver
- Cron

# Project Run Documentation

## Docker and Docker Compose
1. Run docker compose and check whether the container already up
    ```
    # Run build docker compose
    docker compose up -d

    # Check if there's 2 service already up
    docker compose ps
    ```

2. Open localhost:5000, to see if the project already up

3. Open dbeaver, and connect to the postgres inside docker compose with the same configuration(port, password, etc)

