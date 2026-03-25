import axios from 'axios';
import fs from 'fs';

async function checkSettings() {
    try {
        const response = await axios.get('http://localhost:5039/api/store/settings');
        fs.writeFileSync('settings-debug.json', JSON.stringify(response.data, null, 2));
        console.log('Saved to settings-debug.json');
    } catch (error) {
        console.error('Error fetching settings:', error.message);
    }
}

checkSettings();
