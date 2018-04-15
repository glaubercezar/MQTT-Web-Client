(function() {

	angular
    	.module('app.services')
		.factory('helpers', helpers);

		function helpers(){

			var factory = {};

			factory.arrColors = ['#555','#bbb','#4b56de','#d0c43e','#d84b4b','#598ca5','#78b77d','#71315a','#ef8a34'];

			factory.ramdomColor = function() {

				var sort = Math.floor(Math.random() * factory.arrColors.length);
				var color = factory.arrColors[sort];
				factory.arrColors.splice(sort, 1);
				
				return color;
			};

			return factory;
		
		}

})();