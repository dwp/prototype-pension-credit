const govukPrototypeKit = require('govuk-prototype-kit');
const router = govukPrototypeKit.requests.setupRouter();

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var version = "v6";


router.get('/'+ version + '/application/delete', function(req, res) {
    var i = req.query.person;
    req.session.data['claimantname'+i] = null;
    req.session.data['ActualCount'] = req.session.data['ActualCount'] - 1;
    res.redirect("add-another")
});

router.post('/'+ version +'/application/number-of-adults', function(req, res) {
   if(req.session.data['ExtraAdults']=="Yes, more than one person"){
      req.session.data['PeopleCount'] = '1';
      req.session.data['CurrentPerson'] = '1';
      req.session.data['ActualCount'] = '1';

      console.log(req.session.data['ExtraAdults']);
      console.log(req.session.data['PeopleCount']);
      console.log(req.session.data['CurrentPerson']);
      console.log(req.session.data['ActualCount']);

       res.redirect("name")
   }
});

router.post('/'+ version +'/application/name', function(req, res) {
    
   console.log('claimantname' + String(req.session.data['CurrentPerson']));
   console.log(req.session.data['currentName']);
    
   req.session.data['claimantname' + String(req.session.data['CurrentPerson'])] = req.session.data['currentName'];
   //console.log(x);

    res.redirect("DoB")  
 }); 

 router.post('/'+ version +'/application/DoB', function(req, res) {
    var LongDoB = req.session.data['DoBDay'] + ' ' + months[req.session.data['DoBMonth']-1] + ' ' + req.session.data['DoBYear'];
    req.session.data['claimantDOB' + String(req.session.data['CurrentPerson'])] = req.session.data['currentDoB'];
    res.redirect("add-another")  
 }); 

 router.post('/'+ version +'/application/add-another', function(req, res) {
    if(req.session.data['addanother']=='yes'){   
        req.session.data['PeopleCount'] ++;
        req.session.data['CurrentPerson'] ++;
        req.session.data['ActualCount'] ++;
        res.redirect("name") 
    }
 });