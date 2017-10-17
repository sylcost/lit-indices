## Requisites

- nvm
- pm2
- mongodb
- git

# nvm

The server is running with node v8.7.0: `nvm i v8.7.0`

# Mongo

Install mongo: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/#install-mongodb-community-edition

Start it as a service: `sudo systemctl enable mongod.service`

# pm2

Run via pm2: `pm2 start --name="lit server" npm -- run server --`
Install it as a service: `pm2 startup`

# [Optional] restore mongodb dump

`mongodump` and `mongorestore`

# Up and running

The server should be now running. user: lit / password: lit2017
