import React from 'react';
import { shallow, mount } from 'enzyme';
import Checkbox from '../src/components/Checkbox/Checkbox';

describe('Checkbox', () => {
  let wrapper;

  it('should shallow render itself', () => {
    wrapper = shallow(<Checkbox value='test' label='Test label'></Checkbox>);

    expect(wrapper.find('div')).to.have.length(3);
    expect(wrapper.find('input')).to.have.length(1);
    expect(wrapper.find('label')).to.have.length(1);

    expect(wrapper.hasClass('checkbox-component')).to.equal(true);
    expect(wrapper.childAt(1).childAt(0).hasClass('checkbox-input')).to.equal(true);
    expect(wrapper.childAt(1).childAt(1).hasClass('label-right')).to.equal(true);
  });

  it('should be disabled', () => {
    wrapper = shallow(<Checkbox value='test' label='Test label' disabled></Checkbox>);
    expect(wrapper.hasClass('checkbox-component')).to.equal(true);
    expect(wrapper.hasClass('checkbox-disabled')).to.equal(true);

    wrapper = mount(<Checkbox value='test' label='Test label' disabled></Checkbox>);
    expect(wrapper.find('input').node.hasAttribute('disabled')).to.equal(true);
  });

  it('should be checked', () => {
    const checked = true;
    wrapper = mount(<Checkbox value='test' label='Test label' checked={checked}></Checkbox>);

    expect(wrapper.childAt(0).props().checked).to.equal(true);
  });

  it('should have an extra class', () => {
    wrapper = shallow(<Checkbox value='test' label='Test label' optClass='checkbox-error'></Checkbox>);

    expect(wrapper.hasClass('checkbox-component')).to.equal(true);
    expect(wrapper.hasClass('checkbox-error')).to.equal(true);
  });

  it('should have the label on the left side', () => {
    wrapper = shallow(<Checkbox value='test' label='Test label' labelPosition='left'></Checkbox>);

    expect(wrapper.hasClass('checkbox-component'));
    expect(wrapper.childAt(1).childAt(0).hasClass('label-left')).to.equal(true);
    expect(wrapper.childAt(1).childAt(1).hasClass('checkbox-input')).to.equal(true);
  });

  it('should call changeCallback function', () => {
    const spy = sinon.spy();

    wrapper = mount(<Checkbox value='test' label='Test label' changeCallback={spy}/>);
    wrapper.childAt(0).simulate('change');

    expect(spy.calledOnce).to.be.true;
  });

  it('should update checked value via callback', () => {
    let checked = false;
    const callback = function(event) {
      checked = event.target.checked;
    };
    wrapper = mount(<Checkbox value='test' label='Test label' changeCallback={callback}/>);

    wrapper.childAt(0).simulate('change', {target: { checked: true }});
    expect(checked).to.equal(true);
  });
});
