const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

var version = "v8";


router.get('/'+ version +'/tasks', function(req, res) {
    req.session.data['scenario'] = 'T21';
    if(req.session.data['TaskAmount'] > '2'){
        req.session.data['TaskAmount'] = req.session.data['TaskAmount'] - 1;
        req.session.data['TaskAmountReady'] = req.session.data['TaskAmount'] - 1;

    }
    else{
        req.session.data['TaskAmount'] = Math.floor(Math.random() * 15) + 2;
        req.session.data['TaskAmountReady'] = req.session.data['TaskAmount'] - 1;
    }

    
    res.render(version +"/tasks");
});
router.get('/'+version+'/find-someone', function(req, res) {
    req.session.data['scenario'] = 'T21';
    if(req.session.data['TaskAmount']){
        req.session.data['TaskAmount'] = req.session.data['TaskAmount'] - 1;
        req.session.data['TaskAmountReady'] = req.session.data['TaskAmount'] - 1;

    }
    else{
        req.session.data['TaskAmount'] = Math.floor(Math.random() * 15) + 1;
        req.session.data['TaskAmountReady'] = req.session.data['TaskAmount'] - 1;
    }
    res.render(version + "/find-someone");
});



router.post('/'+ version +'/find-someone-confirm', function(req, res) {
   
    if(req.session.data['personConfirmation'] == "yes"){
        res.redirect("need-security-questions")
    }
    else{
        res.redirect("find-someone")
    }
});

router.post('/'+ version +'/need-security-questions', function(req, res) {
   
    if(req.session.data['needIDV'] == "yes"){
        res.redirect("security-check")
    }
    else{
        res.redirect("personal")
    }
});

router.post('/'+ version +'/award-detail', function(req, res) {
    if(req.session.data['T2_Explained']) {
        res.redirect("DR6Confirmation")
    } 
});

router.post('/'+ version +'/DR6Confirmation', function(req, res) {
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

