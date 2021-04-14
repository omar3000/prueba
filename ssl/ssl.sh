#!/bin/bash

 sitio="sistema"
 dias=3650
 
 mktemp -u XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX > ${sitio}.txt
chmod 600 ${sitio}.txt

openssl genrsa -des3 -passout file:${sitio}.txt -out ${sitio}.pem 2048

openssl req -new  -passin file:${sitio}.txt -key ${sitio}.pem -out ${sitio}.csr < <( cat <<fuga
MX
COAH
Torreon
Laguna Dev
SW
lagunadev
.
.
.
fuga
)

openssl x509 -req -days ${dias}  -passin file:${sitio}.txt -in ${sitio}.csr -signkey ${sitio}.pem -out ${sitio}.crt

openssl rsa  -passin file:${sitio}.txt -in  ${sitio}.pem -out  ${sitio}.key

