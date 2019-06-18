require('should');
const request = require('supertest');
const mongoose = require('mongoose');
process.env.ENV = 'Test';
const app = require('../server/server');

const User = mongoose.model('User');
const agent = request.agent(app);
const mockData = require('./helpers/mock-data');
const { signUp } = require('./helpers/utils');

describe('Sign Up route', () => {

  afterEach((done) => {
    User.deleteMany({}).exec();
    done();
  });

  it('should allow a new user account to be created', (done) => {
    signUp(mockData.signUpData).expect(200)
      .end((err, res) => {
        res.body.should.have.property('message');
        done();
      });
  });

  it('should throw an error when email already exists', (done) => {
    signUp(mockData.signUpData).expect(200)
      .end((err, res) => {
        res.body.should.have.property('message');
      });

    agent.post('/api/users')
      .send(mockData.signUpData)
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('error');
        done();
      })
  });

  it('should throw an error when a wrong email format is submitted', (done) => {
    agent.post('/api/users')
      .send(mockData.errSignUpData)
      .expect(400)
      .end((err, res) => {
        res.body.should.have.property('error');
        done();
      })
  });

  after((done) => {
    mongoose.connection.close();
    app.server.close(done());
  })

});
