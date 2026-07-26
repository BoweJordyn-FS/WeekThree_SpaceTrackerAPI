// Load in our dependencies
const util = require('util')
const path = require('path')
// Load in our Sequelize models
const { Galaxy, Planets, Star } = require('../models')

// Defines the Express middleware that will upload our galaxy image
const uploadGalaxyImage = async (req, res, next) => {
	// Define the absolute final file path for this image
	let uploadPath = `${__dirname}/../public/uploads/galaxies/%s%s`

	// If the previous middleware did not pass us a galaxyId then bail
	if (!req.galaxyId) { return }

	// Check to see if there are any files to upload
	if (req.files && Object.keys(req.files).length > 0) {
		// Get the extension from the incoming file (ie: .png,.jpg,.gif)
		const extension = path.extname(req.files.image.name)
		// Render the final file path based off the galaxyId and file extension
		uploadPath = util.format(uploadPath, req.galaxyId, extension)

		// Perform the move/mv operation that moves the file from a temp directory to our final path
		return await req.files.image.mv(uploadPath)
			// Update the Galaxy model with the new image path uploaded
			.then(async () => await Galaxy.update(
					{ image: `/uploads/galaxies/${req.galaxyId}${extension}` },
					{ where: { id: Number(req.galaxyId) } }
				)
			)
	}
}

// Defines the Express middleware that will upload our planet image
const uploadPlanetImage = async (req, res, next) => {
	let uploadPath = `${__dirname}/../public/uploads/planets/%s%s`

	// If the previous middleware did not pass us a planetId then bail
	if (!req.planetId) { return }

	if (req.files && Object.keys(req.files).length > 0) {
		const extension = path.extname(req.files.image.name)
		uploadPath = util.format(uploadPath, req.planetId, extension)

		return await req.files.image.mv(uploadPath)
			.then(async () => await Planets.update(
					{ image: `/uploads/planets/${req.planetId}${extension}` },
					{ where: { id: Number(req.planetId) } }
				)
			)
	}
}

// Defines the Express middleware that will upload our star image
const uploadStarImage = async (req, res, next) => {
	let uploadPath = `${__dirname}/../public/uploads/stars/%s%s`

	// If the previous middleware did not pass us a starId then bail
	if (!req.starId) { return }

	if (req.files && Object.keys(req.files).length > 0) {
		const extension = path.extname(req.files.image.name)
		uploadPath = util.format(uploadPath, req.starId, extension)

		return await req.files.image.mv(uploadPath)
			.then(async () => await Star.update(
					{ image: `/uploads/stars/${req.starId}${extension}` },
					{ where: { id: Number(req.starId) } }
				)
			)
	}
}

// Export our middlewares
module.exports = { uploadGalaxyImage, uploadPlanetImage, uploadStarImage }
