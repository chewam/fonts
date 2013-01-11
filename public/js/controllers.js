function LetterListCtrl($scope) {
    $scope.letters = letters;

    $scope.onNewClick = function() {
        console.log('onNewClick', arguments);
        createLetter();
    };

    $scope.onCloseClick = function(letter) {
        closeLetter(letter);
    };

    $scope.getCloseButtonCls = function(letter) {
    //  var cls = 'disabled';

    //  if (letter.shape && letter.shape.points.length > 2) {
    //      cls = '';
    //  }
    //  return cls;
        return '';
    }

}
