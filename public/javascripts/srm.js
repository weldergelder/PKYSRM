var app = angular.module('srmApp', ['ngRoute', 'ngResource']).run(function($rootScope, $http, $location){
	$rootScope.authenticated = false;
	$rootScope.currentUser = "";
	$rootScope.privilege_level = 0;
	$rootScope.loggedDepartment = "";
	$rootScope.provider = 0;

	$rootScope.workUser = "";
	$rootScope.workSR = "";

	$rootScope.workCat = "";

	$rootScope.workRole = "";

	$rootScope.goHome = function(){
		$location.path('/home');
	};

	$rootScope.goUserList = function(){
		$location.path('/listuser');
	};

	$rootScope.goToAssignedReqList = function(){
		$rootScope.workRole = "Provider";
		$location.path('/areqlist');
	};

	$rootScope.goToReqList = function(){
		$location.path('/reqlist');
	};


	$rootScope.goToPendingReqList = function(){
		$rootScope.workRole = "Manager";
		$location.path('/preqlist');
	};

	$rootScope.goToReqCat = function(){
		$location.path('/reqcat');
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
		})

		.when('/reqcat', {
			templateUrl: 'RequestCat.html',
			controller: 'reqCatalogueController'
		})

		.when('/reqcat/newcat', {
			templateUrl: 'NewCat.html',
			controller: 'newCatController'
		})

		.when('/reqcat/editcat', {
			templateUrl: 'EditCat.html',
			controller: 'editCatController'
		});

});


app.factory('userService', function($resource){
	return $resource('/cred/:username', {username:'@username'});
});

app.factory('catService', function($resource){
	return $resource('/cat/:title', {title: '@title'});
});


app.factory('srService', function($resource){
	return $resource('/sr/:currentUser', {currentUser:'@currentUser'});
});

app.factory('srViewService', function($resource){
	return $resource('/sr/item/:id', {id:'@id'});
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
				$rootScope.loggedDepartment = data.user.department;
				$location.path('/home');
			}
			else {
				$scope.error_message = data.message;
			}

		})

		.error(function(data){
			$scope.error_message = "Error has occurred, please contact your administrator";
		});

	};

});


app.controller('reqCatalogueController', function($scope, $rootScope, $http, $location, catService){

	//Business Logic for Request Catalogue Screen
	$scope.titles = [];
	$scope.departments = catService.query();
	$scope.selectedDepartment = '';
	$scope.error_message = '';

	//invoked upon department selection of catalogue screen
	//displays table of all catalogue items within that department
	$scope.getTitles = function(){
		if($scope.selectedDepartment){
			$scope.sentData = {'department': $scope.selectedDepartment};
			$http.put('/cat/categories', $scope.sentData).success(function(data){
				$scope.titles = data;
			})
			
			.error(function(data){
				$scope.error_message = "Error has occurred, please contact your administrator";
			}); 
		}

	}

	$scope.goToNewCat = function(){
		$location.path('/reqcat/newcat');
	}

	$scope.goToCatEdit = function(catTitle){
		$rootScope.workCat = catTitle;
		$location.path('/reqcat/editcat');
	}

});

app.controller('editCatController', function($scope, $rootScope, $http, $location, catService){
	if($rootScope.workCat){
		//$scope.catItem = catService.get({title: $rootScope.workCat}, function(fetchedCatItem){ });
		$http.get('/cat/item/' + $rootScope.workCat).success(function(data){
			$scope.catItem = data;
		})
		.error(function(data){
			$scope.error_message='Error has occurred, plesae contact your administrator';
		});
	}

	$scope.editCat = function(){
		$http.put('/cat/item/' + $rootScope.workCat, $scope.catItem).success(function(data){
			$scope.error_message = 'Catalogue Item updated successfully';
			$rootScope.workCat = $scope.catItem.title;
		})

		.error(function(data){
			$scope.error_message = 'Error has occurred, please contact your administrator';
		});
	};

	$scope.delCat = function(){
		$scope.catItem.title = $rootScope.workCat;
		$http.post('/cat/del', $scope.catItem).success(function(data){
			$location.path('/home');
		})
		.error(function(data){
			$scope.error_message = 'Error has occurred, please contact your administrator';
		});

	};

});

