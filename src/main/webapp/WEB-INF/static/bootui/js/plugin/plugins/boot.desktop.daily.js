/**
 * @author dragon
 */
boot.deskPlugins = boot.deskPlugins || {};

boot.deskPlugins.DailyOffice = function(url) {
    this._uuid = boot.newId();
    this.title = '日常办公', this.height = 126, this.noFrame = true, this.selector = '#' + this._uuid + '\\$body';
    this.url = url;
};

boot.deskPlugins.DailyOffice.prototype = {
    execute : function(desk) {
        this.desk = desk;
        this.load();
        this.bindEvents(this);
    },
    load : function() {
        if (this.url) {
            boot.ajax({
                url : this.url,
                context : this,
                success : this.success
            });
        }
    },
    registerData : function() {
        boot.get(this.desk)._registerPluginDatas(this._uuid, this.data.data.datamap);
    },
    success : function(result) {
        this.data = result.resultData || [];
        this.registerData();
        this.render();
    },
    getViewEl : function() {
        this.viewEl = this.viewEl || jQuery(this.selector);
        return this.viewEl;
    },
    render : function() {
         var html = '<ul>';
         var data = this.data.data.datamap;
         for (var i = 0, len = data.length; i < len; i++) {
             var cell = data[i];
             html += '<li class="daily-item"><div id="' + cell._uuid + '" class="daily-context">' + cell.processName + '</div></li>';
             cell.url = this.data.OADomain+"/platform/bpm/task/toStart.ht?ticket="+this.data.OATicket+"&taskId=" + cell.id;
         }
         html += '</ul>';
         this.getViewEl().html(html);
    },
    bindEvents : function(sender) {
         this.getViewEl().delegate('.daily-context', 'click', function(e) {
             e.sender = sender;
             sender.onTaskClick.call(sender, e);
         });
    },
    onTaskClick : function(e) {
    	console.log(e)
         var desktop = boot.get(this.desk);
         var plugin = desktop._getPluginByUUID(e.target.id);
         desktop.showWindow(plugin);
    }
};
