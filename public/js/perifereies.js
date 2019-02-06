/*global  $ axios Raphael*/

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

const drawMap = async function (canvas, path, onclick) {
    if (path !== null) {
        const resp = await axios.get(path)

        canvas.clear()

        const data = resp.data

        canvas.setSize(data.svgDimensions.width, data.svgDimensions.height)
        canvas.setViewBox(0, 0, data.svgDimensions.width, data.svgDimensions.height, true)
        canvas.setSize('100%', '100%')

        const regions = data.regions.map(canvas.set)
        const regionColors = generateColors(1, 0.4, regions.length)

        regions.forEach((r, i) => {
            const relativePaths = data.regions[i].path.map(a => canvas.path(a))
            r.push(...relativePaths)
            delete data.regions[i].path
            r.info = data.regions[i]
            r.color = regionColors[i]
        })

        regions.forEach(
            r => r.attr({
                fill: r.color,
                stroke: 'rgb(255,255,255)',
                'stroke-width': '1',
                'stroke-opacity': '1',
                'stroke-linejoin': 'round',
                title: r.info.name || r.info.id || ''
            }).hover(
                () => { r.attr({ opacity: '0.7', 'stroke-width': '2', cursor: 'pointer' }) },
                () => { r.attr({ opacity: '1', 'stroke-width': '1' }) }
            ).click(() => onclick({
                id: r.info.id,
                region: r
            }))
        )
    }
}

const canvas = Raphael('map')
const showData = (regionObject) => {
    console.log(regionObject)
}

function moveInHierarchy(regionObject) {
    var timeoutMs = 0
    if (regionObject.region !== null) {
        timeoutMs = 1500
        var elCenterX = regionObject.region.getBBox(true).x2 - (regionObject.region.getBBox(true).width / 2)
        var elCenterY = regionObject.region.getBBox(true).y2 - (regionObject.region.getBBox(true).height / 2)
        var tMoveX = (canvas._viewBox[2] / 2) - elCenterX
        var tMoveY = (canvas._viewBox[3] / 2) - elCenterY
        regionObject.region.toFront()
        canvas.forEach((r) => {
            r.attr({ opacity: '0.3', title: '' }).unclick().unhover()
        }, canvas)
        regionObject.region.toFront().unclick().unhover()
            .attr({ opacity: '1', 'stroke-width': '0,5', })
            .animate({
                transform: 't' + tMoveX + ',' + tMoveY + 's1.5,1.5,' + elCenterX + ',' + elCenterY
            }, timeoutMs, 'linear')
    }
    setTimeout(() => {
        var path = null
        moveStack.length < 4 && (path = regionObject.id + '.json')
        drawMap(canvas, path, (regionObject) => {
            moveStack.length < 4 && moveInHierarchy(regionObject)
            showData(regionObject)
        })
    }, timeoutMs)
    moveStack.push(regionObject.id)
    moveStack.length > 1 ? $('#back').removeClass('disabled').off('click').click(() => {
        moveStack.pop()
        const path = moveStack.pop()
        regionObject.id = path
        regionObject.region = null
        moveInHierarchy(regionObject)
        showData(regionObject)
    }) : $('#back').addClass('disabled')
}

const moveStack = []
moveInHierarchy({ id: 'regions', region: null })
showData({ id: 'regions' })




