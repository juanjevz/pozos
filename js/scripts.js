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
var topografiaLayer = L.imageOverlay('raster/DEM.jpg', 
	[[10.622484037, -85.855035144], 
	[10.367660852, -85.520348012]], 
	{opacity:0.5}
).addTo(map);

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

// <!-- Filtrando datos geográficos en formato GeoJSON con Leaflet......................................................................DE AQUI INICIA -->

var pozos = L.layerGroup().addTo(map);

	function colorPuntos(d) { 
			return d == "Perforado" ? '#FF0000' : 
			d == "Artesanal" ? '#00FF00' : 
			'#000000'; 
		};
 
	function tipo_pozos (feature) {
			return{
				radius: 7,
				fillColor: colorPuntos(feature.properties.tipo), 
			    color: colorPuntos(feature.properties.tipo), 
				weight: 1,
				opacity : 1,
				fillOpacity : 0.8
			};
		}; 


	function popup_pozos (feature, layer) {
					layer.bindPopup("<div style=text-align:center><h3> Pozo: "+feature.properties.id+
			        "<h3></div><hr><table><tr><td>Numero Concesion: "+feature.properties.num_conce+
			        "</td></tr><tr><td>Tipo: "+feature.properties.tipo+
			        "</td></tr></table>",
			        {minWidth: 150, maxWidth: 200});				
					};

	var MarkerOptions = {
				    radius: 8,
				    fillColor: "#ff7800",
				    color: "#000",
				    weight: 1,
				    opacity: 1,
				    fillOpacity: 0.8
					};


	function myFunction() { 
	$.getJSON("vectorial/pozos.geojson", function(geodata) {
	var layer_geojson_pozos = L.geoJson(geodata, {
		pointToLayer:function (feature, latlong){return L.circleMarker(latlong, MarkerOptions)},
		style: tipo_pozos, 
		onEachFeature: popup_pozos
		}).addTo(map);
	control_layers.addOverlay(layer_geojson_pozos, 'Todos los Pozos');
	pozos.addLayer(layer_geojson_pozos);
	});	
	
	}

	function estiloSelect() {
		var miSelect = document.getElementById("estilo").value;
				
		$.getJSON("vectorial/pozos.geojson", function(geodata) {
			var layer_geojson_pozos = L.geoJson(geodata, {
							pointToLayer: function (feature, latlong) {
									return L.circleMarker(latlong, MarkerOptions);
								},
							filter: function(feature, layer) {						
								 if(miSelect != "TODOS")		
									 
									return (feature.properties.tipo == miSelect );
								else
									return true;
							},	
							style:tipo_pozos,
							onEachFeature: popup_pozos	
					});		
			pozos.clearLayers();
			pozos.addLayer(layer_geojson_pozos);
 
		})
	};

// <!-- Filtrando datos geográficos en formato GeoJSON con Leaflet......................................................................FINALIZA AQUI -->


// <!-- Complemento Leaflet-choropleth JUAN le falta la barra de colores.......................................................................DE AQUI INICIA -->

$.getJSON("vectorial/cuencas.shp.geojson", function (geojson) {
	var layer_geojson_cuencas = L.choropleth(geojson, {
		valueProperty: 'cantidad',
		scale: ['white', 'red'],
		steps: 2,
		mode: 'q',
		style: {
			color: '#fff',
			weight: 2,
			fillOpacity: 0.8
		},
		onEachFeature: function (feature, layer) {
			layer.bindPopup('Nombre de la Cuenca: ' + feature.properties.cuencas+ '<br>' + 'Cantidad de pozos: ' + feature.properties.cantidad.toLocaleString())
		}
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_cuencas, 'Cuencas (cantidad)');	
		  
	var legend = L.control({ position: 'bottomright' })
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend')
		var limits = layer_geojson_cuencas.options.limits
		var colors = layer_geojson_cuencas.options.colors
		var labels = []
	
    // Add min & max
		div.innerHTML = '<div class="labels"><div class="min">' + limits[0] + '</div> \
			<div class="max">' + limits[limits.length - 1] + '</div></div>'

		limits.forEach(function (limit, index) {
		labels.push('<li style="background-color: ' + colors[index] + '"></li>')
		})

		div.innerHTML += '<ul>' + labels.join('') + '</ul>'
		return div
	}
	legend.addTo(map)
	
});	

// <!-- Complemento Leaflet-choropleth  JUAN le falta la barra de colores......................................................................FINALIZA AQUI  -->	
		
	
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