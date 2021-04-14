#!/bin/bash

usage() {
	echo `basename $0`: ERROR: $* 1>&2
	echo usage: 'sudo ./'`basename $0` 'postgresql_base_de_datos postgresql_pass_to_user_admin' 1>&2
	exit 1
}

case $# in
        0) usage "Debe ingresar base de datos y password para el usuario admin";;
        1) usage "Debe ingresar base de datos y password para el usuario admin";;
        2) BASEDATOS=$2;PASSWORD=$3;;
        *) usage "Demasiados argumentos no esperados";;
esac

echo "INSTALANDO SISTEMA MICROCREDITOS"

#echo "APT UPDATE"
#apt-get update

#echo "APT UPGRADE"
#apt-get upgrade

#echo "INSTALAR NODE"
#curl -sL https://deb.nodesource.com/setup_0.12 | sudo -E bash -
#apt-get install -y nodejs

#echo "INSTALAR NPM"
#npm install npm@3.10.5 -g

#echo "INSTALAR LENGUAJE ES-MX"
#locale-gen es_MX.UTF-8

#echo "AJUSTAR TIME ZONA"
#timedatectl set-timezone America/Mexico_City
#service cron restart

#echo "REGISTRAR POSTGRES"
#sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
#sudo wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O - | sudo apt-key add -

#echo "APT UPDATE"
#sudo apt-get update

#echo "INSTALAR POSTGRES"
#sudo apt-get install postgresql postgresql-contrib

#echo "CONFIGURAR POSTGRES.CONF"
#sudo sed -i "s/datestyle = 'iso, mdy'/datestyle = 'iso, ymd'/" /etc/postgresql/11/main/postgresql.conf
#sudo sed -i "s/timezone = 'localtime'/timezone = 'UTC'/" /etc/postgresql/11/main/postgresql.conf
#sudo sed -i "s/lc_messages = 'en_US.UTF-8'/lc_messages ='es_MX.UTF-8'/" /etc/postgresql/11/main/postgresql.conf
#sudo sed -i "s/lc_monetary = 'en_US.UTF-8'/lc_monetary ='es_MX.UTF-8'/" /etc/postgresql/11/main/postgresql.conf
#sudo sed -i "s/lc_numeric = 'en_US.UTF-8'/lc_numeric ='es_MX.UTF-8'/" /etc/postgresql/11/main/postgresql.conf
#sudo sed -i "s/lc_time = 'en_US.UTF-8'/lc_time ='es_MX.UTF-8'/" /etc/postgresql/11/main/postgresql.conf
#sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/11/main/postgresql.conf

#echo "CONFIGURAR PG_HBA.CONF"
#sudo sed -i "s/host    all             all             127.0.0.1\/32            md5/host    all             all             127.0.0.1\/32            md5\nhost    all             all             0.0.0.0\/0       md5/" /etc/postgresql/11/main/pg_hba.conf


login to postgresql prompt
7. $ sudo -u postgres psql postgres

 set postgres password
8. postgres=# \password postgres
 - introducir el pass
 - confirmar pass
9. postgres=# \q


#echo "CONFIGURAR USER POSTGRESQL"
#sudo su - postgres -c "psql -U postgres -d postgres -c \"ALTER USER postgres WITH PASSWORD '"$PASSWORD"';\""
#sudo su - postgres -c "psql -c \"CREATE USER admin WITH PASSWORD '"$PASSWORD"';\""

#echo "REINICIANDO POSTGRESQL"
#sudo service postgresql restart

#echo "CREANDO BD"
#sudo su - postgres -c "psql -c \"CREATE DATABASE "$BASEDATOS" WITH OWNER = admin TEMPLATE = 'template0' ENCODING = 'UTF8' TABLESPACE = pg_default LC_COLLATE = 'es_MX.UTF-8' LC_CTYPE = 'es_MX.UTF-8' CONNECTION LIMIT = -1;\""

#sudo su - postgres -c "psql -c \"CREATE DATABASE realfix_dev WITH OWNER = postgres TEMPLATE = 'template0' ENCODING = 'UTF8' TABLESPACE = pg_default LC_COLLATE = 'es_MX.UTF-8' LC_CTYPE = 'es_MX.UTF-8' CONNECTION LIMIT = -1;\""


#FALTA VALIDAR EXISTENCIA DE package.json

#echo "INSTALANDO MODULOS NPM"
#npm install

#FALTA ACTUALIZAR jade -> pug  y transformers -> jstransformer

#entrar como root
#$ sudo -i

#crear carpeta 
#mkdir /postgres

#dar permisos a usuario postgres
#chown -R postgres:postgres /postgres

#salir, entrar como postgres
#su - postgres -c "psql "$BASEDATOS" < dump.sql"

#hacer backup:
#26. postgres# pg_dump -o entregas > entregas_dump

#Restaurar:
#copiar el archivo en una carpeta que pueda leer usuario postgres
#entrar como postgres
#sudo -su postgres
#27. psql entregas < entregas_dump




#enrutar puerto 8080
#checar si esta habilitado:
#cat /proc/sys/net/ipv4/ip_forward
#si sale 0 es que no.

#Hay que habilitarlo:
#sudo vi /etc/sysctl.conf
#descomentar linea: net.ipv4.ip_forward

#habilitar estos cambios:
#sudo sysctl -p /etc/sysctl.conf

#checar de nuevo si ya esta habilitado.

#luego enrutar 80 a 8080
#sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080


#sudo iptables -t nat -L


#Para hacer que arranque desde el boot:
#sudo chmod +x auto.sh
#sudo cp k999sistema.sh /etc/init.d/
#sudo chmod +x /etc/init.d/k999sistema.sh
#sudo update-rc.d k999sistema.sh defaults 

#Pasar todo
PASAR TODO:
#-o pasar archivos
#-O no usar Owner
pg_dump -o -O -h localhost -U postgres  realfix-v2-prod | psql -h 18.236.199.163 -U postgres realfix_prod

pg_dump -o -O -h localhost -U postgres  realfix-v2-prod_NOUSAR | psql -h 34.222.121.28 -U postgres realfix_dev
