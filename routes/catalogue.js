var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Catalogue = mongoose.model('Catalogue');
//Used for routes that must be authenticated.


router.route('/')
	//creates a new catalogue item
	.post(function(req, res){

		Catalogue.findOne({'subcategories.titles.title': req.body.title}, function(err, existingTitle){
			if(err)
				return res.send({message: 'O Error has occurred, please contact your administrator'});
			if(existingTitle){
				return res.send({message: 'Title already exists'});
			}
			else
			{

				if(req.body.toggleCat == 0){
					//Creating new title
					Catalogue.find({'department': req.body.department}, function(err, selectedDepartment){

						if(err)
							return res.send({message: 'P 1 Error has occurred, please contact your administrator'});

						var newTitle = {"title": req.body.title, "eta": req.body.eta, "detail": req.body.detail, "privilege_level": req.body.privilege_level};

						selectedDepartment[0].subcategories.forEach(function(subcat){
							if(subcat.sub_category == req.body.sub_category)
							{
								subcat.titles.push(newTitle);
								selectedDepartment[0].save(function(err, newRecord){
									if(err)
										res.send({message: "P 2 Error has occurred, please contact your administrator"});
									console.log("DONE!");
									res.send({message: "New title has been added", state: "success"});
								});
							}
						})
					})
				}

				else
				{
					//creating a new category with the title
					Catalogue.find({'department': req.body.department}, function(err, selectedDepartment){
						if(err)
							return res.send({message:'1 Error has occurred, please contact your administrator'});
						//checking if this category exists within this department already
						var duplicate = false;
						selectedDepartment[0].subcategories.forEach(function(subcat){
							if(subcat.sub_category == req.body.sub_category)
								duplicate = true;
						})

						if(duplicate){
							return res.send({message: 'Category already exists within this department'});
						}		
						
						else
						{
							var newCategory = {'sub_category': req.body.sub_category, "titles": [{'title': req.body.title, "detail": req.body.detail,
								"privilege_level": req.body.privilege_level, "eta": req.body.eta}]};
							selectedDepartment[0].subcategories.push(newCategory);
							selectedDepartment[0].save(function(err, newRecord){
								if(err)
									return res.send({message: "2 Error has occurred, please contact your administrator"});
								return res.send({message: "New category and title has been added", state: "success"});
							});		
						}
						

					})
				}

			}
		});

		
		/* Commented out for the new Department
		var newCatItem = new Catalogue();
		newCatItem.department = req.body.department;

		var newTitle = {'title': req.body.title, 'detail': req.body.detail, 'privilege_level': req.body.privilege_level, 'eta': req.body.eta};
		var titles = [];
		titles.push(newTitle);

		var newCategory = {'sub_category': req.body.sub_category, 'titles': titles};
		var subcategories = [];
		subcategories.push(newCategory);

		newCatItem.subcategories = subcategories;

		newCatItem.save(function(err, newCatItem){
			if (err)
				return res.send({message: 'Error has occurred'});
			return res.send({message: 'New Category Item Added', state: 'success'});
		});

		*/

	})

	//gets all catalogue items
	.get(function(req, res){
		//Gets list of departments from mongo
		Catalogue.find({ }, {'_id': 0, 'department': 1}, function(err, allDepartments){
			if(err){
				return res.send(500, err);
			}
			res.setHeader('Cache-Control', 'no-cache');
			return res.send(200,allDepartments);
		});
	});

router.route('/item/:title')
	//Gets details of a specific catalogue item using title
	.get(function(req, res){
		Catalogue.findOne({'subcategories.titles.title': req.params.title}, {'subcategories.$': 1, 'department': 1, "_id": 0}, function(err, item){
			if(err)
				res.send({message: 'Error has occurred, please try later'});
			var data = {};

			item.subcategories[0].titles.forEach(function(selectedTitle){
				if(selectedTitle.title == req.params.title){
					data = {'department': item.department, 'sub_category': item.subcategories[0].sub_category,
						'title': selectedTitle.title, 'eta': selectedTitle.eta, 'detail': selectedTitle.detail,
							'privilege_level': selectedTitle.privilege_level};
				}
			})
			res.setHeader('Cache-Control', 'no-cache');
			res.send(data);
		});

	})

	.put(function(req, res){
		//changes the details from the Edit Catalogue Item screen
		Catalogue.findOne({'subcategories.titles.title': req.params.title}, function(err, item){
			if(err)
				res.send({message: 'Error has occurred, please try later'});

			item.subcategories.forEach(function(subcat){
				if(subcat.sub_category == req.body.sub_category){
					subcat.titles.forEach(function(selectedTitle){
						if(selectedTitle.title == req.params.title){
							selectedTitle.title = req.body.title;
							selectedTitle.eta = req.body.eta;
							selectedTitle.detail = req.body.detail;
							selectedTitle.privilege_level = req.body.privilege_level;
						}
					})
				}
			})

			item.save(function(err, item){
				if (err)
					res.send({message: 'Error has occurred, please try later'});
				res.send(item);
			});

		});
	});

router.route('/titlelist')
	//generates list of titles from a given category and department
	.post(function(req, res){
		Catalogue.findOne({'subcategories.sub_category': req.body.sr_category, 'department': req.body.sr_department}, {'subcategories.$': 1, "_id": 0}, function(err, item){
			if(err)
				res.send({message: 'Error has occurred, please try later'});
			if(item != null){
				var data = [];
				item.subcategories[0].titles.forEach(function(selectedTitle){
					data.push(selectedTitle.title);
				})
				res.setHeader('Cache-Control', 'no-cache');
				res.send(data);
			}
		});

	});

router.route('/del')

	.post(function(req, res){

		Catalogue.findOne({'subcategories.titles.title': req.body.title}, function(err, item){
			if(err)
				res.send({message: 'Error has occurred, please try later'});

			item.subcategories.forEach(function(subcat){

				if(subcat.sub_category == req.body.sub_category){
					subcat.titles.forEach(function(selectedTitle, index){
						if(selectedTitle.title == req.body.title){
							subcat.titles.splice(index, 1);
							item.save(function(err, item){
								if (err)
									res.send({message: 'Error has occurred, please try later'});
								res.send({message: 'Item has been deleted'});
							});
						}
					})
				}
			})

		})


	});
router.route('/catlist')
	//used to generate list of categories in a combobox based on department selection
	.put(function(req, res){
		Catalogue.find({'department': req.body.department}, function(err, selectedDepartment){
			if(err){
				return res.send(500, err);
			}

			var data = [];
			selectedDepartment[0].subcategories.forEach(function(subcategory){
				var rec = {'subcategory': subcategory.sub_category};
				data.push(rec);
			})
			res.setHeader('Cache-Control', 'no-cache');
			return res.send(200, data);
		});
	});

router.route('/categories')

	//used to generate the table in the SR Catalogue page
	.put(function(req, res){
		Catalogue.find({'department': req.body.department}, function(err, selectedDepartment){
			if(err){
				return res.send(500, err);
			}

			var data = [];
			selectedDepartment[0].subcategories.forEach (function(subcategory){
				subcategory.titles.forEach (function(title){
					var rec = {'subcategory': subcategory.sub_category, 'title': title.title};
					data.push(rec);
				})
			})  
			res.setHeader('Cache-Control', 'no-cache');
			return res.send(200, data);
		});

	});

module.exports = router;