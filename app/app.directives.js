(function() {

	angular
		.module('app.directives', [])
		.directive('btnConnOptions', btnConnOptions)
		.directive('msgs', msgs)
		.directive('showAndHide', showAndHide)
		.directive('idColor', idColor);

	//change icon button from the connect options
	function btnConnOptions(){
		return {
			restrict: 'E',
			replace: true,
			template: '<md-icon ng-bind="showConnOptions"></md-icon>',
			link: function($scope, $elem, $attrs){

				$scope.showConnOptions = "keyboard_arrow_down";
				
				$elem.bind('click', function() {
					if($scope.showConnOptions == "keyboard_arrow_down"){
						$scope.showConnOptions = "keyboard_arrow_up";
					 } else {
						$scope.showConnOptions = "keyboard_arrow_down"
					 }
				});
			}
		}
	}

	function showItem(id, $timeout){

		angular.element(document.querySelectorAll( ".show-hide md-icon" )).text('expand_more');
		angular.element(document.querySelectorAll( '#messages .msgs' )).css({'display':'none'});
		$timeout(function(){
			angular.element(document.querySelector( "#sub_" +id+" .msgs" )).css({'display':'block'});
			angular.element(document.querySelector( "#sub_" +id+" .show-hide md-icon" )).text('expand_less');
		}, 100);
	}

	//control height in messages sidebar
	function msgs($timeout){
		return {
			restrict: 'A',
			link: function($scope, $elem, $attrs){
				
				var messages = angular.element(document.querySelector('#messages')); 
				var qtd = parseInt($attrs.msgs);
				console.log(messages[0].offsetHeight);
				var height = messages[0].offsetHeight - (qtd * 75);

				angular.element(document.querySelectorAll( '#messages .msgs' )).css({'height':height+"px"});
				
				showItem(qtd-1, $timeout);
			}
		}
	}

	//show and hide messages block
	function showAndHide($timeout){
		return {
			restrict: 'A',
			link: function($scope, $elem, $attrs){
				$elem.bind('click', function() {
					showItem($attrs.showAndHide, $timeout);
				});
			}
		}
	}

	//ID color
	function idColor(){
		return {
			restrict: 'E',
			replace: 'true',
			template: '<div style="width: 15px; height: 15px; display: inline-block; vertical-align: middle; background:{{ sub.color }}"></div>'
		}
	}

})();