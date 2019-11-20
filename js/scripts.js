//Construcción de barra de Opacidad
function updateOpacity() {
	document.getElementById("span-opacity").innerHTML = document.getElementById("sld-opacity").value;
	topografiaLayer.setOpacity(document.getElementById("sld-opacity").value);
}

// Creación de un mapa de Leaflet y esconder la atribución para desplegar correctamente la barra de escala. 
var map = L.map("mapid"); // Después de "mapid" se podría poner una coma y el siguiente texto para eliminar la atribución si se quisiera ,{attributionControl:false}

// Centro del mapa y nivel de acercamiento
var sardinal_centrado = L.latLng([10.4885, -85.6855]);
var zoomLevel = 12;

// Definición de la vista del mapa
map.setView(sardinal_centrado, zoomLevel);

// Adición de capas base
esriLayer = L.tileLayer.provider("Esri.WorldImagery").addTo(map);
osmLayer = L.tileLayer.provider("OpenStreetMap.Mapnik").addTo(map);

// Adición de capas WMS
var cantonesWMSLayer = L.tileLayer.wms('http://geos.snitcr.go.cr/be/IGN_5/wms?', {
	layers: 'limitecantonal_5k',
	format: 'image/png',
	transparent: true
}).addTo(map);

var distritosWMSLayer = L.tileLayer.wms('http://geos.snitcr.go.cr/be/IGN_5/wms?', {
	layers: 'limitedistrital_5k',
	format: 'image/png',
	transparent: true
}).addTo(map);
// Adición de capas raster
var topografiaLayer = L.imageOverlay('DEM.jpg', 
	[[10.622484037, -85.855035144], 
	[10.367660852, -85.520348012]], 
	{opacity:0.5}
).addTo(map);

// Diferenciación entre mapas base y overlay
var baseMaps = {
	"ESRI World Imagery": esriLayer,
	"OpenStreetMap": osmLayer,	
};
var overlayMaps = {	
	"Topografía": topografiaLayer,
	"Cantones": cantonesWMSLayer,
	"Distritos": distritosWMSLayer,	//Podría no requerir cargar ninguna capa aquí, pero si no debe quedar vacío oara que construya la sección de Overlays en el menú. 
};
//Creación del Control de Capas
control_layers = L.control.layers(baseMaps, overlayMaps,{
	position:'topright', //'topleft', 'bottomleft','bottomright'	
	collapsed: true //false?
}).addTo(map);

// Creación de barra de escala
L.control.scale({metric: true,imperial: false,position:'topleft'}).addTo(map); 

//Carga de capas Geojson Vectoriales
	$.getJSON("vectorial/provincias.geojson", function(geodata) {
	var layer_geojson_p = L.geoJson(geodata, {
		style: function(feature) {
			return {'color': "#000CFF", 'weight': 2, 'fillOpacity': 0.0}
		},
		onEachFeature: function(feature, layer) {
			var popupText = "Nombre Provincia: " + feature.properties.provincia + "<br>" + "Area: " + feature.properties.area;
			layer.bindPopup(popupText);
		}			
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_p, 'Provincias');	
});

	$.getJSON("vectorial/pozos_dentro_area_WGS84.geojson", function(geodata) {
	var layer_geojson_asp2 = L.geoJson(geodata, {
		style: function(feature) {
			return {'color': "#00FFBD", 'weight': 2, 'fillOpacity': 0.0}
		},
		onEachFeature: function(feature, layer) {
			var popupText = "Número de Concesión: " + feature.properties.num_conce + "<br>" + "Canon Anual: " + feature.properties.canon_an;
			layer.bindPopup(popupText);
		}			
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_asp2, 'Pozos Sardinal - El Coco Ocotal');
});	

	$.getJSON("vectorial/AreaCuencasWGS84.geojson", function(geodata) {
	var layer_geojson_asp3 = L.geoJson(geodata, {
		style: function(feature) {
			return {'color': "#00D1FF" , 'weight': 2, 'fillOpacity': 0.0}
		},					
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_asp3, 'Area Cuencas');
});	

	$.getJSON("vectorial/AreaCocoOcotalWGS84.geojson", function(geodata) {
	var layer_geojson_asp3 = L.geoJson(geodata, {
		style: function(feature) {
			return {'color': "#BDFF00", 'weight': 2, 'fillOpacity': 0.0}
		},					
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_asp3, 'Area Coco-Ocotal');
});	

	$.getJSON("vectorial/AreaSardinalWGS84.geojson", function(geodata) {
	var layer_geojson_asp3 = L.geoJson(geodata, {
		style: function(feature) {
			return {'color': "#C500FF", 'weight': 2, 'fillOpacity': 0.0}
		},					
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_asp3, 'Area Sardinal');
});	