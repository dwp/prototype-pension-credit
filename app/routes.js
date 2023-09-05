//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

router.post('*/security-check', function(req, res) {
    var SecurityConfirm = req.session.data['SecurityCheck'];
   
    if(SecurityConfirm == "yes"){
        res.redirect("personal")
    }
    else if(SecurityConfirm == 'no'){
        res.redirect("security-check-failed")
    }
});

router.post('/v4/scenario', function(req, res) {
    var SecurityConfirm = req.session.data['SecurityCheck'];
   
    if(req.session.data['scenario'] == "couple-nsp"){
        res.redirect("scenario-2")
    }
    else{
        res.redirect("find-someone")
    }
});



