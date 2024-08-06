const govukPrototypeKit = require('govuk-prototype-kit');
const router = govukPrototypeKit.requests.setupRouter();

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var date = new Date(); //get todays date

var version = "v11";

//HOSPITAL STAYS

router.get('/'+ version + '/application/hospital-delete', function(req, res) {
   var i = req.query.hospital;
   req.session.data['hospitalIn'+i] = null;
   req.session.data['hospitalOut'+i] = null;
   req.session.data['ActualHospitalCount'] = req.session.data['ActualHospitalCount'] - 1;
   res.redirect("hospital-add-another")
});


router.get('/'+ version + '/application/hospital-change', function(req, res) {
  var i = req.query.hospital;
  req.session.data['CurrentHospital'] = i;
  res.redirect("hospital-check-answers")
});

router.get('/'+ version + '/index', function(req, res) {
   var backdateDate = new Date()
   backdateDate.setMonth(backdateDate.getMonth() - 6)
   var backdateDateString = backdateDate.getDate() + " " + months[backdateDate.getDay()-1] + " " + backdateDate.getFullYear()
   req.session.data['backdateDateString'] = backdateDateString
   res.render(version + '/index')
 });

router.post('/'+ version +'/application/hospital-stays', function(req, res) {
   if(req.session.data['HospitalStays']=="Yes"){
      req.session.data['HospitalCount'] = '1';
      req.session.data['CurrentHospital'] = '1';
      req.session.data['ActualHospitalCount'] = '1';
 
      res.redirect("hospital-still")
   }
 });

router.post('/'+ version +'/application/hospital-still', function(req, res) {
   req.session.data['HospitalStill' + String(req.session.data['CurrentHospital'])] = req.session.data['HospitalStill'];
   if(req.session.data['HospitalStill']=="Yes"){
      res.redirect("hospital-you-are-in")
   }
   else{
      res.redirect("hospital-dates")
   }
});

router.post('/'+ version +'/application/hospital-dates', function(req, res) {
   req.session.data['hospitalIn' + String(req.session.data['CurrentHospital'])] = req.session.data['hospitalIn-day'] + ' ' + months[req.session.data['hospitalIn-month']-1] + ' ' + req.session.data['hospitalIn-year'];;
   req.session.data['hospitalOut' + String(req.session.data['CurrentHospital'])] = req.session.data['hospitalOut-day'] + ' ' + months[req.session.data['hospitalOut-month']-1] + ' ' + req.session.data['hospitalOut-year'];;
   req.session.data['hospitalNHS' + String(req.session.data['CurrentHospital'])] = req.session.data['hospitalNHS']
   res.redirect("hospital-check-answers")
});

router.post('/'+ version +'/application/hospital-check-answers', function(req, res) {
  res.redirect("hospital-add-another")
});

router.post('/'+ version +'/application/hospital-add-another', function(req, res) {
   if(req.session.data['Hospitaladdanother']=='yes'){   
       req.session.data['HospitalCount'] ++;
       req.session.data['CurrentHospital'] = req.session.data['HospitalCount'];
       req.session.data['ActualHospitalCount'] ++;
       res.redirect("hospital-dates") 
   }
});

router.post('/'+ version +'/application/hospital-you-are-in', function(req, res) {
   req.session.data['hospitalName' + String(req.session.data['CurrentHospital'])] = req.session.data['hospitalName'] 
   req.session.data['hospitalLocation' + String(req.session.data['CurrentHospital'])] = req.session.data['hospitalLocation']
   req.session.data['hospitalNHS' + String(req.session.data['CurrentHospital'])] = req.session.data['hospitalNHS']
   res.redirect("hospital-in") 
});

router.post('/'+ version +'/application/hospital-in', function(req, res) {
   req.session.data['hospitalIn' + String(req.session.data['CurrentHospital'])] = req.session.data['hospitalIn-day'] + ' ' + months[req.session.data['hospitalIn-month']-1] + ' ' + req.session.data['hospitalIn-year'];
   res.redirect("hospital-expected-discharge") 
});

router.post('/'+ version +'/application/hospital-expected-discharge', function(req, res) {
   req.session.data['HospitalExpectedDischarge' + String(req.session.data['CurrentHospital'])] = req.session.data['HospitalExpectedDischarge'] 
   if(req.session.data['HospitalExpectedDischarge']=="Yes"){
      res.redirect("hospital-discharge-date") 
   }
   else{
      res.redirect("hospital-check-answers") 
   }
});

router.post('/'+ version +'/application/hospital-discharge-date', function(req, res) {
   req.session.data['hospitalOut' + String(req.session.data['CurrentHospital'])] = req.session.data['hospitalOut-day'] + ' ' + months[req.session.data['hospitalOut-month']-1] + ' ' + req.session.data['hospitalOut-year'];;
   req.session.data['hospitalDischargeLocation' + String(req.session.data['CurrentHospital'])] = req.session.data['hospitalDischargeLocation']
   res.redirect("hospital-check-answers") 
});


///////// NON-DEPENDENTS  //////////////

router.get('/'+ version + '/application/nondep-delete', function(req, res) {
   var i = req.query.person;
   req.session.data['nondepName'+i] = null;
   req.session.data['ActualCount'] = req.session.data['ActualCount'] - 1;
   res.redirect("nondep-add-another")
});


router.get('/'+ version + '/application/nondep-change', function(req, res) {
  var i = req.query.person;
  req.session.data['CurrentPerson'] = i;
  res.redirect("nondep-check-answers")
});

