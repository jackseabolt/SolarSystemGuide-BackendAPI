'use strict'; 

global.DATABSE_URL =  'mongodb://localhost/jwt-auth-demo-test';
process.env.NODE_ENV = 'test'; 
const chai = require('chai'); 
const chaiHttp = require('chai-http'); 
const jwt = require('jsonwebtoken'); 
const faker = require('faker'); 
const { Planet } = require('../planets')

const { app, runServer, closeServer} = require('../server'); 
const { User } = require('../users'); 
const { JWT_SECRET } = require('../config'); 

const expect = chai.expect;

chai.use(chaiHttp); 

function seedData(){
    const arr = []; 
    for(let i = 1; i < 5; i++){
        arr.push({
            name: faker.lorem.word(), 
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
    return Planets.insertMany(arr); 
}

describe('Planet endpoint', function(){
    const username = 'exampleUser'; 
    const password = 'examplePass'; 

    before(function(){
        return runServer()
    });

    after(function(){
        return closeServer(); 
    }); 

    beforeEach(function(){
        return User.hashPassword(password).then(password => {
            User.create({ username, password });
            seedData(); 
        });
    }); 

    afterEach(function(){
        return User.remove({}); 
    }); 

    describe('/api/planets', function(){
        it('GET should return all planets with no credentials', function(){

        })
    }); 
}); 
