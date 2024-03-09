# NodeJS Version LTS
FROM node:lts

# Copy Dir
COPY . ./app

# Work to Dir
WORKDIR /app

RUN npm i -g nodemon

RUN npm install

EXPOSE 3000

CMD npm run dev
