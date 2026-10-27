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


test.describe('Approval Flow - Regression', () => {


  // ===========================================================
  // REJECT
  // ===========================================================

  test('should reject approval request', async ({ browser }) => {

    await processRegressionAction(
      browser,
      'Reject'
    );

  });


  // ===========================================================
  // REQUEST FOR MORE INFO
  // ===========================================================

  test('should request more information for approval request', async ({ browser }) => {

    await processRegressionAction(
      browser,
      'Request For More Info'
    );

  });

});


// =================================================================
// PROCESS REGRESSION ACTION
// =================================================================

async function processRegressionAction(
  browser,
  action
) {

  const credentials =
    loadCredentials();

  const approvers =
    credentials.approvers;


  // =============================================================
  // VALIDATIONS
  // =============================================================

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


  // =============================================================
  // FIRST APPROVER ONLY
  // =============================================================

  const approver =
    approvers[0];

  const approverName =
    approver.name ||
    approver.email;


  console.log('\n========================================');
  console.log('       APPROVAL REGRESSION FLOW');
  console.log('========================================');
  console.log(
    `PR Number : ${testData.approvers.number}`
  );
  console.log(
    `Action    : ${action}`
  );
  console.log(
    `Approver  : ${approverName}`
  );
  console.log(
    `Email     : ${approver.email}`
  );
  console.log('========================================\n');


  const context =
    await browser.newContext();

  const page =
    await context.newPage();


  try {

    // =========================================================
    // LOGIN
    // =========================================================

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

    await loginPage.login(
      approver.email,
      approver.password
    );

    console.log(
      `[${approverName}] Logged in successfully`
    );


    // =========================================================
    // OPEN APPROVAL REQUEST
    // =========================================================

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


    // =========================================================
    // PROCESS REGRESSION ACTION
    // =========================================================

    if (action === 'Reject') {

      console.log(
        `[${approverName}] Processing Reject`
      );

      await approvalPage.rejectPR(
        testData
      );

    } else if (
      action === 'Request For More Info'
    ) {

      console.log(
        `[${approverName}] Processing Request For More Info`
      );

      await approvalPage.requestMoreInfo(
        testData
      );

    } else {

      throw new Error(
        `Unsupported regression action: ${action}`
      );
    }


    // =========================================================
    // SUCCESS
    // =========================================================

    console.log(
      `[${approverName}] ${action} completed successfully`
    );

    await page.waitForLoadState(
      'networkidle'
    ).catch(() => {});


  } catch (error) {

    // =========================================================
    // ERROR
    // =========================================================

    console.error('\n========================================');
    console.error(
      `REGRESSION FAILED`
    );
    console.error(
      `Approver : ${approverName}`
    );
    console.error(
      `Email    : ${approver.email}`
    );
    console.error(
      `Action   : ${action}`
    );
    console.error(
      `PR Number: ${testData.approvers.number}`
    );
    console.error(
      `URL      : ${page.url()}`
    );
    console.error('========================================');

    console.error(error);

    throw error;

  } finally {

    console.log(
      `[${approverName}] Closing browser context`
    );

    await context.close();

    console.log(
      `[${approverName}] Browser context closed`
    );
  }
}
