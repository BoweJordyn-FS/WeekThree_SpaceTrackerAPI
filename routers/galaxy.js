// Load in Express framework
const express = require(`express`)

// Load in our controller/action instances
const galaxyCtlr = require(`../controllers/galaxy.js`)

// Loading in our image upload middleware
const { uploadGalaxyImage } = require(`../middlewares`)

// Create a new Router instance and call it "router"
const router = new express.Router()

// RESTful resource mappings
router.get(`/`, galaxyCtlr.index)
router.get(`/new`, galaxyCtlr.new)
// Added our uploadGalaxyImage middleware to our create route
router.post(`/`, galaxyCtlr.create, uploadGalaxyImage)
router.get(`/:id`, galaxyCtlr.show)
router.get(`/:id/edit`, galaxyCtlr.edit)
// Added our uploadGalaxyImage middleware to our update route
router.put(`/:id`, galaxyCtlr.update, uploadGalaxyImage)
router.delete(`/:id`, galaxyCtlr.remove)

// HTML5-specific routes: browsers can only send GET/POST, so plain HTML
// forms and links use these instead of PUT/DELETE
router.post(`/:id`, galaxyCtlr.update, uploadGalaxyImage)
router.get(`/:id/delete`, galaxyCtlr.remove)

// export "router"
module.exports = router
