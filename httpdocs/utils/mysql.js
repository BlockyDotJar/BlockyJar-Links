const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

/*
 * General database utility functions
 */

const createDatabaseConnection = (multipleStatements) => 
{
    return mysql.createConnection
    (
        {
            host: process.env.MY_SQL_HOST,
            port: process.env.MY_SQL_PORT,
            user: process.env.MY_SQL_USER,
            password: process.env.MY_SQL_PASSWORD || "",
            database: process.env.MY_SQL_DATABASE,
            multipleStatements: multipleStatements
        }
    );
};

async function requestDatabaseResponseless(connection, query, values)
{
    const [ results ] = await connection.query(query, values);
    return results;
}

/*
 * MySQL SELECT queries
 */

async function getExpiredLinks(connection)
{
    const query = "SELECT `uuid`, `deleteExpiredDetails` FROM `links` WHERE `expiresOn` <= CURDATE();";
    const values = [];

    const results = await requestDatabaseResponseless(connection, query, values);

    return results;
}

async function getLinkByID(connection, id)
{
    const query = "SELECT link, uuid FROM `links` WHERE `id` = ?";
    const values = [ id ];

    const [ result ] = await requestDatabaseResponseless(connection, query, values);

    return result;
}

async function getLinkDetails(connection, uuid)
{
    const query = "SELECT * FROM `link-impression-details` WHERE `uuid` = ?";
    const values = [ uuid ];

    const [ result ] = await requestDatabaseResponseless(connection, query, values);

    return result;
}

/*
 * MySQL UPDATE queries
 */

async function updateLinkImpressionDetails(connection, details, uuid)
{
    const query = "UPDATE `link-impression-details` SET `details` = ? WHERE `uuid` = ?";
    const values = [ details, uuid ];
    
    await requestDatabaseResponseless(connection, query, values);
}

/*
 * MySQL DELETE queries
 */

async function deleteLink(connection, uuid)
{
    const query = "DELETE FROM `links` WHERE `uuid` = ?";
    const values = [ uuid ];
    
    await requestDatabaseResponseless(connection, query, values);
}

async function deleteLinkDetails(connection, uuid)
{
    const query = `DELETE FROM \`link-impression-details\` WHERE \`uuid\` = ?;
                   DELETE FROM \`link-date-history\` WHERE \`uuid\` = ?;
                   DELETE FROM \`link-url-history\` WHERE \`uuid\` = ?`;

    const values = [ uuid, uuid, uuid ];
    
    await requestDatabaseResponseless(connection, query, values);
}

/*
 * Export modules
 */

module.exports =
{
    createDatabaseConnection: createDatabaseConnection,
    requestDatabaseResponseless: requestDatabaseResponseless,
    getExpiredLinks: getExpiredLinks,
    getLinkByID: getLinkByID,
    getLinkDetails: getLinkDetails,
    updateLinkImpressionDetails: updateLinkImpressionDetails,
    deleteLink: deleteLink,
    deleteLinkDetails: deleteLinkDetails
};