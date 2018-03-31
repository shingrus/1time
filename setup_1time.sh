#/bin/bash

rm 1time
go build
sudo install 1time /usr/local/bin/1time
sudo service 1time stop
sudo service 1time start

