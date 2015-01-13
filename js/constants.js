(function(global){
    global.Ex = global.Ex || {};

    var dateToYYYYMMDD = function(date){
        var year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate();

        return year + "" +
            (month>=10 ? month : ('0'+month.toString())) + "" +
            (day>=10 ? day : ('0'+day.toString()));
    };
    var dateFromYYYYMMDD = function(YYYYMMDD){
        YYYYMMDD = YYYYMMDD.toString();
        var year = YYYYMMDD.substr(0, 4);
        var month = YYYYMMDD.substr(4, 2);
        var day = YYYYMMDD.substr(6, 2);
        return new Date(year + '/' + month + '/' + day);
    };

    global.Ex.dmm = (function(){
        /**
         * @class DMMCurrency
         * @param {[type]} name [description]
         */
        var DMMCurrency = function(name){
            this._name = name;
            this._dateToYenPer10k = {};
        };

        /**
         * @param {Date} date
         * @param {Number} yenPer10k  Swap mount for a day per 10k units of this currency.
         * @return {bool} Returns true if succeeds.
         */
        DMMCurrency.prototype.addDateAndYenPer10k = function(date, yenPer10k){
            var dateStr = dateToYYYYMMDD(date);
            if( dateStr in this._dateToYenPer10k ){
                return false;
            }
            this._dateToYenPer10k[dateStr] = yenPer10k;
            return true;
        };

        /**
         * @return {Object}
         */
        DMMCurrency.prototype.dump = function(){
            return {
                name: this._name,
                dateToYenPer10k: this._dateToYenPer10k,
            };
        };

        /**
         * @param  {Object} obj This is dumped object.
         * @return {DMMCurrenty | bool}     Returns DMMCurrency if succeed.
         */
        DMMCurrency.fromDump = function(obj){
            if( "name" in obj && "dateToYenPer10k" in obj ) {
                var cur = new DMMCurrency(obj.name);
                cur._dateToYenPer10k = obj.dateToYenPer10k;
                return cur;
            }
            return false;
        };

        return {
            urls: {
                SWAP: "http://fx.dmm.com/market/swapcalendar_fx/index1.html",
            },
            classes: {
                Currency: DMMCurrency
            }
        };
    })();


    global.Ex.background = (function(){
        var i=0;
        return {
            actions: {
                SCRAPE_DMM: i++,
                SCRAPE_SBI: i++,
                GET_RESOURCE: i++,
            }

        };
    })();

})(this);