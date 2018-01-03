/**
 * @author 田鑫龙
 */
//日期
boot.Date = function(id){
    boot.Date.superClass.constructor.call(this, id);
    this._renderDatePicker();
    this._bindAfterEvent();
};

boot.extend(boot.Date, boot.PopupEdit, {
    uiCls: 'boot-date',
    _initField: function(){
        boot.Date.superClass._initField.call(this);
        this.format = this.format || 'YYYY-MM-DD';
        this.showTime = this.onlyTime == true ? true : this.showTime;
    },
    _create: function(){
        boot.Date.superClass._create.call(this);
        this.value = this._getTime(this.value);
        this.textEl.val(this.value);
    },
    _getTime: function(time){
        time = time || "";
        if(time === ''){
            return '';
        }
        return boot.formatDate(this.format, time);
    },
    _setValue: function(value){
        this.value = this._getTime(value);
        this.datePicker._setValue(this.value);
        this.textEl.val(this.value).trigger("change");
    },
    _getValue: function(){
        return this.value;
    },
    _renderDatePicker: function() {
    	var box = this._updateDatePickerLayout();
        var html = '<div id="'+ this._uuid +'$datepicker" class="boot-datepicker" ';
        html += 'format="'+ this.format +'" ';
        html += 'value="'+ this.value +'" ';
        html += 'showTime="'+ this.showTime +'" ';
        html += 'onlyTime="'+ this.onlyTime +'" ';
        html += 'style="top: '+ box.top +'px;left: '+ box.left +'px;display: none;z-index: 10;"';
        html += '></div>';
        jQuery(html).appendTo(document.body);
        this.datePicker = new boot.DatePicker(this._uuid +'\\$datepicker');
    },
    _updateDatePickerLayout: function(){
        var box = this._getBox();
        var winHeight = $(document.body).height();
        var height = this.onlyTime ? '34' : '242';
        
        if (winHeight - box.top > height) {
            box.top = box.top + box.height;
        }else{
            box.top -= height;
        }
        
        if(this.datePicker){
        	this.datePicker.el.css({
        		top: box.top,
        		left: box.left
        	});
        }
        return box;
    },
    _bindAfterEvent: function(){
        this.datePicker._bind('sure', this._onTodayClick, this);
        this.datePicker._bind('today', this._onTodayClick, this);
        this.datePicker._bind('clear', this._onClearClick, this);
        this.datePicker._bind('dayclick', this._onDayClick, this);
        
        this.bind('bodyclick', this._onBodyClick, this);
    },
    _onBodyClick: function(){
        this.datePicker._hide();
    },
    _onTodayClick: function(e){
        this.setValue(e.value);
        this.datePicker._hide();
    },
    _onClearClick: function(e){
        this.setValue('');
    },
    _onDayClick: function(e){
        if(!this.showTime){
            this.setValue(e.value);
            this.datePicker._hide();
        }
    },
    _onButtonEditClick: function(e){
        e.stopPropagation();
        this.datePicker._setValue(this.value);
        this._updateDatePickerLayout();
        this.datePicker._show();
        this._fire("onbuttonclick", e);
    },
    _getAttrs: function(attributes){
        var attrs = boot.concat({
            str: ["format"],
            bool: ["showTime", "onlyTime"]
        }, attributes || {});
        return boot.Date.superClass._getAttrs.call(this, attrs);
    },
    
    
    //API
    getValue: function(){
        return this._getValue();
    },
    setValue: function(value){
        this._setValue(value);
    }
});

boot.Register(boot.Date, 'date');
