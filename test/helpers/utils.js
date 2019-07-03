require('should');
const request = require('supertest');
const mongoose = require('mongoose');
process.env.ENV = 'Test';
const app = require('../../server/server');

const User = mongoose.model('User');
const agent = request.agent(app);

exports.signUp = (data) => {
  return agent.post('/api/users')
    .send(data);
};

exports.login = (data) => {
  return agent.post('/auth/signIn')
    .send(data);
};

exports.useInTest = ()  => {
  afterEach((done) => {
    User.deleteMany({}).exec();
    done();
  });

  after((done) => {
    app.server.close(done());
  })
};
