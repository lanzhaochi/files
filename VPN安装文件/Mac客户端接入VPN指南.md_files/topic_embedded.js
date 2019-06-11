
jQuery(document).ready(function(){
	if(typeof(jQuery.fn.colorbox) == 'undefined'){
		jQuery(document).append('<script type="text/javascript" src="/javascripts/colorbox.js"></script>');
	}
  	jQuery('#resource_topic_link').live('click', function() {
		if(jQuery(this).attr('href')){
		  	jQuery.fn.colorbox({
		    	href: jQuery(this).attr('href')
		    });
		}
	    return false;
	});
	jQuery('.resource_website_link').live('click', function() {
		if(jQuery(this).attr('href')){
		  	jQuery.fn.colorbox({
		    	href: jQuery(this).attr('href')
		    });
		}
	    return false;
	});
	if(typeof String.prototype.trim == 'undefined'){
	    String.prototype.trim = function () {
	        return this.replace(/^\s\s*/, '' ).replace(/\s\s*$/, '' );
	    }   
	}
});

function send_div_init(){
	jQuery("#topic_embedded .topic_embedded_choose")[0].checked = 'checked';
	jQuery("#topic_embedded .topic_embedded_new_name").val('');
	jQuery("#topic_embedded .topic_embedded_reason").val('');
}

function topic_resource_send_to_topic_colorbox(item_div_id, resource_id){
	var $item_div = $('#' + item_div_id);
	var resource_type = $item_div.find('.item_resource_type').val();
	var resource_id = $item_div.find('.item_resource_id').val();
	jQuery('#topic_embedded_resource_type').val(resource_type);
	jQuery('#topic_embedded_resource_id').val(resource_id);
	jQuery.fn.colorbox({
    	href: '/topic_ajax/get_send_page'
    });
    return false;
}

function topic_resource_send_to_topic(item_div_id, resource_id){
	var $item_div = $('#' + item_div_id);
	var resource_type = $item_div.find('.item_resource_type').val();
	var resource_id = $item_div.find('.item_resource_id').val();
	jQuery('#topic_embedded_resource_type').val(resource_type);
	jQuery('#topic_embedded_resource_id').val(resource_id);
	resource_send_to_topic();
}

function resource_send_to_topic(){
	if(jQuery('#resource_topic_send_div').html() == ''){
		jQuery('#resource_topic_send_div').load(
			'/topic_ajax/get_send_page',
			'',
			function(){
				layerLoop();
			}
		);
	}
	else{
		layerLoop();
	}
}
function topic_embedded_reload(){
	jQuery('#resource_topic_send_div').load(
		'/topic_ajax/get_send_page',
		''
	);
}
function topic_get_resource_type(){
	return jQuery('#topic_embedded_resource_type').val();
}
function topic_get_resource_id(){
	return jQuery('#topic_embedded_resource_id').val();
}



