const API_URL = 'http://localhost:3000/api';

async function testAdminLogin() {
  try {
    console.log('Testing admin login...');
    
    // Login as admin
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@test.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (!loginResponse.ok) {
      console.error('Login failed:', loginData);
      return;
    }
    
    console.log('Login successful:', loginData);
    const accessToken = loginData.accessToken;
    
    // Test admin users endpoint
    console.log('\nTesting admin users endpoint...');
    const usersResponse = await fetch(`${API_URL}/admin/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });
    
    const usersData = await usersResponse.json();
    
    if (usersResponse.ok) {
      console.log('Admin users fetch successful:', usersData);
    } else {
      console.error('Admin users fetch failed:', usersResponse.status, usersData);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAdminLogin();
