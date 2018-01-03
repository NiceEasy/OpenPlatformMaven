/**
 * @author dragon
 */
/**
 * @author 田鑫龙
 */
//文本输入框
boot.Estimate = function(id) {
    this.old = true;
    this.autoLoad = true;
    this.validate = true;
    this.currentAction = 'query';
    boot.Estimate.superClass.constructor.call(this, id);
    this._renderTitle();
    this.autoLoad && this._load();
};

boot.extend(boot.Estimate, boot.Rooter, {
    uiCls : 'boot-estimate',
    type : "estimate",
    _initField : function() {
        boot.Estimate.superClass._initField.call(this);
        this.value = this.value || "";
        this.data = this.data || [];
        this.parentidField = this.parentidField || 'parentid';
        this.prefix = this.prefix || 'entityBean';
        this.columns = this.columns || [{
            'name' : '目前需求',
            'property' : 'content',
            'editor' : 'text',
            'static' : false
        }, {
            'name' : '现状',
            'property' : 'situation',
            'editor' : 'number',
            'static' : true,
            'width' : 100
        }, {
            'name' : '满意度',
            'property' : 'satisf',
            'editor' : 'number',
            'static' : true,
            'width' : 100
        }];
    },
    _create : function() {
        var body = jQuery('<div class="estimate-body"></div>');
        body.appendTo(this.el);

        var view = jQuery('<table cellpadding="0" cellspacing="0"></table>');
        view.appendTo(body);
        view.html('<th style="width: 40px;">序号</th><th style="width: 60px;"><a id="' + this._uuid + '$add" iconCls="add" href="javascript: void(0);" class="noText boot-button"></a></th>');

        this.viewEl = view;
        
        var foot = jQuery('<div class="estimate-foot"></div>');
        foot.appendTo(this.el);

        var html = '';
        html += '<div style="margin: 5px 0;">';
        html += '<div class="label">'+ this.columns[this.columns.length - 2]['name'] +'评分：</div>';
        html += '<div class="score" id="' + this.columns[this.columns.length - 2]['property'] + '_avg"></div>';
        html += '</div>';
        html += '<div style="margin: 5px 0;">';
        html += '<div class="label">作业活动表现变化：</div>';
        html += '<div class="score" id="' + this.columns[this.columns.length - 2]['property'] + '_fix"></div>';
        html += '</div></br>';
        html += '<div style="margin: 5px 0;">';
        html += '<div class="label">'+ this.columns[this.columns.length - 1]['name'] +'评分：</div>';
        html += '<div class="score" id="' + this.columns[this.columns.length - 1]['property'] + '_avg"></div>';
        html += '</div>';
        html += '<div style="margin: 5px 0;">';
        html += '<div class="label">满意度变化：</div>';
        html += '<div class="score" id="' + this.columns[this.columns.length - 1]['property'] + '_fix"></div>';
        html += '</div>';
        foot.html(html);
        boot.parseByParent(this.viewEl);
        
        this._events();
    },
    _load : function(parameters) {
    	parameters = parameters || {};
        if(this.currentAction == 'save'){
        	parameters = boot.addPrefix(parameters, 'detailBeans');
        	if(this.beforeSave){
        		var result = this.beforeSave.call(this, {"sender": this, "paramters": parameters});
        		if(jQuery.type(result) == 'object'){
        			parameters = boot.concat(parameters, boot.addPrefix(result, this.prefix));
        		}
        	}
        }else{
        	parameters = boot.addPrefix(parameters, this.prefix);
        }
        parameters[this.prefix + '.' + this.parentidField] = this.parent;
        
    	
        var url = this.url;
        if(this.action){
            url = this.action + '_' + this[this.currentAction + 'Method'];
        }
        if (url && this.validate) {
            boot.ajax({
                url : url,
                data : parameters,
                success : this._loadSuccess,
                context : this
            });
        }
    },
    _loadSuccess : function(result) {
        if (result.success) {
            this.data = result.resultData;
            this._renderer();
            this._update();
            if(this.currentAction == 'query'){
                this.currentAction = 'save';
            }else{
                alert(result.message);
                //window.closeWindow();
            }
        }
    },
    _update : function() {
        this.statistic = {};
        for (var ii = 0, length = this.columns.length; ii < length; ii++) {
            var total = 0;
            var column = this.columns[ii];
            var name = column.property;
            var json = this.statistic[name] = this.statistic[name] || {};
            if (column.editor == 'number') {
                for (var i = 0, len = this.data.length; i < len; i++, total++) {
                    var row = this.data[i];
                    json.old_sum = json.old_sum || 0;
                    json.old_sum += Number(row[name]);
                } 
                this.statistic[name]['old_avg'] = (this.statistic[name]['old_sum'] || 0) / total;
            }
            column.static = true;
        }
        this.old = false;
    },
    _renderTitle : function() {
        var html = '';
        for (var i = 0, len = this.columns.length; i < len; i++) {
            var row = this.columns[i];
            if (row.width) {
                html += '<th style="width: ' + row.width + 'px;">' + row['name'] + '</th>';
            } else
                html += '<th>' + row['name'] + '</th>';
        }
        this.viewEl.append(html);
    },
    _renderer : function(data) {
        this.index = this.index || 1;
        data = data || this.data;
        var html = '';
        for (var i = 0, len = data.length; i < len; i++, this.index++) {
            var rowData = data[i];
            rowData._uuid = boot.newId();
            html += '<tr id="' + rowData._uuid + '$row">';
            html += '<td>' + this.index + '</td>';
            html += '<td><a href="javascript: void(0);"  uuid="' + rowData._uuid + '" action="remove" class="button button-remove" style="display: ' + (this.old ? 'none' : 'inline-block') + '"></a></td>';
            for (var ii = 0, length = this.columns.length; ii < length; ii++) {
                var row = this.columns[ii];
                var pro = row['property'];
                var value = rowData[pro] || '';
                if (!row.static) {
                    html += '<td>' + value + '</td>';
                } else {
                    html += '<td><div class="cell"><input type="text" id="' + rowData._uuid + '$editor" name="' + pro + '" value="' + value + '" class="editor"/></div></td>';
                }
            }
            html += '</tr>';
        }
        this.viewEl.append(html);
        boot.parseByParent(this.viewEl);
    },
    _addRow : function(row) {
        row = row || {};
        row._status = '_add';
        row._state = '_new';
        row[this.parentidField] = this.parent;
        this._renderer([row]);
        this.data.push(row);
    },
    _getRowByUUID : function(uuid) {
        for (var i = 0, len = this.data.length; i < len; i++) {
            if (this.data[i]._uuid === uuid) {
                return this.data[i];
            }
        }
    },
    _getColumnByProperty : function(property) {
        for (var i = 0, len = this.columns.length; i < len; i++) {
            if (this.columns[i].property === property) {
                return this.columns[i];
            }
        }
    },
    _getData: function(){
        this._validate();
        return this.data;
    },
    _validate: function(){
        this.validate = true;
        list = jQuery(":text", this.el).toArray();
        for(var i=0,len=list.length;i<len;i++){
            var el = jQuery(list[i]);
            var value = el.val();
            if(value == undefined || value == ''){
                el.attr('title', '不能为空!');
                this.validate = false;
            }else{
                el.attr('title', '');
            }
        }
    },
    _statistics : function(name) {
        var column = this._getColumnByProperty(name);
        var json = this.statistic[name] = this.statistic[name] || {};
        json.new_sum = 0;
        var total = 0;
        for (var i = 0, len = this.data.length; i < len; i++) {
            var row = this.data[i];
            if (row._status != '_remove') {
                total++;
                if (column.editor == 'number') {
                    json.new_sum += Number(row[name]);
                }
            }
        }
        this.statistic[name]['new_avg'] = this.statistic[name]['new_sum'] / total;
        this.statistic[name][name + '_fix'] = this.statistic[name]['new_avg'] - this.statistic[name]['old_avg'];
        jQuery('#' + name + '_avg', this.el).html(Number((this.statistic[name]['new_avg']).toFixed(2)));
        jQuery('#' + name + '_fix', this.el).html(Number((this.statistic[name][name + '_fix']).toFixed(2)));
    },
    _bindEvents : function() {
        this._on(this.el, ".button-remove", "click", this._onRemoveRow, this);
        this._on(this.el, ":text", "change", this._onTextChange, this);
    },
    _events : function() {
        var add = boot.get(this._uuid + '$add');
        if (add) {
            add.bind('click', this._addButtonClick, this);
        }
    },
    _addButtonClick: function(){
    	this._addRow({});
    },
    _onTextChange : function(e) {
        var el = e.selector;
        var value = el.val();
        var uuid = el.attr("id").split('$')[0];
        var name = el.attr('name');
        var row = this._getRowByUUID(uuid);
        var column = this._getColumnByProperty(name);
        if(column.editor == 'number'){
            for (var i = 0; i < value.length; i++) {
                var _char = value.charAt(i);
                if (!/[0-9|\.|\-]/.test(_char)) {
                    value = value.split(_char).join("");
                }
            }
            el.val(value);
        }
        row._status = '_update';
        row[name] = value;
        this._statistics(name);
    },
    _onRemoveRow : function(e) {
        var el = e.selector;
        var uuid = el.attr("uuid");
        var row = this._getRowByUUID(uuid);
        row._status = '_remove';
        jQuery('#' + uuid + '\\$row', this.viewEl).remove();
        
        for (var i = 0, len = this.columns.length; i < len; i++) {
            this._statistics(this.columns[i].property);
        }
    },
    _getAttrs : function(attributes) {
        var attrs = boot.concat({
            str : ["url", "prefix", 'parentidField', "parent", "action", "queryMethod", "saveMethod"],
            bool : ["autoLoad"],
            json : ["columns"]
        }, attributes || {});
        return boot.Estimate.superClass._getAttrs.call(this, attrs);
    },

    //API
    getData: function(){
        return this._getData();
    },
    save: function(params){ 
        var data = this.getData();
        data = boot.concat(data, params);
        this.currentAction = 'save';
        this._load(data); 
    },
    query: function(params){
        this.currentAction = 'query';
        this._load(params);
    },
    setParent: function(parent){
    	this.parent = parent;
    },
    reset: function(){
    	jQuery('tr', this.viewEl).remove();
    	this.data = [];
    	this.old = true;
    },
});

boot.Register(boot.Estimate, 'estimate');
