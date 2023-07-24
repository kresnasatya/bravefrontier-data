import { parseHTML } from 'linkedom';

const units = [];

function scrape(document) {
    const rows = Array.from(document.querySelector('table.wikitable tbody').querySelectorAll('tr'));
    let id, name, link, thumbnail, element, rarity, cost;
    for (let i = 0; i < rows.length; i++) {
        const columns = rows[i].querySelectorAll('td');
        for (let j = 0; j < columns.length; j++) {
            const column = columns[j];
            switch (j) {
                case 0:
                    id = column.querySelector('center').textContent.trim();
                    break;
                case 1:
                    const anchor = column.querySelector('a');
                    if (anchor.firstElementChild !== null) {
                        if (anchor.querySelector('img').hasAttribute('data-src')) {
                            thumbnail = anchor.querySelector('img').getAttribute('data-src');
                        } else {
                            thumbnail = anchor.querySelector('img').getAttribute('src');
                        }
                    }
                    name = column.querySelectorAll('a')[1].getAttribute('title');
                    link = `${rootUrl}${column.querySelectorAll('a')[1].getAttribute('href')}`;
                    break;
                case 2:
                    element = column.querySelector('center > a').getAttribute('title').replace('Category:', '');
                    break;
                case 3:
                    rarity = column.querySelector('center > a').getAttribute('title').replace('Category:', '');
                    break;
                case 4:
                    cost = column.querySelector('center > a').getAttribute('title').replace('Category:Cost', '');
                    break;
            }
        }
        units.push({
            id, name, link, thumbnail, element, rarity, cost
        });
    }
}

const rootUrl = "https://bravefrontierglobal.fandom.com";

export default async function getUnitSeries(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const { document } = parseHTML(text);

        scrape(document);

        // Recursion start
        const nextElementSibling = document.querySelector('.mw-selflink.selflink').nextElementSibling;
        let nextPageHref;
        if (nextElementSibling !== null) {
            nextPageHref = nextElementSibling.getAttribute('href');
        } else {
            return units;
        }

        let nextUrl = `${rootUrl}${nextPageHref}`;
        console.log(`Scraping next url: ${nextUrl}`);

        return await getUnitSeries(nextUrl);
        // Recursion end
    } catch (error) {
        console.error(error);
    }
}