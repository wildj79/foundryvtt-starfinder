const fs = require('fs');
const equipmentPath = "src/items/equipment";

try {
    fs.readdir(equipmentPath, 'utf-8', (err, files) => {
        if (err) throw err;
        
        for (const file of files) {
            let json = fs.readFileSync(`${equipmentPath}/${file}`, {
                encoding: 'utf8',
                flag: 'r+'
            });

            let equipment = JSON.parse(json);
            
            // if (!["weapon"].includes(equipment?.type ?? "")) continue;

            if (equipment.data.damage && equipment.data.damage.parts.length > 0) {
                equipment.data.damage.parts = equipment.data.damage.parts.reduce((arr, curr) => {
                    let [forumla, type] = curr;

                    if (type === "healing") return arr;
                    if (type.includes("+")) {
                        let types = type.split('+');
                        arr.push([forumla, { [types[0]]: true, [types[1]]: true}]);
                    } else if (type.includes('|')) {
                        let types = type.split('|');
                        arr.push([forumla, { [types[0]]: true, [types[1]]: true}]);
                    } else {
                        arr.push([forumla, { [type]: true }]);
                    }
                    
                    return arr;
                }, []);
            }
            
            json = JSON.stringify(equipment, null, 2);

            fs.writeFileSync(`${equipmentPath}/${file}`, json);
        }
    });
} catch (err) {
    console.log(err);
}