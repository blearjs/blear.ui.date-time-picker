/**
 * blear.ui.date-picker
 * @author ydr.me
 * @create 2016年06月04日14:09:36
 * @ref http://api.jqueryui.com/datepicker/
 */


var calendar = require('blear.utils.calendar');
var object =   require('blear.utils.object');
var UI =       require('blear.ui');
var Window =   require('blear.ui.window');


var defaults = {
    /**
     * 父级
     * @type Null|*
     */
    el: null,

    /**
     * 日期格式
     * @type String
     */
    dateFormat: 'YYYY-MM-DD',

    /**
     * 最小日期
     * @type Number|Date
     */
    minDate: 0,

    /**
     * 最大日期
     * @type Number|Date
     */
    maxDate: 0,


    /**
     * 一周的第一天星期几，默认为0，即星期日
     * @type Number
     */
    firstDayInWeek: 0
};
var DatePicker = UI.extend({
    className: 'DatePicker',
    constructor: function (options) {
        var the = this;

        the[_options] = object.assign({}, defaults, options);
    }
});
var _options = DatePicker.sole();
var _initNode = DatePicker.sole();

DatePicker.method(_initNode, function () {

});



DatePicker.defaults = defaults;
module.exports = DatePicker;
