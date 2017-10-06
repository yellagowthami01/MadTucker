(function(){
angular.module("game").controller("betController", betController);

function betController($scope, $uibModalInstance, items){
var isBetPlaced;

$scope.params = items;

$scope.ok = function () {
		isBetPlaced = false;
		totalBettingAmount = 0;
	  angular.forEach($scope.params.trucks, function(truck){
	  	if(parseInt(truck.value))isBetPlaced = true;
	  	totalBettingAmount = parseInt(truck.value) + totalBettingAmount;
	  });
	  if(!isBetPlaced){
	  	$scope.errorMsg = "Please place a bet on atleast one truck";
	  	return;
	  }
	  if(totalBettingAmount > items.gameParams.balanceAmount){
	  	$scope.errorMsg = "Your bet amount "+ totalBettingAmount +" exceeds your balance amount "+items.gameParams.balanceAmount;
	  	return;
	  }
	  $uibModalInstance.close($scope.params);
    
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
	
}



})();