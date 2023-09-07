import fs from 'fs';
const originalData = JSON.parse(fs.readFileSync('original.json', 'utf8'));

const cleanedData = [];

if (originalData.data && originalData.data.allSalasUdps) {
    
    originalData.data.allSalasUdps.edges.forEach((sala) => {
        const cleanedSala = {
            code: sala.node.code || '',
            section: sala.node.section || '',
            course: sala.node.course || '',
            place: sala.node.place || '',
            start: sala.node.start || '',
            finish: sala.node.finish || '',
            day: sala.node.day || '',
            teacher: sala.node.teacher || '',
        };

        if(cleanedSala.day !== -1){
            cleanedData.push(cleanedSala);
        }
    });
}

const cleanedJson = { allSalasUdps: cleanedData };

fs.writeFileSync('cleaned.json', JSON.stringify(cleanedJson, null, 4), 'utf8');

console.log('Cleaned JSON file has been created: cleaned.json');
