# Minify client side assets (JavaScript)
FROM node:25-trixie-slim AS build-js

WORKDIR /build
COPY . .
RUN npm ci --audit=false --fund=false
RUN npm run build


# Build Golang binary
FROM golang:1.26-trixie AS build-golang

WORKDIR /go/src/github.com/gophish/gophish
COPY . .
RUN go mod download
RUN go build -v


# Runtime container
FROM debian:trixie-slim

RUN useradd -m -d /opt/gophish -s /bin/bash app

RUN apt-get update && \
	apt-get install --no-install-recommends -y jq libcap2-bin ca-certificates && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /opt/gophish
COPY --from=build-golang /go/src/github.com/gophish/gophish/ ./
COPY --from=build-js /build/static/js/dist/ ./static/js/dist/
COPY --from=build-js /build/static/css/dist/ ./static/css/dist/
COPY --from=build-golang --chown=app:app /go/src/github.com/gophish/gophish/config.json ./

RUN setcap 'cap_net_bind_service=+ep' /opt/gophish/gophish

USER app
RUN sed -i 's/127.0.0.1/0.0.0.0/g' config.json
RUN touch config.json.tmp

EXPOSE 3333 8080 8443 80

CMD ["./docker/run.sh"]
