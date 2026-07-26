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

// Minimal styled error page, kept inline so it can never fail to render
const errorPage = (status, message) => `
	<html>
		<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
			background:linear-gradient(to right,#102142,#422E8F);color:#fff;font-family:sans-serif;text-align:center;">
			<div>
				<h1 style="font-size:3rem;margin-bottom:0.5rem;">${status}</h1>
				<p style="font-size:1.25rem;margin-bottom:2rem;">${message}</p>
				<a href="/" style="color:#fff;text-decoration:underline;">Back to Home</a>
			</div>
		</body>
	</html>
`;

// Catch-all for unmatched routes
app.use((req, res) => {
	if (wantsJson(req)) return res.status(404).json({ error: 'Not Found' });
	res.status(404).send(errorPage(404, 'Not Found'));
});

// Central error handler
app.use((err, req, res, next) => {
	console.error(err);
	const status = err.status || 500;
	if (wantsJson(req)) return res.status(status).json({ error: err.message });
	res.status(status).send(errorPage(status, err.message));
});

// Set our app to listen on port 3000
app.listen(3000);
