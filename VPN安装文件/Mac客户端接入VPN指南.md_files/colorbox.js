// ColorBox v1.3.16 - a full featured, light-weight, customizable lightbox based on jQuery 1.3+
// Copyright (c) 2011 Jack Moore - jack@colorpowered.com
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
(function (jQuery, document, window) {
	var
	// ColorBox Default Settings.	
	// See http://colorpowered.com/colorbox for details.
	defaults = {
		transition: "elastic",
		speed: 300,
		width: false,
		initialWidth: "600",
		innerWidth: false,
		maxWidth: false,
		height: false,
		initialHeight: "450",
		innerHeight: false,
		maxHeight: false,
		scalePhotos: true,
		scrolling: true,
		inline: false,
		html: false,
		iframe: false,
		fastIframe: true,
		photo: false,
		href: false,
		title: false,
		rel: false,
		opacity: 0.9,
		preloading: true,
		current: "image {current} of {total}",
		previous: "previous",
		next: "next",
		close: "close",
		open: false,
		returnFocus: true,
		loop: true,
		slideshow: false,
		slideshowAuto: true,
		slideshowSpeed: 2500,
		slideshowStart: "start slideshow",
		slideshowStop: "stop slideshow",
		onOpen: false,
		onLoad: false,
		onComplete: false,
		onCleanup: false,
		onClosed: false,
		overlayClose: true,		
		escKey: true,
		arrowKey: true
	},
	
	// Abstracting the HTML and event identifiers for easy rebranding
	colorbox = 'colorbox',
	prefix = 'cbox',
	
	// Events	
	event_open = prefix + '_open',
	event_load = prefix + '_load',
	event_complete = prefix + '_complete',
	event_cleanup = prefix + '_cleanup',
	event_closed = prefix + '_closed',
	event_purge = prefix + '_purge',
	
	// Special Handling for IE
	isIE = jQuery.browser.msie && !jQuery.support.opacity, // feature detection alone gave a false positive on at least one phone browser and on some development versions of Chrome.
	isIE6 = isIE && jQuery.browser.version < 7,
	//isIE = navigator.appName == "Microsoft Internet Explorer" 
	//isIE6 = isIE && navigator.appVersion.match(/6./i)=="6."
	event_ie6 = prefix + '_IE6',

	// Cached jQuery Object Variables
	jQueryoverlay,
	jQuerybox,
	jQuerywrap,
	jQuerycontent,
	jQuerytopBorder,
	jQueryleftBorder,
	jQueryrightBorder,
	jQuerybottomBorder,
	jQueryrelated,
	jQuerywindow,
	jQueryloaded,
	jQueryloadingBay,
	jQueryloadingOverlay,
	jQuerytitle,
	jQuerycurrent,
	jQueryslideshow,
	jQuerynext,
	jQueryprev,
	jQueryclose,
	jQuerygroupControls,

	// Variables for cached values or use across multiple functions
	settings = {},
	interfaceHeight,
	interfaceWidth,
	loadedHeight,
	loadedWidth,
	element,
	index,
	photo,
	open,
	active,
	closing = false,
	
	publicMethod,
	boxElement = prefix + 'Element';
	
	// ****************
	// HELPER FUNCTIONS
	// ****************

	// jQuery object generator to reduce code size
	function jQuerydiv(id, cssText) { 
		var div = document.createElement('div');
		if (id) {
            div.id = prefix + id;
        }
		div.style.cssText = cssText || false;
		return jQuery(div);
	}

	// Convert % values to pixels
	function setSize(size, dimension) {
		dimension = dimension === 'x' ? jQuerywindow.width() : jQuerywindow.height();
		return (typeof size === 'string') ? Math.round((/%/.test(size) ? (dimension / 100) * parseInt(size, 10) : parseInt(size, 10))) : size;
	}
	
	// Checks an href to see if it is a photo.
	// There is a force photo option (photo: true) for hrefs that cannot be matched by this regex.
	function isImage(url) {
		return settings.photo || /\.(gif|png|jpg|jpeg|bmp)(?:\?([^#]*))?(?:#(\.*))?jQuery/i.test(url);
	}
	
	// Assigns function results to their respective settings.  This allows functions to be used as values.
	function process(settings) {
		for (var i in settings) {
			if (jQuery.isFunction(settings[i]) && i.substring(0, 2) !== 'on') { // checks to make sure the function isn't one of the callbacks, they will be handled at the appropriate time.
			    settings[i] = settings[i].call(element);
			}
		}
		settings.rel = settings.rel || element.rel || 'nofollow';
		settings.href = jQuery.trim(settings.href || jQuery(element).attr('href'));
		settings.title = settings.title || element.title;
	}

	function trigger(event, callback) {
		if (callback) {
			callback.call(element);
		}
		jQuery.event.trigger(event);
	}

	// Slideshow functionality
	function slideshow() {
		var
		timeOut,
		className = prefix + "Slideshow_",
		click = "click." + prefix,
		start,
		stop,
		clear;
		
		if (settings.slideshow && jQueryrelated[1]) {
			start = function () {
				jQueryslideshow
					.text(settings.slideshowStop)
					.unbind(click)
					.bind(event_complete, function () {
						if (index < jQueryrelated.length - 1 || settings.loop) {
							timeOut = setTimeout(publicMethod.next, settings.slideshowSpeed);
						}
					})
					.bind(event_load, function () {
						clearTimeout(timeOut);
					})
					.one(click + ' ' + event_cleanup, stop);
				jQuerybox.removeClass(className + "off").addClass(className + "on");
				timeOut = setTimeout(publicMethod.next, settings.slideshowSpeed);
			};
			
			stop = function () {
				clearTimeout(timeOut);
				jQueryslideshow
					.text(settings.slideshowStart)
					.unbind([event_complete, event_load, event_cleanup, click].join(' '))
					.one(click, start);
				jQuerybox.removeClass(className + "on").addClass(className + "off");
			};
			
			if (settings.slideshowAuto) {
				start();
			} else {
				stop();
			}
		}
	}

	function launch(elem) {
		if (!closing) {
			
			element = elem;
			
			process(jQuery.extend(settings, jQuery.data(element, colorbox)));
			
			jQueryrelated = jQuery(element);
			
			index = 0;
			
			if (settings.rel !== 'nofollow') {
				jQueryrelated = jQuery('.' + boxElement).filter(function () {
					var relRelated = jQuery.data(this, colorbox).rel || this.rel;
					return (relRelated === settings.rel);
				});
				index = jQueryrelated.index(element);
				
				// Check direct calls to ColorBox.
				if (index === -1) {
					jQueryrelated = jQueryrelated.add(element);
					index = jQueryrelated.length - 1;
				}
			}
			
			if (!open) {
				open = active = true; // Prevents the page-change action from queuing up if the visitor holds down the left or right keys.
				
				jQuerybox.show();
				
				if (settings.returnFocus) {
					try {
						element.blur();
						jQuery(element).one(event_closed, function () {
							try {
								this.focus();
							} catch (e) {
								// do nothing
							}
						});
					} catch (e) {
						// do nothing
					}
				}
				
				// +settings.opacity avoids a problem in IE when using non-zero-prefixed-string-values, like '.5'
				jQueryoverlay.css({"opacity": +settings.opacity, "cursor": settings.overlayClose ? "pointer" : "auto"}).show();
				
				// Opens inital empty ColorBox prior to content being loaded.
				settings.w = setSize(settings.initialWidth, 'x');
				settings.h = setSize(settings.initialHeight, 'y');
				publicMethod.position(0);
				
				if (isIE6) {
					jQuerywindow.bind('resize.' + event_ie6 + ' scroll.' + event_ie6, function () {
						jQueryoverlay.css({width: jQuerywindow.width(), height: jQuerywindow.height(), top: jQuerywindow.scrollTop(), left: jQuerywindow.scrollLeft()});
					}).trigger('resize.' + event_ie6);
				}
				
				trigger(event_open, settings.onOpen);
				
				jQuerygroupControls.add(jQuerytitle).hide();
				
				jQueryclose.html(settings.close).show();
			}
			
			publicMethod.load(true);
		}
	}

	// ****************
	// PUBLIC FUNCTIONS
	// Usage format: jQuery.fn.colorbox.close();
	// Usage from within an iframe: parent.jQuery.fn.colorbox.close();
	// ****************
	
	publicMethod = jQuery.fn[colorbox] = jQuery[colorbox] = function (options, callback) {
		var jQuerythis = this, autoOpen;
		
		if (!jQuerythis[0] && jQuerythis.selector) { // if a selector was given and it didn't match any elements, go ahead and exit.
			return jQuerythis;
		}
		
		options = options || {};
		
		if (callback) {
			options.onComplete = callback;
		}
		
		if (!jQuerythis[0] || jQuerythis.selector === undefined) { // detects jQuery.colorbox() and jQuery.fn.colorbox()
			jQuerythis = jQuery('<a/>');
			options.open = true; // assume an immediate open
		}
		
		jQuerythis.each(function () {
			jQuery.data(this, colorbox, jQuery.extend({}, jQuery.data(this, colorbox) || defaults, options));
			jQuery(this).addClass(boxElement);
		});
		
		autoOpen = options.open;
		
		if (jQuery.isFunction(autoOpen)) {
			autoOpen = autoOpen.call(jQuerythis);
		}
		
		if (autoOpen) {
			launch(jQuerythis[0]);
		}
		
		return jQuerythis;
	};

	// Initialize ColorBox: store common calculations, preload the interface graphics, append the html.
	// This preps colorbox for a speedy open when clicked, and lightens the burdon on the browser by only
	// having to run once, instead of each time colorbox is opened.
	publicMethod.init = function () {
		// Create & Append jQuery Objects
		jQuerywindow = jQuery(window);
		jQuerybox = jQuerydiv().attr({id: colorbox, 'class': isIE ? prefix + (isIE6 ? 'IE6' : 'IE') : ''});
		jQueryoverlay = jQuerydiv("Overlay", isIE6 ? 'position:absolute' : '').hide();
		
		jQuerywrap = jQuerydiv("Wrapper");
		jQuerycontent = jQuerydiv("Content").append(
			jQueryloaded = jQuerydiv("LoadedContent", 'width:0; height:0; overflow:hidden'),
			jQueryloadingOverlay = jQuerydiv("LoadingOverlay").add(jQuerydiv("LoadingGraphic")),
			jQuerytitle = jQuerydiv("Title"),
			jQuerycurrent = jQuerydiv("Current"),
			jQuerynext = jQuerydiv("Next"),
			jQueryprev = jQuerydiv("Previous"),
			jQueryslideshow = jQuerydiv("Slideshow").bind(event_open, slideshow),
			jQueryclose = jQuerydiv("Close")
		);
		jQuerywrap.append( // The 3x3 Grid that makes up ColorBox
			jQuerydiv().append(
				jQuerydiv("TopLeft"),
				jQuerytopBorder = jQuerydiv("TopCenter"),
				jQuerydiv("TopRight")
			),
			jQuerydiv(false, 'clear:left').append(
				jQueryleftBorder = jQuerydiv("MiddleLeft"),
				jQuerycontent,
				jQueryrightBorder = jQuerydiv("MiddleRight")
			),
			jQuerydiv(false, 'clear:left').append(
				jQuerydiv("BottomLeft"),
				jQuerybottomBorder = jQuerydiv("BottomCenter"),
				jQuerydiv("BottomRight")
			)
		).children().children().css({'float': 'left'});
		
		jQueryloadingBay = jQuerydiv(false, 'position:absolute; width:9999px; visibility:hidden; display:none');
		
		jQuery('body').prepend(jQueryoverlay, jQuerybox.append(jQuerywrap, jQueryloadingBay));
		
		jQuerycontent.children()
		.hover(function () {
			jQuery(this).addClass('hover');
		}, function () {
			jQuery(this).removeClass('hover');
		}).addClass('hover');
		
		// Cache values needed for size calculations
		interfaceHeight = jQuerytopBorder.height() + jQuerybottomBorder.height() + jQuerycontent.outerHeight(true) - jQuerycontent.height();//Subtraction needed for IE6
		interfaceWidth = jQueryleftBorder.width() + jQueryrightBorder.width() + jQuerycontent.outerWidth(true) - jQuerycontent.width();
		loadedHeight = jQueryloaded.outerHeight(true);
		loadedWidth = jQueryloaded.outerWidth(true);
		
		// Setting padding to remove the need to do size conversions during the animation step.
		jQuerybox.css({"padding-bottom": interfaceHeight, "padding-right": interfaceWidth}).hide();
		
                // Setup button events.
                jQuerynext.click(function () {
                        publicMethod.next();
                });
                jQueryprev.click(function () {
                        publicMethod.prev();
                });
                jQueryclose.click(function () {
                        publicMethod.close();
                });
		
		jQuerygroupControls = jQuerynext.add(jQueryprev).add(jQuerycurrent).add(jQueryslideshow);
		
		// Adding the 'hover' class allowed the browser to load the hover-state
		// background graphics.  The class can now can be removed.
		jQuerycontent.children().removeClass('hover');
		
		jQuery('.' + boxElement).live('click', function (e) {
			// checks to see if it was a non-left mouse-click and for clicks modified with ctrl, shift, or alt.
			if (!((e.button !== 0 && typeof e.button !== 'undefined') || e.ctrlKey || e.shiftKey || e.altKey)) {
				e.preventDefault();
				launch(this);
			}
		});
		
		jQueryoverlay.click(function () {
			if (settings.overlayClose) {
				publicMethod.close();
			}
		});
		
		// Set Navigation Key Bindings
		jQuery(document).bind('keydown.' + prefix, function (e) {
                        var key = e.keyCode;
			if (open && settings.escKey && key === 27) {
				e.preventDefault();
				publicMethod.close();
			}
			if (open && settings.arrowKey && jQueryrelated[1]) {
				if (key === 37) {
					e.preventDefault();
					jQueryprev.click();
				} else if (key === 39) {
					e.preventDefault();
					jQuerynext.click();
				}
			}
		});
	};
	
	publicMethod.remove = function () {
		jQuerybox.add(jQueryoverlay).remove();
		jQuery('.' + boxElement).die('click').removeData(colorbox).removeClass(boxElement);
	};

	publicMethod.position = function (speed, loadedCallback) {
		var
		animate_speed,
		// keeps the top and left positions within the browser's viewport.
		posTop = Math.max(document.documentElement.clientHeight - settings.h - loadedHeight - interfaceHeight, 0) / 2 + jQuerywindow.scrollTop(),
		posLeft = Math.max(jQuerywindow.width() - settings.w - loadedWidth - interfaceWidth, 0) / 2 + jQuerywindow.scrollLeft();
		
		// setting the speed to 0 to reduce the delay between same-sized content.
		animate_speed = (jQuerybox.width() === settings.w + loadedWidth && jQuerybox.height() === settings.h + loadedHeight) ? 0 : speed;
		
		// this gives the wrapper plenty of breathing room so it's floated contents can move around smoothly,
		// but it has to be shrank down around the size of div#colorbox when it's done.  If not,
		// it can invoke an obscure IE bug when using iframes.
		jQuerywrap[0].style.width = jQuerywrap[0].style.height = "9999px";
		
		function modalDimensions(that) {
			// loading overlay height has to be explicitly set for IE6.
			jQuerytopBorder[0].style.width = jQuerybottomBorder[0].style.width = jQuerycontent[0].style.width = that.style.width;
			jQueryloadingOverlay[0].style.height = jQueryloadingOverlay[1].style.height = jQuerycontent[0].style.height = jQueryleftBorder[0].style.height = jQueryrightBorder[0].style.height = that.style.height;
		}
		
		jQuerybox.dequeue().animate({width: settings.w + loadedWidth, height: settings.h + loadedHeight, top: posTop, left: posLeft}, {
			duration: animate_speed,
			complete: function () {
				modalDimensions(this);
				
				active = false;
				
				// shrink the wrapper down to exactly the size of colorbox to avoid a bug in IE's iframe implementation.
				jQuerywrap[0].style.width = (settings.w + loadedWidth + interfaceWidth) + "px";
				jQuerywrap[0].style.height = (settings.h + loadedHeight + interfaceHeight) + "px";
				
				if (loadedCallback) {
					loadedCallback();
				}
			},
			step: function () {
				modalDimensions(this);
			}
		});
	};

	publicMethod.resize = function (options) {
		if (open) {
			options = options || {};
			
			if (options.width) {
				settings.w = setSize(options.width, 'x') - loadedWidth - interfaceWidth;
			}
			if (options.innerWidth) {
				settings.w = setSize(options.innerWidth, 'x');
			}
			jQueryloaded.css({width: settings.w});
			
			if (options.height) {
				settings.h = setSize(options.height, 'y') - loadedHeight - interfaceHeight;
			}
			if (options.innerHeight) {
				settings.h = setSize(options.innerHeight, 'y');
			}
			if (!options.innerHeight && !options.height) {				
				var jQuerychild = jQueryloaded.wrapInner("<div style='overflow:auto'></div>").children(); // temporary wrapper to get an accurate estimate of just how high the total content should be.
				settings.h = jQuerychild.height();
				jQuerychild.replaceWith(jQuerychild.children()); // ditch the temporary wrapper div used in height calculation
			}
			jQueryloaded.css({height: settings.h});
			
			publicMethod.position(settings.transition === "none" ? 0 : settings.speed);
		}
	};

	publicMethod.prep = function (object) {
		if (!open) {
			return;
		}
		
		var speed = settings.transition === "none" ? 0 : settings.speed;
		
		jQuerywindow.unbind('resize.' + prefix);
		jQueryloaded.remove();
		jQueryloaded = jQuerydiv('LoadedContent').html(object);
		
		function getWidth() {
			settings.w = settings.w || jQueryloaded.width();
			settings.w = settings.mw && settings.mw < settings.w ? settings.mw : settings.w;
			return settings.w;
		}
		function getHeight() {
			settings.h = settings.h || jQueryloaded.height();
			settings.h = settings.mh && settings.mh < settings.h ? settings.mh : settings.h;
			return settings.h;
		}
		
		jQueryloaded.hide()
		.appendTo(jQueryloadingBay.show())// content has to be appended to the DOM for accurate size calculations.
		.css({width: getWidth(), overflow: settings.scrolling ? 'auto' : 'hidden'})
		.css({height: getHeight()})// sets the height independently from the width in case the new width influences the value of height.
		.prependTo(jQuerycontent);
		
		jQueryloadingBay.hide();
		
		// floating the IMG removes the bottom line-height and fixed a problem where IE miscalculates the width of the parent element as 100% of the document width.
		//jQuery(photo).css({'float': 'none', marginLeft: 'auto', marginRight: 'auto'});
		
                jQuery(photo).css({'float': 'none'});
                
		// Hides SELECT elements in IE6 because they would otherwise sit on top of the overlay.
		if (isIE6) {
			jQuery('select').not(jQuerybox.find('select')).filter(function () {
				return this.style.visibility !== 'hidden';
			}).css({'visibility': 'hidden'}).one(event_cleanup, function () {
				this.style.visibility = 'inherit';
			});
		}
		
		function setPosition(s) {
			publicMethod.position(s, function () {
				var prev, prevSrc, next, nextSrc, total = jQueryrelated.length, iframe, complete;
				
				if (!open) {
					return;
				}
				
				complete = function () {
					jQueryloadingOverlay.hide();
					trigger(event_complete, settings.onComplete);
				};
				
				if (isIE) {
					//This fadeIn helps the bicubic resampling to kick-in.
					if (photo) {
						jQueryloaded.fadeIn(100);
					}
				}
				
				jQuerytitle.html(settings.title).add(jQueryloaded).show();
				
				if (total > 1) { // handle grouping
					if (typeof settings.current === "string") {
						jQuerycurrent.html(settings.current.replace(/\{current\}/, index + 1).replace(/\{total\}/, total)).show();
					}
					
					jQuerynext[(settings.loop || index < total - 1) ? "show" : "hide"]().html(settings.next);
					jQueryprev[(settings.loop || index) ? "show" : "hide"]().html(settings.previous);
					
					prev = index ? jQueryrelated[index - 1] : jQueryrelated[total - 1];
					next = index < total - 1 ? jQueryrelated[index + 1] : jQueryrelated[0];
					
					if (settings.slideshow) {
						jQueryslideshow.show();
					}
					
					// Preloads images within a rel group
					if (settings.preloading) {
						nextSrc = jQuery.data(next, colorbox).href || next.href;
						prevSrc = jQuery.data(prev, colorbox).href || prev.href;
						
						nextSrc = jQuery.isFunction(nextSrc) ? nextSrc.call(next) : nextSrc;
						prevSrc = jQuery.isFunction(prevSrc) ? prevSrc.call(prev) : prevSrc;
						
						if (isImage(nextSrc)) {
							jQuery('<img/>')[0].src = nextSrc;
						}
						
						if (isImage(prevSrc)) {
							jQuery('<img/>')[0].src = prevSrc;
						}
					}
				} else {
					jQuerygroupControls.hide();
				}
				
				if (settings.iframe) {
					iframe = jQuery('<iframe/>').addClass(prefix + 'Iframe')[0];
					
					if (settings.fastIframe) {
						complete();
					} else {
						jQuery(iframe).load(complete);
					}
					iframe.name = prefix + (+new Date());
					iframe.src = settings.href;
					
					if (!settings.scrolling) {
						iframe.scrolling = "no";
					}
					
					if (isIE) {
                        iframe.frameBorder=0;
						iframe.allowTransparency = "true";
					}
					
					jQuery(iframe).appendTo(jQueryloaded).one(event_purge, function () {
						iframe.src = "//about:blank";
					});
				} else {
					complete();
				}
				
				if (settings.transition === 'fade') {
					jQuerybox.fadeTo(speed, 1, function () {
						jQuerybox[0].style.filter = "";
					});
				} else {
                     jQuerybox[0].style.filter = "";
				}
				
				jQuerywindow.bind('resize.' + prefix, function () {
					publicMethod.position(0);
				});
			});
		}
		
		if (settings.transition === 'fade') {
			jQuerybox.fadeTo(speed, 0, function () {
				setPosition(0);
			});
		} else {
			setPosition(speed);
		}
	};

	publicMethod.load = function (launched) {
		var href, setResize, prep = publicMethod.prep;
		
		active = true;
		
		photo = false;
		
		element = jQueryrelated[index];
		
		if (!launched) {
			process(jQuery.extend(settings, jQuery.data(element, colorbox)));
		}
		
		trigger(event_purge);
		
		trigger(event_load, settings.onLoad);
		
		settings.h = settings.height ?
				setSize(settings.height, 'y') - loadedHeight - interfaceHeight :
				settings.innerHeight && setSize(settings.innerHeight, 'y');
		
		settings.w = settings.width ?
				setSize(settings.width, 'x') - loadedWidth - interfaceWidth :
				settings.innerWidth && setSize(settings.innerWidth, 'x');
		
		// Sets the minimum dimensions for use in image scaling
		settings.mw = settings.w;
		settings.mh = settings.h;
		
		// Re-evaluate the minimum width and height based on maxWidth and maxHeight values.
		// If the width or height exceed the maxWidth or maxHeight, use the maximum values instead.
		if (settings.maxWidth) {
			settings.mw = setSize(settings.maxWidth, 'x') - loadedWidth - interfaceWidth;
			settings.mw = settings.w && settings.w < settings.mw ? settings.w : settings.mw;
		}
		if (settings.maxHeight) {
			settings.mh = setSize(settings.maxHeight, 'y') - loadedHeight - interfaceHeight;
			settings.mh = settings.h && settings.h < settings.mh ? settings.h : settings.mh;
		}
		
		href = settings.href;
		
		jQueryloadingOverlay.show();

		if (settings.inline) {
			// Inserts an empty placeholder where inline content is being pulled from.
			// An event is bound to put inline content back when ColorBox closes or loads new content.
			jQuerydiv().hide().insertBefore(jQuery(href)[0]).one(event_purge, function () {
				jQuery(this).replaceWith(jQueryloaded.children());
			});
			prep(jQuery(href));
		} else if (settings.iframe) {
			// IFrame element won't be added to the DOM until it is ready to be displayed,
			// to avoid problems with DOM-ready JS that might be trying to run in that iframe.
			prep(" ");
		} else if (settings.html) {
			prep(settings.html);
		} else if (isImage(href)) {
			jQuery(photo = new Image())
			.addClass(prefix + 'Photo')
			.error(function () {
				settings.title = false;
				prep(jQuerydiv('Error').text('This image could not be loaded'));
			})
			.load(function () {
				var percent;
				photo.onload = null; //stops animated gifs from firing the onload repeatedly.
				
				if (settings.scalePhotos) {
					setResize = function () {
						photo.height -= photo.height * percent;
						photo.width -= photo.width * percent;	
					};
					if (settings.mw && photo.width > settings.mw) {
						percent = (photo.width - settings.mw) / photo.width;
						setResize();
					}
					if (settings.mh && photo.height > settings.mh) {
						percent = (photo.height - settings.mh) / photo.height;
						setResize();
					}
				}
				
				if (settings.h) {
					photo.style.marginTop = Math.max(settings.h - photo.height, 0) / 2 + 'px';
				}
				
				if (jQueryrelated[1] && (index < jQueryrelated.length - 1 || settings.loop)) {
					photo.style.cursor = 'pointer';
					photo.onclick = function () {
                                                publicMethod.next();
                                        };
				}
				
				if (isIE) {
					photo.style.msInterpolationMode = 'bicubic';
				}
				
				setTimeout(function () { // A pause because Chrome will sometimes report a 0 by 0 size otherwise.
					prep(photo);
				}, 1);
			});
			
			setTimeout(function () { // A pause because Opera 10.6+ will sometimes not run the onload function otherwise.
				photo.src = href;
			}, 1);
		} else if (href) {
			jQueryloadingBay.load(href, function (data, status, xhr) {
				prep(status === 'error' ? jQuerydiv('Error').text('Request unsuccessful: ' + xhr.statusText) : jQuery(this).contents());
			});
		}
	};
        
	// Navigates to the next page/image in a set.
	publicMethod.next = function () {
		if (!active && jQueryrelated[1] && (index < jQueryrelated.length - 1 || settings.loop)) {
			index = index < jQueryrelated.length - 1 ? index + 1 : 0;
			publicMethod.load();
		}
	};
	
	publicMethod.prev = function () {
		if (!active && jQueryrelated[1] && (index || settings.loop)) {
			index = index ? index - 1 : jQueryrelated.length - 1;
			publicMethod.load();
		}
	};

	// Note: to use this within an iframe use the following format: parent.jQuery.fn.colorbox.close();
	publicMethod.close = function () {
		if (open && !closing) {
			
			closing = true;
			
			open = false;
			
			trigger(event_cleanup, settings.onCleanup);
			
			jQuerywindow.unbind('.' + prefix + ' .' + event_ie6);
			
			jQueryoverlay.fadeTo(200, 0);
			
			jQuerybox.stop().fadeTo(300, 0, function () {
                                
				jQuerybox.add(jQueryoverlay).css({'opacity': 1, cursor: 'auto'}).hide();
				
				trigger(event_purge);
				
				jQueryloaded.remove();
				
				setTimeout(function () {
					closing = false;
					trigger(event_closed, settings.onClosed);
				}, 1);
			});
		}
	};

	// A method for fetching the current element ColorBox is referencing.
	// returns a jQuery object.
	publicMethod.element = function () {
		return jQuery(element);
	};

	publicMethod.settings = defaults;

	// Initializes ColorBox when the DOM has loaded
	jQuery(publicMethod.init);

}(jQuery, document, this));