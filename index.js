// Load in our Express framework
const express = require(`express`);
const app = express();
const bodyParser = require('body-parser');

// Load ejs and path modules for rendering our home page
const ejs = require('ejs');
const path = require('path');

//Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

// parse application/json
app.use(bodyParser.json());

// Load in our RESTful routers
const routers = require('./routers/index.js');

// Home page welcome middleware
app.get('/', (req, res) => {
	res.status(200).render('index');
});

// Register our RESTful routers with our "app"
app.use(`/planets`, routers.planet);
app.use(`/stars`, routers.star);
app.use(`/galaxies`, routers.galaxy);
app.use(`/starsplanets`, routers.starsPlanets);

// Set our app to listen on port 3000
app.listen(3000);
