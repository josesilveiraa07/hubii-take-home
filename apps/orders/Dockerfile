FROM node:lts AS base

WORKDIR /usr/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm prisma generate

FROM base AS build

RUN pnpm build database
RUN pnpm build orders

FROM base AS development

ENV NODE_ENV=development

CMD ["pnpm", "start:orders:dev"]

FROM base AS production

ENV NODE_ENV=production

COPY --from=build /usr/app/dist ./dist

CMD ["pnpm", "start:orders:prod"]