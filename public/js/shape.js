var Letter = function(id, $scope) {

    this.id = 'shape-' + id;
    this.width = '100%';
    this.height = 550;
    this.title = 'Letter ' + id;
    this.shape = null;
    this.shapes = [];
    this.borderColor = '#aaa';
    this.backgroundColor = '#efefef';

    this.onRectClick = function(e) {
        var shape,
            l = this.shapes.length;

        if (l) {
            shape = this.shapes[l - 1];
            if (shape.closed) {
                this.createShape();
                this.onRectClick(e);
            } else {
                shape.createPoint(e.offsetX, e.offsetY);
                shape.updatePath();
                if (!shape.eventBound) {
                    shape.eventBound = true;
                    shape.path.click(this.onRectClick.bind(this));
                }
            }
        }
    };

    this.createShape = function() {

        var shape = new Shape({
            paper: this.paper,
            $scope: $scope,
            backgroundColor: this.backgroundColor
        });

        this.shapes.push(shape);
        $scope.$apply();
    };

    setTimeout((function() {
        this.paper = Raphael(this.id, this.width, this.height);
        this.rect = this.paper.rect(0, 0, this.width, this.height);
        this.rect.attr('fill', this.backgroundColor);
        this.rect.attr('stroke', this.borderColor);
        this.rect.click(this.onRectClick.bind(this));
        this.createShape();
    }).bind(this), 50);
};

var Shape = function(config) {

    var self = this,
        $scope = config.$scope;

    this.path = null;
    this.points = [];
    this.closed = false;
    this.colored = false;
    this.paper = config.paper;
    this.backgroundColor = config.backgroundColor;

    // this.close = function() {
    //     this.closed = true;
    //     this.updatePath()
    //     // var p1, p2, l = this.points.length;

    //     // if (l > 2) {
    //     //     this.closed = true;
    //     //     p1 = this.points[l - 1];

    //     //     p2 = this.points[0];
    //     //     this.curve(p1, p2, '#000');
    //     //     p1.toFront();
    //     //     p2.toFront();
    //     // }
    // };

    this.toggleColor = function() {
        this.colored = !this.colored;
        this.updateColor();
    };

    this.toggleClose = function() {
        this.closed = !this.closed;
        this.updatePath();
    };

    // this.linkPoints = function() {
    //     var p1, p2, l = this.points.length;

    //     if (l > 1) {
    //         p1 = this.points[l - 2];
    //         p2 = this.points[l - 1];
    //         this.curve(p1, p2, '#000');
    //         p1.toFront();
    //         p2.toFront();
    //     }
    // };

    this.onPointClick = function(e) {
        // var p1 = e.target,
        //     p2 = this.points[0][0],
        //     l = this.points.length;

        // console.log('onPointClick', p1.raphaelid, p2.raphaelid);
        // if (p1 && p2 && p1.raphaelid === p2.raphaelid) {
        //     this.close();
        // }
    };

    this.onPointUp = function() {
        this.dx = this.dy = 0;
        console.log('onPointUp', arguments);
    };

    // this.onPointDown = function() {
    //     console.log('onPointDown', arguments);
    //     // this.updatePath();
    // };

    this.onPointMove = function(x, y) {
        var X, Y;

        X = x - (this.dx || 0);
        Y = y - (this.dy || 0);

        X = this.attr('cx') + X;
        Y = this.attr('cy') + Y;
        this.attr({cx: X, cy: Y});

        this.dx = x;
        this.dy = y;
        console.log('onPointMove', X, Y, this.attr('cx'), this.attr('cy'));
        self.updatePath();
    };

    this.createPoint = function(x, y) {
        var point = this.paper.circle(x, y, 5);

        point.attr({fill: '#fff', stroke: 'hsb(0, .75, .75)'});
        point.click(this.onPointClick.bind(this));
        point.drag(this.onPointMove, this.onPointUp/*, this.onPointDown.bind(this)*/);
        this.points.push(point);
        $scope.$apply();
    };

    this.updateColor = function() {
        var color = '#efefef';
        
        if (this.colored) {
            color = '#000';
        }

        this.path.attr({fill: color});
    };

    // this.onPathClick = function(e) {
    //     var shape,
    //         l = this.shapes.length;

    //     if (l) {
    //         shape = this.shapes[l - 1];
    //         if (shape.closed) {
    //             this.createShape();
    //             this.onRectClick(e);
    //         } else {
    //             shape.createPoint(e.offsetX, e.offsetY);
    //             shape.updatePath();
    //         }
    //     }
    // };
    // }

    this.updatePath = function() {
        var path = '',
            l = this.points.length;

        for (var i = 0; i < l; i++) {
            console.log('point', this.points[i]);
            this.points[i].toFront();
            if (!i) {
                path += 'M ' + this.points[i].attrs.cx + ',' + this.points[i].attrs.cy;
            } else {
                path += ' L ' + this.points[i].attrs.cx + ',' + this.points[i].attrs.cy;
            }
        }

        if (l && this.closed) {
            path += ' L ' + this.points[0].attrs.cx + ',' + this.points[0].attrs.cy;
        }

        if (this.path) {
            this.path.attr({
                path: path,
                fill: this.colored ? '#000' : this.backgroundColor
            });
        } else {
            this.path = this.paper.path(path).attr({
                fill: this.colored ? '#000' : this.backgroundColor,
                stroke: Raphael.getColor(),
                'stroke-width': 4,
                'stroke-linecap': 'round'
            });
            // this.path.drag(this.onPathMove, this.onPathUp);
            // this.path.click(this.onPathClick.bind(this));
        }

        $scope.$apply();

        console.log('path', path, this.path);
    };

    // this.onPathUp = function() {
    //     this.dx = this.dy = 0;
    // };

    // this.onPathMove = function(x, y) {
    //     var X, Y;

    //     X = x - (this.dx || 0);
    //     Y = y - (this.dy || 0);

    //     X = this.attr('cx') + X;
    //     Y = this.attr('cy') + Y;
    //     this.attr({cx: X, cy: Y});

    //     this.dx = x;
    //     this.dy = y;
    // };

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

};
