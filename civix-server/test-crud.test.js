const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const auth = require('./src/routes/auth');
const reports = require('./src/routes/reports');

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/auth', auth);
app.use('/api/reports', reports);

describe('Civix API CRUD Tests', () => {
  let token;
  let reportId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    // Cleanup
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // --- Auth Tests ---
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('should login the user and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    token = res.body.token;
  });

  // --- Report CRUD Tests ---
  it('should create a new report', async () => {
    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Broken Streetlight',
        description: 'The streetlight on 5th avenue is broken.',
        category: 'Infrastructure',
        location: {
          type: 'Point',
          coordinates: [-122.3321, 47.6062],
          formattedAddress: '5th Ave, Seattle, WA'
        }
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data.title).toEqual('Broken Streetlight');
    reportId = res.body.data._id;
  });

  it('should get all reports', async () => {
    const res = await request(app).get('/api/reports');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
  });

  it('should get a single report', async () => {
    const res = await request(app).get(`/api/reports/${reportId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data._id).toEqual(reportId);
  });

  it('should update a report', async () => {
    const res = await request(app)
      .put(`/api/reports/${reportId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'in-progress'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.status).toEqual('in-progress');
  });

  it('should delete a report', async () => {
    const res = await request(app)
      .delete(`/api/reports/${reportId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });

  it('should return 404 for deleted report', async () => {
    const res = await request(app).get(`/api/reports/${reportId}`);
    expect(res.statusCode).toEqual(404);
  });
});
