/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-20 21:25
 */


'use strict';


var DateTimePicker = require('../src/index');

var demo1El = document.getElementById('demo1');


var dtp = window.dtp = new DateTimePicker({
    timeable: true,
    minutesable: true,
    secondsable: false
});

demo1El.onclick = function () {
    dtp.open(this);
};

dtp.open(demo1El);
dtp.select(new Date(2016, 11, 29));

dtp.on('select', function (d) {
    console.log(d.getTime());
});
