const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

var version = "v6";

router.get('/'+ version + '/tasks/tasklist', function(req, res) {
    req.session.data['TaskSuccess'] = 'no';
    res.render(version + "/tasks/tasklist");
});


router.post('/' + version + '/tasks/bank-name', function(req, res) {
    if(req.session.data['BankDetails'] == 'yes') {
        res.redirect("tasklist")
    } 
    else{
        res.redirect("dropout")
    }
});

router.post('/' + version + '/tasks/other-applications', function(req, res) {
    if(req.session.data['OtherApplications'] == 'yes') {
        res.redirect("dropout")
    } 
    else{
        res.redirect("tasklist")
    }
});

router.post('/' + version + '/tasks/personal-details', function(req, res) {
    if(req.session.data['PersonalDetails'] == 'yes') {
        res.redirect("benefits")
    } 
    else{
        res.redirect("dropout")
    }
});

router.post('/' + version + '/tasks/benefits', function(req, res) {
    if(req.session.data['BenefitInterests'] == 'no' && req.session.data['ReceivingBenefits'] == 'no') {
        req.session.data['Benefits'] = 'no'
        res.redirect("non-dependents")
    } 
    else{
        res.redirect("dropout")
    }
});

router.post('/' + version + '/tasks/non-dependents', function(req, res) {
    if(req.session.data['NonDependents'] == 'no') {
        res.redirect("tasklist")
    } 
    else{
        res.redirect("dropout")
    }
});


router.post('/' + version + '/tasks/dropout', function(req, res) {
    // Reset all sessions
    req.session.data['BankDetails'] = '';
    req.session.data['OtherApplications'] = '';
    req.session.data['PersonalDetails'] = '';
    req.session.data['Benefits'] = '';
    req.session.data['NonDependents'] = '';
    res.redirect("../tasks")
});

router.post('/' + version + '/tasks/tasklist', function(req, res) {
    // Reset all sessions
    req.session.data['BankDetails'] = '';
    req.session.data['OtherApplications'] = '';
    req.session.data['PersonalDetails'] = '';
    req.session.data['Benefits'] = '';
    req.session.data['NonDependents'] = '';
    req.session.data['TaskSuccess'] = 'yes';
    res.redirect("../tasks")
});

