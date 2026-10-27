const {test}=require('@playwright/test');
const Purchase_Requisitions=require('../../pages/PurchaseRequisition/purchaserequisition.page');
const Add_Pr_Line=require('../../pages/PurchaseRequisition/addPrLine.page');
const Submit_Approval=require('../../pages/PurchaseRequisition/purchasesubmit_approval.page');
const Create_Bid=require('../../pages/PR_BID/bidsRFQ.page');
const Approvals=require('../../pages/Approvals/approval.page');
const SupplierResponse=require('../../pages/SupplierSideResponse/supplierSideResponse.page');
const {LoginPage,loadCredentials}=require('../../pages/Login/login.page');
const testData=require('../../testdata.json');

test.describe('End to End Flow',()=>{
    test.setTimeout(10*60*1000);

    test('Create PR -> Approve PR -> Create Bid -> Supplier Response',async({browser})=>{
        const credentials=loadCredentials();
        let prNumber=null;
        let bidNumber=null;

        console.log('');
        console.log('========================================');
        console.log('       VALIDATING TEST DATA');
        console.log('========================================');

        if(!credentials.loginUrl){
            throw new Error('loginUrl is missing in credentials.json');
        }

        if(!credentials.requestor||!credentials.requestor.email||!credentials.requestor.password){
            throw new Error('Requestor credentials are missing in credentials.json');
        }

        if(!Array.isArray(credentials.approvers)||credentials.approvers.length===0){
            throw new Error('Approvers must be configured as a non-empty array in credentials.json');
        }

        for(let i=0;i<credentials.approvers.length;i++){
            const approver=credentials.approvers[i];

            if(!approver||!approver.email||!approver.password){
                throw new Error(`Approver ${i+1} credentials are missing in credentials.json`);
            }
        }

        if(!credentials.buyer||!credentials.buyer.email||!credentials.buyer.password){
            throw new Error('Buyer credentials are missing in credentials.json');
        }

        if(!credentials.supplier||!credentials.supplier.email||!credentials.supplier.password){
            throw new Error('Supplier credentials are missing in credentials.json');
        }

        if(!testData.approvers){
            throw new Error('testData.approvers object is missing from testdata.json');
        }

        if(!testData.addLine){
            throw new Error('testData.addLine object is missing from testdata.json');
        }

        if(!testData.supplierBid){
            throw new Error('testData.supplierBid object is missing from testdata.json');
        }

        console.log(`Configured Approvers: ${credentials.approvers.length}`);

        console.log('');
        console.log('========================================');
        console.log('       E2E FLOW STARTED');
        console.log('========================================');

        // =====================================================
        // REQUESTOR LOGIN
        // =====================================================

        console.log('');
        console.log('========================================');
        console.log('       REQUESTOR LOGIN');
        console.log('========================================');

        const requestorContext=await browser.newContext();
        const requestorPage=await requestorContext.newPage();
        const requestorLogin=new LoginPage(requestorPage);

        try{
            await requestorPage.goto(credentials.loginUrl,{
                waitUntil:'domcontentloaded',
                timeout:60000
            });

            console.log(
                `Requestor login page opened: ${requestorPage.url()}`
            );

            await requestorLogin.login(
                credentials.requestor.email,
                credentials.requestor.password
            );

            console.log(
                `Requestor logged in: ${credentials.requestor.email}`
            );

            console.log('');
            console.log('========================================');
            console.log('          CREATE PR');
            console.log('========================================');

            const purchaseRequisitionPage=new Purchase_Requisitions(requestorPage);

            await purchaseRequisitionPage.createPurchaseRequisitionPage(testData);

            console.log('PR created.');

            // =================================================
            // ADD PR LINE
            // =================================================

            const addPrLinePage=new Add_Pr_Line(requestorPage);

            await addPrLinePage.addPurchaseRequisitionLine(testData);

            console.log('PR line added.');

            // =================================================
            // SUBMIT PR
            // =================================================

            const submitApprovalPage=new Submit_Approval(requestorPage);

            await submitApprovalPage.submitForApproval();

            console.log('PR submitted for approval.');

            // =================================================
            // GET PR NUMBER
            // =================================================

            prNumber=await purchaseRequisitionPage.getPRNumber();

            if(!prNumber){
                throw new Error(
                    'PR number was not generated after PR creation.'
                );
            }

            console.log(`Generated PR Number: ${prNumber}`);

            // =================================================
            // SAVE PR NUMBER FOR APPROVAL
            // =================================================

            testData.approvers.number=prNumber;

            // =================================================
            // SAVE PR NUMBER FOR BID
            // =================================================

            testData.addLine.prNumber=prNumber;

            console.log(
                `Approver PR Number: ${testData.approvers.number}`
            );

            console.log(
                `Bid PR Number: ${testData.addLine.prNumber}`
            );

            await requestorLogin.logout();

            console.log('Requestor logout completed.');

        }finally{
            try{
                await requestorContext.close();
            }catch(error){
                console.log(
                    `Requestor context close warning: ${error.message}`
                );
            }
        }

        if(!prNumber){
            throw new Error(
                'Cannot continue approval flow because PR number is missing.'
            );
        }

        // =====================================================
        // APPROVAL FLOW
        // =====================================================

        console.log('');
        console.log('========================================');
        console.log('       APPROVAL FLOW');
        console.log('========================================');

        console.log(
            `PR Number: ${testData.approvers.number}`
        );

        console.log(
            `Total Approvers: ${credentials.approvers.length}`
        );

        for(
            let approverIndex=0;
            approverIndex<credentials.approvers.length;
            approverIndex++
        ){
            const approver=credentials.approvers[approverIndex];
            const approverNumber=approverIndex+1;

            console.log('');
            console.log('========================================');
            console.log(
                `       APPROVER ${approverNumber} LOGIN`
            );
            console.log('========================================');

            console.log(
                `Approver ${approverNumber}: ${approver.email}`
            );

            const approverContext=await browser.newContext();
            const approverPage=await approverContext.newPage();
            const approverLogin=new LoginPage(approverPage);

            try{
                await approverPage.goto(credentials.loginUrl,{
                    waitUntil:'domcontentloaded',
                    timeout:60000
                });

                await approverLogin.login(
                    approver.email,
                    approver.password
                );

                console.log(
                    `Approver ${approverNumber} logged in successfully.`
                );

                console.log(
                    `Searching PR: ${testData.approvers.number}`
                );

                const approvalFlowPage=new Approvals(approverPage);

                await approvalFlowPage.navigateToApprovalRequest(testData);

                const isFirstApprover=approverIndex===0;

                await approvalFlowPage.approvePR(
                    testData,
                    isFirstApprover
                );

                console.log(
                    `Approver ${approverNumber} approved PR ${testData.approvers.number} successfully.`
                );

                await approverLogin.logout();

                console.log(
                    `Approver ${approverNumber} logout completed.`
                );

            }finally{
                try{
                    await approverContext.close();
                }catch(error){
                    console.log(
                        `Approver ${approverNumber} context close warning: ${error.message}`
                    );
                }
            }

            console.log(
                `Approver ${approverNumber} browser context closed.`
            );

            if(
                approverIndex<
                credentials.approvers.length-1
            ){
                console.log(
                    'Waiting for next approver task to be generated...'
                );

                await new Promise(
                    resolve=>setTimeout(resolve,5000)
                );

                console.log(
                    'Continuing with next approver.'
                );
            }
        }

        console.log('');
        console.log('========================================');
        console.log('       ALL APPROVERS COMPLETED');
        console.log('========================================');

        console.log(
            `PR ${testData.approvers.number} approved by all approvers.`
        );

        // =====================================================
        // BUYER LOGIN
        // =====================================================

        console.log('');
        console.log('========================================');
        console.log('          BUYER LOGIN');
        console.log('========================================');

        const buyerContext=await browser.newContext();
        const buyerPage=await buyerContext.newPage();
        const buyerLogin=new LoginPage(buyerPage);

        try{
            await buyerPage.goto(credentials.loginUrl,{
                waitUntil:'domcontentloaded',
                timeout:60000
            });

            console.log(
                `Buyer login page opened: ${buyerPage.url()}`
            );

            await buyerLogin.login(
                credentials.buyer.email,
                credentials.buyer.password
            );

            console.log(
                `Buyer logged in: ${credentials.buyer.email}`
            );

            // =================================================
            // CREATE BID
            // =================================================

            console.log('');
            console.log('========================================');
            console.log('          CREATE BID');
            console.log('========================================');

            testData.addLine.prNumber=
                testData.approvers.number;

            console.log(
                `Using approved PR for bid creation: ${testData.addLine.prNumber}`
            );

            const createBidPage=new Create_Bid(buyerPage);

            // IMPORTANT:
            // createBid() already saves the generated bid number
            // to JSON. It does not need to return the number.

            await createBidPage.createBid(testData);

            console.log(
                'Bid creation completed.'
            );

            // =================================================
            // GET BID NUMBER FROM testData
            // =================================================

            bidNumber=testData.supplierBid.bidNumber;

            console.log(
                `Bid Number from testData: ${bidNumber}`
            );

            if(!bidNumber){
                throw new Error(
                    'Bid number was not saved after bid creation.'
                );
            }

            console.log(
                `Bid Created Successfully: ${bidNumber}`
            );

            // =================================================
            // BUYER LOGOUT
            // =================================================

            await buyerLogin.logout();

            console.log(
                'Buyer logout completed.'
            );

        }finally{
            try{
                await buyerContext.close();
            }catch(error){
                console.log(
                    `Buyer context close warning: ${error.message}`
                );
            }
        }

        // =====================================================
        // SUPPLIER LOGIN
        // =====================================================

        console.log('');
        console.log('========================================');
        console.log('       SUPPLIER LOGIN');
        console.log('========================================');

        console.log(
            `Supplier response Bid Number: ${testData.supplierBid.bidNumber}`
        );

        const supplierContext=await browser.newContext();
        const supplierPage=await supplierContext.newPage();
        const supplierLogin=new LoginPage(supplierPage);

        try{
            await supplierPage.goto(credentials.loginUrl,{
                waitUntil:'domcontentloaded',
                timeout:60000
            });

            console.log(
                `Supplier login page opened: ${supplierPage.url()}`
            );

            await supplierLogin.login(
                credentials.supplier.email,
                credentials.supplier.password
            );

            console.log(
                `Supplier logged in: ${credentials.supplier.email}`
            );

            // =================================================
            // SUPPLIER Acknoweledge
            // =================================================

            console.log('');
            console.log('========================================');
            console.log('       SUPPLIER RESPONSE');
            console.log('========================================');

            console.log(
                `Searching Bid: ${testData.supplierBid.bidNumber}`
            );

            console.log(
                `Response Type: ${testData.supplierBid.typeAction}`
            );

            const supplierResponsePage=
                new SupplierResponse(supplierPage);

            await supplierResponsePage.submitResponse(testData);

            console.log('');
            console.log(
                `Supplier response submitted successfully for Bid ${testData.supplierBid.bidNumber}`
            );

            // =================================================
            // SUPPLIER LOGOUT
            // =================================================

            await supplierLogin.logout();

            console.log(
                'Supplier logout completed.'
            );

        }finally{
            try{
                await supplierContext.close();
            }catch(error){
                console.log(
                    `Supplier context close warning: ${error.message}`
                );
            }
        }

        // =====================================================
        // FINAL VALIDATION
        // =====================================================

        if(!prNumber){
            throw new Error(
                'Final validation failed: PR number is missing.'
            );
        }

        if(!testData.approvers.number){
            throw new Error(
                'Final validation failed: approver PR number is missing.'
            );
        }

        if(!testData.addLine.prNumber){
            throw new Error(
                'Final validation failed: bid PR number is missing.'
            );
        }

        if(!bidNumber){
            throw new Error(
                'Final validation failed: bid number is missing.'
            );
        }

        if(!testData.supplierBid.bidNumber){
            throw new Error(
                'Final validation failed: supplier bid number is missing.'
            );
        }

        if(
            testData.approvers.number!==prNumber
        ){
            throw new Error(
                `PR number mismatch. Expected ${prNumber}, got ${testData.approvers.number}`
            );
        }

        if(
            testData.addLine.prNumber!==prNumber
        ){
            throw new Error(
                `Bid PR number mismatch. Expected ${prNumber}, got ${testData.addLine.prNumber}`
            );
        }

        console.log('');
        console.log('========================================');
        console.log('       END TO END FLOW COMPLETED');
        console.log('========================================');

        console.log(
            `PR Number                 : ${prNumber}`
        );

        console.log(
            `Approver PR Number        : ${testData.approvers.number}`
        );

        console.log(
            `Bid PR Number             : ${testData.addLine.prNumber}`
        );

        console.log(
            `Bid Number                : ${bidNumber}`
        );

        console.log(
            `Supplier Bid Number       : ${testData.supplierBid.bidNumber}`
        );

        console.log(
            `Supplier Response Type    : ${testData.supplierBid.typeAction}`
        );

    });
});