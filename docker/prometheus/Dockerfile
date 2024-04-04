FROM bitnami/prometheus:2.51.1

USER root

RUN apt-get update -y && apt-get install apache2-utils curl -y

ARG PUSHGATEWAY_URL=monitoring-pushgateway.internal.cke-cs-dev.com

ADD ./infrastructure/prometheus /etc/prometheus


RUN sed -i "s/pushgateway:9091/$PUSHGATEWAY_URL/g" /etc/prometheus/prometheus.yml

ENTRYPOINT ["sh", "/etc/prometheus/entrypoint.sh"]
