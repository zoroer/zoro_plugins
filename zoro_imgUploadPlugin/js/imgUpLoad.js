/**
 * 单图片上传处理插件
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

ImgObjHandle.prototype = {
    constructor: ImgObjHandle,
    init: function(){
        this.loadHTML();
        this.handleClick();
    },
    //加载img的HTML
    loadHTML: function(){
        //拼接图片组件的html
        var imgHTML =
            '<input type="file" id="idWhiteImg" class="active" />' +
            '<div class="imgMesBlock">' +
                '<i class="iconPlus"></i>' +
                '<p>'+ this.imgBlockMes +'</p>' +
            '</div>' +
            '<div class="imgBlockWrap">' +
                '<img src="" data-name="idWhiteImg" class="quickSaveCatch">' +
            '</div>' +
            '<i class="imgExchange"></i>';

        //全屏展示图片
        var fullScreenHTML =
            '<div class="imgShowWrap">' +
                '<img src="" class="showFullScreenImg" />' +
            '</div>';

        this.imgWrap.append(imgHTML);
        $("body").append(fullScreenHTML);
    },
    //绑定事件
    handleClick: function(){
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
            _this.readFileToBase64(file);
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

        // 清除图片以及input组件的值
        $(".imgExchange").on("click", function() {
            this.toggleComponentValues("clear");
        }.bind(this));
    },
    /**
     * fileReader读取文件并转换为base64
     * @param file input表单读取的文件流
     */
    readFileToBase64: function (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            this.handleImg(e.target.result, $("#idWhiteImg"));
        }.bind(this);
        reader.readAsDataURL(file);
    },
    /**
     * 根据图片和上传框的比较来处理图片（回显图片时也是用的这个方法，后台传base64，进行判断！）
     * @param imgURL    img的base64
     */
    handleImg: function(imgURL){
        var image = new Image();
        image.onload = function(){
            var base64URL = imgURL;

            //需要压缩
            if( this.isCompress ){
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;

                //控制上传之后的背景颜色
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, image.width, image.height);

                //drawImage绘出图片，并用toDataURL方法进行压缩
                ctx.drawImage(image, 0, 0);
                base64URL = canvas.toDataURL('image/jpeg', this.compressPercent);
            }

            //判断图片和imgWrap的大小关系来确定图片的显示
            var imgClass = this.getImgSize(image);

            this.toggleComponentValues("add", base64URL, imgClass);
        }.bind(this);
        image.src = imgURL;
    },
    /**
     * 确定图片显示的class
     * @param imgObj   压缩后的img对象
     * @returns {string}
     */
    getImgSize: function(imgObj) {
        var inputEle = $("#idWhiteImg");
        var inputHeight = inputEle.height(), inputWidth = inputEle.width();
        var imgHeight = imgObj.height, imgWidth = imgObj.width;

        if( imgHeight < inputHeight && imgWidth < inputWidth ){
            return "";
        }else if( imgHeight - inputHeight >= imgWidth - inputWidth ){
            return "imgActiveHeight";
        }else{
            return "imgActiveWidth";
        }
    },
    /**
     * 切换组件的数据显示
     * @param type  "add" or "clear" 切换的类型
     * @param base64URl 增加时传入的base64URL  （add时需要传）
     * @param imgClass  增加时传入计算后的imgClass   （add时需要传）
     */
    toggleComponentValues: function(type, base64URl, imgClass){
        var imgStyle = imgClass || "imgActiveHeight";
        if(type === "add"){
            $("#idWhiteImg").removeClass("active").next(".imgMesBlock").addClass("active")
                .siblings("i").show().siblings(".imgBlockWrap").addClass("active")
                .find("img").attr("src", base64URl).addClass(imgStyle);
        }else if(type === "clear"){
            $(".imgExchange").hide().siblings("input").val("").addClass("active").siblings("div")
                .removeClass("active").find("img").attr("src", "");
        }else{
            console.error("函数传参错误!");
        }
    }
};