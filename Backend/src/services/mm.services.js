//const res = require('express/lib/response');
//const { use } = require('passport/lib');
const os = require('os');
const path = require('path');
const db = require('../configs/db.config');
const fs = require('fs');
const tmp = require('tmp');
const helper = require('../utils/helper');
const { google } = require('googleapis');
// Set up Google authentication with the necessary scopes for Google Docs and Drive
const auth = new google.auth.GoogleAuth({
    keyFile: '../Backend/googleCredential.json', // Path to your JSON key file
    scopes: [
        'https://www.googleapis.com/auth/documents', // Scope for Google Docs
        'https://www.googleapis.com/auth/drive' // Scope for Google Drive
    ]
});

// Function to replace text in a Google Docs document
async function replaceTextInGoogleDocs(documentId, findText, replaceText) {
    try {
        const docs = google.docs({ version: 'v1', auth }); // Create a Google Docs API client

        // Send a batchUpdate request to modify the document
        const writer = await docs.documents.batchUpdate({
            documentId, // ID of the document to update
            requestBody: {
                requests: [
                    {
                        replaceAllText: {
                            containsText: {
                                text: findText,
                                matchCase: true
                            },
                            replaceText: replaceText
                        }
                    }
                ]
            }
        });
        return writer; // Return the response from the Google Docs API
    } catch (error) {
        console.error('Error in replaceTextInGoogleDocs:', error.message); // Log any errors that occur
        console.error(error.response.data); // Log the detailed error response
    }
}

// Function to copy a Google Docs document with a custom title and place it in the same folder
async function copyGoogleDoc(sourceDocumentId, copyTitle) {
    try {
        const drive = google.drive({ version: 'v3', auth });

        // Get the parent folder(s) of the original file
        const originalFile = await drive.files.get({
            fileId: sourceDocumentId,
            fields: 'parents'
        });

        const parents = originalFile.data.parents;

        // Copy the document and set the parent folder
        const response = await drive.files.copy({
            fileId: sourceDocumentId,
            requestBody: {
                name: copyTitle,
                parents: parents
            }
        });

        // Ensure the copied document is shared with your account
        const copiedDocumentId = response.data.id;
        await drive.permissions.create({
            fileId: copiedDocumentId,
            requestBody: {
                role: 'writer',
                type: 'user',
                emailAddress: 'c010d4ky0625@bangkit.academy' // replace with your email
            }
        });

        return copiedDocumentId;
    } catch (error) {
        console.error('Error in copyGoogleDocWithFolder:', error.message);
        console.error(error.response?.data);
    }
}

async function moveFileToFolder(fileId, newParentId) {
    try {
        const drive = google.drive({ version: 'v3', auth });

        // Get the current parents of the file
        const fileMetadata = await drive.files.get({
            fileId: fileId,
            fields: 'parents'
        });

        const previousParents = fileMetadata.data.parents.join(',');

        // Move the file to the new parent folder
        await drive.files.update({
            fileId: fileId,
            addParents: newParentId,
            removeParents: previousParents,
            fields: 'id, parents'
        });

        console.log(`File ID: ${fileId} moved to folder ID: ${newParentId}`);
    } catch (error) {
        console.error('Error in moveFileToFolder:', error.message);
        console.error(error.response?.data);
    }
}

//===========================================
//============ account ======================
//===========================================

async function login(mm) {
    const { email, Password } = mm;
    const query = `SELECT * FROM account WHERE email = '${email}'`;
    const result = await db.query(query);
    console.log(query);
    if (result.rowCount > 0) {
        const user = result.rows[0];
        console.log(user);
        console.log(Password);
        const comparePass = await helper.comparePassword(Password, user.password);
        if (comparePass) {
            console.log("Masuk");
            return { status: 200, message: 'Login successful', user };
        } else {
            return { status: 401, message: 'Email/Password is not correct' };
        }
    } else {
        return { status: 404, message: 'Email/Password is not correct' };
    }
}

async function addAccount(mm) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmf-aeroasia\.co\.id$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    const { /*accountid,*/name, unit, password, role, email } = mm;
    
    if (!emailRegex.test(email)) {
        return { status: 400, message: 'Add Account Failed: Email not valid' };
    }
    
    if (!passwordRegex.test(password)) {
        return { status: 400, message: 'Add Account Failed: Password must be at least 8 characters long and include a combination of uppercase letters, lowercase letters, numbers, and symbols.' };
    }

    const pass = await helper.hashPassword(password);
    const query = `INSERT INTO account (name, unit, password, role, email) VALUES ('${name}', '${unit}', '${pass}', '${role}', '${email}')`;
    const result = await db.query(query);
    
    if (result.rowCount === 1) {
        return { status: 200, message: 'Add Account successful' };
    } else {
        return { status: 500, message: 'Add Account Failed' };
    }
}

async function updatePassword(mm) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    const { email, currentPass, newPass } = mm;

    if (!passwordRegex.test(newPass)) {
        return { status: 400, message: 'Update Password Failed: Password must be at least 8 characters long and include a combination of uppercase letters, lowercase letters, numbers, and symbols.' };
    }

    try {
        const passQuery = `SELECT password FROM account WHERE email = $1`;
        const passResult = await db.query(passQuery, [email]);

        if (passResult.rowCount === 0) {
            return { status: 404, message: 'User not found' };
        }

        const storedPass = passResult.rows[0].password;
        const isValidPassword = await helper.comparePassword(currentPass, storedPass);

        if (!isValidPassword) {
            return { status: 400, message: 'Current password is incorrect' };
        }

        const hashedNewPass = await helper.hashPassword(newPass);
        const updateQuery = `UPDATE account SET password = $1 WHERE email = $2`;
        const result = await db.query(updateQuery, [hashedNewPass, email]);

        if (result.rowCount === 1) {
            return { status: 200, message: 'Password Updated' };
        } else {
            return { status: 500, message: 'Error updating password' };
        }
    } catch (error) {
        console.error('Error updating password:', error);
        return { status: 500, message: 'Internal server error' };
    }
}



