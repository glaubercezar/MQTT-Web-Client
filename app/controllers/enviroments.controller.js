(function() {

	angular
		.module('app.controllers')
		.controller("EnviromentsController", EnviromentsController);


	function EnviromentsController($scope, $mdDialog) {

		var vm = this;

		vm.env = {};

		//list enviroments
		vm.enviroments = JSON.parse(localStorage.getItem("enviroments")) || {};

		//save enviroment
		vm.saveEnviroment = function(){
			
			if(!vm.enviroments[vm.env.name])
			vm.enviroments[vm.env.name] = {};

			vm.enviroments[vm.env.name].host = vm.env.host || "";
			vm.enviroments[vm.env.name].port = vm.env.port || "";
			vm.enviroments[vm.env.name].ssl = vm.env.ssl || false;

			localStorage.setItem("enviroments", JSON.stringify(vm.enviroments));
		};

		//remove enviroment
		function removeEnviroment(name){

			delete vm.enviroments[name];
			localStorage.setItem("enviroments", JSON.stringify(vm.enviroments));
		}

		vm.showConfirm = function(name) {

			var confirm = $mdDialog.confirm()
				.title('Quer mesmo deletar o ambiente "'+ name+'"')
				.ok('SIM')
				.cancel('NÃO');
		
			$mdDialog.show(confirm).then(function() {
				removeEnviroment(name);
			}, function() {});

		};

		
	}

})();