const mysql = require("../utils/mysql");

async function redirect(res, id)
{
    if (!id)
    {
        return res.redirect("https://blockyjar.dev/");
    }

    const connection = await mysql.createDatabaseConnection(false);

    const linkDetails = await mysql.getLinkByID(connection, id);

    if (!linkDetails) 
    {
        return res.redirect("https://blockyjar.dev/");
    }

    const link = linkDetails.link;
    const linkUUID = linkDetails.uuid;

    if (!link) 
    {
        return res.redirect("https://blockyjar.dev/");
    }

    const linkImpressions = await mysql.getLinkDetails(connection, linkUUID);

    const now = new Date();
    const year = now.getFullYear();
    const monthRaw = now.getMonth();
    const month = String(monthRaw + 1).padStart(2, "0");
    const currentYearMonth = `${year}-${month}`;

    let totalCount = 0;
    let currentDetails = [ ];

    if (!linkImpressions)
    {
        currentDetails.push
        (
            {
                "year_month": currentYearMonth,
                "impressions": 1
            }
        );
    }

    if (linkImpressions)
    {
        const linkImpressionDetails = JSON.parse(linkImpressions.details);

        totalCount = linkImpressionDetails.total_count;
        currentDetails = linkImpressionDetails.details;

        const neededDetail = currentDetails.find(currentDetail =>
        {
            const yearMonth = currentDetail.year_month;
            return yearMonth === currentYearMonth;
        });

        if (!neededDetail)
        {
            currentDetails.push
            (
                {
                    "year_month": currentYearMonth,
                    "impressions": 1
                }
            );
        }

        if (neededDetail)
        {
            currentDetails = currentDetails.filter(detail =>
            {
                return detail !== neededDetail;
            });

            const neededImpressions = neededDetail.impressions;

            currentDetails.push
            (
                {
                    "year_month": currentYearMonth,
                    "impressions": neededImpressions + 1
                }
            );
        }
    }

    const details = JSON.stringify
    ({
        "total_count": totalCount + 1,
        "details": currentDetails
    });
    
    linkImpressions ? await mysql.updateLinkImpressionDetails(connection, details, linkUUID) : await mysql.insertLinkImpressionDetails(connection, details, linkUUID);

    connection.end();

    res.redirect(link);
}

module.exports.redirect = redirect;