async function showAccount(temp) {
    try {
        const { accountid } = temp;
        const query = `SELECT * FROM account WHERE accountid = '${accountid}'`;
        const result = await db.query(query);

        if (result.rowCount > 0) {
            return {
                status: 200,
                message: 'Account found',
                account: result.rows[0],
            };
        } else {
            return {
                status: 200,
                message: 'Account not found',
            };
        }
    } catch (error) {
        console.error('Error fetching account information:', error);
        throw error;
    }
}

async function showAllAccount() {
    try {
        const query = `SELECT * FROM account`;
        const result = await db.query(query);

        if (result.rowCount > 0) {
            return {
                status: 200,
                message: 'Account found',
                account: result.rows,
            };
        } else {
            return {
                status: 200,
                message: 'Account not found',
            };
        }
    } catch (error) {
        console.error('Error fetching account information:', error);
        throw error;
    }
}

async function deleteAccount(temp) {
    const { email, password } = temp;
    const userQuery = `SELECT password FROM account WHERE email = '${email}'`;
    const userResult = await db.query(userQuery);
    
    if (userResult.rowCount === 0) {
        console.log('User not found');
        return {status: 404, message: 'User not found'};
    }
    
    const hashedPassword = userResult.rows[0].password;
    const isMatch = await helper.comparePassword(password, hashedPassword);
    
    if (!isMatch) {
        return {
            status: 401,
            message: 'Invalid password'
        };
    }
    
    const deleteQuery = `DELETE FROM account WHERE email = '${email}'`;
    const deleteResult = await db.query(deleteQuery);
    
    if (deleteResult.rowCount === 1) {
        console.log('User deleted');
        return { status: 200, message: 'User deleted' };
    } else {
        console.log('User not found');
        return { status: 404, message: 'User not found' };
    }
}


//===========================================
//============ AuditPlan ====================
//===========================================

async function addAuditPlan(mm) {
    const { accountid, docdate, Subject, AuditType } = mm;
    const query = `INSERT INTO AuditPlan  (accountid,docdate,Subject,AuditType) VALUES ('${accountid}','${docdate}','${Subject}',  '${AuditType}')`;
    const result = await db.query(query);
    if (result.rowCount === 1) {
        return {
            message: 'Audit Plan Created'
        }
    } else {
        return {
            message: 'Error'
        }
    }
}

async function deleteAuditPlan(temp) {
    const { docno } = temp;
    const query = `DELETE FROM AuditPlan WHERE docno = '${docno}'`;
    const result = await db.query(query);
    if (result.rowCount === 1) {
        return {
            message: 'Audit Plan deleted'
        }
    }
    else {
        return {
            message: 'Audit Plan not found'
        }
    }
}

async function showAuditPlanACC(temp) {
    try {
        const { accountid } = temp;
        const query = `SELECT * FROM AuditPlan WHERE accountid = '${accountid}'`;
        const result = await db.query(query);

        if (result.rowCount > 0) {
            return {
                status: 200,
                message: 'AuditPlan found',
                account: result.rows[0],
            };
        } else {
            return {
                status: 200,
                message: 'Audit Plan not found',
            };
        }
    } catch (error) {
        console.error('Error fetching account information:', error);
        throw error;
    }
}

async function UpdateAuditPlan(temp) {
    const { accountid, docdate, Subject, AuditType, docno } = temp;
    const query = `UPDATE AuditPlan SET docdate = '${docdate}' , Subject = '${Subject}',AuditType = '${AuditType}' ,accountid = '${accountid}' WHERE docno ='${docno}' `;
    const result = await db.query(query);
    if (result.rowCount === 1) {
        return {
            status: 200, message: 'Update Audit Plan successful'
        }
    } else {
        return {
            status: 404, message: 'Error'
        }
    }
}

//==========================================
//============ APdetail ====================
//==========================================

async function addAPdetail(mm) {
    const { DocNo, accountid, NoItem, Requirement, Description, AuditType, SubDescription, WorkStation, PlannedWeek, ActualVisitDate, AuditReportEvidenceNbr } = mm;
    const query = `INSERT INTO APdetail   (DocNo,accountid,NoItem ,Requirement ,Description,AuditType ,SubDescription ,WorkStation,PlannedWeek,ActualVisitDate,AuditReportEvidenceNbr) 
    VALUES ('${DocNo}','${accountid}','${NoItem}',  '${Requirement}','${Description}','${AuditType}','${SubDescription}','${WorkStation}','${PlannedWeek}','${ActualVisitDate}','${AuditReportEvidenceNbr}')`;
    const result = await db.query(query);
    if (result.rowCount === 1) {
        return {
            message: 'addAPdetail Created'
        }
    } else {
        return {
            message: 'Error'
        }
    }
}

async function UpdateAPdetail(temp) {
    const { DocNo, accountid, NoItem, Requirement, Description, AuditType, SubDescription, WorkStation, PlannedWeek, ActualVisitDate, AuditReportEvidenceNbr } = temp;
    const query = `UPDATE APdetail SET accountid = '${accountid}' , NoItem = '${NoItem}',Requirement = '${Requirement}' ,Description = '${Description}', 
    AuditType = '${AuditType}',SubDescription = '${SubDescription}' ,WorkStation = '${WorkStation}',PlannedWeek = '${PlannedWeek}',
    ActualVisitDate = '${ActualVisitDate}' ,AuditReportEvidenceNbr = '${AuditReportEvidenceNbr}' WHERE DocNo ='${DocNo}' `;
    const result = await db.query(query);
    if (result.rowCount === 1) {
        return {
            status: 200, message: 'Update Audit Plan Detail successful'
        }
    } else {
        return {
            status: 404, message: 'Error'
        }
    }
}


