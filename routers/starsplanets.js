// Load in Express framework
const express = require(`express`)

// Load in our controller/action instances
const starsPlanetsCtlr = require(`../controllers/starsplanets.js`)

// Create a new Router instance and call it "router"
const router = new express.Router()

// RESTful resource mappings
router.get(`/`, starsPlanetsCtlr.index)
router.post(`/`, starsPlanetsCtlr.create)
router.get(`/:id`, starsPlanetsCtlr.show)
router.put(`/:id`, starsPlanetsCtlr.update)
router.delete(`/:id`, starsPlanetsCtlr.remove)

// export "router"
module.exports = router
