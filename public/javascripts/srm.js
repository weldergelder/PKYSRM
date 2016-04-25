var app = angular.module('srmApp', ['ngRoute', 'ngResource']).run(function($rootScope, $http, $location){
	$rootScope.authenticated = false;
	$rootScope.currentUser = "";
	$rootScope.privilege_level = 0;
	$rootScope.loggedDepartment = "";
	$rootScope.provider = 0;

	$rootScope.workUser = "";
	$rootScope.workSR = "";

	$rootScope.goHome = function(){
		$location.path('/home');
	};

	$rootScope.goUserList = function(){
		$location.path('/listuser');
	};

	$rootScope.goToAssignedReqList = function(){
		$location.path('/areqlist');
	};

	$rootScope.goToReqList = function(){
		$location.path('/reqlist');
	};


	$rootScope.goToPendingReqList = function(){
		$location.path('/preqlist');
	};


	$rootScope.logout = function(){
		$http.get('/auth/signout');
		$rootScope.authenticated = false;
		$rootScope.currentUser = ""
		$rootScope.privilege_level = 0;
		$rootScope.provider = 0;
		$rootScope.department = "";
		$location.path('/');
	};
});


app.config(function($routeProvider){
	$routeProvider

		.when('/', {
			templateUrl: 'login.html',
			controller: 'authController'
		})

		.when('/home', {
			templateUrl: 'Home.html',
			controller: 'homeController'
		})

		.when('/areqlist/areq', {
			templateUrl: 'AssignedReq.html',
			controller: 'editSRController'
		})

		.when('/areqlist', {
			templateUrl: 'AssignedReqList.html',
			controller: 'serviceRequestView'
		})
		.when('/new', {
			templateUrl: 'NewReq.html',
			controller: 'submitReqController'
		})


		.when('/preqlist/preq', {
			templateUrl: 'PendingReq.html',
			controller: 'editSRController'
		})

		.when('/preqlist', {
			templateUrl: 'PendingReqList.html',
			controller: 'serviceRequestView'
		})

		.when('/reqlist/req', {
			templateUrl: 'ReqDetails.html',
			controller: 'editSRController'
		})
		.when('/reqlist', {
			templateUrl: 'ReqList.html',
			controller: 'serviceRequestView'
		})
		.when('/listuser/newuser', {
			templateUrl: 'UserAdd.html',
			controller: 'addUserController'
		})
		.when('/listuser/edituser', {
			templateUrl: 'UserEdit.html',
			controller: 'editUserController'
		})

		.when('/listuser', {
			templateUrl: 'UserList.html',
			controller: 'credentialManagementController'
		})

		.when('/listuser/viewuser', {
			templateUrl: 'UserView.html',
			controller: 'editUserController'
		});

});


app.factory('userService', function($resource){
	return $resource('/cred/:username', {username:'@username'});
});


app.factory('srService', function($resource){
	return $resource('/sr/:id', {id:'@id'});
});

app.controller('authController', function($scope, $rootScope, $http, $location){
	$scope.user = {username: '', password: ''};
	$scope.error_message = '';

	$scope.login = function(){

		$http.post('/auth/login', $scope.user).success(function(data){


			if(data.state == 'success') {
				$rootScope.authenticated = true;
				$rootScope.currentUser = data.user.username;
				$rootScope.privilege_level = data.user.privilege;
				$rootScope.provider = data.user.provider;
				$location.path('/home');
			}
			else {
				$scope.error_message = data.message;
			}

		})

		.error(function(data){
			$scope.error_message = data;
		});

	};

});

app.filter('filterSR', function(){
	return function(items, search) {
		var filtered = [];
		if(!search){return items;}
		angular.forEach(items, function(item) {
			if (item.created_by == search)
			{
				filtered.push(item);
			}
		});
		return filtered;
	};
})


app.filter('filterPendingSR', function(){
	return function(items, search) {
		var filtered = [];
		if(!search){return items;}
		angular.forEach(items, function(item){
			if(item.status == 'Pending')
			{
				if(item.sr_department == search)
				{
					filtered.push(item);
				}
			}
		});
		return filtered;
	}
})

app.filter('filterAssignedSR', function(){
	return function(items, search) {
		if(!search){return items;}
		angular.forEach(items, function(item){
			if((item.status == 'In Progress') || (item.status == 'Created'))
			{
				if(item.sr_department == search)
				{
					filtered.push(item);
				}
			}
		});
		return filtered;
	}
});

