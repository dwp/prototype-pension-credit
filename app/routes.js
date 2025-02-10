// Date tranformation functions
Date.prototype.toShortFormat = function() {
const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; 
const day = this.getDate();
const monthIndex = this.getMonth();
const monthName = shortMonthNames[monthIndex];
const year = this.getFullYear();
return `${day} ${monthName} ${year}`;  
}

Date.prototype.toLongFormat = function() {
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const day = this.getDate();
const monthIndex = this.getMonth();
const monthName = monthNames[monthIndex];
const year = this.getFullYear();
return `${day} ${monthName} ${year}`;  
}


// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()


// import individual routes files
require('./views/v6/tasks/_taskroutes')
require('./views/v6/_routes')
require('./views/v6/application/_applicationroutes')

require('./views/v7/tasks/_taskroutes')
require('./views/v7/_routes')
require('./views/v7/application/_applicationroutes')
require('./views/v7/application/_flowroutes')

require('./views/v8/tasks/_taskroutes')
require('./views/v8/_routes')
require('./views/v8/application/_applicationroutes')
require('./views/v8/application/_flowroutes')

require('./views/v9/tasks/_taskroutes')
require('./views/v9/_routes')
require('./views/v9/application/_applicationroutes')

require('./views/v10/tasks/_taskroutes')
require('./views/v10/_routes')
require('./views/v10/application/_applicationroutes')
require('./views/v10/application/_flowroutes')

require('./views/v11/application/_applicationroutes')

require('./views/v12/application/_applicationroutes')

require('./views/v13/tasks/_taskroutes')

require('./views/v14/tasks/_taskroutes')

require('./views/v15/application/_applicationroutes')
require('./views/v16/application/_applicationroutes')


// Older routing
// v4 routes
// not used seperate routs yet as there isn't a need to

router.get('/clearData', function(req, res) {
    req.session.destroy();
    res.redirect("./index");
});


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
router.post('/v5/test-scenarios', function(req, res) {
    res.redirect("award")
});

router.post('/v5/mr-yes-no', function(req, res) {
    res.redirect("award-detail")
});

router.post('/v5/award-detail', function(req, res) {
    if(req.session.data['T2_Explained']) {
        res.redirect("DR6Confirmation")
    } 
});

router.post('/v5/DR6Confirmation', function(req, res) {
    if(req.session.data['T2_Explained'] == 'no'){
        req.session.data['MR_requested'] = 'yes';
        req.session.data['tempDisplay']='false';
    }
    else{
        req.session.data['tempDisplay']='true';
        req.session.data['DR6-uploaded'] = 'yes';
    }

    if (req.session.data['DR6_check']=='true') {
        var today = new Date();
        req.session.data['dr6_date'] = today.toLongFormat();
        res.redirect("award-detail")
    } 
    else {
        req.session.data['DR6ConfirmationError']='true';
        res.redirect("DR6Confirmation")
    }
});

router.get('/v5/award', function(req, res) {
    req.session.data['tempDisplay'] = 'false';
    res.render("v5/award");
});

router.get('/v5/personal', function(req, res) {
    req.session.data['tempDisplay'] = 'false';
    res.render("v5/personal");
});


