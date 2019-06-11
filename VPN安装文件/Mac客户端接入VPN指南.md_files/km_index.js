nie.config.copyRight.setWhite();
var setSlideInterface;
jQuery(function () {
	var close;
    //2秒后播放下拉动画
	setTimeout(function(){
		jQuery("#banner_big_area").height(0).show().animate({height:"450px"},1000);
	},2000);

	jQuery("#banner_big_close").click(function(){
		clearTimeout(close);
		jQuery("#banner_side").css("top",jQuery(window).scrollTop()+jQuery(window).height()-190);
		jQuery("#banner_big_area").stop(true,true).animate({height:"0px"},1000);
		jQuery("#banner_side").stop(true,true).fadeIn();
	});
	
	jQuery("#banner_side").click(function(){
		clearTimeout(close);
		jQuery("#banner_side").hide();
		jQuery("html,body").scrollTop(0);
		jQuery("#banner_big_area").stop(true,true).animate({height:"450px"},1000);
	}).click();
	
	jQuery(window).scroll(function(){
		jQuery("#banner_side").css("top",jQuery(window).scrollTop()+jQuery(window).height()-190);
	});
	
    //11秒后播放上拉动画
	close = setTimeout(function(){
		jQuery("#banner_big_close").click();
	},8000);
	
	function switchBoxSet(){
		var sn = jQuery(".switch-nav");
		var sna = sn.find("a");
		//sn.css({padding:("0 "+((330 - 22*sna.length)/2)+"px")});
		sn.css({padding:("0 "+((sn.parent().width() - 22*sna.length)/2)+"px")});

		var sp = jQuery(".switch-pic");
		//sp.css({opacity:0});
		//sp.eq(0).css({opacity:1});
		sp.parent().hide();
		sp.parent().eq(0).show();
		sna.eq(0).addClass("current");

		function switchBoxAutoPlay(){
			jQuery(".switch-box .progressBar").animate({width:"330px"}, 5000, "linear", function(){
				var next = jQuery(".switch-nav .current").next();
				if(next.length==0) next=jQuery(".switch-nav a").eq(0);

				switchBoxUpdate(next);
			});
		}
		
		function switchBoxUpdate(next){
			var old = jQuery(".switch-nav .current");
			old.removeClass("current");
			next.addClass("current");

			var sna = jQuery(".switch-nav a");
			var sp = jQuery(".switch-pic");
			
			//sp.eq(sna.index(old)).css({opacity:0});
			//sp.eq(sna.index(next)).css({opacity:1});
			sp.eq(sna.index(old)).parent().hide();
			sp.eq(sna.index(next)).parent().show();
			jQuery(".switch-box .progressBar").animate({width:"0px"},function(){ switchBoxAutoPlay(); });
		}
		switchBoxAutoPlay();
			
		sna.mouseover(function(){
			jQuery(".switch-box .progressBar").stop();
			switchBoxUpdate(jQuery(this));
		});
	}

	switchBoxSet();
	
	jQuery("#navGuideDetail a").click(function(){
		var ng = jQuery(".navGuide");
		var ngd = jQuery(this);
		var nga = ng.find("a");
			ng.stop();
			nga.stop();
		if(ng.css("height")=="15px"){
			ngd.css("background-position","-30px 0");
			ng.animate({height:"202px"});
		}else{
			ngd.css("background-position","0px 0");
			ng.animate({height:"15px"});
		}
	});	
	
	function topBarFixed(){
		var topB = jQuery(".navTop");
		if(topB.css("position")=="fixed") return;
		var st = jQuery(window).scrollTop();
		topB.css({top:st});
	}
	
	function sideBarFixed(){
		var sideB = jQuery("#sideB");
		var st = jQuery(window).scrollTop();
		sideB.stop(true,true);
		if(st>5) sideB.fadeIn();
		else sideB.fadeOut();

		var sideBar = jQuery(".sideBar");
		sideBar.stop(true,true);
		//sideBar.animate({top:(st+jQuery(window).height()-230)});
		sideBar.css({top:(st+jQuery(window).height()-230)});
		
		if (typeof(window.inContentWidescreen) == 'undefined' || !window.inContentWidescreen) {
			sideBar.css({right:(jQuery(window).width() - jQuery('.main').width()) / 2 - sideBar.width() - 20});
		}
	}
	jQuery(document).ready(function(){topBarFixed();sideBarFixed();});
	jQuery(window).scroll( function(){topBarFixed();sideBarFixed();});
	jQuery(window).resize( function(){topBarFixed();sideBarFixed();});
	jQuery("#sideB").click(function(){
		jQuery('html,body').animate({scrollTop:0});
    });
	
	/*jQuery(".box ul li a").mouseover(function(){
		jQuery(this).delay(200).animate({paddingLeft:"10px"});
	});
	jQuery(".box ul li a").mouseout(function(){
		jQuery(this).stop().animate({paddingLeft:"0px"});
	});*/

	jQuery(".row4 .col2 li a").mouseenter(function(){
		var exp = jQuery(this).find(".expText");
		exp.stop(true).animate({bottom:"50px"});
	});
	jQuery(".row4 .col2 li a").mouseleave(function(){
		var exp = jQuery(this).find(".expText");
		exp.stop(true).animate({bottom:"30px"});
	});

	jQuery(".navSubKMCell").mouseenter(function(){
		var pl = jQuery(this).index() * jQuery(this).width();
		pl=1100-600-pl;
		if(pl>0) pl=0;
		jQuery(this).find("ul").css({display:"block",left:pl});
		jQuery(this).find(".navSubTop").addClass("on");
	});
	jQuery(".navSubKMCell").mouseleave(function(){
		jQuery(this).find("ul").css("display","none");
		jQuery(this).find(".navSubTop").removeClass("on");
	});

	setSlideInterface =  function setSlide(type,hitArea,container){
		target = jQuery(type);
		hitArea = jQuery(hitArea);
		container = jQuery(container);
		var sv;
		var ev;
		switch(type){
			case ".userInfo":
			children = container.find("a");
			sv = {height:0};
			ev = {height:container.height()};
			break;

			case ".selectBox":
			children = container.find("li");
			sv = {height:0};
			ev = {height:container.height()};
			break;

			default:
			alert("unsupported type");
		}
		container.height(0);
		hitArea.click(function(){
			if(parseInt(container.css("height"))==sv.height){
			//if(container.css("height")==sv.height+"px"){
				container.stop(true).css({display:"block"}).animate(ev);
			}else{
				container.stop(true).animate(sv,function(){container.css({display:"none"});});
			}
		});
		target.mouseleave(function(){
			container.stop(true).animate(sv,function(){container.css({display:"none"});});
		});
	}
	jQuery(".selectBox ul a").click(function(){
		jQuery(".selectBox .selected span").html(jQuery(this).html());
		var container = jQuery(".selectBox ul");
		container.stop(true).animate({height:0},function(){container.css({display:"none"});});
	});
	
	setSelectBoxSlide();
	
	var r4I = setInterval(r4Next, 5000);
	var r2I = setInterval(r2Next, 5000);

	jQuery("#switchContainer").ready(function(){
		var pr = jQuery(".row4 .col2 ul");
		var len = pr.length;
		for(var i=0; i<len; ++i) {
			pr.eq(i).attr("index",(i+1));
			pr.eq(i).css({left:0});
			pr.eq(i).find("li").eq(0).css("margin-left","0");
		}
		jQuery("#switchContainer .switch p").html("1/"+len);
		pr.eq(0).css("display","block");
	});
	jQuery("#switchContainer .switch .switchRight").click(function(){
		clearInterval(r4I);
		r4I = setInterval(r4Next, 6000);
		r4Next();
	});
	jQuery("#switchContainer .switch .switchLeft").click(function(){
		r4Prev();
	});

	jQuery(".row2 .col1 .imageFrameLong").ready(function(){
		var pr = jQuery(".row2 .col1 .imageFrameLong dl");
		var len = pr.length;
		for(var i=0; i<len; ++i) {
			pr.eq(i).attr("index",(i+1));
		}
		jQuery(".row2 .col1 .switch p").html("1/"+len);
		pr.css({display:"none"});
		pr.eq(0).css({display:"block"});
	});
	jQuery(".row2 .col1 .switch .switchLeft").click(function(){
		r2Prev();
	});
	jQuery(".row2 .col1 .switch .switchRight").click(function(){
		clearInterval(r2I);
		r2I = setInterval(r2Next, 6000);
		r2Next();
	});

	function r2Next(){
		var pr = jQuery(".row2 .col1 .imageFrameLong dl");
		if(pr.length<=1) return;
		var now = pr.eq(0);
		var next = pr.eq(1);
		pr.css({display:"none"});
		next.css({left:"0px",display:"block"});
		now.css({left:"-740px",display:"block"});
		now.appendTo(jQuery(".row2 .col1 .imageFrameLong ul"));
		jQuery(".row2 .col1 .switch p").html(next.attr("index")+"/"+pr.length);
		jQuery(".row2 .col1 .imageFrameLong ul").stop().css({left:"740px"}).animate({left:"0px"});
	}
	function r2Prev(){
		var pr = jQuery(".row2 .col1 .imageFrameLong dl");
		if(pr.length<=1) return;
		var now = pr.eq(0);
		var next = pr.eq(pr.length-1);
		pr.css({display:"none"});
		next.css({left:"0px",display:"block"});
		now.css({left:"740px",display:"block"});
		next.prependTo(jQuery(".row2 .col1 .imageFrameLong ul"));
		jQuery(".row2 .col1 .switch p").html(next.attr("index")+"/"+pr.length);
		jQuery(".row2 .col1 .imageFrameLong ul").stop().css({left:"-740px"}).animate({left:"0px"});
	}
	function r4Next(){
		var pr = jQuery(".row4 .col2 ul");
		if(pr.length<=1) return;
		var now = pr.eq(0);
		var next = pr.eq(1);

		pr.css({display:"none"});
		now.css({display:"block",left:"-935px"});
		next.css({display:"block",left:"0px"});
		now.appendTo(jQuery(".row4 .col2 .picBoxCon"));
		jQuery("#switchContainer .switch p").html(next.attr("index")+"/"+pr.length);
		jQuery(".row4 .col2 .picBoxCon").stop().css({left:"935px"}).animate({left:"0px"});
	}
	function r4Prev(){
		var pr = jQuery(".row4 .col2 ul");
		if(pr.length<=1) return;
		var now = pr.eq(0);
		var next = pr.eq(pr.length-1);

		pr.css({display:"none"});
		now.css({display:"block",left:"935px"});
		next.css({display:"block",left:"0px"});
		next.prependTo(jQuery(".row4 .col2 .picBoxCon"));
		jQuery("#switchContainer .switch p").html(next.attr("index")+"/"+pr.length);
		jQuery(".row4 .col2 .picBoxCon").stop().css({left:"-935px"}).animate({left:"0px"});
	}

	jQuery(".navKMCom").ready(function(){
		var id = jQuery(".navKMCom.on").index();
		var con = jQuery(".navSubKMContainer");
		con.hide();
		con.eq(id).show();
	});
	// jQuery(".navKMCom").mouseenter(function(){
		// var id = jQuery(this).index();
		// var con = jQuery(".navSubKMContainer");
		// con.hide();
		// con.eq(id).show();
	// });
	// jQuery(".imageFrame").ready(function(){
		// var sp = jQuery(".imageFrame a span");
		// var len = sp.length;
		// for(var i=0; i<len; ++i){
			// var s = sp.eq(i);
			// var line = s.find("br").length + 1;
			// s.css("padding",((150-line*30)>>1)+"px 0");
		// }
	// });
	(function (){
		var s = jQuery(".imageFrame a span");
		for(var i=0,len=s.length; i<len; ++i){
			var si = s.eq(i);
			si.css("padding",((si.parent().height()-si.height())>>1)+"px 0");
		}
	})();
	
	setTimeout('update_footer_nie_image()', 300);
	
	
	
	//一级导航
	var height;
	if(jQuery(".navSystem_inner").find("a").length>7){
		var length = jQuery(".navSystem_inner").find("a").length;
		var html='<a href="javascript:void(0)" class="navSystem_more">更多<i></i></a>';
		jQuery(".navSystem_inner").find("a").eq(5).after(html);
		for(var i= 7;i<=length;i++){
			jQuery(".navSystem_inner").find("a").eq(i).appendTo(jQuery(".more_panel"));
		}
		height = jQuery(".more_panel").height();
		jQuery(".more_panel").height("0");
		var jQuerya=jQuery(".more_panel").find("a");
		jQuery.each(jQuerya,function(i,val){
			if(jQuery(val).hasClass("on")){
				jQuery(".navSystem_more").addClass("on");
			}
		});
	}
	jQuery(".navSystem_more").mouseover(function(){
		jQuery(".navSystem_more").addClass("hover");
		jQuery(".more_panel").stop().animate({"height":height},600);
	}).mouseout(function(){
		jQuery(".more_panel").stop().animate({"height":0},600);
		jQuery(".navSystem_more").removeClass("hover");	
	})
	jQuery(".more_panel").mouseenter(function(){
		if(!jQuery(".navSystem_more").hasClass("hover")){
			jQuery(".navSystem_more").addClass("hover");
		}
		jQuery(".more_panel").stop().animate({"height":height},600);
	}).mouseleave(function(){
		jQuery(".navSystem_more").removeClass("hover");
		jQuery(".more_panel").stop().animate({"height":0},600);
	})
	
	
	
	
	//梦幻一级导航
	var height1;
	if(jQuery(".main_nav_inner").find("a").length>7){
		var length = jQuery(".main_nav_inner").find("a").length;
		var html='<a href="javascript:void(0)" class="mainNav_more">更多<i></i></a>';
		jQuery(".main_nav_inner").find("a").eq(5).after(html);
		for(var i= length;i>=7;i--){
			jQuery(".main_nav_inner").find("a").eq(i).appendTo(jQuery(".moreNav_panel"));
		}
		height1 = jQuery(".moreNav_panel").height();
		jQuery(".moreNav_panel").height("0");
		var jQuerya=jQuery(".moreNav_panel").find("a");
		jQuery.each(jQuerya,function(i,val){
			if(jQuery(val).hasClass("current")){
				jQuery(".mainNav_more").addClass("current");
			}
		});
		var $main_nav_inner = jQuery(".main_nav_inner");
		var $moreNav_panel_training = jQuery(".moreNav_panel_training");
		if($main_nav_inner && $moreNav_panel_training){
		    $moreNav_panel_training.css("left",$main_nav_inner.width()+12);
		}
	}
	jQuery(".mainNav_more").mouseover(function(){
		jQuery(".mainNav_more").addClass("hover");
		jQuery(".moreNav_panel").stop().animate({"height":height1},600);
	}).mouseout(function(){
		jQuery(".moreNav_panel").stop().animate({"height":0},600);
		jQuery(".mainNav_more").removeClass("hover");	
	})
	jQuery(".moreNav_panel").mouseenter(function(){
		if(!jQuery(".mainNav_more").hasClass("hover")){
			jQuery(".mainNav_more").addClass("hover");
		}
		jQuery(".moreNav_panel").stop().animate({"height":height1},600);
	}).mouseleave(function(){
		jQuery(".mainNav_more").removeClass("hover");
		jQuery(".moreNav_panel").stop().animate({"height":0},600);
	})
});
function update_footer_nie_image(){
	jQuery('#NIE-copyRight-corp').find('span').first().find('a').eq(1).css('width', '140px')
}

