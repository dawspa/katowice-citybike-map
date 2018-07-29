import React, {Component} from 'react';
import ListStations from './ListStations';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'allstations': [
              {"uid":882489,
                "lat":50.258793,
                "lng":19.021583,
                "name":"Katowice Rynek",
                "number":5867,
                "bikes" : 0
              },
              {"uid":882496,
                "lat":50.26519,
                "lng":19.02866,
                "name":"NOSPR Katowice",
                "number":5868,
                "bikes" : 0
              },
              {"uid":882498,
                "lat":50.23326506955299,
                "lng":19.02778387069702,
                "name":"Dolina 3-ch Stawów",
                "number":5869,
                "bikes":0
              },
              {"uid":882502,
                "lat":50.275055,
                "lng":18.98065,
                "name":"Al. Bolesława Krzywoustego",
                "number":5870,
                "bikes":0
              },
              {"uid":882504,
                "lat":50.279943,
                "lng":18.974627,
                "name":"Al. Księcia Henryka Pobożnego",
                "number":5871,
                "bikes":0
              },
              {"uid":882519,
                "lat":50.284215,
                "lng":18.9679,
                "name":"Al. Księżnej Jadwigi Śląskiej",
                "number":5872,
                "bikes":0
              },
              {"uid":882528,
                "lat":50.251654,
                "lng":19.031044,
                "name":"Ul. Powstańców - Biblioteka Śląska",
                "number":5875,
                "bikes":0}
            ],
            'map': '',
            'infowindow': '',
            'prevmarker': ''
        };


        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }

    componentDidMount() {
        window.initMap = this.initMap;
        loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyBcPEJ1imA4dv5viseRhKMowWU9BVW16pw&callback=initMap')
    }

    initMap() {
        var self = this;

        var mapview = document.getElementById('map');
        mapview.style.height = window.innerHeight + "px";
        var map = new window.google.maps.Map(mapview, {
            center: {lat: 50.2594, lng: 19.0215},
            zoom: 13,
            mapTypeControl: false
        });

        var InfoWindow = new window.google.maps.InfoWindow({});

        window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            self.closeInfoWindow();
        });

        this.setState({
            'map': map,
            'infowindow': InfoWindow
        });

        window.google.maps.event.addDomListener(window, "resize", function () {
            var center = map.getCenter();
            window.google.maps.event.trigger(map, "resize");
            self.state.map.setCenter(center);
        });

        window.google.maps.event.addListener(map, 'click', function () {
            self.closeInfoWindow();
        });

        var allstations = [];
        this.state.allstations.forEach(function (station) {
            var longname = station.name + ' - ' + station.number;
            var uid = station.uid;
            var marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(station.lat, station.lng),
                animation: window.google.maps.Animation.DROP,
                map: map,
                icon: "http://maps.google.com/mapfiles/ms/micons/cycling.png"
            });

            marker.addListener('click', function () {
                self.openInfoWindow(marker,uid);
            });

            station.longname = longname;
            station.uid = uid;
            station.marker = marker;
            station.display = true;
            allstations.push(station);
        });
        this.setState({
            'allstations': allstations
        });
    }

    openInfoWindow(marker, uid) {
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            'prevmarker': marker
        });
        this.state.infowindow.setContent('Loading Data...');
        this.state.map.setCenter(marker.getPosition());
        this.state.map.panBy(0, -200);
        this.getMarkerInfo(marker,uid);
    }

    getMarkerInfo(marker, uid) {
        var self = this;
        var url = "https://nextbike.net/maps/nextbike-official.json?place=" + uid;
        fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        self.state.infowindow.setContent("Sorry data can't be loaded");
                        return;
                    }

                    response.json().then(function (data) {
                        var station_data = data.countries[0].cities[0].places[0];
                        var name = '<b>Station name: </b>' + station_data.name + '<br>';
                        var number = '<b>Station number: </b>' + station_data.number + '<br>';
                        var freeBikes = '<b>Free Bikes: </b>' + station_data.bikes + '<br>';
                        self.state.infowindow.setContent(name + number + freeBikes);
                    });
                }
            )
            .catch(function (err) {
                self.state.infowindow.setContent("Sorry data can't be loaded");
            });
    }

    closeInfoWindow() {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            'prevmarker': ''
        });
        this.state.infowindow.close();
    }

    render() {
        return (
            <div>
                <ListStations key="100" allstations={this.state.allstations} openInfoWindow={this.openInfoWindow}
                              closeInfoWindow={this.closeInfoWindow}/>
                <div id="map"></div>
            </div>
        );
    }
}

export default App;

function loadMapJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write("Google Maps error: cannot load");
    };
    ref.parentNode.insertBefore(script, ref);
}
