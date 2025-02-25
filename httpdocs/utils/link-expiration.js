const mysql = require("../utils/mysql");

async function deleteExpiredLinks()
{
    const connection = await mysql.createDatabaseConnection(true);

    const links = await mysql.getExpiredLinks(connection);
    
    for (const link of links)
    {
        const uuid = link.uuid;
        const deleteExpiredDetails = link.delete_expired_details;

        await mysql.deleteLink(connection, uuid);

        if (deleteExpiredDetails)
        {
            await mysql.deleteLinkDetails(connection, uuid);
        }
    }

    connection.end();
}

module.exports.deleteExpiredLinks = deleteExpiredLinks;