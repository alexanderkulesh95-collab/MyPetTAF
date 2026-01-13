const faker = require('faker');

/**
 * Data Generator Utility for creating test data
 */
class DataGenerator {
  
  /**
   * Generate random user data
   * @param {object} overrides - Optional fields to override
   * @returns {object} User data object
   */
  static generateUser(overrides = {}) {
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: this.generatePassword(),
      phone: faker.phone.phoneNumber(),
      dateOfBirth: faker.date.past(30, '2005-01-01').toISOString().split('T')[0],
      address: {
        street: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        zipCode: faker.address.zipCode(),
        country: faker.address.country()
      },
      company: {
        name: faker.company.companyName(),
        jobTitle: faker.name.jobTitle(),
        department: faker.commerce.department()
      },
      ...overrides
    };
  }

  /**
   * Generate a secure password
   * @param {number} length - Password length (default: 12)
   * @param {boolean} includeSpecialChars - Include special characters
   * @returns {string} Generated password
   */
  static generatePassword(length = 12, includeSpecialChars = true) {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let charset = uppercase + lowercase + numbers;
    if (includeSpecialChars) {
      charset += special;
    }
    
    let password = '';
    // Ensure at least one character from each category
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    
    if (includeSpecialChars) {
      password += special[Math.floor(Math.random() * special.length)];
    }
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Generate random product data
   * @param {object} overrides - Optional fields to override
   * @returns {object} Product data object
   */
  static generateProduct(overrides = {}) {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      category: faker.commerce.department(),
      sku: faker.random.alphaNumeric(10).toUpperCase(),
      stock: faker.datatype.number({ min: 0, max: 1000 }),
      manufacturer: faker.company.companyName(),
      rating: parseFloat((Math.random() * 5).toFixed(1)),
      ...overrides
    };
  }

  /**
   * Generate random credit card data
   * @returns {object} Credit card data
   */
  static generateCreditCard() {
    return {
      number: faker.finance.creditCardNumber(),
      cvv: faker.finance.creditCardCVV(),
      expirationDate: this.generateFutureDate(1, 5),
      cardholderName: faker.name.findName(),
      type: faker.helpers.randomize(['Visa', 'MasterCard', 'American Express', 'Discover'])
    };
  }

  /**
   * Generate random company data
   * @param {object} overrides - Optional fields to override
   * @returns {object} Company data
   */
  static generateCompany(overrides = {}) {
    return {
      name: faker.company.companyName(),
      catchPhrase: faker.company.catchPhrase(),
      industry: faker.commerce.department(),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      website: faker.internet.url(),
      address: {
        street: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        zipCode: faker.address.zipCode(),
        country: faker.address.country()
      },
      ...overrides
    };
  }

  /**
   * Generate a future date
   * @param {number} minYears - Minimum years in future
   * @param {number} maxYears - Maximum years in future
   * @returns {string} Date string in MM/YY format
   */
  static generateFutureDate(minYears = 1, maxYears = 5) {
    const currentDate = new Date();
    const futureYears = Math.floor(Math.random() * (maxYears - minYears + 1)) + minYears;
    const futureDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + futureYears));
    
    const month = String(futureDate.getMonth() + 1).padStart(2, '0');
    const year = String(futureDate.getFullYear()).slice(-2);
    
    return `${month}/${year}`;
  }

  /**
   * Generate random order data
   * @param {object} overrides - Optional fields to override
   * @returns {object} Order data
   */
  static generateOrder(overrides = {}) {
    const itemCount = faker.datatype.number({ min: 1, max: 5 });
    const items = Array.from({ length: itemCount }, () => this.generateProduct());
    const subtotal = items.reduce((sum, item) => sum + (item.price * faker.datatype.number({ min: 1, max: 3 })), 0);
    const tax = subtotal * 0.08;
    const shipping = faker.datatype.number({ min: 5, max: 20 });
    
    return {
      orderNumber: faker.random.alphaNumeric(12).toUpperCase(),
      orderDate: faker.date.recent().toISOString(),
      status: faker.helpers.randomize(['pending', 'processing', 'shipped', 'delivered']),
      items: items,
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      total: parseFloat((subtotal + tax + shipping).toFixed(2)),
      shippingAddress: {
        street: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        zipCode: faker.address.zipCode(),
        country: faker.address.country()
      },
      ...overrides
    };
  }

  /**
   * Generate random email
   * @param {string} domain - Email domain (optional)
   * @returns {string} Email address
   */
  static generateEmail(domain = null) {
    if (domain) {
      const username = faker.internet.userName().toLowerCase();
      return `${username}@${domain}`;
    }
    return faker.internet.email();
  }

  /**
   * Generate unique email with timestamp
   * @param {string} prefix - Email prefix (optional)
   * @returns {string} Unique email address
   */
  static generateUniqueEmail(prefix = 'test') {
    const timestamp = Date.now();
    const random = faker.random.alphaNumeric(5).toLowerCase();
    return `${prefix}_${timestamp}_${random}@test.com`;
  }

  /**
   * Generate random phone number
   * @param {string} format - Phone format (US, UK, etc.)
   * @returns {string} Phone number
   */
  static generatePhoneNumber(format = 'US') {
    return faker.phone.phoneNumber();
  }

  /**
   * Generate random date in range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {string} Date string
   */
  static generateDateInRange(startDate, endDate) {
    return faker.date.between(startDate, endDate).toISOString().split('T')[0];
  }

  /**
   * Generate array of items
   * @param {Function} generator - Generator function
   * @param {number} count - Number of items to generate
   * @returns {Array} Array of generated items
   */
  static generateArray(generator, count = 5) {
    return Array.from({ length: count }, () => generator());
  }

  /**
   * Generate random alphanumeric string
   * @param {number} length - String length
   * @returns {string} Random string
   */
  static generateRandomString(length = 10) {
    return faker.random.alphaNumeric(length);
  }

  /**
   * Generate random number in range
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number
   */
  static generateRandomNumber(min = 0, max = 100) {
    return faker.datatype.number({ min, max });
  }

  /**
   * Pick random item from array
   * @param {Array} array - Array to pick from
   * @returns {*} Random item
   */
  static pickRandom(array) {
    return faker.helpers.randomize(array);
  }
}

module.exports = DataGenerator;
