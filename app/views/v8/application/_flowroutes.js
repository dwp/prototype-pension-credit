const govukPrototypeKit = require('govuk-prototype-kit');
const router = govukPrototypeKit.requests.setupRouter();

var version = "v8";


router.post('/'+ version +'/application/flow1', function(req, res) {
   res.redirect("check-partner"); 
});

router.post('/'+ version +'/application/flow2', function(req, res) {
   res.redirect("check-partner"); 
});

router.post('/'+ version +'/application/flow3', function(req, res) {
   res.redirect("check-partner"); 
});

router.get('/'+ version + '/application/check-partner', function(req, res) {
   req.session.data['backURL'] = req.header('Referer') || '/';
   res.render(version + '/application/check-partner')
});

router.post('/'+ version +'/application/check-partner', function(req, res) {
   if(req.session.data['partnername']=='yes'){   
     alert("Yes you pressed yes")
  }
  else{
   res.redirect(req.session.data['backURL']);
  }
});


