const { Star } = require('../models');

// Show all resources
const index = async (req, res) => {
  // Respond with an array and 2xx status code
  const stars = await Star.findAll();
  res.status(200).json(stars);
}


// Show resource
const show = async (req, res) => {
  // Respond with a single object and 2xx code
  const star = await Star.findByPk(req.params.id);
  res.status(200).json(star);
};

// Create a new resource
const create = async (req, res) => {
  // Issue a redirect with a success 2xx code
  const star = await Star.create(req.body);
  res.redirect(201, `/stars/${star.id}`);
};

// Update an existing resource
const update = async (req, res) => {
  // Respond with a single resource and 2xx code
  const star = await Star.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  res.status(202).json(star);
};

// Remove a single resource
const remove = async (req, res) => {
  // Respond with a 2xx status code and bool
  const deleted = await Star.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json(deleted);
}

// Export all controller actions
module.exports = { index, show, create, update, remove }
