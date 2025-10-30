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

		let form = e.target.form;
		let registrationId = form && form.id;
		let registrationType = form.elements['registration-type'] && form.elements['registration-type'].value;

		domAction("save", registrationId);
	};	

   
	function domAction(action,id){

		let formElem = document.getElementById(id);
		let formData = new FormData(formElem);
		let data = {};
		for (let [key, value] of formData.entries()) {
			if('' != value) data[key] = value;
		}

		console.log(data);

		function updateForm(result) {
			formElem.id = result.Id;
			formElem.dataset.registrationId = result.Id;
			formElem.setAttribute('id', result.Id);
			formElem.setAttribute('data-registration-id', result.Id);
			formElem.elements['Id'].value = result.Id;
		}
		
 		ui.loading();
		save(data).then(updateForm).then(function(){ui.status('Saved.');}).then(ui.delay(ui.complete,1000));
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