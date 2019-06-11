if(typeof String.prototype.trim == 'undefined'){
    String.prototype.trim = function () {
        return this.replace(/^\s\s*/, '' ).replace(/\s\s*$/, '' );
    }
}
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(obj, start) {
		for (var i = (start || 0), j = this.length; i < j; i++) {
    		if (this[i] === obj) { return i; }
	    }
	    return -1;
	}
}

jQuery(document).ready(function(){
	//setSlideInterface('.userInfo', '#wiki_nav_mysites', '#wikis_mysites');
	jQuery('#wiki_nav_mysites').mouseover(function (event){
		jQuery('#wikis_mysites').show();
	});
	jQuery('#wiki_nav_mysites').mouseout(function (event){
		// if(event.fromElement.id == 'wiki_nav_mysites_p' && event.toElement.id == 'wiki_nav_mysites'){
			// return;
		// }
		// if(event.fromElement.id == 'wiki_nav_mysites' && event.toElement.id == 'wiki_nav_mysites_p'){
			// return;
		// }
		jQuery('#wikis_mysites').hide();
	});
	jQuery('#wikis_mysites').mouseover(function (event){
		jQuery('#wikis_mysites').show();
	});
	jQuery('#wikis_mysites').mouseout(function (event){
		jQuery('#wikis_mysites').hide();
	});


	jQuery('#guide_link').click(function(){
		guide_start();
	});
	jQuery('#guide .close').click(function(){
		guide_close();
	});
	jQuery('#guide .next').click(function(){
		var selected = jQuery('#guide .selected');
		var next = selected.next('.content-wrap');
		var dot = jQuery('#guide .pagination .selected');
		selected.removeClass('selected');
		if(next.size() > 0){
			next.addClass('selected');
			dot.next('i').addClass('selected');
			dot.removeClass('selected');
		}
		else{
			guide_close();
		}
		jQuery('#guide .prev').show();
	});
	jQuery('#guide .prev').click(function(){
		var selected = jQuery('#guide .selected');
		var prev = selected.prev('.content-wrap');
		var dot = jQuery('#guide .pagination .selected');
		if(prev.size() > 0){
			selected.removeClass('selected');
			prev.addClass('selected');
			dot.prev('i').addClass('selected');
			dot.removeClass('selected');
		}
		if(prev.hasClass('first')){
			jQuery('#guide .prev').hide();
		}
	});

	jQuery("#trash_search_input").keydown(function(e){
		var curKey = e.which;
		if(curKey == 13){
			jQuery('#wiki_trash_search a').click();
			e.keyCode = 0;
			e.returnValue = false;
			return false;
		}
	});

	jQuery('#page_content').find('table').each(function(){
		if(typeof(jQuery(this).attr('border')) == 'undefined'){
			jQuery(this).attr('border', '1');
		}
	});

	if(location.pathname == '/wikis/show' && $('#category_782').length > 0){
		if(!$('#category_782').hasClass('opened')){
			category_click(782);
		}
	}
	if(location.pathname == '/wikis/train201504' && $('#category_870').length > 0){
		if(!$('#category_870').hasClass('opened')){
			category_click(870);
		}
	}
	resizeCKInsertImage();
});

var chars_for_0_5 = ['.', '`', '!', '?', '^', '*', '(', ')', '[', ']', '{', '}', '|', '~'];
function truncate_len(str, max_len){
	var length = str.length;
	if(length < len){
		return str;
	}
	var len = 0, c;
	for(var i = 0;i < length;i++){
		c = str[i];
		if((c >= '0' && c <= '9') || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')){
			len += 0.5;
		}
		else if(chars_for_0_5.indexOf(c) >= 0){
			len += 0.5;
		}
		else{
			len += 1;
		}
		if(len > max_len){
			return str.substr(0, i) + '...';
		}
	}
	return str;
}


function guide_start(){
	jQuery('#guide .content').css('margin-top', '50px');
	jQuery('#guide .content-wrap').removeClass('selected').first().addClass('selected');
	jQuery('#guide .pagination .dot').removeClass('selected').first().addClass('selected');
	jQuery('#guide .prev').hide();
	jQuery('#guide-mask').show();
	jQuery('#guide').show(0, function (){jQuery('#guide .content').css('margin-top', 0);});
}
function guide_close(){
	jQuery('#guide-mask').hide();
	jQuery('#guide').hide();
}

function int_valid(num){
	var n = parseInt(num);
	if(isNaN(n)) return false;
	if(n <= 0) return false;
	return true;
}
function open_pop_div(id){
	var selector = '#' + id;
	km.opends(selector);
}

