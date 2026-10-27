const test = require('node:test');
const assert = require('node:assert/strict');
const axios = require('axios');
const app = require('../index');

test('authentication requires a password and verifies credentials without resetting users', async t => {
  process.env.CHAT_ENGINE_PROJECT_ID = 'test-project';
  const calls = [];
  t.mock.method(axios, 'get', async (url, config) => {
    calls.push({url, config});
    if (config.headers['User-Secret'] !== 'correct-password') throw {response:{status:403}};
    return {data:{username:'alice'}};
  });
  t.mock.method(axios, 'put', () => {throw new Error('Authentication must not overwrite accounts');});
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening',resolve));
  try {
    const login = body => fetch(`http://127.0.0.1:${server.address().port}/authenticate`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)
    });
    assert.equal((await login({username:'alice'})).status,400);
    assert.equal(calls.length,0);
    assert.equal((await login({username:'alice',secret:'wrong-password'})).status,401);
    const success = await login({username:'alice',secret:'correct-password'});
    assert.equal(success.status,200);
    assert.deepEqual(await success.json(),{username:'alice'});
    assert.equal(calls[1].url,'https://api.chatengine.io/users/me/');
    assert.equal(calls[1].config.headers['Private-Key'],undefined);
  } finally {await new Promise(resolve => server.close(resolve));}
});
