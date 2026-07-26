// Checks the request's Content-Type header to decide if the client wants JSON back
// instead of an HTML page (per the assignment: JSON API clients vs HTML form/browser requests).
const wantsJson = (req) => req.headers['content-type'] === 'application/json';

// Sends a simple 404 response in either JSON or HTML
const notFound = (req, res, message = 'Not Found') => {
	if (wantsJson(req)) {
		res.status(404).json({ error: message });
	} else {
		res.status(404).send(`
			<html>
				<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
					background:linear-gradient(to right,#102142,#422E8F);color:#fff;font-family:sans-serif;text-align:center;">
					<div>
						<h1 style="font-size:3rem;margin-bottom:0.5rem;">404</h1>
						<p style="font-size:1.25rem;margin-bottom:2rem;">${message}</p>
						<a href="/" style="color:#fff;text-decoration:underline;">Back to Home</a>
					</div>
				</body>
			</html>
		`);
	}
};

module.exports = { wantsJson, notFound };
