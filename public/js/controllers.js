function LetterListCtrl($scope) {
    $scope.letters = letters;

    $scope.onNewClick = function() {
        createLetter($scope);
    };

    $scope.toggleClose = function(shape) {
        shape.toggleClose();
    };

    $scope.toggleColor = function(shape) {
        shape.toggleColor();
    };
}
