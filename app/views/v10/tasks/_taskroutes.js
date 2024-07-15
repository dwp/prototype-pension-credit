const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

var version = "v10";

router.get('/'+version+'/tasks/randomise', function(req, res) {
    //clears the data for the tasklist to ensure a fresh task each time
    req.session.data['BankDetails'] = '';
    req.session.data['OtherApplications'] = '';
    req.session.data['PersonalDetails'] = '';
    req.session.data['Benefits'] = '';
    req.session.data['BenefitInterests'] = '';
    req.session.data['ReceivingBenefits'] = '';
    req.session.data['NonDependents'] = '';
    req.session.data['online'] = '';
    req.session.data['telephone'] = '';
    req.session.data['paper'] = '';
    req.session.data['IDOC'] = '';
    req.session.data['pension1Complete'] = '';
    req.session.data['pension2Complete'] = '';
    req.session.data['pension3Complete'] = '';
    req.session.data['TaskSuccess'] = 'yes';
    
    
    //this randomises whether we display nil or pay award first
    // whichever displays first, the opposite will display second and then they keep alternating
    if(req.session.data['taskType']){
        if(req.session.data['taskType']=='pay'){
            req.session.data['taskType'] = 'nil'
        }
        else{
            req.session.data['taskType'] = 'pay'
        }
    }
    else{
        var random = Math.floor((Math.random() * 2) + 1);
        if(random > 1){
            req.session.data['taskType'] = 'nil'
        }
        else{
            req.session.data['taskType'] = 'pay'
        }
        
    }

    // array to switch month from an integer to a real name
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // this creates the backdating period date
    // today minus 88 days (backdating is 3 months)
    var date = new Date(); //get todays date
    var last = new Date(date.getTime() - (90 * 24 * 60 * 60 * 1000)); //backdating period start date

    // this creates the pansion payment dates
    var pension1 = new Date(date.getTime() - (29 * 24 * 60 * 60 * 1000)); //pension dates
    var pension2 = new Date(pension1.getTime() - (30 * 24 * 60 * 60 * 1000));
    var pension3 = new Date(pension2.getTime() - (31 * 24 * 60 * 60 * 1000));
    var pension4 = new Date(pension3.getTime() - (30 * 24 * 60 * 60 * 1000));
    var pension5 = new Date(pension4.getTime() - (30 * 24 * 60 * 60 * 1000));
    var pension6 = new Date(pension5.getTime() - (29 * 24 * 60 * 60 * 1000));

    // this writes all the calculated dates, in a usable format, to sesssions to use on the prototype screens
    req.session.data['backdatingDate'] = last.getDate() + ' ' + monthNames[last.getMonth()] + ' ' + last.getFullYear();
    req.session.data['claimSubmittedDate'] = last.getDate() + ' ' + monthNames[date.getMonth()]+ ' ' + date.getFullYear();
    req.session.data['pension1'] = pension1.getDate() + ' ' + monthNames[pension1.getMonth()] + ' ' + pension1.getFullYear();
    req.session.data['pension2'] = pension2.getDate() + ' ' + monthNames[pension2.getMonth()] + ' ' + pension2.getFullYear();
    req.session.data['pension3'] = pension3.getDate() + ' ' + monthNames[pension3.getMonth()] + ' ' + pension3.getFullYear();
    req.session.data['pension4'] = pension4.getDate() + ' ' + monthNames[pension4.getMonth()] + ' ' + pension4.getFullYear();
    req.session.data['pension5'] = pension5.getDate() + ' ' + monthNames[pension5.getMonth()] + ' ' + pension5.getFullYear();
    req.session.data['pension6'] = pension6.getDate() + ' ' + monthNames[pension6.getMonth()] + ' ' + pension6.getFullYear();

    // this resets the success banner on the task selection screen
    req.session.data['TaskSuccess'] = 'no';
    req.session.data['SuspendClaim'] = '';

    //this creates the data for pension3
    req.session.data['scenario3-pension1-net'] = "350";
    req.session.data['scenario3-pension1-selected'] = "Yes";
    req.session.data['scenario3-pension2-net'] = "320";
    req.session.data['scenario3-pension2-selected'] = "Yes";
    req.session.data['scenario3-pension3-net'] = "300";
    req.session.data['scenario3-pension3-selected'] = "No";
    req.session.data['scenario3-pension4-net'] = "300";
    req.session.data['scenario3-pension4-selected'] = "No";
    req.session.data['scenario3-pension5-net']= "300";
    req.session.data['scenario3-pension5-selected'] = "No";
    req.session.data['scenario3-pension6-net'] = "300";
    req.session.data['scenario3-pension6-selected'] = "No";
    req.session.data['scenario3-pension-average'] = "335";

    res.redirect("/"+version+"/tasks/tasklist")
});

