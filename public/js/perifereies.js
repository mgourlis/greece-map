/*global  $ axios Raphael*/

/* ---------SETTINGS--------- */
const maxAllowdedLevel = 4
const animationsEnabled = true
/* -------------------------- */

/* ---------------------------------- SHOW DATA START --------------------------------- */

function filodimosDdataIdFilter(id, data) {
    let level = id.split('-')[0]
    if (level === '1') {
        return data.filter(reg => reg.regionDataId === id && ( reg.program === 'Φιλόδημος Ι' || reg.program === 'Φιλόδημος ΙΙ' ))
    }
    else if (level === '2') {
        return data.filter(reg => reg.peDataId === id && ( reg.program === 'Φιλόδημος Ι' || reg.program === 'Φιλόδημος ΙΙ' ))
    }
    else if (level === '3') {
        return data.filter(reg => reg.muniDataId === id&& ( reg.program === 'Φιλόδημος Ι' || reg.program === 'Φιλόδημος ΙΙ' ))
    }
    else {
        return data.filter(reg => ( reg.program === 'Φιλόδημος Ι' || reg.program === 'Φιλόδημος ΙΙ' ))
    }
}

async function calcTotalPerId(id, dataFilterFunc) {
    const resp = await axios.get('data.json')
    const data = resp.data.data
    const filteredData = dataFilterFunc(id, data)
    const sumTotal = filteredData.reduce(function (acc, region) {
        if (region.total) {
            const num = region.total.replace(/,/g, '')
            return acc + 1 * num
        } else {
            return acc
        }
    }, 0)
    return sumTotal.toLocaleString('el',{style: 'currency', currency: 'EUR'})
}



const showData = async (regionObject) => {
    $('#region-title').html(getRegionPrefix(regionObject.id) + ' ' + regionObject.name)
    $('#region-total').html('Σύνολο Χρηματοδοτήσεων: ' + await calcTotalPerId(regionObject.id, filodimosDdataIdFilter))
}

/* ---------------------------------- SHOW DATA END ------------------------------------- */

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
                name: r.info.name,
                region: r
            }))
        )
    }
}




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

const canvas = Raphael('map')

function animateTransition(region, timeoutMs) {
    var elCenterX = region.getBBox(true).x2 - (region.getBBox(true).width / 2)
    var elCenterY = region.getBBox(true).y2 - (region.getBBox(true).height / 2)
    var tMoveX = (canvas._viewBox[2] / 2) - elCenterX
    var tMoveY = (canvas._viewBox[3] / 2) - elCenterY
    region.toFront()
    canvas.forEach((r) => {
        r.attr({ opacity: '0.3', title: '' }).unclick().unhover()
    }, canvas)
    region.toFront().unclick().unhover()
        .attr({ opacity: '1', 'stroke-width': '0,5', })
        .animate({
            transform: 't' + tMoveX + ',' + tMoveY + 's1.5,1.5,' + elCenterX + ',' + elCenterY
        }, timeoutMs, 'linear')
}

function moveInHierarchy(regionObject, enableAnimation, maxAllowdedLevel) {
    var timeoutMs = 0
    if (regionObject.region !== null && enableAnimation) {
        timeoutMs = 1500
        animateTransition(regionObject.region, timeoutMs)
    }
    setTimeout(() => {
        var path = null
        moveStack.length < maxAllowdedLevel && (path = regionObject.id + '.json')
        drawMap(canvas, path, (regionObject) => {
            moveStack.length < maxAllowdedLevel && moveInHierarchy(regionObject, enableAnimation, maxAllowdedLevel)
            showData(regionObject)
        })
    }, timeoutMs)
    moveStack.push(regionObject)
    moveStack.length > 1 ? $('#back').removeClass('disabled').off('click').click(() => {
        moveStack.pop()
        const prevRegionObject = moveStack.pop()
        const path = prevRegionObject.id
        regionObject.id = path
        regionObject.name = prevRegionObject.name
        regionObject.region = null
        moveInHierarchy(regionObject, enableAnimation, maxAllowdedLevel)
        showData(regionObject)
    }) : $('#back').addClass('disabled')
}

const moveStack = []
moveInHierarchy({ id: 'regions', name: '', region: null }, animationsEnabled, maxAllowdedLevel)
showData({ id: 'regions', name: '' })
