//Open a database connection
var locl = $.request.parameters.get("location");
var lerr = "";
var conn = $.db.getConnection();
var pstmt = null;
var rs = null;


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

lerr = updateCountry(locl);

if (lerr !== "X") {
    
    var tot = "";
    
    if (!locl) {
        pstmt = conn.prepareStatement('SELECT COUNT(*) FROM "alexa"."alexa.data::customer_data.Customers"');
    } else {
        pstmt = conn.prepareStatement('SELECT COUNT(*) FROM "alexa"."alexa.data::customer_data.Customers" WHERE "COUNTRY" = \'' + locl + '\' '); 
    }
    
    //Execute the query
    rs = pstmt.executeQuery();
    
    if (!rs.next()) {
        //Something went wrong: Return an error
        $.response.setBody("Failed to retrieve data");
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
    } else {
        do {
            tot = rs.getString(1);
        } while (rs.next())
    }
    
    pstmt.close();
    
    if (!locl) {
        
        pstmt = conn.prepareStatement('SELECT DISTINCT("COUNTRY") FROM "alexa"."alexa.data::customer_data.Customers" ORDER BY "COUNTRY" ');
        
        rs = pstmt.executeQuery();
        var countries = "";
        var count = 1;
        
        if (rs.next()){
            
            countries = rs.getString(1);
        
            while (rs.next()) {
                count = count + 1;
                if  (count < 4) {
                    countries = countries + ", " + rs.getString(1);
                } 
                if (count === 3) {
                    countries = countries + " and others. ";
                }
            }
        }
        
        pstmt.close();
        
        if (count > 1){
            var tcountries = "countries";
            var askSpecific = "Would you like to know about some country?";
        } else {
            tcountries = "country";
        }
        
        var resp = "The number of our global customers are " + tot + ", in " + count + " " + tcountries + ". " + countries + askSpecific;
        
    } else {
        resp = "In " + locl + " we have " + tot + " customers";
    }
    
    conn.close();
    
    var output = JSON.stringify({ "replies": [{"type": "text", "content": resp}], "conversation": { "language": "en"}});
    
    //Return the HTML response.
    $.response.status = $.net.http.OK;
    $.response.contentType = "application/json";
    $.response.setBody(output);

}