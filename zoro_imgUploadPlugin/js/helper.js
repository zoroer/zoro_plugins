/**
 * 图片上传处理函数
 * @param configObj 接受一个配置对象。
 */
function imgObjHandle(configObj) {
    //参数变量
    var isCompress = configObj.isCompress || true;
    var compressPercent = configObj.compressPercent || 0.2;
    var imgType = configObj.imgTypes || 'jpeg|jpg|png';
    var imgSize = configObj.imgSize || 5;
    var imgBlockName = configObj.imgBlockName || '请上传照片，并保证照片清晰可读';
    var imgWrap = $(".idFiles");

    //加载HTML
    loadHTML();

    /**
     *  加载img的HTML
     */
    function loadHTML(){
        var imgHTML =
            '<input type="file" id="idWhiteImg" class="active"/>' +
            '<div class="imgMesBlock">' +
                '<i class="iconPlus"></i>' +
                '<p>'+ imgBlockName +'</p>' +
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
    }

    //选择照片时调用
    imgWrap.on("change", "input", function() {
        // 获取file的引用
        var file = this.files[0];

        //判断上传文件类型
        if ( !new RegExp("image\/" + (imgType) ).test(file.type)) {
            alert("图片格式错误");
            return;
        }

        //判断上传文件大小
        if(file.size > imgSize*1024*1024){
            alert("上传图片大小不能大于"+ imgSize +"M");
            return;
        }

        //fileReader读取文件
        readFileToBase64(file, $(this));
    });

    /**
     * fileReader读取文件并转换为base64
     * @param file input表单读取的文件流
     * @param $this input的dom对象
     */
    function readFileToBase64(file, $this){
        var reader = new FileReader();
        reader.onload = function(e) {
            handleImg(e.target.result, $this);
        }.bind(this);
        reader.readAsDataURL(file);
    }

    /**
     * 根据图片和上传框的比较来处理图片
     * @param imgURL    img的base64
     * @param $this     input的dom对象
     */
    function handleImg(imgURL, $this){
        var image = new Image();
        image.onload=function(){
            var base64URL = imgURL;

            //需要压缩
            if( isCompress ){
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;

                //控制上传之后的背景颜色
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, image.width, image.height);

                //drawImage绘出图片，并用toDataURL方法进行压缩
                ctx.drawImage(image, 0, 0);
                base64URL = canvas.toDataURL('image/jpeg', compressPercent);
            }

            //判断图片和imgWrap的大小关系来确定图片的显示
            var imgClass = getImgSize($this, image);

            toggleComponentValues("add", $this, base64URL, imgClass);
        };
        image.src = imgURL;
    }

    /**
     * 确定图片显示的class
     * @param inputObj input的dom对象
     * @param imgObj   压缩后的img对象
     * @returns {string}
     */
    function getImgSize(inputObj, imgObj) {
        var inputHeight = inputObj.height(), inputWidth = inputObj.width();
        var imgHeight = imgObj.height, imgWidth = imgObj.width;

        if( imgHeight < inputHeight && imgWidth < inputWidth ){
            return "";
        }else if( imgHeight - inputHeight >= imgWidth - inputWidth ){
            return "imgActiveHeight";
        }else{
            return "imgActiveWidth";
        }
    }

    // 单击全屏显示图片
    imgWrap.on("click", "img", function() {
        $(".showFullScreenImg").attr("src", $(this).attr("src"));
        $(".imgShowWrap").addClass("active");
    });

    // 单击图片关闭图片全屏显示
    $(".showFullScreenImg").on("click", function() {
        $(this).parent("div").removeClass("active");
    });

    // 删除图片
    $(".imgExchange").on("click", function() {
        toggleComponentValues("clear", $(".imgExchange"));
    });

    /**
     * 切换组件的数据
     * @param type  "add" or "clear" 切换的类型
     * @param $this 上下文对象
     * @param base64URl 增加时传入的base64URL
     * @param imgClass  增加时传入计算后的imgClass
     */
    function toggleComponentValues(type, $this, base64URl, imgClass){
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
    }

    //todo
    //1. 换成对象的形式
}