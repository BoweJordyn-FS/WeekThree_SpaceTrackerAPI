const { Planets } = require('../models');
const { wantsJson, notFound } = require('../utils/respond');

// Show all resources
const index = async (req, res, next) => {
	try {
		const planets = await Planets.findAll();
		if (wantsJson(req)) {
			res.status(200).json(planets);
		} else {
			res.status(200).render('views/planets/index', { planets });
		}
	} catch (err) {
		next(err);
	}
};

// Show resource
const show = async (req, res, next) => {
	try {
		const planet = await Planets.findByPk(req.params.id);
		if (!planet) return notFound(req, res, 'Planet not found');

		const stars = await planet.getStars();
		if (wantsJson(req)) {
			planet.dataValues.stars = stars;
			res.status(200).json(planet);
		} else {
			res.status(200).render('views/planets/show', { planet, stars });
		}
	} catch (err) {
		next(err);
	}
};

// Render the form for creating a new resource
const newForm = (req, res) => {
	res.status(200).render('views/planets/new', { planet: {} });
};

// Render the form for editing an existing resource
const editForm = async (req, res, next) => {
	try {
		const planet = await Planets.findByPk(req.params.id);
		if (!planet) return notFound(req, res, 'Planet not found');
		res.status(200).render('views/planets/edit', { planet });
	} catch (err) {
		next(err);
	}
};

// Create a new resource
const create = async (req, res, next) => {
	if (!req.body.name) {
		if (wantsJson(req)) {
			return res.status(400).json({ error: 'name is required' });
		}
		return res.status(400).render('views/planets/new', { planet: req.body, error: 'name is required' });
	}

	try {
		const planet = await Planets.create(req.body);
		// Sets a pretext "planetId" for our upload middleware
		req.planetId = planet.id;
		// Invoke our upload middleware with next()
		next();

		if (wantsJson(req)) {
			res.status(201).json(planet);
		} else {
			res.redirect(303, `/planets/${planet.id}`);
		}
	} catch (err) {
		next(err);
	}
};

// Update an existing resource
const update = async (req, res, next) => {
	try {
		const planet = await Planets.findByPk(req.params.id);
		if (!planet) return notFound(req, res, 'Planet not found');

		await planet.update(req.body);
		// Sets a pretext "planetId" for our upload middleware
		req.planetId = planet.id;
		// Invoke our upload middleware with next()
		next();

		if (wantsJson(req)) {
			res.status(200).json(planet);
		} else {
			res.redirect(303, `/planets/${planet.id}`);
		}
	} catch (err) {
		next(err);
	}
};

// Remove a single resource
const remove = async (req, res, next) => {
	try {
		const planet = await Planets.findByPk(req.params.id);
		if (!planet) return notFound(req, res, 'Planet not found');

		await planet.destroy();
		if (wantsJson(req)) {
			res.status(200).json({ id: planet.id, deleted: true });
		} else {
			res.redirect(303, '/planets');
		}
	} catch (err) {
		next(err);
	}
};

// Export all controller actions
module.exports = { index, show, new: newForm, edit: editForm, create, update, remove };
