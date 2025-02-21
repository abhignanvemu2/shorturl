FROM node:18-alpine

#create app directory
WORKDIR /app

#install app dependencies
COPY package.json ./

#Run npm install
RUN npm install

#Bundle app source
COPY . . 

#Expose port and start application
EXPOSE 3000

CMD ["npm", "start"]

