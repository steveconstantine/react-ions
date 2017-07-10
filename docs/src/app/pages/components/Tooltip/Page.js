import React from 'react'
import PropsList from 'private/modules/PropsList'
import docs from '!!docgen!react-ions/lib/components/Tooltip/Tooltip'
import CodeExample from 'private/modules/CodeExample'
import styles from 'private/css/content'
import ExampleTooltipDefault from './ExampleTooltipDefault'
import exampleTooltipDefaultCode from '!raw!./ExampleTooltipDefault'
import ExampleTooltipVisible from './ExampleTooltipVisible'
import exampleTooltipVisibleCode from '!raw!./ExampleTooltipVisible'

const description = {
  tooltipDefault: 'This is the default `tooltip component`.',
  tooltipVisible: 'This is the `tooltip component` that is visible by default.'
}

const TooltipPage = () => (
  <div>
    <div className={styles.content}>
      <div className={styles.block}>
        <CodeExample
          title='Default tooltip'
          description={description.tooltipDefault}
          markup={exampleTooltipDefaultCode}>
          <ExampleTooltipDefault />
        </CodeExample>
        <CodeExample
          title='Tooltip visible by default'
          description={description.tooltipVisible}
          markup={exampleTooltipVisibleCode}>
          <ExampleTooltipVisible />
        </CodeExample>
        <div className={styles.block}>
          <h3>Props</h3>
          <PropsList list={docs[0].props} />
        </div>
      </div>
    </div>
  </div>
)

export default TooltipPage
