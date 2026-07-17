const { StarsPlanets } = require('../models');

// Show all resources
const index = async (req, res) => {
	// Respond with an array and 2xx status code
	const starsPlanets = await StarsPlanets.findAll();
	res.status(200).json(starsPlanets);
};

// Show resource
const show = async (req, res) => {
	// Respond with a single object and 2xx code
	const starPlanet = await StarsPlanets.findByPk(req.params.id);
	res.status(200).json(starPlanet);
};

// Create a new resource
const create = async (req, res) => {
	// Issue a redirect with a success 2xx code
	const starPlanet = await StarsPlanets.create(req.body);
	res.redirect(201, `/starsplanets/${starPlanet.id}`);
};

// Update an existing resource
const update = async (req, res) => {
	// Respond with a single resource and 2xx code
	const starPlanet = await StarsPlanets.update(req.body, {
		where: {
			id: req.params.id,
		},
	});
	res.status(202).json(starPlanet);
};

// Remove a single resource
const remove = async (req, res) => {
	// Respond with a 2xx status code and bool
	const deleted = await StarsPlanets.destroy({
		where: {
			id: req.params.id,
		},
	});
	res.status(200).json(deleted);
};

// Export all controller actions
module.exports = { index, show, create, update, remove };
