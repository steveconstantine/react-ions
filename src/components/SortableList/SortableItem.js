import React from 'react'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import classNames from 'classnames/bind'
import Badge from '../Badge'
import Icon from '../Icon'
import style from './style.scss'

const sortableItemSource = {
  beginDrag(props) {
    if (props.getDimensions) {
      props.getDimensions()
    }

    return {
      value: props.value,
      text: props.text,
      index: props.index
    }
  }
}

const sortableItemTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index
    const hoverIndex = props.index

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

    // Determine mouse position
    const clientOffset = monitor.getClientOffset()

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return
    }

    // Time to actually perform the action
    props.moveSortableItem(dragIndex, hoverIndex)

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex
  }
}

class SortableItem extends React.Component {

  static propTypes = {
    /**
     * Binds to react-dnd connectDragSource method.
     */
    connectDragSource: React.PropTypes.func,
    /**
     * Binds to react-dnd connectDropTarget method.
     */
    connectDropTarget: React.PropTypes.func,
    /**
     * Binds to react-dnd connectDragPreview method.
     */
    connectDragPreview: React.PropTypes.func,
    /**
     * Index of the item in the list.
     */
    index: React.PropTypes.number,
    /**
     * Whether the item is being dragged.
     */
    isDragging: React.PropTypes.bool,
    /**
     * The value of the item.
     */
    value: React.PropTypes.any,
    /**
     * The text to display inside the item.
     */
    text: React.PropTypes.string,
    /**
     * A callback that gets triggered when the item is moved.
     */
    moveSortableItem: React.PropTypes.func,
    /**
     * A callback that gets triggered when the item is removed.
     */
    removeSortableItem: React.PropTypes.func,
    /**
     * The total number of items in the list.
     */
    count: React.PropTypes.number
  }

  state = {
    count: this.props.count
  }

  componentDidMount() {
    // Use empty image as a drag preview so browsers don't draw it
    // and we can draw whatever we want on the custom drag layer instead.
    this.props.connectDragPreview(getEmptyImage(), {
      // IE fallback: specify that we'd rather screenshot the node
      // when it already knows it's being dragged so we can hide it with CSS.
      captureDraggingState: true
    })
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.count !== this.state.count) {
      this.setState({ count: nextProps.count })
    }
  }

  removeSortableItem = () => {
    this.props.removeSortableItem(this.props.index)
  }

  render = () => {
    const cx = classNames.bind(style)
    const { text, index, isDragging, connectDragSource, connectDropTarget, canDrop } = this.props
    const opacity = isDragging ? 0 : 1
    const badgeOpacity = this.state.count > 1 ? 1 - ((0.6 / (this.state.count - 1)) * index) : 1
    const sortableItemClasses = cx(style['sortable-item'], (canDrop ? 'dragging' : ''))

    return connectDropTarget(
      <div style={{ opacity }} className={sortableItemClasses}>
        <div style={{ opacity: badgeOpacity }}><Badge text={index + 1} theme='sky' optClass={style['sortable-item-badge']} /></div>
        <span>{text}</span>
        <div className={style.actions}>
          <Icon name="icon-bin-2-1" width="13" height="13" fill="#233040" onClick={this.removeSortableItem} />
          {connectDragSource(<div className={style.handle}><span></span><span></span><span></span><span></span></div>)}
        </div>
      </div>
    )
  }
}

SortableItem = DragSource('item', sortableItemSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))(SortableItem)

SortableItem = DropTarget('item', sortableItemTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  canDrop: monitor.canDrop()
}))(SortableItem)

export default SortableItem
