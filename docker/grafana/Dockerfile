FROM grafana/grafana:10.1.2

ADD ./infrastructure/grafana/ /etc/grafana/provisioning/

USER root

RUN sed -i 's/http:\/\/prometheus:9090/https:\/\/:monitoring-prometheus.internal.cke-cs-dev.com/g' /etc/grafana/provisioning/datasources/prometheus-source.yaml

USER "$GF_UID"