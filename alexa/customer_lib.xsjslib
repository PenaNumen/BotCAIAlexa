var connection = $.db.getConnection();
var statement = null;
var request = null;


function updateCountry(location){
    
    statement = connection.prepareStatement('DELETE FROM "alexa"."alexa.data::customer_data.Actual_Country"');
    try {
        request = statement.execute();
        connection.commit();
        statement.close();
    } catch(e) {
        $.response.setBody(e.message);
        return "X";
    }
    
    if (location) {
        statement = connection.prepareStatement('INSERT INTO "alexa"."alexa.data::customer_data.Actual_Country" VALUES (\'' + location + '\',0,0)');
        try {
            request = statement.execute();
            connection.commit();
            statement.close();
        } catch(e) {
            $.response.setBody(e.message);
            return "X";
        }
    }
}