const express = require("express");
const app = express();

const cors = require("cors");

const { deleteExpiredLinks } = require("./utils/link-expiration");
const cron = require('node-cron');

const base = require("./routes/base");

app.use(cors());

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) =>
{
    return res.status(422).json
    (
        {
            "status": 422,
            "message": err.message
        }
    );
});

base.setup(app);

const port = process.env.PORT || 30000;

app.listen(port);

cron.schedule("59 23 * * *", () =>
{
    deleteExpiredLinks();
});