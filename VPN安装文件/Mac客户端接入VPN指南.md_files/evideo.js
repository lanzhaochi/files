var km={
    tab:function(tab,con,left,right,events){
        var $tab =jQuery(tab),
        $con = jQuery(con),
        $left = jQuery(left),
        $right = jQuery(right)
        var num = 0;
        var tabgo = function(num){
            $tab.removeClass("current")
            $tab.eq(num).addClass("current")
            $con.removeClass("current")
            $con.eq(num).addClass("current")
        }
        tabgo(num)
        $left.click(function(){
            num-=1
            if(num <0){
                num = $tab.length-1
            }
            tabgo(num)
        })
        $right.click(function(){
            num+=1
            if(num >= $tab.length){
                num = 0
            }
            tabgo(num)
        })
        var tabchange
        if(events == "click"){
            $tab.each(function(i){
                jQuery(this).click(function(){
                    num = i
                    tabgo(num) 
                })
            })
        }
        else{
            $tab.each(function(i){
                jQuery(this).hover(function(){
                    tabchange = setInterval(function(){
                        num = i
                        tabgo(num) 
                    },200)
                },function(){
                    clearInterval(tabchange)
                })
            })
        }
    },
    vdes:function(){
        jQuery("#showvdes").click(function(){
            if(jQuery(this).html()=="展开全部"){
                jQuery(this).html("收起全部")
                jQuery("#vdes").removeClass("currento").addClass("current")
            }
            else{
                jQuery(this).html("展开全部")
                jQuery("#vdes").removeClass("current").addClass("currento")
            }
        })
    },
    btns:function(obj,txt1,txt2,txt3,txt4){/*对象,默认文字,默认文字鼠标经过，选中文字，选中文字鼠标经过*/
        jQuery(obj).mouseover(function(){
            if(jQuery(this).children(".sTxt").html()==txt1 && jQuery(this).attr("class").indexOf("aBtn_current") <0){
                jQuery(this).children(".sTxt").html(txt2)
            }
            else{
                jQuery(this).children(".sTxt").html(txt4)
            }
        }).mouseout(function(){
            if(jQuery(this).children(".sTxt").html()==txt2){
                jQuery(this).children(".sTxt").html(txt1)
            }
            else{
                jQuery(this).children(".sTxt").html(txt3)
            }
        })
    },
    btns1:function(obj,txt1,txt2){/*对象,默认文字,默认文字鼠标经过*/
        jQuery(obj).mouseover(function(){
            jQuery(this).children(".sTxt").html(txt2)
        }).mouseout(function(){
            jQuery(this).children(".sTxt").html(txt1)
        })
    },
    backchannellist:function(){
        jQuery("#back-channellist li").hover(function(){
            jQuery(this).children(".sExp").show()
        },function(){
            jQuery(this).children(".sExp").hide()
        })
        jQuery("#back-channellist .sShow .emIcon").each(function(i){
            jQuery(this).click(function(){
                if(jQuery(this).attr("class").indexOf("emIcon_1") > -1){
                    jQuery(this).removeClass("emIcon_1")
                    jQuery("#back-channellist .liList").eq(i).hide()
                }
                else{
                    jQuery(this).addClass("emIcon_1")
                    jQuery("#back-channellist .liList").eq(i).show()
                }
            })
        })
    },
    backtabcheck:function(){
        if(jQuery("#back-tabcheck input").length > 0){
            jQuery("#back-tabcheck input").change(function(){
                if(jQuery("#back-tabcheck input")[0].checked){
                    jQuery("#back-tabconcheck").addClass("ulList3Hold")
                    jQuery("#back-tabconcheck input").attr("disabled","disabled")
                }
                else{
                    jQuery("#back-tabconcheck").removeClass("ulList3Hold")
                    jQuery("#back-tabconcheck input").removeAttr("disabled")
                }
            })
            if(jQuery("#back-tabcheck input")[0].checked){
                jQuery("#back-tabconcheck").addClass("ulList3Hold")
                jQuery("#back-tabconcheck input").attr("disabled","disabled")
            }
        }
    },
    opends:function(o){
        if(jQuery("#bgs").length ==0){
            jQuery("body").append('<div id="bgs"></div>')
        }
        var obj = jQuery(o)
        jQuery(".dTc").hide()
        jQuery("#bgs").css({"height":jQuery(document).height()}).show()
        obj.fadeIn().css({"top":(jQuery(window).height()-obj.height())/2+jQuery(window).scrollTop(),"left":(jQuery(window).width()-obj.outerWidth())/2+jQuery(window).scrollLeft()})
    },
    closeds:function (o){
        var obj = jQuery(o)
        obj.hide()
        jQuery("#bgs").hide()
    },
    close:function (link){
        var obj = jQuery(link).parents('.dTc');
        obj.hide()
        jQuery("#bgs").hide()
    }
}

jQuery(function(){
    km.tab("#tab-0 li","#tabcon-0 .con","#tab-0-left","#tab-0-right")
    
    jQuery("#tabcon-v .con").each(function(i){
        var num = i+1
        jQuery("#tab-v").append("<a>"+num+"</a>")
    })
    km.tab("#tab-v a","#tabcon-v .con","#tab-v-left","#tab-v-right","click")
    
    km.vdes()//播放页右侧描述
    
    km.backchannellist()//后台管理_类目管理
    
    km.backtabcheck()
    
    km.btns("#btn-xxs","实习生不可见","标注实习生可见","实习生可见","标注实习生不可见")
    km.btns("#btn-wb","外包不可见","标注外包可见","外包可见","标注外包不可见")
    km.btns("#btn-tj","未推荐","推荐课程","已推荐","取消推荐")
    km.btns(".btn-tj","未推荐","推荐课程","已推荐","取消推荐")
    km.btns("#btn-sc",jQuery("#btn-sc").children(".sTxt").html(),"收藏",jQuery("#btn-sc").children(".sTxt").html(),"取消收藏")
    km.btns1("#btn-sd",jQuery("#btn-sd").children(".sTxt").html(),"写心得")
    
    if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE6.0"){
        jQuery("#login").hover(function(){
            jQuery("#login ul").show()
        },function(){
            jQuery("#login ul").hide()
        })
    }
    
})

