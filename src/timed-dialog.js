(function($) {
    $.fn.timedDialog = function(options) {
        this.defaults = {
            type: 'info',
            title: 'Info',
            body: 'This is the default body text. You might replace this with your own.',
            width: 320,
            height: 240,
            appendTo: 'body',
            closeOnEscape: true,
            closeOnTimer: false,
            timeout: 10, //ten seconds default timeout
            timeoutAnimation: true,
            isModal: true,
            btnDismiss: {
                text: "Dismiss",
                class: '',
            },
            btnConfirm: {
                text: "Confirm",
                action: () => {
                    return
                },
                class: '',
            }
        };


        var settings = $.extend({}, this.defaults, options);

        const supportsShadowDOMV1 = !!HTMLElement.prototype.attachShadow;
        console.log("Support for shadowDom: ", supportsShadowDOMV1);

        const body = document.body;
        const html = document.documentElement;

        var documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        var documentWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);

        const allowedTypes = {
            info: {
                icon: {
                    src: "i"
                },
                style: 'info',
            },
            confirmation: {
                icon: {
                    src: "?"
                },
                style: 'info',
            }
        };
        const allowedStyles = ['info', 'warning', 'danger'];


        settings.icon = allowedTypes[settings.type].icon.src;

        const overlayCss = {
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'width': documentWidth + 'px',
            'height': documentHeight + 'px',
            'z-index': '2000',
        };
        const dialogCss = {
            'position': 'absolute',
            'width': (settings.width + 'px'),
            'height': (settings.height + 'px'),
            'line-height': '20px',
            'z-index': '2001',
        };


        const random = randomString(5);

        const containerId = 'timed-dialog-' + random;

        const overlay = $(`<div id="overlay-${containerId}" class="timed-dialog-overlay"></div>`);

        const dialog = $(`
                    <div id="${containerId}" class="timed-dialog">
                        <div class="header">
                            <div class="icon">${settings.icon}</div>
                            <h1 class="title">${settings.title}</h1>
                        </div>
                        <div class="body">${settings.body}</div>
                        <div class="action"> </div>
                    </div>
            `);

        const btnDismiss = $(`
            <button class="btn btn-primary" style="position:relative;" id="btn-dismiss-${random}"><span class="text">${settings.btnDismiss.text}</span></button>
        `);
        const btnConfirm = $(`
            <button class="btn btn-primary" id="btn-confirm-${random}">${settings.btnConfirm.text}</button>
        `);

        const btnClose = $(`<button id="button-close-${random}" class="btn btn-close">x</button>`);

        if (this.length > 1) {
            this.each(function() {
                $(this).timedDialog(options);
            });

            return this;
        }

        /**
         * Generate a random alphanumeric string
         * @param  int length      The length of the string to generate
         * @return string
         */
        function randomString(length) {
            var text = "";
            const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }

        /**
         * [dismissDialog description]
         * @return {[type]} [description]
         */
        function dismissDialog() {
            $(dialog).fadeOut();
            $(overlay).fadeOut(500, () => {
                $(overlay).remove();
            });
        }

        $(window).resize(() => {
            redraw();
        });

        $(document).scroll(() => {
            redraw();
        });

        var autoCloseText = $(btnDismiss).html();
        let counter = settings.timeout;

        /**
         * [autoClose description]
         * @return {[type]} [description]
         */
        function autoClose() {
            const timeout = setInterval(() => {
                $(btnDismiss).children('span.text').html(autoCloseText + ` (${counter})`);
                counter--;
                if (counter < 1) {
                    counter = 0;
                    clearInterval(timeout);
                    $(btnDismiss).click();
                }
            }, 1000);
        }

        /**
         * [bindEvents description]
         * @return {[type]} [description]
         */
        function bindEvents() {
            $(btnDismiss).click(() => {
                dismissDialog();
            });

            $(btnClose).click(() => {
                dismissDialog();
            });

            $(btnConfirm).click(() => {
                if (typeof settings.btnConfirm.action == 'function') {
                    try {
                        settings.btnConfirm.action();
                    } catch (e) {
                        console.log('')
                    }
                    dismissDialog();
                } else {
                    throw new Error('Confirmation button action must be a callback');
                }
            });

            $(overlay).click((evt) => {
                // close only if target is not inside our dialogue
                // or else the overlay will capture the clicks from
                // our dialog elements, if any
                if (dialog.not(evt.target) && dialog.has(evt.target).length === 0) {
                    dismissDialog();
                }
            });
        }

        /**
         * [animateTimeout description]
         * @return {[type]} [description]
         */
        function animateTimeout() {
            let width = $(btnDismiss).width();
            let meter = $('<span class="meter"></span>');
            $(meter).appendTo(btnDismiss);
            let timeDelta = 1000 * settings.timeout / width;
            let timedWidth = width;
            let interval = setInterval(() => {
                $(meter).width(timedWidth);
                timedWidth--;
                if (timedWidth < 1) clearInterval(interval);
            }, timeDelta);
        }

        /**
         * [redraw description]
         * @return {[type]} [description]
         */
        function redraw() {
            $(overlay).css({
                'width': documentWidth + 'px',
                'height': documentHeight + 'px'
            });
            $(dialog).css({
                'left': $(document).scrollLeft() + ($(window).width() - settings.width) / 2 + "px",
                'top': $(document).scrollTop() + ($(window).height() - settings.height) / 2 + "px"
            });
        }


        /**
         * [initialize description]
         * @return {[type]} [description]
         */
        this.initialize = () => {
            const isAlreadyOpen = $('.timed-dialog-overlay').length;
            if (isAlreadyOpen) return;

            $('body').append(overlay);

            if (settings.isModal) {
                overlay.css(overlayCss);
            }

            $(dialog).appendTo(overlay);
            $(dialog).css(dialogCss);

            $(window).resize();
            $(btnClose).appendTo(dialog.children('div.header'));
            $(btnDismiss).appendTo(dialog.children('.action'));
            if (settings.type == 'confirmation') {
                $(btnConfirm).appendTo(dialog.children('.action'));
            }

            bindEvents();

            $(dialog).hide().fadeIn(300, () => {
                if (settings.closeOnTimer) {
                    autoClose();
                    if (settings.timeoutAnimation) {
                        animateTimeout();
                    }
                }
            });


            return this;
        }

        return this.initialize();
    };
})(jQuery);