function setUserInfoSlide(){
	//setSlideInterface(".userInfo",".userInfo .userInfoMore",".userInfo .userInfoDetail");
	setSlideInterface(".userInfo",".userInfo",".userInfo .userInfoDetail");
}
function setSelectBoxSlide(){
	setSlideInterface(".selectBox",".selectBox .selected",".selectBox ul");
}

function profile_search_jquery_ajax(update_id, url, profile_id, query, f_parent_type, order_by){
		jQuery.ajax({
                url: url,   // 提交的页面
                type: "GET",           
                dataType: 'html', 
                data: { profile_id: profile_id, query: query, facet: {f_parent_type: f_parent_type}, order_by: order_by },       
                error: function(request) {      
                    alert("search error!");
                },
                success: function(html) {
                    jQuery("#"+update_id).html(html);
               }
		});   	    	
}

function jquery_get_ajax(url, update_id){
    jQuery.ajax({
        url: url,   // 提交的页面
        type: "GET",           
        dataType: 'html',        
        error: function(request) {      
            alert("出错，请稍候再试");
        },
        success: function(html) {
            jQuery("#"+update_id).html(html);
        }
    });  
}

function jquery_post_ajax(url, update_id, my_form_id){
     var my_form = document.getElementById(my_form_id);
     jQuery.ajax({
                        url: url,   // 提交的页面
                        data: jQuery(my_form).serialize(), // 从表单中获取数据
                        type: "POST",   
                        dataType: 'html',                  
                        error: function(request) {      // 设置表单提交出错
                            alert("xhr error!");
                        },
                        success: function(html) {
                            jQuery("#"+update_id).html(html);
                        }
     });            
}

