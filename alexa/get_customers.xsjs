//Get parameter "location"
var locl = $.request.parameters.get("location");
//Open connection with DB
var conn = $.db.getConnection();
var pstmt = null;
var rs = null;

pstmt = conn.prepareStatement('SELECT COUNT(*) FROM "alexa"."alexa.data::customer_data.Customers" WHERE "COUNTRY" = \'' + locl + '\' ');

try {
    //Execute the query
    rs = pstmt.executeQuery();
    while (rs.next()) {
       var tot = rs.getString(1);
    } 
    pstmt.close();
} catch(e) {
    $.response.setBody(e.message);
    $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
}

if (tot < 1) {
    var resp = "Location not found";
} else {
    resp = "In " + locl + " we have " + tot + " customers";
}

conn.close();

//You have to return a JSON exactly as described in documentation    
var output = JSON.stringify({ "replies": [{"type": "text", "content": resp}], "conversation": { "language": "en"}});

//Return the HTML response.
$.response.status = $.net.http.OK;
$.response.contentType = "application/json";
$.response.setBody(output);
