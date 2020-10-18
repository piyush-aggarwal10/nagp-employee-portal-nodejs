const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../app');
const should = chai.should();
const expect = chai.expect;
const fs = require('fs');
const User = require('../models/user');
let token = "";
let userId = "";

describe("Employee/Manager API Testing", () => {

    before((done) => {
        User.deleteMany({}, (err) => {
            done();
        });  
    });

    //Test to register a manager/employee
    it("should register a manager/employee", (done) => {
        chai.request(app)
            .post('/users/register')
            .send({
                username: 'piyush',
                email: 'piyush.aggarwal02@nagarro.com',
                password: 'abcd@1234',
                role: "employee"
            })
            .end((error, res) => {
                should.exist(res.body);
                res.should.have.status(200);
                res.body.should.be.a('object');
                expect(res).to.have.status(200);
                done();
            })
    });
    
    // Test to authenticate an employee/manager
    it("should authenticate a manager/employee", (done) => {
        chai.request(app)
            .post('/users/login')
            .send({
                username: 'piyush',
                password: 'abcd@1234'
            })
            .end((error, res) => {
                should.exist(res.body);
                token = res.body.token;
                userId = res.body.id;
                res.should.have.status(200);
                res.body.should.be.a('object');
                expect(res).to.have.status(200);
                done();
            })
    });

});