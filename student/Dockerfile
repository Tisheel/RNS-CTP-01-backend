FROM node:20-alpine3.18
COPY . /app/student
WORKDIR /app/student
RUN npm install
EXPOSE 7001
CMD ["npm", "start"]