app.controller('newCatController', function($scope, $rootScope, $http, $location, catService){

	//populates list of departments
	$scope.departments = catService.query();
	$scope.subcategories = [];
	$scope.department = '';

	$scope.sub_category = '';
	$scope.title = '';
	$scope.detail = '';
	$scope.privilege_level = 0;
	$scope.eta = 3;
	$scope.toggleCategory = 0;

	$scope.error_message = '';

	$scope.getCategories = function(){
		//populate the select box for categories based on department selection
		if($scope.department){
			$scope.dataSent = {'department': $scope.department};
			$http.put('/cat/catlist', $scope.dataSent).success(function(data){
				$scope.subcategories = data;
			});
		}

	};

	$scope.toggleCat = function(){
		//toggle between new title and a new category
		if($scope.toggleCategory == 0){
			$scope.toggleCategory = 1;
		}
		else
		{
			$scope.toggleCategory = 0;
		}
	};

	$scope.addNewCat = function(){
		//Using an existing Category
		$scope.dataSent = {'department': $scope.department, 'sub_category': $scope.sub_category, 'title': $scope.title,
				'detail': $scope.detail, 'eta': $scope.eta, 'privilege_level': $scope.privilege_level, 'toggleCat': $scope.toggleCategory};
		$http.post('/cat', $scope.dataSent).success(function(data){
			$scope.error_message = data.message;
			if(data.state == 'success'){
				$scope.department = '';
				$scope.sub_category = '';
				$scope.title = '';
				$scope.detail = '';
				$scope.privilege_level = 0;
				$scope.eta = 3;
			}
		})

		.error(function(data){
			$scope.error_message = data.message;
		});


		/* Commented out for creating a new Department
		$scope.dataSent = {'department': $scope.department, 'sub_category': $scope.sub_category, 'title': $scope.title, 'detail': $scope.detail,'privilege_level': $scope.privilege_level, 'eta': $scope.eta};
		$http.post('/cat', $scope.dataSent).success(function(data){
			$scope.error_message = data.message;
			if(data.state == 'success'){
				$scope.department = '';
				$scope.sub_category = '';
				$scope.title = '';
				$scope.detail = '';
				$scope.privilege_level = 0;
				$scope.eta = 3;
			}

		});
		*/


	};

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

app.factory('srListService', function($resource){
	//Used for generating lists on privileged users and services providers views
	return $resource('/sr/list/:user/:department', {user:'@user', department: '@department'});
});

app.controller('serviceRequestView', function($scope, $http, srService, srListService, $location, $rootScope){

	//getting SRs created by logged user
	if($rootScope.currentUser){
		$scope.servicereqs = srService.query({currentUser: $rootScope.currentUser}, function(fetchedUser){ },
			function(fetchedUser){
				$scope.error_message = "Error has occurred, please contact your adminisrator";
		});
	}

	//getting SRs the user should service
	if($rootScope.provider){
		if($rootScope.workRole == "Provider"){
			$scope.assignedServiceReqs = srListService.query({department: $rootScope.loggedDepartment, user: 'provider'}, 
				function(fetchedSRs){
					//success
					console.log($rootScope.loggedDepartment);
				},
				function(fetchedSRs){
					$scope.error_message = "Error has occurred, please contact your adminisrator";
				});
		}
	}

	//getting SRs the user should approve/cancel
	if($rootScope.privilege_level){
		if($rootScope.workRole == "Manager"){
			$scope.pendingServiceReqs = srListService.query({department: $rootScope.loggedDepartment, user: 'mgr'}, function(fetchedSRs){ },
				function(fetchedSRs){
					$scope.error_message = "Error has occurred, please contact your adminisrator";
				});
		}
	}

	
	$scope.goToReq = function(sr){
		$rootScope.workSR = sr;
		$location.path('/reqlist/req');
	}
	
	$scope.goToPendingReq = function(sr){
		$rootScope.workSR = sr;
		$location.path('/preqlist/preq');
	}
	
	$scope.goToAssignedReq = function(sr){
		$rootScope.workSR = sr;
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

		})

		.error(function(data){
			$scope.error_message = "Error has occurred, please contact your administrator";
		});


	};
	
});

app.controller('editUserController', function($scope, userService, $rootScope, $http, $location){

	$scope.user = userService.get({username: $rootScope.workUser}, function(fetchedUser){ });


	$scope.dataSent = {};

	$scope.error_message = '';

	$scope.editUser = function(){
		$scope.dataSent = {'username': $scope.user.username, 'department': $scope.user.department, 'privilege': $scope.user.privilege,
			'provider': $scope.user.provider, 'first_name': $scope.user.first_name, 'last_name': $scope.user.last_name, 'currentUser': $rootScope.currentUser};
		$http.put('/cred/' + $scope.user.username, $scope.dataSent).success(function(data){
			$scope.error_message = 'Account updated successfully';
		})

		.error(function(data){
			$scope.error_message = 'Error has occurred, please contact your administrator';
		});
	} ;



	$scope.resetPassword = function(){

		$scope.dataSent = {'username': $scope.user.username,'password': $scope.user.password, 'currentUser': $rootScope.currentUser};

		$http.put('/cred/pwd', $scope.dataSent).success(function(data){
			$scope.error_message = 'Password updated successfully';
		})
		
		.error(function(data){
			$scope.error_message = 'Error has occurred, please contact your administrator';
		}); 
	};

	$scope.delUser = function(){
		$http.delete('/cred/'+$scope.user.username, $scope.user.username).success(function(data){
			$location.path('/home');
		})
		.error(function(data){
			$scope.error_message = 'Error has occurred, please contact your administrator';
		});
	};

});


