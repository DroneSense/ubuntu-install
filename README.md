### Ubuntu Server 16 Installation  
1. Enter bios on server and set the boot device to be the usb with Ubuntu .iso installed  
2. Save changes and restart  
3. Start Ubuntu installation process  
4. Use defaults for most items  
5. Give the server a matching name as the box  
6. use dronesense for the username and password  
7. No to encrypt directory  
8. use entire disk option  
9. No to automatic updates  
10. Default packages to be installed  
  
  
### Red5Pro Installation  
1. sudo apt-get update  
2. sudo apt-get install default-jre  
3. sudo apt-get install unzip  
4. wget https://github.com/DroneSense/install/raw/master/red5pro-server-1.3.1-release.zip  
5. sudo unzip red5pro-server-1.3.1-release.zip  
6. sudo mv red5pro-server-1.3.1.b116-release red5pro  
7. cd /etc/init.d/  
8. wget https://github.com/DroneSense/install/raw/master/red5pro  
9. sudo chmod 777 red5pro  
10. sudo /usr/sbin/update-rc.d red5pro defaults  
11. sudo /usr/sbin/update-rc.d red5pro enable  
12. cd /home/dronesense  
13. sudo /etc/init.d/red5pro start  
  
### NVM Installation  
1. curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash  
2. reboot  
3. command -v nvm (this will verify correct installation)  
4. nvm install node  
5. nvm use node  
6. node install npm?  

### DroneSense Server Bluetooth Prerequisite  
1. sudo apt-get install libbluetooth-dev  

### DroneSense Server ZMQ Prerequisite  
1. sudo apt-get update  
2. sudo apt-get upgrade  
3. sudo apt-get install python3.5-dev  
4. cd  
5. sudo apt-get install libtool pkg-config build-essential autoconf automake  
6. mkdir build  
7. cd build/  
8. wget https://download.libsodium.org/libsodium/releases/libsodium-1.0.8.tar.gz  
9. tar -zxvf libsodium-1.0.8.tar.gz  
10. cd libsodium-1.0.8/  
11. ./configure  
12. make  
13. sudo make install  
14. sudo ldconfig  
15. cd ..  
16. wget http://download.zeromq.org/zeromq-4.1.4.tar.gz  
17. tar -zxvf zeromq-4.1.4.tar.gz  
18. cd zeromq-4.1.4/  
19. ./configure  
20. make  
21. sudo make install  
22. sudo ldconfig  
23. reboot  
  
### DroneSense Server Installation  
1. npm login (Login with credentials)  
2. sudo apt-get install python  
3. npm install -g @dronesense/server  
4. dronesense (confirm installation)  
  
### Setting up services  
1. Copy the foo.service files into /etc/systemd/system/ directory  
2. systemctl enable foo  
3. systemctl start foo  
4. systemctl status foo  
5. reboot to verify running  
  
### Setting up dswebserver.service 
1. cp dswebserver.service /etc/systemd/system/  
2. systemctl enable dswebserver  
3. systemctl start dswebserver  
4. systemctl status dswebserver  
