// Define main properties and methods for "utils" class

var utils = new function() {
	var self = this;
	this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    this.toggle = function(button,status) {
        if ( status.attr("class").split(" ")[status.attr("class").split(" ").length-1] == "false" ) {
            var newClass = "true",
                newMargin = "20px";
        } else {
            var newClass = "false",
                newMargin = "0px";
        }
        button.animate({marginLeft:newMargin},100,function() {
            status.removeClass("false");
            status.removeClass("true");
            status.addClass(newClass);
        });
    };

    this.miniToggle = function(button,status) {
        if ( status.attr("class").split(" ")[status.attr("class").split(" ").length-1] == "false" ) {
            var newClass = "true",
                newMargin = "15px";
        } else {
            var newClass = "false",
                newMargin = "0px";
        }
        button.animate({marginLeft:newMargin},100,function() {
            status.removeClass("false");
            status.removeClass("true");
            status.addClass(newClass);
        });
    };

    this.getStatus = function(div) {
        var classes = div.attr("class").split(" ");
        for (var i=0; i<classes.length; i++) {
            if (classes[i].indexOf("true")+classes[i].indexOf("false")>-2) {return classes[i];};
        };
    };

    this.opposite = function(current) {
        var opt = ["true","false"],
            optBool = [true,false];
        return optBool[1-opt.indexOf(current)];
    };

    this.makeStatus = function(c,text,status,index) {
        return utils.templates.header
            .replace(/<!--class-->/g,c)
            .replace(/<!--text-->/g,text)+
        utils.templates.switch
            .replace(/<!--status-->/g,status)
            .replace(/<!--index-->/g,index)
    };

    this.templates = {
        "reader":"<div class='status <!--class-->'><div class='change' id='<!--username-->' onclick='makeup.removeCopy(\"<!--username-->\")'>-</div><p class='narrow'><!--name--></p><div class='switch'><div class='switchButton' id='<!--index-->'></div></div></div>",
        "select":"<option value='<!--username-->'><!--name--></option>",
        "header":"<h4 class='<!--class-->'><!--text--></h4>",
        "switch":"<div class='status <!--status-->'><div class='switch'><div class='switchButton' id='<!--index-->'></div></div></div>",
        "layouts":[".horizontal-header-first",".horizontal-header-last",".square-header-first",".square-header-last",".vertical-header-first",".vertical-header-last",".fiction"]
    };
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

