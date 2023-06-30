// var bAdvancedMode = false; // Detailed/Simple mode?
// 			var AdvancedModeElements = Array("div_breakup", "div_totamount", "div_emistart"); // Elements of form which are exposed in detailed mode.
// 			var bModeCSV = false; // Put break details in CSV format?
// 			var Alignment = 10;
// 			var Months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");

// 			function SwitchToCSVMode()
// 			{
// 				bModeCSV = true;
// 				CalcEMI();
// 				bModeCSV = false;
// 				return;
// 			}

// 			function ClearF()
// 			{
// 				if (confirm('This will reset the form')) {
// 					SwitchToSimpleMode();
// 					document.f.reset();
// 				}
// 				return;
// 			}

// 			function SwitchToAdvMode() 	// Switch to advanced(detailed) mode
// 			{
// 				bAdvancedMode = true;
// 				for (var i = 0; i < AdvancedModeElements.length; i++) {
// 					document.getElementById(AdvancedModeElements[i]).style.visibility = "visible";
// 					document.getElementById(AdvancedModeElements[i]).style.height = "auto";
// 				}
// 				return;
// 			}

// 			function SwitchToSimpleMode() // Switch to simple mode
// 			{
// 				bAdvancedMode = false;
// 				for (var i = 0; i < AdvancedModeElements.length; i++) {
// 					document.getElementById(AdvancedModeElements[i]).style.visibility = "hidden";
// 					document.getElementById(AdvancedModeElements[i]).style.height = "0px";
// 				}
// 				return;
// 			}

// 			function numDaysThisYear(day) {
// 				days_this_year = 365;
// 				this_year = parseInt(day.getFullYear());
// 				if (new Date(this_year, 1, 29).getMonth() === 1) { // if leap year
// 					days_this_year++;
// 				}
// 				return days_this_year;
// 			}

