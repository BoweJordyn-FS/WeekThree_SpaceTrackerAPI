const { StarsPlanets, Star, Planets } = require('../models');
const { wantsJson, notFound } = require('../utils/respond');

// Show all resources
const index = async (req, res, next) => {
	try {
		const starsPlanets = await StarsPlanets.findAll();
		if (wantsJson(req)) {
			res.status(200).json(starsPlanets);
		} else {
			res.status(200).render('views/starsplanets/index', { starsPlanets });
		}
	} catch (err) {
		next(err);
	}
};

// Show resource
const show = async (req, res, next) => {
	try {
		const starPlanet = await StarsPlanets.findByPk(req.params.id);
		if (!starPlanet) return notFound(req, res, 'Association not found');

		if (wantsJson(req)) {
			res.status(200).json(starPlanet);
		} else {
			res.status(200).render('views/starsplanets/show', { starPlanet });
		}
	} catch (err) {
		next(err);
	}
};

// Render the form for creating a new resource
const newForm = async (req, res, next) => {
	try {
		const [stars, planets] = await Promise.all([Star.findAll(), Planets.findAll()]);
		res.status(200).render('views/starsplanets/new', { starPlanet: {}, stars, planets });
	} catch (err) {
		next(err);
	}
};

// Render the form for editing an existing resource
const editForm = async (req, res, next) => {
	try {
		const starPlanet = await StarsPlanets.findByPk(req.params.id);
		if (!starPlanet) return notFound(req, res, 'Association not found');

		const [stars, planets] = await Promise.all([Star.findAll(), Planets.findAll()]);
		res.status(200).render('views/starsplanets/edit', { starPlanet, stars, planets });
	} catch (err) {
		next(err);
	}
};

// Create a new resource
const create = async (req, res, next) => {
	if (!req.body.starId || !req.body.planetId) {
		if (wantsJson(req)) {
			return res.status(400).json({ error: 'starId and planetId are required' });
		}
		return res.status(400).render('views/starsplanets/new', {
			starPlanet: req.body,
			error: 'starId and planetId are required',
		});
	}

	try {
		const starPlanet = await StarsPlanets.create(req.body);
		if (wantsJson(req)) {
			res.status(201).json(starPlanet);
		} else {
			res.redirect(303, `/starsplanets/${starPlanet.id}`);
		}
	} catch (err) {
		next(err);
	}
};

// Update an existing resource
const update = async (req, res, next) => {
	try {
		const starPlanet = await StarsPlanets.findByPk(req.params.id);
		if (!starPlanet) return notFound(req, res, 'Association not found');

		await starPlanet.update(req.body);
		if (wantsJson(req)) {
			res.status(200).json(starPlanet);
		} else {
			res.redirect(303, `/starsplanets/${starPlanet.id}`);
		}
	} catch (err) {
		next(err);
	}
};

// Remove a single resource
const remove = async (req, res, next) => {
	try {
		const starPlanet = await StarsPlanets.findByPk(req.params.id);
		if (!starPlanet) return notFound(req, res, 'Association not found');

		await starPlanet.destroy();
		if (wantsJson(req)) {
			res.status(200).json({ id: starPlanet.id, deleted: true });
		} else {
			res.redirect(303, '/starsplanets');
		}
	} catch (err) {
		next(err);
	}
};

// Export all controller actions
module.exports = { index, show, new: newForm, edit: editForm, create, update, remove };
