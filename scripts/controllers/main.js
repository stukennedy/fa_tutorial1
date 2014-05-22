angular.module('integrationApp')
.controller('MainCtrl',function ($scope, $famous) {
    $scope.number = 6;
    $scope.offset = 200;
    $scope.text = "TEXT";
    $scope.boxes = [];

    $scope.$watch('number', function (num) {
        var arr = [];
        for (var i = 0; i < $scope.number; i++) {
            arr.push({bg_color: '#333', color: '#ccc'});
        }
        $scope.boxes = arr;
    });

    $scope.click = function (index) {
        $famous.find('#shake-animation-' + index)[0].replay();
    };
});