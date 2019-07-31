$(document).ready(function() {
  $("#form1").on('submit', function(evt) {
    // Delaying the time before retrieving values from the 'form'
    setTimeout(
      function() {
        $.ajax({
          data: {
            amt: $("#amt").val(), 
            raval: $("#rate_of_inpdays").val(),
            numdays: $("#no_days").val(), 
            ptype: $("#period_type option:selected").text()
          },
          type  :  'POST',
          url  :  '/interest'
        })
        .done(function (data) {
          $("#intr").val(data.inter),  // remember to use commas where needed instead of semi-colon
          $("#amt_at_matr").val(data.amt)
        });
        evt.preventDefault();      
      }, 500
    );  
  });
});
