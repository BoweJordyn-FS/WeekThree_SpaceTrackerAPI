// Load in our Express framework
const express = require(`express`);
const app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

// Load twig and path modules for rendering our home page
const twig = require('twig');
const path = require('path');

const { wantsJson } = require('./utils/respond');

//Set Twig as the view engine
app.set('view engine', 'twig');
app.set('views', `${__dirname}/templates`);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

// parse application/json
app.use(bodyParser.json());

// parse multipart/form-data (file uploads) and populate req.files / req.body
app.use(fileUpload());

// Serve uploaded images and any other static assets from /public
app.use(express.static(path.join(__dirname, 'public')));

// Load in our RESTful routers
const routers = require('./routers/index.js');

// Home page welcome middleware
app.get('/', (req, res) => {
	res.render('views/home', { message: 'Hello World' });
});

// Register our RESTful routers with our "app"
app.use(`/planets`, routers.planet);
app.use(`/stars`, routers.star);
app.use(`/galaxies`, routers.galaxy);
app.use(`/starsplanets`, routers.starsPlanets);

// Central error handler
app.use((err, req, res, next) => {
	console.error(err);
	const status = err.status || 500;
	if (wantsJson(req)) return res.status(status).json({ error: err.message });
	res.status(status).send(`<h1>${status} - ${err.message}</h1>`);
});

// Set our app to listen on port 3000
app.listen(3000);
