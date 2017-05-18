(function () {
	'use strict';

	angular.module('app.landing')
		.controller('LandingController', LandingController);

	LandingController.$inject = ['AuthService'];
	function LandingController(AuthService) {
		var vm = this;
		vm.currentUser = AuthService.currentUser;
		console.log(vm.currentUser);
	}
})();