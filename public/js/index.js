var letters = [];

var createLetter = function() {
    var l = letters.length;

    letters.push({
        title: 'Letter ' + (l + 1)
    });

    setTimeout(function() {
        letters[l].shape = new Shape(l + 1);
    }, 50);
};

var closeLetter = function(letter) {
    letter.shape.close();
};
