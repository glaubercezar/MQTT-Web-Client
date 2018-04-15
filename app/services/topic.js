(function() {

	angular
    	.module('app.services')
		.factory('topic', topic);

		function topic(){

			return {
				verify: verify
			};

			function verify(topic, wildcard){
								
				if (topic === wildcard || wildcard === '#') {
					return true;
				}
		
				var newTopic = "";
		
				var t = String(topic).split('/');
				var w = String(wildcard).split('/');
		
				var i = 0;
				for (var lt = t.length; i < lt; i++) {

					if (w[i] === t[i] || w[i] === '+') {
						newTopic += t[i]+"/";
					} else if (w[i] === '#') {
						newTopic += t.slice(i).join('/');
						return true;
					} else if (w[i] !== t[i]) {
						return null;
					}
				}
				newTopic = newTopic.slice(0, -1);
				//console.log(topic, newTopic);
				return (topic === newTopic) ? true : false;
			}
		

		}

})();