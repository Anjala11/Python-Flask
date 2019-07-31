function check()
{
  document.getElementById("rate_value").value = document.getElementById("sel_days").value;
}

// only number keystrokes can be entered. no letters or special charactes are allowed.
function isNumber(evt) {
  evt = (evt) ? evt : window.evt;
  var charCode = (evt.which) ? (evt.which) : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

function get_val(a) {
  var x = document.querySelector(a).value;
  return x;
}

// for interest.html
function err_amt(msg) {
  var x = 
      document.querySelector("#amt_err").innerHTML=msg;
  return x;
}

// for dates.html
function err_msg(emsg) {
  var y = 
      document.querySelector("#error_msg").innerHTML=emsg;
  return y;
}

function calcul() {
      
  // Amount Value
  if (get_val("#amt") <= 500) { // Retrieve values of input fields by passing queryselectors to another function
    err_amt("Enter an amount greater than 500."); // Calls another function that sets innerHTML to required message
    return false;
  }
    
  // Number of days - minimum limit
  if (get_val("#period_type") === "Days" && get_val("#no_days") < 15) {
    err_amt("Valid only for 15 days and more.")
    return false;
  }
  
  // Number of days - maximum limit
  if (get_val("#period_type") === "Days" && get_val("#no_days") > 1827) {
    err_amt("Valid only for 1827 days and less.");
    return false;
  }
  
  // Number of Months - Minimum limit
  if (get_val("#period_type") === "Month(s)" && get_val("#no_days") < 1) {
    err_amt("Valid for 1 month or more");
    return false;
  }
  
  // Number of months - maximum limit
  if (get_val("#period_type") === "Month(s)" && get_val("#no_days") > 60) {
    err_amt("Time limit is infinite. Enter for 60 months or less.");
    return false;
  }
  
  // Number of years - Minimum limit
  if (get_val("#period_type") === "Year(s)" && get_val("#no_days") < 1) {
    err_amt("Valid for 1 year or more");
    return false;
  }
  
  // Number of years - Maximum limit
  if (get_val("#period_type") === "Year(s)" && get_val("#no_days") > 5) {
    err_amt("Time limit is far greater. Enter for 5 years or less.");
    return false;
  }
  
  // Check if the number of days is consistent within limits
}

function matur() {
  
  // Deciding whether the number of days in a particular month is 30 or 31
  if ((get_val("#w_month") == 4 ||
      get_val("#w_month") == 6 ||
      get_val("#w_month") == 9 ||
      get_val("#w_month") == 11) && 
      get_val("#w_date") == 31) 
  {
    err_msg("There are only 30 days in this month.");
    return false;
  }
  
  // If Leap Year, then only 29 days are allowed in February
  if (get_val("#w_month") == 2 && get_val("#w_date") > 29 && (((get_val("#w_year") % 4 == 0) && (get_val("#w_year") % 100 != 0)) ||
                                                                (get_val("#w_year") % 400 == 0))) // Formula for leap year
  {
    err_msg("It is a Leap Year. But, only 29 days are present here.");
    return false;
  }
  
  // Checking if the year is leap year or not
  if (get_val("#w_month") == 2 && get_val("#w_date") > 28 && !(((get_val("#w_year") % 4 == 0) && (get_val("#w_year") % 100 != 0)) ||
                                                                (get_val("#w_year") % 400 == 0)))
  {
    err_msg("Only 28 days in February this year. It is not Leap Year.");
    return false;
  }
  
  if (get_val("#dmy") === "Days" && get_val("#number_of_days") < 15) {
    err_msg("Less than 15 is not valid.");
    return false;
  }
  
  if (get_val("#dmy") === "Days" && get_val("#number_of_days") > 1827) {
    err_msg("Not more than 1827 days.");
    return false;
  }
  
  if (get_val("#dmy") === "Month(s)" && get_val("#number_of_days") < 1) {
    err_msg("Enter time period greater than 1 month.");
    return false;
  }
  
  if (get_val("#dmy") === "Month(s)" && get_val("#number_of_days") > 60) {
    err_msg("Enter time period less than 60 months.");
    return false;
  }
  
  if (get_val("#dmy") === "Year(s)" && get_val("#number_of_days") < 1) {
    err_msg("Valid for 1 year or more.");
    return false;
  }
  
  if (get_val("#dmy") === "Year(s)" && get_val("#number_of_days") > 5) {
    err_msg("Only for 5 years or less.");
    return false;
  }
}
