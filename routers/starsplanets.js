// Load in Express framework
const express = require(`express`)

// Load in our controller/action instances
const starsPlanetsCtlr = require(`../controllers/starsplanets.js`)

// Create a new Router instance and call it "router"
const router = new express.Router()

// RESTful resource mappings
router.get(`/`, starsPlanetsCtlr.index)
router.get(`/new`, starsPlanetsCtlr.new)
router.post(`/`, starsPlanetsCtlr.create)
router.get(`/:id`, starsPlanetsCtlr.show)
router.get(`/:id/edit`, starsPlanetsCtlr.edit)
router.put(`/:id`, starsPlanetsCtlr.update)
router.delete(`/:id`, starsPlanetsCtlr.remove)

// HTML5-specific routes: browsers can only send GET/POST, so plain HTML
// forms and links use these instead of PUT/DELETE
router.post(`/:id`, starsPlanetsCtlr.update)
router.get(`/:id/delete`, starsPlanetsCtlr.remove)

// export "router"
module.exports = router
