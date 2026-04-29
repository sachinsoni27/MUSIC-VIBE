process.env.NODE_ENV = 'test'
// reduce resend cooldown for tests so we can resend immediately
process.env.OTP_RESEND_COOLDOWN = '0'
process.env.OTP_MAX_RESEND = '10'

const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { app, startDb } = require('../../server/app.cjs')
const User = require('../../server/models/User.cjs')

jest.setTimeout(30000)

let mongo

beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  const uri = mongo.getUri()
  await startDb(uri)
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongo.stop()
})

test('login -> resend -> verify OTP flow', async () => {
  // register
  const email = `test+${Date.now()}@example.com`
  const registerRes = await request(app).post('/api/auth/register').send({ email, password: 'TestPass123', fullName: 'Test User' })
  expect(registerRes.status).toBe(200)
  expect(registerRes.body.success).toBeTruthy()

  // login (should create OTP and return sessionToken and OTP in test mode)
  const loginRes = await request(app).post('/api/auth/login').send({ email, password: 'TestPass123' })
  expect(loginRes.status).toBe(200)
  expect(loginRes.body.success).toBeTruthy()
  expect(loginRes.body.sessionToken).toBeTruthy()
  expect(loginRes.body.otp).toBeTruthy()

  const sess = loginRes.body.sessionToken
  const otp1 = loginRes.body.otp

  // check OTP stored hashed in DB
  const user = await User.findOne({ email })
  expect(user).toBeTruthy()
  expect(user.otpHash).toBeTruthy()
  expect(user.otpSessionToken).toBe(sess)

  // resend - should return a different OTP
  const resendRes = await request(app).post('/api/auth/resend-otp').send({ sessionToken: sess })
  expect(resendRes.status).toBe(200)
  expect(resendRes.body.success).toBeTruthy()
  expect(resendRes.body.sessionToken).toBeTruthy()
  expect(resendRes.body.otp).toBeTruthy()
  expect(resendRes.body.otp).not.toBe(otp1)

  const otp2 = resendRes.body.otp

  // verify using the resent OTP
  const verifyRes = await request(app).post('/api/auth/verify-otp').send({ sessionToken: sess, otp: otp2 })
  expect(verifyRes.status).toBe(200)
  expect(verifyRes.body.success).toBeTruthy()
  expect(verifyRes.body.token).toBeTruthy()

  // DB: user should be marked verified and OTP fields cleared
  const user2 = await User.findOne({ email })
  expect(user2.isVerified).toBeTruthy()
  expect(user2.otpHash).toBeFalsy()
  expect(user2.otpSessionToken).toBeFalsy()
})