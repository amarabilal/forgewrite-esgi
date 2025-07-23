const API_URL = 'http://localhost:3000/api';

async function createTestAdmin() {
  try {
    // Create test admin user
    const response = await fetch(`${API_URL}/auth/register-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@test.com',
        password: 'admin123'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Test admin user created:', data);
    } else if (response.status === 409) {
      console.log('Admin user already exists');
    } else {
      console.error('Error creating admin user:', data);
    }
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }
}

async function createTestUser() {
  try {
    // Create test regular user
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@test.com',
        password: 'user123'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Test user created:', data);
    } else if (response.status === 409) {
      console.log('Test user already exists');
    } else {
      console.error('Error creating test user:', data);
    }
  } catch (error) {
    console.error('Error creating test user:', error.message);
  }
}

async function main() {
  console.log('Creating test users...');
  await createTestAdmin();
  await createTestUser();
  console.log('Done!');
}

main();
