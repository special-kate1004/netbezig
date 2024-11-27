$(document).ready(function () {
  //VOUCHER REDIRECT
  var exclude_nl = [
    "2829",
    "2865",
    "2823",
    "2831",
    "2812",
    "2574",
    "2887",
    "2813",
    "2896",
    "2745",
    "2818",
    "2660",
    "2960",
    "2953",
    "2964",
    "2950",
    "2811",
    "3011",
    "3018",
    "3071",
    "3034",
    "3060",
  ];

  if (exclude_nl.indexOf(offer_id) === -1 && country === "nl") {
    //check if id telnr-bevestiging exists
    if ($("#telnr-bevestiging").length > 0) {
      //override redirect function
      var origRedirect = redirect;

      redirect = function () {
        if (typeof hash !== "undefined" && hash.length > 0) {
          $("html, body").animate({ scrollTop: $("#body").offset().top });
          $("#telnr-bevestiging").modal("hide");
          clearInterval(interval_bevestig);
          setTimeout(function () {
            document.location.href =
              "https://waardebonnen.consumentcentraal.nl?h=" +
              hash +
              "&oid=" +
              offer_id;
          }, 3000);
        } else {
          return origRedirect;
        }
      };
    } else {
      //check if redirect_timeout not undefined
      //clear redirect_timeout
      var myInterval = setInterval(function () {
        if (typeof redirect_timeout !== "undefined") {
          if (typeof hash !== "undefined" && hash.length > 0) {
            clearTimeout(redirect_timeout);
            clearInterval(redirect_timeout);
            clearInterval(myInterval);
            setTimeout(function () {
              document.location.href =
                "https://waardebonnen.consumentcentraal.nl?h=" +
                hash +
                "&oid=" +
                offer_id;
            }, 3000);
          }
        }
      }, 500);
    }
  }

  var exclude_be = ["3313"];

  if (exclude_be.indexOf(offer_id) === -1 && country === "be") {
    //check if id telnr-bevestiging exists
    if ($("#telnr-bevestiging").length > 0) {
      //override redirect function
      var origRedirect = redirect;

      redirect = function () {
        if (typeof hash !== "undefined" && hash.length > 0) {
          $("html, body").animate({ scrollTop: $("#body").offset().top });
          $("#telnr-bevestiging").modal("hide");
          clearInterval(interval_bevestig);
          setTimeout(function () {
            document.location.href =
              "https://waardebonnen.consumentcentraal.be?h=" +
              hash +
              "&oid=" +
              offer_id;
          }, 3000);
        } else {
          return origRedirect;
        }
      };
    } else {
      //check if redirect_timeout not undefined
      //clear redirect_timeout
      var myInterval = setInterval(function () {
        if (typeof redirect_timeout !== "undefined") {
          if (typeof hash !== "undefined" && hash.length > 0) {
            clearTimeout(redirect_timeout);
            clearInterval(redirect_timeout);
            clearInterval(myInterval);
            setTimeout(function () {
              document.location.href =
                "https://waardebonnen.consumentcentraal.be?h=" +
                hash +
                "&oid=" +
                offer_id;
            }, 3000);
          }
        }
      }, 500);
    }
  }

  //END VOUCHER REDIRECT

  //prefill hack
  $("input, textarea")
    .not(":input[type=button], :input[type=submit], :input[type=reset]")
    .on("input", function (e) {
      let id = e.target.id;
      if (
        e.originalEvent.inputType === "insertReplacementText" ||
        typeof e.originalEvent.inputType === "undefined"
      ) {
        console.log("trigger");
        $("#" + id).trigger("keypress");
      }
    });

  //RESET ALL FORMS ON LOAD
  for (i = 0; i < document.forms.length; i++) {
    document.forms[i].reset();
  }

  //Prevent default form submit
  $("form").submit(function (event) {
    event.preventDefault();
  });

  //HACK FOR GOOGLE TRANSLATE
  $("#campaign_question").data(
    "translate",
    $("#campaign_question")
      .text()
      .replace(/<(.|\n)*?>/g, "")
  );
  $("#campaign_answer").data(
    "translate",
    $("#campaign_answer")
      .text()
      .replace(/<(.|\n)*?>/g, "")
  );

  // GET SELECTBOX OPTIONS
  $.ajax({
    method: "POST",
    url: "https://sendtportal.com/get_questions",
    dataType: "json",
    data: {
      campaign_id: campaign_id,
    },
    success: function (result) {
      var obj = {};
      if (result !== "Cannot fetch questions") {
        $.each(result.data.questions, function (index, value) {
          if (value.option_values !== null) {
            obj = JSON.parse(value.option_values);
            for (var i in obj) {
              $("#" + value.name).append(
                $("<option>", { value: i }).text(obj[i])
              );
            }
          }
        });
      }
    },
  });

  //INPUT FORMATTING BY ZMINIC
  $.fn.blockInput = function (options) {
    function findDelta(value, prevValue) {
      var delta = "";
      for (var i = 0; i < value.length; i++) {
        var str =
          value.substr(0, i) +
          value.substr(i + value.length - prevValue.length);
        if (str === prevValue) {
          delta = value.substr(i, value.length - prevValue.length);
        }
      }
      return delta;
    }
    function isValidChar(c) {
      return new RegExp(options.regex).test(c);
    }
    function isValidString(str) {
      for (var i = 0; i < str.length; i++) {
        if (!isValidChar(str.substr(i, 1))) {
          return false;
        }
      }
      return true;
    }
    this.filter("input,textarea")
      .on("input", function () {
        var val = this.value;
        var lastVal = $(this).data("lastVal");
        // get inserted chars
        if (typeof lastVal == "undefined") {
          lastVal = "";
        }
        var inserted = findDelta(val, lastVal);
        // get removed chars
        var removed = findDelta(lastVal, val);
        // determine if user pasted content
        var pasted = inserted.length > 1 || (!inserted && !removed);
        //MODIFIED BY JP - DUTCH/BELGIAN/GERMAN
        if (this.id === "telefoonnummer") {
          if (typeof country !== "undefined") {
            if (country === "nl" || country === "be" || country === "de") {
              if (pasted) {
                if (lastVal === "" && val.substr(0, 1) !== "0") {
                  this.value = lastVal;
                } else if (lastVal === "" && val.substr(0, 2) === "00") {
                  this.value = lastVal;
                } else if (!isValidString(val)) {
                  this.value = lastVal;
                }
              } else if (!removed) {
                if (lastVal === "" && val !== "0") {
                  this.value = lastVal;
                } else if (lastVal === "0" && val === "00") {
                  this.value = lastVal;
                } else if (!isValidChar(inserted)) {
                  this.value = lastVal;
                }
              }
            }
          } else {
            console.log("variable country not set");
          }
        } else {
          if (pasted) {
            if (!isValidString(val)) {
              this.value = lastVal;
            }
          } else if (!removed) {
            if (!isValidChar(inserted)) {
              this.value = lastVal;
            }
          }
        }
        //END MODIFIED BY JP
        // store current value as last value
        $(this).data("lastVal", this.value);
      })
      .on("focus", function () {
        $(this).data("lastVal", this.value);
      });

    return this;
  };

  $("#telefoonnummer, #huisnummer").blockInput({ regex: "[0-9]" });

  $("#voornaam, #tussenvoegsel, #achternaam").blockInput({
    regex: "[ÆæØøÅåßa-zA-Z ]",
  }); //    ÆæØøÅåß

  // add data-toggle="validator" to your form tag
  $('form[data-toggle="validator"]').on("submit", function (e) {
    window.setTimeout(function () {
      var errors = $(".has-error");
      if (errors.length) {
        $("html, body").animate({ scrollTop: errors.offset().top - 50 }, 500);
      }
    }, 0);
  });

  // Make the first letter Capital
  $('input[name="voornaam"], input[name="achternaam"]').keyup(function (evt) {
    var txt = $(this).val();
    // Regex taken from php.js (http://phpjs.org/functions/ucwords:569)
    $(this).val(
      txt.replace(/^(.)|\s(.)/g, function ($1) {
        return $1.toUpperCase();
      })
    );
  });
});
