const { redirect } = require("../utils/redirects");

async function setup(app)
{
	app.get("/:id", (req, res) =>
	{
		const params = req.params;
		const id = params.id;

		redirect(res, id);
	});
}

module.exports.setup = setup;