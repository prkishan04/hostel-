## Backend Dockerfile
# DevOps: build a small, production-focused image for the API.

FROM node:20-alpine

WORKDIR /usr/src/app

# DevOps: copy manifest first to leverage Docker layer cache for installs.
COPY package*.json ./

RUN npm install --production

# Copy application source
COPY src ./src

ENV NODE_ENV=production

# DevOps: expose only internal container port; not published to host in compose.
EXPOSE 4000

CMD ["npm", "start"]

