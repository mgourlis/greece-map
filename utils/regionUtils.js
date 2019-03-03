const path = require('path')
const fs = require('fs')

function getRegionPrefix(id) {
    let level = id.split('-')[0]
    if (level === '1')
        return 'Περιφέρεια'
    else if (level === '2')
        return 'Περιφερειακή Ενότητα'
    else if (level === '3')
        return 'Δήμος'
    else
        return 'Επικράτεια'
}

function getRegionObject(id) {
    let regionObject = { id: '0-1', name: 'Επικράτεια' }
    try {
        let i, j, maxRegions = 0
        const level = parseInt(id.split('-')[0])
        const number = parseInt(id.split('-')[1])
        level === 3 ? maxRegions = 74 : (level === 2 ? maxRegions = 13 : (level === 1 ? maxRegions = 1 : maxRegions = 0))
        for (i = 1; i <= maxRegions; i++) {
            let resp = JSON.parse(fs.readFileSync(path.join(__dirname, '../', 'public', (level - 1) + '-' + i + '.json'), 'utf8'))
            let regions = resp.regions
            for (j = 0; j < regions.length; j++) {
                if (level + '-' + number === regions[j].id) {
                    regionObject.id = regions[j].id
                    regionObject.name = getRegionPrefix(regions[j].id) + ' ' + regions[j].name
                    return regionObject
                }
            }
        }
        return regionObject
    } catch (error) {
        return regionObject
    }
}

module.exports = {
    getRegionObject
}