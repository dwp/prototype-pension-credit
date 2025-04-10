const govukPrototypeKit = require('govuk-prototype-kit');
const router = govukPrototypeKit.requests.setupRouter();

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SPa_Boundry_Start = new Date(Date.parse('06 April 1951 00:00:00 GMT'))
const SPa_Boundry_End = new Date(Date.parse('06 April 1953 00:00:00 GMT'))

var date = new Date(); //get todays date

function createBackdatingDate() {
   var backdateDate = new Date()
   backdateDate.setMonth(backdateDate.getMonth() - 3)
   return backdateDate
 }

var version = "v18";

router.get('/', function(req, res) {
   req.session.data['backdateDateString'] = createBackdatingDate()
   res.render('/index')
});



// Identifying backdating date
router.post('/'+ version +'/application/backdating-date-select', function(req, res) {
   if(req.session.data['HospitalStays']=="Yes"){
      res.redirect("hospital-still")
   }
   else{
      res.redirect("backdating-date")
   }
 });

 router.post('/'+ version +'/application/backdating-date-select', function(req, res) {
   if(req.session.data['standardBackdating']=="Yes"){
      res.redirect("national-insurance-number")
   }
   else{
      res.redirect("backdating-date")
   }
 });

 router.post('/'+ version +'/application/backdating-date', function(req, res) {
   res.redirect("national-insurance-number")
 });
