describe("jQuery Timed Dialog Plugin", () => {

    /**
     * Check to see if jQuery is accessible
     */
    it("Should find jQuery", () => {
        expect($).not.toBeNull();
    });

    /**
     * Check to see if overlay is created
     */
    let options = {
        type: 'info',
        title: 'Test',
        body: 'Testing the dialog',
        width: 400,
        height: 280,
    };

    beforeEach(() => {
        //start clean, in case something gets stuck somewhere
        let overlay = document.querySelectorAll('.timed-dialog-overlay'); 
        let count  = overlay.length;
        if (count > 0) {
            $(overlay).remove();
        }
    });

    describe("General functionality", () => {
        let dialogOne = $().timedDialog(options);
        let overlayDivs = document.querySelector('.timed-dialog-overlay');
        let dialogDivs = document.querySelector('.timed-dialog');

        it("Should exist", () => {
            expect(overlayDivs.nodeName).toBe('DIV');
        });

        it("Should exist", () => {
            expect(dialogDivs.nodeName).toBe('DIV');
        });

        /**
         * Only one modal at a time
         * If we add another timed dialog
         * Should be only one overlay and one dialog
         */
        let dialogTwo = $().timedDialog();
        let overlaysCount = document.querySelectorAll('.timed-dialog-overlay').length;
        let dialogsCount = document.querySelectorAll('.timed-dialog').length;

        it("Should be only one overlay", () => {
            expect(overlaysCount).toBe(1);
        });

        it("Should be only one dialog", () => {
            expect(dialogsCount).toBe(1);
        });
       
    });

    describe ("Buttons interactions", () => {
        it("Should close on dialog btnDismiss click", (done) => {
            let dialog = $().timedDialog(options);
            const random = dialog.random;
    
            let btnDismiss = $(document.querySelector(`#btn-dismiss-${random}`));
            btnDismiss.click();
    
            setTimeout(() => {
                expect($(`#timed-dialog-${random}`).length).toBeLessThan(1);
                done();
            }, 600);
        });
    
        it("Should close on dialog top right button click", (done) => {            
            let dialog = $().timedDialog(options);
            const random = dialog.random;

            let btnClose = $(document.querySelector(`#btn-close-${random}`));
            
            btnClose.click();
    
            setTimeout(() => {
                expect($(`#timed-dialog-${random}`).length).toBeLessThan(1);
                done();
            }, 600);
    
        });

        it("Should execute specified callback on options", (done) => {
            let someCallback = () => {
                const body = $('body');
                $('<div class="red">I am an added div</div>').appendTo(body).hide().slideDown();
            };
            options.type = 'confirmation';
            options.btnConfirm = {text: 'Proceed', action: someCallback};
           
            let dialog = $().timedDialog(options);
            const random = dialog.random;

            let btnConfirm = $(document.querySelector(`#btn-confirm-${random}`));
          
            expect(btnConfirm.text().trim()).toBe('Proceed'); 

            btnConfirm.click();

            setTimeout( () => {
                expect(document.querySelectorAll('div.red').length).toBeGreaterThan(0);
                expect($(`#timed-dialog-${random}`).length).toBeLessThan(1);
                done();
            }, 600);     

        });
    }); 

    

});
