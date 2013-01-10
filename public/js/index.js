var paper,
    rect,
    id = "paper",
    width = 320,
    height = 200,
    points = [],
    discattr = {fill: "#fff", stroke: "none"};

var linkPoints = function() {
    var l = points.length;

    if (l > 1) {
        var p1 = points[l - 2],
            p2 = points[l - 1];

        console.log("p1", p1.attrs.cx, p1.attrs.cy);
        console.log("p2", p2.attrs.cx, p2.attrs.cy);

        curve(
            p1, p2,
            "hsb(0, .75, .75)"
        );
    }
};

var onUp = function() {
    this.dx = this.dy = 0;
};

var onMove = function(x, y) {
    this.update(x - (this.dx || 0), y - (this.dy || 0));
    this.dx = x;
    this.dy = y;
};

var createPoint = function(x, y) {
    var circle = paper.circle(x, y, 5);
    circle.attr(discattr);
    points.push(circle);
    linkPoints();
};

var onRectClick = function(e) {
    console.log("click", arguments);
    createPoint(e.offsetX, e.offsetY);
};

window.onload = function() {
    paper = Raphael(id, width, height);
    rect = paper.rect(0, 0, width, height);
    rect.attr("fill", "#000");
    rect.click(onRectClick);
};

// var curve = function(x, y, ax, ay, bx, by, zx, zy, color) {
var curve = function(p1, p2, color) {
    var x = p1.attrs.cx,
        y = p1.attrs.cy,
        ax = p1.attrs.cx + 40,
        ay = p1.attrs.cy,
        bx = p2.attrs.cx - 40,
        by = p2.attrs.cy,
        zx = p2.attrs.cx,
        zy = p2.attrs.cy;

    var path = [["M", x, y], ["C", ax, ay, bx, by, zx, zy]],
        path2 = [["M", x, y], ["L", ax, ay], ["M", bx, by], ["L", zx, zy]],
        curve = paper.path(path).attr({stroke: color || Raphael.getColor(), "stroke-width": 4, "stroke-linecap": "round"}),
        controls = paper.set(
            paper.path(path2).attr({stroke: "#ccc", "stroke-dasharray": ". "}),
            // paper.circle(x, y, 5).attr(discattr),
            p1,
            paper.circle(ax, ay, 5).attr(discattr),
            paper.circle(bx, by, 5).attr(discattr),
            p2
            // paper.circle(zx, zy, 5).attr(discattr)
        );

    controls[1].update = function (x, y) {
        var X = this.attr("cx") + x,
            Y = this.attr("cy") + y;
        this.attr({cx: X, cy: Y});
        path[0][1] = X;
        path[0][2] = Y;
        path2[0][1] = X;
        path2[0][2] = Y;
        controls[2].update(x, y);
    };

    controls[2].update = function (x, y) {
        var X = this.attr("cx") + x,
            Y = this.attr("cy") + y;
        this.attr({cx: X, cy: Y});
        path[1][1] = X;
        path[1][2] = Y;
        path2[1][1] = X;
        path2[1][2] = Y;
        curve.attr({path: path});
        controls[0].attr({path: path2});
    };

    controls[3].update = function (x, y) {
        var X = this.attr("cx") + x,
            Y = this.attr("cy") + y;
        this.attr({cx: X, cy: Y});
        path[1][3] = X;
        path[1][4] = Y;
        path2[2][1] = X;
        path2[2][2] = Y;
        curve.attr({path: path});
        controls[0].attr({path: path2});
    };

    controls[4].update = function (x, y) {
        var X = this.attr("cx") + x,
            Y = this.attr("cy") + y;
        this.attr({cx: X, cy: Y});
        path[1][5] = X;
        path[1][6] = Y;
        path2[3][1] = X;
        path2[3][2] = Y;
        controls[3].update(x, y);
    };

    controls.drag(onMove, onUp);
};
