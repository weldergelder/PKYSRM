var app = angular.module('srmApp', []);

app.controller('authController', function($scope){
	$scope.user = {username: '', password: ''};
	$scope.error_message = '';

	$scope.login = function(){
		$scope.error_message = 'login request for ' + $scope.user.username;
	};

});


app.controller('credentialManagementController', function($scope){
	$scope.users = [];
	$scope.user1 = {first_name: 'Yousef', last_name: 'Haddad', username: 'yohaddad', department: 'Marketing'};
	$scope.user2 = {first_name: 'Rana', last_name: 'Tamraz', username: 'ratamraz', department: 'Healthcare'};
	$scope.users.push($scope.user1);
	$scope.users.push($scope.user2);
	
});

app.controller('serviceRequestView', function($scope){
	$scope.servicereqs = [];
	$scope.sr1 = {created_by: 'Yousef', title: 'Desktop not working', status: 'In Progress', created_on: '10/01/2015'};
	$scope.sr2 = {created_by: 'Rana', title: 'Puzzle is frustrating', status: 'Pending', created_on: '11/01/2015'};
	$scope.servicereqs.push($scope.sr1);
	$scope.servicereqs.push($scope.sr2);
	
});

app.controller('addUserController', function($scope){

	$scope.user = {
		first_name: '',
		last_name: '',
		username: '',
		password: '',
		department:'',
		privilege_level: 0,
		provider: 0

	};
	$scope.error_message = 'Hello!';
	$scope.signup = function(){
		$scope.error_message = $scope.user;
	} 
	
});

app.controller('editUserController', function($scope){

	$scope.user = {
		first_name: 'Yousef',
		last_name: 'Haddad',
		username: 'yohaddad',
		password: 'pwd',
		department:'Information Technology',
		privilege_level: 1,
		provider: 1,
		log: [{ log_date: '10/01/2015',
			log_by: 'Yousef',
			log_detail: 'Create'}]

	};
	$scope.error_message = 'Hello!';
	$scope.editUser = function(){
		$scope.error_message = 'user edited';
	} 

	$scope.resetPassword = function(){
		$scope.error_message = 'password reset!';
	}
	
});

app.controller('editSRController', function($scope){

	$scope.servicereq = {
	created_by: 'Yousef',
	created_on: '10/01/2015',
	status: 'In Progress',
	sr_title: 'Desktop not working',
	approval: 0,
	sr_details: 'Not turning on',
	sr_department: 'Information Technology',
	resolve_by: '10/5/2015',
	comments: [{com_date: '10/01/2015', 
		com_by: 'Yousef',
		com_text: 'Sorry!'}],
	log: [{ log_date: '10/01/2015',
		log_by: 'Yousef',
		log_detail: 'Create'}]
	};

	$scope.new_comment = '';

	$scope.error_message = 'Hello!';

	$scope.approveSR = function(){
		$scope.servicereq.approval = 1;
	} 

	$scope.inProgSR = function(){
		$scope.servicereq.status = 'In Progress';
	} 
	$scope.completeSR = function(){
		$scope.servicereq.status = 'Completed';
	} 

	$scope.cancelSR = function(){
		$scope.servicereq.status = 'Canceled';
	}

	$scope.newComment = {com_date: Date.now(), com_by: $scope.servicereq.created_by, com_text: $scope.new_comment};
	$scope.addComment = function(){
		$scope.newComment = {com_date: Date.now(), com_by: $scope.servicereq.created_by, com_text: $scope.new_comment};
		$scope.servicereq.comments.push($scope.newComment);
		$scope.new_comment = '';
	}
	
});



app.controller('submitReqController', function($scope){

	$scope.requestCatalogue = [ //beginning of collection
	{//beginning of first department entry
		department: 'Information Technology',
		subcategories: [
		{
			sub_category: 'Desktop Support',
			titles: [
			{
				title: 'Power Issue',
				detail: 'Equipment does not turn on',
				privilege_level: 0,
				eta: 1
			},//end of first title
			{
				title: 'System Access',
				detail: 'Unable to log into ERP',
				privilege_level: 0,
				eta: 1
			},//end of second title
			{
				title: 'Network Access',
				detail: 'IP Phone and Network Issues',
				privilege_level: 0,
				eta: 1
			}//end of third title

			]//end of title array

		},//end of first subcategory
		{//start of second subcategory
			sub_category: 'Software Licensing',
			titles: [
			{
				title: 'Microsoft Office',
				detail: 'Request Office HUL',
				privilege_level: 1,
				eta: 3
			},
			{
				title: 'MSDN Account',
				detail: 'Request MSDN Account Access',
				privilege_level: 1,
				eta: 3
			}
			]//end of second title array

		}//end of second subcategory
		]//end of first subcategory array
	},//end of first department entry
	{//beginning of second department
		department: 'Administration',
		subcategories: [
		{
			sub_category: 'Room Reservations',
			titles: [
			{
				title: 'Meeting Room #1',
				detail: 'Capacity = 20',
				privilege_level: 1,
				eta: 1
			},
			{
				title: 'Meeting Room #2',
				detail: 'Capacity = 40',
				privilege_level: 1,
				eta: 1
			},
			{
				title: 'Meeting Room #3',
				detail: 'Capacity = 10',
				privilege_level: 0,
				eta: 1
			}//end of third title for room reservations
			]//end of first titles array for reservations

		},//end of first subcategory
		{//start of second subcategory
			sub_category: 'Supplies',
			titles: [
			{
				title: 'Printer Toner',
				detail: 'Please specify printer model and needed color',
				privilege_level: 1,
				eta: 3
			},
			{//start of second title
				title: 'Stationary',
				detail: 'Desk supplies',
				privilege_level: 0,
				eta: 3
			}//end of second title

			]//end of second titles array

		}//end of second subcategory
		]//end of first subcategory array for admin
	}//end of second department
	]; //end of collection




	$scope.newReq = {
		created_by: 'Yousef',
		created_on: Date.now(),
		status: 'Created',
		sr_title: '',
		approval: 0,
		sr_details: '',
		sr_department: ''
	};

	$scope.error_message = 'testing';
	$scope.submitRequest = function(){
		$scope.error_message = $scope.newReq;
	}


	$scope.selectedDept = [];

	$scope.selectedDept = angular.forEach($scope.requestCatalogue, function(catItem){
			if (catItem.department == $scope.newReq.sr_department){
				$scope.error_message = "hello";
				$scope.selectedDept = catItem;
			}
		});



});//end of controller

