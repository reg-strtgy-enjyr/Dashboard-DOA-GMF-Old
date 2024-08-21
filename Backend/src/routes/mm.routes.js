//const passport = require('passport');
const express = require('express');
const router = express.Router();
const mmController = require('../controllers/mm.controllers');

/*
    Swagger Docs on mm.controllers.js
*/
router.post('/login', mmController.login);

/*
    Swagger Docs on mm.controllers.js
*/
router.post('/addAccount', mmController.addAccount);

/*
    Swagger Docs on mm.controllers.js
*/
router.post('/updatePassword', mmController.updatePassword);

/*
    Swagger Docs on mm.controllers.js
*/
router.post('/showAccount', mmController.showAccount);

/*
    Swagger Docs on mm.controllers.js
*/
router.get('/showAllAccount', mmController.showAllAccount);

/*
    Swagger Docs on mm.controllers.js
*/
router.delete('/deleteAccount', mmController.deleteAccount);

/*
    Swagger Docs on mm.controllers.js
*/
router.post('/addAuditPlan', mmController.addAuditPlan);

/*
    Swagger Docs on mm.controllers.js
*/
router.delete('/deleteAuditPlan', mmController.deleteAuditPlan);

/*
    Swagger Docs on mm.controllers.js
*/
router.put('/updateAuditPlan', mmController.UpdateAuditPlan);

/*
    Swagger Docs on mm.controllers.js
*/
router.get('/showAuditPlanACC', mmController.showAuditPlanACC);

/*
    Swagger Docs on mm.controllers.js
*/
router.post('/addAPdetail', mmController.addAPdetail);

/*
    Swagger Docs on mm.controllers.js
*/
router.get('/showAPdetail', mmController.showAPdetail);

/*
    Swagger Docs on mm.controllers.js
*/
router.put('/updateAPdetail', mmController.UpdateAPdetail);

/*
    Swagger Docs on mm.controllers.js
*/
router.post('/addIssuence', mmController.addIssuence);

/*
    Swagger Docs on mm.controllers.js
*/
router.put('/updateaddIssuence', mmController.UpdateAddIssuence);

/*
    Swagger Docs on mm.controllers.js
*/
router.get('/showIssuence', mmController.showIssuence);

/*
    Swagger Docs on mm.controllers.js
*/
router.post('/addOccurrence', mmController.addOccurrence);

/*
    Swagger Docs on mm.controllers.js
*/
router.get('/showOccurrence', mmController.showOccurrence);

/*
    Swagger Docs on mm.controllers.js
*/
router.get('/showOccurrenceAll', mmController.showOccurrenceAll);

/*
    Swagger Docs on mm.controllers.js
*/
router.post('/searchIOR', mmController.searchIOR);

/*
    Swagger Docs on mm.controllers.js
*/
router.put('/updateOccurrence', mmController.updateOccurrence);

/*
    Swagger Docs on mm.controllers.js
*/
router.delete('/deleteOccurrence', mmController.deleteOccurrence);

/*
    Swagger Docs on mm.controllers.js
*/
router.post('/addCategoryIOR', mmController.addCategoryIOR);

/*
    Swagger Docs on mm.controllers.js
*/
router.post('/addFollowUpOccurrence', mmController.addFollowUpOccurrence);

/*
    Swagger Docs on mm.controllers.js
*/
router.put('/updateFollowUpOccurrence', mmController.updateFollowUpOccurrence);

/*
    Swagger Docs on mm.controllers.js
*/
router.post('/addNCRInit', mmController.addNCRInit);

/*
    Swagger Docs on mm.controllers.js
*/
router.delete('/deleteNCRInit', mmController.deleteNCRInit);

/*
    Swagger Docs on mm.controllers.js
*/
router.put('/updateNCRInit', mmController.UpdateNCRInit);

/*
    Swagger Docs on mm.controllers.js
*/
router.get('/showNCRInit', mmController.showNCRInit);

/*
    Swagger Docs on mm.controllers.js
*/
router.post('/searchNCR', mmController.searchNCR);

/*
    Swagger Docs on mm.controllers.js
*/
router.post('/showNCRInit_ID', mmController.showNCRInit_ID);

/*
    Swagger Docs on mm.controllers.js
*/
router.post('/addNCRReply', mmController.addNCRReply);

/*
    Swagger Docs on mm.controllers.js
*/
router.delete('/deleteNCRReply', mmController.deleteNCRReply);

/*
    Swagger Docs on mm.controllers.js
*/
router.put('/updateNCRReply', mmController.UpdateNCRReply);

router.get('/showNCRReply', mmController.showNCRReply);

router.post('/addNCRFollowResult', mmController.addNCRFollowResult);

router.post('/getPDF', mmController.getPDF);

router.post('/getPDFDrive', mmController.getPDFDrive);

router.delete('/deleteNCRFollowResult', mmController.deleteNCRFollowResult);

router.put('/UpdateNCRFollowResult', mmController.UpdateNCRFollowResult);

router.get('/showNCRFollowResult', mmController.showNCRFollowResult);

router.get('/showFollupOccurrence', mmController.showFollupOccurrence);

router.get('/showFollupOccurrenceID', mmController.showFollupOccurrenceID);

router.post('/logout', (req, res) => {
    // Assuming you're using sessions
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to logout.');
        }

        res.clearCookie('connect.sid'); // Clear the session cookie
        return res.status(200).send('Logged out successfully.');
    });
});

module.exports = router;