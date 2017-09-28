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
    .then(function(res) {randomId=res[0]._id})
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

    before(function(){
        return runServer()
    });

    after(function(){
        return closeServer(); 
    }); 

    beforeEach(async function(){
        if (!hash) hash = await User.hashPassword(password)
        await User.create({ username, password: hash });
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
                    console.log(res.body)
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

        it('PUT ID should push a comment to the comments section WITH credentials', function() {
            return chai
                .request(app)
                .post(`/api/planets/${randomId}/comment`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    content: faker.lorem.paragraph(),
                })
                .then(function(res) {
                    res.should.have.status(201)
                }); 
        });

        it('DELETE PLNT ID + CMMT ID will delete a comment from a planet', function(){
            let res; 
            let deleteMe; 
            return chai
                .request(app)
                .get(`/api/planets/${randomId}`)
                .then(function(_res) {
                    res = _res
                    deleteMe = res.body.comments[0]._id; 
                })
                .then(function() {
                    return chai
                        .request(app)
                        .delete(`/api/planets/${randomId}/comment/${deleteMe}`)
                        .set('authorization', `Bearer ${token}`)
                        .then(function(res) {
                            res.should.have.status(204); 
                        })
                        .then(function(){
                            return Planet
                                .findOne({_id: randomId})
                                .then(planet => {
                                    planet.comments.forEach(function(comment){
                                        comment._id.toString().should.not.equal(deleteMe)
                                    })
                                })
                        });
                });
        }); 
    });
}); 