async function showAPdetail(temp) {
    try {
        const { DocNo } = temp;
        const query = `SELECT * FROM apdetail WHERE DocNo = '${DocNo}'`;
        const result = await db.query(query);

        if (result.rowCount > 0) {
            return {
                status: 200,
                message: 'Audit Plan Detail found',
                account: result.rows[0],
            };
        } else {
            return {
                status: 200,
                message: 'Audit Plan Detail not found',
            };
        }
    } catch (error) {
        console.error('Error fetching Audit Plan Detail information:', error);
        throw error;
    }
}

//==========================================
//============ Issuence  ===================
//==========================================

async function addIssuence(mm) {
    const { DocNo, accountid, IssueNbr, IssueDate, IssueDesc, IssuedBy, HDOapprove } = mm;
    const query = `INSERT INTO issuence  (DocNo ,accountid,IssueNbr ,IssueDate ,IssueDesc,IssuedBy ,HDOapprove) 
    VALUES ('${DocNo}','${accountid}','${IssueNbr}',  '${IssueDate}','${IssueDesc}','${IssuedBy}',  '${HDOapprove}')`;
    const result = await db.query(query);
    if (result.rowCount === 1) {
        return {
            message: 'issuence Created'
        }
    } else {
        return {
            message: 'Error'
        }
    }
}

async function UpdateaddIssuence(temp) {
    const { DocNo, accountid, IssueNbr, IssueDate, IssueDesc, IssuedBy, HDOapprove } = temp;

    const query = `UPDATE issuence SET accountid = '${accountid}' , IssueNbr = '${IssueNbr}',IssueDate = '${IssueDate}' ,IssueDesc = '${IssueDesc}', 
    IssuedBy = '${IssuedBy}',HDOapprove = '${HDOapprove}' WHERE DocNo ='${DocNo}' `;

    const result = await db.query(query);
    if (result.rowCount === 1) {
        return {
            status: 200, message: 'Update Issuence successful'
        }
    } else {
        return {
            status: 404, message: 'Error'
        }
    }
}

async function showissuence(temp) {
    try {
        const { DocNo } = temp;
        const query = `SELECT * FROM issuence WHERE DocNo = '${DocNo}'`;
        const result = await db.query(query);

        if (result.rowCount > 0) {
            return {
                status: 200,
                message: 'issuence found',
                account: result.rows[0],
            };
        } else {
            return {
                status: 200,
                message: 'issuencel not found',
            };
        }
    } catch (error) {
        console.error('Error fetching Audit Plan Detail information:', error);
        throw error;
    }
}

//==========================================
//============ Occurrence   ================
//==========================================

async function addOccurrence(mm) {
    const {
        subject_ior, 
        category_occur, // Correct key from the front end object
        occur_nbr, 
        occur_date, 
        reference_ior, 
        type_or_pnbr, // Correct key from the front end object
        to_uic, 
        cc_uic, 
        level_type, // Correct key from the front end object
        detail_occurance, // Correct key from the front end object
        ReportedBy, 
        reporter_uic, 
        report_date, 
        reporter_identity, // Correct key from the front end object
        Data_reference, // Correct key from the front end object
        hirac_process, 
        initial_probability, // Correct key from the front end object
        initial_severity, // Correct key from the front end object
        initial_riskindex // Correct key from the front end object
    } = mm;

    const newTitle = `IOR_${occur_nbr}`;
    console.log(mm);

    const parentFolderId = '19z61tEaUF3jvtXRvVfI_w6O4nN3PF5LG';
    const copiedDocumentId = await copyGoogleDoc('1CRPhfbn1hnmJo7X_gCaiS8VTmOj6gkzt2zok-y6yEjc', newTitle);
    await moveFileToFolder(copiedDocumentId, parentFolderId);

    // List of placeholders and their replacements
    const categories = [
        '{DOA Management}', '{Partner or Subcontractor}', '{Procedure}', '{Material}',
        '{Document}', '{Information Technology}', '{Personnel}', '{Training}',
        '{Facility}', '{Others}'
    ];

    const levelTypes = [
        '{Aircraft}', '{Engine}', '{APU}', '{Others}'
    ];

    const categoryReplacements = categories.reduce((acc, placeholder) => {
        acc[placeholder] = placeholder === `{${category_occur}}` ? `☑ ${category_occur}` : `☐ ${placeholder.replace(/[{}]/g, '')}`;
        return acc;
    }, {});

    const levelTypeReplacement = levelTypes.reduce((acc, placeholder) => {
        acc[placeholder] = placeholder === `{${level_type}}` ? `☑ ${level_type}` : `☐ ${placeholder.replace(/[{}]/g, '')}`;
        return acc;
    }, {});

    const reporterIdentityReplacement = {
        '{Shown}': reporter_identity === 'Shown' ? '☑ Shown' : '☐ Shown',
        '{Hidden}': reporter_identity === 'Hidden' ? '☑ Hidden' : '☐ Hidden'
    };

    const dataRefReplacement = {
        '{RefYes}': Data_reference === 'Yes' ? '☑ Yes' : '☐ Yes',
        '{RefNo}': Data_reference === 'No' ? '☑ No' : '☐ No'
    };

    const hiracProcessReplacement = {
        '{HIRACYes}': hirac_process === 'Yes' ? '☑ Yes' : '☐ No',
        '{HIRACNo}': hirac_process === 'No' ? '☑ No' : '☐ No'
    };

    const replacements = {
        '{Subject}': subject_ior,
        '{OccurenceReport}': occur_nbr,
        '{OccurenceDate}': occur_date,
        '{Ref}': reference_ior,
        '{Type}': type_or_pnbr,
        '{To}': to_uic,
        '{Copy}': cc_uic,
        '{Detail}': detail_occurance,
        '{NameID}': ReportedBy,
        '{Unit}': reporter_uic,
        '{Date}': report_date,
        '{Init_Prob}': initial_probability,
        '{Init_Severity}': initial_severity,
        '{Init_Risk}': initial_riskindex,
        ...categoryReplacements,
        ...levelTypeReplacement,
        ...reporterIdentityReplacement,
        ...dataRefReplacement,
        ...hiracProcessReplacement
    };

    console.log("Replacement: \n", replacements);

    for (const [placeholder, replacement] of Object.entries(replacements)) {
        await replaceTextInGoogleDocs(copiedDocumentId, placeholder, replacement);
    }

    const query = `INSERT INTO tbl_occurrence (
        subject_ior,
        occur_nbr,
        occur_date,
        reference_ior,
        to_uic,
        cc_uic,
        category_occur,
        type_or_pnbr,
        level_type, 
        detail_occurance,
        ReportedBy,
        reporter_uic,
        report_date,
        reporter_identity,
        Data_reference,  
        hirac_process,
        initial_probability,
        initial_severity,
        initial_riskindex,
        documentid
    ) VALUES ('${subject_ior}', '${occur_nbr}','${occur_date}','${reference_ior}','${to_uic}','${cc_uic}','${category_occur}','${type_or_pnbr}','${level_type}','${detail_occurance}',
    '${ReportedBy}','${reporter_uic}','${report_date}','${reporter_identity}','${Data_reference}','${hirac_process}','${initial_probability}','${initial_severity}','${initial_riskindex}', '${copiedDocumentId}')`;

    console.log(query);
    const result = await db.query(query);

    if (result.rowCount === 1) {
        console.log("IOR successfully added");
        return {
            status: 200,
            message: 'Occurrence Created'
        };
    } else {
        return {
            status: 404,
            message: 'Error'
        };
    }
}

