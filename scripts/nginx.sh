#!/bin/bash

sudo ufw allow openssh
sudo ufw --force enable
sudo apt-get install -y nginx
sudo ufw allow 443
sudo ufw allow 80
sudo chmod -R 755 /var/www

shred -u $0