// 			// Calculate:
// 			// EMI, Amorization Schedule, total interest
// 			function CalcEMI()
// 			{
// 				var P, R, N, cmp, EMI, i, I_i, P_i, Peff, totEMI, totI, totI_actual;
// 				/*
// 				 The above variables are:
// 				 P -> Principal
// 				 R -> Rate of interest (in fraction)
// 				 N -> Number of installments
// 				 cmp -> Compounding factor
// 				 i -> Iterator variable
// 				 I_i -> Interest paid at the (i)th installment
// 				 P_i -> Principal paid at the (i)th installment
// 				 Peff -> Effective Principal (oustanding amount) at a given point of time
// 				 totEMI -> Sum total of all the installments paid
// 				 totI -> Total intestest payable, calculated from totEMI
// 				 totI_actual -> Actual amount of interest paid over the installment period
// 				 */
// 				if (!validateF())
// 					return false;// Validate the form
// 				// Get variables:
// 				cmp = document.f.sel_compounding.value;
// 				P = document.f.t_principal.value;
// 				N = (document.f.t_term.value / document.f.sel_units.value) * cmp;
// 				R = (document.f.t_interest.value / 100) / cmp;
// 				// We have P, N and R
// 				// Apply EMI formula and normalize it one month:
// 				EMI = (cmp / 12) * P * R / (1 - Math.pow(1 + R, -N));
// 				if (isNaN(EMI) || EMI < 0)
// 					window.alert("Invalid inputs to calculate EMI!");
// 				else
// 					document.f.t_emi.value = RoundToPaise(EMI);
// 				if (bAdvancedMode) // Calculate more details in advanced mode:
// 				{
// 					// Total amount you pay: (number of installments X EMI)
// 					totEMI = EMI * N / cmp * 12;
// 					// Total interest paid: (number of installments X EMI - Principal)
// 					totI = totEMI - P;
// 					document.f.t_emitot.value = RoundToPaise(totEMI);
// 					document.f.t_sumint.value = RoundToPaise(totI);
// 					var sDate = String(), txtBreakup, normalize_1, nDiffDays, Pprev, nDiffDays, Reff;
// 					var dEMI = new Date(), dEMIprev = new Date(), dLoanIssue = new Date();
// 					/*
// 					 sDate -> Date as string
// 					 txtBreakup -> Variable to keep all the breakup details
// 					 normalize_1 -> Should installment start from 1st day of next month?
// 					 nDiffDays -> Number of days b/w compounding
// 					 Pprev -> Principal paid in previous installment
// 					 Reff -> Effective rate of interest (in fraction)
// 					 dEMI -> Date of intallment
// 					 dEMIprev -> Date of previous installment
// 					 dLoanIssue -> Date of loan issue
// 					 */
// 					dLoanIssue.setFullYear(parseInt(document.f.txtYear.value));
// 					dLoanIssue.setMonth(document.f.iMonth.selectedIndex - 1);
// 					dLoanIssue.setDate(document.f.iDay.selectedIndex);
// 					// Check the status on radio:
// 					normalize_1 = document.getElementById("RepaymentStart_day1next").checked;
// 					if (bModeCSV) {
// 						txtBreakup = "Date,Principal,Interest,Outstanding\n";
// 					}
// 					else {
// 						txtBreakup =
// 										"|----------------------------------------------------------|\n" +
// 										"|    Date     |   Principal  |   Interest   |  Outstanding |\n" +
// 										"|----------------------------------------------------------|\n";
// 					}
// 					Peff = P;
// 					totI_actual = 0;
// 					// Copy dLoanIssue to dEMIprev
// 					dEMIprev.setFullYear(dLoanIssue.getFullYear());
// 					dEMIprev.setMonth(dLoanIssue.getMonth());
// 					dEMIprev.setDate(dLoanIssue.getDate());
// 					if (normalize_1) {
// 						Pprev = Peff;
// 						// Get 1st day of next month:
// 						dEMI.setFullYear(dLoanIssue.getFullYear());
// 						dEMI.setMonth(dLoanIssue.getMonth() + 1);
// 						dEMI.setDate(1);
// 					}
// 					else {
// 						dEMI = dEMIprev;
// 					}
// 					// Calculate amortization schedule as follows:
// 					for (i = 1; i <= N; i++) // From 1st installment to Nth installment:
// 					{
// 						if (normalize_1)
// 						{
// 							nDiffDays = parseInt((dEMI - dEMIprev) / 86400000); // 1 day = 86400000 milliseconds
// 							Reff = R * cmp * nDiffDays / numDaysThisYear(dEMI); // Effective rate of interest, pro-rated for given number of days
// 							Peff = Peff * (1 + Reff) - EMI;
// 							if (Pprev < EMI)
// 								Peff = 0; // to close the loan
// 							// Now, interest paid in given month is the difference 
// 							// in outstanding principal amounts b/w current month and previous month:
// 							P_i = Pprev - Peff;
// 						}
// 						else
// 						{
// 							// Directly applying the formula:
// 							P_i = (EMI - P * R) * Math.pow(1 + R, i - 1);
// 							Peff = Peff - P_i;
// 						}
// 						I_i = EMI - P_i;
// 						totI_actual += I_i;
// 						// Form a date string in required format:
// 						sDate = (dEMI.getDate() < 10 ? "0" + dEMI.getDate() : dEMI.getDate()) + "-" + Months[dEMI.getMonth()] + "-" + dEMI.getFullYear();
// 						if (bModeCSV)
// 							txtBreakup += sDate + "," + RoundToPaise(P_i) + "," + RoundToPaise(I_i) + "," + RoundToPaise(Peff) + "\n";
// 						else
// 							txtBreakup += "| " + IndentR(sDate) + " |  " + IndentR(RoundToPaise(P_i)) + "  |  " + IndentR(RoundToPaise(I_i)) + "  |  " + IndentR(RoundToPaise(Peff)) + "  |\n";
// 						Pprev = Peff;
// 						dEMIprev.setFullYear(dEMI.getFullYear());
// 						dEMIprev.setMonth(dEMI.getMonth());
// 						dEMIprev.setDate(dEMI.getDate());
// 						dEMI.setMonth(dEMI.getMonth() + 1);	// increment by 1 month (installment for next month)
// 						if (Peff == 0)
// 							break;
// 					}
// 					if (!bModeCSV) {
// 						txtBreakup += "|----------------------------------------------------------|";
// 					}
// 					//window.alert(totI_actual);
// 					document.f.txtBreakup.value = txtBreakup;
// 				}
// 				return false;
// 			}

