#!/bin/bash

tool-db serve --port=8080 --storageName=td0 &
tool-db serve --port=8081 --peers=127.0.0.1:8080,127.0.0.0.1:8082 --storageName=td1 &
tool-db serve --port=8082 --peers=127.0.0.1:8080,127.0.0.0.1:8081 --storageName=td2 &

tool-db serve --port=8083 --storageName=td3 &
tool-db serve --port=8084 --peers=127.0.0.1:8083,127.0.0.0.1:8085,127.0.0.1:8081 --storageName=td4 &
tool-db serve --port=8085 --peers=127.0.0.1:8083,127.0.0.0.1:8084,127.0.0.1:8082 --storageName=td5 &

