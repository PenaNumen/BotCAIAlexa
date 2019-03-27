var conn = $.db.getConnection();
var pstmt = null;
var rs = null;
var ex = null;

pstmt = conn.prepareStatement('DELETE FROM "alexa"."alexa.data::customer_data.Actual_Country"');
try {
    rs = pstmt.execute();
    conn.commit();
    pstmt.close();
} catch(e) {
    $.response.setBody(e.message);
}

conn.close();