// 			function validateF() // Function to validate the EMI Calculator form
// 			{
// 				if (document.f.t_principal.value == "") {
// 					window.alert("Enter loan amount \n(Principal value)");
// 					document.f.t_principal.focus();
// 					return false;
// 				}
// 				if (document.f.t_term.value == "") {
// 					window.alert("Enter loan repayment period");
// 					document.f.t_term.focus();
// 					return false;
// 				}
// 				if (document.f.t_interest.value == "") {
// 					window.alert("Enter rate of interest");
// 					document.f.t_interest.focus();
// 					return false;
// 				}
// 				if (isNaN(document.f.t_principal.value) || document.f.t_principal.value < 0) {
// 					window.alert("Enter a valid value for loan amount");
// 					document.f.t_principal.select();
// 					return false;
// 				}
// 				if (isNaN(document.f.t_term.value) || document.f.t_term.value < 0) {
// 					window.alert("Enter a valid value for loan period\n(This may range from few months to 20 years)");
// 					document.f.t_term.select();
// 					return false;
// 				}
// 				if (isNaN(document.f.t_interest.value) || document.f.t_interest.value > 100 || document.f.t_interest.value < 0) {
// 					window.alert("Enter a valid value for rate of interest\n(R should be between 0 and 100)");
// 					document.f.t_interest.select();
// 					return false;
// 				}
// 				if (document.f.AdvancedMode_Yes.checked) {
// 					// validations for advanced mode:
// 					if (document.f.iMonth.value == 0 || document.f.iDay.value == 0) {
// 						window.alert("Enter installment start date");
// 						document.f.iMonth.focus();
// 						return false;
// 					}
// 				}
// 				return true;
// 			}

// 			function RoundToPaise(Amount) // Format number to Rupee Paise format
// 			{
// 				var AmountStr, i, t;
// 				if (isNaN(Amount)) {
// 					return "NaN";
// 				}
// 				AmountStr = "" + Math.round(Amount * 100) / 100; // round to 2 decimal places
// 				i = AmountStr.indexOf('.');
// 				if (i == -1)
// 					return (AmountStr + ".00");
// 				t = AmountStr.substring(0, i + 1) + AmountStr.substring(i + 1, i + 3);
// 				if (i + 2 == AmountStr.length)
// 					t += "0";
// 				return t;
// 			}

// 			function IndentR(str_i) // Indent function to required length
// 			{
// 				var str = String(str_i), padding = "", i = 0;
// 				for (i = 0; i < Alignment - str.length; i++) {
// 					padding += " ";
// 				}
// 				str = padding + str;
// 				return str;
// 			}

// 			function validateFL() // Function to validate the Loan limit Calculator form
// 			{
// 				for (var i = 0; i < document.fl.elements.length; i++) {
// 					if (document.fl.elements[i].type == "text") {
// 						if (isNaN(document.fl.elements[i].value)) {
// 							window.alert("Invalid input");
// 							document.fl.elements[i].select();
// 							return false;
// 						}
// 						if (document.fl.elements[i].name.substr(0, 2) == "pc" && (document.fl.elements[i].value > 100 || document.fl.elements[i].value < 0)) {
// 							window.alert("Enter value between 0 and 100");
// 							document.fl.elements[i].select();
// 							return false;
// 						}
// 					}
// 				}
// 				if (document.fl.t_term.value == "") {
// 					window.alert("Enter loan repayment period");
// 					document.fl.t_term.focus();
// 					return false;
// 				}
// 				if (document.fl.t_interest.value == "") {
// 					window.alert("Enter rate of interest");
// 					document.fl.t_interest.focus();
// 					return false;
// 				}
// 				if (isNaN(document.fl.t_term.value) || document.fl.t_term.value < 0) {
// 					window.alert("Enter a valid value for loan period\n" +
// 									"(This may range from few months to 20 years)");
// 					document.fl.t_term.select();
// 					return false;
// 				}
// 				if (isNaN(document.fl.t_interest.value) || document.fl.t_interest.value > 100 || document.fl.t_interest.value < 0) {
// 					window.alert("Enter a valid value for rate of interest\n" +
// 									"(R should be between 0 and 100)");
// 					document.fl.t_interest.select();
// 					return false;
// 				}
// 				return true;
// 			}

