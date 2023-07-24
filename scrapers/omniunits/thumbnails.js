import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import fsPromises from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const omniUnitsFile = path.join(__dirname, '..', '..', 'data', 'omniunits', 'raw.json');

(async () => {
    try {
        const text = await fsPromises.readFile(omniUnitsFile, 'utf8');
        const omniUnits = JSON.parse(text);
        for (const omniUnit of omniUnits) {
            let options = {
                public_id: omniUnit.id,
                folder: 'bravefrontier/omniunits/thumbnails'
            };
            cloudinary.uploader.upload(omniUnit.thumbnail, options, (error, result) => {
                if (error) throw error;
                console.log(`Success upload ${omniUnit.name}'s thumbnail to ${result.secure_url}`);
            });
        }
    } catch (error) {
        console.log(error);
    }
})();