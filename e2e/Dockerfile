# syntax=docker/dockerfile:1

# MUST use the same Playwright Docker image tag as the Playwright package.json version
# See comment here: https://playwright.dev/docs/docker#image-tags
FROM mcr.microsoft.com/playwright:v1.54.1-noble AS production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY ./playwright.config.ts ./
COPY ./tests ./tests/
ARG VERSION=0.0.0-notset
RUN npm pkg set version="${VERSION}"
ENTRYPOINT ["npm","run","test"]
