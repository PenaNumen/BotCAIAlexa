function initModel() {
	var sUrl = "/CustomerOData/alexa/data/customers.xsodata/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}