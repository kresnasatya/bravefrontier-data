import { parseHTML } from 'linkedom';

const getUnitBio = async (unitLink) => {
    const response = await fetch(unitLink);
    if (!response.ok) {
        throw new Error(`An error has occured: ${response.status}`);
    }
    const text = await response.text();
    return text;
}

export default async (units, additional = false) => {
    try {
        for (const unit of units) {
            console.log(`${unit.id}. ${unit.name}: start`);
            await getUnitBio(unit.link).then((data) => {
                const { document } = parseHTML(data);
                if (additional) {
                    const rows = Array.from(document.querySelector('table.article-table.tight').querySelectorAll('tr'));
                    for (let index = 0; index < rows.length; index++) {
                        const column = rows[index].querySelector('td');
                        switch (index) {
                            case 1:
                                unit.dataID = column.textContent.trim();
                                break;
                            case 3:
                                const genderAttr = column.querySelector('a').getAttribute('title');
                                unit.gender = genderAttr.replace('Category:', '');
                                break;
                            case 5:
                                unit.maxLevel = column.querySelector('a').innerHTML;
                                break;
                            case 7:
                                unit.arenaType = column.querySelector('a').innerHTML;
                                break;
                            case 8:
                                let colosseumLegality = [];
                                const colosseumLink = Array.from(column.querySelectorAll('a'));
                                for (let j = 0; j < colosseumLink.length; j++) {
                                    colosseumLegality.push(colosseumLink[j].getAttribute('title').replace('Category:', ''));
                                }
                                unit.colosseumLegality = colosseumLegality;
                                break;
                        }
                    }
                }

                const unitArtwork = document.querySelector('div[style="text-align:center; padding-top:21px; height:170px; vertical-align:middle; display:table-cell; width:210px;"] > center > a > img').getAttribute('src');
                // unit.artwork = unitArtwork.replace('/scale-to-width-down/330', '');
                unit.artwork = unitArtwork;
            });
            console.log(`${unit.id}. ${unit.name}: done`);
        }
    } catch (error) {
        console.error(error);
    }
}