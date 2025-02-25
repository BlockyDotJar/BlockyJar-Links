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
        return;
    }

    const linkImpressions = await mysql.getLinkDetails(connection, linkUUID);
    const linkImpressionDetails = JSON.parse(linkImpressions.details);

    const now = new Date();
    const year = now.getFullYear();
    const monthRaw = now.getMonth();
    const month = String(monthRaw + 1).padStart(2, "0");
    const currentYearMonth = `${year}-${month}`;

    const totalCount = linkImpressionDetails.total_count;

    let currentDetails = linkImpressionDetails.details;

    const neededDetail = currentDetails.find(currentDetail =>
    {
        const yearMonth = currentDetail.yearMonth;
        return yearMonth === currentYearMonth;
    });

    if (!neededDetail)
    {
        currentDetails.push
        (
            {
                "yearMonth": currentYearMonth,
                "clicks": 1
            }
        );
    }

    if (neededDetail)
    {
        const neededClicks = neededDetail.clicks;

        currentDetails = currentDetails.filter(detail =>
        {
            return detail !== neededDetail;
        });

        currentDetails.push
        (
            {
                "yearMonth": currentYearMonth,
                "clicks": neededClicks + 1
            }
        );
    }

    const details = JSON.stringify
    ({
        "total_count": totalCount + 1,
        "details": currentDetails
    });
    
    await mysql.updateLinkImpressionDetails(connection, details, linkUUID);

    connection.end();

    res.redirect(link);
}

module.exports.redirect = redirect;