function navigatorFloat(){
	var nav = $('.dangqian');
	var scroll = $('.layout-middle-center');
	if(nav[0] && scroll[0])
		scroll.scroll(function(e){
			if(this.scrollTop > 35){
				nav.css({
					position: 'fixed',
					left: 1,
					right: 18,
					'z-index': 100
				});
			}else{
				nav.css({
					position: 'static'
				});
			}
		});
}

$(function(){
	navigatorFloat();
});