const mysql = require("../utils/mysql");

async function deleteExpiredLinks()
{
    const now = Date.now();

    const links = await mysql.getAllLinks();
    
    for (const link of links)
    {
        const uuid = link.uuid;
        const expiresOn = link.expiresOn;

        if (now > expiresOn)
        {
            const connection = await mysql.createDatabaseConnection();

            const query = "DELETE FROM `links` WHERE `uuid` = ?";
            const values = [ uuid ];

            mysql.requestDatabaseResponseless(connection, query, values);
        }
    }
}

module.exports.deleteExpiredLinks = deleteExpiredLinks;