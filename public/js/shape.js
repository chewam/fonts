var Shape = function(id) {

    this.id = 'shape-' + id;
    this.width = 640;
    this.height = 480;
    this.points = [];

    this.close = function() {
        var p1, p2, l = this.points.length;

        if (l > 2) {
            p1 = this.points[l - 1];
            p2 = this.points[0];
            this.curve(p1, p2, '#000');
            p1.toFront();
            p2.toFront();
        }
    };

    this.linkPoints = function() {
        var p1, p2, l = this.points.length;

        if (l > 1) {
            p1 = this.points[l - 2];
            p2 = this.points[l - 1];
            this.curve(p1, p2, '#000');
            p1.toFront();
            p2.toFront();
        }
    };

    this.createPoint = function(x, y) {
        var circle = this.paper.circle(x, y, 5);

        circle.attr({fill: '#fff', stroke: 'hsb(0, .75, .75)'});
        this.points.push(circle);
        this.linkPoints();
    };

    this.onRectClick = function(e) {
        this.createPoint(e.offsetX, e.offsetY);
    };

    this.onUp = function() {
        this.dx = this.dy = 0;
    };

    this.onMove = function(x, y) {
        this.update(x - (this.dx || 0), y - (this.dy || 0));
        if (this.update2) {
            this.update2(x - (this.dx || 0), y - (this.dy || 0));
        }
        this.dx = x;
        this.dy = y;
    };

    this.curve = function(p1, p2, color) {
        var x = p1.attrs.cx,
            y = p1.attrs.cy,
            ax = p1.attrs.cx + 40,
            ay = p1.attrs.cy,
            bx = p2.attrs.cx - 40,
            by = p2.attrs.cy,
            zx = p2.attrs.cx,
            zy = p2.attrs.cy;

        var path = [['M', x, y], ['C', ax, ay, bx, by, zx, zy]],
            path2 = [['M', x, y], ['L', ax, ay], ['M', bx, by], ['L', zx, zy]],
            curve = this.paper.path(path).attr({stroke: color || Raphael.getColor(), 'stroke-width': 4, 'stroke-linecap': 'round'}),
            controls = this.paper.set(
                this.paper.path(path2).attr({stroke: '#000', 'stroke-dasharray': '. '}),
                p1,
                this.paper.circle(ax, ay, 5).attr({fill: '#fff', stroke: '#000'}),
                this.paper.circle(bx, by, 5).attr({fill: '#fff', stroke: '#000'}),
                p2
            );


        var p1Update = function (x, y) {
            var X = this.attr('cx') + x,
                Y = this.attr('cy') + y;
            this.attr({cx: X, cy: Y});
            path[0][1] = X;
            path[0][2] = Y;
            path2[0][1] = X;
            path2[0][2] = Y;
            controls[2].update(x, y);
        };

        if (!controls[1].update) {
            controls[1].update = p1Update;
        } else {
            controls[1].update2 = p1Update;
        }

        // controls[1].update = function (x, y) {
        //     var X = this.attr('cx') + x,
        //         Y = this.attr('cy') + y;
        //     this.attr({cx: X, cy: Y});
        //     path[0][1] = X;
        //     path[0][2] = Y;
        //     path2[0][1] = X;
        //     path2[0][2] = Y;
        //     controls[2].update(x, y);
        // };

        controls[2].update = function (x, y) {
            var X = this.attr('cx') + x,
                Y = this.attr('cy') + y;
            this.attr({cx: X, cy: Y});
            path[1][1] = X;
            path[1][2] = Y;
            path2[1][1] = X;
            path2[1][2] = Y;
            curve.attr({path: path});
            controls[0].attr({path: path2});
        };

        controls[3].update = function (x, y) {
            var X = this.attr('cx') + x,
                Y = this.attr('cy') + y;
            this.attr({cx: X, cy: Y});
            path[1][3] = X;
            path[1][4] = Y;
            path2[2][1] = X;
            path2[2][2] = Y;
            curve.attr({path: path});
            controls[0].attr({path: path2});
        };

        var p2Update = function (x, y) {
            var X = this.attr('cx') + x,
                Y = this.attr('cy') + y;
            this.attr({cx: X, cy: Y});
            path[1][5] = X;
            path[1][6] = Y;
            path2[3][1] = X;
            path2[3][2] = Y;
            controls[3].update(x, y);
        };

        if (!controls[4].update) {
            controls[4].update = p2Update;
        } else {
            controls[4].update2 = p2Update;
        }

        controls.drag(this.onMove, this.onUp);
    };

    this.paper = Raphael(this.id, this.width, this.height);
    this.rect = this.paper.rect(0, 0, this.width, this.height);
    this.rect.attr('fill', '#efefef');
    this.rect.attr('stroke', '#aaa');
    this.rect.click(this.onRectClick.bind(this));

};