function open_app_code(){
	if(jQuery('#article_textarea').size() > 0){
		var left = jQuery('#index_show_app_code').offset().left;
		jQuery('#index_app_code').css('left', left).show();
		jQuery('#index_app_code').css('top', '56px');
	}
	else{
		var width = jQuery(document).width();
		var left = jQuery('#index_show_app_code').offset().left - (width - 1100) / 2;
		jQuery('#index_app_code').css('left', left).show();
	}
}
function close_app_code(){
	jQuery('#index_app_code').hide();
}

/**禁止复制js开始**/
function disableSelectContent(eid){
    //不允许全选
    var disableSelectionTarget = document.getElementById(eid);
    if(disableSelectionTarget){
        document.onkeydown=function(){
            if(event.ctrlKey && event.keyCode==65)  {  
                window.event.returnValue=false;  
                return false;
            }
        }
        if(document.selection){
            disableSelectionTarget.onmouseup =function(){
                document.selection.empty();
            };
            disableSelectionTarget.onmouseover =function(){
                document.selection.empty();
            };
            document.onmouseup = function(){
                var htmlRangetxt = document.selection.createRange().htmlText;
                if(htmlRangetxt.indexOf("unselectable") >= 0){
                    document.selection.empty();
                }
            };

        }else{
            if (navigator.userAgent.indexOf("Firefox") <= -1 && navigator.userAgent.indexOf("Chrome") <= -1 && navigator.userAgent.indexOf("Safari") <= -1) {
                document.onselectstart=function(){return false};  
            }
        }
    }
    
}

function undisableSelectContent(eid){
    //解除禁止
    var disableSelectionTarget = document.getElementById(eid);
    if(disableSelectionTarget){
        document.onkeydown=null;
        if(document.selection){
            disableSelectionTarget.onmouseup=null;
            disableSelectionTarget.onmouseover=null;
            document.onmouseup = null;
        }else{
            if (navigator.userAgent.indexOf("Firefox") <= -1 && navigator.userAgent.indexOf("Chrome") <= -1 && navigator.userAgent.indexOf("Safari") <= -1) {
                document.onselectstart=null;
            }
        }
    }
}
/**禁止复制js结束**/