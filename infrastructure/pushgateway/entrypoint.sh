hash=$(htpasswd -nbBC 14 admin $BASIC_AUTH_PASSWORD | sed 's/admin//' | tr -d ':\n')
echo "basic_auth_users:" > /etc/pushgateway/webconfig.yml
echo "  cks: $hash" >> /etc/pushgateway/webconfig.yml

/opt/bitnami/pushgateway/bin/pushgateway $@
