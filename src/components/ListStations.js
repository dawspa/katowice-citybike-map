
import React, {Component} from 'react';
import StationItem from './StationItem';

class ListStations extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'stations': '',
            'query': '',
            'suggestions': true,
        };

        this.filterStations = this.filterStations.bind(this);
        this.toggleSuggestions = this.toggleSuggestions.bind(this);
    }

    filterStations(event) {
        this.props.closeInfoWindow();
        const {value} = event.target;
        var stations = [];
        this.props.allstations.forEach(function (location) {
            if (location.longname.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                location.marker.setVisible(true);
                stations.push(location);
            } else {
                location.marker.setVisible(false);
            }
        });

        this.setState({
            'stations': stations,
            'query': value
        });
    }

    toggleSuggestions() {
        this.setState({
            'suggestions': !this.state.suggestions
        });
    }

    componentWillMount() {
        this.setState({
            'stations': this.props.allstations
        });
    }

    render() {
        var ListStations = this.state.stations.map(function (stationItem, index) {
            return (
                <StationItem key={index} openInfoWindow={this.props.openInfoWindow.bind(this)} data={stationItem}/>
            );
        }, this);

        return (
            <div className="search">
              <div className="siteTitle">
                  <a className="title" href="#">Katowice CityBike Map</a>
              </div>
                <input role="search" aria-labelledby="filter" id="search-field" className="search-field" type="text" placeholder="Search citybike station"
                       value={this.state.query} onChange={this.filterStations}/>
                <ul>
                    {this.state.suggestions && ListStations}
                </ul>
                <button className="button" onClick={this.toggleSuggestions}>Toggle stations list</button>
            </div>
        );
    }
}

export default ListStations;
