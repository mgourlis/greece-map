const fs = require('fs')
const convert = require('xml-js')

const xml = fs.readFileSync(0, 'utf-8')

const getPath = function (xml) {
    return {
        id: xml._attributes.id,
        path: xml.path.map(a => a._attributes.d)
    }
}

const result = convert.xml2js(xml, {compact: true, alwaysArray: true, spaces: 4});

const svgDimensions = { 
    width: result.svg[0]._attributes.viewBox.split(' ')[2],
    height: result.svg[0]._attributes.viewBox.split(' ')[3]
}
const id = result.svg[0].g[0]._attributes.id
const attributes = result.svg[0].g[0].g[0]._attributes
const paths = result.svg[0].g[0].g[0].g.map(getPath)

const response = {
    svgDimensions: svgDimensions,
    id: id, 
    attributes: attributes, 
    regions: paths
}

console.log(JSON.stringify(response))