function wikis_url(method){
	return '/wikis/' + method;
}

function cover_open(div_id, target_div_id, w1, w2, h1, h2, l_or_r, scroll){
	cover_close();
	var target = jQuery('#' + target_div_id);
	if(target.size() == 0){
		return;
	}
	var cover = jQuery('#' + div_id);
	var bg1 = jQuery('#bg_hide_div_1');
	var bg2 = jQuery('#bg_hide_div_2');
	var bg3 = jQuery('#bg_hide_div_3');
	var bg4 = jQuery('#bg_hide_div_4');
	var w = target.width();
	var h = target.height();
	var dw = jQuery(document).width();
	var dh = jQuery(document).height();
	var p1_x, p1_y, p2_x, p2_y, p3_x, p3_y, p4_x, p4_y;
	p1_x = target.offset().left - w1;
	p1_y = target.offset().top - h1;
	p2_x = p1_x + w + w1 + w2;
	p2_y = p1_y;
	p3_x = p2_x;
	p3_y = p2_y + h + h1 + h2;
	p4_x = p1_x;
	p4_y = p3_y;
	var show_h = h + h1 + h2;
	bg1.css('top', 0).css('left', 0).css('width', '100%').css('height', p1_y);
	bg2.css('top', p2_y).css('left', p2_x).css('width', dw - p2_x).css('height', show_h);
	bg3.css('top', p4_y).css('left', 0).css('width', '100%').css('height', dh - p4_y);
	bg4.css('top', p1_y).css('left', 0).css('width', p1_x).css('height', show_h);
	if(l_or_r == 'r'){
		cover.css('top', p2_y - 20).css('left', p2_x + 20);
	}
	else{
		cover.css('top', p2_y - 20).css('left', p1_x - 20 - cover.width());
	}
	cover.show();
	bg1.show();
	bg2.show();
	bg3.show();
	bg4.show();
	if(scroll == 1){
		jQuery("body").animate({scrollTop : p1_y - 200}, 500);
		if(document.all){
			document.documentElement.scrollTop = p1_y - 200;
		}
	}
}
function cover_close(){
	jQuery('.bg_div').hide();
	jQuery('.bg_show_div').hide();
}


function site_step_1(){
	cover_open('bg_div_1', 'wiki_cat_action', 10, 20, 5, 8, 'r', 0);
}
function site_step_2(){
	cover_open('bg_div_2', 'wiki_notice_action', 10, 20, 5, 8, 'r', 0);
}
function site_step_3(){
	if(jQuery('#create_page_link').size() == 0){
		var html = '<a id="create_page_link" href="javascript:void(0)" class="page_action"><font>+</font> 新建词条</a>';
		jQuery('#right_action').append(html);
		window.create_page_link_added = 1;
	}
	cover_open('bg_div_3', 'create_page_link', 10, 30, 5, 12, 'l', 0);
}
function site_step_4(){
	if(window.create_page_link_added == 1){
		jQuery('#create_page_link').remove();
		window.create_page_link_added = 0;
	}
	cover_close();

	var wiki_id = jQuery('#wiki_id').val();
	jQuery.ajax({
		url : '/wikis/set_guide_showed',
		type : 'post',
		dataType: "json",
		data : {
			wiki_id : wiki_id,
			from : 'wiki_site'
		}
	});
}

function wiki_edit_step_1(){
	cover_open('bg_div_1', 'wiki_edit_admin_div', 10, 20, 5, 8, 'r', 1);
}
function wiki_edit_step_2(){
	cover_open('bg_div_2', 'wiki_edit_page_publish_div', 10, 20, 5, 8, 'r', 1);
}
function wiki_edit_step_3(){
	cover_open('bg_div_3', 'wiki_edit_auth_div', -40, 30, 20, 12, 'r', 1);
}
function wiki_edit_step_4(){
	cover_close();
	jQuery("body").animate({scrollTop : 0}, 500);
	if(document.all){
		document.documentElement.scrollTop = 0;
	}

	var wiki_id = jQuery('#wiki_id').val();
	jQuery.ajax({
		url : '/wikis/set_guide_showed',
		type : 'post',
		dataType: "json",
		data : {
			wiki_id : wiki_id,
			from : 'wiki_edit'
		}
	});
}

function scroll_to (h) {
  jQuery("html, body").scrollTop(h);
}

