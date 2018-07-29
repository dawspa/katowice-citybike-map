import React from 'react';

class StationItem extends React.Component {

    render() {
        return (
            <li role="button" className="box" tabIndex="0" onKeyPress={this.props.openInfoWindow.bind(this, this.props.data.marker, this.props.data.uid)} onClick={this.props.openInfoWindow.bind(this, this.props.data.marker, this.props.data.uid)}>{this.props.data.longname}</li>
        );
    }
}

export default StationItem;
