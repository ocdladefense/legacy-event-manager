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
		var target = e.target;
		var data = e.target.dataset || null;
		if(!target.id) return false;
		var id = target.id.split('-')[1];
		domAction("save",id);
  };	

   
	function domAction(action,id){
		 var domFirst = document.getElementById("firstname-"+id).value;
		 var domLast = document.getElementById("lastname-"+id).value;
		 var select = document.getElementById("meal-"+id);
		 var domMeal = select.options[select.selectedIndex].value;
 
 		ui.loading();
		save({ Id: id, FirstName__c: domFirst, LastName__c: domLast, Meal__c: domMeal }).then(function(){ui.status('Saved.');}).then(ui.delay(ui.complete,1000));
	}
   

   
   
	libEvent.domReady(function(){
		document.addEventListener("change",listen,true);
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