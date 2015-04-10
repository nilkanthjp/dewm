// Define main properties and methods for "viewer" class

var utils = new function() {
	var self = this;
	this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

Array.prototype.diff = function(a) {
	return this.filter(function(i) {return a.indexOf(i) < 0;});
}

