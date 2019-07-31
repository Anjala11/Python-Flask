from flask import Flask, redirect, render_template, request, url_for, jsonify
import math
import datetime

app = Flask(__name__)

# function to check whether given year is leap year or not
 

def leap(yr):
    if yr % 4 == 0:
        if yr % 100 == 0:
            if yr % 400 == 0:
                return 0 
            else:
                return 1 
        else:
            return 0
    else:
        return 1
 

# function to find the weekday for a given date


def weekday(d, m, y):
    days_list = {0: "Monday", 1: "Tuesday", 2: "Wednesday", 3: "Thursday", 4: "Friday", 5: "Saturday", 6: "Sunday"}
    day = datetime.date(y, m, d).weekday()
    _day = days_list[day]
    return _day


def days_find(d, m, y, tp):  # find the right date of maturity
    # list of all months and their days
    months = {1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31}
    cor_days = months[m]

    # if the month is february and the year happens to be a leap year, set cor_days to 29
    if m == 2 and leap(y) == 0:  # '1' corresponds to non-leap year; '0' corresponds to leap year
        cor_days = 29

    rem_days_in_month = cor_days - d

    # If given period of days can fit inside the present month, just add the date with time period
    if rem_days_in_month >= tp:
        date = d + tp
        month = m
        year = y
        return date, month, year
    
    elif rem_days_in_month < tp:
        rem_inp_days = tp - rem_days_in_month  # progressed so far, only rem_inp_days remains

        if m == 12:
            month = 1
            year = y + 1
        else:
            month = m + 1
            year = y

        date = rem_inp_days  # remaining number of days in that month of that year (intermediate value)

        # number of days in a given month
        no_of_days = months[month]

        # if the year is a leap year and month is '2'
        if month == 2 and leap(year) == 0:
            # add '1' with 28 days of february if month is '2' and year is a leap year
            no_of_days = months[month] + 1

        # if remaining days available in given input exceeds number of days in present month
        while rem_inp_days > no_of_days:
            rem_inp_days = rem_inp_days - no_of_days

            # while the month is '12', it exceeds that year and goes to next year
            if month == 12:
                month = 1
                year = year + 1
            else:
                month = month + 1
                year = year

            date = rem_inp_days
            no_of_days = months[month]

            # if the year is leap year and month is '2', add '1' extra day to no_of_days
            if month == 2 and leap(year) == 0:
                no_of_days = months[month] + 1
        
        return date, month, year  # return calculated values back to function call  # jsonify back to ajax call

                
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/interest", methods=["GET", "POST"], endpoint="interest_calc")
def interest():
    if request.method == "GET":
        return render_template("interest.html")
    elif request.method == "POST":
        # Retrieve data from 'AJAX' callback
        principal = request.form.get('amt', type=int) 
        rate = request.form.get('raval', type=float)
        time_period = request.form.get('numdays', type=int)
        time_type = str(request.form.get('ptype'))
        
        # For Days Calculation, we calculate 'terms'
        if time_type == 'Days':
            time_limit = 91
            if time_period <= 91:
                terms = 1
            else:
                terms = int(math.ceil(time_period / time_limit))
                
        # For Months Calculation
        if time_type == 'Month(s)':
            time_limit = 3
            if time_period <= 3:
                terms = 1
                time_period = time_period * 30  # calculating number of days based on given month
            else:
                terms = int(math.ceil(time_period / time_limit))
                time_period = (time_period * 30) + 2  # Adding 2 for 31 days in a year
                
        # For Years Calculation
        if time_type == 'Year(s)':
            terms = 4 * time_period
            time_period = time_period * 365  # calculating number of days for a years
        
        # Fixed Deposit Interest Calculation
        amount = ((1 + (rate / 100)) ** ((time_period / 365) * terms)) * principal
        amount1 = round(amount, 2)
        intr = round((amount - principal), 2)
        return jsonify({"amt": amount1, "inter": intr})  # sends back calculated result as json to AJAX
        
    
@app.route("/dates", methods=["GET", "POST"])
def dates():    
    if request.method == "GET":
        return render_template("dates.html")
    elif request.method == "POST":
        # Getting data from input boxes and 'select'
        date = int(request.form.get('a'))
        month = int(request.form.get('b'))
        year = int(request.form.get('c'))
        d_m_y = str(request.form.get('d'))
        t_period = int(request.form.get('e'))

        # For Days
        if d_m_y == "Days":
            date, month, year = days_find(date, month, year, t_period)
            week_day = weekday(date, month, year)
            return jsonify({"_date": date, "_month": month, "_year": year, "_week": week_day})  # jsonify back to ajax call
                                
        # For Months
        if d_m_y == "Month(s)":
            d = date
            
            # if month doesn't exceed beyond the present year when added with input value
            rem_months_in_year = 12 - month
            
            if t_period <= rem_months_in_year:
                m = month + t_period
                y = year

            # if input value makes month exceed to go to next year and beyond
            elif t_period > rem_months_in_year:
                rem_months = t_period % 12
                no_of_yrs = t_period - rem_months
                yrs = no_of_yrs / 12
                y = year + yrs  # new added year
                
                if rem_months <= rem_months_in_year:
                    m = month + rem_months  # add remaining from modulo with user selected value 'month'
                else:
                    y = y + 1  # it goes to next year
                    m = rem_months - rem_months_in_year
            
            week_day = weekday(int(d), int(m), int(y))
       
            # returning jsonify as result to ajax callback       
            return jsonify({"_date": d, "_month": m, "_year": y, "_week": week_day})
                
        # For Year
        if d_m_y == "Year(s)":
            date = date
            month = month
            year = year + t_period
            week_day = weekday(date, month, year)
            return jsonify({"_date": date, "_month": month, "_year": year, "_week": week_day})
            
        return jsonify({"_date": 11, "_month": 1, "_year": 1994, "_week": "Tuesday"})  # default return values to ajax

    
if __name__ == "__main__":
    app.run(debug=True)
    
