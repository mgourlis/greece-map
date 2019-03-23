const path = require('path')

const regionUtils = require(path.join(__dirname, 'utils') + '/regionUtils')

/* ------------ PARAMETERS -------------- */
const port = 25266
const baseUrl = "http://filodimos.ypes.gr"
/* -------------------------------------- */


console.log('started')

const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
    let title = 'ΦιλόΔημος - Υπουργείο Εσωτερικών'
    if (req.query.id) {
        title = 'ΦιλόΔημος - ΥΠ.ΕΣ. - ' + regionUtils.getRegionObject(req.query.id).name
    }else{
        req.query.id = '0-1'
    }
    res.locals.viewbag = {
        query: req.query,
        url: req.originalUrl,
        origin: baseUrl,
        title: title,
        ogurl: baseUrl + req.originalUrl
    }
    res.render('pages/index')
})

app.get('/frame', function (req, res) {
    let title = 'ΦιλόΔημος - Υπουργείο Εσωτερικών'
    if (req.query.id) {
        title = 'ΦιλόΔημος - ΥΠ.ΕΣ. - ' + regionUtils.getRegionObject(req.query.id).name
    }else{
        req.query.id = '0-1'
    }
    res.locals.viewbag = {
        query: req.query,
        url: req.originalUrl,
        origin: baseUrl,
        title: title,
        ogurl: baseUrl + req.originalUrl
    }
    res.render('pages/frame')
})

app.listen(port, () => console.log(`listening on port ${port}!`))


