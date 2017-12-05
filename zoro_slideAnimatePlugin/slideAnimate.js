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
    this.direction = /left|right|top|bottom/.test(condition.animateDirection) ? condition.animateDirection : 'left';
    this.animateSpeed = condition.animateSpeed || 2;
    this.resourcesArr = condition.resourcesArr;
    this.textMode = condition.textMode || false;
    this.textModeStyle = condition.textModeStyle;
    this.init();
}

SlideAnimate.prototype = {
    constructor: SlideAnimate,
    init: function () {
        this.initHtml();
        this.handleCopyHtml();
        this.handleInterval("add");
        this.handleMouseEvent();
    },
    initHtml: function () {
        var htmlTemplate = '<ul>';
        this.resourcesArr.forEach( function(item) {
            htmlTemplate += this.textMode
                ? '<li><p>'+ item +'</p></li>'
                : '<li><img src='+ item +'/></li>';
        }.bind(this));
        htmlTemplate += '</ul>';

        $("#slideAnimate").append(htmlTemplate);
    },
    handleCopyHtml: function(){
        //复制html节点
        this.oUl = $("#slideAnimate").find("ul");
        this.oUl.append(this.oUl.html());
        this.oLi = this.oUl.find("li");

        //判断动画的方向
        if (/left|right/.test(this.direction)) {
            this.directionCssObj = {
                direction: "left",
                directionProp: "width"
            };
            $("#slideAnimate").find("li").css({"float": "left", "height": "100%"}).find("img").css("width", "100%");
        } else {
            this.directionCssObj = {
                direction: "top",
                directionProp: "height"
            };
            $("#slideAnimate").find("li").css("height", this.oUl.height() + "px").find("img").css("height", "100%");
        }

        //文字模式下，渲染自定义文字的样式
        this.textMode && this.oLi.css(this.textModeStyle);

        //重新计算li以及wrap的长度
        this.oLi.css(this.directionCssObj.directionProp, this.oUl[this.directionCssObj.directionProp]() / (this.oLi.length / 2) + "px");
        this.oUl.css(this.directionCssObj.directionProp, this.oLi[this.directionCssObj.directionProp]() * this.oLi.length + "px");
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

                var propName = /top|bottom/.test(_this.direction) ? "pageY" : "pageX";
                _this.dragPosStart = e[propName];
            },
            "mouseup": function (e) {
                e.preventDefault();
                $(_this.oUl).removeClass("grab");

                var propName = /top|bottom/.test(_this.direction) ? "pageY" : "pageX";
                var ulPropNumber = parseInt( $(_this.oUl).css(_this.directionCssObj.direction) );
                var propHalfLength = _this.oLi[_this.directionCssObj.directionProp]() * (_this.oLi.length / 2);
                var ulComputedNumber = ulPropNumber + (e[propName] - _this.dragPosStart);
                var ulSlide = 0;

                if (ulComputedNumber > 0) {
                    ulSlide = 0;
                } else if (Math.abs(ulComputedNumber) > propHalfLength) {
                    ulSlide = -propHalfLength;
                } else {
                    ulSlide = ulComputedNumber;
                }

                $(_this.oUl).css(_this.directionCssObj.direction, ulSlide);
            }
        });
    },
    /**
     * 定时器操作
     * @param type  add or cancel
     */
    handleInterval: function(type) {
        type === 'add'
            ? this.timer = setInterval( this.handleAnimate(this), 20)
            : clearInterval(this.timer);

            //this.timer = requestAnimationFrame(this.handleAnimate(this));
    },
    /**
     * 处理动画操作
     * @param _this
     * @returns {Function}
     */
    handleAnimate: function (_this) {
        return function () {
            if (_this.directionCssObj) {
                var propNumber = _this.oUl.css(_this.directionCssObj.direction).replace(/[^0-9]/g, "");

                if (/right|bottom/.test(_this.direction)) {
                    //方向向下或者向右
                    propNumber === 0
                        ? _this.oUl.css(_this.directionCssObj.direction, - _this.oUl[_this.directionCssObj.directionProp]() / 2 + "px")
                        : _this.oUl.css(_this.directionCssObj.direction, "+=" + _this.animateSpeed + "px");
                } else {
                    //方向向上或者向左
                    propNumber >= _this.oLi[_this.directionCssObj.directionProp]() * (_this.oLi.length / 2)
                        ? _this.oUl.css(_this.directionCssObj.direction, "0px")
                        : _this.oUl.css(_this.directionCssObj.direction, "+=" + -_this.animateSpeed + "px");
                }
            } else {
                console.warn("directionCssObj不能为空!");
            }
        }
    }
};