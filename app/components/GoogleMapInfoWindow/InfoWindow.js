import React from 'react';
import PropTypes from 'prop-types';
import ReactDOMServer from 'react-dom/server';

export class InfoWindow extends React.Component {

  componentDidMount() {
    this.renderInfoWindow();
  }

  componentDidUpdate(prevProps) {
    const { google, map } = this.props; //eslint-disable-line

    if (!google || !map) {
      return;
    }

    if (map !== prevProps.map) {
      this.renderInfoWindow();
    }

    if (this.props.children !== prevProps.children) {
      this.updateContent();
    }

    if ((this.props.visible !== prevProps.visible ||
        this.props.marker !== prevProps.marker)) {
        this.props.visible ? //eslint-disable-line
          this.openWindow() :
          this.closeWindow();
    }
  }

  onOpen() {
    if (this.props.onOpen) {
      this.props.onOpen();
    }
  }

  onClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  openWindow() {
    this.infowindow.open(this.props.map, this.props.marker);
  }

  updateContent() {
    const content = this.renderChildren();
    this.infowindow.setContent(content);
  }

  closeWindow() {
    this.infowindow.close();
  }

  renderInfoWindow() {
    let {map, google, mapCenter} = this.props; //eslint-disable-line

    if (!google || !google.maps) {
      return;
    }

    const iw = this.infowindow = new google.maps.InfoWindow({
      content: '',
    });

    google.maps.event
      .addListener(iw, 'closeclick', this.onClose.bind(this));
    google.maps.event
      .addListener(iw, 'domready', this.onOpen.bind(this));
  }

  renderChildren() {
    const { children } = this.props;
    return ReactDOMServer.renderToString(children);
  }

  render() {
    return null;
  }
}

InfoWindow.propTypes = {
  children: PropTypes.element.isRequired,
  map: PropTypes.object,
  marker: PropTypes.object,
  visible: PropTypes.bool,

  // callbacks
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
};

InfoWindow.defaultProps = {
  visible: false,
};

export default InfoWindow;
