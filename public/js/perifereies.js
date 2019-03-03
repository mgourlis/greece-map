/*global  $ axios Raphael Chartist MobileDetect*/

/* ---------SETTINGS--------- */
let baseUrl = 'http://ypes-map.mgourlis.webfactional.com/'
const maxAllowdedLevel = 4
const compareByKeyGraph = 'category'
const compareByKeyDataTable = 'municipalityName'
/* -------------------------- */


function compareByKey(key, desc = false) {
    return function (a, b) {
        if (a[key] < b[key])
            return desc ? 1 : -1
        if (a[key] > b[key])
            return desc ? -1 : 1
        return 0
    }
}

/*Disable animations if Mobile or Tablet*/
const mobileDetector = new MobileDetect(window.navigator.userAgent)
const animationsEnabled = mobileDetector.mobile() ? false : true


/* ---------------------------------- SHOW DATA START --------------------------------- */

function getFilterPerIdAndWhereClause(id, whereClause, data, start = 0, maxElem, sortKey) {
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
    if (sortKey) {
        filteredData = filteredData.sort(compareByKey(sortKey))
    }
    if (maxElem) {
        filteredData = filteredData.slice(start, start + maxElem)
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
    }, {
            fullWidth: true,
            stretch: true,
            seriesBarDistance: 10,
            horizontalBars: true,
            axisX: {
                labelInterpolationFnc: function (value) {
                    return toRelativeAmount(value)
                }
            }
        }).on('draw', function (context) {
            if (context.type === 'bar') {
                context.element.attr({
                    x1: context.x1 + 0.001
                })
                var meta = Chartist.deserialize(context.meta)
                context.element.parent().append(
                    new Chartist.Svg('image', {
                        height: 32,
                        width: 32,
                        x: context.x1 - 32,
                        y: context.y1 - (32 / 2),
                        'xlink:href': meta.imageUrl
                    })
                )
                context.group.elem('text', {
                    x: context.x2 + 5,
                    y: context.y1 + 5
                }, 'ct-label').text(toRelativeAmount(context.series[context.index].value))
            }
        })
}

const toRelativeAmount = function (a) {
    var postfix = 'εκ', d = 1000000, minmax = 2
    if (a / d < 1) {
        postfix = 'χιλ'
        d = 1000
        minmax = 0
    } else {
        if (a % d === 0)
            minmax = 0
    }
    return (a / d).toLocaleString('el-gr', { minimumFractionDigits: minmax, maximumFractionDigits: minmax }) + postfix
}

const showData = async (regionObject) => {
    const respSettings = await settingsPromise
    const respData = await dataPromise
    const filteredData = getFilterPerIdAndWhereClause(regionObject.id, respSettings.data.whereClause, respData.data.data).sort(compareByKey(compareByKeyGraph, true))
    $('#region-title').html(getRegionPrefix(regionObject.id) + ' ' + regionObject.name)
    $('#region-total').html('Προϋπολογισμός Έργων: ' + await getSumOfKey(respSettings.data.sumKey, filteredData))
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
        const resp = await axios.get(baseUrl + path)

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

        return regions
    }
    return null
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
    resetLazyLoader()
    var timeoutMs = 0
    $('#mapLoading').show('fast', async () => {
        if (regionObject.region !== null && enableAnimation) {
            timeoutMs = 1000
            animateTransition(regionObject.region, timeoutMs)
        }
        setTimeout(() => {
            var path = null
            moveStack.length < maxAllowdedLevel && (path = regionObject.id + '.json')

            drawMap(canvas, path, (regionObject) => {
                moveStack.length < maxAllowdedLevel && moveInHierarchy(regionObject, enableAnimation, maxAllowdedLevel)
                if (!enableAnimation) {
                    moveStack.pop()
                    moveStack.push(regionObject)
                    resetLazyLoader()
                }
                showData(regionObject)
                moveStack.length === maxAllowdedLevel && showTableData()
            })
            $('#mapLoading').hide('slow')
        }, timeoutMs)
        if (getRegionPrefix(regionObject.id) !== 'Δήμος') {
            $('#shareMap').text('Μοιραστείτε την ' + getRegionPrefix(regionObject.id))
            $('#embededMap').text('Ενσωματώστε την ' + getRegionPrefix(regionObject.id))
        } else {
            $('#shareMap').text('Μοιραστείτε τoν  Δήμο')
            $('#embededMap').text('Ενσωματώστε τoν  Δήμο')
        }
        document.title = 'ΦιλόΔημος - ΥΠ.ΕΣ. - ' + getRegionPrefix(regionObject.id) + ' ' + regionObject.name
        $('meta[property="og:title"]').attr('content', 'ΦιλόΔημος - ΥΠ.ΕΣ. - ' + getRegionPrefix(regionObject.id) + ' ' + regionObject.name)
        $('meta[property="og:url"]').attr('content', baseUrl + '?id=' + regionObject.id)
        $('meta[property="twitter:title"]').attr('content', 'ΦιλόΔημος - ΥΠ.ΕΣ. - ' + getRegionPrefix(regionObject.id) + ' ' + regionObject.name)
    })
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

