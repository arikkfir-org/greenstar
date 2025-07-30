# syntax=docker/dockerfile:1

FROM node:24-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY ./tsconfig.json ./
COPY ./src ./src/

FROM node:24-alpine AS development
WORKDIR /app
COPY --from=dependencies /app ./
ARG NODE_ENV=development
ARG VERSION=0.0.0-notset
RUN npm pkg set version="${VERSION}"
ENTRYPOINT ["npm","run","dev"]

FROM node:24-alpine AS production
WORKDIR /app
COPY --from=dependencies /app ./
ARG NODE_ENV=production
ARG VERSION=0.0.0-notset
RUN npm pkg set version="${VERSION}"
ENTRYPOINT ["npm","run","start"]
