const mysql = require("../utils/mysql");

async function redirect(res, id)
{
    if (!id)
    {
        return res.redirect("https://blockyjar.dev/");
    }

    const link = await mysql.getLink(res, id);

    if (!link) 
    {
        return;
    }

    res.redirect(link);
}

module.exports.redirect = redirect;