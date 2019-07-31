$(document).ready(function() {
  $("#form1").on('submit', function(e) {
    var listoptions = document.getElementById("sel_days").options;
    var i = 1;  // going through loop
    arr_list = [];  // declaring as global variable
    time = [];
    type = [];
    tp = [];  // list of time period available for deposit

    $.each(listoptions, function(i) {
      arr_list.push(listoptions.item(i).text);  // getting the text of every option in 'select'
      i = i + 1;  // increment through 'listoptions'
    });
    arr_list.shift();  // removes the first element from the array

    $.each(arr_list, function(i) {
      time.push(arr_list[i].split(' ')[1]);  // split 'time limit' into a separate array
      type.push(arr_list[i].split(' ')[2]);  // split 'time type' into a separate array
      i = i + 1
    });

    // for creating an array 'tp' of time periods
    $.each(time, function(i) {
      if (type[i] == "days") {
        tp.push(time[i] * 1); // push days value as it is into 'tp'
      }
      else if (type[i] == "years" || type[i] == "year") {
        if (time[i] == "1") { 
          tp.push(time[i] * 365); // push years value after multiplying them by '365' into 'tp'
        }
        else if (time[i] == "2") {
          tp.push((time[i] * 365) + 1);  // add '1' to count for leap-year
        }
        else if (time[i] == "5") {
        tp.push((time[i] * 365) + 2);  
        }
      }
      i = i + 1;
    });

    // Array of rates for each 'tp'
    rates_list = [];
    $("#sel_days option").each(function() {
      rates_list.push($(this).val() * 1); // converting rates as strings to numeric
    });
    rates_list.shift(); // Removing first element from the array

    number_days = $("#no_days").val();
    dy_m_yr = $("#period_type").val();
    in_Days = 0;  // input number of days - after getting converted into a 'days' format
    corres_rate = 0;

    // Converting given input to 'days' type
    if (dy_m_yr == "Days") {
      in_Days = number_days * 1;
    }
    else if (dy_m_yr == "Month(s)") {
      in_Days = number_days * 30;
    }
    else if (dy_m_yr == "Year(s)") {
      in_Days = number_days * 365;
      if (number_days >= "2" || number_days <= "4") {
        in_Days = (number_days * 365) + 1;
      }
      else if (number_days == "5") {
        in_Days = (number_days * 365) + 2;
      }
    }
    
    // to find the range of given 'number of days'
    count = 0;
    $.each(tp, function(i) {
      if (count == 0) {
        if (tp[i] == in_Days) {
          corres_rate = rates_list[i];
          count = count + 1; // on success, discontinue loop
        }
        else if (tp[i] > in_Days) {
          corres_rate = rates_list[i]; 
          count = count + 1; // on success, discontinue loop
        }
        else if (tp[i] < in_Days) {
          count = 0;  // if correct range was not found, continue loop till the end
        }
      }
    });
    
    // Set value of 'rate'
    $("#rate_of_inpdays").val(corres_rate);
    
    // Prevent page from loading
    e.preventDefault();
  });
});
