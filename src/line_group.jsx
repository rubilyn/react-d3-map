"use strict"

import {
  default as React,
  Component,
  PropTypes
} from 'react';

import {
  OrderedMap,
  Map
} from 'immutable'

import d3 from 'd3';

import {
  Popup
} from 'react-d3-map-core';

import {
  default as LineCollection
} from './components/mesh_collection'

export default class LineGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPopup: OrderedMap()
    }
  }

  static contextTypes = {
    geoPath: React.PropTypes.func.isRequired,
    projection: React.PropTypes.func.isRequired
  }

  _onClick(that, d, id) {

    var {
      showPopup
    } = this.state;

    const {
      onClick
    } = this.props;

    const {
      projection
    } = this.context;

    if(onClick) onClick(that, d, id);

    if(showPopup.keySeq().toArray().indexOf(id) !== -1) {
      // hide popup
      var newPopup = showPopup.delete(id);
    } else {
      // add a popup
      var position = projection.invert([d3.event.clientX, d3.event.clientY]);

      var newPopup = showPopup.set(id, Map({
        xPopup: position[0],
        yPopup: position[1],
        data: d
      }));
    }

    this.setState({
      showPopup: newPopup
    })
  }

  _onCloseClick(id) {

    var {
      showPopup
    } = this.state;

    const {
      onCloseClick
    } = this.props;

    if(onCloseClick) onCloseClick(id);

    if(showPopup.keySeq().toArray().indexOf(id) !== -1) {
      // hide popup
      var newPopup = showPopup.delete(id);
    }

    this.setState({
      showPopup: newPopup
    })
  }

  render() {

    const {
      showPopup
    } = this.state;

    const {
      data,
      popupContent,
      onMouseOut,
      onMouseOver,
      meshClass
    } = this.props;

    const {
      geoPath,
      projection
    } = this.context;

    var onClick = this._onClick.bind(this)
    var popup;

    if(showPopup.size && popupContent) {
      popup = showPopup.keySeq().toArray().map((d, i) => {
        var xPopup = showPopup.get(d).get('xPopup');
        var yPopup = showPopup.get(d).get('yPopup');
        var popupData = showPopup.get(d).get('data');

        var point = projection([xPopup, yPopup])
        var content = popupContent(popupData);

        var onCloseClick = this._onCloseClick.bind(this, d)

        return  (
          <Popup
            key= {i}
            x= {point[0]}
            y= {point[1] - 10}
            contentPopup={content}
            closeClick= {onCloseClick}
          />
        )
      })

    }

    return (
      <g>
        <LineCollection
          data= {data}
          geoPath= {geoPath}
          onClick= {onClick}
          onMouseOver= {onMouseOver}
          onMouseOut= {onMouseOut}
          meshClass= {meshClass}
          {...this.state}
        />
        {popup}
      </g>
    )
  }
}