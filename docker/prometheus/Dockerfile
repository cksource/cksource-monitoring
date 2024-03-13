FROM prom/prometheus:v2.47.0

ADD ./infrastructure/prometheus/prometheus.yml /etc/prometheus/prometheus.yml

RUN sed 's/pushgateway:9091/https:\/\/:monitoring-pushgateway.internal.cke-cs-dev.com/g' /etc/prometheus/prometheus.yml