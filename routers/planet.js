// Load in Express framework
const express = require(`express`)

// Load in our controller/action instances
const planetCtlr = require(`../controllers/planet.js`)

// Loading in our image upload middleware
const { uploadPlanetImage } = require(`../middlewares`)

// Create a new Router instance and call it "router"
const router = new express.Router()

// RESTful resource mappings
router.get(`/`, planetCtlr.index)
router.get(`/new`, planetCtlr.new)
// Added our uploadPlanetImage middleware to our create route
router.post(`/`, planetCtlr.create, uploadPlanetImage)
router.get(`/:id`, planetCtlr.show)
router.get(`/:id/show`, planetCtlr.show)
router.get(`/:id/edit`, planetCtlr.edit)
// Added our uploadPlanetImage middleware to our update route
router.put(`/:id`, planetCtlr.update, uploadPlanetImage)
router.delete(`/:id`, planetCtlr.remove)

// HTML5-specific routes: browsers can only send GET/POST, so plain HTML
// forms and links use these instead of PUT/DELETE
router.post(`/:id`, planetCtlr.update, uploadPlanetImage)
router.get(`/:id/delete`, planetCtlr.remove)

// export "router"
module.exports = router
