FROM node:20-alpine3.18
COPY . /app/question_bank
WORKDIR /app/question_bank
RUN npm install
EXPOSE 7005
CMD ["npm", "start"]