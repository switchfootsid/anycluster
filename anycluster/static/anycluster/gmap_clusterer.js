/* SETTINGS */


/* set your markerimages depending on size here */
markerImages = {
	
	5:'/static/anycluster/images/5.png',
	10:'/static/anycluster/images/10.png',
	50:'/static/anycluster/images/50.png',
	100:'/static/anycluster/images/100.png',
	1000:'/static/anycluster/images/1000.png',
	10000:'/static/anycluster/images/10000.png'
	
};


//dragend zoom_changed will fire new clustering

var Gmap = function (id, callback) {

	var clusterer = this;
	
	//default
	this.method = 'grid';
	
	var initialize = function(imethod){
	
		var imethod = (typeof imethod === "undefined") ? 'grid' : imethod;
		
		clusterer.method = imethod;
		
		var mapOptions = {
		  minZoom: 2,
		  zoom: 2,
		  scrollwheel: false,
		  center: new google.maps.LatLng(30, 0),
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};
	
		clusterer.gmap = new google.maps.Map(document.getElementById(id),
		    mapOptions);
		
		google.maps.event.addListener(clusterer.gmap, 'idle', function() {
			 callback();
		});
		
		google.maps.event.addListener(clusterer.gmap, 'zoom_changed', function() {
			 clusterer.removeMarkerCells();
		});
      
	}
	
	initialize();
	
	//zoom in on big clusters
	this.markerClickFunction = function(marker) {
		
		clusterer.removeMarkerCells();
		var zoom = clusterer.gmap.getZoom();
		zoom = zoom + 3;
		clusterer.gmap.setCenter(marker.position, zoom);
		clusterer.gmap.setZoom(zoom);
		
	};
	
	//on small markers or on final zoom, this function is launched, may set from outside for easier use
	this.markerFinalClickFunction = function(marker) {
		alert('final click, override or change Gmap.markerFinalClickFunction for custom behaviour');
	};
	
	
	
	// filters, the are being set from outside
	this.filters = {};
	
	this.clearMarkers = false;
	
	//if a filter was added, markers need to be removed
	this.addFilters = function(newfilters){
	
		for (var key in newfilters){
			
			if (newfilters.hasOwnProperty(key)) {
			    clusterer.filters[key] = newfilters[key];
			}
		};

		clusterer.clearMarkers = true;
	};
	
	this.removeFilter = function(filter){
		delete clusterer.filters[filter];
	};
	
	
	this.gridCells = [];
	
	
	this.removeMarkerCells = function(){
		for (var i=0; i<clusterer.gridCells.length; i+=1){
			clusterer.gridCells[i].setMap(null);
		}
		
		//reset the trigger
		clusterer.clearMarkers = false;
	};
	
	
	this.drawCell = function(gridsize, center, count, zoom, id){
		if (count > 0) {
			var labelText = count;
					    	
		    	var boxText = document.createElement("div");
			    boxText.id = id;
			    boxText.position = center;
			    boxText.style.cssText = "border: none;background: none;";
			    boxText.innerHTML = count;
			    boxText.count = count;
			    
			//set opacity according to count
			var opacity;
		
			if (count <= 5 ){
				opacity = 0.2;
			}
		
			else if (count < 10) {
				opacity = 0.3;
			}
		
			else if (count < 100 ) {
				opacity = 0.4;
			}
		
			else if (count < 1000 ) {
				opacity = 0.6;
			}
		
			else {
				opacity = 0.7;
			};
			
			var offset = -gridsize/2;

			var myOptions = {
				 content: boxText
				,boxStyle: {
				   border: "none"
				  ,background: "rgba(200, 54, 54," + opacity + ")"
				  ,textAlign: "center"
				  ,fontSize: "12pt"
				  ,fontWeight: "bold"
				  ,width: "" + gridsize-2 +'px'
				  ,height: "" + gridsize-2 +'px'
				  ,lineHeight: "" + gridsize-2 +'px'
				 }
				,disableAutoPan: true
				,pixelOffset: new google.maps.Size(offset,offset)
				,position: center
				,closeBoxURL: ""
				,isHidden: false
				,pane: "floatPane"
				,enableEventPropagation: true
			};

			var gridLabel = new InfoBox(myOptions);
			gridLabel.open(clusterer.gmap);
			
			clusterer.gridCells.push(gridLabel);
			
			if (zoom >= 13 || count <= 3) {
						
				google.maps.event.addDomListener(gridLabel.content_,'click', function() {
				      clusterer.markerFinalClickFunction(this);
				    }
				);
			}
			
			else {
				google.maps.event.addDomListener(gridLabel.content_, 'click', function() {
					clusterer.markerClickFunction(this);
				});
			};
		}
		
	}
	
	
	this.drawMarker = function(center, count, zoom){
		var anchor,
		    icon;
	
		if (count <= 5 ){
			icon = new google.maps.MarkerImage(markerImages[5],
			    // second line defines the dimensions of the image
			    new google.maps.Size(30, 30),
			    // third line defines the origin of the custom icon
			    new google.maps.Point(0,0),
			    // and the last line defines the offset for the image
			    new google.maps.Point(15, 15)
			);
			anchor = new google.maps.Point(4,9);
		}
		
		else if (count < 10) {
			icon = new google.maps.MarkerImage(markerImages[10],
			    new google.maps.Size(30, 30),
			    new google.maps.Point(0,0),
			    new google.maps.Point(15, 15)
			);
			anchor = new google.maps.Point(4,9);
		
		}
		
		else if (count < 100 ) {
			icon = new google.maps.MarkerImage(markerImages[100],
			    new google.maps.Size(40, 40),
			    new google.maps.Point(0,0),
			    new google.maps.Point(20, 20)
			);
			anchor = new google.maps.Point(8,9);
		}
		
		else if (count < 1000 ) {
			icon = new google.maps.MarkerImage(markerImages[1000],
			    new google.maps.Size(50, 50),
			    new google.maps.Point(0,0),
			    new google.maps.Point(25, 25)
			);
			anchor = new google.maps.Point(12,9);
		}
		
		else {
			icon = new google.maps.MarkerImage(markerImages[10000],
			    new google.maps.Size(60, 60),
			    new google.maps.Point(0,0),
			    new google.maps.Point(30, 30)
			);
			anchor = new google.maps.Point(16,9);
		};
		
		
		var marker = new MarkerWithLabel({
		       position: center,
		       map: clusterer.gmap,
		       draggable: false,
		       labelContent: count,
		       icon: icon,
		       labelAnchor: anchor,
		       labelClass: "clusterlabels", // the CSS class for the label
		       labelInBackground: false,
		       count: count
		});
		
		clusterer.gridCells.push(marker);
		
		if (zoom >= 13 || count <= 3) {
			google.maps.event.addListener(marker, 'click', function() {
				clusterer.markerFinalClickFunction(this);
			});
		}
		
		else {
			google.maps.event.addListener(marker, 'click', function() {
				clusterer.markerClickFunction(this);
			});
		}
	}
	
	
	this.loadStart = function(){
	};
	
	
	this.cluster = function(gridsize,clustercallback){
	
		clusterer.loadStart();
	
		//gridsize is optional, default is 128
		// if you want to use the map tile size use 256
		var gridsize = (typeof gridsize === "undefined") ? 128 : gridsize;

		var zoom = clusterer.gmap.getZoom();
		var viewport = clusterer.gmap.getBounds();
		var viewport_json = {'left':viewport.getSouthWest().lng(), 'top':viewport.getNorthEast().lat(), 'right':viewport.getNorthEast().lng(), 'bottom':viewport.getSouthWest().lat()};
		
		//if filters are given, add them to GET
		if (Object.keys(clusterer.filters).length !== 0){
		
			for (var key in clusterer.filters) {
				viewport_json[ key ] = clusterer.filters[key];
			}
			
		};
		
		
		$.ajax({
			url: '/anycluster/' + clusterer.method + '/' + zoom + '/' + gridsize + '/',
			type: 'GET',
			data: viewport_json,
			dataType: 'json',
			success: function(pins){
			
				if (pins.length > 0) {
				
					if (clusterer.clearMarkers === true ){
						clusterer.removeMarkerCells();
					};
					
					
					//draw pins
					for(i=0; i<pins.length; i++) {

						var center = new google.maps.LatLng(pins[i]['center']['y'], pins[i]['center']['x']);
				
						var count = pins[i]['count'];
						
						if (clusterer.method == 'grid'){
							clusterer.drawCell(gridsize,center,count,zoom,i);
						}
						
						else if (clusterer.method == 'kmeans'){
							clusterer.drawMarker(center,count,zoom);
						};
						
						if (typeof clustercallback !== "undefined") {
							clustercallback();
						}
					
					};
					
					
				
				};
				
				
			},
			error: function(){
			}
		});
		
		
	};
	
    
}
