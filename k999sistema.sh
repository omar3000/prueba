#!/bin/sh
sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
/home/ubuntu/sistema/auto.sh &

