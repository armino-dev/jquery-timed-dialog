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
            buttons: {},
        };

        const allowedTypes = ['info', 'confirmation'];
        const allowedStyles = ['info', 'warning', 'danger'];
        const infoDialogButtons = {
            'dismiss': {
                text: 'Ok',
                action: () => {}
            },
        };
        const confirmDialogButtons = {
            'confirm': {
                text: 'Ok',
                action: () => {
                    return
                }
            },
            'dismiss': {
                text: 'Dismiss',
                action: () => {
                    return
                }
            },
        };


        var settings = $.extend({}, this.defaults, options);

        console.log('settings: ', settings);

        const overlayCss = {
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'width': $(window).width() + 'px',
            'height': $(window).height() + 'px',
            'z-index': '2000',
        };
        const dialogCss = {
            'position': 'absolute',
            'width': (settings.width + 'px'),
            'height': (settings.height + 'px'),
            'line-height': '20px',
            'z-index': '2001',
        };

        switch (settings.type) {
            default:
            case 'info':
                settings.buttons = infoDialogButtons;
                settings.buttons.dismiss.action = () => {
                    $(dialog).fadeOut();
                    $(overlay).fadeOut(500, () => {
                        $(overlay).remove();
                    });

                }
                break;
            case 'confirm':
                settings.buttons = confirmDialogButtons;
                break;
        }

        console.log('settings: ', settings);

        const random = randomString(5);

        const containerId = 'timed-dialog-' + random;

        const overlay = $(`<div id="overlay-${containerId}" class="timed-dialog-overlay"></div>`);

        const dialog = $(`
                    <div id="${containerId}" class="timed-dialog">
                        <div class="header">
                            <h1 class="title">${settings.title}</h1>
                        </div>
                        <div class="body">${settings.body}</div>
                        <div class="action"> </div>
                    </div>
            `);

        const btnDismiss = $(`
                <button class="btn btn-primary" id="btn-dismiss-${random}">${settings.buttons.dismiss.text}</button>
                `);

        // const btnConfirm = $(`
        //         <button class="btn btn-primary" id="btn-confirm-${random}">${settings.buttons.confirm.text}</button>
        //         `);

        if (this.length > 1) {
            this.each(function() {
                $(this).timedDialog(options);
            });

            return this;
        }

        if (Object.keys(settings.buttons).length > 0) {
            console.log('this: ', this);
            console.log('settings.buttons: ', settings.buttons, ' length: ', Object.keys(settings.buttons).length);
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

        }

        $(window).resize(() => {
            $(overlay).css({
                'width': $(window).width() + 'px',
                'height': $(window).height() + 'px'
            });
            $(dialog).css({
                'left': ($(overlay).width() - settings.width) / 2 + "px",
                'top': ($(overlay).height() - settings.height) / 2 + "px"
            });
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
            $(btnDismiss).click((e) => {
                settings.buttons.dismiss.action();
            });
            $(overlay).click((e) => {
                settings.buttons.dismiss.action();
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

            bindEvents();

            $(dialog).hide().fadeIn( 300, autoClose());





            return this;
        }

        return this.initialize();
    };
})(jQuery);
