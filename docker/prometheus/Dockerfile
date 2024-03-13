FROM prom/prometheus:v2.47.0

ADD ./infrastructure/prometheus/prometheus.yml /etc/prometheus/prometheus.yml

USER root

RUN sed -i 's/pushgateway:9091/monitoring-pushgateway.internal.cke-cs-dev.com/g' /etc/prometheus/prometheus.yml

USER nobody