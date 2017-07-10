import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import style from './style.scss'
import optclass from '../internal/OptClass'

class Tooltip extends React.Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    /**
     * The content to display inside the `Tooltip`. Could be number, string, element or an array containing these types.
     */
    content: PropTypes.node,
    /**
     * Optional styles to add to the tooltip.
     */
    optClass: PropTypes.string,
    /**
     * The placement of the tooltip.
     */
    tooltipPlacement: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
    /**
     * Whether to show the tooltip element by default.
     */
    show: PropTypes.bool,
    /**
     * ID to use for referencing the tooltip (default: tip-wrapper)
     */
    tipWrapper: PropTypes.string,
    /**
     * When set to true, the tooltip will only appear if the tip wrapper
     * is ellipsized
     */
    detectEllipsis: PropTypes.bool,
    /**
     * Callback to call when mouseover is called.
     */
    mouseOverCallback: PropTypes.func,
    /**
     * Callback to call when mouseout is called.
     */
    mouseOutCallback: PropTypes.func
  }

  static defaultProps = {
    tooltipPlacement: 'top',
    tipWrapper: 'tip-wrapper'
  }

  state = {
    showing: false
  }

  componentDidMount = () => {
    this.props.show && this.showTip()
    this.renderTipWrapper()
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps.show !== this.props.show) return true
    if (nextProps.tooltipPlacement !== this.props.tooltipPlacement) return true
    if (nextState.showing !== this.state.showing) return true
    if (nextProps.content !== this.props.content) return true

    return false
  }

  componentWillReceiveProps = (nextProps) => {
    if (typeof nextProps.show !== 'undefined') {
      this.setState({ showing: nextProps.show })
    }
  }

  componentWillUnmount = () => {
    this.hideTip()
  }

  renderTipWrapper = () => {
    // Look for an existing reference
    let tipNode = this.nodeReference()

    // If none exists
    if (!tipNode) {
      // Create the wrapper node
      tipNode = document.createElement('div')

      // Add the CSS hook
      tipNode.setAttribute('class', style['tip-wrapper'])

      // Set the DOM reference
      tipNode.setAttribute('id', this.props.tipWrapper)

      document.getElementById('app').appendChild(tipNode)
    }
  }

  getTipElementBoundingRect = () => {
    return this._tipElement.getBoundingClientRect()
  }

  tooltipPlacement = () => {
    let tipRect = this.getTipElementBoundingRect()

    this._tooltipPlacement = {}
    this._tooltipPlacement.translate = tipRect.width / 2

    switch (this.props.tooltipPlacement) {
      case 'bottom':
        this._tooltipPlacement.left = tipRect.left + ((tipRect.right - tipRect.left) / 2)
        this._tooltipPlacement.top = tipRect.bottom
        break
      case 'right':
        this._tooltipPlacement.left = tipRect.right
        this._tooltipPlacement.top = tipRect.top + ((tipRect.bottom - tipRect.top) / 2)
        break
      case 'left':
        this._tooltipPlacement.left = tipRect.left
        this._tooltipPlacement.top = tipRect.top + ((tipRect.bottom - tipRect.top) / 2)
        break
      default:
        this._tooltipPlacement.left = tipRect.left + ((tipRect.right - tipRect.left) / 2)
        this._tooltipPlacement.top = tipRect.top
    }
  }

  showTip = () => {
    if (!this.props.detectEllipsis || this.isEllipsisActive()) {
      // We set the placement each time the user hovers over a tooltip-bound element
      this.tooltipPlacement()

      this.setState({ showing: true }, () => {
        this.renderTooltip()
      })
    }
  }

  hideTip = () => {
    // If props.show, continue to display the tip
    if (this.props.show) {
      this.setState({ showing: true })
    }
    else {
      // Get the node
      let tipNode = this.nodeReference()

      // Re-assign the wrapper style
      // because we blow away the classnames
      tipNode.setAttribute('class', style['tip-wrapper'])

      // Set the position to it's original (off screen)
      tipNode.setAttribute('style', 'top: -300px; left: -300px;')
    }
  }

  getTranslate = () => {
    return this._tooltipPlacement.translate + 'px'
  }

  getStyles = () => {
    if (!this.state.showing) return

    if (!this.props.show || (this.props.show && this.props.tooltipPlacement !== 'top')) {
      return `top: ${this._tooltipPlacement.top + window.pageYOffset}px; left: ${this._tooltipPlacement.left + window.pageXOffset}px;`
    }
    else if (this.props.show && this.props.tooltipPlacement === 'top') {
      return `top: inherit; left: inherit; transform: translateX(-50%) translateX(-${this.getTranslate()}) translateY(-100%) translateY(-6px);`
    }
  }

  getComputedStyle = (propVal) => {
    // getComputedStyle allows us to access a node's CSS values
    return window.getComputedStyle(this._tipElement, null).getPropertyValue(propVal)
  }

  isEllipsisActive = () => {
    let clone = this._tipElement.cloneNode(true)

    // Returns the CSS values for properties
    // that affect the element's width
    const cloneFontSize = this.getComputedStyle('font-size')
    const cloneFontWeight = this.getComputedStyle('font-weight')
    const cloneTextTransform = this.getComputedStyle('text-transform')

    // Inline the values, with visibility: hidden
    clone.setAttribute('style', `display: inline; width: auto; visibility: hidden; font-size: ${cloneFontSize}; font-weight: ${cloneFontWeight}; text-transform: ${cloneTextTransform}`)

    // Append the node so we can read the DOM attributes
    document.body.appendChild(clone)

    // Detect whether the hidden node width is wider than the reference element
    let isEllipsized = clone.offsetWidth > this._tipElement.offsetWidth

    // Remove the clone
    document.body.removeChild(clone)

    return isEllipsized
  }

  /**
   * Helper function to return the tooltip wrapper
   * Note: a future implmementation might allow for a node to
   * be passed in here, to allow for a custom tooltip wrapper
   */
  nodeReference = () => {
    return document.getElementById(this.props.tipWrapper)
  }

  renderTooltip = () => {
    let tipNode = this.nodeReference()

    const tipShowingClass = this.state.showing ? style['tip-showing'] : null
    const tipClass = optclass(style, ['tip-wrapper', 'is-visible', this.props.optClass, tipShowingClass, this.props.tooltipPlacement])
    const styles = this.getStyles().trim()

    tipNode.setAttribute('style', styles)
    tipNode.className = tipClass
    tipNode.textContent = this.props.content
    console.log(tipNode)
  }

  handleTooltipEnter = () => {
    this.props.mouseOverCallback && this.props.mouseOverCallback()
  }

  handleTooltipOut = () => {
    this.props.mouseOutCallback && this.props.mouseOutCallback()
  }

  render = () => {
    return (
      <span onMouseOver={this.showTip} onMouseOut={this.hideTip} ref={(c) => this._tipElement = c} >
        {this.props.children}
      </span>
    )
  }
}

export default Tooltip
