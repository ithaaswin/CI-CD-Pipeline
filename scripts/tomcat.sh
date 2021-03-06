#!/bin/bash
tomcatStatus=$(ls /opt | grep tomcat)
if [ -z "$tomcatStatus" ]
then
sudo groupadd tomcat
sudo useradd -s /bin/false -g tomcat -d /opt/tomcat tomcat
cd /tmp
curl -O https://dlcdn.apache.org/tomcat/tomcat-9/v9.0.62/bin/apache-tomcat-9.0.62.tar.gz
sudo mkdir /opt/tomcat
sudo tar xzvf apache-tomcat-*tar.gz -C /opt/tomcat --strip-components=1
cd /opt/tomcat
sudo chgrp -R tomcat /opt/tomcat
sudo chmod -R g+r conf
sudo chmod g+x conf
sudo chown -R tomcat webapps/ work/ temp/ logs/
JAVA_HOME=/usr/lib/jvm/java-1.11.0-openjdk-amd64
CATALINA_HOME=/opt/tomcat

cat << EOF > /etc/systemd/system/tomcat.service
[Unit]
Description=Apache Tomcat Web Application Container
After=network.target

[Service]
Type=forking

Environment=JAVA_HOME=/usr/lib/jvm/java-1.11.0-openjdk-amd64
Environment=CATALINA_PID=/opt/tomcat/temp/tomcat.pid
Environment=CATALINA_HOME=/opt/tomcat
Environment=CATALINA_BASE=/opt/tomcat
Environment='CATALINA_OPTS=-Xms512M -Xmx1024M -server -XX:+UseParallelGC'
Environment='JAVA_OPTS=-Djava.awt.headless=true -Djava.security.egd=file:/dev/./urandom'

ExecStart=/opt/tomcat/bin/startup.sh
ExecStop=/opt/tomcat/bin/shutdown.sh

User=tomcat
Group=tomcat
UMask=0007
RestartSec=10
Restart=always

[Install]
WantedBy=multi-user.target 
EOF

sudo systemctl daemon-reload
sudo systemctl start tomcat
sudo systemctl restart tomcat
sudo ufw allow 8080
sudo systemctl enable tomcat

sudo chmod -R 777 $CATALINA_HOME


# Add to $CATALINA_HOME\conf\tomcat-users.xml
sed -ie '/<\/tomcat-users>/i \\t <role rolename="manager-gui"\/> \
\t <role rolename="manager-script"\/> \
\t <user username="admin" password="password" roles="manager-gui, manager-script"\/>' /opt/tomcat/conf/tomcat-users.xml
sed -ie '/<Valve/i <!--' /opt/tomcat/webapps/manager/META-INF/context.xml
sed -ie '/<Manager/i -->' /opt/tomcat/webapps/manager/META-INF/context.xml
sed -ie '/<Valve/i <!--' /opt/tomcat/webapps/host-manager/META-INF/context.xml
sed -ie '/<Manager/i -->' /opt/tomcat/webapps/host-manager/META-INF/context.xml
sudo systemctl restart tomcat
fi