router.get('/'+ version + '/tasks/tasklist', function(req, res) {
    req.session.data['TaskSuccess'] = 'no';
    res.render(version + "/tasks/tasklist");
});


router.post('/' + version + '/tasks/bank-name', function(req, res) {
    if(req.session.data['BankDetails'] == 'yes') {
        // KEEP THIS IS AS ITS BOUND TO CHANGE AGAIN!
        // if(req.session.data['taskType'] == "pay"){
        //     res.redirect("bank-encashed")
        // }
        // else{
         res.redirect("tasklist")
        // }
    } 
    else{
        res.redirect("dropout")
    }
});

router.post('/' + version + '/tasks/bank-encashed', function(req, res) {
    res.redirect("tasklist")
});

router.post('/' + version + '/tasks/other-applications', function(req, res) {
    // if(req.session.data['telephone']=='yes' && req.session.data['IDOC']=='yes' && req.session.data['online']=='yes'&& req.session.data['paper']=='yes'){
    //     req.session.data['OtherApplicationError'] = 'false';
        if(req.session.data['OtherApplications'] == 'yes') {
            res.redirect("dropout")
        } 
        else{
            res.redirect("tasklist")
        }
    // }
    // else{
    //     req.session.data['OtherApplicationError'] = 'true';
    //     res.redirect("other-applications")
    // }
});

router.post('/' + version + '/tasks/personal-details', function(req, res) {
    if(req.session.data['taskType']=='pay')
        if(req.session.data['PersonalDetails'] == 'yes') {
            res.redirect("non-dependents")
        } 
        else{
            res.redirect("dropout")
        }
    else{
        if(req.session.data['PersonalDetails'] == 'yes') {
            res.redirect("benefits")
        } 
        else{
            res.redirect("dropout")
        }
    }
});

router.post('/' + version + '/tasks/benefits', function(req, res) {
    if(req.session.data['BenefitInterests'] == 'no' ){
        req.session.data['Benefits'] = 'no'
        if(req.session.data['taskType']=='nil'){
            res.redirect("tasklist")
        }
        else{
            res.redirect("non-dependents")
        }
        
    } 
    else{
        res.redirect("dropout")
    }
});

router.post('/' + version + '/tasks/non-dependents', function(req, res) {
    if(req.session.data['NonDependents'] == 'yes') {
        res.redirect("tasklist")
    } 
    else{
        res.redirect("dropout")
    }
});

router.post('/' + version + '/tasks/nationality', function(req, res) {
    if(req.session.data['nationalityCheck'] == 'Something else') {
        res.redirect("confirm-nationality")
    } 
    else{
        res.redirect("nationality-auto")
    }
});

router.post('/' + version + '/tasks/confirm-nationality', function(req, res) {
    if(req.session.data['confirmNationality'] == 'yes') {
        res.redirect("immigration-status")
    } 
    else{
        res.redirect("dropout")
    }
});

router.post('/' + version + '/tasks/immigration-status', function(req, res) {
    if(req.session.data['recourseToPublicFunds'] == 'yes' && req.session.data['leaveToRemain'] == 'yes') {
        res.redirect("nationality-auto")
    } 
    else{
        res.redirect("dropout")
    }
});

router.post('/' + version + '/tasks/nationality-auto', function(req, res) {
    
    req.session.data['NationalityTask'] = 'yes'
    res.redirect("tasklist")
    
});

router.post('/' + version + '/tasks/cold-weather-payments', function(req, res) {
    if(req.session.data['ColdWeather'] == 'no') {
        res.redirect("tasklist")
    } 
    else{
        res.redirect("dropout")
    }
});

router.post('/' + version + '/tasks/pension1', function(req, res) {
    if(req.session.data['pension1Complete'] == 'yes') {
        if(req.session.data['pension3Complete'] == 'yes' && req.session.data['pension2Complete']){
            res.redirect("tasklist")
        }
        else if(req.session.data['pension2Complete']){
            res.redirect("pension3")
        }
        else{
            res.redirect("pension2")
        }
    } 
    else{
        res.redirect("dropout")
    }
});

router.post('/' + version + '/tasks/pension2', function(req, res) {
    if(req.session.data['pension1Complete'] == 'yes' && req.session.data['pension3Complete'] == 'yes'){
        res.redirect("tasklist")
    }
    else if(req.session.data['pension1Complete'] == 'yes'){
        res.redirect("pension3")
    }
    else{
        res.redirect("pension1")
    }
});

