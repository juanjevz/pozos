function updateOpacity() {
	document.getElementById("span-opacity").innerHTML = document.getElementById("sld-opacity").value;
	topografiaLayer.setOpacity(document.getElementById("sld-opacity").value);
}

// Creación de un mapa de Leaflet
var map = L.map("mapid");

// Centro del mapa y nivel de acercamiento
var sardinal_centrado = L.latLng([10.4885, -85.6855]);
var zoomLevel = 12;

// Definición de la vista del mapa
map.setView(sardinal_centrado, zoomLevel);

// Adición de capa
esriLayer = L.tileLayer.provider("Esri.WorldImagery").addTo(map);
osmLayer = L.tileLayer.provider("OpenStreetMap.Mapnik").addTo(map);
openRailwayLayer = L.tileLayer.provider("OpenRailwayMap").addTo(map);

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

var topografiaLayer = L.imageOverlay('DEM.jpg', 
	[[10.622484037, -85.855035144], 
	[10.367660852, -85.520348012]], 
	{opacity:0.5}
).addTo(map);

var baseMaps = {
	"ESRI World Imagery": esriLayer,
	"OpenStreetMap": osmLayer,
	"Cantones": cantonesWMSLayer,
	"Distritos": distritosWMSLayer,
	"Topografía": topografiaLayer,	
};
var overlayMaps = {		//no se carga ninguna capa aquí pero es para que cree la sección de Overlays en el menú. 
};
control_layers = L.control.layers(baseMaps, overlayMaps,{
	position:'bottomright', collapsed: false //'topleft', 'bottomleft','bottomright'
	//collapsed: false//true
}).addTo(map);
//L.control.zoom({position:'toprigth'}).addTo(map);
//L.control.scale({imperial: false}).addTo(map);	

// Marcador para la Catedral Metropolitana de San José
//var catedralSJMarker = L.marker([9.9326673, -84.0787633], {draggable:true, opacity:0.5}).addTo(map);
//catedralSJMarker.bindPopup('<a href="https://es.wikipedia.org/wiki/Catedral_metropolitana_de_San_Jos%C3%A9">Catedral Metropolitana de San José</a>.<br>Catedral de estilo clásico y barroco. Templo principal de la arquidiócesis católica de San José.<br>Construída entre 1825 y 1827 y reconstruída en 1878.').openPopup();
//catedralSJMarker.bindTooltip("Catedral Metropolitana de San José").openTooltip();

// En JS: marcador para la Catedral Metropolitana de San José
/* var catedralSJMarker = L.marker([9.9326673, -84.0787633],
	{ icon: L.divIcon(
		{ html: '<i class="fas fa-church"></i>'}
	)}
).addTo(map) */;	

	$.getJSON("provincias.geojson", function(geodata) {
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

	$.getJSON("pozos_dentro_area_WGS84.geojson", function(geodata) {
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

	$.getJSON("AreaCuencasWGS84.geojson", function(geodata) {
	var layer_geojson_asp3 = L.geoJson(geodata, {
		style: function(feature) {
			return {'color': "#00D1FF" , 'weight': 2, 'fillOpacity': 0.0}
		},					
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_asp3, 'Area Cuencas');
});	

	$.getJSON("AreaCocoOcotalWGS84.geojson", function(geodata) {
	var layer_geojson_asp3 = L.geoJson(geodata, {
		style: function(feature) {
			return {'color': "#BDFF00", 'weight': 2, 'fillOpacity': 0.0}
		},					
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_asp3, 'Area Coco-Ocotal');
});	

	$.getJSON("AreaSardinalWGS84.geojson", function(geodata) {
	var layer_geojson_asp3 = L.geoJson(geodata, {
		style: function(feature) {
			return {'color': "#C500FF", 'weight': 2, 'fillOpacity': 0.0}
		},					
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_asp3, 'Area Sardinal');
});	