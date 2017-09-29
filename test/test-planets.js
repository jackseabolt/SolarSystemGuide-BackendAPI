'use strict'; 

global.DATABASE_URL =  'mongodb://localhost/jwt-auth-demo-test';
process.env.NODE_ENV = 'test'; 
const chai = require('chai'); 
const chaiHttp = require('chai-http'); 
const jwt = require('jsonwebtoken'); 
const faker = require('faker');

const { Planet } = require('../planets'); 

const { app, runServer, closeServer} = require('../server'); 
const { User } = require('../users'); 
const { JWT_SECRET } = require('../config'); 

const expect = chai.expect;
const should = chai.should(); 

chai.use(chaiHttp); 

let randomId;
let commentId; 

function seedData(){
    const seedPlanets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter']; 

    const arr = []; 
    for(let i = 1; i <= 5; i++){
        arr.push({
            name: seedPlanets.pop(), 
            description: faker.lorem.paragraph(),  
            composition: faker.lorem.words(),
            thumbnail: faker.image.imageUrl(), 
            moons: [
                {
                    name: faker.lorem.word() 
                }
            ],
            comments: [
                {
                    content: faker.lorem.paragraph(),
                    username: faker.internet.userName()
                }
            ]
        });
    }
    return Planet.insertMany(arr)
    .then(function(res) {
        randomId=res[0]._id
        commentId=res[0].comments[0]._id; 
    })
}

