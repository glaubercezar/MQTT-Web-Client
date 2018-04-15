(function() {

	angular
		.module('app.controllers')
		.controller("HomeController", HomeController);


	function HomeController($scope, $timeout, $filter, $mdDialog, $mdToast, $indexedDB, services) {

		var vm = this, client;
		
		vm.enviroment;
		vm.enviroments = JSON.parse(localStorage.getItem("enviroments")) || {};
		vm.connected = false;
		vm.subs = [];
		vm.messages = [];

		vm.pub = {
			description: null, msg:{}
		};

		vm.sub = {
			description: null, msg:{}
		};

		vm.connect = function(env){

			if(env !== "edited")
			vm.enviroment = vm.enviroments[env];

			if(client) client.end(true);

			client = services.connect.doConnect(vm.enviroment);

			client.on('error', function (err){
				console.log(err);
				vm.connected = false;
				$scope.$evalAsync();
	            client.end();
	        });

	        client.on('connect', function (){
				console.log('client connected');
				vm.connected = true;
				$scope.$evalAsync();
				init();
	        });

	        client.on('close', function (){
				console.log('client disconnected');
				vm.connected = false;
				$scope.$evalAsync();
			});
			
			client.on('message', function(topic, message) {
				
				console.log('%creceived topic: '+ topic, 'color: green; display: block;');
				
				for(var i = 0; i < vm.subs.length; i++) {

					var combine = services.topic.verify(topic, vm.subs[i].topic);
					
					if(combine) {

						vm.subs[i].msgs +=1;

						try {
							var msg = (vm.subs[i].schema) ? services.avroHelper.decode(vm.subs[i].schema, message) : JSON.parse(message);
						} catch(err) {
							var msg = "Was not possible read the message";
						}
						
						var time = $filter('date')(new Date().getTime(), "dd/MM 'at' HH:mm:ss");
						var msgToAppend = '<div class="msg">' +
										  	'<div class="topic">' + topic +'</div><div class="time">' + time +'</div>' +
										  	'<pre>' + JSON.stringify(msg, null, 2) + '</pre>' +
										  '</div>';

						if(!vm.subs[i].cumulate)
							angular.element(document.querySelector("#sub_"+i+" .msgs")).html("");

						angular.element(document.querySelector("#sub_"+i+" .msgs")).prepend( msgToAppend );
												  
						$scope.$evalAsync();
					}
				}
				
			});

		}

		vm.disconnect = function(){
			if(client) client.end(true);
			vm.connected = false;
		}

		vm.editCodemirror = {
			lineNumbers: true,
			lineWrapping : true,
			theme: 'mdn-like',
			mode: 'application/json',
		};

		vm.about = function(){
			$mdDialog.show(
				$mdDialog.alert()
				  .clickOutsideToClose(true)
				  .title('MQTT Web Client V. 1.0.0')
				  .textContent('Developed by Glauber | glauberdf.ti@gmail.com')
				  .ok('Close')
			  );
		}

		function saveMsgs(obj){
			$indexedDB.openStore('messages', function(store){
				store.upsert(obj).then(function(e){
					obj.id = e[0];
					$mdToast.show(
						$mdToast.simple()
							.textContent('Message saved')
							.position('top left').action('X').hideDelay(1000)
					);
				});
			});
		}

		function prompt(title){
			return window.prompt(title);
		}

		function init(){
			
			vm.refreshCodemirror = true;
			
			vm.saveMsg = function(type){
				vm[type].description = (vm[type].description) ? vm[type].description : prompt("Type a description:");
				vm[type].type = (type === 'pub')? "publish" : "subscribe";
				saveMsgs(vm[type]);
			};

			vm.clearMsg = function(type){
				delete vm[type].id;
				vm[type] = {description: null, msg:{}};
			}

			vm.loadMsg = function(ev, type) {
				$mdDialog.show({
				  controller: ModalMessagesCtrl,
				  templateUrl: 'templates/home.messages-modal.tpl.html',
				  parent: angular.element(document.body),
				  targetEvent: ev,
				  clickOutsideToClose:true,
				  locals: { type: type }
				})
				.then(function(msg) {
					vm[type] = msg;
				}, function() {});
			};

			function ModalMessagesCtrl($scope, $mdDialog, type) {
				
				$scope.tabSelected = (type === "sub") ? 1 : 0;

				getMessages();

				function getMessages(){
					$indexedDB.openStore('messages', function(store){
						store.getAll().then(function(msgs) {
							$scope.messages = msgs;
						});
					});
				}

				$scope.cancel = function() {
				  $mdDialog.cancel();
				};

				$scope.remove = function(msg){
					$indexedDB.openStore('messages', function(store){
						store.delete(msg.id).then(function(){
							getMessages();
						  	alert("Message deleted");
						});
					});
				}
			
				$scope.select = function(msg) {
				  $mdDialog.hide(msg);
				};
			}

			vm.publish = function(){


				if(vm.pub.msg.advanced) {
					try {
						var msg = services.avroHelper.encode(JSON.parse(vm.pub.msg.schema), JSON.parse(vm.pub.msg.json));
					} catch(err) {
						showAlert('Error creating message. SCHEMA and JSON does not match.');
						return;
					}
				} else {
					try {
						var msg = JSON.stringify(JSON.parse(vm.pub.msg.json));
					} catch(err) {
						showAlert('You must provide a valid JSON'); 
						return;
					}
				}

				function showAlert(error){
					$mdToast.show(
						$mdToast.simple()
							.textContent(error)
							.position('top left').action('X').hideDelay(3000)
					);
				}

				client.publish(vm.pub.msg.topic, msg);
				console.log('%cpublish: '+ vm.pub.msg.topic, 'color: #22d; display: block;');
			}
	
			vm.subscribe = function(){

				var color = services.helpers.ramdomColor();
				var sub = {topic:vm.sub.msg.topic, color:color, msgs:0}

				if(vm.sub.msg.advanced) sub.schema = JSON.parse(vm.sub.msg.schema);
				vm.subs.push(sub);

				client.subscribe(vm.sub.msg.topic);
				console.log('%csubscribe: '+ vm.sub.msg.topic, 'color: #f63; display: block;');
				vm.sub = {};
			}

			vm.subscribePause = function(index){
				client.unsubscribe(vm.subs[index].topic);
				vm.subs[index].pause = true;
			}

			vm.subscribeStart = function(index){
				client.subscribe(vm.subs[index].topic);
				vm.subs[index].pause = false;
			}

			vm.unsubscribe = function(index){
				
				client.unsubscribe(vm.subs[index].topic);
				services.helpers.arrColors.push(vm.subs[index].color);
				console.log('%cunsubscribe: '+ vm.subs[index].topic, 'color: #f33; display: block;');

				vm.subs.splice(index, 1);
			}

			vm.clearMessages = function(index){
				vm.subs[index].msgs = 0;
				angular.element(document.querySelector("#sub_"+index+" .msgs")).html("");
			};

			vm.cumulate = function(index){
				vm.subs[index].cumulate = !vm.subs[index].cumulate;
			}


		}

	}

})();
