from datetime import date
dob="2002-08-26"
l=dob.split("-")
today = date.today()
age = today.year -int(l[0])- ((today.month, today.day) <(int(dob[1]),int(dob[2])))
print(age)