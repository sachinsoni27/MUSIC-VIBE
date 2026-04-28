const { spawn } = require('child_process');
const net = require('net');
const path = require('path');

const SERVER_PORT = 3000;
const SERVER_START_TIMEOUT = 15000; // 15s

function waitForPort(port, timeout) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const socket = net.createConnection(port, '127.0.0.1');
      socket.on('connect', () => {
        socket.end();
        resolve(true);
      });
      socket.on('error', () => {
        if (Date.now() - start > timeout) return reject(new Error('Timeout waiting for port'));
        setTimeout(check, 200);
      });
    };
    check();
  });
}

(async () => {
  console.log('Starting server in test mode...');
  const serverProcess = spawn(process.execPath, [path.join(__dirname, '..', 'server', 'server.cjs')], {
    env: { ...process.env, NODE_ENV: 'test' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  serverProcess.stdout.on('data', (d) => process.stdout.write(`[server] ${d}`));
  serverProcess.stderr.on('data', (d) => process.stderr.write(`[server] ${d}`));

  try {
    await waitForPort(SERVER_PORT, SERVER_START_TIMEOUT);
    console.log('Server is up. Running Jest integration tests...');

    const jest = spawn('npx', ['jest', '--runInBand', 'tests/integration'], { stdio: 'inherit' });
    jest.on('exit', (code) => {
      console.log('Jest finished with code', code);
      serverProcess.kill();
      process.exit(code);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    serverProcess.kill();
    process.exit(1);
  }
})();