async function showOccurrence(temp) {
    try {
        const { id_IOR } = temp;
        const query = `SELECT * FROM tbl_occurrence WHERE id_IOR  = '${id_IOR}'`;
        const result = await db.query(query);
        console.log(query);
        if (result.rowCount > 0) {
            return {
                status: 200,
                message: 'Occurrence found',
                account: result.rows[0],
            };
        } else {
            return {
                status: 200,
                message: 'Occurrence not found',
            };
        }
    } catch (error) {
        console.error('Error fetching Occurrenc information:', error);
        throw error;
    }
}

async function searchIOR(temp) {
    const {input} = temp;
    const numberRegex = /^\d+$/;
    let query;
    if(numberRegex.test(input)){
        query = `SELECT * FROM tbl_occurrence WHERE id_ior = '${input}'`;
    }else{
        query = `SELECT * FROM tbl_occurrence WHERE subject_ior ILIKE '%${input}%' OR to_uic::TEXT ILIKE '%${input}%' OR cc_uic::TEXT ILIKE '%${input}%'`;
    }
    console.log(query);
    const result = await db.query(query);
    if (result.rowCount) {
        console.log("Found");
        return {
            status: 200,
            message: 'Showing result of NCR',
            showProduct: result.rows
        }
    } else {
        return {
            status: 200, // Still return status 200 to indicate the request was successful
            message: 'No Data NCR',
            showProduct: [] // Return an empty array to indicate no results
        }
    }
}

async function showOccurrenceAll() {
    try {
        const query = `SELECT * FROM tbl_occurrence`;
        const result = await db.query(query);

        if (result.rowCount > 0) {
            return {
                status: 200,
                message: 'Occurrence found',
                showProduct: result.rows
            };
        } else {
            return {
                status: 200,
                message: 'Occurrence not found',
            };
        }
    } catch (error) {
        console.error('Error fetching Occurrenc information:', error);
        throw error;
    }
}

async function updateOccurrence(mm) {
    const {
        id_ior,
        subject_ior,
        occur_nbr,
        occur_date,
        reference_ior,
        to_uic,
        cc_uic,
        category_occur,
        type_or_pnbr,
        level_type,
        detail_occurance,
        ReportedBy,
        reporter_uic,
        report_date,
        reporter_identity,
        Data_reference,
        hirac_process,
        initial_probability,
        initial_severity,
        initial_riskindex
    } = mm;

    const query = `UPDATE tbl_occurrence SET
        id_ior = '${id_ior}',
        occur_nbr = '${occur_nbr}',
        occur_date = '${occur_date}',
        reference_ior = '${reference_ior}',
        to_uic = '${to_uic}',
        cc_uic = '${cc_uic}',
        category_occur = '${category_occur}',
        type_or_pnbr = '${type_or_pnbr}',
        level_type = '${level_type}',
        detail_occurance = '${detail_occurance}',
        ReportedBy = '${ReportedBy}',
        reporter_uic = '${reporter_uic}',
        report_date = '${report_date}',
        reporter_identity = ${reporter_identity},
        Data_reference = ${Data_reference},
        hirac_process = ${hirac_process},
        initial_probability = '${initial_probability}',
        initial_severity = '${initial_severity}',
        initial_riskindex = '${initial_riskindex}'
        WHERE subject_ior = '${subject_ior}'`;

    const result = await db.query(query);

    if (result.rowCount === 1) {
        return {
            status: 200,
            message: 'Occurrence Updated'
        }
    } else {
        return {
            message: 'Error'
        }
    }
}


async function deleteOccurrence(temp) {
    const { id_IOR } = temp;
    const query = `DELETE FROM tbl_occurrence WHERE id_IOR = '${id_IOR}'`;
    const result = await db.query(query);
    if (result.rowCount === 1) {
        return {
            message: 'Occurrence deleted'
        }
    }
    else {
        return {
            message: 'User not found'
        }
    }
}

