globalScripts(["require","libData",
"default/modules/event-manager/js/settings"],function(require,libData,settings){



	function parseTemplate(templateId,data,tString){		
		var container;
	
		container = document.getElementById(templateId);
		if(!container && !tString) throw templateId + ' is not a valid template id.';
		tString = tString || container.innerText;
		for(var i in data) {
			var replacement = data[i]||'';
			tString = tString.replace(new RegExp('\\{\\{\\s*'+i+'\\s*\\}\\}','gi'),replacement);
		}
		// tString = tString.replace(new RegExp('\\{\\{(.*?)\\}\\}','gi'),'');
		return tString;
	}

	function parseString(data,tString){
		return parseTemplate(null,data,tString);
	}


	function advance(classNames){
		$('.stage').addClass('panel-active');
	}

	function regress(){
		$('.stage').removeClass('panel-active');	
	}

	function loadEvent(eventId){
		var evt;
	
		for(var i = 0; i<OCDLAEvents.length; i++){
			if(OCDLAEvents[i].Id == eventId){
				return OCDLAEvents[i];
			}
		}
	
		return {};
	}

	function getMealDropDown(data){
		var useDefault = true;
		var allowUndecided = true;
		var menu = [{value:'steak',name:'Steak'},{value:'salmon',name:'Salmon'},{value:'vegan',name:'Stuffed Red Pepper (Vegan)'}];
		var options = [];
		var noSelection = data.meal == null || data.meal == '' ? true : false;
		useDefault && options.push('<option '+(noSelection ? ' selected="selected"' : '') + ' disabled="disabled" value="null">Select a meal</option>');
		allowUndecided && options.push('<option value="unsure">Not sure</option>');
	
	
		for(var i=0; i<menu.length;i++){
			if(data.meal == menu[i].value) {
				options.push('<option selected="selected" value="'+menu[i].value+'">'+menu[i].name+'</option>');
			} else {
				options.push('<option value="'+menu[i].value+'">'+menu[i].name+'</option>');		
			}
		}
		var t = '<select name="meal">';

			t += options.join('\n');

		t+= '</select>';
	
		return t;
	}


	function isTable(Product2Id){
		if(typeof Product2Id != "string") {
			throw new Error('This Product2Id is not a string!');
		}
		console.log('Checking if Product2Id, '+Product2Id+' , is = '+ASSIGNED_TABLE_PRODUCT2_ID);
		return Product2Id == ASSIGNED_TABLE_PRODUCT2_ID;
	}


	function testDoSaveData(data) {
		var testData = {FirstName: 'Autumn',LastName: 'Bernal',meal:'beaker'};
		testData.Id = !!data.Id && !data.FirstName ? data.Id : '802Q00000013D74IAE';
	
		doSaveData(defaultData);
	}

	function doSaveData(data) {
		var RegistrantData = {};
	
		// data = Array.isArray(data) ? data : [data];
	
		for(var i in data){
			RegistrantData[i] = JSON.stringify(data[i]);
			// RegistrantData[data[i].Id] = JSON.stringify(data[i]);
		}
	
	
		saveData(RegistrantData)
		.then(function(result){
			console.log(result);
			alert('Your changes were saved!');
		})
		.catch(function(message){
			alert(message);
		});
	}

	function saveData(RegistrantData){
		return new Promise(function(resolve,reject){
			EventManagerController.saveOrderLineData(RegistrantData,function(result, event){
				if (event.status) {
					resolve(result);
				} else {
					reject(result,event);
				}
			}, 
			{escape: true});
		});
	}


	function displayEvent(event,lines,selector){
		var eventMarkup, domElement,
	
		getCid = function(){
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});
		},
		// Registrations should be grouped together in sequential Seats
		// tables of 8 should each be their own Registration Group.
		regGroupsHtml = '',
	
		selector = selector || '.stage #event-content';
	
	
		eventMarkup = parseTemplate('event-template',event);

		var newGroup = true;
	
		for(var idx= 0; idx<lines.length;){	
			var indexMarker = idx;
			var orderNumberMarker = lines[idx].OrderNumber;
			var orderIdMarker = lines[idx].OrderId;
			var orderQuantityMarker = lines[idx].Quantity;
			var AttendeeNumber = 0;		
			var rLinesMarkup = '';
			var rFieldsMarkup = [];			

			
			do {

				// Remember that for each Line, Data has been normalized.
				// so even legacy lines have at least one object in <Data> corresponding 
				// to the "default" Attendee.
				var rData = lines[idx].RegistrationData;

				for(var i =0; i<rData.length; i++){
					rData[i].AttendeeNumber = ++AttendeeNumber;
					rData[i].meal = getMealDropDown(rData[i]);
					rData[i].OrderItemId = lines[idx].Id;
					rData[i].Product2Name = lines[idx].Product2Name || 'Event Ticket';
					rFieldsMarkup.push(parseTemplate('registrant-template',rData[i]));
				}
			
			
				if(  isTable(lines[idx].Product2Id) || ( lines[idx+1] && (isTable(lines[idx].Product2Id) != isTable(lines[idx+1].Product2Id)) )  ) {
					++idx;
					break;
				} else {
					++idx;
				}
			} while(!!lines[idx] && !isTable(lines[idx].Product2Id) && lines[idx].OrderNumber == orderNumberMarker && lines[idx].Quantity == orderQuantityMarker);
		
			/*
			rLinesMarkup += parseTemplate('line-template',{
				OrderNumber: lines[indexMarker].OrderNumber,
				Id: lines[indexMarker].Id,
				registrantFields: rFieldsMarkup.join('\n')
			});
			*/

		
			regGroupsHtml += parseTemplate('registrant-group-template',{
				OrderNumber: orderNumberMarker,
				OrderId: orderIdMarker,
				//registrantGroup:rLinesMarkup,
				registrantGroup: rFieldsMarkup.join('\n'),
				cid:getCid()
			});
		
		}//for

	
		// console.log(rLinesMarkup);
		markup = parseString({registrantHtml:regGroupsHtml},eventMarkup);
	
		advance();
		$(selector).html(markup);
	
		var savers = document.querySelectorAll('.form-actions button');
	
		for(var i = 0; i<savers.length; i++){
			savers[i].addEventListener('click',saveRegistrantGroup,false);
		}
	}



	function getMonthName(i){
		var months = ['Jan.','Feb.','Mar.','Apr.','May','Jun.','Jul.','Aug.','Sept.','Oct.','Nov.','Dec.'];
		return months[parseInt(i)-1];	
	}



	function getDateFromText(text){
		return new Date(text.replace(/\s/, 'T'));
	}

	// You can use new Date('2014-02-18T15:00:48'.replace(/\s/, 'T')+'Z').
	// https://stackoverflow.com/questions/21883699/safari-javascript-date-nan-issue-yyyy-mm-dd-hhmmss
	function dateFormat(d) {
		var theDate,
	
		staticDate = '2014-02-18T15:00:48';
	
		theDate = staticDate;
	
		console.log(d);
		theDate = getDateFromText(theDate);
	
		return theDate;
	}


	function getRegistrationDate(regDate) {
		var now = new Date();
		regDate = getDateFromText(regDate);
		var thisyear = now.getFullYear();
		var fullDate;
		var friendlyDate;
	
		friendlyDate = thisyear === regDate.getFullYear() ? (getMonthName(regDate.getMonth())+' ' +regDate.getDay()) : (getMonthName(regDate.getMonth()) + ' ' +regDate.getDay()+', '+regDate.getFullYear());
	
		return " on "+friendlyDate;
	}



	/**
	 *
	 * 
	 *
	 * 	/*lines = [{Id:'foobar',Data__c:[{FirstName: 'José',LastName:'Bernal',meal:'Steak'},{FirstName: 'Autumn',LastName:'Bernal',meal:'Chicken'}]},
		{Id:'bazpow',Data__c:[{FirstName: 'Tracye',LastName: 'May',meal:'Chicken'}]}];
	 */
	function doEventLoad(eventId){
		var lines, event, regDate;
	
		lines = registrations[eventId];
		console.log('LOADING EVENT. REGISTRATION DATA IS: ');
		console.log(lines);
	
		event = loadEvent(eventId);
	
		event.notices = '';//'<div class="warning">This event is currently disabled while we update our website.  Check back soon to manage this event.</div>';

	
		console.log(event);
		console.log(event.Start_Date__c.split(".")[0].split("T")[0]);
	
		regDate = getDateFromText(event.Start_Date__c);
		event.RegistrationDateText = getRegistrationDate(regDate);
		event.EventText = "This event begins on "+event.RegistrationDateText;
		event.RegistrationText = "You last registered for this Event "+event.RegistrationDateText;


	
		for(var i = 0; i<lines.length; i++){
			console.log(lines[i]);
			var qty = lines[i].Quantity;
			var data = [];
			var json = lines[i].Data == null ? JSON.parse('[{}]') : JSON.parse(lines[i].Data);
				json = Array.isArray(json) ? json : [json];		
			var table = isTable(lines[i].Product2Id);
		

			console.log(table ? "This is a table." : "This is NOT a table.");

			if(!table && lines[i].Data == null) {
				for(var idx = 1; idx <= qty; idx++){
					if(idx == qty){
						data.unshift({FirstName: lines[i].FirstName, LastName: lines[i].LastName, meal: null});				
					} else {
						data.push({FirstName: '', LastName: '', meal: null});								
					}

				}
			// otherwise if a table
			} else if(table && lines[i].Data == null) {
				data.push({FirstName: lines[i].FirstName, LastName: lines[i].LastName, meal: null});
				for(var idx = 2; idx <= 8; idx++){
					data.push({FirstName: '', LastName: '', meal: null});
				}
			// finally, if Data is not null
			} else if(!table) {
				console.log('This is not a table.');
				data = getDefaultAttendees(lines[i],json);
			} else {
				console.log('This is a table.');		
				console.log('LINE DATA before: ');
				console.log(data);
				data = getDefaultAttendees(lines[i],Array.isArray(json) ? json : [json]);
				// var tmp = lines[i].Data == null ? null : JSON.parse(lines[i].Data);

				// data = 
				console.log('LINE DATA after: ');
				console.log(data);
			}
		

			lines[i].RegistrationData = data;
		}

	
		displayEvent(event,lines);
	}



	function getDefaultAttendees(line,json){
		console.log('getting default attendees...');
		console.log(line);
	
		var defaults = {
			FirstName: (line.FirstName || ''),
			LastName: (line.LastName || ''),
			meal: (line.meal || null)
		};
	
		for(var idx = 0; idx < 1; idx++){
			for(var i in defaults){
				if(!json[idx][i]) {
					json[idx][i] = defaults[i];
				}
			}
		}
	
		// if more than one 
		for(var idx = 1; idx < json.length; idx++){
			for(var i in defaults){
				if(!json[idx][i]) {
					json[idx][i] = '';
				}
			}
		}
	
		// If the attached Data doesn't reflect the Quantity of tickets ordered
		// then correct the JSON.
		if(json.length < line.Quantity && !isTable(line.Product2Id)){
			for(var idx = json.length; idx < line.Quantity; idx++){
				json[idx] = {FirstName: '', LastName: '', meal: null};
			}
		} else if(json.length < 8 && isTable(line.Product2Id)){
			console.log('Encountered table json');
			console.log(json)
			for(var idx = json.length; idx < 8; idx++){
				json[idx] = {FirstName: '', LastName: '', meal: null};
			}

		}

			console.log(json)	
		return json;
	}



	function doEventSelect(e){
		var target, eventId;
	
		target = e.target || e.srcElement;
	
		if(!target.dataset || !target.dataset.eventId) {
			target = target.parentNode;
		}
	
		if(!target.dataset || !target.dataset.eventId) {
			return false;
		}
	
		e = e || window.event;
		e.preventDefault();
	
		eventId = target.dataset.eventId;
	
		// ui.doEventLoad;
		doEventLoad(eventId);
	
		return false;
	}


	function saveRegistrantGroup(e){
		e.preventDefault();
		e.stopPropagation();
	
		var cid = e.target.dataset.cid;
	
		$group = $('.registrant-group[data-cid="'+cid+'"]');
		$registrants = $group.find('.registrant');
	
		console.log($registrants);
		var lines = {};
	
		$registrants.each(function(){
			var $lineId = $(this).attr("data-order-item-id"),
		
			$FirstName,
		
			$LastName,
		
			$meal;
		
			console.log('Line id is: '+$lineId);
			if(!lines[$lineId]) {
				lines[$lineId] = [];
			}
		
			$FirstName = $(this).find('input[name="FirstName"]').val();
			$LastName = $(this).find('input[name="LastName"]').val();
			$meal = $(this).find('select[name="meal"]').val();
		
			lines[$lineId].push({FirstName: $FirstName, LastName: $LastName, meal: $meal});
		});
	
		console.log(lines);
	
		doSaveData(lines);
	
		return false;
	}



	$(function(){
		var picker = document.querySelector('.picker');
		picker.addEventListener('click',doEventSelect,false);
	});


});