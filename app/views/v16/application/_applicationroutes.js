const govukPrototypeKit = require('govuk-prototype-kit');
const router = govukPrototypeKit.requests.setupRouter();

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SPa_Boundry_Start = new Date(Date.parse('06 April 1951 00:00:00 GMT'))
const SPa_Boundry_End = new Date(Date.parse('06 April 1953 00:00:00 GMT'))

var date = new Date(); //get todays date

var version = "v16";


////////////////////
////////////////////    ELIGIBILITY
////////////////////

router.post('/'+ version +'/application/eligibility-service-start', function(req, res) { 
   if(req.session.data["hasEverything"]=='Yes'){
      req.session.data['canPerformEligibility'] = 'true';
      res.redirect("eligibility-country-you-live-in")
   }
   else{
      res.redirect("eligibility-need-information")
   }
});

router.post('/'+ version +'/application/eligibility-country-you-live-in', function(req, res) { 
   if(req.session.data["countryLiveIn"]=='Somewhere else'){
      res.redirect("eligibility-do-not-live-uk")
   }
   else{
      res.redirect("eligibility-check-your-eligibility")
   }
});


router.post('/'+ version +'/application/eligibility-start-dob', function(req, res) { 
   req.session.data['Carersamount'] = '0'
   req.session.data['EASDamount'] = '0'
   
   var claimantDoB = new Date()
   claimantDoB.setTime(0)
   claimantDoB.setDate(req.session.data["dateOfBirthdd"])
   claimantDoB.setMonth(req.session.data["dateOfBirthmm"]-1)
   claimantDoB.setYear(req.session.data["dateOfBirthyy"])
   req.session.data['claimantDoB'] = claimantDoB

   let SPa = new Date(Date.parse(req.session.data['claimantDoB']))
   let DoB = new Date(Date.parse(req.session.data['claimantDoB']))
   SPa.setFullYear(SPa. getFullYear() + 66);
   let today = new Date()
   today.setMonth(today. getMonth() + 4);

   console.log("SPa: "+SPa)
   console.log("DoB: "+DoB)
   console.log("SPa boundry start: "+SPa_Boundry_Start)
   console.log("SPa boundry end: "+SPa_Boundry_End)
   console.log("Today: "+today)

   if(SPa<today){
      if(DoB > SPa_Boundry_Start && DoB < SPa_Boundry_End){
         res.redirect("eligibility-claimant-sex")
      }
      else if(DoB<SPa_Boundry_Start){
         req.session.data['canPerformEligibility'] == 'false';
         res.redirect("eligibility-has-children");
      }
      else{
         res.redirect("eligibility-has-children")
      }
   }
   else{
      res.redirect("eligibility-too-young")
   }

});

router.post('/'+ version +'/application/eligibility-claimant-sex', function(req, res) { 
   let dob = new Date(Date.parse(req.session.data['claimantDoB']));
   
   if(req.session.data['claimantSex'] == 'Male'){
      let SC_SPaDate = new Date(Date.parse('05 May 1951 00:00:00 GMT'));
      if(dob < SC_SPaDate){
         req.session.data['canPerformEligibility']='false'
      }
      res.redirect("eligibility-has-children")
   }
   else{
      let SC_SPaDate = new Date(Date.parse('05 May 1956 00:00:00 GMT'));
      if(dob < SC_SPaDate){
         req.session.data['canPerformEligibility']='false'
      }
      res.redirect("eligibility-has-children")
   }
});

router.post('/'+ version +'/application/eligibility-has-children', function(req, res) { 
   if(req.session.data['hasChildren']=="Yes"){
      req.session.data['canPerformEligibility'] = 'false';
      res.redirect("eligibility-housing-costs");
   }
   else{
      res.redirect("eligibility-housing-costs")
   }
});

router.post('/'+ version +'/application/eligibility-housing-costs', function(req, res) { 
   if(req.session.data['serviceCharge'] == 'Yes' || req.session.data['groundRent'] == 'I own my home and pay ground rent' ){
      req.session.data['canPerformEligibility'] = 'false';
      res.redirect("eligibility-benefits-claimant");
   }
   else{
      res.redirect("eligibility-benefits-claimant");
   }
});

router.post('/'+ version +'/application/eligibility-benefits-claimant', function(req, res) {
   let benefits = req.session.data['ClaimantBenefitsEntitled'];

   if(   benefits.includes('Attendance Allowance') || benefits.includes('Disability Living Allowance') || 
         benefits.includes('Personal Independence Payment') || benefits.includes('Adult Disability Payment') || 
         benefits.includes('Armed Forces Independence Payment') || benefits.includes('Pension Age Disability Payment') ||
         benefits.includes('Constant Attendance Allowance')
      ){
      req.session.data['claimantEASD'] = 'true';
   }

   if(benefits.includes('Carer\'s allowance') || benefits.includes('Carer support payment')){
      req.session.data['claimantCarers'] = 'true';
   }

   if( req.session.data['claimantCarers'] == 'true' && req.session.data['claimantEASD'] == 'true'){
      res.redirect("eligibility-income-from-employment");
   }
   else{
      res.redirect("eligibility-benefits-awaiting-claimant");
   }
});