function link_with_km_head(link){
	var $link = jQuery(link);
	var href = $link.attr('href');
	var h;
	if(jQuery(href).size() > 0){
		h = jQuery(href).offset().top;
		scroll_to(h - 60);
		return false;
	}
	var name = href.slice(1)
	var result = jQuery('.page_content').find('a[name="'+name+'"]');
	if(result.size() > 0){
		h = result.first().offset().top;
		scroll_to(h - 60);
		return false;
	}
	return true;
}

function wiki_page_show_init(){
	wiki_page_create_dir();

	//jQuery('#page_cats .sRec').each(function (){
	//	jQuery(this).parent().addClass('opened');
	//});

	if(jQuery('#markdown_parse_result').size() > 0){
		wiki_markdown_init();
	}
	wiki_page_content_init();
}

function wiki_page_create_dir(){
	var $wiki_head_div = jQuery('#page_dir .page_dir_right');
    var wiki_head = "";
    jQuery("#page_content").find("h2,h3").each(function (){
    	var html = this.innerHTML.trim();
    	html = html.replace(/ /g, '').replace(/&nbsp;/g, '');
    	if(html.length == 0){
    		jQuery(this).remove();
    	}
    });
    var $hs = jQuery("#page_content").find("h2,h3");
    var hs_size = $hs.size();
    var split_half, split_half2;
    if(hs_size <= 10){
    	split_half = split_half2 = -1;
    }
    else{
    	split_half = parseInt((hs_size + 1) / 2);
    	split_half2 = -1;
    }
    if(hs_size > 0){
    	var h2_count = 0;
		$hs.each(function(i, item){
			if(i == split_half || i == split_half2){
				$wiki_new_head_div = jQuery('<div class="page_dir_right"></div>');
				$wiki_new_head_div.insertAfter($wiki_head_div);
				$wiki_head_div = $wiki_new_head_div;
			}

			var tag = item.tagName;
			var jitem = jQuery(item);
			var node_value = "";
			var attr = "";

			id_anthor = 'anthor_' + i;
			jitem.attr("id", id_anthor);
			attr = id_anthor;
			if(item.className && item.className=="wiki_page_headline_1"){
				tag = "h2";
				var hlink = jitem.children("a")
				node_value = hlink.text().replace(/(^\s*)|(\s*$)/g, "");
			}else{
				node_value = jitem.text().replace(/(^\s*)|(\s*$)/g, "");
			}

			var html = '<div class="new'+tag+'">';
			var num_span;
			if(tag == 'h2' || tag == 'H2'){
				h2_count += 1;
				if(h2_count < 10){
					num_span = '<span class="top_num_span">' + h2_count + '</span>';
				}
				else{
					num_span = '<span class="top_num_span gte_10">' + h2_count + '</span>';
				}
				html += num_span;
				jitem.html(num_span + jitem.html());
			}
			node_value = truncate_len(node_value, 18);
			html += '<a onclick="return link_with_km_head(this)" href="#'+attr+'">'+node_value+'</a></div>';
			$wiki_head_div.append(html);
		});
	}
	else{
		jQuery('#page_dir').hide();
	}
}

function wiki_markdown_init(){
	var text = jQuery('#markdown_parse_result').html();

	//翻译<http://...>
	text = text.replace(/&lt;(http|https):\/\/([^\s]+)&gt;/g, "<a href='$1://$2'>$1://$2</a>");
	//翻译邮件链接
	text = text.replace(/&lt;([a-zA-Z0-9_\.\-]+)\@([a-zA-Z0-9\-\.]+\.)+([a-zA-Z]{2,4})&gt;/g, "<a href='mailto:$1@$2$3'>$1@$2$3</a>");

	text = text.replace(/&lt;\/font&gt;/g, "</font>").replace(/&lt;font(.*?)&gt;/g, "<font$1>")

	text = text.replace(/&lt;del&gt;/g, "<del>").replace(/&lt;\/del&gt;/g, "</del>")

	jQuery('#markdown_parse_result').html(text);
}

