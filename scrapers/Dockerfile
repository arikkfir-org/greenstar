# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/playwright:v1.54.1-noble AS production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY ./playwright.config.ts ./
COPY ./tsconfig.json ./
COPY ./src ./src/
ENV NODE_ENV=development
ARG VERSION=0.0.0-notset
RUN npm pkg set version="${VERSION}"
ENTRYPOINT ["npm","run","scrape"]
