$(document).ready(function() {
  $("#dates_form").on('submit', function(event) {
    $.ajax({
      data  :  {
           a: $("#w_date option:selected").text(), 
           b: $("#w_month option:selected").text(),
           c: $("#w_year option:selected").text(),
           d: $("#dmy option:selected").text(),
           e: $("#number_of_days").val()
      },
      type  :  'POST',
      url  :  '/dates'
    })
    .done(function(data) {
      $("#res_matur").html("<p>"+data._date+"/"+data._month+"/"+data._year+" - "+data._week+"</p>");
    });
    event.preventDefault();
  });
});
