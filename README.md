# node_telegram
Telegram bot server for send data to telegram from local sources

# ChangeLog 
*   20190121 - add nodemon package for restart on change
*   20190211 - add command for send message and authorize
*   20190217 - example https://212.237.56.234:8080/api/sendtoadmin/?api-key=PASSWORD / https://bot.ip2u.ru:8080/api/sendtoadmin/?api-key=PASSWORD
    * move to HTTPS
    * move to API
    * add parameters to parse
    * add dataservice/utils
*   20190228 - add letsencrypt ssl certificates to bot project and portainer  


---

## TLS Lets Encrypt cheatsheet: 
 * install certbot - https://certbot.eff.org/lets-encrypt/debianjessie-apache.html
 * dnscloudflare - https://bjornjohansen.no/wildcard-certificate-letsencrypt-cloudflare


# generate wildcard certificate - this is for update cert !!!
https://medium.com/@saurabh6790/generate-wildcard-ssl-certificate-using-lets-encrypt-certbot-273e432794d7 \
 In conainer telegram update 
  After update certificate in container  copy to host etc  /etc/encrypt for portainer


# get auto certificates
in container nodejs
```bash
$certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /app/cert/certbot/certbot.ini \
  --dns-cloudflare-propagation-seconds 60 \
  -d *.ip2u.ru


#to renew
$certbot renew

# backup certificates
$for file in *.pem; do
cp $file $file.$(date +%Y%m%d%H%M%S)
done
# copy keys to directory with keys
$cp /etc/letsencrypt/live/ip2u.ru/*.pem ./

#in main hostmachine outside docker for others servers
$sudo cp /opt/src/node_telegram/cert/*.pem /etc/letsencrypt/live/ip2u.ru/

```

# openssl cheatsheet
https://medium.freecodecamp.org/openssl-command-cheatsheet-b441be1e8c4a
#express ssl:
https://hackernoon.com/set-up-ssl-in-nodejs-and-express-using-openssl-f2529eab5bb


links:
http://www.jens79.de/2015-08-06/
how-to-set-up-a-node-js-express-app-on-a-codeanywhere-ubuntu-14-04-devbox.html
https://ru.atlassian.com/git/tutorials/saving-changes/gitignore


# ip fun 
http://212.237.56.234:8080/
http://212.237.56.234:9000/#/auth


http://expressjs.com/ru/api.html#req
https://github.com/expressjs/express/blob/master/examples/web-service/index.js
