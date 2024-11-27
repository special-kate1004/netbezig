var vragen = "";

var eventnr = 3;

$(document).ready(function () {
  // Loop voor de stap bolletjes
  for (i = 0; i < aantal_vragen; i++) {
    if (i == 0) {
      $(".stappen").append('<div class="stap active"></div>');
    } else {
      $(".stappen").append('<div class="stap"></div>');
    }
  }

  // Open privacy modal als '#privacyverklaring' in de url staat
  var url = window.location.href;
  if (url.indexOf("#privacyverklaring") != -1) {
    $("#privacy").modal("show");
  }

  $(".info-btn").click(function () {
    $("html, body").animate({ scrollTop: $("#body").offset().top }, "slow");
    $("#form-modal").modal({
      backdrop: "static",
      keyboard: false,
    });

    gtag("event", "view_item", {
      send_to: ga_property,
      event_label: "P" + prelander + ". S2. Q1. Vorm keuken",
      event_category: tag,
    });

    gtag("event", "page_view", {
      send_to: ga4_property,
      page_number: "2",
      page_title: "Q1. Vorm keuken",
    });
  });

  $("#vraag-1 .antw-btn").click(function () {
    $("#vragen-intro").fadeOut();
  });

  var geklikt = false;
  $(".antw-btn").click(function () {
    if (!geklikt) {
      geklikt = true;
      vraag_id = $(this).parent().attr("id"); // Huidige vraag ID

      // Vraag nummer
      test = vraag_id.substr(vraag_id.length - 2, 1);
      if (test != "-") {
        huidig = parseInt(vraag_id.substr(vraag_id.length - 2)); // huidig nummer (2 cijfers)
      } else {
        huidig = parseInt(vraag_id.substr(vraag_id.length - 1)); // huidig nummer (1 cijfer)
      }
      volgende = huidig + 1; // Volgend nummer

      //vraag = $(this).siblings('.vraag').text();
      vraag = window["vraag" + huidig];
      antwoord = $(this).attr("data-value");

      if (antwoord == "Huurhuis") {
        $("#helaas").modal({
          backdrop: "static",
          keyboard: false,
        });
        geklikt = false;
        return false;
      }

      vragen += vraag + " " + antwoord + "; ";
      console.log(vragen);
      if (huidig == 5) {
        $(".vragen-holder, #Form-sluit").fadeOut(function () {
          $(".form-holder").fadeIn();

          gtag("event", "view_item", {
            send_to: ga_property,
            event_label: "P" + prelander + ". S" + eventnr + ". Form",
            event_category: tag,
          });

          gtag("event", "page_view", {
            send_to: ga4_property,
            page_number: eventnr,
            page_title: "Vorm keuken",
          });
          geklikt = false;
        });
      } else {
        $("#" + vraag_id).fadeOut(function () {
          $("#vraag-" + volgende).fadeIn();

          //eventvraag = $("#vraag-"+volgende+ " .vraag").text();
          eventvraag = window["vraag" + volgende];
          gtag("event", "view_item", {
            send_to: ga_property,
            event_label:
              "P" +
              prelander +
              ". S" +
              eventnr +
              ". Q" +
              volgende +
              ". " +
              eventvraag,
            event_category: tag,
          });

          gtag("event", "page_view", {
            send_to: ga4_property,
            page_number: eventnr,
            page_title: eventvraag,
          });
          eventnr++;

          geklikt = false;

          $(".stappen .stap.active:last").next(".stap").addClass("active");
        });
      }
    }
  });

  $(".scroll-top-btn").click(function () {
    $("html, body").animate({ scrollTop: $("#body").offset().top }, "slow");
  });

  // Scroll fix for multiple modals
  $(document).on("hidden.bs.modal", ".modal", function () {
    $(".modal:visible").length && $(document.body).addClass("modal-open");
  });
});
