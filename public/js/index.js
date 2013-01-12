var letters = [];

var createLetter = function($scope) {
    var l = letters.length;

    letters.push(new Letter(l + 1, $scope));
    // $scope.apply();
};

// var closeLetter = function(letter) {
//     letter.shape.close();
// };
