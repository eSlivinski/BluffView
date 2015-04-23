/*GLOBAL VARIABLES*/

var map = L.map('map', {
	doubleClickZoom : false,
	attributionControl : false,
	zoomControl: false
}).setView([43.2914, -87.8878], 11);

var esri = L.TileLayer.provider('Esri.WorldImagery', { ACTIVE: "ESRI" }).addTo(map);

var yearGroup= new L.FeatureGroup().addTo(map)
var OzaukeeCo = new L.FeatureGroup().addTo(map)




function yearOverlay(YEAR){
	//type=(YEAR==2010)? 'image/jpeg' : 'image/png';
	yearGroup.clearLayers();
	if (YEAR===0){
		// 
	}else if (YEAR===2010){
  		var mywms =  L.esri.dynamicMapLayer("http://216.165.135.4:6080/arcgis/rest/services/Ozaukee_Ortho2010/MapServer", {
 			opacity: 1
  		}).addTo(yearGroup);
  		var tile2 =  L.esri.dynamicMapLayer("http://216.165.135.4:6080/arcgis/rest/services/Oz2/MapServer", {
 			opacity: 1
  		}).addTo(yearGroup);
  		yearGroup.bringToBack();
  	}else{
		var mywms = L.tileLayer.wms("http://floodatlas.org/geoserver/gwc/service/wms", {
		    layers: 'ozaukee:Ozaukee'+YEAR+'',
		    transparent: true,
		    attribution: "Ozaukee"+YEAR+"",
		    format: 'image/png'
		}).addTo(yearGroup);
		console.log(mywms)
  	}
  	
}
