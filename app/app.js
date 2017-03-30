var serviceDetails = {},
    coordsSrc = {},
    coordsDest = {};

window.initMap = function() {
    var cardDest,
        cardSrc,
        inputSrc,
        inputDest,
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 22.5726, lng: 88.3639 },
            scrollwheel: false,
            zoom: 7
        });
    cardDest = document.getElementById('pac-card');
    inputDest = document.getElementById('pac-input');
    cardSrc = document.getElementById('pac_source');
    inputSrc = document.getElementById('pac_source_input');
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(cardDest);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(cardSrc);

    var autocompleteDest = new google.maps.places.Autocomplete(inputDest);
    var autocompleteSrc = new google.maps.places.Autocomplete(inputSrc);
    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocompleteDest.bindTo('bounds', map);
    autocompleteSrc.bindTo('bounds', map);


    /**
     * Route Finder
     */
    function routeFinder(price, time) {
        // body...
        console.log('In route finder');
        if (Object.keys(coordsSrc).length !== 0 && Object.keys(coordsDest).length !== 0) {
            console.log('in route finder');
            var directionsDisplay = new google.maps.DirectionsRenderer({
                map: map
            });

            // Set destination, origin and travel mode.
            var request = {
                destination: coordsDest,
                origin: coordsSrc,
                travelMode: 'DRIVING'
            };

            // Pass the directions request to the directions service.
            var directionsService = new google.maps.DirectionsService();
            directionsService.route(request, function(response, status) {
                if (status == 'OK') {
                    // Display the route on the map.
                    directionsDisplay.setDirections(response);
                }
            });
        }
    }
    /**
     * [source place change]
     **/
    autocompleteSrc.addListener('place_changed', function() {
        coordsSrc.lat = autocompleteSrc.getPlace().geometry.location.lat();;
        coordsSrc.lng = autocompleteSrc.getPlace().geometry.location.lng();;
        console.log('co-ordinates src:', coordsSrc);
        var place = autocompleteSrc.getPlace();
        // checkZone(coordsSrc);
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        } else {
            routeFinder();
        }
    });
    /**
     * [destination place change]
     **/
    autocompleteDest.addListener('place_changed', function() {
        coordsDest.lat = autocompleteDest.getPlace().geometry.location.lat();
        coordsDest.lng = autocompleteDest.getPlace().geometry.location.lng();
        var place = autocompleteDest.getPlace();
        // getRouteTrip(coordsDest);
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        } else {
            routeFinder();
        }
    });
}
