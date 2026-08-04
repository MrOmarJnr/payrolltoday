# LEF ERP — Backend (Node/Express) image
# No secrets are baked in; all config comes from environment at runtime.
FROM node:22-alpine

WORKDIR /app

# Install production dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# App source
COPY . .

# Attachments live here; a volume is mounted over it in compose to persist them
RUN mkdir -p uploads

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server.js"]
