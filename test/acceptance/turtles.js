'use strict';

var cp = require('child_process');
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var chaiHttp = require('chai-http');
var User = require('../../models/user');
chai.use(chaiHttp);

var app = require('../../app');

var dbName = process.env.MONGO_URL.split('/').pop();

var testUser;

var cleanDb = function(done) {
  cp.execFile('./clean-db.sh', [dbName], {cwd: __dirname + '/../scripts/'}, function(){
    User.findById('0000000000000000000000a1', function(err, bob){
      testUser = bob;
      done();
    });
  });
};

describe('Turtles Route', function() {
  describe('GET /turtles', function() {

    beforeEach(cleanDb);

    it('should return TURTLES - if authenticated.', function(done) {
      var token = testUser.token();
      chai.request(app)
      .get('/turtles')
      .set('Authorization', `Bearer ${token}`)
      .end(function(err, res){
        expect(res.text).to.include('TURTLES');
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
    });

    it('should NOT return TURTLES - no auth header.', function(done) {
      var token = testUser.token();
      chai.request(app)
      .get('/turtles')
      // .set('Authorization', `Bearer ${token}`)
      .end(function(err, res){
        expect(res).to.have.status(401);
        done();
      });
    });

    it('should NOT return TURTLES - bad auth header.', function(done) {
      var token = testUser.token();
      chai.request(app)
      .get('/turtles')
      .set('Authorization', `Beerer ${token}`)
      .end(function(err, res){
        expect(res).to.have.status(401);
        done();
      });
    });
    
  });
});


// describe('Books Route', function() {

//   describe('GET /books', function() {
//     beforeEach(cleanDb);
//     it('should return all books.', function(done) {
      
//       var spy = sinon.spy(Book, 'find');

//       chai.request(app)
//       .get('/books')
//       .end(function(err, res) {
//         expect(spy.calledOnce).to.be.ok;
//         expect(spy.firstCall.args[0]).to.deep.equal({});
//         expect(err).to.be.null;
//         expect(res).to.have.status(200);
//         expect(res.body).to.have.length(2);
//         spy.reset();
//         done();
//       });
//     });
//   });

//   describe('GET /books/title/:title', function() {
//     beforeEach(cleanDb);
//     it('should return the matching book.', function(done) {
      
//       var spy = sinon.spy(Book, 'findOne');

//       var title = 'The Bible';

//       chai.request(app)
//       .get(`/books/title/${title}`)
//       .end(function(err, res) {
//         expect(spy.calledOnce).to.be.ok;
//         expect(spy.firstCall.args[0]).to.deep.equal({title: title});
//         expect(err).to.be.null;
//         expect(res).to.have.status(200);
//         expect(res.body.title).to.equal(title);
//         spy.reset();
//         done();
//       });
//     });
//   });


//   describe('POST /books', function() {
//     beforeEach(cleanDb)

//     it('should add a new book.', function(done) {
//       var title = 'Slaughterhouse-Five';
//       var author = 'Kurt Vonnegut';
//       chai.request(app)
//       .post('/books')
//       .send({title: title, author: author})
//       .end(function(err, res) {
//         expect(err).to.be.null;
//         Book.findOne({title: 'Slaughterhouse-Five'}, function(err, book){
//           expect(err).to.be.null;
//           expect(res).to.have.status(200);
//           expect(res.body._id).to.be.ok;
//           expect(res.body.title).to.equal(title);
//           expect(res.body.author).to.equal(author);
//           expect(book.title).to.equal(title);
//           expect(book.author).to.equal(author);
//           done();
//         });
//       });
//     });
//     it('should NOT add a new book - missing title.', function(done) {
//       var author = 'Kurt Vonnegut';
//       chai.request(app)
//       .post('/books')
//       .send({author: author})
//       .end(function(err, res) {
//         expect(res).to.have.status(400);
//         Book.find({}, function(err, books){
//           expect(books).to.have.length(2);
//           expect(err).to.be.null;
//           done();
//         });
//       });
//     });
//     it('should NOT add a new book - missing author.', function(done) {
//       var title = 'Slaughterhouse-Five';
//       chai.request(app)
//       .post('/books')
//       .send({title: title})
//       .end(function(err, res) {
//         expect(res).to.have.status(400);
//         Book.find({}, function(err, books){
//           expect(books).to.have.length(2);
//           expect(err).to.be.null;
//           done();
//         });
//       });
//     });
//   });
// });
