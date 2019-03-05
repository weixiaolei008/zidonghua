const mixin = {
    methods: {
        parseToDate(val){
            if(val==null || val ==''){
                return null;
            }
            if(typeof(val) == "number" || typeof(val) == "string"){
                return new Date(val);
            }else if(val instanceof Date){
                return val;
            }else{
                return new Date();
            }
        },
        parseToMillisecond(val){
            var date = this.parseToDate(val);
            return date.getTime();
        },
        datetimeFormat(date, fmt) {
            if(date==null){
                return "";
            }
            if(typeof(date) == "number" || typeof(date) == "string"){
                date=new Date(date);
            }
            if(fmt==null){
                fmt="yyyy-MM-dd HH:mm:ss";
            }
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            let o = {
                'M+': date.getMonth() + 1,
                'd+': date.getDate(),
                'h+': date.getHours(),
                'H+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds()
            };
            for (let k in o) {
                if (new RegExp(`(${k})`).test(fmt)) {
                    let str = o[k] + '';
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str));
                }
            }
            return fmt;
        },
        dateFormatter(row, column) {
            let filedValue=row[column.property];
            return this.datetimeFormat(filedValue);
        },
        padLeftZero(str) {
            return ('00' + str).substr(str.length);
        },
        formatNumber(n) {
          n = n.toString()
          return n[1] ? n : '0' + n
        },
        millisecondToDayHourMinuteSecond(mss){
            if(mss>(1000 * 60 * 60 * 24)){
                var days = parseInt(mss / (1000 * 60 * 60 * 24));
            }
            if(mss>(1000 * 60 * 60)){
                var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            }
            if(mss>(1000 * 60)){
                var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
            }
            var seconds = parseInt((mss % (1000 * 60)) / 1000);
            var milliseconds = mss % 1000;
            var result="";
            if(days>0){
                result = result + days + "天";
            }
            if(hours>0){
                result = result + hours + "时";
            }
            if(minutes>0){
                result = result + minutes + "分";
            }
            if(seconds>0){
                result = result + seconds + "秒";
            }
            if(milliseconds>0){
                result = result + milliseconds + "毫秒";
            }
            return result==""?"0毫秒":result;
        }
    }
}
export {mixin}