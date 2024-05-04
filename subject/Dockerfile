FROM node:20-alpine3.18
COPY . /app/subject
WORKDIR /app/subject
RUN npm install
EXPOSE 7004
CMD ["npm", "start"]