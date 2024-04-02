FROM prom/prometheus:v2.47.0

ARG PUSHGATEWAY_URL=monitoring-pushgateway.internal.cke-cs-dev.com

ADD ./infrastructure/prometheus /etc/prometheus

USER root

RUN sed -i "s/pushgateway:9091/$PUSHGATEWAY_URL/g" /etc/prometheus/prometheus.yml

ENTRYPOINT ["sh", "/etc/prometheus/entrypoint.sh"]
