
//module.exports = function(app){
	
	var bodyParser = require('body-parser');
	var user_database = require('./connection.js');
	var freiend_database = require('./requestSchema.js');
	//var urlencodedParser = bodyParser.urlencoded({ extended: false });
	//app.use(bodyParser.urlencoded());
	var UserRegister = user_database ;
	var friendrequests = freiend_database;
	// app.get('/',function(req,res){
	// 	res.render('login',{'message':''});
	// })
	
	// app.post('/login',function(req,res){
	// 	username = req.body.email;
	// 	var password = req.body.pwd;
	// 	UserRegister.find({$and: [{email: username}, {password:password}]}, function (err, docs) {
	// 		console.log(docs);
	// 		if(err){
	// 			console.log(err);
	// 		}
	// 		else if( docs[0] == null ){
	// 			console.log("invalid");
	// 			res.json({message:'InValid Username and Password'});
	// 		}else{
	// 			req.session.username = username;
	// 			res.json({success: "sucess login"});
	// 		}
    //     });
	// })
	
	// app.get('/dashboard',function(req,res){
	// 	if(req.session.username){
	// 		res.render('dashboard');
	// 	}else{
	// 		res.redirect('/');
	// 	}
		
	// })
	
	// app.get('/register',function(req,res){
	// 	res.render('register',{'message':''});
	// })
	
	// app.post('/register',function(req,res){
		// console.log("earewrewerwerwrwe*************************");

// var mongoose = require('mongoose');
// var user = require('./connection.js');
// var UserRegister = user;
exports.insertUser = function(req, res){
		console.log("insert user called");
		console.log(req.body);
		var user_mail = req.body.email;
		UserRegister.find({email:user_mail},function(err,docs){
			console.log(docs);
			if( docs[0] == null ){


				var userDetails = new UserRegister({
		            firstName: req.body.firstname,
		            lastName:req.body.lastname,
		            email:req.body.email,
		            password:req.body.pwd,
		            phone:req.body.mobile,
		            gender:req.body.gender,
					profilePic:"",
                   description:"",
				   dob:"",
					hobbies:""
		        });
				
				userDetails.save(function(err, data){
		            if(err){
		            	console.log("err",err);
						var obj = {
							'message': 'error'
						}
						res.json(err);
					}
					else{
						console.log("success");
						res.json({'firstName':req.body.firstname,
						success:"register success"
					})
						//res.send("hello");
					}
		        });
				//res.render('login');
				

			}else{
				//res.render('register',{'message':'Usermail already exists try with another'});
				res.json({'message':'Usermail already exists try with another'});
		}
		
		 });


}
	
	// app.post("/saveChanges",function(req,res){


	// });
	
	// app.get('*',function(req,res){
	// 	res.redirect('/');
	// });




exports.validateUser = function(req, res){

    /*var username = req.body.email;
		var password = req.body.pwd;
		UserRegister.find({$and: [{'email': username}, {'password':password}]}, function (err, docs) {
			console.log(docs.length);
			if(err){
				console.log(err);
			}
			else if( docs[0] == "" ){
				// res.render('login',{message:'InValid Username and Password'});
				res.json({msg:"wrong credentials"});
			}else{
				req.sessionId = username;
				// res.redirect('/dashboard');
				res.json({msg:"success"});
			}
        });*/
        username = req.body.email;
		  var password = req.body.pwd;
		  UserRegister.find({$and: [{email: username}, {password:password}]}, function (err, docs) {
		   console.log(docs);
		   if(err){
		    console.log(err);
		   }
		   else if( docs[0] == null ){
		    console.log("invalid");
		    res.json({message:'InValid Username and Password'});
		   }else{
		    req.sessionId = username;

		    console.log("req.session",req.sessionId);
		    res.json({success: "sucess","username":username});
		   }
        });
}


exports.updateUser = function(req,resp){
	console.log(req.body.email);
			var userDetails = new UserRegister({
	            firstName: req.body.firstname,
	            lastName:req.body.lastname,
	            email:req.body.email,
	            // password:req.body.pwd,
	            phone:req.body.mobile,
	            gender:req.body.gender,
				// profilePic:req.file.filename,
               description:req.body.description,
			   // dob:req.body.dob,
				hobbies:req.body.hobbies
	        });
				
UserRegister.find({email: req.body.email},function(error,data){
	if(error){
		throw error
	}else if(data[0] != null){
		userDetails.update(function(err,data){
			if(err)throw err;
			else
			{
				console.log("saved succesfully");
				resp.json({DATA:data});
			}
		})
	}
}) ;
}

