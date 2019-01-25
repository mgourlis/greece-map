

/*global axios R Raphael*/

function generateColors(saturation, lightness, amount) {
    let rgbColors = []
    let hslColors = generateHslaColors(saturation, lightness, amount)
    for (let countc = 0; countc < amount; countc++) {
        let currColorMap = hslToRgb(hslColors[countc].hue, hslColors[countc].saturation, hslColors[countc].lightness)
        rgbColors.push('rgb(' + currColorMap.red + ',' + currColorMap.green + ',' + currColorMap.blue + ')')
    }
    return rgbColors
}

function generateHslaColors(saturation, lightness, amount) {
    let colors = []
    let huedelta = Math.trunc(360 / amount)

    for (let i = 0; i < amount; i++) {
        let hue = i * huedelta
        colors.push({ 'hue': hue, 'saturation': saturation, 'lightness': lightness })
    }

    return colors
}

function hslToRgb(h, s, l) {
    let a = s * Math.min(l, 1 - l)
    let f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return { 'red': f(0) * 255, 'green': f(8) * 255, 'blue': f(4) * 255 }
}

const drawMap = function (div, path, onclick) {
    const p = axios.get(path)

    p.then((resp) => {
        const data = resp.data

        const canvas = Raphael(div, data.svgDimensions.width, data.svgDimensions.height)
        canvas.setViewBox(0, 0, data.svgDimensions.width, data.svgDimensions.height, true)
        canvas.setSize('100%', '100%')

        const regions = data.regions.map(canvas.set)
        const regionColors = generateColors(1, 0.4, regions.length)

        regions.forEach((r, i) => {
            const relativePaths = data.regions[i].path.map(a => canvas.path(a))
            r.push(...relativePaths)
        })

        regions.forEach(
            (r, i) => r.attr({
                fill: regionColors[i],
                stroke: 'rgb(255,255,255)',
                'stroke-width': '1',
                'stroke-opacity': '1',
                'stroke-linejoin': 'round'
            }).hover(
                () => { r.attr({ opacity: '0.7', 'stroke-width': '2' }) },
                () => { r.attr({ opacity: '1', 'stroke-width': '1' }) }
            ).click((e) => onclick(new regionObject(canvas,data.regions[i].id,data.regions[i].name, `/${data.regions[i].id}.json`)))
        )
    })
}

drawMap('map', '/regions.json', (regionObject) => {
    console.log(regionObject.id);
    regionObject.canvas.clear();
    drawMap('map', regionObject.jsonFilePath, (regionObject) => {
        console.log(regionObject.id);
    });
})

function regionObject(canvas, id, name, jsonFilePath){
    this.canvas = canvas
    this.id = id
    this.name = name
    this.jsonFilePath = jsonFilePath
}

