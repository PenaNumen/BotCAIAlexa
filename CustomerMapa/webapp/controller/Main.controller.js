sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/viz/ui5/api/env/Format',
	'sap/viz/ui5/format/ChartFormatter',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/Filter'
], function (Controller, Format, ChartFormatter, JSONModel, Filter) {
	"use strict";

	return Controller.extend("customer.CustomerMapa.controller.Main", {
		oVizFrame: null,
		userFilter: false,
		url: null,
		oModel: null,
		position: [{
			"pais": "Brazil",
			"postionLongitude": "-51.176911",
			"postionLatitude": "-10.859350",
			"zoomlevel": 4
		}, {
			"pais": "China",
			"postionLongitude": "102.134506",
			"postionLatitude": "33.834675",
			"zoomlevel": 4
		}, {
			"pais": "France",
			"postionLongitude": "2.662158",
			"postionLatitude": "46.889611",
			"zoomlevel": 6
		}, {
			"pais": "Germany",
			"postionLongitude": "10.377547",
			"postionLatitude": "51.131503",
			"zoomlevel": 6
		}, {
			"pais": "Italy",
			"postionLongitude": "12.798187",
			"postionLatitude": "42.921874",
			"zoomlevel": 5
		}, {
			"pais": "Japan",
			"postionLongitude": "137.906380",
			"postionLatitude": "36.456512",
			"zoomlevel": 5
		}, {
			"pais": "Malaysia",
			"postionLongitude": "101.907124",
			"postionLatitude": "3.814249",
			"zoomlevel": 6
		}, {
			"pais": "Mexico",
			"postionLongitude": "-102.394293",
			"postionLatitude": "23.713080",
			"zoomlevel": 5
		}, {
			"pais": "Netherlands",
			"postionLongitude": "5.454260",
			"postionLatitude": "52.146792",
			"zoomlevel": 6
		}, {
			"pais": "Norway",
			"postionLongitude": "13.998800",
			"postionLatitude": "66.380905",
			"zoomlevel": 5
		}, {
			"pais": "Russia",
			"postionLongitude": "93.824192",
			"postionLatitude": "62.743301",
			"zoomlevel": 2
		}, {
			"pais": "South Korea",
			"postionLongitude": "128.018943",
			"postionLatitude": "36.568911",
			"zoomlevel": 6
		}, {
			"pais": "Spain",
			"postionLongitude": "-3.280119",
			"postionLatitude": "39.899317",
			"zoomlevel": 6
		}, {
			"pais": "Switzerland",
			"postionLongitude": "8.104970",
			"postionLatitude": "46.897378",
			"zoomlevel": 6
		}, {
			"pais": "Taiwan",
			"postionLongitude": "121.043002",
			"postionLatitude": "23.790594",
			"zoomlevel": 6
		}, {
			"pais": "Thailand",
			"postionLongitude": "100.815523",
			"postionLatitude": "13.766037",
			"zoomlevel": 5
		}, {
			"pais": "United Kingdom",
			"postionLongitude": "-2.279159",
			"postionLatitude": "53.725269",
			"zoomlevel": 6
		}, {
			"pais": "United States",
			"postionLongitude": "-101.010615",
			"postionLatitude": "39.778354",
			"zoomlevel": 3
		}, {
			"pais": "Venezuela",
			"postionLongitude": "-66.073184",
			"postionLatitude": "7.377688",
			"zoomlevel": 6
		}],

		getSelectedCountry: function (Country) {
			if (Country == "") {
				return null;
			}
			for (var i = 0; i < this.position.length; i++) {
				try {
					var exist = this.position[i].pais.search(Country);
					if (exist != -1) {
						return this.position[i];
					}
				} catch (err) {
					//
				}
			}

			return null;

		},
		onInit: function () {
			this.url = this.getView().getModel().sServiceUrl;
			this.oModel = new sap.ui.model.odata.v2.ODataModel(this.url);
			var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
			var oPopOver = this.getView().byId("idPopOver");
			oPopOver.connect(oVizFrame.getVizUid());
			this.setTimeoutJs();

			var accessTokenMapbox =
				'<Insira o Token da sua conta no MapBox que estamos usando>';
			var oGeoMap = this.getView().byId("geoMap");
			var oMapConfig = {
				"MapProvider": {
					"name": "MAPBOX_STARTER",
					"type": "",
					"description": "",
					"tileX": "256",
					"tileY": "256",
					"maxLOD": "20",
					"copyright": "Tiles Courtesy of MapBox.com",
					"Source": [{
						"id": "s1",
						"url": "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{LOD}/{X}/{Y}@2x?access_token=" + accessTokenMapbox
					}]
				},
				"MapLayerStacks": {
					"name": "Default",
					"MapLayer": [{
						"name": "MapBox",
						"refMapProvider": "MAPBOX_STARTER",
						"opacity": "1",
						"colBkgnd": "RGB(255,255,255)"
					}]
				}
			};
			oGeoMap.setMapConfiguration(oMapConfig);
			oGeoMap.setRefMapLayerStack("Default");
			var json = new sap.ui.model.json.JSONModel();
			json.setData({
					"postionLongitude": "0",
					"postionLatitude": "0",
					"zoomlevel": 0
				});
			this.getView().setModel(json, "position");
			this.buscaMapa([]);
		},

		buscaMapa: function (aFilters) {
			var me = this;
			this.oModel.read("/Customers", {
				async: false,
				filters: aFilters,
				success: function (oData, oResponse) {
					var json = new sap.ui.model.json.JSONModel();
					json.setData(oData.results);
					me.getView().setModel(json, "spots");
				},
				error: function (err) {

				}
			});
		},
		setTimeoutJs: function () {
			var me = this;
			setTimeout(function () {
				me.buscaFiltro();
				me.setTimeoutJs();
			}, 1000);
		},
		buscaFiltro: function () {

			var me = this;
			this.oModel.read("/ActualCountry", {
				async: false,
				success: function (oData, oResponse) {
					if (oData.results.length > 0) {
						if (me.userFilter == false) {
							if (me.byId("searchField").getValue() != oData.results[oData.results.length - 1].COUNTRY) {
								me.searchFilter(oData.results[oData.results.length - 1].COUNTRY);
								me.byId("searchField").setValue(oData.results[oData.results.length - 1].COUNTRY);
							}
						}
					} else {
						if (me.userFilter == false) {
							if (me.byId("searchField").getValue() != "") {
								me.searchFilter("");
								me.byId("searchField").setValue("");
							}
						}
					}
				},
				error: function (err) {

				}
			});
		},
		onLiveChange: function (oEvt) {
			var sQuery = oEvt.getSource().getValue();
			this.userFilter = true;
			var me = this;
			if (sQuery == "") {
				setTimeout(function () {
					if (me.byId("searchField").getValue() == "") {
						me.userFilter = false;
					}
				}, 3000);
			}
		},
		onSearch: function (oEvt) {
			var sQuery = oEvt.getSource().getValue();
			//this.buscaFiltro();
			if (sQuery != "") {
				this.userFilter = true;
			}
			this.searchFilter(sQuery);
		},
		searchFilter: function (sQuery) {
			var aFilters = [];
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("COUNTRY", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}
			// update list binding
			var list = this.byId("list");
			// var spot = this.byId("spots");
			var binding = list.getBinding("items");
			// var bindingSpots = spot.getBinding("items");
			// bindingSpots.filter(aFilters, "Application");
			binding.filter(aFilters, "Application");
			this.buscaMapa(aFilters);

			var json = new sap.ui.model.json.JSONModel();
			var position = this.getSelectedCountry(sQuery);
			if (position !== null) {
				json.setData(position);
			} else {
				json.setData({
					"postionLongitude": "0",
					"postionLatitude": "0",
					"zoomlevel": 0
				});
			}
			this.getView().setModel(json, "position");
		},
		onSelectData: function (oEvent) {
			var index = oEvent.getParameter("data")[0].data._context_row_number;
			try {
				var country = this.byId("idVizFrame")._getVizDataset()._FlatTableD._data[index][0];
				this.searchFilter(country);
				this.byId("searchField").setValue(country);
				this.userFilter = true;
			} catch (err) {
				//
			}
		},

	});
});
