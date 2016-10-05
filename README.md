Ubuntu Server 16 Installation
1) Enter bios on server and set the boot device to be the usb with Ubuntu .iso installed
2) Save changes and restart
3) Start Ubuntu installation process
4) Use defaults for most items
5) Give the server a matching name as the box
6) use dronesense for the username and password
7) No to encrypt directory
8) use entire disk option
9) No to automatic updates
10) Default packages to be installed


Red5Pro Installation
sudo apt-get update
sudo apt-get install default-jre
sudo apt-get install unzip
wget https://github.com/DroneSense/install/raw/master/red5pro-server-1.3.1-release.zip
sudo unzip red5pro-server-1.3.1-release.zip
sudo mv red5pro-server-1.3.1.b116-release red5pro
cd /etc/init.d/
wget https://github.com/DroneSense/install/raw/master/red5pro
sudo chmod 777 red5pro
sudo /usr/sbin/update-rc.d red5pro defaults
sudo /usr/sbin/update-rc.d red5pro enable
cd /home/dronesense
sudo /etc/init.d/red5pro start

NVM Installation
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
reboot
command -v nvm (this will verify correct installation)
nvm install node
nvm use node
node install npm?

DroneSense Server Bluetooth Prerequisite
sudo apt-get install libbluetooth-dev

DroneSense Server ZMQ Prerequisite
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install python3.5-dev
cd
sudo apt-get install libtool pkg-config build-essential autoconf automake
mkdir build
cd build/
wget https://download.libsodium.org/libsodium/releases/libsodium-1.0.8.tar.gz
tar -zxvf libsodium-1.0.8.tar.gz
cd libsodium-1.0.8/
./configure
make
sudo make install
sudo ldconfig
cd ..
wget http://download.zeromq.org/zeromq-4.1.4.tar.gz
tar -zxvf zeromq-4.1.4.tar.gz
cd zeromq-4.1.4/
./configure
make
sudo make install
sudo ldconfig
reboot

DroneSense Server Installation
npm login
(Login with credentials)
sudo apt-get install python
npm install -g @dronesense/server
dronesense (confirm installation)

Setting up services
Copy the foo.service files into /etc/systemd/system/ directory
systemctl enable foo
systemctl start foo
systemctl status foo
reboot to verify running
