const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

addFilter('round5up', function (x) {
    return Math.ceil(x / 5) * 5
  })

addFilter('round5down', function (x) {
return Math.floor(x / 5) * 5
})

addFilter('last', function (x, y) {
  x = String(x);
  y = -y;
  return x.slice(y)
  })

addFilter('paymentFrequency', function (x) {
  switch(x) {
    case "W1":
      return "Weekly"
      break;
    case "W2":
      return "Fortnightly"
      break;
    case "W4":
      return "4 Weekly"
      break;
    case "M1":
      return "Monthly"
      break;
    case "M3":
      return "Quarterly"
      break;
    case "M6":
      return "Bi-annually"
      break;
    case "MA":
    return "Annually"
    break;
    case "IO":
      return "One off"
      break;
    case "IR":
      return "Irregular"
      break;
    default:
      return "Something else"
  }
})

addFilter('paymentFrequency2', function (x) {
  switch(x) {
    case "W1":
      return "Week"
      break;
    case "W2":
      return "Fortnight"
      break;
    case "W4":
      return "four weeks"
      break;
    case "M1":
      return "Month"
      break;
    case "M3":
      return "Quarter"
      break;
    case "M6":
      return "six months"
      break;
    case "MA":
    return "year"
    break;
    case "IO":
      return "One off"
      break;
    case "IR":
      return "Irregular"
      break;
    default:
      return "Something else"
  }
})
