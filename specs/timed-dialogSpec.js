describe("jQuery Timed Dialog Plugin", function () {

  /**
   * Check to see if jQuery is accessible
   */
  it("Should find jQuery", function () {
        expect($).not.toBeNull();
  });

  /**
   * Check to see if overlay is created
   */
  var dialogOne = $().timedDialog();
  var overlayDiv = document.querySelector('.timed-dialog-overlay');
  var dialogDiv = document.querySelector('.timed-dialog');

  it("Should exist", function () {
      expect(overlayDiv.nodeName).toBe('DIV');
  });

  it("Should exist", function(){
      expect(dialogDiv.nodeName).toBe('DIV');
  });

  /**
   * Only one modal at a time
   * If we add another timed dialog
   * Should be only one overlay
   */
  var dialogTwo = $().timedDialog();
  var overlayCount = document.querySelectorAll('.timed-dialog-overlay').length;
  var dialogCount = document.querySelectorAll('.timed-dialog').length;

  it("Should be only one overlay", function () {
      expect(overlayCount).toBe(1);
  });

  it("Should be only one dialog", function () {
      expect(dialogCount).toBe(1);
  });

});
