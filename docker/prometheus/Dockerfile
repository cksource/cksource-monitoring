FROM prom/prometheus:v2.47.0

ADD ./infrastructure/prometheus /etc/prometheus

USER root

RUN sed -i 's/pushgateway:9091/monitoring-pushgateway.internal.cke-cs-dev.com/g' /etc/prometheus/prometheus.yml

ENTRYPOINT ["sh", "/etc/prometheus/entrypoint.sh"]
