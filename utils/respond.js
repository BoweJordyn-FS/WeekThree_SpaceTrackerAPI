// Checks the request's Content-Type header to decide if the client wants JSON back
// instead of an HTML page (per the assignment: JSON API clients vs HTML form/browser requests).
const wantsJson = (req) => req.headers['content-type'] === 'application/json';

// Sends a simple 404 response in either JSON or HTML
const notFound = (req, res, message = 'Not Found') => {
	if (wantsJson(req)) {
		res.status(404).json({ error: message });
	} else {
		res.status(404).send(`<h1>404 - ${message}</h1>`);
	}
};

module.exports = { wantsJson, notFound };
