var megasocialpopup_use = false;
var megasocialpopup_use_event;
var megasocialpopup_countdown;
var megasocialpopup_timeout;
var megasocialpopup_redirect_url;
var megasocialpopup_scroll_lock = false;
var megasocialpopup_idle_counter = 0;
var megasocialpopup_idle_timeout;
var megasocialpopup_lock = false;
var megasocialpopup_disable_close = false;

function megasocialpopup_open() {
	try {
		if (!megasocialpopup_use) {
			megasocialpopup_use = true;
			var megasocialpopup_overlay_style = "style='background: "+megasocialpopup_value_overlay_bg_color+"; opacity: "+megasocialpopup_value_overlay_opacity+"; -ms-filter:\"progid:DXImageTransform.Microsoft.Alpha(Opacity="+parseInt(100*megasocialpopup_value_overlay_opacity)+")\"; filter:alpha(opacity=\""+parseInt(100*megasocialpopup_value_overlay_opacity)+"\";'";
			jQuery("body").append("<div id='megasocialpopup_overlay' "+megasocialpopup_overlay_style+"></div><div id='megasocialpopup_window' style='position: fixed; background:"+megasocialpopup_value_popup_bg_color+" url("+megasocialpopup_value_popup_bg_url+") 0 0 repeat;'></div>");
			
			var megasocialpopup_width = megasocialpopup_value_width + 30;
			var megasocialpopup_height = megasocialpopup_value_height + 40;

			var megasocialpopup_close_button = "";
			if (!megasocialpopup_disable_close) {
				jQuery("#megasocialpopup_overlay").click(megasocialpopup_close);
				megasocialpopup_close_button = '<span id="megasocialpopup_close" onclick="megasocialpopup_close();"></span>';
			}
			
			var window_width = jQuery(window).width();
			if (window_width > 0 && window_width < megasocialpopup_width+30) {
				megasocialpopup_width = window_width - 30;
			}
			
			jQuery("#megasocialpopup_window").append("<div id='megasocialpopup_content' style='width:"+parseInt(megasocialpopup_width-30, 10)+"px; min-height:"+parseInt(megasocialpopup_height-45, 10)+"px;'></div>"+megasocialpopup_close_button+"<span id='megasocialpopup_delay'></span>");

			jQuery("#megasocialpopup_content").append(jQuery("#megasocialpopup_container").children());
			jQuery("#megasocialpopup_window").bind('megasocialpopup_unload', function () {
				jQuery("#megasocialpopup_container").append(jQuery("#megasocialpopup_content").children() );
			});
			var content_height = jQuery("#megasocialpopup_content").height();
			if (content_height > megasocialpopup_height-45) {
				megasocialpopup_height = content_height + 30;
			}

			var window_height = jQuery(window).height();
			if (window_height > 0 && window_height < megasocialpopup_height+30) {
				megasocialpopup_height = window_height - 30;
			}
			
			jQuery("#megasocialpopup_window").css({
				marginLeft: '-'+parseInt((megasocialpopup_width / 2),10)+'px', 
				width: megasocialpopup_width+'px',
				marginTop: '-'+parseInt((megasocialpopup_height / 2),10)+'px',
				height: megasocialpopup_height+'px'
			});
			jQuery("#megasocialpopup_window").css({
				"visibility" : "visible"
			});
		}
	} catch(e) {

	}
	return false;
}

function megasocialpopup_close() {
	megasocialpopup_use = false;
	megasocialpopup_disable_close = false;
	clearTimeout(megasocialpopup_timeout);
	if (megasocialpopup_use_event == "exit" && megasocialpopup_countdown == 0) {
		window.location.href = megasocialpopup_redirect_url;
	} else if (megasocialpopup_use_event == "idle") {
		megasocialpopup_idle_counter = 0;
		megasocialpopup_idle_timeout = setTimeout("megasocialpopup_idle_counter_handler();", 1000);	
	}
	jQuery("#megasocialpopup_delay").html("");
	jQuery("#megasocialpopup_window").fadeOut("fast", function() {
		jQuery("#megasocialpopup_window, #megasocialpopup_overlay").trigger("megasocialpopup_unload").unbind().remove();
	});
	return false;
}

