// $.import("customers.c001", "customer_lib");
// var customer_lib = $.customers.c001.customer_lib;

var locl = $.request.parameters.get("location");

var conn = $.db.getConnection();
var pstmt = null;
var rs = null;
var ex = null;


function updateCountry(location){
    
    pstmt = conn.prepareStatement('DELETE FROM "alexa"."alexa.data::customer_data.Actual_Country"');
    try {
        rs = pstmt.execute();
        conn.commit();
        pstmt.close();
    } catch(e) {
        $.response.setBody(e.message);
        return "X";
    }
    
    if (location) {
        pstmt = conn.prepareStatement('INSERT INTO "alexa"."alexa.data::customer_data.Actual_Country" VALUES (\'' + location + '\',0,0)');
        try {
            rs = pstmt.execute();
            conn.commit();
            pstmt.close();
        } catch(e) {
            $.response.setBody(e.message);
            return "X";
        }
    }
}

ex = updateCountry(locl);

if (locl){
    
    pstmt = conn.prepareStatement('SELECT "QTY" FROM "_SYS_BIC"."alexa.data/cv_customers_by_country" WHERE "COUNTRY" = \'' + locl + '\' ');
    rs = pstmt.executeQuery();
    if(rs.next()){
        var tot = rs.getString(1);
    }
    pstmt.close();
    
    pstmt = conn.prepareStatement('SELECT "NAME" FROM "alexa"."alexa.data::customer_data.Customers" WHERE "COUNTRY" = \'' + locl + '\' ORDER BY "NAME"');
    
    rs = pstmt.executeQuery();
    
    var customers = "";
    var cont = 1;
        
    if (!rs.next()) {
        //Something went wrong: Return an error
        $.response.setBody("Failed to retrieve data");
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
    } else {
        customers = rs.getString(1);
         while (rs.next()) {
            cont = cont + 1;
            if (cont < tot) {
                customers = customers + ', ' + rs.getString(1);
            } else{
                customers = customers + " and " + rs.getString(1); 
            }
        }
    }
        
    pstmt.close();
    
     var output = JSON.stringify({ "replies": [{"type": "text", "content": customers}], "conversation": { "language": "en"}});
    
    //Return the HTML response.
    $.response.status = $.net.http.OK;
    $.response.contentType = "application/json";
    $.response.setBody(output);
}