console.log(12)
var s = Snap('#canvas')
Snap.load('maps/kriti.svg', (data) => {
    s.append(data)
    const q = s.selectAll('g')
    console.log(q)
})