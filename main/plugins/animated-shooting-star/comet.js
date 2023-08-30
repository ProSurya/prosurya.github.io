const cover = document.querySelector('#cover')

let cometCount = ""
// for(let c = 0; c < 3; c++) {
//     cometCount += `<div class="shootingStarContainer">`
    for(let i = 0; i < 1; i++) {
        // cometCount += `<div class="shootingStar"></div>`
        cometCount += `<div class="comet"></div>`
    }
//     cometCount += "</div>"
// }

cover.innerHTML += cometCount
