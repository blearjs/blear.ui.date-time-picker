/**
 * blear.ui.date-picker
 * @author ydr.me
 * @create 2016年06月04日14:09:36
 * @ref http://api.jqueryui.com/datepicker/
 */


var selector = require('blear.core.selector');
var modification = require('blear.core.modification');
var calendar = require('blear.utils.calendar');
var object = require('blear.utils.object');
var date = require('blear.utils.date');
var Popover = require('blear.ui.popover');
var ViewModel = require('blear.classes.view-model');

var template = require('./template.html');

var weeks = '日一二三四五六';
var defaults = {
    // /**
    //  * 日期格式
    //  * @type String
    //  */
    // dateFormat: 'YYYY-MM-DD HH:mm:ss',
    //
    // /**
    //  * 最小日期
    //  * @type Number|Date
    //  */
    // minDate: 0,
    //
    // /**
    //  * 最大日期
    //  * @type Number|Date
    //  */
    // maxDate: 0,

    /**
     * 一周的第一天星期几，默认为0，即星期日
     * @type Number
     */
    firstDayInWeek: 0,

    /**
     * 是否时间可操作
     * @type Boolean
     */
    timeable: false,

    /**
     * 是否可操作分
     * @type Boolean
     */
    minutesable: true,

    /**
     * 是否可操作秒
     * @type Boolean
     */
    secondsable: false
};
var DateTimePicker = Popover.extend({
    className: 'DateTimePicker',
    constructor: function (options) {
        var the = this;

        the[_options] = object.assign({}, defaults, options);
        DateTimePicker.parent(the, options);
        the[_initData]();
        the[_initNode]();
    },


    /**
     * 选择一个日期
     * @param d {Number|Date} 日期或时间戳
     * @returns {DateTimePicker}
     */
    select: function (d) {
        var the = this;

        d = date.parse(d);
        the[_data].selected = date.id(d);
        the.emit('selected', d);

        return the;
    }
});
var pro = DateTimePicker.prototype;
var _options = DateTimePicker.sole();
var _initData = DateTimePicker.sole();
var _initNode = DateTimePicker.sole();
var _heads = DateTimePicker.sole();
var _vm = DateTimePicker.sole();
var _data = DateTimePicker.sole();
var _calendar = DateTimePicker.sole();

pro[_initData] = function () {
    var the = this;
    var options = the[_options];
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();

    the[_heads] = weeks.slice(options.firstDayInWeek) + weeks.slice(0, options.firstDayInWeek);
    the[_heads] = the[_heads].split('');
    the[_data] = {
        options: the[_options],
        heads: the[_heads],
        weeks: [],
        selected: 0,
        year: year,
        month: month,
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: 0
    };
};


pro[_initNode] = function () {
    var the = this;
    var divEl = modification.create('div');
    var data = the[_data];

    the.setHTML(divEl);
    the[_calendar]();
    the[_vm] = new ViewModel({
        el: divEl,
        data: data,
        template: template,
        methods: {
            onSelect: function (item) {
                data.selected = item.id;
                the.emit('selected', new Date(item.year, item.month, item.date, data.hours, data.minutes, data.seconds));
            },
            onPrev: function () {
                if (data.month === 0) {
                    data.month = 11;
                    data.year--;
                } else {
                    data.month--;
                }

                the[_calendar]();
            },

            onNext: function () {
                if (data.month === 11) {
                    data.month = 0;
                    data.year++;
                } else {
                    data.month++;
                }

                the[_calendar]();
            }
        }
    });
};


// 日历
pro[_calendar] = function () {
    var the = this;
    var data = the[_data];
    var options = the[_options];

    data.weeks = calendar.month(data.year, data.month, {
        firstDayInWeek: options.firstDayInWeek,
        weeks: 6
    });
};


require('./style.css', 'css|style');
DateTimePicker.defaults = defaults;
module.exports = DateTimePicker;
