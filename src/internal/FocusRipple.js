import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import autoPrefix from '../utils/autoPrefix';
import transitions from '../styles/transitions';
import ScaleInTransitionGroup from './ScaleIn';

const pulsateDuration = 750;

const FocusRipple = React.createClass({

  propTypes: {
    color: React.PropTypes.string,
    innerStyle: React.PropTypes.object,

    /**
     * @ignore
     * The material-ui theme applied to this component.
     */
    muiTheme: React.PropTypes.object.isRequired,

    opacity: React.PropTypes.number,
    show: React.PropTypes.bool,

    /**
     * Override the inline-styles of the root element.
     */
    style: React.PropTypes.object,
  },

  mixins: [
    PureRenderMixin,
  ],

  componentDidMount() {
    if (this.props.show) {
      this.setRippleSize();
      this.pulsate();
    }
  },

  componentDidUpdate() {
    if (this.props.show) {
      this.setRippleSize();
      this.pulsate();
    } else {
      if (this.timeout) clearTimeout(this.timeout);
    }
  },

  componentWillUnmount() {
    clearTimeout(this.timeout);
  },

  getRippleElement(props) {
    const {
      color,
      innerStyle,
      muiTheme: {
        prepareStyles,
        ripple,
      },
      opacity,
    } = props;

    const innerStyles = Object.assign({
      position: 'absolute',
      height: '100%',
      width: '100%',
      borderRadius: '50%',
      opacity: opacity ? opacity : 0.16,
      backgroundColor: color || ripple.color,
      transition: transitions.easeOut(`${pulsateDuration}ms`, 'transform', null, transitions.easeInOutFunction),
    }, innerStyle);

    return <div ref="innerCircle" style={prepareStyles(Object.assign({}, innerStyles))} />;
  },

  pulsate() {
    const innerCircle = ReactDOM.findDOMNode(this.refs.innerCircle);
    if (!innerCircle) return;

    const startScale = 'scale(1)';
    const endScale = 'scale(0.85)';
    const currentScale = innerCircle.style.transform || startScale;
    const nextScale = currentScale === startScale ? endScale : startScale;

    autoPrefix.set(innerCircle.style, 'transform', nextScale, this.props.muiTheme);
    this.timeout = setTimeout(this.pulsate, pulsateDuration);
  },

  setRippleSize() {
    const el = ReactDOM.findDOMNode(this.refs.innerCircle);
    const height = el.offsetHeight;
    const width = el.offsetWidth;
    const size = Math.max(height, width);

    let oldTop = 0;
    // For browsers that don't support endsWith()
    if (el.style.top.indexOf('px', el.style.top.length - 2) !== -1) {
      oldTop = parseInt(el.style.top);
    }
    el.style.height = `${size}px`;
    el.style.top = `${(height / 2) - (size / 2 ) + oldTop}px`;
  },

  render() {
    const {
      show,
      style,
    } = this.props;

    const mergedRootStyles = Object.assign({
      height: '100%',
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
    }, style);

    const ripple = show ? this.getRippleElement(this.props) : null;

    return (
      <ScaleInTransitionGroup
        maxScale={0.85}
        style={mergedRootStyles}
      >
        {ripple}
      </ScaleInTransitionGroup>
    );
  },
});

export default FocusRipple;