router.post('/' + version + '/tasks/pension3', function(req, res) {
    if(req.session.data['pension3Complete'] == 'yes') {
        if(req.session.data['pension1Complete'] == 'yes' && req.session.data['pension2Complete']){
            res.redirect("tasklist")
        }
        else if(req.session.data['pension2Complete']){
            res.redirect("pension1")
        }
        else{
            res.redirect("pension2")
        }
    } 
    else{
        res.redirect("pension3-choose-amounts")
    }
});

router.post('/' + version + '/tasks/pension3-choose-amounts', (req, res) => {
    var count = 0;
    var average = 0;
  
    if(req.session.data['scenario3-pension1-selected'] == 'Yes'){
      average +=  parseFloat(req.session.data['scenario3-pension1-net']);
      count++
    }
    else{
      req.session.data['scenario3-pension1-selected'] = 'No'
    }
  
    if(req.session.data['scenario3-pension2-selected'] == 'Yes'){
      average +=  parseFloat(req.session.data['scenario3-pension2-net']);
      count++
    }
    else{
      req.session.data['scenario3-pension2-selected'] = 'No'
    }
  
    if(req.session.data['scenario3-pension3-selected'] == 'Yes'){
      average +=  parseFloat(req.session.data['scenario3-pension3-net']);
      count++
    }
    else{
      req.session.data['scenario3-pension3-selected'] = 'No'
    }
  
    if(req.session.data['scenario3-pension4-selected'] == 'Yes'){
      average +=  parseFloat(req.session.data['scenario3-pension4-net']);
      count++
    }
    else{
      req.session.data['scenario3-pension4-selected'] = 'No'
    } 
  
    if(req.session.data['scenario3-pension5-selected'] == 'Yes'){
      average +=  parseFloat(req.session.data['scenario3-pension5-net']);
      count++
    }
    else{
      req.session.data['scenario3-pension5-selected'] = 'No'
    }
  
    if(req.session.data['scenario3-pension6-selected'] == 'Yes'){
      average += parseFloat(req.session.data['scenario3-pension6-net']);
      count++
    }
    else{
      req.session.data['scenario3-pension6-selected'] = 'No'
    }
  
  if(count > 1){
    req.session.data['scenario3-selection-error']= 'false'
    req.session.data['pension3Complete']= ''
    req.session.data['scenario3-pension-average'] = Math.round(average / count);
    res.redirect(`pension3`);
  }
  else{
    req.session.data['scenario3-selection-error']= 'true'
    res.redirect(`pension3-choose-amounts`);
  }
  
  })


router.post('/' + version + '/tasks/dropout', function(req, res) {
    // Reset all sessions
    req.session.data['BankDetails'] = '';
    req.session.data['BankEncashed'] = '';
    req.session.data['OtherApplications'] = '';
    req.session.data['PersonalDetails'] = '';
    req.session.data['Benefits'] = '';
    req.session.data['BenefitInterests'] = '';
    req.session.data['ReceivingBenefits'] = '';
    req.session.data['NonDependents'] = '';
    req.session.data['online'] = '';
    req.session.data['telephone'] = '';
    req.session.data['paper'] = '';
    req.session.data['IDOC'] = '';
    req.session.data['ColdWeather'] = '';
    req.session.data['pension1Complete'] = '';
    req.session.data['pension2Complete'] = '';
    req.session.data['pension3Complete'] = '';
    req.session.data['TaskSuccess'] = 'yes';
    res.redirect("../tasks");
});

router.post('/' + version + '/tasks/tasklist', function(req, res) {
    // Reset all sessions
    req.session.data['BankDetails'] = '';
    req.session.data['BankEncashed'] = '';
    req.session.data['OtherApplications'] = '';
    req.session.data['PersonalDetails'] = '';
    req.session.data['Benefits'] = '';
    req.session.data['BenefitInterests'] = '';
    req.session.data['ReceivingBenefits'] = '';
    req.session.data['NonDependents'] = '';
    req.session.data['online'] = '';
    req.session.data['telephone'] = '';
    req.session.data['paper'] = '';
    req.session.data['IDOC'] = '';
    req.session.data['ColdWeather'] = '';
    req.session.data['pension1Complete'] = '';
    req.session.data['pension2Complete'] = '';
    req.session.data['pension3Complete'] = '';
    req.session.data['TaskSuccess'] = 'yes';
    res.redirect("../tasks");
});

