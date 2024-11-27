var redirect_url = "https://sendt.go2cloud.org/aff_c?offer_id=1733&aff_id=1231";
var redirect_timeout;
var hash;

var straatnaam = "";
var woonplaats = "";

$(document).ready(function () {
  var clicked = false;

  $("#form1")
    .bootstrapValidator({
      feedbackIcons: {
        valid: "glyphicon glyphicon-ok",
        invalid: "glyphicon glyphicon-remove",
        validating: "glyphicon glyphicon-refresh",
      },
      fields: {
        voornaam: {
          validators: {
            stringLength: {
              min: 2,
            },
            notEmpty: {
              message: "",
            },
          },
        },
        achternaam: {
          validators: {
            stringLength: {
              min: 2,
            },
            notEmpty: {
              message: "",
            },
          },
        },
        postcode: {
          validators: {
            stringLength: {
              min: 6,
            },
            callback: {
              callback: function (value, validator, $field) {
                var postcode = $("input[name=postcode]").val();
                var postcodeReg = /^[1-9][0-9]{3}[\s]?[A-Za-z]{2}$/i;
                var huisnummer = $("input[name=huisnummer]").val();

                //postalcode filter
                var exclude_two = ["43", "44", "45"];
                var exclude_four = [
                  "1791",
                  "8605",
                  "8881",
                  "8882",
                  "8883",
                  "8884",
                  "8885",
                  "8886",
                  "8887",
                  "8888",
                  "8889",
                  "8890",
                  "8891",
                  "8892",
                  "8893",
                  "8894",
                  "8895",
                  "8896",
                  "8899",
                  "9161",
                  "9162",
                  "9163",
                  "6814",
                  "9166",
                ];
                var post = true;

                if (exclude_two.indexOf(postcode.substr(0, 2)) !== -1) {
                  post = false;
                }

                if (exclude_four.indexOf(postcode.substr(0, 4)) !== -1) {
                  post = false;
                }
                if (post === true) {
                  if (!postcodeReg.test(postcode)) {
                    validator.updateStatus(
                      "postcode",
                      validator.STATUS_INVALID
                    );
                    return false;
                  } else {
                    if (huisnummer != "") {
                      $.post("general-bin/postalcodechecker/postalcode.php", {
                        type: "nl_sixpp",
                        postcode: postcode,
                        huisnummer: huisnummer,
                      }).done(function (data) {
                        data = JSON.parse(data);

                        if (data.status == "ok") {
                          straatnaam = data.results[0].street;
                          woonplaats = data.results[0].city;

                          validator.updateStatus(
                            "postcode",
                            validator.STATUS_VALID
                          );
                          validator.updateStatus(
                            "huisnummer",
                            validator.STATUS_VALID
                          );
                        } else {
                          straatnaam = "";
                          woonplaats = "";

                          validator.updateStatus(
                            "postcode",
                            validator.STATUS_INVALID
                          );
                          validator.updateStatus(
                            "huisnummer",
                            validator.STATUS_INVALID
                          );
                        }
                      });
                    }
                  }
                  return true;
                } else {
                  $(".form-holder").hide();
                  $(".helaas-pagina").fadeIn();
                  return false;
                }
              },
            },
          },
        },
        huisnummer: {
          validators: {
            notEmpty: {
              message: "Housenumber should not be empty",
            },
            stringLength: {
              min: 1,
            },
            callback: {
              callback: function (value, validator) {
                var postcode = $("input[name=postcode]").val();
                var postcodeReg = /^[1-9][0-9]{3}[\s]?[A-Za-z]{2}$/i;
                var huisnummer = $("input[name=huisnummer]").val();

                if (!postcodeReg.test(postcode)) {
                  validator.updateStatus("postcode", validator.STATUS_INVALID);
                  return false;
                } else {
                  if (huisnummer != "") {
                    $.post("general-bin/postalcodechecker/postalcode.php", {
                      type: "nl_sixpp",
                      postcode: postcode,
                      huisnummer: huisnummer,
                    }).done(function (data) {
                      data = JSON.parse(data);

                      if (data.status == "ok") {
                        straatnaam = data.results[0].street;
                        woonplaats = data.results[0].city;

                        validator.updateStatus(
                          "postcode",
                          validator.STATUS_VALID
                        );
                        validator.updateStatus(
                          "huisnummer",
                          validator.STATUS_VALID
                        );
                      } else {
                        straatnaam = "";
                        woonplaats = "";

                        validator.updateStatus(
                          "postcode",
                          validator.STATUS_INVALID
                        );
                        validator.updateStatus(
                          "huisnummer",
                          validator.STATUS_INVALID
                        );
                      }
                    });
                  }
                }
                return true;
              },
            },
          },
        },
        telefoonnummer: {
          validators: {
            stringLength: {
              min: 10,
              max: 10,
            },
            callback: {
              callback: function (value, validator, $field) {
                var telefoonnummer = $("input[name=telefoonnummer]").val();
                if (telefoonnummer.length == 10) {
                  // Opties: check = uitgebreid/normaal || type = mobiel/alles
                  $.getJSON(
                    "general-bin/phonechecker/phonecheck_nl.php?phone=" +
                      telefoonnummer +
                      "&check=uitgebreid&type=alles",
                    function (data) {
                      //check status message in console
                      console.log(data);

                      if (data.status == true) {
                        validator.updateStatus(
                          "telefoonnummer",
                          validator.STATUS_VALID
                        );
                        return true;
                      } else {
                        validator.updateStatus(
                          "telefoonnummer",
                          validator.STATUS_INVALID
                        );
                        return false;
                      }
                    }
                  );
                  return false;
                } else {
                  return false;
                }
              },
            },
            notEmpty: {
              message: "",
            },
          },
        },
        email: {
          validators: {
            notEmpty: {
              message: "Please supply your email address",
            },
            emailAddress: {
              message: "Please supply a valid email address",
            },
            regexp: {
              regexp: "^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]+$",
            },
          },
        },
      },
    })
    .on("success.form.bv", function (e) {
      $(".FormFirst").data("bootstrapValidator").resetForm();

      var voornaam = $("input[name=voornaam]").val();
      var achternaam = $("input[name=achternaam]").val();
      var postcode = $("input[name=postcode]").val();
      var huisnummer = $("input[name=huisnummer]").val();
      var toevoeging = $("input[name=toevoeging]").val();
      var telefoonnummer = $("input[name=telefoonnummer]").val();
      var email = $("input[name=email]").val();

      if (!clicked) {
        clicked = true;
        var data = {
          email: email,
          campaign_id: campaign_id,
          firstname: voornaam,
          lastname: achternaam,
          lastname_prefix: "",
          label_id: label_id,
          gender: "",
          birthdate: "",
          housenumber: huisnummer,
          housenumber_addition: toevoeging,
          postalcode: postcode,
          address: straatnaam,
          city: woonplaats,
          phone: telefoonnummer,
          publisher_id: publisher_id,
          transaction_id: transaction_id,
          sndt_adv_id: sndt_adv_id,
          ho_aff_click_id: ho_aff_click_id,
          ho_aff_source: ho_source,
          ho_aff_sub_1: ho_aff_sub_1,
          ho_aff_sub_2: ho_aff_sub_2,
          ho_aff_sub_3: ho_aff_sub_3,
          ho_aff_sub_4: ho_aff_sub_4,
          ho_aff_sub_5: ho_aff_sub_5,
          facebook_click_id: fbclid,
        };

        $.ajax({
          method: "POST",
          url: "https://sendtportal.com/process_person",
          dataType: "json",
          data: data,
          success: function (data) {
            hash = data.hash;
            signup_id = data.id;
            if (data.conversion) {
              _tfa.push({ notify: "event", name: "lead", id: 1280887 });

              // Microsoft Ads
              window.uetq = window.uetq || [];
              window.uetq.push("event", "submit_lead_form", {});

              // Google ads
              gtag("event", "conversion", {
                send_to: "AW-793010008/0aPCCLmjwPQCENi-kfoC",
              });

              // Event tracking
              gtag("event", "view_item", {
                send_to: ga_property,
                event_label: "P" + prelander + ". S8. Conversie",
                event_category: tag,
              });

              gtag("event", "page_view", {
                send_to: ga4_property,
                page_number: "8",
                page_title: "Conversion",
              });

              dataLayer.push({ event: "conversie-click" });

              // start show v2 affiliate/partner pixel
              if (data.hoc) {
                $(function () {
                  $.ajax({
                    method: "POST",
                    url: "https://sendtportal.com/partnerpixels/",
                    dataType: "json",
                    data: {
                      offer_id: offer_id,
                      affiliate_id: publisher_id,
                      transaction_id: transaction_id,
                    },
                    success: function (result) {
                      if (result.status === "success") {
                        var pixel_src = result.imagepixel;
                        if (pixel_src !== "") {
                          if (pixel_src.indexOf("facebook.com") !== -1) {
                            pixel_src +=
                              "&eid=" +
                              signup_id +
                              "&ud[external_id]=" +
                              transaction_id;
                          }
                          var imagepixel =
                            '<img height="1" width="1" style="display:none" src="' +
                            pixel_src +
                            '"/>';
                          $(imagepixel).appendTo(".tracking");
                        } else {
                          var iframe =
                            '<iframe src="https://sendtportal.com/partnerpixels/rendered/' +
                            transaction_id +
                            '.html" scrolling="no" frameborder="0" width="1" height="1"></iframe>';
                          $(iframe).appendTo(".tracking");
                        }
                      }
                    },
                  });
                });
              }
              // end show affiliate/partner pixel

              $.ajax({
                method: "POST",
                url: "https://sendtportal.com/process_question",
                dataType: "json",
                data: {
                  campaign_id: campaign_id,
                  hash: hash,
                  "answers[campaign_question]":
                    $("#campaign_question").data("translate"),
                  "answers[intereno_antwoorden]": vragen,
                  label_id: label_id,
                },
              });

              redirect_timeout = setTimeout(function () {
                document.location.href = redirect_url;
              }, 7000);
            } else {
              // Event tracking
              gtag("event", "view_item", {
                send_to: ga_property,
                event_label: "P" + prelander + ". S8. Conversie failed",
                event_category: tag,
              });

              gtag("event", "page_view", {
                send_to: ga4_property,
                page_number: "8",
                page_title: "Conversion failed",
              });

              redirect_timeout = setTimeout(function () {
                document.location.href = redirect_url;
              }, 7000);
            }

            // Toon de bedankt pagina
            $(".form-holder").fadeOut(function () {
              $(".bedankt-pagina").fadeIn();
            });
          },
        });
      }

      // Prevent form submission
      e.preventDefault();

      $("html, body").animate({
        scrollTop: $("#body").offset().top,
      });
    });
});
