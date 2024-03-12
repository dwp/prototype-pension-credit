const govukPrototypeKit = require('govuk-prototype-kit');
const router = govukPrototypeKit.requests.setupRouter();

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var version = "v7";


router.get('/'+ version + '/application/delete', function(req, res) {
    var i = req.query.person;
    req.session.data['claimantname'+i] = null;
    req.session.data['ActualCount'] = req.session.data['ActualCount'] - 1;
    res.redirect("add-another")
});


router.get('/'+ version + '/application/change', function(req, res) {
   var i = req.query.person;
   req.session.data['CurrentPerson'] = i;
   res.redirect("check-answers")
});

router.post('/'+ version +'/application/number-of-adults', function(req, res) {
   if(req.session.data['ExtraAdults']=="Yes, more than one person"){
      req.session.data['PeopleCount'] = '1';
      req.session.data['CurrentPerson'] = '1';
      req.session.data['ActualCount'] = '1';

       res.redirect("name")
   }
});

router.post('/'+ version +'/application/name', function(req, res) {
    
    
   req.session.data['claimantname' + String(req.session.data['CurrentPerson'])] = req.session.data['currentName'];

    res.redirect("DoB")  
 }); 

 router.post('/'+ version +'/application/DoB', function(req, res) {
    var LongDoB = req.session.data['DoBDay'] + ' ' + months[req.session.data['DoBMonth']-1] + ' ' + req.session.data['DoBYear'];
    req.session.data['claimantDOB' + String(req.session.data['CurrentPerson'])] = LongDoB;
    res.redirect("are-relations")  
 }); 

 router.post('/'+ version +'/application/are-relations', function(req, res) {
   if(req.session.data['isRelative']=='yes'){
      res.redirect("relative-or-friend") }
   else if(req.session.data['isRelative']=='no'){
   res.redirect("commercial-relationship") }  
}); 

router.post('/'+ version +'/application/relative-or-friend', function(req, res) {
   if(req.session.data['relationship']=='Other'){
      res.redirect("other-relationship") 
   }
   else{
      req.session.data['relationship'+ String(req.session.data['CurrentPerson'])] = req.session.data['relationship'];
      res.redirect("contribute-to-bills") 
   }
}); 

router.post('/'+ version +'/application/commercial-relationship', function(req, res) {
   if(req.session.data['relationship']=='Someone else'){
      res.redirect("other-relationship") 
   }
   else{
      req.session.data['relationship'+ String(req.session.data['CurrentPerson'])] = req.session.data['relationship'];
      res.redirect("check-answers") 
   }
}); 

router.post('/'+ version +'/application/other-relationship', function(req, res) {

      req.session.data['relationship'+ String(req.session.data['CurrentPerson'])] = req.session.data['relationship'];
      res.redirect("contribute-to-bills") 
   
}); 

router.post('/'+ version +'/application/contribute-to-bills', function(req, res) {

   req.session.data['contribute'+ String(req.session.data['CurrentPerson'])] = req.session.data['contribute'];
   res.redirect("check-answers") 

}); 

 router.post('/'+ version +'/application/check-answers', function(req, res) {
   res.redirect("add-another")  
}); 

 router.post('/'+ version +'/application/add-another', function(req, res) {
    if(req.session.data['addanother']=='yes'){   
        req.session.data['PeopleCount'] ++;
        req.session.data['CurrentPerson'] = req.session.data['PeopleCount'];
        req.session.data['ActualCount'] ++;
        res.redirect("name") 
    }
 });