## Development

make sure docker & docker-compose are installed
run:
```
docker-compose up
```

this will start mongoDB, server, client
make sure this ports are not used: 27017, 3131, 3232

### MockData
please go to `http://localhost:3131/seed`
to seed the db with mock data. it will only run if the db is empty.

### Tests
to run tests suite for the server you need to trigger it from the container:
```
docker exec -it server npm run watch-test
```
you can change `watch-test` with test for single `test`

##

### Dependencies
to add npm dependencies they need to be added to the docker volume:
```
docker exec -it client npm install --save blabla
```
* please note you need to install server & client dependencies separately
* if you use Windows the IDE may complain about missing dependencies you can solve that by 
installing again in windows `cmd: npm install blabla --save` 
