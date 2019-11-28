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
            isModal: true,
            btnDismiss: {
                text: "Dismiss",
                class: '',
            },
            btnConfirm: {
                text: "Confirm",
                action: () => {return},
                class: '',
            }
        };


        var settings = $.extend({}, this.defaults, options);


        const supportsShadowDOMV1 = !!HTMLElement.prototype.attachShadow;
        console.log(supportsShadowDOMV1);


        const body = document.body;
        const html = document.documentElement;

        var documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        var documentWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);

        console.log("Height: ", documentHeight, "Width: ",documentWidth);

        const allowedTypes = ['info', 'confirmation'];
        const allowedStyles = ['info', 'warning', 'danger'];




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
                            <div class="header-icon">i</div>
                            <h1 class="title">${settings.title}</h1>
                            <button>x</button>
                        </div>
                        <div class="body">${settings.body}</div>
                        <div class="action"> </div>
                    </div>
            `);

        var btnDismiss = $(`
            <button class="btn btn-primary" id="btn-dismiss-${random}">${settings.btnDismiss.text}</button>
        `);
        var btnConfirm = $(`
            <button class="btn btn-primary" id="btn-confirm-${random}">${settings.btnConfirm.text}</button>
        `);

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

        function autoClose() {
            if (settings.closeOnTimer) {
                const timeout = setInterval(() => {
                    $(btnDismiss).html(autoCloseText + ` (${counter})`);
                    counter--;
                    if (counter < 1) {
                        counter = 0;
                        clearInterval(timeout);
                        $(btnDismiss).click();
                    }
                }, 1000);
            }
        }

        function bindEvents() {
            $(btnDismiss).click( () => {
                dismissDialog();
            });

            $(btnConfirm).click( () => {
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

            $(overlay).click( (evt) => {
                // close only if target is not inside our dialogue
                // or else the overlay will capture the clicks from
                // our dialog elements, if any
                if (dialog.not(evt.target) && dialog.has(evt.target).length === 0) {
                    dismissDialog();
                }
            });
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

            $(btnDismiss).appendTo(dialog.children('.action'));
            if (settings.type == 'confirm') {
                $(btnConfirm).appendTo(dialog.children('.action'));
            }


            bindEvents();

            $(dialog).hide().fadeIn( 300, autoClose());





            return this;
        }

        return this.initialize();
    };
})(jQuery);
