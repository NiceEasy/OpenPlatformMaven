/**
 * @author 田鑫龙
 */
//表单类
boot.DataForm = function(id){
  boot.DataForm.superClass.constructor.call(this, id);  
  this.currentAction = null;
  this._getFields();
  if(this.results){
      this._setData(this.results);
  }
};

boot.extend(boot.DataForm, boot.Rooter, {
    uiCls: "boot-dataform",
    type: "form",
    _initField: function(){
        this.validateValue = true;
        this.idField = this.idField || "id";
        this.parameters = this.parameters || {};
        this.prefix = this.prefix || "entityBean";
        this.queryMethod  = this.queryMethod || "queryDetail.action";
        this.createMethod = this.createMethod || "create.action";
        this.saveMethod = this.saveMethod || "save.action";
        this.updateMethod = this.updateMethod || "update.action";
    },
    _create: function(){
        this.el.attr("id", this.id);
    },
    _getFields: function(){
        boot.parseByParent(this.el);
        boot.findChildComponents.call(this);
    },
    _validate: function(){
        var rs = boot.relationship[this._uuid];
        for(var i=0,len=rs.length;i<len;i++){
            var ctl = rs[i];
            if(ctl && ctl.type == 'button' || ctl.type == 'datagrid'){
                continue;
            }
            if(ctl && ctl._validate){
                this.validateValue = this.validateValue && ctl._validate();
            }
        }
        return this.validateValue;
    },
    _getData: function(addPrefix){
        var result = {};
        var rs = boot.relationship[this._uuid];
        for(var i=0,len=rs.length;i<len;i++){
            var ctl = rs[i];
            if(ctl && ctl.type == 'button' || ctl.type == 'datagrid'){
                continue;
            }
            if(ctl && ctl.getValue){
            	result[ctl.name] = ctl.getValue();
            }
            if(ctl && ctl._validate){
                var v = ctl._validate();
                this.validateValue = this.validateValue && v;
            }
        }
        if(addPrefix){
            result = boot.addPrefix(result, this.prefix);
        }
        return result;
    },
    _setData: function(data){
        var rs = boot.relationship[this._uuid];
        for(var i=0,len=rs.length;i<len;i++){
            var ctl = rs[i];
            if(ctl._setValue){
                var value = data[ctl.name];
                if(value !== undefined){
                    ctl._setValue(value);
                }
            }
            if(ctl._setText){
                var text = data[ctl.textField];
                if(text !== undefined){
                    ctl._setText(text);
                }
            }
        }
    },
    _queryMethod: function(options){
        this.currentAction = "query";
        this._load(options);
    },
    _createMethod: function(options){
        this.currentAction = "create";
        this._load(options);
    },
    _saveMethod: function(options){
        this.currentAction = "save";
        this._load(options);
    },
    _submit: function(){
        this._load({
            data: this._getData()
        });
    },
    _load: function(url){
        var options = {
            url: (this.action ? (this.action + '_' + this[this.currentAction + 'Method']) : this.url),
            success: this._loadSuccess,
            context: this
        };
        //提交前获取数据
        if(this.currentAction == "save" || this.currentAction == "update"){
            var bind = boot.getBinding(this.id, this.binding);
            if(bind){
                options.data = bind._getSubmitData();
            }else{
                this._validate();
            }
        }
        //验证
        if(!this.validateValue){
            boot.showTip('数据验证失败!');
            return false;
        }
        if(jQuery.type(url) === "string"){
            options.url = url;
        }else{
            url = url || {};
            url.data = boot.addPrefix(url.data || {}, this.prefix);
            boot.concat(options, url);
        }
        options.url = options.url || this.url;
        
        if(options.url)
            boot.ajax(options);
    },
    _loadSuccess: function(result){
        if(result.success){
            this._setData(result.resultData);
            if(this.currentAction == 'query'){
                if(this.binding){
                    var bind = boot.getBinding(this.id, this.binding);
                    if(bind){
                        bind._load({parentId: result.resultData[this.idField]});
                    }
                }
            }
            this._fire('onloadsuccess', {result: result, sender: this});
        }
        if(this.currentAction == "save" || this.currentAction == "update"){
            alert(result.message);
            window.closeWindow();
        }
        if(this.currentAction == "save" || this.currentAction == "query"){
            this.currentAction = "update";
        }
        if(this.currentAction == "create"){
            this.currentAction = "save";
        }
    },
    _setPrefix: function(prefix){
        this.prefix = prefix;
    },
    _setParameters: function(data, prefix){
        this.parameters = boot.addPrefix(data, prefix || this.prefix);
    },
    _getAttrs: function(attributes){
        var attrs = boot.concat({
            str: ["id", "prefix", "action", "queryMethod", "updateMethod",
            "createMethod", "saveMethod", "viewPage", "editPage", "binding", "idField"],
            bool: [],
            json: ["parameters", "results"],
            fn: []
        }, attributes || {});
        return boot.DataForm.superClass._getAttrs.call(this, attrs);
    },
    
    
    //API
    setPrefix: function(prefix){
        this._setPrefix(prefix);
    },
    getData: function(){
        return this._getData();
    },
    setData: function(data){
        this._setData(data);
    },
    query: function(options){
        this._queryMethod(options);
    },
    create: function(options){
        this._createMethod(options);
    },
    save: function(options){
        this._saveMethod(options);
    },
    setParameters: function(data, prefix){
        this._setParameters(data, prefix);
    },
    submit: function(){
        this._submit();
    }
});

boot.Register(boot.DataForm, "dataform");