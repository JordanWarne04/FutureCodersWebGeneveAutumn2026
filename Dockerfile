FROM node:22-alpine AS build
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache libstdc++ && mkdir -p /data && chown node:node /data
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
USER node
ENV NODE_ENV=production PORT=3000 HOST=0.0.0.0 DATA_DIR=/data
EXPOSE 3000
CMD ["node","build/index.js"]