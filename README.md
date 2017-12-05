# zoro_plugins
### 避免重复的代码工作，总结了工作中用到的一些组件，使用时会随着工作的需求一直添加修改bug并且添加新的组件。

## plugins1: imgUploadPlugin
imgUploadPlugin是一个简单的单图片压缩回显的组件。

#### 下边是组件的所有参数, 不传任何参数按照默认设置。 
1. isCompress:         是否需要压缩, 默认true
2. compressPercent:    压缩比例（0-1），默认0.2
3. imgTypes:           支持上传的图片类型，默认'jpeg|jpg|png'三种
4. imgSize:            支持上传的图片的最大大小， 默认10M
5. imgBlockMes:        上传的封面文字信息, 默认文字为'请上传照片，并保证照片清晰可读',
6. imgWrap:            区别不同的上传组件，需要同时在html的zoroUploadBlock处添加class

#### 一个configObj的配置例子：
```
 configObj = {
    isCompress: true,           
    compressPercent: 0.1,      
    imgTypes: 'jpeg|jpg|png',   
    imgSize: 10                 
    imgBlockMes:'请上传照片'     
    imgWrap: ''    
 }     
```        

#### 组件使用截图
<center>

未选择图片的截图

![未选择图片的截图](https://github.com/zoroer/zoro_plugins/blob/master/zoro_imgUploadPlugin/screenShots/img1.png)


选择图片未压缩的截图

![选择图片未压缩的截图](https://github.com/zoroer/zoro_plugins/blob/master/zoro_imgUploadPlugin/screenShots/img2.png)

选择图片并且压缩之后的截图

![选择图片并且压缩之后的截图](https://github.com/zoroer/zoro_plugins/blob/master/zoro_imgUploadPlugin/screenShots/img3.png)
</center>

### 注意点:
1. 组件不涉及提交的逻辑，最后提交时，需要自己获取$(".quickSaveCatch")的值 (base64格式的图片) ，进行提交!
2. 多个组件的话$(".quickSaveCatch")获取到的是一个数据，需要自己处理!
         
### plugins2: sliderAnimatePlugin
slideAnimatePlugin是一个无缝滚动的组件。

#### 组件的特点：
1. 支持 left|top|right|bottom 四个方向的滚动
2. 组件提供了图片模式和文字模式，只需要在参数中提供相应的资源即可完成切换。

#### 下边是组件的所有参数, 不传任何参数按照默认设置。 
1. animateDirection:       组件滚动的方向，默认为"left"
2. animateSpeed:           滚动的速度，默认2px/s
3. resourcesArr:           需要滚动展示的资源数组，图片模式下需要上传一组图片，文字模式下请提供滚动的文字
4. textMode:               是否开启文字模式， 组件默认是图片模式
5. textModeStyle:          文字模式下上传文字的样式

#### 一个configObj的配置例子：
```
 configObj = {
    animateDirection: "left",
    animateSpeed: 2,
    resourcesArr: [
        "./img/img1.jpg",
        "./img/img2.jpg",
        "./img/img3.jpg",
        "./img/img4.jpg",
        "./img/img5.jpg"
    ],
    textMode: false
 }     
```  

#### 组件使用截图
<center>

滚动的截图
![未选择图片的截图](https://github.com/zoroer/zoro_plugins/blob/master/zoro_slideAnimatePlugin/screenShoots/slideImg.png)
</center>
