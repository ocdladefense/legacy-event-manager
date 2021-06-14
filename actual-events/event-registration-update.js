console.log("event registration update.");

(function(){
var handler = {
	handleEvent: function(e){
		var target = e.target;
		var action = target.dataset && target.dataset.action;
		
		if(["save-meal","save-breakout","add-guests"].indexOf(action) == -1) return;
		
		e.preventDefault();
		
		if(action == "save-meal"){
			var form = document.getElementById("meal-form");
			var value = form.elements.meal.value;
			this.saveData({meal:value});
		} else if(action == "save-breakout"){
			var form = document.getElementById("breakout-form");
			var value = form.elements.breakout.value;
			this.saveData({breakout:value});
		} else if(action == "add-guests"){
			window.open("https://ocdla.force.com/OcdlaEvent?id=a230a000009FlkQAAS","Guest Registration");
		}

		return false;
	},
	
	saveData: function(data){
		console.log(data);
		var thePromise = new Promise(function(resolve,reject){
			EventRegistrationUpdate.doUpdate(JSON.stringify(data),lineId,function(result, event){
				console.log(result);
				console.log(event);
				if(event.status) {
					resolve(result);
				} else {
					reject(event)
				}
			}, 
			{escape: true});
		});

		thePromise.then(function(data){
			alert("Your selection was saved.");
		});
		
		thePromise.catch(function(data){
			alert("There was an error saving your data.");
		});
	}
};


document.addEventListener("click",handler,true);

	$(function(){
		var meal = lineData.meal || null;
		var breakout = lineData.breakout || null;
		
		if(null != meal){
			$("input[name='meal']").val([meal]);
		}
		if(null != breakout) {
			$("input[name='breakout']").val([breakout]);
		}
	});

})();