Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};

Date.prototype.yyyymmddhhmi = function() {
	   var yyyy = this.getFullYear().toString();
	   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	   var dd  = this.getDate().toString();
	   var hh  = this.getHours().toString();
	   var min  = this.getMinutes().toString();
	   return yyyy 
	   		+ (mm[1]?mm:"0"+mm[0]) 
	   		+ (dd[1]?dd:"0"+dd[0])
	   		+ (hh[1]?hh:"0"+hh[0])  
	   		+ (min[1]?min:"0"+min[0]); // padding
};

Date.prototype.toDayString = function() {
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return (mm[1]?mm:"0"+mm[0])  + '.' + (dd[1]?dd:"0"+dd[0]); // padding
}; 

Date.prototype.toDateTimeString = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   var hh  = this.getHours().toString();
   var min  = this.getMinutes().toString();
   return yyyy 
			+ "-" + (mm[1]?mm:"0"+mm[0])  
			+ "-" + (dd[1]?dd:"0"+dd[0]) 
			+ " " + (hh[1]?hh:"0"+hh[0])  
			+ ":" + (min[1]?min:"0"+min[0]); // padding
};

String.prototype.toDate = function(){
	var reggie = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/;
	var dateArray = reggie.exec(this); 
	var dateObject = new Date(
		(+dateArray[1]),
		(+dateArray[2])-1, // Careful, month starts at 0!
		(+dateArray[3]),
		(+dateArray[4]),
		(+dateArray[5]),
		0
	);

	return dateObject;
}; 

String.prototype.toNumber = function(){
	return this.length > 0 ? parseInt(this) : 0;
};

String.prototype.format = function(){
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
};

//2015.12.01. 12
String.prototype.dateTimeFormat = function(){
	
	var str = this.substring(0,4) 
			+ "."+ this.substring(4,6) 
			+ "." + this.substring(6,8)
			+ ". " + this.substring(8,10) ;
	return str;
};


//2015.12.01 12:21
String.prototype.timeString = function(){   
	var str = this.substring(0,4) 
			+ "."+ this.substring(4,6) 
			+ "." + this.substring(6,8)
			+ " " + this.substring(8,10) 
			+ ":" + this.substring(10,12);
	return str;
};