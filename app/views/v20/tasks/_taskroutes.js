const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

var version = "v20";
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


router.get('/'+version+'/tasks/randomise', function(req, res) {
    //clears the data for the tasklist to ensure a fresh task each time
    req.session.data['bankSort'] = '';
    req.session.data['bankAccount'] = '';
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
    // if(req.session.data['taskType']){
    //     if(req.session.data['taskType']=='pay'){
    //         req.session.data['taskType'] = 'nil'
    //     }
    //     else{
    //         req.session.data['taskType'] = 'pay'
    //     }
    // }
    // else{
    //     var random = Math.floor((Math.random() * 2) + 1);
    //     if(random > 1){
    //         req.session.data['taskType'] = 'nil'
    //     }
    //     else{
    //         req.session.data['taskType'] = 'pay'
    //     }

    // }

    // array to switch month from an integer to a real name
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // this creates the backdating period date
    // today minus 88 days (backdating is 3 months)
    var date = new Date(); //get todays date
    var last = new Date(date.getTime() - (90 * 24 * 60 * 60 * 1000)); //backdating period start date

    // this writes all the calculated dates, in a usable format, to sesssions to use on the prototype screens
    req.session.data['backdatingDate'] = last.getDate() + ' ' + monthNames[last.getMonth()] + ' ' + last.getFullYear();
    req.session.data['claimSubmittedDate'] = last.getDate() + ' ' + monthNames[date.getMonth()]+ ' ' + date.getFullYear();

    res.redirect("/"+version+"/tasks/tasklist")
});

router.get('/'+ version + '/tasks/tasklist', function(req, res) {
    req.session.data['TaskSuccess'] = 'no';
    res.render(version + "/tasks/tasklist");
});


