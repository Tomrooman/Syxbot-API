FROM node:12.18.2

# Create Directory for the Container
WORKDIR /usr/src/app

# Only copy the package.json file to work directory
COPY package.json .

# Install all Packages
RUN yarn

# Copy all other source code to work directory
ADD . /usr/src/app

# TypeScript
# RUN npm run tsc

# Start
CMD [ "yarn", "start-log" ]
EXPOSE 9000