function megasocialpopup_read_cookie(key) {
	var pairs = document.cookie.split("; ");
	for (var i = 0, pair; pair = pairs[i] && pairs[i].split("="); i++) {
		if (pair[0] === key) return pair[1] || "";
	}
	return null;
}

function megasocialpopup_write_cookie(key, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	} else var expires = "";
	document.cookie = key+"="+value+expires+"; path=/";
}

function megasocialpopup_plusone(plusone) {
	if (plusone.state == "on") {
		if (megasocialpopup_use) {
			megasocialpopup_write_cookie("megasocialpopup_"+megasocialpopup_value_md5url, megasocialpopup_value_cookie, 90);
			clearTimeout(megasocialpopup_timeout);
			megasocialpopup_countdown = 0;
			megasocialpopup_lock = true;
			megasocialpopup_close();
		}
	}
}

function megasocialpopup_linkedin() {
	if (megasocialpopup_use) {
		megasocialpopup_write_cookie("megasocialpopup_"+megasocialpopup_value_md5url, megasocialpopup_value_cookie, 90);
		clearTimeout(megasocialpopup_timeout);
		megasocialpopup_countdown = 0;
		megasocialpopup_lock = true;
		megasocialpopup_close();
	}
}

function megasocialpopup_countdown_string(value) {
	var result = '';
	var hours = Math.floor(value/3600);
	var minutes = Math.floor((value - 3600*hours)/60);
	var seconds = value - 3600*hours - 60*minutes;
	if (hours > 0) {
		if (hours > 9) result = hours.toString() + ":";
		else result = "0" + hours.toString() + ":";
	}
	if (minutes > 9) result = result + minutes.toString() + ":";
	else result = result + "0" + minutes.toString() + ":";
	if (seconds > 9) result = result + seconds.toString();
	else result = result + "0" + seconds.toString();
	return result;
}