router.post('/' + version + '/tasks/bank-name', function(req, res) {
    if(req.session.data['bankSort'] == 'yes' && req.session.data['bankAccount'] == 'yes'  ) {
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
    if(req.session.data['NonDependents'] == 'no') {
        res.redirect("nationality")
    }
    else{
        res.redirect("dropout")
    }
});

router.post('/' + version + '/tasks/nationality', function(req, res) {
    //get six month date
    var immigrationDate = new Date()
    immigrationDate.setMonth(immigrationDate.getMonth() - 6)
   var immigrationDateString = immigrationDate.getDate() + " " + months[immigrationDate.getDay()-1] + " " + immigrationDate.getFullYear()
   req.session.data['immigrationDateString'] = immigrationDateString

    if(req.session.data['nationalityCheck'] == 'Something else') {
        res.redirect("confirm-nationality")
    }
    else{
        res.redirect("past-presence")
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
        res.redirect("past-presence")
    }
    else{
        res.redirect("dropout")
    }
});

router.post('/' + version + '/tasks/past-presence', function(req, res) {
    if(req.session.data['pastPresence'] == 'no' ){
        req.session.data['NationalityTask'] = 'yes';
        res.redirect("tasklist")
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
    res.redirect("tasklist")
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
    req.session.data['bankSort'] = '';
    req.session.data['bankAccount'] = '';
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
    req.session.data['NationalityTask'] = '';
    req.session.data['pastPresence'] = '';
    req.session.data['TaskSuccess'] = 'yes';
    res.redirect("../tasks");
});

router.post('/' + version + '/tasks/tasklist', function(req, res) {
    // Reset all sessions
    req.session.data['bankSort'] = '';
    req.session.data['bankAccount'] = '';
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
    req.session.data['NationalityTask'] = '';
    req.session.data['pastPresence'] = '';
    req.session.data['TaskSuccess'] = 'yes';
    res.redirect("../tasks");
});

router.get('/'+version+'/tasks/pension-view-provider', function(req, res) {
    let tempArray = req.session.data.realpensions.data.citizen.pensionAccounts[req.session.data.pensionCount]
    req.session.data['numberOfPensionProviders'] = req.session.data.realpensions.data.citizen.pensionAccounts.length
    req.session.data['pensionsUsedLength'] = 0;
    res.render(version + "/tasks/pension-view-provider");
});


function scheduleConvert(x) {
    switch(x) {
        case "weekly":
        return "W1"
        break;
        case "fortnightly":
        return "W2"
        break;
        case "4 weekly":
        return "W4"
        break;
        case "monthly":
        return "M1"
        break;
        case "quarterly":
        return "M3"
        break;
        case "bi-annually":
        return "M6"
        break;
        case "annually":
        return "MA"
        break;
        case "one off":
        return "IO"
        break;
        case "irregular":
        return "IR"
        break;
        default:
        return "something else"
    }
}
router.post('/' + version + '/tasks/pension-view-provider', function(req, res) {
    if(req.session.data['pensionSplit'] == 'no'){
        if(req.session.data['numberOfPensionProviders'] != (parseInt(req.session.data['pensionCount'])+1)){
            req.session.data['pensionCount'] = parseInt(req.session.data['pensionCount'])+1
            res.redirect('pension-view-provider')
        }
        else{
            res.redirect('pension-confirm-provider')
        }
    }
    // INVESTIGATION NEEDED
    else if(req.session.data['pensionSplit'] == 'investigation'){
        let tempArray = []
        if(req.session.data['investigationArray']){
            tempArray = req.session.data['investigationArray']
        }
        let pensionName = req.session.data.realpensions.data.citizen.pensionAccounts[req.session.data.pensionCount].pensionProviderPayeScheme.pensionProviderName1
        if(req.session.data.realpensions.data.citizen.pensionAccounts[req.session.data.pensionCount].pensionProviderPayeScheme.pensionProviderName2){
            pensionName = pensionName + ' ' + req.session.data.realpensions.data.citizen.pensionAccounts[req.session.data.pensionCount].pensionProviderPayeScheme.pensionProviderName2
        }
        let tempString = req.session.data['pension'][0].substring(0, 10)
        let tempObject = {'provider': pensionName, 'date': tempString, 'amount': req.session.data.currentPensionAverage, 'frequency': req.session.data.currentFrequency}
        tempArray.push(tempObject)
        req.session.data['investigationArray'] = tempArray

        let tempCount = parseInt(req.session.data.pensionCount)
        req.session.data.pensionCount = tempCount + 1

        if(req.session.data.pensionCount < req.session.data.numberOfPensionProviders){
            res.redirect('pension-view-provider')
        }
        else{
            res.redirect('pension-add-another')
        }
    }
    else if(req.session.data['pensionSplit'] == 'cam'){
        res.redirect('dropout')
    }
    else if(req.session.data['pensionSplit'] == 'no'){
        req.session.data['pensionCount'] = parseInt(req.session.data.pensionCount)+1
        res.redirect('pension-view-provider')
    }
    else{
        res.redirect('pension-select-provider')
    }

});

router.post('/' + version + '/tasks/pension-select-provider', function(req, res) {

    let pensionSplitCount;


    if(req.session.data.pensionSplitCount){
        pensionSplitCount =  req.session.data.pensionSplitCount + 1
    }
    else{
        pensionSplitCount = 1
    }

    req.session.data.pensionSplitCount = pensionSplitCount

    let pensionArray = req.session.data.pension
    let tempArray= []

    for (let i = 0; i < req.session.data.pension.length; i++) {
        tempArray.push(req.session.data.pension[i]);
    }
    req.session.data['pensionSplit'+pensionSplitCount] = tempArray


    let compareArray= []

    for (let i = 0; i < 6; i++) {

        compareArray.push(
            req.session.data.realpensions.data.citizen.pensionAccounts[req.session.data.pensionCount].pensionIncome[i].paymentDate
            +" "+
            (req.session.data.realpensions.data.citizen.pensionAccounts[req.session.data.pensionCount].pensionIncome[i].taxablePayInPeriod - req.session.data.realpensions.data.citizen.pensionAccounts[req.session.data.pensionCount].pensionIncome[i].taxDeductedOrRefunded)
            +" "+
            req.session.data.realpensions.data.citizen.pensionAccounts[req.session.data.pensionCount].pensionIncome[i].payFrequency
        )
    }
    req.session.data['compareArray'] = compareArray


    tempArray = req.session.data['pensionSplit'+req.session.data.pensionSplitCount]
    let tempArray2 = []
    let tempAverage = 0
    let tempFrequency = ""

    for (let i = 0; i < tempArray.length; i++) {
        let x = tempArray[i].split(" ")
        tempArray2.push(x[1])
        tempAverage += parseFloat(x[1])
        tempFrequency = x[2]
    }

    req.session.data['currentPensionAverage'] = (tempAverage / tempArray2.length)
    req.session.data['currentFrequency'] = tempFrequency

    res.redirect('pension-confirm-provider')
});


router.post('/'+version+'/tasks/pension-confirm-provider', function(req, res) {
    if(req.session.data.currentValue == 'yes'){

        //create the array of objects
        let tempArray = []
        let tempObject = {}

        if(req.session.data['confirmedPensions']){
            tempArray = req.session.data['confirmedPensions']
        }

        let tempProviderName = req.session.data.realpensions.data.citizen.pensionAccounts[req.session.data['pensionCount']].pensionProviderPayeScheme.pensionProviderName1

        if(req.session.data.realpensions.data.citizen.pensionAccounts[req.session.data['pensionCount']].pensionProviderPayeScheme.pensionProviderName2){
            tempProviderName += " "+req.session.data.realpensions.data.citizen.pensionAccounts[req.session.data['pensionCount']].pensionProviderPayeScheme.pensionProviderName2
        }

        tempObject = {'provider': tempProviderName, 'amount': req.session.data.currentPensionAverage, 'frequency': req.session.data.currentFrequency}
        tempArray.push(tempObject)

        req.session.data['confirmedPensions'] = tempArray

        //check if we need to loop back
            //this involves
            // checking to see if defined more than 1
            // checking to see count of data pesions used is more less than 5
                //if its 5 then only dispay confirm screen

        if(req.session.data['pensionSplit'] == 1){
            if(req.session.data.numberOfPensionProviders != (parseInt(req.session.data['pensionCount'])+1)){
                req.session.data.pensionCount =  (parseInt(req.session.data['pensionCount'])+1)
                req.session.data.pensionSplit = 0
                req.session.data.pensionsUsedLength = 0
                res.redirect('pension-view-provider')
            }
            else{
                res.redirect('pension-add-another')
            }
        }
        else if(req.session.data.pensionSplit == 'more'){

            let usedArray = [];

            if(req.session.data['pensionsUsed']){
                usedArray = req.session.data['pensionsUsed']
            }

            let tempArray2 = req.session.data['pensionSplit'+ req.session.data.pensionSplitCount]

            for (let i = 0; i < tempArray2.length; i++) {
                usedArray.push(tempArray2[i])
            }

            req.session.data['pensionsUsed'] = usedArray
            req.session.data['pensionsUsedLength'] = req.session.data['pensionsUsed'].length


            if(usedArray.length == 5){
                let differentialArray = req.session.data['compareArray'].filter((e) => !req.session.data['pensionsUsed'].includes(e));
                req.session.data['pension'] = differentialArray
                req.session.data.pensionSplitCount = req.session.data.pensionSplitCount + 1
                req.session.data['pensionSplit'+ req.session.data.pensionSplitCount] = differentialArray;
                let a = differentialArray.toString();
                let b = a.split(" ")
                req.session.data['currentPensionAverage'] = b[1]
                req.session.data['currentFrequency'] = b[2]
                res.redirect('pension-confirm-provider')
            }
            else if(usedArray.length > 5){
                if(req.session.data['numberOfPensionProviders'] != (parseInt(req.session.data['pensionCount'])+1)){
                    req.session.data.pensionCount =  (parseInt(req.session.data['pensionCount'])+1)
                    req.session.data.pensionSplitCount = 0
                    req.session.data.pensionSplit = null
                    req.session.data.pensionSplit1 = null
                    req.session.data.pensionSplit2 = null
                    req.session.data.pensionSplit3 = null
                    req.session.data.pensionSplit4 = null
                    req.session.data.pensionSplit5 = null
                    req.session.data.pensionsUsed = null
                    req.session.data.pensionUsedLength = null
                    res.redirect('pension-view-provider')
                }
                else{
                    req.session.data.pensionSplitCount = 0
                    req.session.data.pensionSplit1 = null
                    req.session.data.pensionSplit2 = null
                    req.session.data.pensionSplit3 = null
                    req.session.data.pensionSplit4 = null
                    req.session.data.pensionSplit5 = null
                    req.session.data.pensionsUsed = null
                    req.session.data.pensionUsedLength = null
                    res.redirect('pension-add-another')
                }
            }
            else{
                res.redirect('pension-select-provider')
            }
        }

    }
    else if(req.session.data.currentValue == 'investigation'){

        let usedArray = [];

        if(req.session.data['pensionsUsed']){
            usedArray = req.session.data['pensionsUsed']
        }

        let tempArray2 = req.session.data['pensionSplit'+ req.session.data.pensionSplitCount]

        for (let i = 0; i < tempArray2.length; i++) {
            usedArray.push(tempArray2[i])
        }

        req.session.data['pensionsUsed'] = usedArray
        req.session.data['pensionsUsedLength'] = req.session.data['pensionsUsed'].length


        let tempArray = []
        if(req.session.data['investigationArray']){
            tempArray = req.session.data['investigationArray']
        }
        let pensionName = req.session.data.realpensions.data.citizen.pensionAccounts[req.session.data.pensionCount].pensionProviderPayeScheme.pensionProviderName1
        if(req.session.data.realpensions.data.citizen.pensionAccounts[req.session.data.pensionCount].pensionProviderPayeScheme.pensionProviderName2){
            pensionName = pensionName + ' ' + req.session.data.realpensions.data.citizen.pensionAccounts[req.session.data.pensionCount].pensionProviderPayeScheme.pensionProviderName2
        }

        let tempString = req.session.data['pension'][0].substring(0, 10)
        let tempObject = {'provider': pensionName, 'date': tempString, 'amount': req.session.data.currentPensionAverage, 'frequency': req.session.data.currentFrequency}
        tempArray.push(tempObject)
        req.session.data['investigationArray'] = tempArray

        if(req.session.data.pensionsUsedLength < 5 ){
            res.redirect('pension-select-provider')
        }
        else{
            if(parseInt(req.session.data['pensionCount'] +1) >= parseInt(req.session.data['numberOfPensionProviders'])){
                req.session.data.pensionSplitCount = 0
                req.session.data.pensionSplit1 = null
                req.session.data.pensionSplit2 = null
                req.session.data.pensionSplit3 = null
                req.session.data.pensionSplit4 = null
                req.session.data.pensionSplit5 = null
                req.session.data.pensionsUsed = null
                req.session.data.pensionUsedLength = null
                res.redirect('pension-add-another')
            }
            else{
                req.session.data.pensionCount =  (parseInt(req.session.data['pensionCount'])+1)
                    req.session.data.pensionSplitCount = 0
                    req.session.data.pensionSplit = null
                    req.session.data.pensionSplit1 = null
                    req.session.data.pensionSplit2 = null
                    req.session.data.pensionSplit3 = null
                    req.session.data.pensionSplit4 = null
                    req.session.data.pensionSplit5 = null
                    req.session.data.pensionsUsed = null
                    req.session.data.pensionUsedLength = null
                    res.redirect('pension-select-provider')
            }

        }

    }
});


router.post('/'+version+'/tasks/pension-add-another', function(req, res) {
    if(req.session.data['investigationArray'].length>0){
        req.session.data['pensionComplete'] = 'incomplete'
    }
    else{
        req.session.data['pensionComplete'] = 'yes'
    }
    res.redirect('tasklist')
});

router.post('/'+version+'/tasks/pension-confirm-complete', function(req, res) {
    if(req.session.data['contactApplicant'] == 'yes'){
        req.session.data['pensionComplete'] = 'incomplete'
        res.redirect('pension-contact-choose')
    }
    else if(req.session.data['contactApplicant'] == 'no'){
        req.session.data['pensionComplete'] = 'yes'
        res.redirect('tasklist')
    }
});

router.post('/'+version+'/tasks/pension-contact-choose', function(req, res) {
    res.redirect('tasklist')
});

router.post('/'+version+'/tasks/pension-revisit-provider', function(req, res) {
 if(req.session.data.revisit == 'no'){
    let index = parseInt(req.session.data.tempIndex)
    tempArray = req.session.data.investigationArray
    tempArray.splice(index, index+1)
    req.session.data.investigationArray = tempArray
    res.redirect('pension-add-another')
 }
 else{
    res.redirect('pension-revisit-manual-entry')
 }
});


router.post('/'+version+'/tasks/pension-revisit-manual-entry', function(req, res) {
    let tempArray = req.session.data.confirmedPensions
    let tempObject = req.session.data.investigationArray[req.session.data.tempIndex]

    let tempObject2 = {'provider': tempObject.provider, 'amount': req.session.data['currentPensionAverage'], 'frequency': req.session.data['currentFrequency']}
    tempArray.push(tempObject2)
    req.session.data.confirmedPensions = tempArray

    let index = parseInt(req.session.data.tempIndex)
    tempArray = req.session.data.investigationArray
    tempArray.splice(index, index+1)
    req.session.data.investigationArray = tempArray

    if(req.session.data['investigationArray']){
        req.session.data['pensionComplete'] == 'incomplete'
    }
    else{
        req.session.data['pensionComplete'] == 'yes'
    }

    res.redirect('pension-add-another')

});

router.post('/'+version+'/tasks/pension-manual-entry', function(req, res) {

    if(req.session.data['button'] == 'investigation'){
        //if needs investigation
        let tempArray = []
        if(req.session.data['investigationArray']){
            tempArray = req.session.data['investigationArray']
        }
        let tempObject = {'provider': req.session.data.tempProviderName.toUpperCase(), 'date': null, 'amount': req.session.data.currentPensionAverage, 'frequency': req.session.data.currentFrequency}
        tempArray.push(tempObject)
        req.session.data['investigationArray'] = tempArray
    }
    else{
        // if confirmed
        //create the array of objects
        let tempArray = []
        let tempObject = {}

        if(req.session.data['confirmedPensions']){
            tempArray = req.session.data['confirmedPensions']
        }

        tempObject = {'provider': req.session.data.tempProviderName.toUpperCase(), 'amount': req.session.data.currentPensionAverage, 'frequency': req.session.data.currentFrequency}
        tempArray.push(tempObject)

        req.session.data['confirmedPensions'] = tempArray
    }
    res.redirect('pension-add-another')
});

router.post('/'+version+'/tasks/pension-confirm-restart', function(req, res) {
    if(req.session.data['restartTask'] == 'yes'){
        req.session.data['numberOfPensionProviders'] = 2
        req.session.data['pensionCount'] = 0
        req.session.data['pension'] = null
        req.session.data['compareArray'] = null
        req.session.data['currentPensionAverage'] = null
        req.session.data['currentFrequency'] = null
        req.session.data['currentValue'] = null
        req.session.data['confirmedPensions'] = null
        req.session.data['pensionsUsedLength'] = null
        req.session.data['investigationArray'] = null
        res.redirect('pension-view-provider')
    }
    else{
        res.redirect('pension-add-another')
    }
});

router.post('/'+version+'/tasks/contact-claimant', function(req, res) {
    if(req.session.data['telephoneIDV'] == 'no'){
        res.redirect('contact-security-failed')
    }
    else if(req.session.data['telephoneIDV'] == 'yes'){
        res.redirect('contact-claimant-information-needed')
    }
    else if(req.session.data['telephoneIDV'] == 'no-answer'){
        res.redirect('contact-claimant-sms')
    }
});

router.post('/'+version+'/tasks/contact-security-failed', function(req, res) {
    let temporaryArray = []; // creates a temporary array
    if(req.session.data['timelineArray']){
      temporaryArray = req.session.data['timelineArray'] //checks to see if we already have objects in the timelineArray
    }
    let personArray = ["John Jones", "Alice Webb", "Sandra Dean", "Stuart Rith"]; // This creates an array of names to use later
    let random = Math.floor(Math.random() * personArray.length); // This is a random number generatot. It will create a random number between 1 and the number of names in the above array

    // just setting up some variables to use in the object
    let title = "Call to the applicant security failed"
    let date = new Date(); //this gets the current timestamp
    let reason = "<p><strong>First failed question</strong><br>" + req.session.data['security-question-1'] + "</p><p><strong>Second failed question</strong><br>" + req.session.data['security-question-2'] + "</p>";

    // now we create the obkect
    let temporaryObject = {date: date, title: title, person: personArray[random], reason: reason}

    // add the object to the array
    temporaryArray.unshift(temporaryObject); // unshift add it to the beginning of the array so we keep this in reverse chronilogical order
    req.session.data['timelineArray'] =  temporaryArray; // next we store the array of objects into a session to use in the timeline

    res.redirect('tasklist')
});

router.post('/'+version+'/tasks/contact-claimant-sms', function(req, res) {
    let temporaryArray = []; // creates a temporary array
    if(req.session.data['timelineArray']){
      temporaryArray = req.session.data['timelineArray'] //checks to see if we already have objects in the timelineArray
    }

    // just setting up some variables to use in the object
    let title = "The applicant was sent a contact text"
    let date = new Date(); //this gets the current timestamp
    let reason = req.session.data['textMessage'];

    // now we create the obkect
    let temporaryObject = {date: date, title: title, person: "John Jones", reason: reason}

    // add the object to the array
    temporaryArray.unshift(temporaryObject); // unshift add it to the beginning of the array so we keep this in reverse chronilogical order
    req.session.data['timelineArray'] =  temporaryArray; // next we store the array of objects into a session to use in the timeline

    res.redirect('tasklist')
});

router.post('/'+version+'/tasks/postpone-task', function(req, res) {
    let temporaryArray = []; // creates a temporary array
    if(req.session.data['timelineArray']){
      temporaryArray = req.session.data['timelineArray'] //checks to see if we already have objects in the timelineArray
    }

    // just setting up some variables to use in the object
    let title = "Task postponed"
    let date = new Date(); //this gets the current timestamp
    let reason;

    // now we create the obkect
    let temporaryObject = {date: date, title: title, person: "John Jones", reason: reason}

    // add the object to the array
    temporaryArray.unshift(temporaryObject); // unshift add it to the beginning of the array so we keep this in reverse chronilogical order
    req.session.data['timelineArray'] =  temporaryArray; // next we store the array of objects into a session to use in the timeline

    req.session.data['taskPostponed'] = 'yes'
    res.redirect('../tasks')
});

router.post('/timeline', function(req, res) {
    let temporaryArray = []; // creates a temporary array
    if(req.session.data['timelineArray']){
      temporaryArray = req.session.data['timelineArray'] //checks to see if we already have objects in the timelineArray
    }
    // just setting up some variables to use in the object
    let title;
    let date = new Date(); //this gets the current timestamp
    let reason;

    // now we create the obkect
    let temporaryObject = {date: date, title: title, person: "John Jones", reason: reason}

    // add the object to the array
    temporaryArray.unshift(temporaryObject); // unshift add it to the beginning of the array so we keep this in reverse chronilogical order
    req.session.data['timelineArray'] =  temporaryArray; // next we store the array of objects into a session to use in the timeline

    req.session.data['successBanner'] = 'true';
    res.redirect("payment")
});