function topic_embedded_choose_checked(){
	jQuery('#topic_embedded .topic_embedded_choose')[0].checked = 'checked';
	jQuery('#topic_embedded .topic_embedded_new')[0].checked = '';
}
function topic_embedded_new_checked(){
	jQuery('#topic_embedded .topic_embedded_new')[0].checked = 'checked';
	jQuery('#topic_embedded .topic_embedded_choose')[0].checked = '';
}
var topic_embedded_timeout;
function after_success(topic_url, topic_name){
	jQuery('#topic_embedded').hide();
	jQuery('#topic_embedded_succ').show();
	jQuery('#topic_embedded_succ .topic_embedded_topic_link a')[0].href = topic_url;
	jQuery('#topic_embedded_succ .topic_embedded_topic_link a').html('[' + topic_name + ']');
	topic_embedded_timeout = setTimeout('topic_embedded_cancel()', 3000);
}
function after_success2(topic_url){
	jQuery('#topic_embedded').hide();
	jQuery('#topic_embedded_succ2').show();
	topic_embedded_timeout = setTimeout('topic_embedded_cancel()', 3000);
}
function after_fail1(topic_url, topic_name){
	jQuery('#topic_embedded').hide();
	$div = jQuery('#topic_embedded_fail1');
	$div.show();
	$div.find('.topic_embedded_topic_link a')[0].href = topic_url;
	$div.find('.topic_embedded_topic_link a').html('[' + topic_name + ']');
	topic_embedded_timeout = setTimeout('topic_embedded_cancel()', 3000);
}
function after_fail2(topic_url){
	jQuery('#topic_embedded').hide();
	jQuery('#topic_embedded_fail2').show();
	topic_embedded_timeout = setTimeout('topic_embedded_cancel()', 3000);
}
function topic_embedded_submit(){
	var resource_type = topic_get_resource_type();
	var resource_id = topic_get_resource_id();
	var crsf_token = jQuery('#topic_crsf_token').val();
	var crsf_exp = jQuery('#topic_crsf_exp').val();
	jQuery(".topic_embedded_reason").removeClass('redborder');
	jQuery(".topic_embedded_new_name").removeClass('redborder');
	if(jQuery('#topic_embedded .topic_embedded_choose')[0].checked){
		var topic_id = parseInt(jQuery('#topic_embedded select').val());
		if(topic_id <= 0){
			alert('还未选择专题');
			return false;
		}
		var reason = jQuery('#topic_embedded .topic_embedded_reason').val();
		if(reason.length > 250){
			jQuery(".topic_embedded_reason").addClass('redborder');
			alert('推荐语不能超过250个字');
			return false;
		}
		jQuery.ajax({
	      	url: "/topic_ajax/contribute_resource_to",
	      	dataType: "json",
	      	data: {
	      		topic_id : topic_id,
	      		reason : reason,
	      		resource_type : resource_type,
	      		resource_id : resource_id,
	      		crsf_token : crsf_token,
	      		crsf_exp : crsf_exp,
	      	},
	      	success: function(msg){
	      		if(msg.success == 1){
	      			if(msg.result == 2){
	      				after_success(msg.url, msg.topic_name);
	      			}
	      			else if(msg.result == 1){
	      				after_success2(msg.url);
	      			}
	      			return;
	      		}
	      		else if(msg.error == 1){
	      			if(msg.kind == 'applying'){
	      				after_fail2(msg.url);
	      			}
	      			else if(msg.kind == 'accepted'){
	      				after_fail1(msg.url, msg.topic_name);
	      			}
	      			return false;
	      		}
	      	},
    	});
	}
	else if(jQuery('#topic_embedded .topic_embedded_new')[0].checked){
		var new_name = jQuery('#topic_embedded .topic_embedded_new_name').val().trim();
		if(new_name == ''){
			jQuery(".topic_embedded_new_name").addClass('redborder');
			alert('新专题名不能为空');
			return false;
		}
		else if(new_name.length > 50){
			jQuery(".topic_embedded_new_name").addClass('redborder');
			alert('新专题名不能超过50个字');
			return false;
		}
		var reason = jQuery('#topic_embedded .topic_embedded_reason').val();
		if(reason.length > 250){
			jQuery(".topic_embedded_reason").addClass('redborder');
			alert('推荐语不能超过250个字');
			return false;
		}
		jQuery.ajax({
	      	url: "/topic_ajax/contribute_resource_new",
	      	dataType: "json",
	      	data: {
	      		new_name : new_name,
	      		reason : reason,
	      		resource_type : resource_type,
	      		resource_id : resource_id,
	      		crsf_token : crsf_token,
	      		crsf_exp : crsf_exp,
	      	},
	      	success: function(msg){
	      		if(msg.success == 1){
	      			after_success(msg.url, msg.topic_name);
	      			return;
	      		}
	      		else if(msg.error == 1){
	      			alert(msg.message);
	      			return false;
	      		}
	      	},
    	});
	}
	else{
		alert('还未选择专题');
		return false;
	}
}
function topic_embedded_cancel(){
    if(document.getElementById('topic-modal')){
        km.closeds('#topic-modal');
    }
    else{
        jQuery.colorbox.close();
    }
	clearTimeout(topic_embedded_timeout);
	return false;
}

function website_share_submit(){
	var resource_type = topic_get_resource_type();
	var resource_id = topic_get_resource_id();
	var crsf_token = jQuery('#topic_crsf_token').val();
	var crsf_exp = jQuery('#topic_crsf_exp').val();
	var site = jQuery('#website_site').val();
	var cat_id = jQuery('#website_category').val();
	jQuery.ajax({
      	url: "/knowledge_portal/submit_website_share",
      	dataType: "json",
      	data: {
      		site : site,
      		cat_id : cat_id,
      		resource_type : resource_type,
      		resource_id : resource_id,
      		crsf_token : crsf_token,
      		crsf_exp : crsf_exp,
      	},
      	success: function(msg){
      		if(msg.success == 1){
      			if(msg.result == 1){
      				after_success(msg.url, '点击查看');
      			}
      			else if(msg.result == 2){
      				after_fail1(msg.url, '点击查看');
      			}
      			return;
      		}
      		else if(msg.error == 1){
      			alert(msg.message);
      			return false;
      		}
      	},
	});
}
