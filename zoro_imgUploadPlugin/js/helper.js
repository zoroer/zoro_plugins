/**
 * 图片上传处理插件
 * @param configObj 接受一个配置对象。
 */
function ImgObjHandle(configObj) {
    //参数变量
    this.isCompress = configObj.isCompress === undefined ? true : configObj.isCompress;
    this.compressPercent = configObj.compressPercent || 0.2;
    this.imgType = configObj.imgTypes || 'jpeg|jpg|png';
    this.imgSize = configObj.imgSize || 5;
    this.imgBlockMes = configObj.imgBlockMes || '请上传照片，并保证照片清晰可读';
    this.imgWrap = $(".idFiles");
    this.init();
}

ImgObjHandle.prototype.init = function () {
    this.loadHTML();
    this.handleClick();
};

ImgObjHandle.prototype.handleClick = function(){
    var _this = this;
    //选择照片时调用
    this.imgWrap.on("change", "input", function() {
        // 获取file的引用
        var file = this.files[0];

        //判断上传文件类型
        if ( !new RegExp("image\/" + (_this.imgType) ).test(file.type)) {
            alert("图片格式错误");
            return;
        }

        //判断上传文件大小
        if(file.size > _this.imgSize*1024*1024){
            alert("上传图片大小不能大于"+ _this.imgSize +"M");
            return;
        }

        //fileReader读取文件
        _this.readFileToBase64(file, $(this));
    });

    // 单击全屏显示图片
    this.imgWrap.on("click", "img", function() {
        $(".showFullScreenImg").attr("src", $(this).attr("src"));
        $(".imgShowWrap").addClass("active");
    });

    // 单击图片关闭图片全屏显示
    $(".showFullScreenImg").on("click", function() {
        $(this).parent("div").removeClass("active");
    });

    // 删除图片
    $(".imgExchange").on("click", function() {
        this.toggleComponentValues("clear", $(".imgExchange"));
    }.bind(this));
};

/**
 *  加载img的HTML
 */
ImgObjHandle.prototype.loadHTML = function(){
    var imgHTML =
        '<input type="file" id="idWhiteImg" class="active"/>' +
        '<div class="imgMesBlock">' +
        '<i class="iconPlus"></i>' +
        '<p>'+ this.imgBlockMes +'</p>' +
        '</div>' +
        '<div class="imgBlockWrap">' +
        '<img src="" data-name="idWhiteImg" class="quickSaveCatch">' +
        '</div>' +
        '<i class="imgExchange"></i>';

    var fullScreenHTML =
        '<div class="imgShowWrap">' +
        '<img src="" class="showFullScreenImg" />' +
        '</div>';

    $(".idFiles").append(imgHTML);
    $("body").append(fullScreenHTML);
};

/**
 * fileReader读取文件并转换为base64
 * @param file input表单读取的文件流
 * @param $this input的dom对象
 */
ImgObjHandle.prototype.readFileToBase64 = function(file, $this){
    var reader = new FileReader();
    reader.onload = function(e) {
        this.handleImg(e.target.result, $this);
    }.bind(this);
    reader.readAsDataURL(file);
};

/**
 * 根据图片和上传框的比较来处理图片
 * @param imgURL    img的base64
 * @param $this     input的dom对象
 */
ImgObjHandle.prototype.handleImg = function(imgURL, $this){
    var image = new Image();
    var _this = this;
    image.onload = function(){
        var base64URL = imgURL;

        //需要压缩
        console.log(_this.isCompress);
        if( _this.isCompress ){
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;

            //控制上传之后的背景颜色
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, image.width, image.height);

            //drawImage绘出图片，并用toDataURL方法进行压缩
            ctx.drawImage(image, 0, 0);
            base64URL = canvas.toDataURL('image/jpeg', _this.compressPercent);
        }

        //判断图片和imgWrap的大小关系来确定图片的显示
        var imgClass = _this.getImgSize($this, image);

        _this.toggleComponentValues("add", $this, base64URL, imgClass);
    };
    image.src = imgURL;
};

/**
 * 确定图片显示的class
 * @param inputObj input的dom对象
 * @param imgObj   压缩后的img对象
 * @returns {string}
 */
ImgObjHandle.prototype.getImgSize = function(inputObj, imgObj) {
    var inputHeight = inputObj.height(), inputWidth = inputObj.width();
    var imgHeight = imgObj.height, imgWidth = imgObj.width;

    if( imgHeight < inputHeight && imgWidth < inputWidth ){
        return "";
    }else if( imgHeight - inputHeight >= imgWidth - inputWidth ){
        return "imgActiveHeight";
    }else{
        return "imgActiveWidth";
    }
};

/**
 * 切换组件的数据
 * @param type  "add" or "clear" 切换的类型
 * @param $this 上下文对象
 * @param base64URl 增加时传入的base64URL
 * @param imgClass  增加时传入计算后的imgClass
 */
ImgObjHandle.prototype.toggleComponentValues = function(type, $this, base64URl, imgClass){
    var imgStyle = imgClass || "imgActiveHeight";
    if(type === "add"){
        $this.attr("class", "").next("div").addClass("active")
            .siblings("i").show().siblings(".imgBlockWrap").addClass("active")
            .find("img").attr("src", base64URl).addClass(imgStyle);
    }else {
        $this.hide().prev("div").removeClass("active").find("img").attr("src", "")
            .parent().siblings("div").removeClass("active");

        //清理input file的文件（防止重复选择不会触发input的 change事件）
        var inputEle = $("#idWhiteImg")[0];
        inputEle.outerHTML = inputEle.outerHTML;
    }
};