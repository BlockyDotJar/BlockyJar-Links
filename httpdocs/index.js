const express = require("express");
const app = express();

const rateLimit = require("express-rate-limit");

const cors = require("cors");

const { deleteExpiredLinks } = require("./utils/link-expiration");
const cron = require('node-cron');

const base = require("./routes/base");

const limiter = () => rateLimit
(
    {
        windowMs: 1000,
        max: 3,
        handler: (_, res) => res.status(429).json
        (
            {
                "status": 429,
                "message": "Too many requests - Rate limit exceeded. You can only make 3 requests per second to all links."
            }
        )
    }
);

app.use(limiter())
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

const port = process.env.PORT || 3003;

app.listen(port);

cron.schedule("59 23 * * *", () =>
{
    deleteExpiredLinks();
});