const passport = require('passport');
const express = require('express');
const router = express.Router();
const mmController = require('../controllers/mm.controllers');

router.post('/login', mmController.login);

router.post('/addAccount', mmController.addAccount);

router.post('/updatePassword', mmController.updatePassword);

router.post('/showAccount', mmController.showAccount);

router.delete('/deleteAccount', mmController.deleteAccount);

router.post('/addAuditPlan', mmController.addAuditPlan);

router.delete('/deleteAuditPlan', mmController.deleteAuditPlan);

router.put('/UpdateAuditPlan', mmController.UpdateAuditPlan);

router.get('/showAuditPlanACC', mmController.showAuditPlanACC);

router.post('/addAPdetail', mmController.addAPdetail);

router.get('/showAPdetail', mmController.showAPdetail);

router.put('/UpdateAPdetail', mmController.UpdateAPdetail);

router.post('/addIssuence', mmController.addIssuence);

router.put('/UpdateaddIssuence', mmController.UpdateaddIssuence);

router.post('/addOccurrence', mmController.addOccurrence);

router.get('/showOccurrence', mmController.showOccurrence);

router.get('/showOccurrenceAll', mmController.showOccurrenceAll);

router.post('/searchIOR', mmController.searchIOR);

router.get('/showAllAccount', mmController.showAllAccount);

router.get('/showissuence', mmController.showissuence);

router.put('/updateOccurrence', mmController.updateOccurrence);

router.delete('/deleteOccurrence', mmController.deleteOccurrence);

router.post('/addCategoryIOR', mmController.addCategoryIOR);

router.post('/addFollowUpOccurrence', mmController.addFollowUpOccurrence);

router.put('/updateFollowUpOccurrence', mmController.updateFollowUpOccurrence);

router.post('/addNCRInit', mmController.addNCRInit);

router.delete('/deleteNCRInit', mmController.deleteNCRInit);

router.put('/UpdateNCRInit', mmController.UpdateNCRInit);

router.get('/showNCRInit', mmController.showNCRInit);

router.post('/searchNCR', mmController.searchNCR);

router.post('/showNCRInit_ID', mmController.showNCRInit_ID);

router.post('/addNCRReply', mmController.addNCRReply);

router.delete('/deleteNCRReply', mmController.deleteNCRReply);

router.put('/UpdateNCRReply', mmController.UpdateNCRReply);

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