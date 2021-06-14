	           <script id="event-template" type="text/template">
<!-- End_Date__c, Start_Date__c, , -->
				<h2>{{Name}}</h2><div class="dates">{{Banner_Date_Text__c}}</div><div class='venue'>{{Banner_Location_Text__c}}</div>
               <div class="registration-overview">
                  {{RegistrationText}}
                   </div>
                <div class="notices">
                    {{notices}}
                    </div>
                <div class="event-section">
                    <h3 class="event-section-title">Registrants</h3>
                    <div class="event-section-content">
                        {{registrantHtml}}
                        </div>
                </div>

            </script>


            <script id="registrant-group-template" type="text/template">
				<!-- Id, Quantity, FirstName__c, LastName__c, Contact__c -->
				<div class="registrant-group" data-cid="{{cid}}">
                    <div class="registrant-group-order-number" data-order-id="{{OrderId}}">
                    	Order #{{OrderNumber}}
                    </div>
                    <div class="registrant-group-content">
						{{registrantGroup}}
                        <div class="form-actions">
                            <button data-cid="{{cid}}" type="submit" value="Save">Save</button>
                        </div>
                    </div>
                </div>
            </script>
            
            
            <script id="line-template" type="text/template">
				<!-- Id, Quantity, FirstName__c, LastName__c, Contact__c -->
				<div class="order-item order-item-{{Id}}">
					
                    <form id="theform-{{Id}}">
                        <input type="hidden" name="order-item-id" id="order-item-{{Id}}" value="{{Id}}" />
                        {{registrantFields}}
                    </form>
                        
                </div>
            </script>
            
            <script id="registrant-template" type="text/template">
				<!-- Id, Quantity, FirstName__c, LastName__c, Contact__c -->
				
               <div class="registrant" data-order-item-id="{{OrderItemId}}">
                   <div class="registrant-label">
                       <span class="registrant-seat-number">Seat #{{AttendeeNumber}}</span><span class="registrant-ticket-name">{{Product2Name}}</span>
                       </div>
                    <div class="form-item form-item-first-name">
                        <label>First Name</label>
                    <input type="text" size="15" placeholder="registrant first name" name="FirstName" value="{{FirstName}}" />
                </div>
				<div class="form-item form-item-last-name">
                    <label>Last Name</label>
                    <input type="text" size="25" name="LastName" placeholder="registrant last name" value="{{LastName}}" />
                </div>
                    
				<div class="form-item form-item-last-name">
                    <label>Meal Selection</label>
                    {{meal}}
                </div>
                    </div>
            </script>