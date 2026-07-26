// Load in Express framework
const express = require(`express`)

// Load in our controller/action instances
const starCtlr = require(`../controllers/star.js`)

// Loading in our image upload middleware
const { uploadStarImage } = require(`../middlewares`)

// Create a new Router instance and call it "router"
const router = new express.Router()

// RESTful resource mappings
router.get(`/`, starCtlr.index)
router.get(`/new`, starCtlr.new)
// Added our uploadStarImage middleware to our create route
router.post(`/`, starCtlr.create, uploadStarImage)
router.get(`/:id`, starCtlr.show)
router.get(`/:id/edit`, starCtlr.edit)
// Added our uploadStarImage middleware to our update route
router.put(`/:id`, starCtlr.update, uploadStarImage)
router.delete(`/:id`, starCtlr.remove)

// HTML5-specific routes: browsers can only send GET/POST, so plain HTML
// forms and links use these instead of PUT/DELETE
router.post(`/:id`, starCtlr.update, uploadStarImage)
router.get(`/:id/delete`, starCtlr.remove)

// export "router"
module.exports = router
