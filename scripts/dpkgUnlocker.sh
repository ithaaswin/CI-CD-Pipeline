#! /bin/rm -rf
# $1 - {home/[ubuntu/vagrant]} or root

HOME=$1

sudo systemctl restart systemd-timesyncd.service
sudo systemctl stop unattended-upgrades
sudo systemctl disable unattended-upgrades
sudo systemctl stop apt-daily.timer
sudo rm -rf /var/lib/dpkg/lock
sudo rm -rf /var/lib/dpkg/lock-frontend
sudo rm -rf /var/lib/apt/lists/lock
sudo rm -rf /var/cache/apt/archives/lock

shred -u $0