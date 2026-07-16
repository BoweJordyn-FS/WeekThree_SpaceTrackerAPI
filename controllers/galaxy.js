const { Galaxy } = require('../models');

// Show all resources
const index = async (req, res) => {
	// Respond with an array and 2xx status code
	const galaxies = await Galaxy.findAll();
	res.status(200).json(galaxies);
};

// Show resource
const show = async (req, res) => {
	// Respond with a single object and 2xx code
	const galaxy = await Galaxy.findByPk(req.params.id);
	const star = await galaxy.getStars();
	const planets = await galaxy.getPlanets();
	galaxy.dataValues.stars = star;
	galaxy.dataValues.planets = planets;
	res.status(200).json(galaxy);
};

// Create a new resource
const create = async (req, res) => {
	// Issue a redirect with a success 2xx code
	const galaxy = await Galaxy.create(req.body);
	res.redirect(201, `/galaxies/${galaxy.id}`);
};

// Update an existing resource
const update = async (req, res) => {
	// Respond with a single resource and 2xx code
	const galaxy = await Galaxy.update(req.body, {
		where: {
			id: req.params.id,
		},
	});
	res.status(202).json(galaxy);
};

// Remove a single resource
const remove = async (req, res) => {
	// Respond with a 2xx status code and bool
	const deleted = await Galaxy.destroy({
		where: {
			id: req.params.id,
		},
	});
	res.status(200).json(deleted);
};

// Export all controller actions
module.exports = { index, show, create, update, remove };
