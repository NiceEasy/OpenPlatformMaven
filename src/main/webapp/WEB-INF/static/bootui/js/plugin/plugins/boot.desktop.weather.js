/**
 * @author dragon
 */
boot.deskPlugins = boot.deskPlugins || {};

boot.deskPlugins.Weather = function(url) {
    this._uuid = boot.newId();
    this.showTitle = false, this.title = '天气预报', this.height = 95, this.selector = '#' + this._uuid + '\\$body';
    this.url = url || "http://tianqi.2345.com/plugin/widget/index.htm?s=2&z=1&t=0&v=0&d=1&bd=0&k=&f=ffffff&q=1&e=1&a=1&c=54511&w=185&h=10&align=center";
};

boot.deskPlugins.Weather.prototype = {
    execute : function(desk) {
    },
    registerData : function() {
        
    },
};
