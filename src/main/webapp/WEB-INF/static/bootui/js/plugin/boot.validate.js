/**
 * @author 田鑫龙
 */
//验证

boot.Validate = function() {
    this.numberErrorText = "不是正确的数字!";
    this.emailErrorText = "不是正确的邮件地址!";
    this.urlErrorText = "不是正确的网址!";
    this.mobileErrorText = "不是正确的手机号!";
    this.phoneErrorText = "不是正确的座机号!";
};

boot.Validate.prototype = {
    _isEmail : function() {
        if (this.isNull() || this.isEmpty())
            return true;
        return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(this.value);
    },
    _isUrl : function(v, args) {
        if (this.isNull() || this.isEmpty())
            return true;
        var value = this.value.toLowerCase().split("?")[0];
        var strRegex = "^((https|http|ftp|rtsp|mms)?:\/\/)" + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + "(([0-9]{1,3}\.){3}[0-9]{1,3}" + "|" + "([0-9a-z_!~*'()-]+\.)*" + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." + "[a-z]{2,6})" + "(:[0-9]{1,5})?" + "((/?)|" + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
        var re = new RegExp(strRegex);
        return re.test(value);
    },
    _isNull : function() {
        return this.value === null || this.value === undefined;
    },
    _isEmpty: function(){
        return this.value === '';
    },
    _isNumber : function() {
        return !isNaN(this.value) && typeof this.value == 'number';
    },
    _isMobile : function() {
        return /^1\d{10}$/.test(this.value);
    },
    _isPhone : function() {
        return /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(this.value);
    },
    getVFunction: function(vType){
        vType = vType || this.vType;
        if(vType != undefined || vType != ''){
            var _char = vType.charAt(0);
            _char = _char.toUpperCase();
            vType = vType.replace(/^\w/i, _char);
        }
        return '_is' + vType;
    },
    setVType : function(vType) {
        this.vType = vType;
    },
    setValue : function(value) {
        this.value = value;
    },
    setErrorText : function(text) {
        this.errorText = text;
    },
    setRequired : function(required) {
        this.required = required;
    },
    execute : function() {
        if (this.required) {
            if (this.value == undefined || this.value == '') {
                return "不能为空!";
            }
        }
        if(this.vType != undefined && this.vType != '')
            if (this.value != undefined && this.value != '') {
                if (this[this.getVFunction()]())
                    return this.errorText || this[this.vType + 'ErrorText'];
            }
        return "";
    }
};