class TestDataGenerator1 {
  static usedPhoneNumbers = new Set();
  static usedEmails = new Set();
  static usedCompanyNames = new Set();

  static randomString(length = 6) {
    return Math.random().toString(36).substring(2, 2 + length);
  }

  static randomEmail() {
    let email;
    do {
      email = `user_${this.randomString(5)}@testmail.com`;
    } while (this.usedEmails.has(email));
    this.usedEmails.add(email);
    return email;
  }

  static randomCompanyName() {
    let name;
    do {
      name = `Vendor_${this.randomString(4)}`;
    } while (this.usedCompanyNames.has(name));
    this.usedCompanyNames.add(name);
    return name;
  }

  static randomAddress() {
    return `Street_${Math.floor(Math.random() * 1000)}, Test Area`;
  }

  static randomCity() {
    const cities = ['Hyderabad', 'Bangalore', 'Mumbai', 'Chennai'];
    return cities[Math.floor(Math.random() * cities.length)];
  }

  static randomPhoneNumber() {
    // Compatibility with UAE mobile field that adds +971 country code automatically.
    // Generate national number part only (e.g., 50XXXXXXX).
    const prefixes = ['50', '52', '54', '55', '56', '58'];
    let number;
    do {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const local = Math.floor(1000000 + Math.random() * 9000000).toString();
      number = `${prefix}${local}`;
    } while (this.usedPhoneNumbers.has(number));
    this.usedPhoneNumbers.add(number);
    return number;
  }

  static randomLicenseNumber() {
    return `LIC${Math.floor(100000 + Math.random() * 900000)}`;
  }

  static randomZip() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static randomDNNumber(){
    const text="ASN";
    const number = Math.floor(100000 + Math.random() * 900000).toString();
    return text+ number;
  }

  static randomReceiptNumber(){ 
    const text="  RCPT";
    const   number = Math.floor(100000 + Math.random() * 900000).toString();  
    return text + number;
  }

  static randomInvoicenumber(){
    const text="INV";
    const number = Math.floor(100000 + Math.random() * 900000).toString();
    return text+ number;    
  }

  // ============ PR-SPECIFIC RANDOM DATA ============

  static randomPRDescription() {
    const types = ['Software', 'Hardware', 'Services', 'Licenses', 'Infrastructure'];
    const purposes = ['License renewal', 'New purchase', 'Replacement', 'Upgrade', 'Maintenance'];
    const type = types[Math.floor(Math.random() * types.length)];
    const purpose = purposes[Math.floor(Math.random() * purposes.length)];
    return `${type} purchase requisition - ${purpose} on ${new Date().toISOString().split('T')[0]}`;
  }

  static randomProductName() {
    const products = [
      '777 - Laptops',
      '501 - Desktop Computers',
      '502 - Monitors',
      '503 - Keyboards',
      '504 - Mice',
      '505 - Printers',
      '506 - Scanners',
      '507 - Network Equipment',
      '508 - Storage Devices',
      '509 - Software Licenses'
    ];
    return products[Math.floor(Math.random() * products.length)];
  }

  static randomQuantity() {
    return Math.floor(Math.random() * 20) + 1; // 1-20
  }

  static randomPrice() {
    return (Math.random() * 5000 + 100).toFixed(2); // 100-5100
  }

  static randomUOM() {
    const uoms = ['Each', 'Box', 'Pack', 'Set', 'Pair', 'Dozen'];
    return uoms[Math.floor(Math.random() * uoms.length)];
  }

  static randomNeedByDate(daysFromNow = null) {
    const date = new Date();
    if (daysFromNow === null) {
      daysFromNow = Math.floor(Math.random() * 30) + 1; // 1-30 days
    }
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  }

  static randomDeliveryLocation() {
    const locations = ['Hyderabad', 'Bangalore', 'Mumbai', 'Chennai', 'New Delhi', 'Pune', 'Ahmedabad'];
    return locations[Math.floor(Math.random() * locations.length)];
  }

}

module.exports = {TestDataGenerator1};