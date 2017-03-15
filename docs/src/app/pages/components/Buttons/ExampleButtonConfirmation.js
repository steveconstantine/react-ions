import React from 'react'
import ButtonConfirmation from 'react-ions/lib/Button/ButtonConfirmation'
import Icon from 'react-ions/lib/Icon'
import style from './style.scss'

const ExampleButtonConfirmation = () => (
  <div className={style['custom-confirmation-wrapper']}>
    <ButtonConfirmation position={'left'}>Left</ButtonConfirmation>
    <ButtonConfirmation collapse={true}>
      <Icon name='icon-upload-2-1' height='14' width='14' fill='#fff'></Icon>
      <span>Default Button</span>
    </ButtonConfirmation>
    <ButtonConfirmation prompt={'You are definitely not a robot right? That would be unfortunate.'} position={'right'}>Right</ButtonConfirmation>
  </div>
)

export default ExampleButtonConfirmation