app.controller('editSRController', function($scope, $rootScope, $http, srViewService){
	if($rootScope.workSR){
		$scope.servicereq = srViewService.get({id: $rootScope.workSR}, function(fetchedSR){ },
			function(fetchedSR){
				$scope.error_message = "Error has occurred, please contact your adminisrator";
			});
	}

	$scope.new_comment = '';
	$scope.error_message = '';

	$scope.addComment = function(){
		
		//SAVE COMMENT
		$scope.dataSent = {
			'currentUser': $rootScope.currentUser,
			'commentText': $scope.new_comment
		};
		$http.post('/sr/comment/' + $scope.servicereq.id, $scope.dataSent).success(function(data){
			$scope.servicereq = srViewService.get({id: $rootScope.workSR}, function(fetchedSR){ },
			function(fetchedSR){
				$scope.error_message = "Error has occurred, please contact your adminisrator";
			});
			$scope.new_comment = '';
		})
		.error(function(data){
			$scope.error_message = "Error adding comment, please contact your administrator";
		});	
	}

	
	$scope.changeStatus = function(sr, newState){
		//Changing status of the SR by privileged user or service provider
		$http.post('/sr/item/' + sr, {'newState': newState, 'currentUser': $rootScope.currentUser}).success(function(data){
			$scope.servicereq = srViewService.get({id: $rootScope.workSR}, function(fetchedSR){ },
			function(fetchedSR){
				$scope.error_message = "Error has occurred, please contact your adminisrator";
			});
		})
		.error(function(data){
			$scope.error_message = "Error adding comment, please contact your administrator";
		});
	}

	

});



app.controller('submitReqController', function($scope, $rootScope, $http, $location, catService){

	$scope.sr_department = '';
	$scope.sr_category = '';
	$scope.sr_title = '';
	$scope.sr_detail = '';
	$scope.sr_desc = '';
	$scope.sr_eta = '';
	$scope.sr_privilege_level = '';

	$scope.titles = {};
	$scope.subcategories = {};
	$scope.departments = catService.query();

	$scope.newReq = {};

	$scope.resetFields = function(){
		$scope.sr_title = '';
		$scope.sr_detail = '';
		$scope.sr_desc = '';
		$scope.sr_eta = '';
		$scope.sr_privilege_level = '';
	};

	$scope.getCategories = function(){
		//populate the select box for categories based on department selection
		if($scope.sr_department){
			$scope.dataSent = {'department': $scope.sr_department};
			$http.put('/cat/catlist', $scope.dataSent).success(function(data){
				$scope.subcategories = data;
				$scope.resetFields();
				$scope.titles = {};
			})
			.error(function(data){
				$scope.error_message = "Error has occurred, please contact your administrator";
			});
		}

	};

	$scope.getTitleDetails = function(){
		if($scope.sr_title){
			$http.get('/cat/item/' + $scope.sr_title).success(function(data){
				$scope.sr_detail = data.detail;
				$scope.sr_eta = data.eta;
				$scope.sr_privilege_level = data.privilege_level;
			})
			.error(function(data){
				$scope.error_message = "Error has occured, please contact your administrator";
			});
		}
	};

	$scope.getTitles = function(){
		if($scope.sr_category){
			$scope.dataSent = {'sr_department': $scope.sr_department, 'sr_category': $scope.sr_category};
			$http.post('/cat/titlelist', $scope.dataSent).success(function(data){
				$scope.titles = data;
				$scope.resetFields();
			})
			.error(function(data){
				$scope.error_message = "Error has occurred, please contact your administrator";
			});
		}
	};

	$scope.submitRequest = function(){
		$scope.newReq = {
			'sr_department': $scope.sr_department,
			'sr_title': $scope.sr_title,
			'sr_details': $scope.sr_desc,
			'sr_currentUser': $rootScope.currentUser,
			'sr_eta': $scope.sr_eta,
			'sr_privilege_level': $scope.sr_privilege_level
		};

		$http.post('/sr', $scope.newReq).success(function(data){
			$scope.error_message = data.message;
			$scope.resetFields();
			$scope.sr_category = '';
			$scope.titles = {};
			$scope.subcategories = {};
		})
		.error(function(data){
			$scope.error_message = "Error has occurred, please contact your administrator";
		});

	}

});//end of controller