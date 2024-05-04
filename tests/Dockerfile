FROM node:20-alpine3.18
COPY . /app/tests
WORKDIR /app/tests
RUN npm install
EXPOSE 7003
CMD ["npm", "start"]