// 			// Calculate loan limit:
// 			// (for a given set of income)
// 			function CalcLL()
// 			{
// 				if (!validateFL())
// 					return false;
// 				document.fl.report.value = "";
// 				var AnnualIncomeCalc = 0, EmiByNmi, LoanLimit, LLperiod, R, P, N, MaxEMI, LoanLimitEMI, AnnualIncomeActual = 0, i, cmp;
// 				EmiByNmi = document.fl.emibynmi.value / 100;
// 				LLperiod = document.fl.llperiod.value / document.fl.period_units.value;
// 				for (i = 1; i <= 5; i++) {
// 					AnnualIncomeCalc += eval("document.fl.soi_" + i + ".value*" + "document.fl.iu" + i + ".value" + "*document.fl.pc" + i + ".value/100");
// 					AnnualIncomeActual += eval("document.fl.soi_" + i + ".value*document.fl.iu" + i + ".value");
// 				}
// 				LogThis("Annual Income (actual)", RoundToPaise(AnnualIncomeActual));
// 				LogThis("Monthly Income (actual)", RoundToPaise(AnnualIncomeActual / 12));
// 				LogThis("Income considered for loan", RoundToPaise(AnnualIncomeCalc));
// 				LoanLimit = AnnualIncomeCalc * LLperiod; // Calculate Loan Limit
// 				cmp = document.fl.sel_compounding.value;
// 				R = (document.fl.t_interest.value / 100) / cmp; // rate%
// 				N = (document.fl.t_term.value / document.fl.sel_units.value) * cmp;
// 				MaxEMI = (AnnualIncomeCalc / 12) * EmiByNmi; //  Maximum EMI = (Net Montly Income) * (EMI:NMI ratio)
// 				LogThis("EMI limit", RoundToPaise(AnnualIncomeCalc / 12) + " X " + document.fl.emibynmi.value + "% = " + RoundToPaise(MaxEMI));
// 				LoanLimitEMI = (12 / cmp) * MaxEMI * (1 - Math.pow(1 + R, -N)) / R;
// 				LogThis("Loan Limit (income for " + Math.round(LLperiod * 12 * 10) / 10 + " months)", RoundToPaise(LoanLimit));
// 				LogThis("Loan Limit (EMI basis)", RoundToPaise(LoanLimitEMI));
// 				if (LoanLimit > LoanLimitEMI)
// 					LoanLimit = LoanLimitEMI;
// 				document.fl.loanlimit.value = RoundToPaise(LoanLimit);
// 				return false;
// 			}

// 			function LogThis(sKey, sValue) {
// 				document.fl.report.value += sKey + " = " + sValue + "\n";
// 			}


const loanAmount = document.getElementById("loan-amount");
const loanTenure = document.getElementById("loan-tenure");
const loanRate = document.getElementById("loan-interest");
const loanEmi = document.getElementById("loanemi");
const loanPrinciple = document.getElementById("loanprinciple");
const loanTotal = document.getElementById("loantotal");
const loanInterest = document.getElementById("loaninterest");
let submitBtn = document.getElementById("calcbtn");
let error = document.querySelector(".error");
let result = document.querySelector(".result");

function calculate(){
    if(loanAmount.value == '' || loanTenure.value == '' || loanRate.value == ''){
        error.style.display = "block";
        error.innerHTML = "Please Fill All The Fields";
        setTimeout(()=>{
            error.style.display = "none";
        },2000)
    }else{
        calculateEmi();
    }
}
function calculateEmi(){
    amount = loanAmount.value;
    tenure = loanTenure.value*12; //1year = 12months;
    rate = loanRate.value/12/100; //loan rate per year/100 = loan percentage
    emi = (amount*rate*(1+rate)**tenure)/((1+rate)**tenure-1);
    total = emi*tenure; //total amount to be paid including interest
    interest = total-amount; //interest = total amount - principle amount
    result.style.display = "Block";
    document.querySelector(".container").style.height = "100%";
    loanEmi.innerHTML = Math.floor(emi);
    loanPrinciple.innerHTML = Math.floor(amount);
    loanTotal.innerHTML = Math.floor(total);
    loanInterest.innerHTML = Math.floor(interest);

    //displaying pie chart that describe the details
    let xValues = ["Principles","Interest"];
    let yValues = [amount,Math.floor(interest)];
    let barColors = ["#3598DB","#d6f0fd"];

    new Chart("loanChart",{
        type: "pie",
        data: {
            labels: xValues,
            datasets:[
                {
                    backgroundColor: barColors,
                    data: yValues
                }
            ]
        },
        options: {
            title: {
                display: false
            }
        }
    })
}