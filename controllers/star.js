const { Star } = require('../models');
const { wantsJson, notFound } = require('../utils/respond');

// Show all resources
const index = async (req, res, next) => {
	try {
		const stars = await Star.findAll();
		if (wantsJson(req)) {
			res.status(200).json(stars);
		} else {
			res.status(200).render('views/stars/index', { stars });
		}
	} catch (err) {
		next(err);
	}
};

// Show resource
const show = async (req, res, next) => {
	try {
		const star = await Star.findByPk(req.params.id);
		if (!star) return notFound(req, res, 'Star not found');

		const planets = await star.getPlanets();
		if (wantsJson(req)) {
			star.dataValues.planets = planets;
			res.status(200).json(star);
		} else {
			res.status(200).render('views/stars/show', { star, planets });
		}
	} catch (err) {
		next(err);
	}
};

// Render the form for creating a new resource
const newForm = (req, res) => {
	res.status(200).render('views/stars/new', { star: {} });
};

// Render the form for editing an existing resource
const editForm = async (req, res, next) => {
	try {
		const star = await Star.findByPk(req.params.id);
		if (!star) return notFound(req, res, 'Star not found');
		res.status(200).render('views/stars/edit', { star });
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
		return res.status(400).render('views/stars/new', { star: req.body, error: 'name is required' });
	}

	try {
		const star = await Star.create(req.body);
		// Sets a pretext "starId" for our upload middleware
		req.starId = star.id;
		// Invoke our upload middleware with next()
		next();

		if (wantsJson(req)) {
			res.status(201).json(star);
		} else {
			res.redirect(303, `/stars/${star.id}`);
		}
	} catch (err) {
		next(err);
	}
};

// Update an existing resource
const update = async (req, res, next) => {
	try {
		const star = await Star.findByPk(req.params.id);
		if (!star) return notFound(req, res, 'Star not found');

		await star.update(req.body);
		// Sets a pretext "starId" for our upload middleware
		req.starId = star.id;
		// Invoke our upload middleware with next()
		next();

		if (wantsJson(req)) {
			res.status(200).json(star);
		} else {
			res.redirect(303, `/stars/${star.id}`);
		}
	} catch (err) {
		next(err);
	}
};

// Remove a single resource
const remove = async (req, res, next) => {
	try {
		const star = await Star.findByPk(req.params.id);
		if (!star) return notFound(req, res, 'Star not found');

		await star.destroy();
		if (wantsJson(req)) {
			res.status(200).json({ id: star.id, deleted: true });
		} else {
			res.redirect(303, '/stars');
		}
	} catch (err) {
		next(err);
	}
};

// Export all controller actions
module.exports = { index, show, new: newForm, edit: editForm, create, update, remove };