router.post('/'+ version +'/application/nondep-number-of-adults', function(req, res) {
  if(req.session.data['ExtraAdults']=="Yes"){
     req.session.data['PeopleCount'] = '1';
     req.session.data['CurrentPerson'] = '1';
     req.session.data['ActualCount'] = '1';

     res.redirect("nondep-name")
  }
});

router.post('/'+ version +'/application/nondep-name', function(req, res) {
   req.session.data['nondepName' + String(req.session.data['CurrentPerson'])] = req.session.data['currentName'];
   res.redirect("nondep-are-relations")  
});  

router.post('/'+ version +'/application/nondep-are-relations', function(req, res) {
   req.session.data['isRelative'+ String(req.session.data['CurrentPerson'])] = req.session.data['isRelative'];
     
   if(req.session.data['isRelative']=='Yes'){
     res.redirect("nondep-relative-or-friend") }
  else if(req.session.data['isRelative']=='No'){
  res.redirect("nondep-commercial-relationship") }  
}); 

router.post('/'+ version +'/application/nondep-relative-or-friend', function(req, res) {
  if(req.session.data['relationship']=='Other relation'){
     res.redirect("nondep-other-relationship") 
  }
  else{
     req.session.data['relationship'+ String(req.session.data['CurrentPerson'])] = req.session.data['relationship'];
     res.redirect("nondep-DoB") 
  }
}); 

router.post('/'+ version +'/application/nondep-DoB', function(req, res) {
   var LongDoB = req.session.data['DoBDay'] + ' ' + months[req.session.data['DoBMonth']-1] + ' ' + req.session.data['DoBYear'];
   req.session.data['nondepDOB' + String(req.session.data['CurrentPerson'])] = LongDoB;
   res.redirect("nondep-are-blind")  
});

router.post('/'+ version +'/application/nondep-are-blind', function(req, res) {
   req.session.data['isBlind' + String(req.session.data['CurrentPerson'])] = req.session.data['isBlind'];
   res.redirect("nondep-lived-with-you")  
});

router.post('/'+ version +'/application/nondep-lived-with-you', function(req, res) {
   var LongDate = req.session.data['LiveTogetherDay'] + ' ' + months[req.session.data['LiveTogetherMonth']-1] + ' ' + req.session.data['LiveTogetherYear'];
   req.session.data['LiveTogetherDate' + String(req.session.data['CurrentPerson'])] = LongDate;
   res.redirect("nondep-in-education")  
});

router.post('/'+ version +'/application/nondep-in-education', function(req, res) {
   req.session.data['inEducation' + String(req.session.data['CurrentPerson'])] = req.session.data['inEducation'];
   res.redirect("nondep-is-employed")  
});

router.post('/'+ version +'/application/nondep-is-employed', function(req, res) {
   req.session.data['inEmployment' + String(req.session.data['CurrentPerson'])] = req.session.data['inEmployment'];
   req.session.data['selfEmployed' + String(req.session.data['CurrentPerson'])] = req.session.data['selfEmployed'];
   
   res.redirect("nondep-contribute-to-bills")  
});

router.post('/'+ version +'/application/nondep-commercial-relationship', function(req, res) {
   req.session.data['commercialRelationship' + String(req.session.data['CurrentPerson'])] = req.session.data['commercialRelationship'];
   if(req.session.data['commercialRelationship']=='Someone from a charity or voluntary organisation'){
   res.redirect("nondep-charity-name") 
   }
  else{
     req.session.data['commercialRelationship'+ String(req.session.data['CurrentPerson'])] = req.session.data['commercialRelationship'];
     res.redirect("nondep-check-answers") 
  }
}); 

router.post('/'+ version +'/application/nondep-other-relationship', function(req, res) {
     req.session.data['relationship'+ String(req.session.data['CurrentPerson'])] = req.session.data['relationship'];
     res.redirect("nondep-DoB")
}); 

router.post('/'+ version +'/application/nondep-contribute-to-bills', function(req, res) {
  req.session.data['contribute'+ String(req.session.data['CurrentPerson'])] = req.session.data['contribute'];
  res.redirect("nondep-commercial-relationship")
}); 

router.post('/'+ version +'/application/nondep-check-answers', function(req, res) {
  res.redirect("nondep-add-another")  
}); 

router.post('/'+ version +'/application/nondep-add-another', function(req, res) {
   if(req.session.data['addanother']=='yes'){   
       req.session.data['PeopleCount'] ++;
       req.session.data['CurrentPerson'] = req.session.data['PeopleCount'];
       req.session.data['ActualCount'] ++;
       res.redirect("nondep-name") 
   }
});

router.post('/'+ version +'/application/nondep-charity-name', function(req, res) {
   req.session.data['charityName'+ String(req.session.data['CurrentPerson'])] = req.session.data['charityName'];
   res.redirect("nondep-check-answers") 
 }); 



//OTHER STUFF


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
   let pastYear = date.getFullYear()-3;
   req.session.data['benefitDate'] = date.getDate() + ' ' + months[date.getMonth()] + ' ' + pastYear;
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
      res.redirect("bank-details")
   
});

router.post('/'+ version +'/application/SP-bank', function(req, res) { 
   let sortcode = req.session.data['SP-sortcode'];
   if(sortcode.length === 6){
      let formattedSortcode = sortcode.slice(0,2) + ' ';
      formattedSortcode += sortcode.slice(2,4) + ' ';
      formattedSortcode += sortcode.slice(4,6);
      req.session.data['SP-sortcode'] = formattedSortcode;
   }
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