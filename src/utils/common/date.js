export default {
    timeCycle: function(time){
        let unixtime = time;
        let unixTimestamp = new Date(unixtime * 1000);
        let Y = unixTimestamp.getFullYear(),
            M = ((unixTimestamp.getMonth() + 1) > 10 ? (unixTimestamp.getMonth() + 1) : '0' + (unixTimestamp.getMonth() + 1)),
            D = (unixTimestamp.getDate() > 10 ? unixTimestamp.getDate() : '0' + unixTimestamp.getDate()),
            h = (unixTimestamp.getHours()<10) ? "0"+unixTimestamp.getHours() : unixTimestamp.getHours(),
            min = (unixTimestamp.getMinutes()<10) ? "0"+unixTimestamp.getMinutes() : unixTimestamp.getMinutes(),
            s = (unixTimestamp.getSeconds()<10) ? "0"+unixTimestamp.getSeconds() : unixTimestamp.getSeconds();
        let toDay = Y + '-' + M + '-' + D+ "  " +h + ":" +min + ":" +s;
        return toDay;
    }
}