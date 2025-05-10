# Dockerfile.cpp
FROM gcc:latest

WORKDIR /usr/src/app

COPY entrypoints/cpp-entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
