FROM node:16.13.1

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install

RUN npm run build

# Copying rest of the application to app directory
COPY . /app

# Expose the port and start the application
EXPOSE 3000

CMD ["npm","start"]