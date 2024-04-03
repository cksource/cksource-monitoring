hash=$(htpasswd -nbBC 14 admin $BASIC_AUTH_PASSWORD | sed 's/admin//' | tr -d ':\n')
echo "basic_auth_users:" > /etc/prometheus/webconfig.yml
echo "  cks: $hash" >> /etc/prometheus/webconfig.yml

echo "$BASIC_AUTH_PASSWORD" > /etc/prometheus/password

/opt/bitnami/prometheus/bin/prometheus $@
