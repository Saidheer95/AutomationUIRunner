const { test } = require('@playwright/test');
const {
  assertDefined,
  assertGreaterThan
} = require('../../utils/assertions');

const ApprovalPage =
  require('../../pages/Approvals/approval.page');

const {
  LoginPage,
  loadCredentials
} = require('../../pages/Login/login.page');

const testData =
  require('../../testdata.json');


test.describe('Approval Flow - Smoke', () => {

  test('should process approval action', async ({ browser }) => {

    const credentials =
      loadCredentials();

    const approvers =
      credentials.approvers;


    // =========================================================
    // VALIDATIONS
    // =========================================================

    assertDefined(
      approvers,
      'Approvers must be configured'
    );

    assertGreaterThan(
      approvers.length,
      0,
      'At least one approver is required'
    );

    assertDefined(
      testData.approvers.number,
      'PR number must be available'
    );


    console.log('\n========================================');
    console.log('        APPROVAL SMOKE FLOW');
    console.log('========================================');
    console.log(
      `PR Number      : ${testData.approvers.number}`
    );
    console.log(
      `Approval Action: Approve`
    );
    console.log(
      `Total Approvers: ${approvers.length}`
    );
    console.log('========================================\n');


    // =========================================================
    // APPROVE FLOW
    // =========================================================

    for (
      let i = 0;
      i < approvers.length;
      i++
    ) {

      const approver =
        approvers[i];

      const isFirstApprover =
        i === 0;

      const approverName =
        approver.name ||
        approver.email;


      console.log('\n========================================');
      console.log(
        `APPROVER ${i + 1} OF ${approvers.length}`
      );
      console.log(
        `Name : ${approverName}`
      );
      console.log(
        `Email: ${approver.email}`
      );
      console.log(
        `First Approver: ${isFirstApprover}`
      );
      console.log('========================================');


      await processApproval(
        browser,
        credentials,
        approver,
        testData,
        isFirstApprover
      );


      console.log(
        `\n${approverName} completed Approve`
      );


      // =======================================================
      // NEXT APPROVER
      // =======================================================

      if (
        i <
        approvers.length - 1
      ) {

        const nextApprover =
          approvers[i + 1];

        const nextApproverName =
          nextApprover.name ||
          nextApprover.email;

        console.log(
          `\nPreparing next approver: ${nextApproverName}`
        );

        console.log(
          'Next approval task will be waited for during login/navigation.'
        );
      }
    }


    console.log('\n========================================');
    console.log('       APPROVAL SMOKE COMPLETED');
    console.log('========================================');

    console.log(
      `PR ${testData.approvers.number} completed approval flow`
    );

    console.log(
      `Total approvers processed: ${approvers.length}`
    );

    console.log('========================================\n');
  });

});


// =================================================================
// PROCESS APPROVAL
// =================================================================

async function processApproval(
  browser,
  credentials,
  approver,
  testData,
  isFirstApprover
) {

  const context =
    await browser.newContext();

  const page =
    await context.newPage();

  const approverName =
    approver.name ||
    approver.email;


  try {

    // ===========================================================
    // LOGIN
    // ===========================================================

    const loginPage =
      new LoginPage(page);

    console.log(
      `[${approverName}] Opening login page`
    );

    await page.goto(
      credentials.loginUrl,
      {
        waitUntil: 'domcontentloaded'
      }
    );

    console.log(
      `[${approverName}] Login page opened`
    );


    console.log(
      `[${approverName}] Logging in`
    );

    await loginPage.login(
      approver.email,
      approver.password
    );

    console.log(
      `[${approverName}] Logged in successfully`
    );

    console.log(
      `[${approverName}] Current URL: ${page.url()}`
    );


    // ===========================================================
    // APPROVAL PAGE
    // ===========================================================

    const approvalPage =
      new ApprovalPage(page);

    console.log(
      `[${approverName}] Navigating to approval request`
    );

    await approvalPage.navigateToApprovalRequest(
      testData
    );

    console.log(
      `[${approverName}] Approval request opened`
    );


    // ===========================================================
    // APPROVE
    // ===========================================================

    console.log(
      `[${approverName}] Processing Approve`
    );

    await approvalPage.approvePR(
      testData,
      isFirstApprover
    );


    // ===========================================================
    // SUCCESS
    // ===========================================================

    console.log(
      `[${approverName}] Approve completed successfully`
    );

    await page.waitForLoadState(
      'networkidle'
    ).catch(() => {});


  } catch (error) {

    // ===========================================================
    // ERROR DETAILS
    // ===========================================================

    console.error('\n========================================');
    console.error(
      `ERROR FOR APPROVER: ${approverName}`
    );
    console.error(
      `EMAIL            : ${approver.email}`
    );
    console.error(
      `ACTION            : Approve`
    );
    console.error(
      `PR NUMBER         : ${testData.approvers.number}`
    );
    console.error(
      `CURRENT URL       : ${page.url()}`
    );
    console.error('========================================');

    console.error(error);

    throw error;

  } finally {

    // ===========================================================
    // CLOSE SESSION
    // ===========================================================

    console.log(
      `[${approverName}] Closing browser context`
    );

    await context.close();

    console.log(
      `[${approverName}] Browser context closed`
    );
  }
}
