FROM docker.io/node:16.18.1-alpine3.16 as builder

WORKDIR /site

COPY . .

# NodeJS Dependencies
RUN npm ci

RUN npm run build

WORKDIR /site/build

# TODO generate
RUN wget -O index.yaml https://modules.cloudnativetoolkit.dev/index.yaml && \
    wget -O summary.yaml https://modules.cloudnativetoolkit.dev/summary.yaml

FROM docker.io/bitnami/nginx:1.23.2

EXPOSE 8080 8443
COPY --from=builder /site/build /app