async function initializeRegionObjectFromId(id, enableAnimation) {
    let regionObject = { id: '0-1', name: '', region: null }
    try {
        let i, j, maxRegions = 0
        const level = parseIntDecimal(id.split('-')[0])
        const number = parseIntDecimal(id.split('-')[1])
        level === 3 ? maxRegions = 74 : level === 2 ? maxRegions = 13 : level === 1 ? maxRegions = 1 : maxRegions = 0
        for (i = 1; i <= maxRegions; i++) {
            let url = baseUrl + (level - 1) + '-' + i + '.json'
            let resp = await axios.get(url)
            let regions = resp.data.regions
            for (j = 0; j < regions.length; j++) {
                if (level + '-' + number === regions[j].id) {
                    const upper = moveStack.pop()
                    if (level - 1 >= 0)
                        moveStack.push(await initializeRegionObjectFromId(level - 1 + '-' + i))
                    if (upper) moveStack.push(upper)
                    regionObject.id = regions[j].id
                    regionObject.name = regions[j].name
                    if (level === 3) {
                        let regions = await drawMap(canvas, level - 1 + '-' + i + '.json', (regionObject) => {
                            moveStack.length < maxAllowdedLevel && moveInHierarchy(regionObject, enableAnimation, maxAllowdedLevel)
                            if (!enableAnimation) {
                                moveStack.pop()
                                moveStack.push(regionObject)
                                resetLazyLoader()
                            }
                            showData(regionObject)
                            moveStack.length === maxAllowdedLevel && showTableData()
                        })
                        if (enableAnimation) {
                            for (let z = 0; z < regions.length; z++) {
                                if (regions[z].info.id === level + '-' + number) {
                                    animateTransition(regions[z], 0)
                                }
                            }
                        }
                        showTableData()
                    }
                    return regionObject
                }
            }
        }
        return regionObject
    } catch (error) {
        return regionObject
    }
}

const settingsPromise = axios.get(baseUrl + 'settings.json')
const dataPromise = axios.get(baseUrl + 'data.json')

async function start(host, id = '0-1') {
    baseUrl = host + '/'
    $('#mapLoading').show('fast')
    let regionObject = await initializeRegionObjectFromId(id, animationsEnabled)
    $('#mapLoading').show('slow')
    moveInHierarchy(regionObject, animationsEnabled, maxAllowdedLevel)
    showData(regionObject)
}

function parseIntDecimal(x) {
    var parsed = parseInt(x, 10)
    if (isNaN(parsed)) { return 0 }
    return parsed
}

$('#tableData').on('click', () => {
    showTableData()
    $('html, body').animate({
        scrollTop: $('#tableData').offset().top - 100
    }, 1000)
})

$('#lazyLoadData').on('click', getMoreTableData)

var lazyLoadCounter = 0
var lazyLoadingMaxCount = 0

function resetLazyLoader() {
    $('#dataTable').empty()
    lazyLoadCounter = 0
    $('#dataLoading').hide('fast')
    $('#lazyLoadData').hide('fast')
    $('#lazyLoadData').removeClass('disabled')
}

