//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// v4 routes
// not used seperate routs yet as there isn't a need to

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

router.post('/v4/find-someone-confirm', function(req, res) {
   
    if(req.session.data['personConfirmation'] == "yes"){
        res.redirect("need-security-questions")
    }
    else{
        res.redirect("find-someone")
    }
});

router.post('/v4/need-security-questions', function(req, res) {
   
    if(req.session.data['needIDV'] == "yes"){
        res.redirect("security-check")
    }
    else{
        res.redirect("personal")
    }
});

// v5 routes
// not used seperate routs yet as there isn't a need to
router.post('/v5/scenario', function(req, res) {
   
    res.redirect("find-someone")

});

router.post('/v5/find-someone-confirm', function(req, res) {
   
    if(req.session.data['personConfirmation'] == "yes"){
        res.redirect("need-security-questions")
    }
    else{
        res.redirect("find-someone")
    }
});

router.post('/v5/need-security-questions', function(req, res) {
   
    if(req.session.data['needIDV'] == "yes"){
        res.redirect("security-check")
    }
    else{
        res.redirect("personal")
    }
});
router.post('/v5/mr-yes-no', function(req, res) {
    res.redirect("award-detail")
});