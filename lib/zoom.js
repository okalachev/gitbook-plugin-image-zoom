require(['gitbook', 'jQuery'], function (gitbook, $) {

	gitbook.events.bind('page.change', function() {
		$('.book-body img').each(function() {
			if ((this.width < this.naturalWidth) || (this.height < this.naturalHeight)) {
				$(this).addClass('zoom');
			}
		});
	});

	var body = $('body');

	var overlay = $('<div>').addClass('zoom-overlay');
	overlay.appendTo(body);
	var overlayImg;

	body.on('click.zoom', '.book-body img', function (e) {
		if (body.hasClass('zoom-zoomed')) return;

		var target = $(e.target);

		if (!target.hasClass('zoom') && target.width() < e.target.naturalWidth && target.height() < e.targetHeight) {
			return;
		}

		target.addClass('zoom-current-img');
		var pos = target.offset();

		overlayImg = $('<img/>')
			.addClass('zoom-overlay-img')
			.attr('src', $(e.target).attr('src'))
			.css('top', pos.top)
			.css('left', pos.left)
			.css('width', target.width())
			.css('height', target.height());

		overlayImg.appendTo(body);

		setTimeout(function() {
			body.addClass('zoom-zoomed');

			body.one('transitionend', function() {
				$('.body-inner').on('scroll.zoom', scroll);
			})
		});
	});

	function scroll() {
		unzoom();
	}

	function unzoom() {
		if (!body.hasClass('zoom-zoomed')) {
			return;
		}

		body.removeClass('zoom-zoomed').addClass('zoom-unzooming');
		overlayImg.one('transitionend', function() {
			overlayImg.remove();
			body.removeClass('zoom-unzooming');
			$('.body-inner').off('scroll.zoom');
		});
	}

	body.on('click', unzoom);
	body.on('click', '.zoom-overlay-img', unzoom);
})
