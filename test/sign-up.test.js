require('should');
const request = require('supertest');
const app = require('../server/server');
const agent = request.agent(app);
const mockData = require('./helpers/mock-data');
const { signUp, useInTest } = require('./helpers/utils');

describe('Sign Up route', () => {

  useInTest();

  it('should allow a new user account to be created', (done) => {
    signUp(mockData.signUpData)
      .expect(201)
      .end((err, res) => {
        res.body.should.have.property('message');
        done();
      });
  });

  it('should throw an error when email already exists', (done) => {
    signUp(mockData.signUpData).expect(201)
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
      .end((err, res) => {
        res.body.should.have.property('error');
        done();
      })
  });

  it('should throw an error when password is less than 6 characters', (done) => {
    const signUpData = {
      name: 'Arnold',
      email: 'arnold@mail.com',
      password: '1qa'
    };
    agent.post('/api/users')
      .send(signUpData)
      .end((err, res) => {
        res.body.should.have.property('error', 'Password must be at least 6 characters.');
        done();
      })
  });

  it('should throw an error when password is missing', (done) => {
    const signUpData = {
      name: 'Arnold',
      email: 'arnold@mail.com'
    };
    agent.post('/api/users')
      .send(signUpData)
      .end((err, res) => {
        res.body.should.have.property('error', 'Password is required');
        done();
      })
  });

});
