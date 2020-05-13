import csv
import operator
newfile = "./flights_april.csv"
d = {}
with open("./ind.csv") as file:
	csvReader = csv.reader(file)

	for row in csvReader:
		callsign = row[0]
		airline = callsign[:3]
		origin = row[5]
		dest = row[6]
		date = str(row[9])

		if date not in d:
			d[date] = 0

		if origin == "KIND" or dest == "KIND" and airline == "FDX":
			d[date] +=1

print sorted(d.items(), key=operator.itemgetter(0))

