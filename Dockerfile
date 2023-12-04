FROM node:20.9-buster-slim
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install

COPY apps/backend/package.json /app/apps/backend/package.json
#COPY apps/frontend/package.json /app/apps/frontend/package.json
RUN npm install

COPY . .
EXPOSE 3000
RUN npm run build
ENTRYPOINT ["npm", "run", "start:prod"]