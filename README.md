# front-Web-BDE

Front-end application for student council (BDE in french).

### Features

- Secure authentication & administration system with student email
- Handling of challenge creation & accomplishment for integration purpuse
- Online market to buy goodies with fake money earned by doing challenges

This project was bootstrapped with [Remix](https://www.npmjs.com/package/remix).

## Requirements

- node
- docker & docker-compose

## Install

### Install dependancies

`npm install`

### Available Scripts

In the project directory, you can run:

#### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to access **application**.

#### `npm run build`

To build for production
#### `npm start`

For production mode


### Environment

You need to setup few environment variables to setup your project :

- **EMAIL_REGEX** : Regex that matches your particular student email, for example : "^[\w\-\.]+@([\w\-]+.)*umontpellier\.fr$" matches emails with umontpellier.fr domain, if none provided regex will match a classic email
- **API-URL** : URL used by axios ro make calls to the API, default : localhost:4000

### Styles

This project uses **Material UI**, for more information check the [Material UI Documentation](https://mui.com/getting-started/installation/)

## Usage

### Structure of routes

There are 5 main routes in this application :

- **/** : Home route, display a simple message
- **/login** : Used to login
- **/register** : Used to register
- **/challenges** : Display the list of all challenges
- **/shop** : Display the list of all goodies in the shop

The routes **/shop** and **/challenges** have some sub-routes :

- **/shop/:id** : Display info on a single goodies + a button to buy it
- **/shop/admin** : Admin panel to create goodies
- **/challenges/:id** : Display info on a single challenge + a form to submit an accomplishment for this challenge
- **/challenge/admin** : Admin panel to create challenges and validate accomplishments

## Learn More

To learn Remix, check out the [Remix documentation](https://remix.run/docs).