describe('Planet endpoint', function(){
    const username = 'exampleUser'; 
    const password = 'examplePass';
    let hash = null; 
    const token = jwt.sign(
        {
          user: { username }
        },
        JWT_SECRET,
        {
          // algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );
    const adminToken = jwt.sign(
        {
          user: { username: 'admin', isAdmin: true}
        },
        JWT_SECRET,
        {
          // algorithm: 'HS256',
          subject: 'admin',
          expiresIn: '7d'
        }
      );
    before(function(){
        return runServer()
    });

    after(function(){
        return closeServer(); 
    }); 

    beforeEach(async function(){
        if (!hash) hash = await User.hashPassword(password)
        await User.create({ username, password: hash });
        await User.create({ username: 'admin', password: hash, isAdmin: true });
        await seedData(); 
    }); 

    afterEach(async function(){
        await Planet.remove({}); 
        await User.remove({}) 
    }); 

    // afterEach(function () {
    //     return Planet.remove({})
    //         .then(() => {
    //             return User.remove({})
    //         }); 
    // });

    describe('/api/planets', function(){
        it('GET should return all planets with no credentials', function(){
            return chai 
                .request(app)
                .get('/api/planets')
                .then(res => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.an('array');
                    res.body.length.should.equal(5);
                    res.body.forEach(function(planet) {
                            planet.should.be.an('object');
                            planet.should.include.keys("_id", "name", "description", "composition", "thumbnail", "moons", "comments");
                            planet._id.should.not.be.null;
                            planet.moons.forEach(function(moon) {
                                moon.should.be.an('object');
                                moon.should.include.keys("_id", "name");
                                moon._id.should.not.be.null;
                            planet.comments.forEach(function(comment) {
                                comment.should.be.an('object');
                                comment.should.include.keys("_id", "username", "content", "created");
                                comment._id.should.not.be.null;
                                comment.created.should.not.be.null;
                            })
                            })
                    })
                })
        })

        it('GET ID should return a single planet with no credentials', function() {
            return chai
                .request(app)
                .get(`/api/planets/${randomId}`)
                .then(function(res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.an('object');
                    res.body.should.include.keys("_id", "name", "description", "composition", "thumbnail", "moons", "comments");
                    res.body._id.should.not.be.null;
                    res.body.moons.forEach(function(moon) {
                        moon.should.be.an('object');
                        moon.should.include.keys("_id", "name");
                        moon._id.should.not.be.null;
                    res.body.comments.forEach(function(comment) {
                        comment.should.be.an('object');
                        comment.should.include.keys("_id", "username", "content", "created");
                        comment._id.should.not.be.null;
                        comment.created.should.not.be.null;
                    })  
                    })
                }); 
        });

        it('POST ID should push a comment to the comments section WITH credentials', function() {
            return chai
                .request(app)
                .post(`/api/planets/${randomId}/comments`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    content: 'testcontent',
                })
                .then(function(res) {
                    res.should.have.status(201)
                })
                .then(function(){
                    return Planet 
                        .findOne({_id: randomId})
                })
                .then(planet => {
                    let matching_comments = 0; 
                    planet.comments.forEach(function(comment){
                        should.exist(comment._id);
                        should.exist(comment.username);
                        should.exist(comment.content);
                        should.exist(comment.created);
                        if(comment.content === "testcontent"){
                            matching_comments++; 
                            comment.username.should.equal(username);
                        }  
                    })
                    matching_comments.should.equal(1);  
                })       
        });

        it('POST ID should not work if user sends in an invalid string', function() {
            return chai
                .request(app)
                .post(`/api/planets/${randomId}/comments`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    content: "",
                })
                .then(function(res) {
                    res.should.not.have.status(201)
                })
                .catch(function(err){
                    err.should.have.status(422); 
                });
        })

        it('POST ID should not work if user sends in an invalid string', function() {
            return chai
                .request(app)
                .post(`/api/planets/${randomId}/comments`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    content: 2,
                })
                .then(function(res) {
                    res.should.not.have.status(201)
                })
                .catch(function(err){
                    err.should.have.status(422); 
                });
        })

        it('DELETE PLNT ID + CMMT ID will delete a comment from a planet', function(){
            return chai
                .request(app)
                .delete(`/api/planets/${randomId}/comments/${commentId}`)
                .set('authorization', `Bearer ${token}`)
                .then(function (res) {
                    res.should.have.status(204);
                    return Planet
                        .findOne({ _id: randomId })
                })
                .then(planet => {
                    planet.comments.forEach(function (comment) {
                        comment._id.toString().should.not.equal(commentId)
                    })
                });                 
        });
        
        it('PUT PLNT ID + CMMT ID will update a user comment', function(){
            return chai
                .request(app)
                .put(`/api/planets/${randomId}/comments/${commentId}`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    content: "testcontent",
                })
                .then(function(res){
                    res.should.have.status(204); 
                    return Planet 
                        .findOne({_id: randomId})
                })
                .then(planet => {
                    planet.comments[0].content.should.equal("testcontent")                       
                })
        }); 

        it('POST Authenticated User without admin will be rejected', function(){
            return chai
                .request(app)
                .post('/api/planets/')
                .set('authorization', `Bearer ${token}`)
                .then(function(res){
                    res.should.not.have.status(201); 
                })
                .catch(function(err){
                    err.should.have.status(403); 
                });
        })

        it('POST Authenticated User with admin will be accepted', function(){
            return chai
                .request(app)
                .post('/api/planets/')
                .set('authorization', `Bearer ${adminToken}`)
                .send({
                    name: "Caseytopia", //unique to our test
                    description: faker.lorem.paragraph(),  
                    composition: faker.lorem.words(),
                    thumbnail: faker.image.imageUrl(), 
                    moons: [
                        {
                            name: faker.lorem.word() 
                        }
                    ],
                    comments: [
                        {
                            content: faker.lorem.paragraph(),
                            username: faker.internet.userName()
                        }
                    ]
                })
                .then(function(res){
                    res.should.have.status(201);
                    return Planet.find( {name: "Caseytopia"})
                })
                .then(function(res){
                    res.length.should.equal(1);
                })                
        })

        it('PUT Authenticated user without admin will be rejected', function(){
            return chai
                .request(app)
                .put(`/api/planets/${randomId}`)
                .set('authorization', `Bearer ${token}`)
                .then(function(res){
                    res.should.not.have.status(204); 
                })
                .catch(function(err){
                    err.should.have.status(403); 
                });
        });

        it('PUT Authenticated User with admin will be accepted', function(){
            return chai
                .request(app)
                .put(`/api/planets/${randomId}`)
                .set('authorization', `Bearer ${adminToken}`)
                .send({
                    id: randomId,
                    name: "JackAndJill" //unique to our test
                })
                .then(function(res){
                    res.should.have.status(204); 
                    return Planet.find( {name: "JackAndJill"})
                })
                .then(function(res){
                    res.length.should.equal(1);                                           
                })
        })

        it('DELETE Authenticated User without admin will be rejected', function(){
            return chai
                .request(app)
                .delete(`/api/planets/${randomId}`)
                .set('authorization', `Bearer ${token}`)
                .then(function(res){
                    res.should.not.have.status(204); 
                })
                .catch(function(err){
                    err.should.have.status(403); 
                });
        })

        it('DELETE Authenticated User with admin will be accepted', function(){
            return chai
                .request(app)
                .delete(`/api/planets/${randomId}`)
                .set('authorization', `Bearer ${adminToken}`)
                .then(function(res){
                    res.should.have.status(204)
                    return Planet.findOne({_id: randomId})
                })
                .then(function(planet){
                    should.not.exist(planet)
                })
        });
    });
}); 