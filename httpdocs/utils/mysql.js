const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

/*
 * General database utility functions
 */

const createDatabaseConnection = () => 
{
    return mysql.createConnection
    (
        {
            host: process.env.MY_SQL_HOST,
            port: process.env.MY_SQL_PORT,
            user: process.env.MY_SQL_USER,
            password: process.env.MY_SQL_PASSWORD,
            database: process.env.MY_SQL_DATABASE
        }
    );
};

const requestDatabase = (connection, query, values, res) =>
{
    return connection.query(query, values)
        .then(results => ([ results ]))
        .catch(err => 
            {
                const errorMessage = err.message;

                return res.status(422).jsonp
                (
                    {
                        "status": 422,
                        "message": errorMessage
                    }
                );
            }
        );
};

async function requestDatabaseResponseless(connection, query, values)
{
    const [ results ] = await connection.query(query, values);
    return results;
}

/*
 * Response related database utility functions
 */

async function getAllLinks()
{
    const connection = await createDatabaseConnection();

    const query = "SELECT uuid, expiresOn FROM `links`";
    const values = [];

    const results = await requestDatabaseResponseless(connection, query, values);

    return results;
}

async function getLink(res, id)
{
    const connection = await createDatabaseConnection();

    const query = "SELECT link FROM `links` WHERE `id` = ?";
    const values = [ id ];

    const [ [ results ] ] = await requestDatabase(connection, query, values, res);
    const result = results[0];

    if (!result) 
    {
        res.redirect("https://blockyjar.dev/");
        return;
    }

    return result.link;
}

/*
 * Export modules
 */

module.exports =
{
    createDatabaseConnection: createDatabaseConnection,
    requestDatabase: requestDatabase,
    requestDatabaseResponseless: requestDatabaseResponseless,
    getAllLinks: getAllLinks,
    getLink: getLink
};