function megasocialpopup_init() {
	if (megasocialpopup_value_facebook_enable == "on") {
		FB.init();
		FB.XFBML.parse();
		FB.Event.subscribe("edge.create", function(href) { 
			if (megasocialpopup_use) {
				megasocialpopup_write_cookie("megasocialpopup_"+megasocialpopup_value_md5url, megasocialpopup_value_cookie, 90);
				clearTimeout(megasocialpopup_timeout);
				megasocialpopup_countdown = 0;
				megasocialpopup_lock = true;
				megasocialpopup_close();
			}
		});
	}
	if (megasocialpopup_value_twitter_enable == "on") {
		twttr.ready(function (twttr) {
			twttr.events.bind("tweet", function(event) {
				if (megasocialpopup_use) {
					megasocialpopup_write_cookie("megasocialpopup_"+megasocialpopup_value_md5url, megasocialpopup_value_cookie, 90);
					clearTimeout(megasocialpopup_timeout);
					megasocialpopup_countdown = 0;
					megasocialpopup_lock = true;
					megasocialpopup_close();
				}
			});
		});
	}
	var megasocialpopup_cookie = megasocialpopup_read_cookie("megasocialpopup_"+megasocialpopup_value_md5url);
	if (megasocialpopup_cookie != megasocialpopup_value_cookie) {
		var window_width = jQuery(window).width();
		if (megasocialpopup_value_disable_mobile != "on" || window_width <= 0 || window_width >= megasocialpopup_value_width+30+30) {
			megasocialpopup_use = false;
			if (megasocialpopup_value_load_enable) {
				var megasocialpopup_tmp = megasocialpopup_read_cookie("megasocialpopup_load");
				if (megasocialpopup_tmp != megasocialpopup_value_cookie) {
					if (megasocialpopup_value_load_start_delay == 0) megasocialpopup_init_open("load", megasocialpopup_value_load_delay);
					else setTimeout(function() {megasocialpopup_init_open("load", megasocialpopup_value_load_delay);}, megasocialpopup_value_load_start_delay);
				}
			}
			if (megasocialpopup_value_exit_enable) {
				jQuery("a").each(function() {
					var href = this.href;
					var domain = document.domain;
					if (href.match("[http|https]://") != null && href.match("[http|https]://"+document.domain) == null) {
						for (var i=0; i<megasocialpopup_value_exit_excluded.length; i++) {
							if (href.match(megasocialpopup_value_exit_excluded[i]) != null) {
								return;
							}
						}
						jQuery(this).click(function() {
							megasocialpopup_redirect_url = this.href;
							return !megasocialpopup_init_open("exit", megasocialpopup_value_exit_delay);
						});
					}
				});
			}
			if (megasocialpopup_value_scroll_enable) {
				jQuery(window).scroll(function() {
					var position = jQuery(window).scrollTop();
					var megasocialpopup_tmp = megasocialpopup_read_cookie("megasocialpopup_scroll");
					if (megasocialpopup_tmp != megasocialpopup_value_cookie) {
						if (!megasocialpopup_use) {
							if (position >= megasocialpopup_value_scroll_offset && !megasocialpopup_scroll_lock) {
								megasocialpopup_init_open("scroll", 0);
							}
						}
					}
				});
			}
			if (megasocialpopup_value_copy_enable) {
				jQuery(window).bind("copy", function(e) {
					if (megasocialpopup_lock == false) {
						if (megasocialpopup_value_copy_block == "on") e.preventDefault();
						megasocialpopup_init_open("copy", 0);
						if (megasocialpopup_value_copy_block == "on") return false;
						return true;
					} else return true;
				});
			}
			if (megasocialpopup_value_context_enable) {
				jQuery(window).bind("contextmenu", function(e) {
					if (megasocialpopup_lock == false) {
						e.preventDefault();
						megasocialpopup_init_open("context", 0);
						return false;
					} else return true;
				});
			}
			if (megasocialpopup_value_idle_enable) {
				jQuery(window).mousemove(function(event) {
					megasocialpopup_idle_counter = 0;
				});
				jQuery(window).click(function(event) {
					megasocialpopup_idle_counter = 0;
				});
				jQuery(window).keypress(function(event) {
					megasocialpopup_idle_counter = 0;
				});
				jQuery(window).scroll(function(event) {
					megasocialpopup_idle_counter = 0;
				});
				megasocialpopup_idle_timeout = setTimeout("megasocialpopup_idle_counter_handler();", 1000);
			}
		}
	}
	jQuery(".megasocialpopup_click, .megasocialpopup").click(function() {
		megasocialpopup_open("click", 0);
		return false;
	});
}

function megasocialpopup_idle_counter_handler() {
	if (megasocialpopup_idle_counter >= megasocialpopup_value_idle_delay) {
		megasocialpopup_init_open("idle", 0);
	} else {
		megasocialpopup_idle_counter = megasocialpopup_idle_counter + 1;
		megasocialpopup_idle_timeout = setTimeout("megasocialpopup_idle_counter_handler();", 1000);
	}
}

function megasocialpopup_init_open(event, delay) {
	if (megasocialpopup_use == false && megasocialpopup_lock == false) {
		megasocialpopup_use_event = event;
		megasocialpopup_countdown = delay;
		if (event == "load" && megasocialpopup_value_load_disable_close == "on") megasocialpopup_disable_close = true;
		if (event == "load" && megasocialpopup_value_load_once_per_visit == "on") megasocialpopup_write_cookie("megasocialpopup_load", megasocialpopup_value_cookie, 0);
		else if (event == "scroll" && megasocialpopup_value_scroll_once_per_visit == "on") megasocialpopup_write_cookie("megasocialpopup_scroll", megasocialpopup_value_cookie, 0);
		if (event == "scroll") megasocialpopup_scroll_lock = true;
		if (delay > 0) {
			megasocialpopup_timeout = setTimeout("megasocialpopup_counter();", 1000);
		}
		megasocialpopup_open();
		return true;
	} else return false;
}

function megasocialpopup_counter() {
	if (megasocialpopup_countdown == 0) {
		clearTimeout(megasocialpopup_timeout);
		megasocialpopup_close();
	} else {
		megasocialpopup_countdown = megasocialpopup_countdown - 1;
		jQuery("#megasocialpopup_delay").html(megasocialpopup_countdown_string(megasocialpopup_countdown));
		megasocialpopup_timeout = setTimeout("megasocialpopup_counter();", 1000);
	}
}
