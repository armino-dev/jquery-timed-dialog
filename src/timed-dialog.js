(function ($) {
    $.fn.timedDialog = function (options) {
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

        let settings = $.extend({}, this.defaults, options);

        const body = document.body;
        const html = document.documentElement;

        const heights = [body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight];
        const widths = [body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth];

        const documentHeight = Math.max(...heights);
        const documentWidth = Math.max(...widths);

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

        // const allowedStyles = ['info', 'warning', 'danger'];

        let animationRequestId = 0;

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
                            <div class="icon"><span>${settings.icon}</span></div>
                            <h1 class="title">${settings.title}</h1>
                        </div>
                        <div class="body">${settings.body}</div>
                        <div class="action"> </div>
                    </div>
            `);

        const btnDismiss = $(`<button 
            class="btn btn-primary" 
            style="position:relative;" 
            id="btn-dismiss-${random}">
                <span class="text">${settings.btnDismiss.text}</span>
            </button>
        `);

        const btnConfirm = $(`<button 
            class="btn btn-primary" 
            id="btn-confirm-${random}">
                ${settings.btnConfirm.text}
            </button>
        `);

        const btnClose = $(`<button id="btn-close-${random}" class="btn btn-close">x</button>`);

        if (this.length > 1) {
            this.each(function () {
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
            let text = "";
            const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }

        function dismissDialog() {
            if (animationRequestId) {
                window.cancelAnimationFrame(animationRequestId);
            }

            $(dialog).fadeOut();
            $(overlay).fadeOut(500, () => {
                $(overlay).remove();
            });
        }

        $(window).on('resize', () => {
            redraw();
        });

        $(document).on('scroll', () => {
            redraw();
        });

        function autoClose(counter) {
            let autoCloseText = $(btnDismiss).children('span.text').html();
            $(btnDismiss).children('span.text').html(autoCloseText + ` (${counter})`);
            let timeout = setInterval(() => {
                counter--;
                $(btnDismiss).children('span.text').html(autoCloseText + ` (${counter})`);
                if (counter < 1) {
                    clearInterval(timeout);
                    $(btnDismiss).trigger('click');
                }
            }, 1000);
        }

        function bindEvents() {
            $(btnDismiss).on('click', () => {
                dismissDialog();
            });

            $(btnDismiss).on('mouseenter', () => {
                let meter = $('span.meter');
                meter.addClass('hover');
            });

            $(btnDismiss).on('mouseleave', () => {
                let meter = $('span.meter');
                meter.removeClass('hover');
            });

            $(btnClose).on('click', () => {
                dismissDialog();
            });

            $(btnConfirm).on('click', () => {
                if (typeof settings.btnConfirm.action == 'function') {
                    try {
                        settings.btnConfirm.action();
                    } catch (e) {
                        console.error(e)
                    }
                    dismissDialog();
                } else {
                    throw new Error('Confirmation button action must be a callback');
                }
            });

            $(overlay).on('click', (evt) => {
                // close only if target is not inside our dialogue
                // or else the overlay will capture the clicks from
                // our dialog elements, if any
                if (dialog.not(evt.target) && dialog.has(evt.target).length === 0) {
                    dismissDialog();
                }
            });

            $(document).on('keydown', (evt) => {
                if (settings.closeOnEscape) {
                    if (evt.key === 'Escape') {
                        dismissDialog();
                    }
                }
            });
        }

        function animateTimeout() {
            const width = $(btnDismiss).width();
            const meter = $('<span class="meter"></span>');
            $(meter).appendTo(btnDismiss);
            const timeDelta = 1000 * settings.timeout;
            let timedWidth = width;
            let start;

            const draw = (timestamp) => {
                if (start === undefined) {
                    start = timestamp;
                }
                const elapsed = timestamp - start;

                $(meter).width(timedWidth);

                timedWidth = width * (1 - elapsed / timeDelta);

                if (elapsed < timeDelta) {
                    animationRequestId = window.requestAnimationFrame(draw);
                }
            }

            animationRequestId = window.requestAnimationFrame(draw);
        }

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

        this.random = random;
        this.overlay = overlay;
        this.dialog = dialog;
        this.dismissDialog = dismissDialog;

        this.initialize = () => {
            const isAlreadyOpen = $('.timed-dialog-overlay').length;
            if (isAlreadyOpen) return;

            $('body').append(overlay);

            if (settings.isModal) {
                overlay.css(overlayCss);
            }

            $(dialog).appendTo(overlay);
            $(dialog).css(dialogCss);

            $(window).trigger('resize');
            $(btnClose).appendTo(dialog.children('div.header'));
            $(btnDismiss).appendTo(dialog.children('.action'));
            if (settings.type == 'confirmation') {
                $(btnConfirm).appendTo(dialog.children('.action'));
            }

            bindEvents();

            $(dialog).hide().fadeIn(300, () => {
                if (settings.closeOnTimer) {
                    autoClose(settings.timeout);
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
