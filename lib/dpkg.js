const SSH =require("./SSH");

class dpkgFixer{
    
    async vmUnlocker(processor){
        await SSH.executeVM(processor, `sudo systemctl restart systemd-timesyncd.service`);
        await SSH.executeVM(processor, `sudo systemctl stop unattended-upgrades`);
        await SSH.executeVM(processor, `sudo systemctl disable unattended-upgrades`);
        await SSH.executeVM(processor, `sudo systemctl stop apt-daily.timer`);
        await SSH.executeVM(processor, `sudo rm -rf /var/lib/dpkg/lock`);
        await SSH.executeVM(processor, `sudo rm -rf /var/lib/dpkg/lock-frontend`);
        await SSH.executeVM(processor, `sudo rm -rf /var/lib/apt/lists/lock`);
        await SSH.executeVM(processor, `sudo rm -rf /var/cache/apt/archives/lock`);
    }

    async dropletUnlocker(processor, ip){
        await SSH.executeDroplet(processor, `sudo systemctl restart systemd-timesyncd.service`, ip);
        await SSH.executeDroplet(processor, `sudo systemctl stop unattended-upgrades`, ip);
        await SSH.executeDroplet(processor, `sudo systemctl disable unattended-upgrades`, ip);
        await SSH.executeDroplet(processor, `sudo systemctl stop apt-daily.timer`, ip);
        await SSH.executeDroplet(processor, `sudo rm -rf /var/lib/dpkg/lock`, ip);
        await SSH.executeDroplet(processor, `sudo rm -rf /var/lib/dpkg/lock-frontend`, ip);
        await SSH.executeDroplet(processor, `sudo rm -rf /var/lib/apt/lists/lock`, ip);
        await SSH.executeDroplet(processor, `sudo rm -rf /var/cache/apt/archives/lock`, ip);
    }
} module.exports = new dpkgFixer();