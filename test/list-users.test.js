require('should');
const request = require('supertest');
const app = require('../server/server');
const agent = request.agent(app);
const mockData = require('./helpers/mock-data');
const { signUp, useInTest, login } = require('./helpers/utils');

describe('List Users route', () => {

  useInTest();

  it('should return all user on request from an authenticated user', (done) => {
    let token = '';
    signUp(mockData.signUpData).expect(201)
      .end(() => {});
    signUp(mockData.signUpData1).expect(201)
      .end(() => {});
    login(mockData.loginData)
      .expect(200)
      .end((err, res) => {
        token = res.body.accessToken;
      });
    agent.get('/api/users').set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end((err, res) => {
        res.body.should.have.length(2);
        done();
      })
  });
});
