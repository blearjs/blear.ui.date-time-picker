/**
 * blear.ui.date-picker
 * @author ydr.me
 * @create 2016年06月04日14:09:36
 * @ref http://api.jqueryui.com/datepicker/
 */


var selector = require('blear.core.selector');
var attribute = require('blear.core.attribute');
var event = require('blear.core.event');
var calendar = require('blear.utils.calendar');
var object = require('blear.utils.object');
var fun = require('blear.utils.function');
var time = require('blear.utils.time');
var date = require('blear.utils.date');
var access = require('blear.utils.access');
var json = require('blear.utils.json');
var Popover = require('blear.ui.popover');
var MVVM = require('blear.classes.mvvm');
var Template = require('blear.classes.template');

var template = require('./template.html');
var calendarTpl = new Template(require('./calendar.html'));

var weeks = '日一二三四五六';
var defaults = {
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
    secondsable: false,

    /**
     * 是否自动关闭
     */
    autoClose: true
};
var DateTimePicker = Popover.extend({
    className: 'DateTimePicker',
    constructor: function (options) {
        var the = this;

        the[_options] = object.assign({}, defaults, options);
        DateTimePicker.parent(the, options);
        the[_initData]();
        the[_initNode]();
        the[_initEvent]();
    },


    /**
     * 选择一个日期
     * @param d {Number|Date} 日期或时间戳
     * @returns {DateTimePicker}
     */
    select: function (d) {
        var the = this;

        time.nextTick(function () {
            the[_select](d);
            the[_renderCalendar]();
        });

        return the;
    },


    /**
     * 切换视图
     * @param year
     * @param month
     * @returns {DateTimePicker}
     */
    changeView: function (year, month) {
        var the = this;
        var args = access.args(arguments);
        var dt;
        var data = the[_data];

        switch (args.length) {
            // 当前
            case 0:
                dt = new Date();
                break;

            // 日期
            case 1:
                dt = date.parse(year);
                break;

            // 年，月
            case 2:
                dt = new Date(year, month, 1);
                break;
        }

        data.year = dt.getFullYear();
        data.month = dt.getMonth();
        the[_renderCalendar]();
        return the;
    },


    /**
     * 改变最小日期
     * @param dt
     * @returns {DateTimePicker}
     */
    changeMinDate: function (dt) {
        var the = this;
        the[_data].minId = date.id(dt);
        the[_renderCalendar]();
        return the;
    },


    /**
     * 改变最大日期
     * @param dt
     * @returns {DateTimePicker}
     */
    changeMaxDate: function (dt) {
        var the = this;
        the[_data].maxId = date.id(dt);
        the[_renderCalendar]();
        return the;
    },


    /**
     * 打开
     * @param target
     * @param callback
     * @returns {DateTimePicker}
     */
    open: function (target, callback) {
        var the = this;
        callback = fun.ensure(callback);
        the[_currentTarget] = target;
        DateTimePicker.invoke('open', the, target, callback);
        return the;
    }
});
var pro = DateTimePicker.prototype;
var _options = DateTimePicker.sole();
var _initData = DateTimePicker.sole();
var _initNode = DateTimePicker.sole();
var _initEvent = DateTimePicker.sole();
var _heads = DateTimePicker.sole();
var _vm = DateTimePicker.sole();
var _data = DateTimePicker.sole();
var _renderCalendar = DateTimePicker.sole();
var _calendarData = DateTimePicker.sole();
var _bindList = DateTimePicker.sole();
var _select = DateTimePicker.sole();
var _currentTarget = DateTimePicker.sole();

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
        year: year,
        month: month,
        date: now.getDate(),
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: 0,
        minId: options.minDate ? date.id(options.minDate) : 0,
        maxId: date.id(options.maxDate ? options.maxDate : new Date(3000, 0)),
        calendarHTML: ''
    };
    the[_calendarData] = {
        selected: 0,
        options: the[_options],
        heads: the[_heads],
        weeks: []
    };
    the[_bindList] = [];
};


pro[_initNode] = function () {
    var the = this;
    var data = the[_data];

    the.setHTML(template);
    the[_renderCalendar]();
    the[_vm] = new MVVM({
        el: the.getContentEl(),
        data: data,
        methods: {
            onPrev: function () {
                if (data.month === 0) {
                    data.month = 11;
                    data.year--;
                } else {
                    data.month--;
                }

                the[_renderCalendar]();
            },

            onNext: function () {
                if (data.month === 11) {
                    data.month = 0;
                    data.year++;
                } else {
                    data.month++;
                }

                the[_renderCalendar]();
            }
        }
    });
};


pro[_initEvent] = function () {
    var the = this;
    var data = the[_data];

    event.on(document, 'click', function (ev) {
        if (!the[_options].autoClose) {
            return;
        }

        // 点击的是当前目标
        if (the[_currentTarget]) {
            var closesetTargetEl = selector.query(ev.target, the[_currentTarget]);

            if (closesetTargetEl.length) {
                return;
            }
        }

        var closestPopoverEl = selector.closest(ev.target, the.getPopoverEl());

        if (!closestPopoverEl.length) {
            if (the.isVisible()) {
                the.close();
                the[_select](new Date(data.year, data.month, data.date, data.hours, data.minutes, data.seconds));
            }
        }
    });

    event.on(the.getContentEl(), 'click', 'td', function () {
        var jsonEl = selector.children(this)[1];
        var item = json.parse(attribute.text(jsonEl));

        if (item.disabled) {
            return;
        }

        the[_select](new Date(item.year, item.month, item.date, data.hours, data.minutes, data.seconds));
        the[_renderCalendar]();
        setTimeout(function () {
            the.close();
        }, 234);
    });

    the[_currentTarget] = null;

    the.on('afterClose', function () {
        the[_currentTarget] = null;
    });
};

// 日历
pro[_renderCalendar] = function () {
    var the = this;
    var data = the[_data];
    var options = the[_options];

    the[_calendarData].weeks = calendar.month(data.year, data.month, {
        firstDayInWeek: options.firstDayInWeek,
        weeks: 6,
        iterator: function (item) {
            item.disabled = item.id < data.minId || item.id > data.maxId
        }
    });
    the[_data].calendarHTML = calendarTpl.render(the[_calendarData]);
};

// 选择
pro[_select] = function (item) {
    var the = this;
    var data = the[_data];
    var dt = date.parse(item);

    data.year = dt.getFullYear();
    data.month = dt.getMonth();
    data.date = dt.getDate();
    data.hours = dt.getHours();
    data.minutes = dt.getMinutes();
    data.seconds = dt.getSeconds();
    the[_calendarData].selected = date.id(dt);

    the.emit('select', dt);
};


require('./style.css', 'css|style');
DateTimePicker.defaults = defaults;
module.exports = DateTimePicker;
