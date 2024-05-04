FROM node:20-alpine3.18
COPY . /app/professor
WORKDIR /app/professor
RUN npm install
EXPOSE 7002
CMD ["npm", "start"]