(function ($) {
  $.fn.FlowupLabels = function (options) {
    var defaults = {
        // Useful if you pre-fill input fields or if localstorage/sessionstorage is used.
        feature_onLoadInit: true,

        // Class names used for focus and populated statuses
        class_focused: "focused",

        class_populated: "populated",
      },
      settings = $.extend({}, defaults, options);

    return this.each(function () {
      var $scope = $(this);

      $scope
        .on("focus.flowupLabelsEvt", ".fl_input", function () {
          $(this).closest(".fl_wrap").addClass(settings.class_focused);

          //if( $(this).is(":focus") ) {
          //	$(this).next("i").css('padding-top','8px');
          //}
        })
        .on("blur.flowupLabelsEvt", ".fl_input", function () {
          var $this = $(this);

          if ($this.val().length) {
            $this
              .closest(".fl_wrap")
              .addClass(settings.class_populated)
              .removeClass(settings.class_focused);
          } else {
            $this.next("i").css("padding-top", "0px");

            $this
              .closest(".fl_wrap")
              .removeClass(
                settings.class_populated + " " + settings.class_focused
              );
          }
        });

      // On page load, make sure it looks good
      if (settings.feature_onLoadInit) {
        $scope.find(".fl_input").trigger("blur.flowupLabelsEvt");
      }
    });
  };
})(jQuery);

$(document).ready(function () {
  (function () {
    $(".FlowupLabels").FlowupLabels({
      // Handles the possibility of having input boxes prefilled on page load
      feature_onInitLoad: true,

      // Class when focusing an input
      class_focused: "focused",

      // Class when an input has text entered
      class_populated: "populated",
    });
  })();
});
