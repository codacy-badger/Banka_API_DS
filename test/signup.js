/* eslint-disable no-undef */
// Import dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
require('../index');
// import out user collection(database)
const database = require('../models');
const base = require('./base');

// Base URL
const BASE_URL = 'http://localhost:8080/api/v1';
const SIGNUP_URL = '/signup';

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('Authentication', () => {
  beforeEach(() => {
    database.users.length = 0; // empty user collection
  });
  describe('POST', () => {
    it('should create a user account', (done) => {
      chai.request(BASE_URL)
        .post(SIGNUP_URL)
        .send(base.signup_user_1)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.should.have.property('data');
          res.body.data.should.have.property('id').eql(1);
          done();
        });
    });

    it('should raise an error if email or password is missing', (done) => {
      chai.request(BASE_URL)
        .post(SIGNUP_URL)
        .send(base.signup_user_2)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Email, Password and type are required !');
          done();
        });
    });

    it('should raise an error is user type is invalid', () => {
      chai.request(BASE_URL)
        .post(SIGNUP_URL)
        .send(base.signup_user_3)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('Type should either be client / staff');
        });
    });

    it('should create user of type staff', (done) => {
      chai.request(BASE_URL)
        .post(SIGNUP_URL)
        .send(base.signup_user_4)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should raise an error when user supplies an email which already exists', (done) => {
      chai.request(BASE_URL)
        .post(SIGNUP_URL)
        .send(base.signup_user_4)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
        });
      // Create another user with the same email
      chai.request(BASE_URL)
        .post(SIGNUP_URL)
        .send(base.signup_user_4)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should raise an error when email is invalid', (done) => {
      chai.request(BASE_URL)
        .post(SIGNUP_URL)
        .send(base.signup_user_5)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.should.have.property('error').eql('Invalid email format ');
          done();
        });
    });

    it('should raise an error when password is invalid', (done) => {
      chai.request(BASE_URL)
        .post(SIGNUP_URL)
        .send(base.signup_user_6)
        .end((err, res) => {
          const error = 'Weak password, must be at least 8 characters and have at least 1 letter and number';
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.should.have.property('error').eql(error);
          done();
        });
    });
  });
});
