const mmService = require('../services/mm.services');

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Logs in a user with email and password.
 *     tags: 
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmf-aeroasia.co.id
 *               Password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Email/Password is not correct
 *       404:
 *         description: Email/Password is not correct
 */
async function login(req,res){
    try{
        const result = await mmService.login(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /addAccount:
 *   post:
 *     summary: Add a new account
 *     description: Adds a new account with the provided details.
 *     tags: 
 *       - Account Additions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               unit:
 *                 type: string
 *                 example: Engineering
 *               password:
 *                 type: string
 *                 example: StrongPass!1
 *               role:
 *                 type: string
 *                 example: Admin
 *               email:
 *                 type: string
 *                 example: john.doe@gmf-aeroasia.co.id
 *     responses:
 *       200:
 *         description: Add Account successful
 *       400:
 *         description: Add Account Failed due to invalid email or password
 *       500:
 *         description: Add Account Failed
 */
async function addAccount(req,res){
    try{
        const result = await mmService.addAccount(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /showAccount:
 *   post:
 *     summary: Show account information
 *     description: Fetches account information based on the provided account ID.
 *     tags: 
 *       - Account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountid:
 *                 type: string
 *                 example: 12345
 *     responses:
 *       200:
 *         description: Account found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Account found
 *                 account:
 *                   type: object
 *                   properties:
 *                     accountid:
 *                       type: string
 *                       example: 12345
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@gmf-aeroasia.co.id
 *                     role:
 *                       type: string
 *                       example: Admin
 *       404:
 *         description: Account not found
 *       500:
 *         description: Internal server error
 */
async function showAccount(req,res){
    try{
        const result = await mmService.showAccount(req.body);
        res.json(result);
    }catch(err){
        res.json(err);
    }
}

async function showAllAccount(req,res){
    try{
        const result = await mmService.showAllAccount(req.body);
        res.json(result);
    }catch(err){
        res.json(err);
    }
}

/**
 * @swagger
 * /updatePassword:
 *   post:
 *     summary: Update user password
 *     description: Updates the password for the user associated with the provided email.
 *     tags: 
 *       - Account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmf-aeroasia.co.id
 *               currentPass:
 *                 type: string
 *                 example: CurrentPass123!
 *               newPass:
 *                 type: string
 *                 example: NewPass123!
 *     responses:
 *       200:
 *         description: Password Updated
 *       400:
 *         description: Current password is incorrect or the new password does not meet the criteria
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
async function updatePassword(req,res){
    try{
        const result = await mmService.updatePassword(req.body);
        res.json(result);
    }catch(err){
        res.json(err);
    }
}

/**
 * @swagger
 * /deleteAccount:
 *   delete:
 *     summary: Delete a user account
 *     description: Deletes the user account associated with the provided email and password.
 *     tags: 
 *       - Account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmf-aeroasia.co.id
 *               password:
 *                 type: string
 *                 example: UserPassword123!
 *     responses:
 *       200:
 *         description: User deleted
 *       401:
 *         description: Invalid password
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
async function deleteAccount(req,res){
    try{
        const result = await mmService.deleteAccount(req.body);
        res.json(result);
    }catch(err){
        res.json(err);
    }
}

/**
 * @swagger
 * /addAuditPlan:
 *   post:
 *     summary: Add a new audit plan
 *     description: Creates a new audit plan for the specified account ID.
 *     tags: 
 *       - Audit Plan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountid:
 *                 type: string
 *                 example: 12345
 *               docdate:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-16"
 *               Subject:
 *                 type: string
 *                 example: "Audit of financial records"
 *               AuditType:
 *                 type: string
 *                 example: "Financial"
 *     responses:
 *       200:
 *         description: Audit Plan Created
 *       500:
 *         description: Error creating audit plan
 */
async function addAuditPlan(req,res){
    try{
        const result = await mmService.addAuditPlan(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /deleteAuditPlan:
 *   delete:
 *     summary: Delete an audit plan
 *     description: Deletes the audit plan associated with the provided document number.
 *     tags: 
 *       - Audit Plan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               docno:
 *                 type: string
 *                 example: "AP-2024-001"
 *     responses:
 *       200:
 *         description: Audit Plan deleted
 *       404:
 *         description: Audit Plan not found
 *       500:
 *         description: Internal server error
 */
async function deleteAuditPlan(req,res){
    try{
        const result = await mmService.deleteAuditPlan(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /updateAuditPlan:
 *   put:
 *     summary: Update an audit plan
 *     description: Updates the audit plan details such as docdate, subject, and audit type.
 *     tags: 
 *       - Audit Plan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               docno:
 *                 type: string
 *                 example: "AP-2024-001"
 *               accountid:
 *                 type: string
 *                 example: "12345"
 *               docdate:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-16"
 *               Subject:
 *                 type: string
 *                 example: "Audit of safety procedures"
 *               AuditType:
 *                 type: string
 *                 example: "Safety"
 *     responses:
 *       200:
 *         description: Update Audit Plan successful
 *       404:
 *         description: Error updating audit plan
 *       500:
 *         description: Internal server error
 */
async function UpdateAuditPlan(req,res){
    try{
        const result = await mmService.UpdateAuditPlan(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /showAuditPlanACC:
 *   get:
 *     summary: Show audit plan for an account
 *     description: Retrieves the audit plan associated with a specific account ID.
 *     tags: 
 *       - Audit Plan
 *     parameters:
 *       - in: query
 *         name: accountid
 *         schema:
 *           type: string
 *         required: true
 *         description: The account ID to fetch the audit plan for
 *     responses:
 *       200:
 *         description: AuditPlan found
 *       404:
 *         description: Audit Plan not found
 *       500:
 *         description: Internal server error
 */
async function showAuditPlanACC(req,res){
    try{
        const result = await mmService.showAuditPlanACC(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /addAPdetail:
 *   post:
 *     summary: Add a new Audit Plan Detail
 *     description: Creates a new Audit Plan Detail in the database.
 *     tags: 
 *       - Audit Plan Detail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DocNo:
 *                 type: string
 *               accountid:
 *                 type: string
 *               NoItem:
 *                 type: integer
 *               Requirement:
 *                 type: string
 *               Description:
 *                 type: string
 *               AuditType:
 *                 type: string
 *               SubDescription:
 *                 type: string
 *               WorkStation:
 *                 type: string
 *               PlannedWeek:
 *                 type: string
 *               ActualVisitDate:
 *                 type: string
 *               AuditReportEvidenceNbr:
 *                 type: string
 *     responses:
 *       200:
 *         description: Audit Plan Detail Created
 *       500:
 *         description: Error
 */
async function addAPdetail(req,res){
    try{
        const result = await mmService.addAPdetail(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /showAPdetail:
 *   get:
 *     summary: Show Audit Plan Detail
 *     description: Fetches details of a specific Audit Plan Detail by its DocNo.
 *     tags: 
 *       - Audit Plan Detail
 *     parameters:
 *       - in: query
 *         name: DocNo
 *         schema:
 *           type: string
 *         required: true
 *         description: The document number of the Audit Plan Detail.
 *     responses:
 *       200:
 *         description: Audit Plan Detail found
 *       404:
 *         description: Audit Plan Detail not found
 *       500:
 *         description: Error
 */
async function showAPdetail(req,res){
    try{
        const result = await mmService.showAPdetail(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /updateAPdetail:
 *   put:
 *     summary: Update Audit Plan Detail
 *     description: Updates an existing Audit Plan Detail in the database.
 *     tags: 
 *       - Audit Plan Detail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DocNo:
 *                 type: string
 *               accountid:
 *                 type: string
 *               NoItem:
 *                 type: integer
 *               Requirement:
 *                 type: string
 *               Description:
 *                 type: string
 *               AuditType:
 *                 type: string
 *               SubDescription:
 *                 type: string
 *               WorkStation:
 *                 type: string
 *               PlannedWeek:
 *                 type: string
 *               ActualVisitDate:
 *                 type: string
 *               AuditReportEvidenceNbr:
 *                 type: string
 *     responses:
 *       200:
 *         description: Update Audit Plan Detail successful
 *       404:
 *         description: Audit Plan Detail not found
 *       500:
 *         description: Error
 */
async function UpdateAPdetail(req,res){
    try{
        const result = await mmService.UpdateAPdetail(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /addIssuence:
 *   post:
 *     summary: Add a new Issuence
 *     description: Creates a new Issuence record in the database.
 *     tags:
 *       - Issuence
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DocNo:
 *                 type: string
 *               accountid:
 *                 type: string
 *               IssueNbr:
 *                 type: string
 *               IssueDate:
 *                 type: string
 *               IssueDesc:
 *                 type: string
 *               IssuedBy:
 *                 type: string
 *               HDOapprove:
 *                 type: string
 *     responses:
 *       200:
 *         description: Issuence Created
 *       500:
 *         description: Error
 */
async function addIssuence(req,res){
    try{
        const result = await mmService.addIssuence(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /updateAddIssuence:
 *   put:
 *     summary: Update an Issuence
 *     description: Updates an existing Issuence record in the database.
 *     tags:
 *       - Issuence
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DocNo:
 *                 type: string
 *               accountid:
 *                 type: string
 *               IssueNbr:
 *                 type: string
 *               IssueDate:
 *                 type: string
 *               IssueDesc:
 *                 type: string
 *               IssuedBy:
 *                 type: string
 *               HDOapprove:
 *                 type: string
 *     responses:
 *       200:
 *         description: Issuence Updated
 *       404:
 *         description: Issuence Not Found
 *       500:
 *         description: Error
 */
async function UpdateAddIssuence(req,res){
    try{
        const result = await mmService.UpdateaddIssuence(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /showIssuence:
 *   get:
 *     summary: Retrieve an issuance by DocNo
 *     tags: 
 *       - Issuence
 *     parameters:
 *       - in: query
 *         name: DocNo
 *         required: true
 *         schema:
 *           type: string
 *         description: The document number of the issuance.
 *     responses:
 *       200:
 *         description: Issuance found and returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Issuance found
 *                 account:
 *                   type: object
 *                   properties:
 *                     DocNo:
 *                       type: string
 *                       example: DOC001
 *                     IssueNbr:
 *                       type: string
 *                       example: ISS001
 *                     IssueDate:
 *                       type: string
 *                       example: 2024-01-01
 *       404:
 *         description: Issuance not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Issuance not found
 */
async function showIssuence(req,res){
    try{
        const result = await mmService.showissuence(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /addOccurrence:
 *   post:
 *     summary: Add a new Occurrence
 *     description: Creates a new Occurrence record in the database and updates a Google Doc template.
 *     tags:
 *       - Occurrence
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject_ior:
 *                 type: string
 *               category_occur:
 *                 type: string
 *               occur_nbr:
 *                 type: string
 *               occur_date:
 *                 type: string
 *               reference_ior:
 *                 type: string
 *               type_or_pnbr:
 *                 type: string
 *               to_uic:
 *                 type: string
 *               cc_uic:
 *                 type: string
 *               level_type:
 *                 type: string
 *               detail_occurance:
 *                 type: string
 *               ReportedBy:
 *                 type: string
 *               reporter_uic:
 *                 type: string
 *               report_date:
 *                 type: string
 *               reporter_identity:
 *                 type: string
 *               Data_reference:
 *                 type: string
 *               hirac_process:
 *                 type: string
 *               initial_probability:
 *                 type: string
 *               initial_severity:
 *                 type: string
 *               initial_riskindex:
 *                 type: string
 *     responses:
 *       200:
 *         description: Occurrence Created
 *       500:
 *         description: Error in sending file
 */
async function addOccurrence(req, res) {
    try {
        console.log("Adding IOR");
        const result = await mmService.addOccurrence(req.body);
        res.status(200).json({ message: 'IOR Successfully Added', result: result });
    } catch (err) {
        res.status(500).json({ message: 'Error in sending file', error: err.detail });
    }
}

/**
 * @swagger
 * /showOccurrence:
 *   get:
 *     summary: Retrieve an occurrence by ID
 *     tags: 
 *       - Occurrence
 *     parameters:
 *       - in: query
 *         name: id_IOR
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the occurrence.
 *     responses:
 *       200:
 *         description: Occurrence found and returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Occurrence found
 *                 account:
 *                   type: object
 *                   properties:
 *                     id_IOR:
 *                       type: string
 *                       example: IOR001
 *                     occur_nbr:
 *                       type: string
 *                       example: 1001
 *                     occur_date:
 *                       type: string
 *                       example: 2024-08-01
 *       404:
 *         description: Occurrence not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Occurrence not found
 */
async function showOccurrence(req,res){
    try{
        const result = await mmService.showOccurrence(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /updateOccurrence:
 *   put:
 *     summary: Update an occurrence
 *     tags: 
 *       - Occurrence
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_ior:
 *                 type: string
 *                 example: IOR001
 *               subject_ior:
 *                 type: string
 *                 example: "Subject 1"
 *               occur_nbr:
 *                 type: string
 *                 example: "1001"
 *               occur_date:
 *                 type: string
 *                 example: "2024-08-01"
 *               reference_ior:
 *                 type: string
 *                 example: "REF001"
 *               to_uic:
 *                 type: string
 *                 example: "UIC001"
 *               cc_uic:
 *                 type: string
 *                 example: "UIC002"
 *               category_occur:
 *                 type: string
 *                 example: "Category A"
 *               type_or_pnbr:
 *                 type: string
 *                 example: "PNBR001"
 *               level_type:
 *                 type: string
 *                 example: "Level 1"
 *               detail_occurance:
 *                 type: string
 *                 example: "Details of the occurrence"
 *               ReportedBy:
 *                 type: string
 *                 example: "Reporter Name"
 *               reporter_uic:
 *                 type: string
 *                 example: "UIC003"
 *               report_date:
 *                 type: string
 *                 example: "2024-08-01"
 *               reporter_identity:
 *                 type: string
 *                 example: "Reporter Identity"
 *               Data_reference:
 *                 type: string
 *                 example: "DATA001"
 *               hirac_process:
 *                 type: string
 *                 example: "Process 1"
 *               initial_probability:
 *                 type: string
 *                 example: "Low"
 *               initial_severity:
 *                 type: string
 *                 example: "High"
 *               initial_riskindex:
 *                 type: string
 *                 example: "Risk Index 1"
 *     responses:
 *       200:
 *         description: Occurrence updated successfully.
 *       500:
 *         description: Internal server error.
 */
async function updateOccurrence(req,res){
    try{
        const result = await mmService.updateOccurrence(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /deleteOccurrence:
 *   delete:
 *     summary: Delete an occurrence by ID
 *     tags: 
 *       - Occurrence
 *     parameters:
 *       - in: query
 *         name: id_IOR
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the occurrence to delete.
 *     responses:
 *       200:
 *         description: Occurrence deleted successfully.
 *       404:
 *         description: Occurrence not found.
 */
async function deleteOccurrence(req,res){
    try{
        const result = await mmService.deleteOccurrence(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /showOccurrenceAll:
 *   get:
 *     summary: Retrieve all occurrences
 *     tags: 
 *       - Occurrence
 *     responses:
 *       200:
 *         description: List of all occurrences.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Occurrence found
 *                 showProduct:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_IOR:
 *                         type: string
 *                         example: IOR001
 *                       occur_nbr:
 *                         type: string
 *                         example: 1001
 *                       occur_date:
 *                         type: string
 *                         example: 2024-08-01
 */
async function showOccurrenceAll(req,res){
    try{
        const result = await mmService.showOccurrenceAll(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /searchIOR:
 *   post:
 *     summary: Search for an IOR by ID or other attributes
 *     tags: 
 *       - Occurrence
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               input:
 *                 type: string
 *                 example: IOR001
 *     responses:
 *       200:
 *         description: Search results for the IOR.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Showing result of NCR
 *                 showProduct:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_IOR:
 *                         type: string
 *                         example: IOR001
 *                       subject_ior:
 *                         type: string
 *                         example: "Subject 1"
 */
async function searchIOR(req,res){
    try{
        const result = await mmService.searchIOR(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /addCategoryIOR:
 *   post:
 *     summary: Add a new category to an IOR
 *     tags: 
 *       - Occurrence
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_IOR:
 *                 type: string
 *                 example: IOR001
 *               number_cat:
 *                 type: string
 *                 example: CAT001
 *               occur_nbr:
 *                 type: string
 *                 example: 1001
 *     responses:
 *       200:
 *         description: Category IOR created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category IOR Created
 *       500:
 *         description: Internal server error.
 */
async function addCategoryIOR(req,res){
    try{
        const result = await mmService.addCategoryIOR(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /addFollowUpOccurrence:
 *   post:
 *     summary: Add a follow-up occurrence
 *     tags:
 *       - FollowUpOccurrence
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_IOR:
 *                 type: string
 *                 example: IOR001
 *               follup_detail:
 *                 type: string
 *                 example: Follow-up details here
 *               follupby:
 *                 type: string
 *                 example: John Doe
 *               follup_uic:
 *                 type: string
 *                 example: UIC001
 *               follup_date:
 *                 type: string
 *                 example: 2024-08-16
 *               follup_datarefer:
 *                 type: integer
 *                 example: 123
 *               follup_status:
 *                 type: string
 *                 example: Pending
 *               nextuic_follup:
 *                 type: string
 *                 example: UIC002
 *               current_probability:
 *                 type: string
 *                 example: High
 *               current_severity:
 *                 type: string
 *                 example: Major
 *               current_riskindex:
 *                 type: string
 *                 example: 9
 *     responses:
 *       200:
 *         description: Follow-Up Occurrence Created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Follow-Up Occurrence Created
 *       404:
 *         description: Error in creating Follow-Up Occurrence.
 */
async function addFollowUpOccurrence(req,res){
    try{
        const result = await mmService.addFollowUpOccurrence(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /updateFollowUpOccurrence:
 *   put:
 *     summary: Update an existing follow-up occurrence
 *     tags:
 *       - FollowUpOccurrence
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_IOR:
 *                 type: string
 *                 example: IOR001
 *               follup_detail:
 *                 type: string
 *                 example: Updated follow-up details here
 *               follupby:
 *                 type: string
 *                 example: Jane Doe
 *               follup_uic:
 *                 type: string
 *                 example: UIC001
 *               follup_date:
 *                 type: string
 *                 example: 2024-08-17
 *               follup_datarefer:
 *                 type: integer
 *                 example: 124
 *               follup_status:
 *                 type: string
 *                 example: Completed
 *               nextuic_follup:
 *                 type: string
 *                 example: UIC003
 *               current_probability:
 *                 type: string
 *                 example: Low
 *               current_severity:
 *                 type: string
 *                 example: Minor
 *               current_riskindex:
 *                 type: string
 *                 example: 3
 *     responses:
 *       200:
 *         description: Follow-Up Occurrence Updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Follow-Up Occurrence Updated
 *       404:
 *         description: Error in updating Follow-Up Occurrence.
 */
async function updateFollowUpOccurrence(req,res){
    try{
        const result = await mmService.updateFollowUpOccurrence(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /addNCRInit:
 *   post:
 *     summary: Add a new NCR Initial record
 *     tags:
 *       - NCR
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountid:
 *                 type: string
 *                 example: ACC123
 *               regulationbased:
 *                 type: string
 *                 example: Regulation XYZ
 *               subject:
 *                 type: string
 *                 example: Subject of NCR
 *               audit_plan_no:
 *                 type: string
 *                 example: AP123
 *               ncr_no:
 *                 type: string
 *                 example: NCR001
 *               issued_date:
 *                 type: string
 *                 example: 2024-08-16
 *               responsibility_office:
 *                 type: string
 *                 example: Office XYZ
 *               audit_type:
 *                 type: string
 *                 example: Type A
 *               audit_scope:
 *                 type: string
 *                 example: Scope A
 *               to_uic:
 *                 type: string
 *                 example: UIC123
 *               attention:
 *                 type: string
 *                 example: Attention Required
 *               require_condition_reference:
 *                 type: string
 *                 example: Condition Reference XYZ
 *               level_finding:
 *                 type: string
 *                 example: Level 2
 *               problem_analysis:
 *                 type: string
 *                 example: Problem Analysis Text
 *               answer_due_date:
 *                 type: string
 *                 example: 2024-08-20
 *               issue_ian:
 *                 type: string
 *                 example: Yes
 *               ian_no:
 *                 type: string
 *                 example: IAN123
 *               encountered_condition:
 *                 type: string
 *                 example: Condition Text
 *               audit_by:
 *                 type: string
 *                 example: Auditor Name
 *               audit_date:
 *                 type: string
 *                 example: 2024-08-15
 *               acknowledge_by:
 *                 type: string
 *                 example: Acknowledger Name
 *               acknowledge_date:
 *                 type: string
 *                 example: 2024-08-16
 *               status:
 *                 type: string
 *                 example: Open
 *               temporarylink:
 *                 type: string
 *                 example: http://example.com/temporarylink
 *     responses:
 *       200:
 *         description: NCR Initial Created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: NRC Initial Created
 *       404:
 *         description: Error in creating NCR Initial.
 */
async function addNCRInit(req,res){
    try{
        const result = await mmService.addNCRInit(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /deleteNCRInit:
 *   delete:
 *     summary: Delete an NCR Initial record
 *     description: Deletes an NCR Initial record based on the provided `ncr_init_id`.
 *     tags:
 *       - NCR
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ncr_init_id
 *             properties:
 *               ncr_init_id:
 *                 type: integer
 *                 description: The ID of the NCR Initial record to delete.
 *     responses:
 *       200:
 *         description: NCR Initial deleted successfully
 *       404:
 *         description: NCR Initial not found
 */
async function deleteNCRInit(req,res){
    try{
        const result = await mmService.deleteNCRInit(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /updateNCRInit:
 *   put:
 *     summary: Update an NCR Initial record
 *     description: Updates an existing NCR Initial record with the provided data.
 *     tags:
 *       - NCR
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ncr_init_id
 *               - accountid
 *               - regulationbased
 *               - subject
 *               - audit_plan_no
 *               - ncr_no
 *               - issued_date
 *               - responsibility_office
 *               - audit_type
 *               - audit_scope
 *               - to_uic
 *               - attention
 *               - require_condition_reference
 *               - level_finding
 *               - problem_analysis
 *               - answer_due_date
 *               - issue_ian
 *               - ian_no
 *               - encountered_condition
 *               - audit_by
 *               - audit_date
 *               - acknowledge_by
 *               - acknowledge_date
 *               - status
 *               - temporarylink
 *               - documentid
 *             properties:
 *               ncr_init_id:
 *                 type: integer
 *                 description: The ID of the NCR Initial record to update.
 *               accountid:
 *                 type: string
 *                 description: Account ID associated with the NCR.
 *               regulationbased:
 *                 type: string
 *                 description: Regulation based on which the NCR is issued.
 *               subject:
 *                 type: string
 *                 description: Subject of the NCR.
 *               audit_plan_no:
 *                 type: string
 *                 description: Audit plan number.
 *               ncr_no:
 *                 type: string
 *                 description: NCR number.
 *               issued_date:
 *                 type: string
 *                 format: date
 *                 description: Date when the NCR was issued.
 *               responsibility_office:
 *                 type: string
 *                 description: Office responsible for the NCR.
 *               audit_type:
 *                 type: string
 *                 description: Type of audit.
 *               audit_scope:
 *                 type: string
 *                 description: Scope of the audit.
 *               to_uic:
 *                 type: string
 *                 description: Unit in charge.
 *               attention:
 *                 type: string
 *                 description: Attention required for the NCR.
 *               require_condition_reference:
 *                 type: string
 *                 description: Required condition reference.
 *               level_finding:
 *                 type: string
 *                 description: Level of the finding.
 *               problem_analysis:
 *                 type: string
 *                 description: Analysis of the problem.
 *               answer_due_date:
 *                 type: string
 *                 format: date
 *                 description: Due date for the answer.
 *               issue_ian:
 *                 type: string
 *                 description: Issue related to the IAN.
 *               ian_no:
 *                 type: string
 *                 description: IAN number.
 *               encountered_condition:
 *                 type: string
 *                 description: Condition encountered during the audit.
 *               audit_by:
 *                 type: string
 *                 description: Auditor who performed the audit.
 *               audit_date:
 *                 type: string
 *                 format: date
 *                 description: Date of the audit.
 *               acknowledge_by:
 *                 type: string
 *                 description: Person who acknowledged the NCR.
 *               acknowledge_date:
 *                 type: string
 *                 format: date
 *                 description: Date when the NCR was acknowledged.
 *               status:
 *                 type: string
 *                 description: Status of the NCR.
 *               temporarylink:
 *                 type: string
 *                 description: Temporary link related to the NCR.
 *               documentid:
 *                 type: string
 *                 description: Document ID associated with the NCR.
 *     responses:
 *       200:
 *         description: Update Audit Plan successful
 *       404:
 *         description: Error updating Audit Plan
 */
async function UpdateNCRInit(req,res){
    try{
        const result = await mmService.UpdateNCRInit(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /showNCRInit:
 *   get:
 *     summary: Show all NCR Initial records
 *     description: Retrieves and displays all NCR Initial records from the database.
 *     tags:
 *       - NCR
 *     responses:
 *       200:
 *         description: Showing NCR Initial records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Showing NCR Initial
 *                 showProduct:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ncr_init_id:
 *                         type: integer
 *                         description: ID of the NCR Initial record.
 *                       subject:
 *                         type: string
 *                         description: Subject of the NCR.
 *                       ...
 *       404:
 *         description: No Data NCR Initial
 */
async function showNCRInit(req,res){
    try{
        const result = await mmService.showNCRInit(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /searchNCR:
 *   post:
 *     summary: Search for NCR Initial records
 *     description: Searches for NCR Initial records based on input (either `ncr_init_id` or `audit_by`/`to_uic`).
 *     tags:
 *       - NCR
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - input
 *             properties:
 *               input:
 *                 type: string
 *                 description: Input for searching (either NCR ID or audit-related text).
 *     responses:
 *       200:
 *         description: Showing result of NCR search
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Showing result of NCR
 *                 showProduct:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ncr_init_id:
 *                         type: integer
 *                         description: ID of the NCR Initial record.
 *                       subject:
 *                         type: string
 *                         description: Subject of the NCR.
 *                       ...
 *       404:
 *         description: No Data NCR
 */
async function searchNCR(req,res){
    try{
        const result = await mmService.searchNCR(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /showNCRInit_ID:
 *   post:
 *     summary: Show NCR Initial record by ID
 *     description: Retrieves a specific NCR Initial record based on the provided `ncr_init_id`.
 *     tags:
 *       - NCR
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ncr_init_id
 *             properties:
 *               ncr_init_id:
 *                 type: integer
 *                 description: The ID of the NCR Initial record to retrieve.
 *     responses:
 *       200:
 *         description: NCR Initial record retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Showing NCR Initial by ID
 *                 showProduct:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ncr_init_id:
 *                         type: integer
 *                         description: ID of the NCR Initial record.
 *                       subject:
 *                         type: string
 *                         description: Subject of the NCR.
 *                       ...
 *       404:
 *         description: No Data NCR Initial by ID
 */
async function showNCRInit_ID(req,res){
    try{
        const result = await mmService.showNCRInit_ID(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /addNCRReply:
 *   post:
 *     summary: Add a new NCR Reply
 *     description: Adds a new NCR Reply record with the provided details.
 *     tags:
 *       - NCR
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountid
 *               - ncr_init_id
 *               - rca_problem
 *               - corrective_act
 *               - preventive_act
 *               - identified_by
 *               - identified_date
 *               - accept_by
 *               - audit_accept
 *               - temporarylink
 *               - Recommend_corrective_action
 *             properties:
 *               accountid:
 *                 type: string
 *                 description: Account ID associated with the NCR reply.
 *               ncr_init_id:
 *                 type: integer
 *                 description: The ID of the NCR Initial record to which the reply is related.
 *               rca_problem:
 *                 type: string
 *                 description: Root Cause Analysis of the problem.
 *               corrective_act:
 *                 type: string
 *                 description: Corrective actions taken.
 *               preventive_act:
 *                 type: string
 *                 description: Preventive actions planned.
 *               identified_by:
 *                 type: string
 *                 description: Person who identified the issue.
 *               identified_date:
 *                 type: string
 *                 format: date
 *                 description: Date when the issue was identified.
 *               accept_by:
 *                 type: string
 *                 description: Person who accepted the NCR reply.
 *               audit_accept:
 *                 type: string
 *                 format: date
 *                 description: Date when the NCR reply was accepted by the auditor.
 *               temporarylink:
 *                 type: string
 *                 description: Temporary link related to the NCR reply.
 *               Recommend_corrective_action:
 *                 type: string
 *                 description: Recommended corrective actions.
 *     responses:
 *       200:
 *         description: NCR Reply created successfully
 *       400:
 *         description: Error creating NCR Reply
 */
async function addNCRReply(req,res){
    try{
        const result = await mmService.addNCRReply(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /deleteNCRReply:
 *   delete:
 *     summary: Delete an NCR Reply
 *     description: Deletes an NCR Reply record based on the provided `ncr_init_id`.
 *     tags:
 *       - NCR
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ncr_init_id
 *             properties:
 *               ncr_init_id:
 *                 type: integer
 *                 description: The ID of the NCR Reply record to delete.
 *     responses:
 *       200:
 *         description: NCR Reply deleted successfully
 *       404:
 *         description: NCR Reply not found
 */
async function deleteNCRReply(req,res){
    try{
        const result = await mmService.deleteNCRReply(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

/**
 * @swagger
 * /updateNCRReply:
 *   put:
 *     summary: Update an NCR Reply
 *     description: Updates an existing NCR Reply record with the provided data.
 *     tags:
 *       - NCR
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountid
 *               - ncr_init_id
 *               - rca_problem
 *               - corrective_act
 *               - preventive_act
 *               - identified_by
 *               - identified_date
 *               - accept_by
 *               - audit_accept
 *               - temporarylink
 *             properties:
 *               accountid:
 *                 type: string
 *                 description: Account ID associated with the NCR reply.
 *               ncr_init_id:
 *                 type: integer
 *                 description: The ID of the NCR Initial record to which the reply is related.
 *               rca_problem:
 *                 type: string
 *                 description: Root Cause Analysis of the problem.
 *               corrective_act:
 *                 type: string
 *                 description: Corrective actions taken.
 *               preventive_act:
 *                 type: string
 *                 description: Preventive actions planned.
 *               identified_by:
 *                 type: string
 *                 description: Person who identified the issue.
 *               identified_date:
 *                 type: string
 *                 format: date
 *                 description: Date when the issue was identified.
 *               accept_by:
 *                 type: string
 *                 description: Person who accepted the NCR reply.
 *               audit_accept:
 *                 type: string
 *                 format: date
 *                 description: Date when the NCR reply was accepted by the auditor.
 *               temporarylink:
 *                 type: string
 *                 description: Temporary link related to the NCR reply.
 *     responses:
 *       200:
 *         description: NCR Reply updated successfully
 *       404:
 *         description: Error updating NCR Reply
 */
async function UpdateNCRReply(req,res){
    try{
        const result = await mmService.UpdateNCRReply(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

async function showNCRReply(req,res){
    try{
        const result = await mmService.showNCRReply(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

async function addNCRFollowResult(req,res){
    try{
        const result = await mmService.addNCRFollowResult(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

async function deleteNCRFollowResult(req,res){
    try{
        const result = await mmService.deleteNCRFollowResult(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

async function UpdateNCRFollowResult(req,res){
    try{
        const result = await mmService.UpdateNCRFollowResult(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

async function showNCRFollowResult(req,res){
    try{
        const result = await mmService.showNCRFollowResult(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

async function showFollupOccurrence(req,res){
    try{
        const result = await mmService.showFollupOccurrence(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

async function showFollupOccurrenceID(req,res){
    try{
        const result = await mmService.showFollupOccurrenceID(req.body);
        res.json(result);
    }catch(err){
        res.json(err.detail);
    }
}

async function getPDF(req, res) {
    try {
        const result = await mmService.getPDF(req.body);
        if (result.success) {
            res.download(result.path, `${req.body.documentId}.pdf`, (err) => {
                if (err) {
                    console.error('Error in sending file:', err);
                    res.status(500).send('Error in sending file');
                }
            });
        } else {
            res.status(500).send(result.message);
        }
    } catch (err) {
        res.status(500).send(err.message || 'An unexpected error occurred');
    }
}

async function getPDFDrive(req, res) {
    try {
        const result = await mmService.getPDFDrive(req.body);

        if (result.success) {
            res.status(200).json({
                status: 200,
                message: result.message // Ensure result.message contains the file link
            });
        } else {
            // For non-200 cases that are not necessarily errors
            res.status(200).json({
                status: 200,
                message: result.message
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message || 'An unexpected error occurred'
        });
    }
}

module.exports = {
    login,
    addAccount,
    showAccount,
    deleteAccount,
    addAuditPlan,
    deleteAuditPlan,
    UpdateAuditPlan,
    showAuditPlanACC,
    addAPdetail,
    showAPdetail,
    UpdateAPdetail,
    addIssuence,
    addOccurrence,
    UpdateAddIssuence,
    showIssuence,
    showOccurrence,
    updateOccurrence,
    deleteOccurrence,
    addCategoryIOR,
    addFollowUpOccurrence,
    addNCRInit,
    deleteNCRInit,
    showNCRInit,
    searchNCR,
    UpdateNCRInit,
    addNCRReply,
    deleteNCRReply,
    UpdateNCRReply,
    getPDF,
    getPDFDrive,
    showNCRReply,
    addNCRFollowResult,
    deleteNCRFollowResult,
    UpdateNCRFollowResult,
    showNCRFollowResult,
    showNCRInit_ID,
    showAllAccount,
    updatePassword,
    updateFollowUpOccurrence,
    showFollupOccurrence,
    showFollupOccurrenceID,
    showOccurrenceAll,
    searchIOR
};