router.post('/'+ version +'/application/eligibility-benefits-awaiting-claimant', function(req, res) {
   let benefits = req.session.data['ClaimantBenefitsAwaiting'];

   if(   benefits.includes('Attendance Allowance') || benefits.includes('Disability Living Allowance') || 
         benefits.includes('Personal Independence Payment') || benefits.includes('Adult Disability Payment') || 
         benefits.includes('Armed Forces Independence Payment') || benefits.includes('Pension Age Disability Payment') ||
         benefits.includes('Constant Attendance Allowance')){
      req.session.data['claimantEASD'] = 'true';
   }

   if(benefits.includes('Carer\'s allowance') || benefits.includes('Carer support payment')){
      req.session.data['claimantCarers'] = 'true';
   }
   
   
   res.redirect("eligibility-income-from-employment");

   
});

router.post('/'+ version +'/application/eligibility-income-from-employment', function(req, res) {
   
   if( req.session.data['hasPartner'] == 'Yes, we live together'){
      res.redirect("eligibility-calculate");
   }
   else{
      res.redirect("eligibility-has-partner");
   }
});


router.post('/'+ version +'/application/eligibility-has-partner', function(req, res) { 
   if( req.session.data['hasPartner'] == 'Yes, we live together'){
      res.redirect("eligibility-partner-dob")
   }
   else{
      res.redirect("eligibility-route");
   }
});

router.post('/'+ version +'/application/eligibility-partner-dob', function(req, res) { 
   var partnerDoB = new Date()
   partnerDoB.setTime(0)
   partnerDoB.setDate(req.session.data["dateOfBirthdd"])
   partnerDoB.setMonth(req.session.data["dateOfBirthmm"]-1)
   partnerDoB.setYear(req.session.data["dateOfBirthyy"])
   req.session.data['partnerDoB'] = partnerDoB

   let PartnerSPa = partnerDoB
   PartnerSPa.setFullYear(PartnerSPa. getFullYear() + 66);
   let today = new Date()
   today.setMonth(today. getMonth() + 4);

   if(partnerDoB > SPa_Boundry_Start && partnerDoB < SPa_Boundry_End){
      res.redirect("eligibility-partner-sex")
   }
   else if(PartnerSPa>today){
      let claimantDoB = new Date(req.session.data['claimantDoB']);
      let setDate = new Date("1954-01-05")
      if(claimantDoB < setDate){
         res.redirect("eligibility-housing-benefit")
      }
      else{
         res.redirect("eligibility-both-too-young")
      }
   }
   else{
      res.redirect("eligibility-benefits-partner")
   }
});

router.post('/'+ version +'/application/eligibility-partner-sex', function(req, res) { 
   let dob = new Date(Date.parse(req.session.data['partnerDoB']));
   let today = new Date();
   let SPadate = today.setFullYear(today.getFullYear() - 66);
   let claimantdob = new Date(Date.parse(req.session.data['claimantDoB']))
   
   if(req.session.data['partnerSex'] == 'Male'){
      let SC_SPaDate = new Date(Date.parse('05 May 1951 00:00:00 GMT'));
      
         if(claimantdob > SPadate && dob > SPadate){
            req.session.data['dropout'] = "spa";
            res.redirect("eligibility-dropout");
         }
         else if(claimantdob > SPadate || dob > SPadate){
            req.session.data['dropout'] = "mixed";
            res.redirect("eligibility-dropout");
         }
         else if(dob < SC_SPaDate){
            req.session.data['canPerformEligibility'] = 'false'
         }
         res.redirect("eligibility-benefits-partner")
      
   }
   else{
      let SC_SPaDate = new Date(Date.parse('05 May 1956 00:00:00 GMT'));
      
         if(claimantdob > SPadate && dob > SPadate){
            req.session.data['dropout'] = "spa";
            res.redirect("eligibility-dropout");
         }
         else if(claimantdob > SPadate || dob > SPadate){
            req.session.data['dropout'] = "mixed";
            res.redirect("eligibility-dropout");
         }
         else if(dob < SC_SPaDate){
            req.session.data['canPerformEligibility'] = 'false'
         }
         res.redirect("eligibility-benefits-partner")
     
   }
});

