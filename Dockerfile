# Use the official Node.js image as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app
RUN npm run build

# Install serve to serve the build directory
RUN npm install -g serve

# Expose the port the app will run on
EXPOSE 3000

# Start the React app
CMD ["serve", "-s", "build"]