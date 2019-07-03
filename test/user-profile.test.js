require('should');
const request = require('supertest');
const app = require('../server/server');
const agent = request.agent(app);
const mongoose = require('mongoose');
const mockData = require('./helpers/mock-data');
const { signUp, useInTest, login } = require('./helpers/utils');

describe('User profile route', () => {

  let token = '';
  let userId = '';
  let userId1 = '';
  useInTest();
  beforeEach( async () => {
    signUp(mockData.signUpData).end(() => {});
    signUp(mockData.signUpData1).end(() => {});
    await login(mockData.loginData)
      .then((res) => {
        token = res.body.accessToken;
        userId = res.body.user._id;
      });
    await login(mockData.loginData1)
      .then((res) => {
        userId1 = res.body.user._id;
      });
  });

  it('should return user profile for the currently logged in user', (done) => {
    agent.get('/api/users/' + userId).set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        res.body.should.have.property('name', 'Arnold');
        done();
      });
  });

  it('should successfully update user details for the authorized user', (done) => {
    agent.put(`/api/users/${userId}`).set('Authorization', 'Bearer ' + token)
      .send({name: 'ArnoldK'})
      .end((err, res) => {
        res.status.should.equal(200);
        done();
      })
  });

  it('should not update user details for unauthorized user', (done) => {
    agent.put(`/api/users/${userId1}`).set('Authorization', 'Bearer ' + token)
      .send({name: 'ArnoldK'})
      .end((err, res) => {
        res.status.should.equal(403);
        done();
      })
  });

  it('should delete user account for an authorized user', (done) => {
    agent.delete(`/api/users/${userId}`).set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        res.status.should.equal(204);
        done();
      })
  });

  it('should return an error message if user does not exist', (done) => {
    agent.delete(`/api/users/536erfd3e3162ukqte123qe`).set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        res.body.should.have.property('error', 'User not found');
        res.status.should.equal(400);
        done();
      })
  });

  after(() => {
    mongoose.connection.close();
  });
});
