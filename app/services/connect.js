(function() {

	angular
    	.module('app.services')
		.factory('connect', connect);

		function connect($q){

			return {
				doConnect: doConnect
			};

			function doConnect(env){
								
				var protocol = (env.ssl) ? "wss" : "ws";
				
				var connectOptions = {
				    clientId        	: 'mqtt_tool_' + new Date().getTime(),
				    protocol        	: protocol,
				    host            	: env.host,
				    port            	: env.port,
				    path            	: '/mqtt',
				    protocolId      	: 'MQTT', // MQTT | MQIsdp
				    protocolVersion 	: 4, // 4 | 3
				    clean           	: true,
					reconnectPeriod 	: 2000,
					rejectUnauthorized  : false
				};
		        
		       return mqtt.connect( connectOptions );				

			}
		

		}

})();