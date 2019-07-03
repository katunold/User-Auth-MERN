require('should');
const request = require('supertest');
const app = require('../server/server');
const agent = request.agent(app);
const mockData = require('./helpers/mock-data');
const { signUp, useInTest, login } = require('./helpers/utils');

describe('Login router', () => {

  useInTest();

  it('should logout a user', (done) => {
    agent.post('/auth/logout')
      .expect(200)
      .end((err, res) => {
        res.body.should.have.property('message');
        done();
      })
  });

  it('should return an access token on successful login', (done) => {
    signUp(mockData.signUpData).expect(201)
      .end((err, res) => {
        res.body.should.have.property('message');
      });
    login(mockData.loginData)
      .expect(200)
      .end((err, res) => {
        res.body.should.have.property('accessToken');
        done();
      })
  });

  it('should throw error when a wrong password is entered', (done) => {
    signUp(mockData.signUpData).expect(201)
      .end((err, res) => {
        res.body.should.have.property('message');
      });
    login(mockData.errLoginData)
      .expect(401)
      .end((err, res) => {
        res.body.should.have.property('error');
        done();
      });
  });

  it('should throw error when a user does not exist', (done) => {
    login(mockData.errLoginData)
      .expect(401)
      .end((err, res) => {
        res.body.should.have.property('error');
        done();
      });
  });
});