function wiki_page_content_init(){
	var width = jQuery('.page_content').width();
	var host = window.location.host;
	jQuery('.page_content').find('table').each(function (){
		if(jQuery(this).width() > width){
			//jQuery(this).parent().css('overflow-x', 'scroll');
			jQuery(this).css('max-width', width);
		}
	});
	jQuery('.page_content').find('a').each(function (){
		var href = jQuery(this).attr('href');
		if(href && href.indexOf(host) >= 0){
			jQuery(this).css('text-decoration', 'underline');
		}
	});
}
function to_pdf(wiki_page_id){
	jQuery('#to_pdf_div .pop_div_block').hide();
	jQuery('#to_pdf_div .pop_div_block').first().show();
	km.opends('#to_pdf_div');
	var url = 'http://' + location.host;
	$h = jQuery('html').clone();
	$h.find('#header').remove();
	$h.find('#footer').remove();
	$h.find('#bgs').remove();
	$h.find('#page_left').remove();
	$h.find('#page_action_div').remove();
	if(jQuery('#markdown_parse_result').length > 0){
		$h.find('#my_data').remove();
	}
	$h.find('#guide').remove();
	$h.find('#guide-mask').remove();
	$h.find('#cboxOverlay').remove();
	$h.find('#colorbox').remove();
	$h.find('.dTc').remove();
	$h.find('.sideBar').remove();
	$h.find('script').remove();
	$h.find('#page_tags').remove();
	$h.find('#notice').remove();
	$h.find('#articleAttachments .att_close').remove(); //删除附件的垃圾箱图标
	$h.find('link, a').each(function (){
		this.href = this.href;
	});
	$h.find('img').each(function (){
		this.src = this.src;
	});
	$h.find('#page_main').css('background-color', '#ffffff');
	$h.find('#wiki_page_main').css('border', 'none');
	$h.find('#page_right').css('width', '1040px');
	$h.find('.page_content').css('border-bottom', 'none');
	var html = $h.html();
	jQuery.ajax({
		url : '/wiki/html_to_pdf',
		type : 'post',
		async : true,
		dataType: "json",
		data : {
			page_id : wiki_page_id,
			html : html
		},
		success : function (data){
			if(data.success == 1){
				km.closeds('#to_pdf_div');
				location.href = '/wiki/read_pdf?page_id=' + wiki_page_id;
				return;
			}
			else{
				jQuery('#to_pdf_div .pop_div_block').hide();
				jQuery('#to_pdf_fail').show();
			}
		}
	});
}

function search_trash(wiki_id){
	var search = jQuery('#trash_search_input').val();
	if(search.length > 0){
		location.href = '/wikis/trash?wiki_id=' + wiki_id + '&search=' + search;
	}
	else{
		location.href = '/wikis/trash?wiki_id=' + wiki_id;
	}
}

function revert_trash(page_id){
	jQuery.ajax({
		url : '/wiki/revert_deleted',
		type : 'post',
		dataType: "json",
		data : {
			page_id : page_id,
		},
		success : function (data){
			if(data.success == 1){
				jQuery('#trash_' + page_id).remove();
				jQuery('#revert_page_id').val(page_id);
				km.opends('#trash_window');
			}
		}
	});
}

function revert_view(){
	var page_id = jQuery('#revert_page_id').val();
	if(page_id){
		location.href = '/wiki/show?page_id=' + page_id;
	}
}

function show_page_viewer(wiki_id, page_id){
	jQuery.ajax({
		url : '/wikis/statistics_view',
		type : 'get',
		dataType: "json",
		data : {
			page_id : page_id,
			wiki_id : wiki_id
		},
		success : function (ret){
			if(ret.status == 1){
				var html = '共' + ret.data.list.length + '人：';
				$.each(ret.data.list, function(i, name){
					html += name + '&nbsp;&nbsp;'
				});
				if(ret.data.list.length > 80){
					jQuery('#more_viewing_list').css('overflow-y', 'scroll');
				}
				jQuery('#more_viewing_list').html(html);
				km.opends('#more_viewing');
			}
		}
	});
}

function remove_att_relation(page_id, article_id, identifier){
	if(confirm('确认删除附件？')){
		var crsf_token = $('#crsf_token').val();
		var crsf_exp = $('#crsf_exp').val();
		jQuery.ajax({
		  	url: '/wiki/remove_attachment',
		  	type: "POST",
		  	dataType: "json",
		  	data: {
		  		page_id : page_id,
		  		id : article_id,
		  		crsf_token : crsf_token,
		  		crsf_exp : crsf_exp,
		  	},
		  	success: function(ret){
		  		if(ret.status == 1){
		  			var file_div = jQuery('#page_attachment_' + article_id);
		  			file_div.remove();
		  			if($('#articleAttachments .attachmentTitle').size() == 0){
		  				$('#articleAttachments').hide();
		  			}
		  			// file_div.find('.att_link').hide();
		  			// file_div.find('.att_close').remove();
		  			// file_div.find('span').show();
				}
				else{
					alert(ret.message);
				}
		  	}
		});
	}
}

