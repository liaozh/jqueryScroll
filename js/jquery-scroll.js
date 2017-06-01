(function($) {
	$.fn.scroll = function() {
		var method = arguments[0];

		if(methods[method]) {

			method = methods[method];
			arguments = Array.prototype.slice.call(arguments, 1);

		} else if(typeof(method) == 'object' || !method) {
			method = methods.init;
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.scroll');
			return this;
		}
		return method.apply(this, arguments);
	}
	var configure = {
		verticalScroll:true, //垂直滚动 
		horizontalScroll:true,//水平滚动
		distanceY:false,//垂直位置 按px算
		distanceX:false,//水平位置 按px算
		seepd:'200',//滚动速度
		mousePlan:10,//鼠标滚动时候的距离
		mouseWheelPixels:'auto',//滚动条块大小
		scrollName:'sl-content',//滚动的类名
		scrolHeight:14,//滚动条高度
		JqThis:null,//滚动条对象
	};
	var methods = {
		
		init: function(options) {
			configure.JqThis=this;
			options = $.extend(true,configure, options);//合并对象
			
			$(this).css({'position': 'relative','overflow': 'hidden'});//给父框素添加css 
			$(options.scrollBox).css({'position': 'absolute','overflow': 'hidden'})//给滚动框添加css
			options.scrollBox=$(this).find('.'+options.scrollName);//获取滚动的对象
			options.parentWidth=$(this).width();//获取外围宽度
			options.parentHeight=$(this).height();//获取外围高度
			options.scrollWidth=$(options.scrollBox).width();//获取滚动对象宽度
			options.scrollHeight=$(options.scrollBox).outerHeight();//获取滚动对象高度
			return this.each(function() {
				if(options.mouseWheelPixels=="auto"){
					//自动生成滚动条块的宽度
					options.mouseWheelPixels=parseInt(options.parentWidth/5); 
					
				}
				if(options.horizontalScroll&&options.scrollWidth>options.parentWidth){
					//生成水平滚动条
					$(this).append('<div class="sl-scrollbar-x-rail"><div class="sl-scrollbar-x" style="width:'+options.mouseWheelPixels+'px"></div></div>');
					//给滚动的内容添加值
					$(this).find('.'+options.scrollName).css({'position':'absolute','left':'0'});
				}
				if(options.verticalScroll&&options.scrollHeight>options.parentHeight){
					//生成垂直滚动条
					$(this).append('<div class="sl-scrollbar-y-rail"><div class="sl-scrollbar-y" style="height:'+options.mouseWheelPixels+'px"></div></div>');
					//给滚动的内容添加值
					$(this).find('.'+options.scrollName).css({'position':'absolute','top':'0'});
				}
				
				if(!options.scrollWidth||!options.scrollHeight){
					console.log(options);
					console.log("没有获取到滚动条的宽高");
					
					return false;//证明没有获取到滚动内容的宽度和高度
				}
				
				methods.setDistance(options);//初始化手动设置滚动条距离
				methods.bindMouseWheel(options);//给滚动条快绑定鼠标滚动事件
				methods.bindMouseDown(options);//给滚动条快绑定鼠标按下拖拽事件
				methods.bindClick(options);//给滚动条路绑定单击事件
				methods.bindHover(options);//给滚动条路绑定hover事件
			
			});
		},//控件初始化
		bindMouseWheel:function(options){
			var railY=$(options.JqThis).find('.sl-scrollbar-y-rail');//获取垂直滚动条路
			var scrollbarY=$(options.JqThis).find('.sl-scrollbar-y');//获取垂直滚动条块
			$(railY).mousewheel(function(event,delta){ //event：时间，delta：方向 -1向下 1向上
			
				var topValue=parseInt($(scrollbarY).css("top"));//当前的left值
				if(delta=="-1"){
					topValue+=8;
				}else if(delta=="1"){
					topValue-=8;
				}
				if(topValue>=0&&(topValue + options.mouseWheelPixels)<=options.parentHeight){
					// 算法！限制滚动条超出范围
					methods.setScrollBar(scrollbarY,'top',topValue,options,false);//设置滚动条
				}
			
			});
			
			
			var railX=$(options.JqThis).find('.sl-scrollbar-x-rail');//获取水平滚动条路
			var scrollbarX=$(options.JqThis).find('.sl-scrollbar-x');//获取水平滚动条块
			$(railX).mousewheel(function(event,delta){ //event：时间，delta：方向 -1向下 1向上
				var leftValue=parseInt($(scrollbarX).css("left"));//当前的left值
				if(delta=="-1"){
					leftValue+=8;
				}else if(delta=="1"){
					leftValue-=8;
				}
				if(leftValue>=0&&(leftValue + options.mouseWheelPixels)<=options.parentWidth){
					// 算法！限制滚动条超出范围
					methods.setScrollBar(scrollbarX,'left',leftValue,options,false);//设置滚动条
				}
			
			});
		},//给滚动条绑定鼠标滚轮事件
		bindMouseDown:function(options){
			var scrollbarX=$(options.JqThis).find('.sl-scrollbar-x');//获取水平滚动条块
			$(scrollbarX).on('mousedown',function(e){
				var nowLeft=parseInt($(scrollbarX).css("left"));//当前的left值
				var nowX=e.pageX;//当前鼠标按下的坐标
				
				$(document).on("mousemove",function(e){
					var leftValue=nowLeft+(e.pageX-nowX);//获取当前滚动的值
					if(leftValue>=0&&(leftValue + options.mouseWheelPixels)<=options.parentWidth){
						// 算法！限制滚动条超出范围
						methods.setScrollBar(scrollbarX,'left',leftValue,options,false);//设置滚动条
					}
					
				});
				e.stopPropagation();
			});
			
			var scrollbarY=$(options.JqThis).find('.sl-scrollbar-y');//获取水平滚动条块
			$(scrollbarY).on('mousedown',function(e){
				var nowTop=parseInt($(scrollbarY).css("top"));//当前的left值
				var nowY=e.pageY;//当前鼠标按下的坐标
				
				$(document).on("mousemove",function(e){
					var topValue=nowTop+(e.pageY-nowY);//获取当前滚动的值
					if(topValue>=0&&(topValue + options.mouseWheelPixels)<=options.parentHeight){
						// 算法！限制滚动条超出范围
						methods.setScrollBar(scrollbarY,'top',topValue,options,false);//设置滚动条
					}
					e.stopPropagation();
				});
			});
			
			$(document).on("mouseup",function(e){
				$(document).off("mousemove");	
				e.stopPropagation();
			});
			
		},//给滚动条绑单击拖拽滚动事件
		
		bindClick:function(options){
			var railX=$(options.JqThis).find('.sl-scrollbar-x-rail');//获取水平滚动条路
			var scrollbarX=$(options.JqThis).find('.sl-scrollbar-x');//获取水平滚动条块
			$(railX).on('click',function(e){
				var nowLeft=parseInt($(railX).offset().left);//获取水平滚动条路的left值
				var leftValue=e.pageX-nowLeft-(options.mouseWheelPixels/2);//获取当前滚动的值
				var barLeft=parseInt($(scrollbarX).offset().left)//获取滚动条块的left值
				if(e.pageX>=barLeft&&e.pageX<=(barLeft+options.mouseWheelPixels)){
					return false;//如果点击在滚动条块身上不起作用
				}
				if(leftValue<0){
					leftValue=0;//当滚动
				}else if(leftValue>=(options.parentWidth-options.mouseWheelPixels)){
					leftValue=options.parentWidth-options.mouseWheelPixels;
				}
				methods.setScrollBar(scrollbarX,'left',leftValue,options,true);//设置滚动条
				e.stopPropagation();
			});
			
			var railY=$(options.JqThis).find('.sl-scrollbar-y-rail');//获取水平滚动条路
			var scrollbarY=$(options.JqThis).find('.sl-scrollbar-y');//获取水平滚动条块
			$(railY).on('click',function(e){
				var nowTop=parseInt($(railY).offset().top);//获取水平滚动条路的top值
				var topValue=e.pageY-nowTop-(options.mouseWheelPixels/2);//获取当前滚动的值
				var barTop=parseInt($(scrollbarY).offset().top)//获取滚动条块的top值
				if(e.pageY>=barTop&&e.pageY<=(barTop+options.mouseWheelPixels)){
					return false;//如果点击在滚动条块身上不起作用
				}
				if(topValue<0){
					topValue=0;//当滚动
				}else if(topValue>=(options.parentHeight-options.mouseWheelPixels)){
					topValue=options.parentHeight-options.mouseWheelPixels;
				}
				methods.setScrollBar(scrollbarY,'top',topValue,options,true);//设置滚动条
				e.stopPropagation();
			});
			
			
		},//给滚动条绑定单击事件
		bindHover:function(options){
			var railX=$(options.JqThis).find('.sl-scrollbar-x-rail');//获取水平滚动条路
			var railY=$(options.JqThis).find('.sl-scrollbar-y-rail');//获取垂直滚动条路

			$(railX).hover(function(e){
				$(this).css('zIndex',11);
				$(railY).css('zIndex',10);
				
				e.stopPropagation();
			});
			$(railY).hover(function(e){
				$(this).css('zIndex',11);
				$(railX).css('zIndex',10);
				
				e.stopPropagation();
			});
			
			
		},//给滚动条绑定hover事件
		scrollContent:function(options,value,direction,animation){
			//算法！拖到滚动条需要滚动多少内容
			if(direction=="left"){
				var hideContent=options.scrollWidth-options.parentWidth;//隐藏的内容
				var leftX= hideContent/(options.parentWidth-options.mouseWheelPixels);//隐藏内容除以滚动条宽度
		    	var size=parseInt(value*leftX);//每次移动像素	
		    	if(size<-10){
		    		size=0//当距离小于10的时候，直接为0
		    	}else if((hideContent-size)<20){
		    		size=hideContent+(options.verticalScroll?options.scrolHeight:0);//当距离接近最大值的时候，直接为最大值 添加14px 是滚去条的宽度
		    	}
		    	if(animation){
		    		$(options.scrollBox).animate({'left':size*-1+'px'},options.speed);//设置滚动距离
		    	}else{
		    		$(options.scrollBox).css({'left':size*-1+'px'});//设置滚动距离 
		    	}
				
			}else if(direction=="top"){
				var hideContent=options.scrollHeight-options.parentHeight;//隐藏的内容
				var topX= hideContent/(options.parentHeight-options.mouseWheelPixels);//隐藏内容除以滚动条宽度
		    	var size=parseInt(value*topX);//每次移动像素	
		    	if(size<-10){
		    		size=0//当距离小于10的时候，直接为0
		    	}else if((hideContent-size)<20){
		    		size=hideContent+(options.horizontalScroll?options.scrolHeight:0);//当距离接近最大值的时候，直接为最大值 直接为最大值 添加14px 是滚去条的宽度
		    	}
		    	if(animation){
		    		$(options.scrollBox).animate({'top':size*-1+'px'},options.speed);//设置滚动距离
		    	}else{
		    		$(options.scrollBox).css({'top':size*-1+'px'});//设置滚动距离 
		    	}
			} 
			
		},//绑定滚动的内容犯法
		setScrollBar:function(ele,direction,value,options,animation){//animation：是否动画，ele:滚动的元素，direction:滚动方向,value:数值
			if(direction=="left"){
				
				if(animation){
					$(ele).animate({'left':value+'px'});
					methods.scrollContent(options,value,'left',true);//滚动条块在拖到时候调用内容滚动方法
				}else{
					$(ele).css({'left':value+'px'});
					methods.scrollContent(options,value,'left',false);//滚动条块在拖到时候调用内容滚动方法
				}
				
			}else if(direction=="top"){
				
				
				if(animation){
					$(ele).animate({'top':value+'px'});
					methods.scrollContent(options,value,'top',true);//滚动条块在拖到时候调用内容滚动方法
				}else{
					$(ele).css({'top':value+'px'});
					methods.scrollContent(options,value,'top',false);//滚动条块在拖到时候调用内容滚动方法
				}
			}
		},//设置滚动条距离
		setDistance:function(options){
			
			
			if(options.distanceX){
				//手动设置水平滚动条的距离
				
				var scrollbarX=$(options.JqThis).find('.sl-scrollbar-x');//获取水平滚动条块
				var leftValue=options.distanceX;
				
				if(leftValue>=0&&(parseInt(leftValue) + parseInt(options.mouseWheelPixels))<=options.parentWidth){
					// 算法！限制滚动条超出范围
					methods.setScrollBar(scrollbarX,'left',leftValue,options,false);//设置滚动条
				}
				
			}
			
			if(options.distanceY){
				//手动设置垂直滚动条的距离
				
				var scrollbarY=$(options.JqThis).find('.sl-scrollbar-y');//获取垂直滚动条块
				var TopValue=options.distanceY;
				
				if(TopValue>=0&&(parseInt(TopValue) + parseInt(options.mouseWheelPixels))<=options.parentHeight){
					// 算法！限制滚动条超出范围
					methods.setScrollBar(scrollbarY,'top',TopValue,options,false);//设置滚动条
				}
				
			}
		},//手动设置滚动条的距离
		update:function(options){
			configure.JqThis=this;
			options = $.extend(true,configure, options);//合并对象
			options.scrollBox=$(this).find('.'+options.scrollName);//获取滚动的对象
			options.parentWidth=$(this).width();//获取外围宽度
			options.parentHeight=$(this).height();//获取外围高度
			options.scrollWidth=$(options.scrollBox).width();//获取滚动对象宽度
			options.scrollHeight=$(options.scrollBox).outerHeight();//获取滚动对象高度
			
			if(options.mouseWheelPixels=="auto"){
					//自动生成滚动条块的宽度
					options.mouseWheelPixels=parseInt(options.parentWidth/5); 
					
				}
			if(options.horizontalScroll&&options.scrollWidth>options.parentWidth){
				//生成水平滚动条
				$(this).append('<div class="sl-scrollbar-x-rail"><div class="sl-scrollbar-x" style="width:'+options.mouseWheelPixels+'px"></div></div>');
				//给滚动的内容添加值
				$(this).find('.'+options.scrollName).css({'position':'absolute','left':'0'});
			}
			if(options.verticalScroll&&options.scrollHeight>options.parentHeight){
				//生成垂直滚动条
				$(this).append('<div class="sl-scrollbar-y-rail"><div class="sl-scrollbar-y" style="height:'+options.mouseWheelPixels+'px"></div></div>');
				//给滚动的内容添加值
				$(this).find('.'+options.scrollName).css({'position':'absolute','top':'0'});
			}
			
			if(!options.scrollWidth||!options.scrollHeight){
				console.log(options);
				console.log("没有获取到滚动条的宽高");
				
				return false;//证明没有获取到滚动内容的宽度和高度
			}
				
			methods.setDistance(options);//初始化手动设置滚动条距离
			methods.bindMouseWheel(options);//给滚动条快绑定鼠标滚动事件
			methods.bindMouseDown(options);//给滚动条快绑定鼠标按下拖拽事件
			methods.bindClick(options);//给滚动条路绑定单击事件
			methods.bindHover(options);//给滚动条路绑定hover事件
			return this.each(function() {
				
			});
		},//更新控件
	}

})(jQuery);



/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.12
 *
 * Requires: jQuery 1.2.2+
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));