app.controller('credentialManagementController', function($scope, userService, $location, $rootScope){
	$scope.users = userService.query();


	$scope.goToNewUser = function(){
		$location.path('/listuser/newuser');
	}

	$scope.goToUserDetail = function(usernameValue){
		$rootScope.workUser = usernameValue;
		$location.path('/listuser/viewuser');
	}

	$scope.goToUserEdit = function(usernameValue){
		$rootScope.workUser = usernameValue;
		$location.path('/listuser/edituser');
	}



});

app.controller('serviceRequestView', function($scope, srService, $location, $rootScope){
/*	$scope.servicereqs = [];
	$scope.sr1 = {created_by: 'Yousef', title: 'Desktop not working', status: 'In Progress', created_on: '10/01/2015'};
	$scope.sr2 = {created_by: 'Rana', title: 'Puzzle is frustrating', status: 'Pending', created_on: '11/01/2015'};
	$scope.servicereqs.push($scope.sr1);
	$scope.servicereqs.push($scope.sr2);*/

	$scope.servicereqs = srService.query();

	$scope.goToReq = function(){
		$location.path('/reqlist/req');
	}

	$scope.goToPendingReq = function(){
		$location.path('/preqlist/preq');
	}

	$scope.goToAssignedReq = function(){
		$location.path('/areqlist/areq');
	}

});


app.controller('homeController', function($scope, $location, $rootScope){
	

	$scope.goToNewReq = function(){
		$location.path('/new');
	}


	$scope.goToUserList = function(){
		$location.path('/listuser');
	}

});

app.controller('addUserController', function($scope, $http, $rootScope){

	$scope.user = {
		first_name: '',
		last_name: '',
		username: '',
		password: '',
		department:'',
		privilege_level: 0,
		provider: 0,
		currentUser: $rootScope.currentUser

	};
	$scope.error_message = '';

	$scope.signup = function(){
		$http.post('/auth/signup', $scope.user).success(function(data){
			$scope.error_message = data.message;
			if(data.state == 'success'){
				$scope.user = {
					first_name: '',
					last_name: '',
					username: '',
					password: '',
					department:'',
					privilege_level: 0,
					provider: 0
				}
			}

		});


	};
	
});

app.controller('editUserController', function($scope, userService, $rootScope, $http, $location){

	$scope.user = userService.get({username: $rootScope.workUser}, function(fetchedUser){

	});


	$scope.dataSent = {};

	$scope.error_message = '';

	$scope.editUser = function(){
		$scope.dataSent = {'username': $scope.user.username, 'department': $scope.user.department, 'privilege': $scope.user.privilege,
			'provider': $scope.user.provider, 'first_name': $scope.user.first_name, 'last_name': $scope.user.last_name, 'currentUser': $rootScope.currentUser};
		$http.put('/cred/' + $scope.user.username, $scope.dataSent).success(function(data){
			$scope.error_message = 'Account updated successfully';
		})

		.error(function(data){
			$scope.error_message = 'Something went wrong!';
		});
	} ;



	$scope.resetPassword = function(){

	//	$scope.dataSent = {'username': $scope.user.username, 'password': $scope.user.password, 'department': $scope.user.department, 'privilege': $scope.user.privilege,
	//		'provider': $scope.user.provider, 'first_name': $scope.user.first_name, 'last_name': $scope.user.last_name, 'currentUser': $rootScope.currentUser};

		$scope.dataSent = {'username': $scope.user.username,'password': $scope.user.password, 'currentUser': $rootScope.currentUser};

		$http.put('/cred/pwd', $scope.dataSent).success(function(data){
			$scope.error_message = data.message;
		})
		
		.error(function(data){
			$scope.error_message = 'Error has occurred';
		}); 
	};

	$scope.delUser = function(){
		$http.delete('/cred/'+$scope.user.username, $scope.user.username).success(function(data){
			$location.path('/home');
		})
		.error(function(data){
			$scope.error_message = 'Process Failed';
		});
	};

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
			},//end of third title
			{
				title: 'Request new device',
				detail: 'Request replacement of Computer',
				privilege_level: 1,
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


	$scope.submitRequest = function(){
		//$scope.error_message = $scope.newReq;
	}

	/*
	$scope.curSubCat = '';
	$scope.i=0;
	$scope.selectedDept = $scope.requestCatalogue[$scope.i];

	$scope.loadCategory = function(){

		if ($scope.i)
			$scope.i = 0;
		else
			$scope.i = 1;

		$scope.error_message = $scope.i;
		/*angular.forEach($scope.requestCatalogue, function(value, key){
				$scope.error_message = value.department + " " + $scope.newReq.sr_department;
				if (true){
					$scope.error_message = "hello";
					$scope.selectedDept = $scope.requestCatalogue[key];
				}
				//$scope.error_message = $scope.selectedDept;
			});
	}

*/
});//end of controller