/**
 * Test Data Fixtures
 * Static test data for use in test cases
 */

const testUsers = {
  validUser: {
    username: 'testuser123',
    email: 'testuser@example.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    phone: '+1234567890'
  },
  
  adminUser: {
    username: 'adminuser',
    email: 'admin@example.com',
    password: 'AdminPass123!',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  
  invalidUser: {
    username: 'invalid',
    email: 'invalid@example.com',
    password: 'wrongpassword'
  },

  // Demo site credentials
  demoUser: {
    username: 'standard_user',
    password: 'secret_sauce'
  },
  
  lockedUser: {
    username: 'locked_out_user',
    password: 'secret_sauce'
  },
  
  problemUser: {
    username: 'problem_user',
    password: 'secret_sauce'
  }
};

const testProducts = [
  {
    id: 1,
    name: 'Laptop Pro',
    price: 1299.99,
    category: 'Electronics',
    inStock: true,
    quantity: 50
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    price: 29.99,
    category: 'Accessories',
    inStock: true,
    quantity: 200
  },
  {
    id: 3,
    name: 'USB-C Cable',
    price: 12.99,
    category: 'Accessories',
    inStock: false,
    quantity: 0
  }
];

const testCompanies = [
  {
    name: 'Tech Corp Inc.',
    industry: 'Technology',
    employees: 500,
    founded: 2010
  },
  {
    name: 'Digital Solutions LLC',
    industry: 'IT Services',
    employees: 150,
    founded: 2015
  }
];

const testOrders = [
  {
    orderId: 'ORD-001',
    customerId: 'CUST-123',
    items: [
      { productId: 1, quantity: 1, price: 1299.99 },
      { productId: 2, quantity: 2, price: 29.99 }
    ],
    total: 1359.97,
    status: 'pending'
  }
];

const apiEndpoints = {
  users: {
    getAll: '/api/users',
    getById: '/api/users/:id',
    create: '/api/users',
    update: '/api/users/:id',
    delete: '/api/users/:id'
  },
  products: {
    getAll: '/api/products',
    getById: '/api/products/:id',
    create: '/api/products',
    update: '/api/products/:id',
    delete: '/api/products/:id'
  },
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    register: '/api/auth/register',
    forgotPassword: '/api/auth/forgot-password'
  }
};

const errorMessages = {
  invalidCredentials: 'Invalid username or password',
  requiredField: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  passwordTooShort: 'Password must be at least 8 characters',
  userNotFound: 'User not found',
  unauthorized: 'Unauthorized access',
  serverError: 'Internal server error'
};

const successMessages = {
  loginSuccess: 'Login successful',
  registrationSuccess: 'Registration successful',
  updateSuccess: 'Update successful',
  deleteSuccess: 'Delete successful'
};

module.exports = {
  testUsers,
  testProducts,
  testCompanies,
  testOrders,
  apiEndpoints,
  errorMessages,
  successMessages
};
