// 自调用函数闭包（bin）
(function () {
    var Util = (function () {
        var prefix = 'html5_reader_';
        var StorageGetter = function (key) {
            return localStorage.getItem(prefix + key);
         
        }
        var StorageSetter = function (key, val) {
            return localStorage.setItem(prefix + key, val);
        }
        return {
            StorageGetter: StorageGetter,
            StorageSetter: StorageSetter
        }
       
    })();
})();