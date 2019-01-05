(function(angular) {
  'use strict';
angular.module('httpExample', [])
  .controller('FetchController', ['$scope', '$http', '$templateCache',
    function($scope, $http, $templateCache) {
      $scope.method = 'POST';
      $scope.url = 'http-hello.html';

      $scope.send = function(param1,param2) {
        $scope.code = null;
        $scope.response = null;
		var path;
		if(param1 == 'reset'){path = HostName+'/RTU/'+param1}
		else{path = HostName+'/RTU/'+param1+'/services/'+param2}
		$http.post(path, {destUrl:HostName+"/fmw"}).
			  then(function(response) {
			  }, function(response) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			  });
      };
      /* $scope.updateModel = function(method, url) {
        $scope.method = method;
        $scope.url = url;
      }; */
    }]);
})(window.angular);