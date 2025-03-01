FROM node:lts AS base

WORKDIR /usr/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

FROM base AS build

RUN pnpm prisma generate

RUN pnpm build api-gateway

FROM base AS development

ENV NODE_ENV=development

CMD ["pnpm", "start:api-gateway:dev"]

FROM base AS production

ENV NODE_ENV=production

COPY --from=build /usr/app/dist ./dist

CMD ["pnpm", "start:api-gateway:prod"]