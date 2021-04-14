#! /bin/sh
VERSION_PG="9.6"
PASSWORD_PG="sdi123qwe"
DATABASE_PG="credigomex"
SERVER_PG="ec2-52-43-207-3.us-west-2.compute.amazonaws.com"
case "$1" in
   install)
          echo "update ubuntu..."
          sudo apt-get -y update
          sudo apt-get install -y sudo
          sudo apt-get install -y curl
          echo "install node..."
          #sudo curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
          sudo curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
          sudo apt-get install -y nodejs
          echo "configure routing..."
          sudo sed -i "s/#net.ipv4.ip_forward/net.ipv4.ip_forward/" /etc/sysctl.conf
          sudo sysctl -p /etc/sysctl.conf
          sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
          sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 8443
          echo "configure auto.sh..."
          sudo chmod +x auto.sh
          sudo cp k999sistema.sh /etc/init.d/
          sudo chmod +x /etc/init.d/k999sistema.sh
          sudo update-rc.d k999sistema.sh defaults
          echo "configure localizarion..."
          sudo locale-gen es_MX.UTF-8
          echo "configure timezone..."
          sudo timedatectl set-timezone America/Mexico_City
          sudo service cron restart          
          #cd /home
          #sudo mkdir tmp
          #sudo chmod 777 tmp
          #sudo chown postgres:ubuntu tmp
          echo "."
           ;;
    start)
          echo "Starting:"
          /home/ubuntu/sistema/auto.sh &
          echo "."
          ;;
   stop)
          echo "Stopping:"
          killall auto.sh
          killall node
          killall nodejs
          echo "."
           ;;
   restart)
          killall node
          sleep 2
          echo "Restarting:"
          echo "."
            ;;
   installpg)
          echo "install postgresql..."
          sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
          sudo wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O - | sudo apt-key add -
          sudo apt-get update
          sudo apt-get install postgresql-$VERSION_PG postgresql-contrib-$VERSION_PG
          echo "configure postgresql..."
          sudo sed -i "s/datestyle = 'iso, mdy'/datestyle = 'iso, ymd'/" /etc/postgresql/$VERSION_PG/main/postgresql.conf
          sudo sed -i "s/timezone = 'localtime'/timezone = 'UTC'/" /etc/postgresql/$VERSION_PG/main/postgresql.conf
          sudo sed -i "s/lc_messages = 'en_US.UTF-8'/lc_messages ='es_MX.UTF-8'/" /etc/postgresql/$VERSION_PG/main/postgresql.conf
          sudo sed -i "s/lc_monetary = 'en_US.UTF-8'/lc_monetary ='es_MX.UTF-8'/" /etc/postgresql/$VERSION_PG/main/postgresql.conf
          sudo sed -i "s/lc_numeric = 'en_US.UTF-8'/lc_numeric ='es_MX.UTF-8'/" /etc/postgresql/$VERSION_PG/main/postgresql.conf
          sudo sed -i "s/lc_time = 'en_US.UTF-8'/lc_time ='es_MX.UTF-8'/" /etc/postgresql/$VERSION_PG/main/postgresql.conf
          sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/$VERSION_PG/main/postgresql.conf
          echo "configure pg_hba..."
          sudo sed -i "s/host    all             all             127.0.0.1\/32            md5/host    all             all             127.0.0.1\/32            md5\nhost    all             all             0.0.0.0\/0       md5/" /etc/postgresql/$VERSION_PG/main/pg_hba.conf
          echo "configure permisos tmp..."
          cd /home
          sudo mkdir tmp
          sudo chmod 777 tmp
          sudo chown postgres:ubuntu tmp          
          #FALLA:
          #echo "configure users..."
          #sudo su - postgres -c "psql -U postgres -d postgres -c \"ALTER USER postgres WITH PASSWORD '"$PASSWORD_PG"';\""
          #sudo su - postgres -c "psql -c \"CREATE USER admin WITH PASSWORD '"$PASSWORD_PG"';\""
          echo "restart postgres..."
          sudo service postgresql restart
            ;;
   copydb)
          #-o pasar oids
          #-O no incluir Owner
          #FALLA:
          #sudo su - postgres -c "pg_dump -o -h localhost -U postgres -O "$DATABASE_PG" | psql -h "$SERVER_PG" -U postgres "$DATABASE_PG
          #ASI DEBE SER: pg_dump -o -h localhost -U postgres -O credigomex | psql -h ec2-52-43-207-3.us-west-2.compute.amazonaws.com -U postgres credigomex
            ;;   
   installnpm)
          sudo npm install
            ;;             
        *)
          echo "Usage: ./make start|stop|restart|install|installpg"
          exit 1
            ;;
   installgit)
         sudo  sudo apt-get install git
	 sudo git config --global user.name "albertoacosta"
	 sudo git config --global user.mail "aacosta1911@gmail.com"
	 # CLONAR: git clone https://github.com/lagunadev/realfix.git
         # UPDATE: git fetch origin master


          
    esac
