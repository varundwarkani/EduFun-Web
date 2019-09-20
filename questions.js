const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
var request = require('request');
var mysql = require('mysql');
const utf8 = require('utf8');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));



//---global variables -------------------------------------------//

var count = 0;
var quizID;

//---------------------------------------------------//
function getConnection(){
    var con = mysql.createConnection({
        host : "139.59.94.48",
        user : "hackathon",
        password : "Hackathon@123",
        database : "EduFun"
    });

    return con;
}


//---------------------------------get methods for the files ------------------------------------------------//

router.get('/',function(req,res){
    res.sendFile('C:/Users/VISHAL VENKATESH/Desktop/portal code/home.html');
});

router.get('/dashboard',function(req,res){
    res.sendFile('C:/Users/VISHAL VENKATESH/Desktop/portal code/dashboard.html');
});   

router.get('/add_quiz',function(req,res){
    res.sendFile('C:/Users/VISHAL VENKATESH/Desktop/portal code/add_quiz.html');
});


router.get('/add_assignments',function(req,res){
    res.sendFile('C:/Users/VISHAL VENKATESH/Desktop/portal code/add_assignments.html');
});
router.get('/add_events',function(req,res){
    res.sendFile('C:/Users/VISHAL VENKATESH/Desktop/portal code/add_events.html');
}); 

//----------------------------------function coloumn-----------------------------------------------------//


function getQuizID(callback){
    var con = getConnection();
    con.connect(function(err) {
        var sql = "select QuizID from Quizzes order by CreatedOn DESC limit 1";
        con.query(sql, function (err, result) {
          if (err) return callback(err);
          con.end();
          return callback(result[0]['QuizID']);
        });
})
}





//---------------------------the following are for post request -----------------------------------------------//




router.post('/add_quiz',function(req,res){
    if(count == 0){
        count++;
    console.log(req.body.quizname);
    var today = new Date();
   // var starttime =  today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
   // var endtime =  today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate()+10) + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var starttime = "2019-09-20 23:28:26";
    var endtime = "2019-09-30 23:28:26";
    
    console.log(req.body);
    console.log(starttime); 
    con = getConnection();
    con.connect(function(err) {
        if (err) throw err;
        console.log("database Connected!");
        var sql = "INSERT INTO Quizzes (DeptID, ClassID,SubjectID,QuizName,CreatedOn,IsActive,QuizDescription,QuizStart,QuizEnd) VALUES (1,1,2,"+mysql.escape(req.body.quizname) +","+mysql.escape(starttime) + ",1,"+mysql.escape(req.body.quizdescription)+","+mysql.escape(starttime) + ","+mysql.escape(endtime)+ ")";
        con.query(sql, function (err, result) {
          if (err) throw err;
          con.end();

          getQuizID(function(result){
            quizID = result;
        
            console.log("quiz ID is : "+ quizID);
            console.log("quiz name is inserted");
            res.redirect('/add_quiz');
        });

          
          
        });
      });

    }
    else{

        console.log('question added');
        var today = new Date();
    var starttime =  today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log(req.body);
      
    con = getConnection();
    con.connect(function(err) {
        if (err) throw err;
        console.log("database Connected!");
        var sql = "INSERT INTO Questions (QuizID,Question,OptionA,OptionB,OptionC,OptionD,CreatedOn,IsActive,CorrectAnswer) VALUES ("+mysql.escape(quizID)+","+mysql.escape(req.body.question) + ","+ mysql.escape(req.body.optionA) +","+ mysql.escape(req.body.optionB) +"," + mysql.escape(req.body.optionC) +"," + mysql.escape(req.body.optionD) +","+mysql.escape(starttime) + ",1,1)";
        con.query(sql, function (err, result) {
          if (err) throw err;
          con.end();
            res.redirect('/add_quiz');
          console.log("1 record inserted in question table");
        });

      });
   }
});


router.post('/add_assignments',function(req,res){
    var title = req.body.assignmentTitle;
    var question = req.body.assignment_question;
    var score = req.body.score;
    var today = new Date();
   // var starttime =  today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  //var endTime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate()+10) + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var starttime = "2019-09-20 23:28:26";
    var endTime = "2019-09-30 23:28:26";
    console.log(req.body);
   
    con = getConnection();
    con.connect(function(err){
        if(err) throw err;
        var sql = "INSERT INTO Assignment (AssignmentQuestion,AssignmentScore,AssignmentStart,AssignmentEnd,CreatedOn,isActive) values ("+mysql.escape(title) + ","+mysql.escape(score)+","+mysql.escape(starttime) + ","+mysql.escape(endTime) + ","+mysql.escape(starttime) + ","+"1)";
        con.query(sql, function (err, result) {
            if (err) throw err;
            con.end();
              res.redirect('/dashboard');
            console.log("1 record inserted in question table");
          });
    })
});

router.post('/add_events',function(req,res){
    var eventName = req.body.topic;
    var description = req.body.description;
    var today = new Date();
    var starttime =  today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + (today.getHours()+5) + ":" + today.getMinutes() + ":" + today.getSeconds();
    var endTime = today.getFullYear() + '-' + (today.getMonth() + 2) + '-' + (today.getDate()+5) + " " + (today.getHours()+5) + ":" + today.getMinutes() + ":" + today.getSeconds();
    
    
    con = getConnection();
    con.connect(function(err){
        if(err) throw err;
        var sql = "INSERT INTO Events (EventName,EventDescription,EventDate,CreatedOn,isActive) values ("+mysql.escape(eventName) + ","+mysql.escape(description)+","+mysql.escape(endTime) + ","+mysql.escape(starttime) + ","+"1)";
        con.query(sql, function (err, result) {
            if (err) throw err;
            con.end();
              res.redirect('/dashboard');
            console.log("1 record inserted in Event table");
          });
    })
})


app.use('/', router);
app.listen(3000); //process.env.port || 3000);
console.log('Running at Port 3000');