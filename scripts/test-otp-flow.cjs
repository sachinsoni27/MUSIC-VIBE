const axios = require('axios');

const API = process.env.API || 'http://localhost:3000';

async function run() {
  try {
    const now = Date.now();
    const email = `test-otp+${now}@example.com`;
    const username = `testotp${now}`;
    const password = 'TestPass123!';

    console.log('Registering', email);
    const reg = await axios.post(`${API}/api/auth/register`, { username, email, password, fullName: 'Test OTP' });
    console.log('Register response:', reg.data);

    console.log('Logging in...');
    const login = await axios.post(`${API}/api/auth/login`, { username: email, email, password });
    console.log('Login response:', login.data);

    if (login.data.otp) {
      console.log('Verifying OTP', login.data.otp);
      const verify = await axios.post(`${API}/api/auth/verify-otp`, { sessionToken: login.data.sessionToken, otp: login.data.otp });
      console.log('Verify response:', verify.data);
    } else {
      console.warn('OTP not included in login response; ensure server is running with NODE_ENV=test or ALLOW_TEST_OTP=1');
    }
  } catch (err) {
    if (err.response) console.error('Error response:', err.response.data);
    else console.error('Error:', err.message);
    process.exit(1);
  }
}

run();