function cat_move_down(cat_id){
	var $cat_li = $('#category_' + cat_id);
	var $cat_children = $('#children_' + cat_id);
	var crsf_token = $('#crsf_token').val();
	var crsf_exp = $('#crsf_exp').val();
	if($cat_li){
		var $next_lis = $cat_li.nextAll('.normal_cat');
		if($next_lis.length > 0){
			var $next_li = $next_lis.first();
			var next_cat_id = $next_li.attr('cat');
			var $next_cat_children = $('#children_' + next_cat_id);
			if($next_cat_children.length > 0){
				$next_li = $next_cat_children;
			}
			jQuery.ajax({
			  	url: '/wiki_category/down_cat',
			  	type: "POST",
			  	dataType: "json",
			  	data: {
			  		cat_id : cat_id,
			  		crsf_token : crsf_token,
			  		crsf_exp : crsf_exp,
			  		from : 'wiki_site'
			  	},
			  	success: function(ret){
			  		if(ret.status == 1){
			  			if($cat_children.length > 0){
							$cat_children.insertAfter($next_li);
						}
						$cat_li.insertAfter($next_li);
					}
					else{
						alert(ret.message);
					}
			  	}
			});
		}
		else{
			alert('已经在最下了');
		}
	}
}
function cat_move_up(cat_id){
	var $cat_li = $('#category_' + cat_id);
	var $cat_children = $('#children_' + cat_id);
	var crsf_token = $('#crsf_token').val();
	var crsf_exp = $('#crsf_exp').val();
	if($cat_li){
		var $next_lis = $cat_li.prevAll('.normal_cat');
		if($next_lis.length > 0){
			var $next_li = $next_lis.first();
			jQuery.ajax({
			  	url: '/wiki_category/up_cat',
			  	type: "POST",
			  	dataType: "json",
			  	data: {
			  		cat_id : cat_id,
			  		crsf_token : crsf_token,
			  		crsf_exp : crsf_exp,
			  		from : 'wiki_site'
			  	},
			  	success: function(ret){
			  		if(ret.status == 1){
			  			$cat_li.insertBefore($next_li);
						if($cat_children.length > 0){
							$cat_children.insertBefore($next_li);
						}
					}
					else{
						alert(ret.message);
					}
			  	}
			});
		}
		else{
			alert('已经在最上了');
		}
	}
}

function parse_markdown_content(text){
	var code_mark = '[code class="highlight_code_block"]';
	var code_blocks = [];
	// IE8下的标签为大写，class后没有"号
	text = text.replace(/<pre class=(\"?)brush:([\S\s]*?)<\/pre>/gi, function(pre){
		code_blocks.push(pre);
		return "\r\n" + code_mark + "\r\n";
	});
	var html = Markdown(text);
	var $html = jQuery('<div>' + html + '</div>');

	//处理IE8下，<pre><code>中的内容会被<p>标签包围导致间距过大
	var userAgent = window.navigator.userAgent.toLowerCase();
	if(jQuery.browser && jQuery.browser.msie && /msie 8\.0/i.test(userAgent)){
		$html.find('pre code p').each(function(){
			jQuery(this).css('margin', '-10px 0').css('padding', '0');
		});
		$html.find('pre code p').last().css('margin-top', '0').css('margin-bottom', '0');
	}

	//插入code高亮代码
	var block_index = 0;
	var $p;
	var inner_p;
	$html.find('p').each(function(){
		$p = jQuery(this);
		inner_p = $p.html();
		if(inner_p == code_mark){
			jQuery(code_blocks[block_index]).insertAfter($p);
			block_index += 1;
			$p.remove();
		}
	});

	//处理markdown快链
	var href;
	$html.find('a').each(function(){
		href = jQuery(this).attr('href');
		if(href && href.length > 0 && href[0] == '#'){
            jQuery(this).attr('onclick', 'return link_with_km_head(this)');
		}
	})
	return $html.html();
}


function resizeCKInsertImage() {
	var $pageContent = $('#page_content');
	if ($pageContent) {
		var maxWidth = $pageContent.width();
		$('#wiki_page_main').find('#page_content img').each(function () {
			var $img = $(this);
			var imageWidth = $img.width();
			var imageHeight = $img.height();
			if (imageWidth > maxWidth) {
				$img.css({width: maxWidth, height: imageHeight / imageWidth * maxWidth})
			}
			$img.load(function () {
				var imageWidth = $img.width();
				var imageHeight = $img.height();
				if (imageWidth > maxWidth) {
					$img.css({width: maxWidth, height: imageHeight / imageWidth * maxWidth})
				}
			});
		})
	}
}
