
var rsr = Raphael('map', '1049', '886');
rsr.setViewBox(0, 0, '1049', '886', true);
rsr.setSize('100%', '100%');

const p = Promise.all([axios.get('/paths.json'), axios.get('/regions.json')])

p.then((resp) => {
    const paths = R.map(a => rsr.path(a), resp[0].data)

    const regionData = resp[1].data
    const regions = R.map(rsr.set)(regionData)
    const regionColors = generateColors(1, 0.4, regions.length);

    regions.forEach((r, i) => {
        const relativePaths = regionData[i].path.map(el => paths[el])
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
        )
    )
})

function generateColors(saturation, lightness, amount) {
    let rgbColors = [];
    let hslColors = generateHslaColors(saturation, lightness, amount);
    for (let countc = 0; countc < amount; countc++) {
        let currColorMap = hslToRgb(hslColors[countc].hue, hslColors[countc].saturation, hslColors[countc].lightness);
        rgbColors.push('rgb(' + currColorMap.red + ',' + currColorMap.green + ',' + currColorMap.blue + ')');
    }
    return rgbColors;
}

function generateHslaColors(saturation, lightness, amount) {
    let colors = []
    let huedelta = Math.trunc(360 / amount)

    for (let i = 0; i < amount; i++) {
        let hue = i * huedelta
        colors.push({ 'hue': hue, 'saturation': saturation, 'lightness': lightness });
    }

    return colors
}

function hslToRgb(h, s, l) {
    let a = s * Math.min(l, 1 - l);
    let f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return { 'red': f(0) * 255, 'green': f(8) * 255, 'blue': f(4) * 255 };
}