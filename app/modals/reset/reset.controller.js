(function(){


angular.module("game").controller("resetController", resetController);

function resetController($scope,$uibModalInstance, items){


	$scope.params = items;
	$scope.truckersArray = [];
	for(var i = 1; i < items.truckersCount; i++){
		$scope.truckersArray.push(i+1);
	}

$scope.ok = function () {
    $uibModalInstance.close($scope.params);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

}



})();