// controls the display of the login/logout stuff
jQuery(function($) {
  	jQuery.ajaxSetup({cache: false});
  	jQuery.getJSON('/account/user_data', function userDataCallBack(data) {
    	if (data.login) {
      		// logged in
      		loggedInDataCallBack(data);
      		addManageEnterprisesToOldStyleMenu(data);
      		setUserInfoSlide();
   	 	} else {
      		// not logged in
      		document.getElementById('logged-in').style.display = "none";
      		jQuery('#not-logged').fadeIn();
    	}
  	});
  
  	function loggedInDataCallBack(data) {
		// logged in
		jQuery("#logged-user-name").empty();
		jQuery("#logged-user-name").append(data.name);
		jQuery("<a class='link_style2' href='/profile/" + data.login + "' target='_blank'>个人主页</a>").insertBefore("#controllpanel-link");
		jQuery("#controllpanel-link").attr("href", "/myprofile/"+data.login);
		jQuery("#controllpanel-link").attr("target", "_blank");
		if(data.is_admin){
			jQuery("<a id='admin-link' class='link_style2' href='/admin' target='_blank'>管理员面板</a>").insertAfter("#controllpanel-link");
		}
  	}

  	function addManageEnterprisesToOldStyleMenu(data) {
	    var enterprises = data.enterprises;
	    var enterprises_len = data.enterprises.length;
	    var enterprises_str = "";
	    var host = window.location.host;
	    if(enterprises_len > 0){
	    	for(var i=0; i<enterprises_len; i++){
	    		if(host.indexOf("km.netease.com")>-1 && enterprises[i].identifier=="xyq_studio"){
	    			enterprises_str += "<a class='link_style2' href='http://xyq.km.netease.com' target='_blank'>" + enterprises[i].name + "</a>";
	    		//}else if(enterprises[i].identifier=="lgm"){
	    		//	enterprises_str += "<a class='link_style2' href='/lgm_km/index' target='_blank'>" + enterprises[i].name + "</a>";
	    		}else if(enterprises[i].identifier=="marketing_website"){
	    			enterprises_str += "<a class='link_style2' href='/web_km/index' target='_blank'>" + enterprises[i].name + "</a>";
	    		}else{
	    			enterprises_str += "<a class='link_style2' href='/" + enterprises[i].identifier + "' target='_blank'>" + enterprises[i].name + "</a>";
	    		}
	    		
	    	}
	    	jQuery(enterprises_str).insertAfter("#org-hr");
	    }
	    jQuery("<a class='link_style2' href='/profile/" + data.login + "/communities' target='_blank'>我的圈子</a>").insertAfter("#com-hr");
	    jQuery("#star").attr("href", "/myprofile/"+data.login+"/tasks");
	    jQuery("#star").attr("target", "_blank");
	    jQuery("#message").attr("href", "/myprofile/"+data.login+"/notices");
	    jQuery("#message-link").attr("target", "_blank");
	    if(data.pending_tasks_count>0){
	    	jQuery("#pending-tasks-count").empty();
	    	jQuery("#pending-tasks-count").append(data.pending_tasks_count);
	    	jQuery("#pending-tasks-count").attr("class", "on");
	    }
	    if(data.pending_notice_tips_count>0){
	    	jQuery("#pending-notices-tips-count").empty();
	    	jQuery("#pending-notices-tips-count").append(data.pending_notice_tips_count);
	    	jQuery("#pending-notices-tips-count").attr("class", "on");
	    }   
  	}
  	//调整查看页右侧页面灰色背景高度
  	jQuery("#center .rowYtxList .rightGreyBackground").height(jQuery("#center .rowYtxList").height());
  	jQuery("#articleText img").load(function(){jQuery("#center .rowYtxList .rightGreyBackground").height(jQuery("#center .rowYtxList").height());});
		  
});	 

function display_notice(message) {
   var $noticeBox = jQuery('<div id="notice"></div>').html(message).appendTo('body').fadeTo('fast', 0.8);
   $noticeBox.click(function() { jQuery(this).hide(); });
   setTimeout(function() { $noticeBox.fadeOut('fast'); }, 5000);
}

function set_search_type(value){
	document.getElementById("kp_search_parent_type").value = value;
}

function set_query(value){
	document.getElementById("kp_search_input").value = value;
}

function kp_search_submit(error_msg){
	var kp_search_form = document.getElementById("kp_search_form");
    var kp_search_parent_type = document.getElementById("kp_search_parent_type");
    var kp_search_select_parent = document.getElementById("kp_search_select_parent");
    var kp_search_input = document.getElementById("kp_search_input");
    if(kp_search_input.value.replace(/\s+$|^\s+/g,"")==""){
    	alert(error_msg);
    	return false
    }
    if (kp_search_parent_type.value==""){
    	kp_search_parent_type.name = "";
    }
    kp_search_form.submit();
}

function updateURLParameter(url, param, paramVal){
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        additionalURL = encodeURI(additionalURL);
        tempArray = additionalURL.split("&");
        for (i=0; i<tempArray.length; i++){
        	var tempArrayName = tempArray[i].split('=')[0];
            if( !(decodeURI(tempArrayName) == decodeURI(param) || tempArrayName == "page") ){
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }

        }
    }

    var rows_txt = temp + "" + param + "=" + encodeURIComponent(paramVal);
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

function removeURLParameter(url, replaceValue, isReplaceAll){
	var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (i=0; i<tempArray.length; i++){
            if(isReplaceAll){
            	var tempArrayName = tempArray[i].split('=')[0];
            	if(!(decodeURI(tempArrayName) == decodeURI(replaceValue) || tempArrayName == "page") ){
                   newAdditionalURL += temp + tempArray[i];
                   temp = "&";
                }
            }else{
            	var tempArrayName = tempArray[i];
            	if(!(decodeURI(tempArrayName).replace(/%2B/g,"+")== decodeURI(replaceValue) || tempArrayName.split('=')[0] == "page" )){
	            	newAdditionalURL += temp + tempArray[i];
	            	temp = "&";
	            }
            }
        }
    }
    return baseURL + "?" + newAdditionalURL;
}

jQuery(document).ready(function(){		  	
  	jQuery('.post_entrance').live('click', function() {
		if(jQuery(this).attr('href')){
		  	jQuery.fn.colorbox({
		    	href: jQuery(this).attr('href')
		    });
		}
	    return false;
	});
  	jQuery('.report-abuse-action').live('click', function() {
    	if(jQuery(this).attr('href')){
	      	jQuery.fn.colorbox({
	        	href: jQuery(this).attr('href'),
	        	innerHeight: '300px',
	        	innerWidth: '445px'
	      	});
	    }
	    return false;
  	});
});
 
//最新评论和精彩评论样式调整
jQuery(".listNav .item").live("click",function(){
	jQuery(this).parent().find(".on").first().removeClass("on");
	jQuery(this).addClass("on");
});
