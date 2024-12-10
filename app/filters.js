const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

addFilter('round5up', function (x) {
    return Math.ceil(x / 5) * 5
  })

addFilter('round5down', function (x) {
return Math.floor(x / 5) * 5
})