async function showTableData() {
    resetLazyLoader()
    $('#dataLoading').show('fast', async () => {
        const respSettings = await settingsPromise
        const respData = await dataPromise
        const regionObject = moveStack[moveStack.length - 1]
        lazyLoadingMaxCount = await getFilterPerIdAndWhereClause(regionObject.id, respSettings.data.whereClause, respData.data.data).length
        const filteredData = await getFilterPerIdAndWhereClause(regionObject.id, respSettings.data.whereClause, respData.data.data, lazyLoadCounter, 10, compareByKeyDataTable)
        lazyLoadCounter = lazyLoadCounter + 10
        if (lazyLoadCounter > lazyLoadingMaxCount) {
            $('#lazyLoadData').addClass('disabled')
        }
        let header = '<div class="row header"><div class="cell">Πρόγραμμα</div>' +
            '<div class="cell">Έτος</div><div class="cell">Κατηγορία</div>' +
            '<div class="cell">Δήμος</div><div class="cell">Φιλόδημος</div>' +
            '<div class="cell"> Ίδιοι Πόροι</div><div class="cell">Σύνολο</div></div> '
        $('#dataTable').append(header)
        filteredData.forEach((elem) => {
            const zero = 0
            let elemToAppend = '<div class="row"><div class="cell" data-title="Πρόγραμμα">' + elem.program +
                '</div><div class="cell" data-title="Έτος">' + elem.year +
                '</div><div class="cell" data-title="Κατηγορία">' + elem.category +
                '</div><div class="cell" data-title="Δήμος">' + elem.municipalityName +
                '</div><div class="cell" data-title="Φιλόδημος">' + (elem.pdeYpes ? (1 * elem.pdeYpes.replace(/,/g, '')).toLocaleString('el', { style: 'currency', currency: 'EUR' }) : zero.toLocaleString('el', { style: 'currency', currency: 'EUR' })) +
                '</div><div class="cell" data-title="Ίδιοι Πόροι">' + (elem.ownResources ? (1 * elem.ownResources.replace(/,/g, '')).toLocaleString('el', { style: 'currency', currency: 'EUR' }) : zero.toLocaleString('el', { style: 'currency', currency: 'EUR' })) +
                '</div><div class="cell" data-title="Σύνολο"><b>' + (elem.total ? (1 * elem.total.replace(/,/g, '')).toLocaleString('el', { style: 'currency', currency: 'EUR' }) : zero.toLocaleString('el', { style: 'currency', currency: 'EUR' })) + '</b></div></div>'
            $('#dataTable').append(elemToAppend)
        })
    })

    $('#lazyLoadData').show('fast')

    $('#dataLoading').hide('fast')
}

async function getMoreTableData() {
    const respSettings = await settingsPromise
    const respData = await dataPromise
    const regionObject = moveStack[moveStack.length - 1]
    $('#dataLazyLoading').show('fast', async () => {
        const filteredData = await getFilterPerIdAndWhereClause(regionObject.id, respSettings.data.whereClause, respData.data.data, lazyLoadCounter, 10, compareByKeyDataTable)
        lazyLoadCounter = lazyLoadCounter + 10
        if (lazyLoadCounter > lazyLoadingMaxCount) {
            $('#lazyLoadData').addClass('disabled')
        }
        filteredData.forEach((elem) => {
            const zero = 0
            let elemToAppend = '<div class="row"><div class="cell" data-title="Πρόγραμμα">' + elem.program +
                '</div><div class="cell" data-title="Έτος">' + elem.year +
                '</div><div class="cell" data-title="Κατηγορία">' + elem.category +
                '</div><div class="cell" data-title="Δήμος">' + elem.municipalityName +
                '</div><div class="cell" data-title="Φιλόδημος">' + (elem.pdeYpes ? (1 * elem.pdeYpes.replace(/,/g, '')).toLocaleString('el', { style: 'currency', currency: 'EUR' }) : zero.toLocaleString('el', { style: 'currency', currency: 'EUR' })) +
                '</div><div class="cell" data-title="Ίδιοι Πόροι">' + (elem.ownResources ? (1 * elem.ownResources.replace(/,/g, '')).toLocaleString('el', { style: 'currency', currency: 'EUR' }) : zero.toLocaleString('el', { style: 'currency', currency: 'EUR' })) +
                '</div><div class="cell" data-title="Σύνολο"><b>' + (elem.total ? (1 * elem.total.replace(/,/g, '')).toLocaleString('el', { style: 'currency', currency: 'EUR' }) : zero.toLocaleString('el', { style: 'currency', currency: 'EUR' })) + '</b></div></div>'
            $('#dataTable').append(elemToAppend)
        })
    })
    $('#dataLazyLoading').hide('fast')
}

const facebookSharerUrl = 'https://www.facebook.com/sharer/sharer.php?u='
const twitterSharerUrl = 'http://www.twitter.com/share?url='

$('#shareMap').on('click', () => {
    $('#facebookShare').off('click').click(() => {
        window.open(facebookSharerUrl + encodeURIComponent(baseUrl + '?id=' + moveStack[moveStack.length - 1].id), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600')
    })
    $('#twitterShare').off('click').click(() => {
        window.open(twitterSharerUrl + encodeURIComponent(baseUrl + '?id=' + moveStack[moveStack.length - 1].id), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600')
    })
    $('#shareOptionsModal').modal('show')
})

$('#embededMap').on('click', () => {
    $('#embedCode').val('<embed width="100%" height="780" src="' +
        baseUrl + 'frame.html?id=' +
        moveStack[moveStack.length - 1].id +
        '" />')
    $('#embedModal').modal('show')
})
