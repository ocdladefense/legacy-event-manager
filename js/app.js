globalScripts(["require","libEvent","libData","all/modules/cart/js/cart",
"default/modules/event-manager/js/settings"],function(require,libEvent,libData,cart,settings){


	var ui = {
	  loading: function(){
	  	$('#app-status').removeClass('loading');
	  	$('#app-status').toggleClass('loading').fadeIn().html('Saving...');
	  },
	  
	  delay: function(fn,timeo){
	  	return function(){ setTimeout(fn,timeo); };
	  },
	  
	  complete: function(){
	  	$('#app-status').fadeOut();
	  },
	  
	  status: function(status){
	  	$('#app-status').html(status);	  
	  }
	};

	var listen = function listen(e) {
		console.log("change event");

		/*
		var target = e.target;
		var data = e.target.dataset || null;
		if(!target.id) return false;
		var id = target.id.split('-')[1];
		*/
		domAction("save",e.registrationId);
	};	

   
	function domAction(action,id){
		 /*
		 var domFirst = document.getElementById("firstname-"+id).value;
		 var domLast = document.getElementById("lastname-"+id).value;
		 var select = document.getElementById("meal-"+id);
		 var domMeal = select.options[select.selectedIndex].value;
		*/
		let form = new FormData(document.getElementById(id));
		let obj = {};
		for (let [key, value] of form) {
			obj[key] = value;
		}

		// obj[Meal2Notes__c] = foo;
		// obj[MealNotes__c] = foo;
		// obj[Meal2__c] = foo;
		/*
		Id: "a2705000000LYOIAA4"
		firstname: "Jose"
		lastname: "Bernal"
		meal-Friday-Lunch: "Turkey"
		meal-Saturday-Lunch: "none"
		meal-notes-Friday-Lunch: ""
		meal-notes-Saturday-Lunch: ""
		*/
		console.log(obj);
		let data = {
			Id: obj.Id,
			FirstName__c: obj.FirstName__c,
			LastName__c: obj.LastName__c,
			Meal__c: obj['meal-Friday-Lunch'],
			Meal2__c: obj['meal-Saturday-Lunch'],
			MealNotes__c: obj['meal-notes-Friday-Lunch'],
			Meal2Notes__c: obj['meal-notes-Saturday-Lunch']
		};

		console.log(data);
		
 		ui.loading();
		save(data).then(function(){ui.status('Saved.');}).then(ui.delay(ui.complete,1000));
	}
   
   
	libEvent.domReady(function() {
		let fn = function(e) {
			let target = e.currentTarget;
			let regId = target.dataset && target.dataset.registrationId;

			e.registrationId = regId;
		};

		document.querySelectorAll(".registration").forEach(function(el) {
			el.addEventListener("change",fn);
		});

		document.addEventListener("change",listen);
		cart.removeAddToCartHandler(); // Remove default cart listeners that may interfere with this app.	
	});
   
   
  function save(reg){
   	console.log("Saving...");
   	return new Promise(function(resolve,reject){
   		EventManagerController.saveOrderLineData(reg,function(result, event){
				if(event.status) {
					resolve(result);
				} else {
					reject(event)
				}
			}); 		
   	});
  }

});