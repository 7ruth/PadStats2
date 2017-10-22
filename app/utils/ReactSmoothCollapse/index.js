/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import Kefir from 'kefir';
import kefirBus from 'kefir-bus';

import getTransitionTimeMs from './getTransitionTimeMs';

export type Props = {
  expanded: boolean;
  onChangeEnd?: ?() => void;
  collapsedHeight: string;
  heightTransition: string;
};
type State = {
  hasBeenVisibleBefore: boolean;
  fullyClosed: boolean;
  height: string;
};

export default class SmoothCollapse extends React.Component<Props, State> {
  _resetter = kefirBus(); // eslint-disable-line
  _mainEl: ?HTMLElement = null;
  _innerEl: ?HTMLElement = null;
  _mainElSetter = (el: ?HTMLElement) => {
    this._mainEl = el; // eslint-disable-line
  };
  _innerElSetter = (el: ?HTMLElement) => {
    this._innerEl = el; // eslint-disable-line
  };
  static propTypes = {
    expanded: PropTypes.bool.isRequired,
    onChangeEnd: PropTypes.func,
    collapsedHeight: PropTypes.string,
    heightTransition: PropTypes.string,
  };
  static defaultProps = {
    collapsedHeight: '0',
    heightTransition: '.25s ease',
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      hasBeenVisibleBefore: props.expanded || this._visibleWhenClosed(), // eslint-disable-line
      fullyClosed: !props.expanded,
      height: props.expanded ? 'auto' : props.collapsedHeight,
    };
  }

  _visibleWhenClosed(props: ?Props) {
    if (!props) props = this.props; // eslint-disable-line
    return parseFloat(props.collapsedHeight) !== 0;
  }

  componentWillUnmount() {
    this._resetter.emit(null); // eslint-disable-line
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.expanded && nextProps.expanded) {
      this._resetter.emit(null); // eslint-disable-line

      // In order to expand, we need to know the height of the children, so we
      // need to setState first so they get rendered before we continue.

      this.setState({
        fullyClosed: false,
        hasBeenVisibleBefore: true,
      }, () => {
        const mainEl = this._mainEl; // eslint-disable-line
        const innerEl = this._innerEl; // eslint-disable-line
        if (!mainEl || !innerEl) throw new Error('Should not happen');

        // Set the collapser to the target height instead of auto so that it
        // animates correctly. Then switch it to 'auto' after the animation so
        // that it flows correctly if the page is resized.
        const targetHeight = `${innerEl.clientHeight}px`;
        this.setState({
          height: targetHeight,
        });

        // Wait until the transitionend event, or until a timer goes off in
        // case the event doesn't fire because the browser doesn't support it
        // or the element is hidden before it happens. The timer is a little
        // longer than the transition is supposed to take to make sure we don't
        // cut the animation early while it's still going if the browser is
        // running it just a little slow.
        Kefir.fromEvents(mainEl, 'transitionend')
          .merge(Kefir.later((getTransitionTimeMs(nextProps.heightTransition) * 1.1) + 500))
          .takeUntilBy(this._resetter) // eslint-disable-line
          .take(1)
          .onValue(() => {
            this.setState({
              height: 'auto',
            }, () => {
              if (this.props.onChangeEnd) {
                this.props.onChangeEnd();
              }
            });
          });
      });
    } else if (this.props.expanded && !nextProps.expanded) {
      this._resetter.emit(null); // eslint-disable-line

      if (!this._innerEl) throw new Error('Should not happen'); // eslint-disable-line
      this.setState({
        height: `${this._innerEl.clientHeight}px`, // eslint-disable-line
      }, () => {
        const mainEl = this._mainEl; // eslint-disable-line
        if (!mainEl) throw new Error('Should not happen');
        // force the page layout
        mainEl.clientHeight;  // eslint-disable-line
        this.setState({
          height: nextProps.collapsedHeight,
        });

        // See comment above about previous use of transitionend event.
        Kefir.fromEvents(mainEl, 'transitionend')
          .merge(Kefir.later((getTransitionTimeMs(nextProps.heightTransition) * 1.1) + 500))
          .takeUntilBy(this._resetter) // eslint-disable-line
          .take(1)
          .onValue(() => {
            this.setState({
              fullyClosed: true,
            });
            if (this.props.onChangeEnd) {
              this.props.onChangeEnd();
            }
          });
      });
    } else if (!nextProps.expanded && this.props.collapsedHeight !== nextProps.collapsedHeight) {
      this.setState({
        hasBeenVisibleBefore:
          this.state.hasBeenVisibleBefore || this._visibleWhenClosed(nextProps), // eslint-disable-line
        height: nextProps.collapsedHeight,
      });
    }
  }

  render() {
    const visibleWhenClosed = this._visibleWhenClosed(); // eslint-disable-line
    const {height, fullyClosed, hasBeenVisibleBefore} = this.state; // eslint-disable-line
    const innerEl = hasBeenVisibleBefore ?
      <div ref={this._innerElSetter} style={{ overflow: 'hidden' }}> { // eslint-disable-line
      }
        { (this.props:any).children }
      </div>
      : null;

    return (
      <div
        ref={this._mainElSetter} // eslint-disable-line
        style={{
          height, overflow: 'hidden', // eslint-disable-line
          display: (fullyClosed && !visibleWhenClosed) ? 'none': null, // eslint-disable-line
          transition: `height ${this.props.heightTransition}`,
        }}
      >
        {innerEl}
      </div>
    );
  }
}
