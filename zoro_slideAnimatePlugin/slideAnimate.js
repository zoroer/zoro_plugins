/**
 * auth: zoro
 * version: 1.0.0
 * time: 17-12-4
 */

/**
 * 动画函数
 * @param condition 动画函数的配置对象{}
 * 包含三个参数wrapName，direction，animateSpeed
 */
function SlideAnimate(condition) {
    this.wrapName = condition.wrapName || '.slideAnimate';
    this.direction = /left|right|top|bottom/.test(condition.animateDirection)
        ? condition.animateDirection
        : 'left';
    this.animateSpeed = condition.animateSpeed || 2;
    this.textMode = condition.textMode || false;
    this.directionCssObj = {};
    this.dragPosStart = 0;
    this.timer = null;
    this.init();
}

SlideAnimate.prototype = {
    constructor: SlideAnimate,
    init: function () {
        this.handleCopyHtml();
        this.handleInterval("add");
        this.handleMouseEvent();
    },
    handleCopyHtml: function(){
        //复制html节点
        this.oUl = $(this.wrapName).find("ul");
        this.oUl.append(this.oUl.html());
        this.oLi = this.oUl.find("li");

        //判断动画的方向
        if (/left|right/.test(this.direction)) {
            this.directionCssObj = {
                direction: "left",
                directionProp: "width"
            };

            //处理css部分属性
            $(this.wrapName).find("li").css({"float": "left", "height": "100%"}).find("img").css("width", "100%");

            //重新计算li以及wrap的长度
            this.oLi.css("width", this.oUl.width() / (this.oLi.length / 2) + "px");
            this.oUl.css("width", this.oLi.width() * this.oLi.length + "px");
        } else {
            this.directionCssObj = {
                direction: "top",
                directionProp: "height"
            };

            //判断是否是文字模式并处理对应的css部分属性
            if (this.textMode) {
                //赋值传入的文字css
                this.oLi.css(this.textModeStyle);

            } else {
                $(this.wrapName).find("img").css("height", "100%");
                this.oLi.css("height", this.oUl.height() + "px");
            }

            //重新计算wrap的高度
            this.oUl.css("height", this.oLi.height() * this.oLi.length + "px");
        }
    },
    handleMouseEvent: function(){
        var _this = this;
        //移动事件
        this.oUl.on({
            "mouseover": function () {
                _this.handleInterval("cancel")
            },
            "mouseout": function () {
                _this.handleInterval("add")
            },
            "mousedown": function (e) {
                e.preventDefault();
                $(_this.oUl).addClass("grab");

                var propName = "pageX";
                /top|bottom/.test(_this.direction) ? propName = "pageY" : propName;
                _this.dragPosStart = e[propName];
            },
            "mouseup": function (e) {
                e.preventDefault();
                $(_this.oUl).removeClass("grab");

                var propName = "pageX";
                /top|bottom/.test(_this.direction) ? propName = "pageY" : propName;
                var ulPropNumber = parseInt($(_this.oUl).css(_this.directionCssObj.direction).replace(/[^0-9|-]/gi, ""));
                var propHalfLength = _this.oLi[_this.directionCssObj.directionProp]() * (_this.oLi.length / 2);
                var ulComputedNumber = ulPropNumber + (e[propName] - _this.dragPosStart);

                if (ulComputedNumber > 0) {
                    $(_this.oUl).css(_this.directionCssObj.direction, "0px");
                } else if (Math.abs(ulComputedNumber) > propHalfLength) {
                    $(_this.oUl).css(_this.directionCssObj.direction, -propHalfLength + "px");
                } else {
                    $(_this.oUl).css(_this.directionCssObj.direction, ulComputedNumber + "px");
                }
            }
        });
    },
    /**
     * 定时器操作
     * @param type  add or cancel
     */
    handleInterval: function(type) {
        var _this = this;
        if( type === 'add' ){
            this.timer = setInterval(function () {
                if (_this.directionCssObj) {
                    var propNumber = parseInt(_this.oUl.css(_this.directionCssObj.direction).replace(/[^0-9]/gi, ""));

                    if (_this.animateSpeed > 0) {
                        //大于0方向向下或者向右
                        propNumber === 0
                            ? _this.oUl.css(_this.directionCssObj.direction, -_this.oUl[_this.directionCssObj.directionProp]() / 2 + "px")
                            : _this.oUl.css(_this.directionCssObj.direction, "+=" + _this.animateSpeed + "px");
                    } else {
                        //小于0方向向上或者向左
                        propNumber >= _this.oLi[_this.directionCssObj.directionProp]() * (_this.oLi.length / 2)
                            ? _this.oUl.css(_this.directionCssObj.direction, "0px")
                            : _this.oUl.css(_this.directionCssObj.direction, "+=" + _this.animateSpeed + "px");
                    }
                } else {
                    console.warn("directionCssObj不能为空!");
                }
            } , 20)
        }else{
            clearInterval(this.timer);
        }
    },
};