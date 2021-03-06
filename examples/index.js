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
    secondsable: false,
    minDate: new Date(2016, 5, 1)
});

demo1El.onclick = function () {
    dtp.open(this);
};

dtp.open(demo1El);
// dtp.select(new Date(2016, 11, 29, 11, 11, 11));

dtp.on('select', function (d) {
    console.log(d);
    demo1El.value = d.toLocaleString();
});
