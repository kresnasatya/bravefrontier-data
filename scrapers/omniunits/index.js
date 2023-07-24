import collectUnits from '../units/index.js';
import unitProfiles from '../units/scrapers/profile.js';
import omniUnitProfiles from './scrapers/profile.js';
import spUnits from './scrapers/sp.js';
import { isJapaneseAndChineseChars } from '../helper.js';
import keywords from './keywords.js';

export default async () => {
    try {
        const units = await collectUnits();

        let omniUnits = units.filter(unit => {
            if (unit.rarity.includes('Omni') && !isJapaneseAndChineseChars(unit.name)) {
                // Remove cost and rarity property because I don't need it
                delete unit.rarity;
                delete unit.cost;
                return unit;
            }
        });

        await unitProfiles(omniUnits);
        await omniUnitProfiles(omniUnits);
        await spUnits(omniUnits);

        omniUnits = omniUnits.filter(unit => {
            // Remove link property because I don't need it
            delete unit.link;
            return unit;
        });

        omniUnits = omniUnits.map(unit => {
            let selectedKeywords = [];
            const omniUnitSkills = [];
            for (const skill of unit.skills) {
                if (skill.lsDesc !== undefined) {
                    omniUnitSkills.push(skill.lsDesc.toLowerCase());
                }
    
                if (skill.esDesc !== undefined) {
                    omniUnitSkills.push(skill.esDesc.toLowerCase());
                }
    
                if (skill.bbDesc !== undefined) {
                    omniUnitSkills.push(skill.bbDesc.toLowerCase());
                }
    
                if (skill.sbbDesc !== undefined) {
                    omniUnitSkills.push(skill.sbbDesc.toLowerCase());
                }
    
                if (skill.ubbDesc !== undefined) {
                    omniUnitSkills.push(skill.ubbDesc.toLowerCase());
                }
            }
    
            for (const omniUnitSkill of omniUnitSkills) {
                for (const keyword of keywords) {
                    if (omniUnitSkill.includes(keyword.toLowerCase())) {
                        selectedKeywords.push(keyword);
                    }
                }
            }
            unit.keywords = [...new Set(selectedKeywords)];
            return unit;
        });
        
        // Sort by id
        omniUnits.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        
        return omniUnits;
    } catch (error) {
        console.log(error);
    }
}