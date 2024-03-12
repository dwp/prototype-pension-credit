const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

var version = "v7";


router.get('/v6/tasks', function(req, res) {
    req.session.data['scenario'] = 'T21';
    if(req.session.data['TaskAmount'] > '2'){
        req.session.data['TaskAmount'] = req.session.data['TaskAmount'] - 1;
        req.session.data['TaskAmountReady'] = req.session.data['TaskAmount'] - 1;

    }
    else{
        req.session.data['TaskAmount'] = Math.floor(Math.random() * 15) + 2;
        req.session.data['TaskAmountReady'] = req.session.data['TaskAmount'] - 1;
    }

    
    res.render("v6/tasks");
});
router.get('/v6/find-someone', function(req, res) {
    req.session.data['scenario'] = 'T21';
    if(req.session.data['TaskAmount']){
        req.session.data['TaskAmount'] = req.session.data['TaskAmount'] - 1;
        req.session.data['TaskAmountReady'] = req.session.data['TaskAmount'] - 1;

    }
    else{
        req.session.data['TaskAmount'] = Math.floor(Math.random() * 15) + 1;
        req.session.data['TaskAmountReady'] = req.session.data['TaskAmount'] - 1;
    }
    res.render("v6/find-someone");
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

