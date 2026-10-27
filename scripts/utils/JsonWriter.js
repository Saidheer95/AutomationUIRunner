const fs = require('fs');
const path = require('path');

class JsonWriter {
  static getTestResultsFilePath() {
    const timestamp = new Date().toISOString().split('T')[0];
    return path.join(
      __dirname,
      '..',
      'test-results',
      `test-results-${timestamp}.json`
    );
  }

  static ensureTestResultsDir() {
    const dir = path.join(__dirname, '..', 'test-results');

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  static savePRTestData(prNumber, testData, lines = []) {
    this.ensureTestResultsDir();

    const filePath = this.getTestResultsFilePath();
    let allResults = {};

    if (fs.existsSync(filePath)) {
      allResults = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    allResults.prTests = allResults.prTests || [];

    const prTest = {
      timestamp: new Date().toISOString(),
      prNumber,
      testData,
      lineItems: lines,
      totalLines: lines.length,
      status: 'completed'
    };

    allResults.prTests.push(prTest);

    fs.writeFileSync(
      filePath,
      JSON.stringify(allResults, null, 4)
    );

    console.log(`PR Test Data saved to: ${filePath}`);
    console.log(`PR Number: ${prNumber}`);
    console.log(`Lines Added: ${lines.length}`);

    return prNumber;
  }

  static savePRNumber(prNumber) {
    const filePath = path.join(
      __dirname,
      '..',
      'testdata.json'
    );

    let data = {};

    if (fs.existsSync(filePath)) {
      data = JSON.parse(
        fs.readFileSync(filePath, 'utf8')
      );
    }

    data.addLine = data.addLine || {};
    data.approvers = data.approvers || {};

    data.addLine.prNumber = prNumber;
    data.approvers.number = prNumber;

    fs.writeFileSync(
      filePath,
      JSON.stringify(data, null, 4)
    );

    console.log('PR Number saved:', prNumber);
    console.log('Approver Number saved:', prNumber);
  }

  static savePONumber(poNumber) {
    const filePath = path.join(
      __dirname,
      '..',
      'testdata.json'
    );

    let data = {};

    if (fs.existsSync(filePath)) {
      data = JSON.parse(
        fs.readFileSync(filePath, 'utf8')
      );
    }

    data.purchaseOrder = data.purchaseOrder || {};
    data.approvers = data.approvers || {};


    data.purchaseOrder.poNumber = poNumber;
    data.approvers.number = poNumber;


    fs.writeFileSync(
      filePath,
      JSON.stringify(data, null, 4)
    );

    console.log('PO Number saved:', poNumber);
  }

  static saveBIDNumber(bidNumber){
    const filePath=path.join(
        __dirname,
        '..',
        'testdata.json'
    );

    let data={};

    if(fs.existsSync(filePath)){
        data=JSON.parse(
            fs.readFileSync(filePath,'utf8')
        );
    }

    data.supplierBid=data.supplierBid||{};

    data.supplierBid.bidNumber=bidNumber;

    fs.writeFileSync(
        filePath,
        JSON.stringify(data,null,4)
    );

    console.log('BID Number saved:',bidNumber);

    return bidNumber;
  }



  static saveContractNumber(contractNumber){
    const filePath=path.join(
        __dirname,
        '..',
        'testdata.json'
    );

    let data={};

    if(fs.existsSync(filePath)){
        data=JSON.parse(
            fs.readFileSync(filePath,'utf8')
        );
    }

    // data.supplierBid=data.supplierBid||{};

    data.contractNumber=contractNumber;

    fs.writeFileSync(
        filePath,
        JSON.stringify(data,null,4)
    );

    console.log('Contract Number saved:',contractNumber);

    return contractNumber;
  }


  static saveApprovalData(prNumber, approvalData) {
    this.ensureTestResultsDir();

    const filePath = this.getTestResultsFilePath();
    let allResults = {};

    if (fs.existsSync(filePath)) {
      allResults = JSON.parse(
        fs.readFileSync(filePath, 'utf8')
      );
    }

    allResults.approvals = allResults.approvals || [];

    const approval = {
      timestamp: new Date().toISOString(),
      prNumber,
      ...approvalData
    };

    allResults.approvals.push(approval);

    fs.writeFileSync(
      filePath,
      JSON.stringify(allResults, null, 4)
    );

    console.log(`Approval Data saved - PR: ${prNumber}`);
  }
}

module.exports = JsonWriter;