exports.searchUsers = function(req,res){
	var useremail = req.sessionId;
	var query = UserRegister.aggregate({$match : {'email': {$ne : useremail}}},{$project : { name: { $concat: [ "$firstName", " ", "$lastName" ] } }});

    query.exec(function (err, someValue) {
    	if(err){
			console.log(err);
		}
        res.json({data:someValue,msg:"success"});
    });
}

exports.getUserProfile = function(req,res){
	UserRegister.find({'email':req.sessionId},function(req,res){
    	res.json({'data':res,msg:"success"});
    })
}

exports.individualSearch = function(req,res){
	console.log(req.body.username);
	/*console.log("sessionId",req.sessionId);*/
	UserRegister.find({"_id" : req.params.id},function(err,docs){
    	var email = req.body.username;
    	var user = docs[0].email;
    	//console.log("req.sessionId",req.sessionId);
    	friendrequests.find({$or:[{'send_by':user,'sent_to':email} ,{'sent_by':email,'sent_to':user}]},function(err,data){
    		console.log("*************************",data);
    		if( data == '' ){
    			friend_status = '0';
    		}else if( data[0].accept == '0' ){
    			friend_status = '1'
    		}else if( data[0].accept == '1' ){
    			friend_status = '2'
    		}
			res.json({'mgs':'success','data':docs,'friend_status':friend_status});
			console.log(friend_status);
			console.log(docs);

    	})
    	
    	// console.log("friend_status",friend_status);
    	
    	//friendrequests.close();
    })
}

exports.insertRequest = function(req,res){
	UserRegister.find({"_id" : req.params.id},function(err,docs){
    var email = docs[0].email;
    console.log("data",docs);
    console.log("email",email);
    var data = {
			'sent_by':req.body.sender,
			'sent_to':email,
			'accept':0
			};
	var newRequest = new friendrequests(data);
    newRequest.save(function(err, docs){
    	if(err){
        	console.log("err",err);
			var obj = {
				'message': 'error'
			}
			res.json(err);
		}
		else{
			console.log("success");
			res.json({'mgs':'success'})
		}
    });
});

}


exports.acceptRequest = function(req,res){
	// UserRegister.find({"_id" : req.params.id},function(err,docs){
    // var email = docs[0].email;
	friendrequests.update({$and:[{'sent_to':req.body.username},{'sent_by':req.params.id}]},{$set:{'accept':1}},function(err,docs){
		res.json({'message':'success'})
	// });
});
}


exports.friendsAndRequests = function(req,res){
	console.log("hai friend");
	var req_acc = [];
	friendrequests.find({$and: [{'sent_to':req.body.username }, {'accept':0}]},function(err,accept_records){
    	var req_length = accept_records.length;
    	// console.log("accept_records",accept_records[0].sent_by);
    	for (var x = 0; x < req_length ; x++){
    		var each_req = {};
    		each_req['sent_by'] = accept_records[x].sent_by;
    		req_acc.push(each_req);
    	}

    	var friend_acc = []; 
		friendrequests.find({$and:[{'accept':1},{$or:[{'sent_by':req.body.username},{'sent_to': req.body.username}]}]}).exec(function(err, docs) { 
    	var friends_count = docs.length;
    	for (var y = 0; y < friends_count ; y++){
    		var each_count = {};
    		if(docs[y].sent_by == req.body.username){
    			each_count['friend_name'] = docs[y].sent_to;
    		}else{
    			each_count['friend_name'] = docs[y].sent_by;
    		}
    		console.log('each_count',each_count);
    		friend_acc.push(each_count);
    	}
    	console.log();
	    var friends_acceptance = {};
	    friends_acceptance.accept = req_acc;
	    friends_acceptance.friends = friend_acc;
	    res.json({'msg':'success','friends_acceptance':friends_acceptance});
    })
    
    	
    })
    
    
}
exports.logOut = function(req,res){
delete req.sessionId;
//   res.redirect('/login');
res.json({message: "logOut"});
}