//==========================================
//============ tbl_category_ior    =========
//==========================================

async function addCategoryIOR(categoryIOR) {
    const { id_IOR, number_cat, occur_nbr } = categoryIOR;

    const query = `INSERT INTO tbl_category_ior (
        id_IOR,
        number_cat,
        occur_nbr
    ) VALUES (
        ${id_IOR},
        '${number_cat}',
        '${occur_nbr}'
    )`;

    const result = await db.query(query);

    if (result.rowCount === 1) {
        return {
            message: 'Category IOR Created'
        };
    } else {
        return {
            message: 'Error'
        };
    }
}


//==========================================
//============ tbl_follupOccur     =========
//==========================================

async function addFollowUpOccurrence(followUpData) {
    const {
        id_IOR,
        follup_detail,
        follupby,
        follup_uic,
        follup_date,
        follup_datarefer,
        follup_status,
        nextuic_follup,
        current_probability,
        current_severity,
        current_riskindex
    } = followUpData;

    const query = `INSERT INTO tbl_follupOccur (
        id_IOR,
        follup_detail,
        follupby,
        follup_uic,
        follup_date,
        follup_datarefer,
        follup_status,
        nextuic_follup,
        current_probability,
        current_severity,
        current_riskindex
    ) VALUES (
        ${id_IOR},
        '${follup_detail}',
        '${follupby}',
        '${follup_uic}',
        '${follup_date}',
        ${follup_datarefer},
        '${follup_status}',
        '${nextuic_follup}',
        '${current_probability}',
        '${current_severity}',
        '${current_riskindex}'
    )`;

    const result = await db.query(query);

    if (result.rowCount === 1) {
        return {
            status: 200,
            message: 'Follow-Up Occurrence Created'
        };
    } else {
        return {
            status: 404,
            message: 'Error'
        };
    }
}

async function showFollupOccurrence() {
    try {
        const query = `SELECT * FROM tbl_follupOccur`;
        const result = await db.query(query);

        if (result.rowCount > 0) {
            return {
                status: 200,
                message: 'Occurrence found',
            };
        } else {
            return {
                status: 200,
                message: 'Occurrence not found',
            };
        }
    } catch (error) {
        console.error('Error fetching Occurrenc information:', error);
        throw error;
    }
}

async function showFollupOccurrenceID(temp) {
    try {
        const { id_IOR } = temp;
        const query = `SELECT * FROM tbl_follupOccur WHERE id_IOR = '${id_IOR}'`;
        const result = await db.query(query);

        if (result.rowCount > 0) {
            return {
                status: 200,
                message: 'Occurrence found',
            };
        } else {
            return {
                status: 200,
                message: 'Occurrence not found',
            };
        }
    } catch (error) {
        console.error('Error fetching Occurrenc information:', error);
        throw error;
    }
}

async function updateFollowUpOccurrence(followUpData) {
    const {
        id_IOR,
        follup_detail,
        follupby,
        follup_uic,
        follup_date,
        follup_datarefer,
        follup_status,
        nextuic_follup,
        current_probability,
        current_severity,
        current_riskindex
    } = followUpData;

    const query = `UPDATE tbl_follupOccur SET
        follup_detail = '${follup_detail}',
        follupby = '${follupby}',
        follup_uic = '${follup_uic}',
        follup_date = '${follup_date}',
        follup_datarefer = ${follup_datarefer},
        follup_status = '${follup_status}',
        nextuic_follup = '${nextuic_follup}',
        current_probability = '${current_probability}',
        current_severity = '${current_severity}',
        current_riskindex = '${current_riskindex}'
    WHERE id_IOR = ${id_IOR}`;

    const result = await db.query(query);

    if (result.rowCount === 1) {
        return {
            status: 200,
            message: 'Follow-Up Occurrence Updated'
        };
    } else {
        return {
            status: 404,
            message: 'Error updating Follow-Up Occurrence'
        };
    }
}

//==========================================
//============ tbl_follupOccur     =========
//==========================================

async function addNCRInit(mm) {
    const { accountid, regulationbased, subject, audit_plan_no, ncr_no, issued_date, responsibility_office, audit_type, audit_scope, to_uic, attention, require_condition_reference, level_finding, problem_analysis, answer_due_date, issue_ian, ian_no, encountered_condition, audit_by, audit_date, acknowledge_by, acknowledge_date, status, temporarylink } = mm;
    console.log(issued_date);
    console.log("Test")
    // New title for the copied document, including ncr_no from the parameters
    const newTitle = `NCR_${ncr_no}`;
    const parentFolderId = '1tkj7lPPXC8IbJrqsk4WwyrMoR3F6RJK0';
    const copiedDocumentId = await copyGoogleDoc('1TsYiA9MRFPCgkqYCwusHTwnhSDBRekhCzpU6fZF8JwI', newTitle);
    //let ian = issue_ian ? "Yes" : "No";
    await moveFileToFolder(copiedDocumentId, parentFolderId);
    // List of placeholders and their replacements
    const replacements = {
        '{AuditPlan}' : audit_plan_no,
        '{NCR_No}': ncr_no,
        '{IssuedDate}': issued_date,
        '{Responsibility_Office}': responsibility_office,
        '{Audit_Type}': audit_type,
        '{to_uic}': to_uic,
        '{attention}': attention,
        '{regulationbased}': regulationbased,
        '{Level_Finding}': level_finding,
        '{Problem_Analysis}': problem_analysis,
        '{Due_Date}': answer_due_date,
        '{IAN}': issue_ian,
        '{No}': ian_no,
        '{Encountered_Condition}': encountered_condition,
        '{Audit_by}': audit_by,
        '{Audit_Date}': audit_date,
        '{Acknowledge_by}': acknowledge_by,
        '{Acknowledge_date}': acknowledge_date,
    };
    // Replace each placeholder in the document
    for (const [placeholder, replacement] of Object.entries(replacements)) {
        await replaceTextInGoogleDocs(copiedDocumentId, placeholder, replacement);
    }
    console.log("Added document")
    const query = `INSERT INTO NCR_Initial ( AccountID, RegulationBased, Subject, Audit_Plan_No, NCR_No, Issued_Date, 
    Responsibility_Office, Audit_Type, Audit_Scope, To_UIC, Attention, require_condition_reference, Level_Finding, 
    Problem_Analysis, Answer_Due_Date, Issue_IAN, IAN_No, Encountered_Condition, Audit_by, Audit_Date, Acknowledge_by, 
    Acknowledge_date, Status, TemporaryLink, documentid) VALUES ('${accountid}','${regulationbased}', '${subject}', 
    '${audit_plan_no}', '${ncr_no}', '${issued_date}', '${responsibility_office}', '${audit_type}', '${audit_scope}', '${to_uic}', 
    '${attention}', '${require_condition_reference}', '${level_finding}', '${problem_analysis}', '${answer_due_date}', '${issue_ian}', 
    '${ian_no}', '${encountered_condition}', '${audit_by}', '${audit_date}', '${acknowledge_by}', '${acknowledge_date}', 
    '${status}', '${temporarylink}', '${copiedDocumentId}')`;
    console.log(query)
    const result = await db.query(query);
    if (result.rowCount === 1) {
        return {
            status: 200,
            message: 'NRC Intial Created'
        }
    } else {
        return {
            status: 404,
            message: 'Error'
        }
    }
}   

