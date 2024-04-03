FROM bitnami/pushgateway:1.7.0

USER root

RUN apt-get update -y && apt-get install apache2-utils -y

ADD ./infrastructure/pushgateway /etc/pushgateway

ENTRYPOINT ["sh", "/etc/pushgateway/entrypoint.sh"]