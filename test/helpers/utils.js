require('should');
const request = require('supertest');
const mongoose = require('mongoose');
process.env.ENV = 'Test';
const app = require('../../server/server');

const User = mongoose.model('User');
const agent = request.agent(app);
const mockData = require('./mock-data');

exports.signUp = (data) => {
  return agent.post('/api/users')
    .send(data);
};