/**
 * Download a Document file in PDF format
 * @param{string} fileId file ID
 * @return{obj} file status
 * */
async function exportPdf(fileId) {
    const service = google.drive({ version: 'v3', auth });
    try {
        const res = await service.files.export({
            fileId: fileId,
            mimeType: 'application/pdf',
        }, { responseType: 'stream' });

        return res.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getPDF(temp) {
    const { documentId } = temp; // Extract documentId from temp
    console.log(`${documentId}.pdf`);
    console.log(os.homedir());
    const outputLocationPath = path.join(os.homedir(), 'Downloads', `${documentId}.pdf`);
    console.log(outputLocationPath);

    const authClient = await auth.getClient();
    console.log("TEST AFTER AUTH");

    if (authClient && documentId) {
        console.log("Downloading file...");
        try {
            const fileContent = await exportPdf(documentId);
            const dest = fs.createWriteStream(outputLocationPath);

            return new Promise((resolve, reject) => {
                fileContent.pipe(dest);
                dest.on('finish', () => {
                    console.log("Download Completed");
                    resolve({ success: true, path: outputLocationPath });
                });

                dest.on('error', (err) => {
                    console.error('Error writing file:', err);
                    reject({ success: false, message: 'Error in writing file' });
                });
            });
        } catch (error) {
            console.error('Error during file export:', error);
            throw { success: false, message: 'Error during file export' };
        }
    } else {
        throw { success: false, message: 'Error in setting up Google Drive API client' };
    }
}

async function getPDFDrive(temp) {
    const { documentId } = temp;
    console.log(`${documentId}.pdf`);
    console.log(os.homedir());
    const parentFolderId = '1tkj7lPPXC8IbJrqsk4WwyrMoR3F6RJK0';

    try {
        const authClient = await auth.getClient();
        console.log("TEST AFTER AUTH");

        if (authClient && documentId) {
            try {
                const fileContent = await exportPdf(documentId);

                const tmpFile = tmp.fileSync({ postfix: '.pdf' });
                const dest = fs.createWriteStream(tmpFile.name);

                await new Promise((resolve, reject) => {
                    fileContent.pipe(dest);
                    dest.on('finish', resolve);
                    dest.on('error', reject);
                });

                const fileMetadata = {
                    name: `${documentId}.pdf`,
                    mimeType: 'application/pdf',
                    parents: [parentFolderId],
                };

                const driveService = google.drive({ version: 'v3', auth: authClient });
                const response = await driveService.files.create({
                    resource: fileMetadata,
                    media: {
                        mimeType: 'application/pdf',
                        body: fs.createReadStream(tmpFile.name),
                    },
                    fields: 'id',
                });

                tmpFile.removeCallback();

                console.log('File uploaded to Google Drive, file ID:', response.data.id);

                const fileLink = `https://drive.google.com/file/d/${response.data.id}/view?usp=sharing`;
                console.log('Uploaded file link:', fileLink);

                return { 
                    status: 200, 
                    message: fileLink 
                };
            } catch (error) {
                console.error('Error during file export or upload:', error);
                throw { success: false, message: 'Error during file export or upload' };
            }
        } else {
            console.log('Auth client or document ID not properly initialized.');
            throw { success: false, message: 'Error in setting up Google Drive API client' };
        }
    } catch (authError) {
        console.error('Error getting auth client:', authError);
        throw { success: false, message: 'Error getting auth client' };
    }
}
/*
// Function to download a file from a URL
async function downloadFile(fileUrl, outputLocationPath) {
    const response = await axios({
        url: fileUrl,
        method: 'GET',
        responseType: 'stream'
    });

    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(outputLocationPath);
        response.data.pipe(writer);
        
        let error = null;
        writer.on('error', err => {
            error = err;
            writer.close();
            reject(err);
        });

        writer.on('close', () => {
            if (!error) {
                resolve(true);
            }
        });
    });
}
*/

async function deleteNCRInit(temp) {
    const { ncr_init_id } = temp;
    const query = `DELETE FROM NCR_Initial WHERE ncr_init_id = '${ncr_init_id}'`;
    const result = await db.query(query);
    if (result.rowCount === 1) {
        return {
            message: 'NCR Initial deleted'
        }
    }
    else {
        return {
            message: 'NCR Initial not found'
        }
    }
}

async function UpdateNCRInit(temp) {
    const { accountid, ncr_init_id, regulationbased, subject, audit_plan_no, ncr_no, issued_date, responsibility_office, audit_type, audit_scope, to_uic, attention, require_condition_reference, level_finding, problem_analysis, answer_due_date, issue_ian, ian_no, encountered_condition, audit_by, audit_date, acknowledge_by, acknowledge_date, status, temporarylink, documentid } = temp;
    console.log(temp);
    const query = `UPDATE NCR_Initial SET AccountID = '${accountid}', RegulationBased = '${regulationbased}', Subject = '${subject}', Audit_Plan_No = '${audit_plan_no}', NCR_No = '${ncr_no}', Issued_Date = '${issued_date}', Responsibility_Office = '${responsibility_office}', Audit_Type = '${audit_type}', Audit_Scope = '${audit_scope}', To_UIC = '${to_uic}', Attention = '${attention}', require_condition_reference = '${require_condition_reference}', Level_Finding = '${level_finding}', Problem_Analysis = '${problem_analysis}', Answer_Due_Date = '${answer_due_date}', Issue_IAN = '${issue_ian}', IAN_No = '${ian_no}', Encountered_Condition = '${encountered_condition}', Audit_by = '${audit_by}', Audit_Date = '${audit_date}', Acknowledge_by = '${acknowledge_by}', Acknowledge_date = '${acknowledge_date}', Status = '${status}', TemporaryLink = '${temporarylink}', documentid = '${documentid}' WHERE NCR_init_ID = '${ncr_init_id}';`;
    console.log(query);
    const result = await db.query(query);
    if (result.rowCount === 1) {
        return {
            status: 200, 
            message: 'Update Audit Plan successful'
        }
    } else {
        return {
            status: 404, message: 'Error'
        }
    }
}

async function showNCRInit() {
    const query = `SELECT * FROM NCR_Initial`;
    const result = await db.query(query);
    if (result.rowCount) {
        return {
            status: 200,
            message: 'Showing NCR Intial',
            showProduct: result.rows
        }
    } else {
        return {
            message: 'No Data NCR Initial'
        }
    }
}

// async function showNCRInit_ID(temp) {
//     const { ncr_init_id } = temp;
//     const query = `SELECT * FROM NCR_Initial WHERE ncr_init_id = '${ncr_init_id}'`;
//     const result = await db.query(query);
//     if (result.rowCount) {
//         return {
//             message: 'Showing NCR Intial by ID',
//             showProduct: result.rows
//         }
//     } else {
//         return {
//             message: 'No Data NCR Initial by ID'
//         }
//     }
// }

async function searchNCR(temp) {
    const {input} = temp;
    const numberRegex = /^\d+$/;
    let query;
    if(numberRegex.test(input)){
        query = `SELECT * FROM NCR_Initial WHERE ncr_init_id = '${input}'`;
    }else{
        query = `SELECT * FROM NCR_Initial WHERE audit_by ILIKE '%${input}%' OR to_uic::TEXT ILIKE '%${input}%'`;
    }
    console.log(query);
    const result = await db.query(query);
    if (result.rowCount) {
        console.log("Found");
        return {
            status: 200,
            message: 'Showing result of NCR',
            showProduct: result.rows
        }
    } else {
        return {
            status: 200, // Still return status 200 to indicate the request was successful
            message: 'No Data NCR',
            showProduct: [] // Return an empty array to indicate no results
        }
    }
}

async function showNCRInit_ID(temp) {
    const { ncr_init_id } = temp;
    const query = `SELECT * FROM NCR_Initial WHERE ncr_init_id = '${ncr_init_id}'`;
    const result = await db.query(query);
    if (result.rowCount) {
        return {
            status: 200,
            message: 'Showing NCR Intial by ID',
            showProduct: result.rows
        }
    } else {
        return {
            message: 'No Data NCR Initial by ID'
        }
    }
}

async function addNCRReply(mm) {
    const { accountid, ncr_init_id, rca_problem, corrective_act, preventive_act, identified_by, identified_date, accept_by, audit_accept, temporarylink, Recommend_corrective_action } = mm;
    const query = `INSERT INTO NCR_reply ( AccountID, NCR_init_ID, RCA_problem, Corrective_Action, Preventive_Action, Identified_by_Auditee, Identified_Date, Accept_by_Auditor, Auditor_Accept_date, TemporaryLink,Recommend_corrective_action) VALUES ('${accountid}', '${ncr_init_id}', '${rca_problem}', '${corrective_act}', '${preventive_act}', '${identified_by}', '${identified_date}', '${accept_by}', '${audit_accept}', '${temporarylink}','${Recommend_corrective_action}')`;
    const result = await db.query(query);

    if (result.rowCount === 1) {
        return {
            status: 200,
            message: 'NRC Reply Created'
        }
    } else {
        return {
            message: 'Error'
        }
    }
}

async function deleteNCRReply(temp) {
    const { ncr_init_id } = temp;
    const query = `DELETE FROM NCR_reply WHERE ncr_init_id = '${ncr_init_id}'`;
    const result = await db.query(query);
    if (result.rowCount === 1) {
        return {
            message: 'NCR Reply deleted'
        }
    }
    else {
        return {
            message: 'NCR Reply not found'
        }
    }
}

async function UpdateNCRReply(temp) {
    const { accountid, ncr_init_id, rca_problem, corrective_act, preventive_act, identified_by, identified_date, accept_by, audit_accept, temporarylink } = temp;
    const query = `UPDATE NCR_reply SET AccountID = '${accountid}', RCA_problem  = '${rca_problem}', Corrective_Action  = '${corrective_act}', Preventive_Action  = '${preventive_act}', Identified_by_Auditee  = '${identified_by}', Identified_Date  = '${identified_date}', Accept_by_Auditor  = '${accept_by}', Auditor_Accept_date  = '${audit_accept}', TemporaryLink = '${temporarylink}' WHERE NCR_init_ID = '${ncr_init_id}'`;
    const result = await db.query(query);
    if (result.rowCount === 1) {
        return {
            status: 200, message: 'Update NCR Reply successful'
        }
    } else {
        return {
            status: 404, message: 'Error'
        }
    }
}

async function showNCRReply(mm) {
    const { ncr_init_id } = mm;
    const query = `SELECT * FROM NCR_reply WHERE ncr_init_id = '${ncr_init_id}' `;
    const result = await db.query(query);
    if (result.rowCount) {
        return {
            message: 'Showing NCR Reply',
            showProduct: result.rows
        }
    } else {
        return {
            message: 'No NCR Reply'
        }
    }
}

async function addNCRFollowResult(temp) {
    const { accountid, ncr_init_id, close_corrective, proposed_close_audit, proposed_close_date, is_close, effective, refer_verif, sheet_no, new_ncr_issue_no, close_approvedby, close_approveddate, verif_chied, verif_date, temporarylink } = temp;
    console.log(temp);
    const query = `INSERT INTO NCR_FollowResult ( AccountID, NCR_init_ID, Close_Corrective_Actions , Proposed_Close_Auditee , Proposed_Close_Date , Is_close , effectiveness , Refer_Verification , Sheet_No , New_NCR_Issue_nbr ,  Close_approved_by ,Close_approved_date , Verified_Chief_IM , Verified_Date ,  TemporaryLink) VALUES ('${accountid}', '${ncr_init_id}', '${close_corrective}', '${proposed_close_audit}', '${proposed_close_date}', '${is_close}', '${effective}', '${refer_verif}', '${sheet_no}', '${new_ncr_issue_no}', '${close_approvedby}', '${close_approveddate}', '${verif_chied}', '${verif_date}', '${temporarylink}')`;
    const result = await db.query(query);
    if (result.rowCount === 1) {
        return {
            status: 200,
            message: 'NRC Follow Result Created'
        }
    } else {
        return {
            status: 404,
            message: 'Error'
        }
    }
}

async function deleteNCRFollowResult(temp) {
    const { ncr_init_id } = temp;
    const query = `DELETE FROM NCR_FollowResult WHERE ncr_init_id = '${ncr_init_id}'`;
    const result = await db.query(query);
    if (result.rowCount === 1) {
        return {
            message: 'NCR Follow Result deleted'
        }
    }
    else {
        return {
            message: 'NCR Follow Result not found'
        }
    }
}

async function UpdateNCRFollowResult(temp) {
    const { accountid, ncr_init_id, close_corrective, proposed_close_audit, proposed_close_date, is_close, effective, refer_verif, sheet_no, new_ncr_issue_no, close_approvedby, close_approveddate, verif_chied, verif_date, temporarylink } = temp;
    const query = `UPDATE NCR_FollowResult SET AccountID = '${accountid}', Close_Corrective_Actions   = '${close_corrective}', Proposed_Close_Auditee   = '${proposed_close_audit}', Proposed_Close_Date   = '${proposed_close_date}', Is_close   = '${is_close}', effectiveness   = '${effective}', Refer_Verification   = '${refer_verif}', Sheet_No   = '${sheet_no}', New_NCR_Issue_nbr    = '${new_ncr_issue_no}', Close_approved_by    = '${close_approvedby}', Close_approved_date    = '${close_approveddate}', Verified_Chief_IM    = '${verif_chied}', Verified_Date     = '${verif_date}', TemporaryLink     = '${temporarylink}' WHERE NCR_init_ID = '${ncr_init_id}'`;
    const result = await db.query(query);
    if (result.rowCount === 1) {
        return {
            status: 200, message: 'Update NCR Follow Result successful'
        }
    } else {
        return {
            status: 404, message: 'Error'
        }
    }
}

async function showNCRFollowResult(mm) {
    const { ncr_init_id } = mm;
    const query = `SELECT * FROM NCR_FollowResult WHERE ncr_init_id = '${ncr_init_id}' `;
    const result = await db.query(query);
    if (result.rowCount) {
        return {
            message: 'Showing NCR Reply',
            showProduct: result.rows
        }
    } else {
        return {
            message: 'No NCR Reply'
        }
    }
}

async function searchPersonnel(temp) {
  const {input} = temp;
  const numberRegex = /^\d+$/;
  let query;
  if(numberRegex.test(input)){
      query = `SELECT * FROM NCR_Initial WHERE ncr_init_id = '${input}'`;
  }else{
      query = `SELECT * FROM NCR_Initial WHERE audit_by ILIKE '%${input}%' OR to_uic::TEXT ILIKE '%${input}%'`;
  }
  console.log(query);
  const result = await db.query(query);
  if (result.rowCount) {
      console.log("Found");
      return {
          status: 200,
          message: 'Showing result of NCR',
          showProduct: result.rows
      }
  } else {
      return {
          status: 200, // Still return status 200 to indicate the request was successful
          message: 'No Data NCR',
          showProduct: [] // Return an empty array to indicate no results
      }
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
    UpdateaddIssuence,
    showissuence,
    showOccurrence,
    updateOccurrence,
    deleteOccurrence,
    addCategoryIOR,
    addFollowUpOccurrence,
    addNCRInit,
    deleteNCRInit,
    UpdateNCRInit,
    showNCRInit,
    searchNCR,
    addNCRReply,
    deleteNCRReply,
    UpdateNCRReply,
    showNCRReply,
    getPDF,
    getPDFDrive,
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
    searchIOR,
    searchPersonnel
};