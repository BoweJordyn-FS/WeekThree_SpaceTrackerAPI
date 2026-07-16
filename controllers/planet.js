const { Planets } = require('../models');
// Show all resources
const index = async (req, res) => {
	// Respond with an array and 2xx status code
	const planets = await Planets.findAll();
	res.status(200).json(planets);
};

// Show resource
const show = async (req, res) => {
	// Respond with a single object and 2xx code
	const planet = await Planets.findByPk(req.params.id);
	res.status(200).json(planet);
};

// Create a new resource
const create = async (req, res) => {
	// Issue a redirect with a success 2xx code
	const planet = await Planets.create(req.body);
	res.redirect(201, `/planets/${planet.id}`);
};

// Update an existing resource
const update = async (req, res) => {
	// Respond with a single resource and 2xx code
	const planet = await Planets.update(req.body, {
		where: {
			id: req.params.id,
		},
	});
	res.status(202).json(planet);
};

// Remove a single resource
const remove = async (req, res) => {
	// Respond with a 2xx status code and bool
	const deleted = await Planets.destroy({
		where: {
			id: req.params.id,
		},
	});
	res.status(200).json(deleted);
};

// Export all controller actions
module.exports = { index, show, create, update, remove };
