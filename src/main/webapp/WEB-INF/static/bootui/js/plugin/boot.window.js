/**
 * @author 田鑫龙
 */
boot.Window = function(id) {
    this.fullScreen = false;
    this.showModal = true;
    boot.Window.superClass.constructor.call(this, id);
    this._loadPage();
};

boot.extend(boot.Window, boot.Panel, {
    uiCls : "boot-window",
    type : "window",
    _initField : function() {
        this.width = this.width || 600;
        this.height = this.height || 500;
    },
    _init : function(el) {
        if (el) {
            if (jQuery.type(el) === 'string') {
                this.id = el;
                this.el = jQuery('#' + this.id);
            } else if ( el instanceof jQuery) {
                this.el = el;
                this.id = el[0].id;
            } else {
                el["dragable"] = true;
                boot.concat(this, el);
                var win = jQuery('<div class="boot-panel" style="z-index: 100;position: fixed;"></div>');
                var showModal = this.showModal ? '' : 'display: none;';
                var shadow = jQuery('<div class="boot-shadow" style="position: fixed;top: 0;left: 0;z-index: 99;' + showModal + '"></div>');
                jQuery(document.body).append(win).append(shadow);
                this.el = win;
                this.shadowEl = shadow;
            }
            this.box = this._getBox();
        } else {
            alert("new boot.Window时缺少参数!");
        }
    },
    _loadPage : function() {
        this._updateLayout();
        if (this.fullScreen) {
            this._bindResize();
        }
        if (this.url) {
            this.bodyEl.css("overflow", "hidden");
            this.iframe = jQuery("<iframe src=\"" + this.url + "\" style=\"width: 100%;height: 100%;border: none;margin: 0;padding: 0;\"></iframe>");
            this._setView(this.iframe);
            this._doOnload();
        }
    },
    _bindResize : function() {
        var me = this;
        jQuery(window).resize(function() {
            me._updateLayout(jQuery(this));
        });
    },
    _updateLayout : function(win) {
        win = win || jQuery(window);
        var width = win.width(), height = win.height();

        if (this.fullScreen) {
            // this._setWidth(width);
            // this._setHeight(height);
            this.offset = {
                top : 0,
                left : 0,
                width : '100%',
                height : '100%'
            };
        } else {
            this.offset = this.offset || {
                left : (width - (this.width || this.el.width())) / 2,
                top : (height - (this.height || this.el.height())) / 2
            };
        }
        this.el.css(this.offset);
    },
    _doOnload : function() {
        var me = this;
        if (this.onload) {
            this.iframe.on('load', function(e) {
                if (this.contentWindow) {
                    this.contentWindow.closeWindow = (function(sender) {
                        return function() {
                            if (!(this.allowAutoClose === false)) {
                                sender.destroy();
                                sender = null;
                            }
                        };
                    })(me);
                    this.contentWindow.hideWindow = (function(sender) {
                        return function() {
                            sender.hide();
                        };
                    })(me);
                    me.onload.call(this.contentWindow, {
                        parent : window,
                        sender : me
                    });
                    me._fire('onload', e);
                }
            });
        }
    },
    //销毁时调用
    _doOndestroy : function() {
        if (this.ondestroy) {
            var innerFrame = this.iframe[0];
            if (innerFrame) {
                var win = innerFrame.contentWindow;
                this.ondestroy.call(win, {
                    parent : window,
                    sender : this
                });
            } else {
                this.ondestroy.call(window, {
                    parent : window,
                    sender : this
                });
            }
        }
    },
    _setMaxWindow : function() {
        this.el.css({
            width : '100%',
            height : '100%'
        });
    },
    _bindEvent : function() {
        this._bind('maxclick', this._onMaxClick, this);
    },
    _onMaxClick : function(e) {
        this.__position = this.__position || this.el.offset();
        boot.concat(this.offset, this.__position);
        boot.concat(this.offset, {
            width : this.width,
            height : this.height
        });
        this.fullScreen = !this.fullScreen;
        this._updateLayout();
    },
    //事件
    _onCloseClick : function(e) {
        e.stopPropagation();
        this._fire('oncloseclick', e);
        this._destory(e);
    },
    _destory : function(e) {
        this.el.hide();
        this._doOndestroy();
        this.iframe.attr("src", "about:blank");
        this.el.remove();
        this.shadowEl.remove();
        this._fire('ondestory', e);
    },

    //API
    destroy : function() {
        this._destory();
    },
    show : function() {
        this.el.show();
    },
    hide : function() {
        this.el.hide();
    }
});

boot.Register(boot.Window, "window");
