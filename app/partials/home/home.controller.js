(function() {

    angular.module("game").controller("HomeController", HomeController);


    function HomeController($scope, $interval, $uibModal) {
        var racing, raceBet, modalInstance, truckColors, trucks, winnerTruckId, leftPosition;
        initializeGame();

        function initializeGame() {
            $scope.betIsPlaced = false;
            $scope.raceInProgress = false;
            $scope.announceWinner = false;
            $scope.trucks = [];
            $scope.gameParams = {
                playerName: "",
                truckersCount: "",
                initalBet: 1000,
                balanceAmount: 1000
            };
            initializeTrucks();

        }


        function initializeTrucks() {
            truckColors = ['green', 'red', 'blue', 'purple', 'pink', 'orange', 'dark', 'cyan'];
            trucks = [];
            angular.forEach(truckColors, function(color) {
                trucks.push({
                    id: color,
                    style: {
                        "margin-left": "0%",
                        "color": color
                    },
                    value: 0
                })
            })
            $scope.trucks = trucks;

        }




        $scope.bet = function() {
            resetTruckPosition();
            bet();
        }

        function resetTruckPosition() {
            angular.forEach($scope.trucks, function(truck) {
                truck.style['margin-left'] = 0;
            })
        }

        function bet() {
            modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/modals/bet/bet.tpl.html',
                controller: 'betController',
                size: "md",
                resolve: {
                    items: function() {
                        return {
                            trucks: angular.copy(trucks),
                            truckersCount: $scope.trucks.length,
                            gameParams: $scope.gameParams
                        }
                    }
                }

            });

            modalInstance.result.then(function(bettedTruckers) {
                $scope.betIsPlaced = true;
                raceBet = bettedTruckers;
            }, function() {
                console.log("modal dismissed on place bet");
            });
        };

        $scope.reset = function() {
            initializeTrucks();
            reset();
        }

        function reset() {
            modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/modals/reset/reset.tpl.html',
                controller: 'resetController',
                size: "md",
                resolve: {
                    items: function() {
                        return {
                            playerName: $scope.gameParams.playerName,
                            truckersCount: trucks.length,
                            initalBet: $scope.gameParams.initalBet
                        }
                    }
                }
            });

            modalInstance.result.then(function(params) {
                onResetSuccess(params)
            }, function() {
                console.log("modal dismissed on reset");
            });
        };

        function onResetSuccess(params) {
            $scope.gameParams.playerName = params.playerName;
            $scope.trucks = angular.copy(trucks).splice(0, params.truckersCount);
        }

        $scope.start = function() {
            startRace();
        }

        function startRace() {

            if (!$scope.trucks) return;
            $scope.raceInProgress = true;
            racing = $interval(function() {
                angular.forEach($scope.trucks, function(truck) {
                    truck.style["margin-left"] = parseFloat(truck.style["margin-left"]) + getRandomNumber() + "%";
                    if (parseInt(truck.style["margin-left"]) >= 99) {
                        $interval.cancel(racing);
                        onRaceComplete();
                    }
                });
            }, 45);

        }

        function getRandomNumber() {
            //might use any calculation over here
            return Math.random();
        }


        function onRaceComplete() {
            $scope.raceInProgress = false;
            winnerTruckId = pickWinner();
            if (!winnerTruckId) alert("Unknown error. Please play the game again");
            angular.forEach(raceBet.trucks, function(truck) {
                if (truck.value && parseInt(truck.value) > 0) {
                    if (winnerTruckId == truck.id) {
                        $scope.announceWinner = true;
                        $scope.gameParams.balanceAmount = $scope.gameParams.balanceAmount + (parseInt(truck.value) * 2);
                    } else
                        $scope.gameParams.balanceAmount = $scope.gameParams.balanceAmount - parseInt(truck.value);
                }
            });
            if ($scope.gameParams.balanceAmount <= 0) {
                var confirmMessage = confirm("You have nil balance amount to bet. Game Over. Do you want to continue");
                if (confirmMessage)
                    initializeGame();
            }
            $scope.betIsPlaced = false;
        }


        function pickWinner() {
            winnerTruckId = '';
            leftPosition = 0;
            angular.forEach($scope.trucks, function(truck) {
                if (parseFloat(truck.style['margin-left']) > leftPosition) {
                    winnerTruckId = truck.id;
                    leftPosition = parseFloat(truck.style['margin-left']);
                }
            })
            return winnerTruckId;
        }

    }



})();