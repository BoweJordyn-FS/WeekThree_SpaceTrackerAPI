const { Galaxy } = require('../models');
const { wantsJson, notFound } = require('../utils/respond');

// Show all resources
const index = async (req, res, next) => {
	try {
		const galaxies = await Galaxy.findAll();
		if (wantsJson(req)) {
			res.status(200).json(galaxies);
		} else {
			res.status(200).render('views/galaxies/galaxies.twig', { galaxies });
		}
	} catch (err) {
		next(err);
	}
};

// Show resource
const show = async (req, res, next) => {
	try {
		const galaxy = await Galaxy.findByPk(req.params.id);
		if (!galaxy) return notFound(req, res, 'Galaxy not found');

		const stars = await galaxy.getStars();
		if (wantsJson(req)) {
			galaxy.dataValues.stars = stars;
			res.status(200).json(galaxy);
		} else {
			res.status(200).render('views/galaxies/showGalaxy.twig', { galaxy, stars });
		}
	} catch (err) {
		next(err);
	}
};

// Render the form for creating a new resource
const newForm = (req, res) => {
	res.status(200).render('views/galaxies/new', { galaxy: {} });
};

// Render the form for editing an existing resource
const editForm = async (req, res, next) => {
	try {
		const galaxy = await Galaxy.findByPk(req.params.id);
		if (!galaxy) return notFound(req, res, 'Galaxy not found');
		res.status(200).render('views/galaxies/edit', { galaxy });
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
		return res
			.status(400)
			.render('views/galaxies/new', {
				galaxy: req.body,
				error: 'name is required',
			});
	}

	try {
		const galaxy = await Galaxy.create(req.body);
		// Sets a pretext "galaxyId" for our upload middleware
		req.galaxyId = galaxy.id;
		// Invoke our upload middleware with next()
		next();

		if (wantsJson(req)) {
			res.status(201).json(galaxy);
		} else {
			res.redirect(303, `/galaxies/${galaxy.id}`);
		}
	} catch (err) {
		next(err);
	}
};

// Update an existing resource
const update = async (req, res, next) => {
	try {
		const galaxy = await Galaxy.findByPk(req.params.id);
		if (!galaxy) return notFound(req, res, 'Galaxy not found');

		await galaxy.update(req.body);
		// Sets a pretext "galaxyId" for our upload middleware
		req.galaxyId = galaxy.id;
		// Invoke our upload middleware with next()
		next();

		if (wantsJson(req)) {
			res.status(200).json(galaxy);
		} else {
			res.redirect(303, `/galaxies/${galaxy.id}`);
		}
	} catch (err) {
		next(err);
	}
};

// Remove a single resource
const remove = async (req, res, next) => {
	try {
		const galaxy = await Galaxy.findByPk(req.params.id);
		if (!galaxy) return notFound(req, res, 'Galaxy not found');

		await galaxy.destroy();
		if (wantsJson(req)) {
			res.status(200).json({ id: galaxy.id, deleted: true });
		} else {
			res.redirect(303, '/galaxies');
		}
	} catch (err) {
		next(err);
	}
};

// Export all controller actions
module.exports = {
	index,
	show,
	new: newForm,
	edit: editForm,
	create,
	update,
	remove,
};