router.post('/'+ version +'/application/eligibility-benefits-partner', function(req, res) {
   let benefits = req.session.data['PartnerBenefitsEntitled'];

   if(   
      benefits.includes('Attendance Allowance') || benefits.includes('Disability Living Allowance') || 
      benefits.includes('Personal Independence Payment') || benefits.includes('Adult Disability Payment') || 
      benefits.includes('Armed Forces Independence Payment') || benefits.includes('Pension Age Disability Payment') ||
      benefits.includes('Constant Attendance Allowance')
      ){
      req.session.data['partnerEASD'] = 'true';
   }

   if(benefits.includes('Carer\'s allowance') || benefits.includes('Carer support payment')){
      req.session.data['partnerCarers'] = 'true';
   }

   if(req.session.data['partnerCarers'] == 'true' && req.session.data['partnerEASD'] == 'true'){
      res.redirect("eligibility-income-from-employment");
   }
   else{
      res.redirect("eligibility-benefits-awaiting-partner");
   }

   

});

router.post('/'+ version +'/application/eligibility-benefits-awaiting-partner', function(req, res) {
   let benefits = req.session.data['PartnerBenefitsAwaiting'];

   if(   
      benefits.includes('Attendance Allowance') || benefits.includes('Disability Living Allowance') || 
      benefits.includes('Personal Independence Payment') || benefits.includes('Adult Disability Payment') || 
      benefits.includes('Armed Forces Independence Payment') || benefits.includes('Pension Age Disability Payment') ||
      benefits.includes('Constant Attendance Allowance')
   ){
      req.session.data['partnerEASD'] = 'true';
   }

   if(benefits.includes('Carer\'s allowance') || benefits.includes('Carer support payment')){
      req.session.data['partnerCarers'] = 'true';
   }

   res.redirect("eligibility-partner-income-from-employment");

});

router.post('/'+ version +'/application/eligibility-partner-income-from-employment', function(req, res) {
   res.redirect("eligibility-route");
});



router.get('/'+ version +'/application/eligibility-route', function(req, res) {
   // this is used to logically determine if its a complex case
   if(req.session.data['canPerformEligibility'] == 'false'){
      res.redirect("eligibility-cya");
   }
   else{
      res.redirect("eligibility-calculate");
   }
});


router.get('/'+ version +'/application/eligibility-calculate', function(req, res) {
   // clear sessioon data
   req.session.data['standardamount'] = 0
   req.session.data['disregard'] = 0
   req.session.data['EASDamount'] = 0
   req.session.data['Carersamount'] = 0
   req.session.data['applicableamount'] = 0 

   // calculate standard amount
   if(req.session.data['hasPartner'] == 'Yes, we live together'){
      req.session.data['standardamount'] = '332.95'
      if(
         (req.session.data['claimantCarers'] == 'true'|| req.session.data['partnerCarers'] == 'true') 
         && (req.session.data['hasEmploymentIncome'] == 'Yes' || req.session.data['partnerHasEmploymentIncome'] == 'Yes'))
         {
            req.session.data['disregard'] = 20;
         }
         else{
            req.session.data['disregard'] = 10;
         }
   }
   else{
      req.session.data['standardamount'] = '218.15'
      req.session.data['disregard'] = 5;
   }

   // add any EASD
   if(req.session.data['claimantEASD'] == 'true'){
      req.session.data['EASDamount'] = parseFloat(req.session.data['EASDamount']) + 81.50;
   }
   if(req.session.data['partnerEASD'] == 'true'){
      req.session.data['EASDamount'] = parseFloat(req.session.data['EASDamount']) + 81.50;
   }

   // add any Carers Premium
   if(req.session.data['claimantCarers'] == 'true'){
      req.session.data['Carersamount'] = parseFloat(req.session.data['Carersamount']) + 45.60;
   }

   if(req.session.data['partnerCarers'] == 'true'){
      req.session.data['Carersamount'] = parseFloat(req.session.data['Carersamount']) + 45.60;
   }

   // calculate applicable amount
   let applicable = parseFloat(req.session.data['standardamount']) + parseFloat(req.session.data['EASDamount']) + parseFloat(req.session.data['Carersamount']);
   req.session.data['applicableamount'] = applicable.toFixed(2)

   // Perform weekly to monthly convertion
   let monthlyapplicable = ((req.session.data['disregard']+applicable) * 52)/12;

   // Round up to nearest pound
   req.session.data['monthlyapplicableamount'] = Math.ceil(monthlyapplicable)

   res.redirect("eligibility-income")
});

router.post('/'+ version +'/application/eligibility-income', function(req, res) { 
   res.redirect("eligibility-CYA")
});

router.post('/'+ version +'/application/eligibility-CYA', function(req, res) { 
   if(req.session.data['incomeAmount']=='less than'){
      res.redirect("eligibility-successful")
   }
   else if(req.session.data['incomeAmount']=='more than'){
      res.redirect("eligibility-unsuccessful")
   }
   else{
      res.redirect("eligibility-not-enough-data")
   }
});

router.post('/'+ version +'/application/eligibility-housing-benefit', function(req, res) { 
   if(req.session.data['hasHousingBenefit'] == 'Yes'){
      res.redirect("eligibility-benefits-partner")
   }
   else{
      res.redirect("eligibility-both-too-young")
   }
});

