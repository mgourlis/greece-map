/*global  $ axios Raphael Chartist*/

/* ---------SETTINGS--------- */
const maxAllowdedLevel = 4
const animationsEnabled = true
/* -------------------------- */

/* ---------------------------------- SHOW DATA START --------------------------------- */

function getFilterPerIdAndWhereClause(id, whereClause, data) {
    let level = id.split('-')[0], filteredData = data, l = whereClause.length, i
    if (level === '1') {
        filteredData = data.filter(reg => reg.regionDataId === id)
    }
    else if (level === '2') {
        filteredData = data.filter(reg => reg.peDataId === id)
    }
    else if (level === '3') {
        filteredData = data.filter(reg => reg.muniDataId === id)
    }
    for (i = 0; i < l; i++) {
        filteredData = filteredData.filter(reg => whereClause[i].value.some(val => { return reg[whereClause[i].key] === val }))
    }
    return filteredData
}

function getUniqueValuesOfKey(key, data) {
    let flags = [], uniqueKeyValues = [], l = data.length, i
    for (i = 0; i < l; i++) {
        if (flags[data[i][key]]) continue
        flags[data[i][key]] = true
        uniqueKeyValues.push(data[i][key])
    }
    return uniqueKeyValues
}

function getSumsOfKeyGroupByKey(sumKey, groupByKey, data) {
    const keyValues = getUniqueValuesOfKey(groupByKey, data)
    let i, l = keyValues.length, sumObjArray = []
    for (i = 0; i < l; i++) {
        let sum = data.reduce((acc, region) => {
            if (region[sumKey] && region[groupByKey]) {
                if (region[groupByKey] === keyValues[i]) {
                    const num = region[sumKey].replace(/,/g, '')
                    return acc + 1 * num
                }
            }
            return acc
        }, 0)
        sumObjArray.push({ key: keyValues[i], value: sum })
    }
    return sumObjArray
}

async function getSumOfKey(sumKey, data) {
    const sumTotal = data.reduce((acc, region) => {
        if (region[sumKey]) {
            const num = region[sumKey].replace(/,/g, '')
            return acc + 1 * num
        }
        return acc
    }, 0)
    return sumTotal.toLocaleString('el', { style: 'currency', currency: 'EUR' })
}

function createGraph(imgUrls, labelValuePairs) {
    var chart = new Chartist.Bar('#chart', {
        labels: labelValuePairs.map(pair => pair.key),
        series: [
            labelValuePairs.map(pair => {
                const urlObject = imgUrls.find(val => pair.key === val.value)
                return {
                    value: pair.value,
                    meta: {
                        imageUrl: urlObject && urlObject.url ? urlObject.url : ''
                    }
                }
            })
        ]
    }).on('draw', function (context) {
        if (context.type === 'bar') {
            var meta = Chartist.deserialize(context.meta)
            context.element.parent().append(
                new Chartist.Svg('image', {
                    height: 32,
                    width: 32,
                    x: context.x1 - (32 / 2),
                    y: context.y2 - 32,
                    'xlink:href': meta.imageUrl
                })
            )
            context.group.elem('text', {
                x: context.x1 - 22,
                y: context.y2 - 5
            }, 'ct-label').text(toRelativeAmount(context.series[context.index].value))
        }
    })
}

const toRelativeAmount = function (a) {
    let postfix = 'εκ.', d = 1000000
    if(a/d < 1){ 
        postfix = 'χιλ.'
        d = 1000
    }
    return (a/d).toLocaleString('el-gr', {maximumFractionDigits: 2}) + postfix 
}

const showData = async (regionObject) => {
    const respSettings = await axios.get('settings.json')
    const respData = await axios.get('data.json')
    const filteredData = getFilterPerIdAndWhereClause(regionObject.id, respSettings.data.whereClause, respData.data.data)
    $('#region-title').html(getRegionPrefix(regionObject.id) + ' ' + regionObject.name)
    $('#region-total').html('Σύνολο Χρηματοδοτήσεων: ' + await getSumOfKey(respSettings.data.sumKey, filteredData))
    getSumsOfKeyGroupByKey(respSettings.data.sumKey, respSettings.data.groupBy.key, filteredData)
    createGraph(respSettings.data.groupBy.imgUrls, await getSumsOfKeyGroupByKey(respSettings.data.sumKey, respSettings.data.groupBy.key, filteredData))
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

/*
var chart = new Chartist.Bar('#chart', {
    labels: ['Bananas', 'Apples', 'Strawberries'],
    series: [
        [{
            value: 3,
            meta: {
                imageUrl: 'http://icons.iconarchive.com/icons/iconicon/veggies/32/bananas-icon.png'
            }
        }, {
            value: 8,
            meta: {
                imageUrl: 'http://icons.iconarchive.com/icons/fi3ur/fruitsalad/32/apple-icon.png'
            }
        }, {
            value: 2,
            meta: {
                imageUrl: 'http://icons.iconarchive.com/icons/ergosign/free-spring/32/strawberry-icon.png'
            }
        }]
    ]
}).on('draw', function (context) {
    if (context.type === 'bar') {
        var meta = Chartist.deserialize(context.meta)
        context.element.parent().append(
            new Chartist.Svg('image', {
                height: 32,
                width: 32,
                x: context.x1 - (32 / 2),
                y: context.y2 - 32,
                'xlink:href': meta.imageUrl
            })
        )
    }
})
*/