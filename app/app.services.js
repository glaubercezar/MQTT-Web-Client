(function() {

	angular
    	.module('app.services', [])
		.factory('services', services);

		function services(connect, avroHelper, topic, helpers){
			return {
				connect: connect,
				avroHelper: avroHelper,
				topic: topic,
				helpers: helpers
			}
		}

})();