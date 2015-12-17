seajs.config({
    alias : {
        "zepto" : "lib/component/zepto/1.1.6/zepto.js"
    },
    preload : [
        "zepto"
    ]
});
seajs.use(["lib/page/index"]);
