import { parseHTML } from 'linkedom';

const getUnitBio = async (unitLink) => {
    const response = await fetch(unitLink);
    if (!response.ok) {
        throw new Error(`An error has occured: ${response.status}`);
    }
    const text = await response.text();
    return text;
}

export default async (units) => {
    try {
        for (const unit of units) {
            console.log(`${unit.id}. ${unit.name}: start get ls, es, bb, sbb, ubb`);
            await getUnitBio(unit.link).then((data) => {
                const { document } = parseHTML(data);
                var $skills = document.querySelector('div[style="line-height:1.25;"]');

                var lsName = $skills.querySelector('div[style="padding:3px 12px;white-space:nowrap;"]').textContent.replace('Leader Skill:', '').trim();
                var lsDesc = $skills.querySelectorAll('div[style="padding:3px 12px 6px 12px;"]')[0].childNodes[0].textContent.trim();
                var ls = { lsName, lsDesc };

                var esName = $skills.querySelectorAll('div[style="border-top:1px solid #ccc; padding:3px 12px;white-space:nowrap;"]')[0].querySelector('b').textContent.replace('Extra Skill:', '').trim();
                var esDesc = $skills.querySelectorAll('div[style="padding:3px 12px 6px 12px;"]')[1].childNodes[0].textContent.trim();
                var es = { esName, esDesc };

                var bbName = $skills.querySelectorAll('div[style="border-top:1px solid #ccc; padding:3px 12px;white-space:nowrap;"]')[1].querySelector('i').textContent.trim();
                var bbDesc = $skills.querySelectorAll('div[style="padding:3px 12px 6px 12px;"]')[2].childNodes[0].textContent.trim();
                var bb = { bbName, bbDesc };

                var sbbName = $skills.querySelectorAll('div[style="border-top:1px solid #ccc; padding:3px 12px;white-space:nowrap;"]')[2].querySelector('i').textContent.trim();
                var sbbDesc = $skills.querySelectorAll('div[style="padding:3px 12px 6px 12px;"]')[3].childNodes[0].textContent.trim();
                var sbb = { sbbName, sbbDesc };

                var ubbName = $skills.querySelectorAll('div[style="border-top:1px solid #ccc; padding:3px 12px;white-space:nowrap;"]')[3].querySelector('i').textContent.trim();
                var ubbDesc = $skills.querySelectorAll('div[style="padding:3px 12px 6px 12px;"]')[4].childNodes[0].textContent.trim();
                var ubb = { ubbName, ubbDesc };

                var skills = [];
                skills.push(ls, es, bb, sbb, ubb);
                unit.skills = skills;
            });
            console.log(`${unit.id}. ${unit.name}: done get ls, es, bb, sbb, ubb`);
        }
    } catch (error) {
        console.error(error);
    }
}