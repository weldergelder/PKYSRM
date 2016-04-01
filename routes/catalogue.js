var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Catalogue = mongoose.model('Catalogue');
//Used for routes that must be authenticated.


router.route('/')
	//creates a new catalogue item
	.post(function(req, res){
		

		//check if department already exists
		Catalogue.findOne({'department': req.body.department}, function(err, depItem){
			if(err)
				return res.send(err);
			if(!depItem){ //new department, create new one!
				var newCatalogue = new Catalogue();
				newCatalogue.department = req.body.department;
				var newCat = {sub_category: req.body.sub_category, titles: []};
				var newTitle = {title: req.body.title, detail: req.body.detail, eta: req.body.eta,
					privilege_level: req.body.privilege_level, log: []};
				var newLog = {log_detail: 'create', log_by: req.body.currentUser};
				newTitle.log.push(newLog);
				newCat.titles.push(newTitle);
				newCatalogue.subcategories.push(newCat);

				newCatalogue.save(function(err, newCatalogue){
					if(err)
						return res.send(err);
					return res.json(newCatalogue);
				}); //end of saving new catalogue item

			} else { //department exists, check for Categories!
				//check if category exists
				Catalogue.findOne({'subcategories.sub_category': req.body.sub_category}, function(err, catItem){
					if(err)
						return res.send(err);
					if(!catItem){ //new catalogue! Create it.
						var newCat = {sub_category: req.body.sub_category, titles: []};
						var newTitle = {title: req.body.title, detail: req.body.detail, eta: req.body.eta,
							privilege_level: req.body.privilege_level, log: []};
						var newLog = {log_detail: 'create', log_by: req.body.currentUser};
						newTitle.log.push(newLog);
						newCat.titles.push(newTitle);
						depItem.subcategories.push(newCat);

						//return res.send({message: 'Created new Category and Item'});
						return res.json(depItem);

					} else { //catalogue exists! Check for titles.
						Catalogue.findOne({'subcategories.titles.title': req.body.title}, function(err, titleItem){
							if(err)
								return res.send(err);
							if(!titleItem){ //new Title! Create one
								var newTitle = {title: req.body.title, detail: req.body.detail, eta: req.body.eta,
									privilege_level: req.body.privilege_level, log: []};
								var newLog = {log_detail: 'create', log_by: req.body.currentUser};
								newTitle.log.push(newLog);
								catItem.subcategories.titles.push(newTitle);
								return res.send({message: 'created new title'});

							} else { //Title DOES exist, reject the process

								return res.send({message: 'title already exists'});

							} //end of third else

						});// end of findOne - Title

					} //end of second else

				}); //end of findOne - Category



			}//end of first else
		}); //end of findOne - Department

	})

	//gets all catalogue items
	.get(function(req, res){
		Catalogue.find(function(err, catalogueItems){
			if(err){
				return res.send(500, err);
			}
			return res.send(200,catalogueItems);
		});
	});



//catalogue item specific functions
router.route('/:id')
	//gets specified catalogue item
	.get(function(req, res){
		Catalogue.findOne({'_id': id}, function(err, catItem){
			if(err)
				res.send(err);
			res.json(catItem);
		});
	}) 
	//updates specified catalogue item
	.put(function(req, res){
		Catalogue.findOne({'_id': req.params.id}, function(err, catItem){
			if(err)
				res.send(err);

			catItem.department = req.body.department;
			catItem.sub_category = req.body.sub_category;
			catItem.title = req.body.title;
			catItem.detail = req.body.detail;
			catItem.privilege_level = req.body.privilege_level;
			catItem.eta = req.body.eta;
			var newLog = {log_detail: 'change', log_by: req.body.currentUser};
			catItem.log.push(newLog);catItem.save(function(err, catItem){
				if(err)
					res.send(err);

				res.json(catItem);
			});
		});
	})
	//deletes the post
	.delete(function(req, res) {
		Catalogue.remove({
			_id: req.params.id
		}, function(err) {
			if (err)
				res.send(err);
			res.json('Catalogue Item Deleted');
		});
	});

module.exports = router;