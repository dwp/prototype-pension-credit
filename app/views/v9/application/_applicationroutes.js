const govukPrototypeKit = require('govuk-prototype-kit');
const router = govukPrototypeKit.requests.setupRouter();

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var version = "v9";


router.post('/'+ version +'/application/date-of-birth', function(req, res) { 
   res.redirect("applicant-nationality-passport")
});

router.post('/'+ version +'/application/applicant-nationality-passport', function(req, res) { 
   res.redirect("live-with-partner")
});

router.post('/'+ version +'/application/live-with-partner', function(req, res) { 
   res.redirect("protect-identity")
});

router.post('/'+ version +'/application/protect-identity', function(req, res) { 
   res.redirect("benefits")
});

router.post('/'+ version +'/application/benefits', function(req, res) { 
   let benefits = req.session.data['benefitsGetting'];
   if(benefits.includes('SP')){
      res.redirect("SP-bank")
   }
   else{
      res.redirect("benefits-applied")
   }
});

router.post('/'+ version +'/application/benefits-applied', function(req, res) { 
      res.redirect("phone")
   
});

router.post('/'+ version +'/application/SP-bank', function(req, res) { 
   res.redirect("bank-confirm")
});

router.post('/'+ version +'/application/bank-confirm', function(req, res) { 
   
   if(req.session.data['sameBank']=='yes'){
      res.redirect("finish")
   }
   else{
      res.redirect("bank-details")
   }
});

router.post('/'+ version +'/application/phone', function(req, res) { 
   res.redirect("bank-details")

});
router.post('/'+ version +'/application/phone2', function(req, res) { 
   res.redirect("bank-details")

});