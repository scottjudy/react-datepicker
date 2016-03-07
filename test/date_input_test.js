import React from 'react'
import moment from 'moment'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import DateInput from '../src/date_input.jsx'

describe('DateInput', function () {
  describe('handleDone', function () {
    function testHandleDoneWithKey (key) {
      it(`calls handleDone when the ${key} key is pressed`, function () {
        var spy = sinon.spy()
        var dateInput = TestUtils.renderIntoDocument(
          <DateInput handleDone={spy} />
        )
        TestUtils.Simulate.keyDown(ReactDOM.findDOMNode(dateInput), { key })
        expect(spy.calledOnce).to.be.true
      })
    }

    testHandleDoneWithKey('Enter')
    testHandleDoneWithKey('Escape')
    testHandleDoneWithKey('Tab')
  })

  it('adds disabled attribute to input field when disabled is passed as prop', function () {
    var dateInput = TestUtils.renderIntoDocument(
      <DateInput disabled />
    )

    expect(dateInput.disabled).to.not.equal(null)
  })

  it('uses a custom className if provided', function () {
    const className = 'custom-class-name'
    var dateInput = TestUtils.renderIntoDocument(
      <DateInput className={className} />
    )

    expect(ReactDOM.findDOMNode(dateInput).className).to.contain(className)
  })

  it('has a tabIndex if provided', function () {
    var dateInput = TestUtils.renderIntoDocument(
      <DateInput tabIndex={1} />
    )

    expect(ReactDOM.findDOMNode(dateInput).tabIndex).to.equal(1)
  })

  it('should call setSelected when changing from null to valid date', function () {
    var date = moment()
    var dateFormat = 'YYYY-MM-DD'
    var callback = sinon.spy()
    var dateInput = TestUtils.renderIntoDocument(
      <DateInput date={null} dateFormat={dateFormat} setSelected={callback} />
    )
    var inputNode = dateInput.refs.input
    inputNode.value = date.format(dateFormat)
    TestUtils.Simulate.change(inputNode)
    assert(callback.calledOnce, 'must be called once')
    assert(date.isSame(callback.getCall(0).args[0], 'day'), 'must be called with correct date')
  })

  it('should call setSelected when changing from valid date to another', function () {
    var dateFrom = moment()
    var dateTo = dateFrom.clone().add(1, 'day')
    var dateFormat = 'YYYY-MM-DD'
    var callback = sinon.spy()
    var dateInput = TestUtils.renderIntoDocument(
      <DateInput date={dateFrom} dateFormat={dateFormat} setSelected={callback} />
    )
    var inputNode = dateInput.refs.input
    inputNode.value = dateTo.format(dateFormat)
    TestUtils.Simulate.change(inputNode)
    assert(callback.calledOnce, 'must be called once')
    assert(dateTo.isSame(callback.getCall(0).args[0], 'day'), 'must be called with correct date')
  })

  it('should call setSelected when changing from valid date to empty', function () {
    var callback = sinon.spy()
    var dateInput = TestUtils.renderIntoDocument(
      <DateInput date={moment()} setSelected={callback} />
    )
    var inputNode = dateInput.refs.input
    inputNode.value = ''
    TestUtils.Simulate.change(inputNode)
    assert(callback.withArgs(null).calledOnce, 'must be called once with null')
  })

  it('should not call setSelected when changing from valid date to invalid', function () {
    var callback = sinon.spy()
    var dateInput = TestUtils.renderIntoDocument(
      <DateInput date={moment()} setSelected={callback} />
    )
    var inputNode = dateInput.refs.input
    inputNode.value = 'invalid'
    TestUtils.Simulate.change(inputNode)
    assert(!callback.called, 'must not be called')
  })

  it('should call setSelected when changing from invalid date to valid', function () {
    var dateFrom = moment()
    var dateTo = dateFrom.clone().add(1, 'day')
    var dateFormat = 'YYYY-MM-DD'
    var callback = sinon.spy()
    var dateInput = TestUtils.renderIntoDocument(
      <DateInput date={dateFrom} dateFormat={dateFormat} setSelected={callback} />
    )
    var inputNode = dateInput.refs.input
    inputNode.value = 'invalid'
    TestUtils.Simulate.change(inputNode)
    inputNode.value = dateTo.format(dateFormat)
    TestUtils.Simulate.change(inputNode)
    assert(callback.calledOnce, 'must be called once')
    assert(dateTo.isSame(callback.getCall(0).args[0], 'day'), 'must be called with correct date')
  })

  it('should not call setSelected when changing to a disabled date', function () {
    var date = moment()
    var dateFormat = 'YYYY-MM-DD'
    var callback = sinon.spy()
    var dateInput = TestUtils.renderIntoDocument(
      <DateInput date={null} excludeDates={[date]} dateFormat={dateFormat} setSelected={callback} />
    )
    var inputNode = dateInput.refs.input
    inputNode.value = date.format(dateFormat)
    TestUtils.Simulate.change(inputNode)
    assert(!callback.called, 'must not be called')
  })

  it('should not have the ignore-react-onclickoutside class when closed so other pickers will close', function () {
    var dateInput = TestUtils.renderIntoDocument(
      <DateInput />
    )
    expect(ReactDOM.findDOMNode(dateInput).className).to.not.contain('ignore-react-onclickoutside')
  })

  it('should have the ignore-react-onclickoutside class when open to prevent closing', function () {
    var dateInput = TestUtils.renderIntoDocument(
      <DateInput open />
    )
    expect(ReactDOM.findDOMNode(dateInput).className).to.contain('ignore-react-onclickoutside')
  })

  describe('blurring', function () {
    it('should call onBlur when blurring the input', function () {
      var spy = sinon.spy()
      var dateInput = TestUtils.renderIntoDocument(
        <DateInput onBlur={spy} />
      )
      TestUtils.Simulate.blur(ReactDOM.findDOMNode(dateInput))
      assert(spy.calledOnce, 'must be called once')
    })

    it('should keep showing the selected date if input is same date', function () {
      var date = moment()
      var dateFormat = 'YYYY-MM-DD'
      var formattedDate = date.format(dateFormat)
      var dateInput = TestUtils.renderIntoDocument(
        <DateInput date={date} dateFormat={dateFormat} setSelected={() => {}} />
      )
      var inputNode = dateInput.refs.input
      inputNode.value = formattedDate
      TestUtils.Simulate.change(inputNode)
      TestUtils.Simulate.blur(inputNode)
      expect(inputNode.value).to.equal(formattedDate)
    })

    it('should show the selected date if input is invalid', function () {
      var date = moment()
      var dateFormat = 'YYYY-MM-DD'
      var dateInput = TestUtils.renderIntoDocument(
        <DateInput date={date} dateFormat={dateFormat} />
      )
      var inputNode = dateInput.refs.input
      inputNode.value = 'invalid'
      TestUtils.Simulate.change(inputNode)
      TestUtils.Simulate.blur(inputNode)
      expect(inputNode.value).to.equal(date.format(dateFormat))
    })

    it('should empty the input if no date selected and input is invalid', function () {
      var dateInput = TestUtils.renderIntoDocument(
        <DateInput />
      )
      var inputNode = dateInput.refs.input
      inputNode.value = 'invalid'
      TestUtils.Simulate.change(inputNode)
      TestUtils.Simulate.blur(inputNode)
      expect(inputNode.value).to.equal('')
    })
  })

  describe('localization', function () {
    var dateFormat = 'LL'

    function testLocale (dateInput, date, locale) {
      var localized = date.clone().locale(locale)
      var inputNode = dateInput.refs.input
      expect(inputNode.value).to.equal(localized.format(dateFormat))
    }

    it('should use the globally-defined locale by default', function () {
      var date = moment()
      var dateInput = TestUtils.renderIntoDocument(
        <DateInput date={date} dateFormat={dateFormat} />
      )
      testLocale(dateInput, date, moment.locale())
    })

    it('should use the locale specified as a prop', function () {
      var locale = 'fr'
      var date = moment().locale(locale)
      var dateInput = TestUtils.renderIntoDocument(
        <DateInput date={date} dateFormat={dateFormat} locale={locale} />
      )
      testLocale(dateInput, date, locale)
    })

    it('should override the locale of the date with the globally-defined locale', function () {
      var date = moment().locale('fr')
      var dateInput = TestUtils.renderIntoDocument(
        <DateInput date={date} dateFormat={dateFormat} />
      )
      testLocale(dateInput, date, moment.locale())
    })

    it('should override the locale of the date with the locale prop', function () {
      var locale = 'fr'
      var date = moment()
      var dateInput = TestUtils.renderIntoDocument(
        <DateInput date={date} dateFormat={dateFormat} locale={locale} />
      )
      testLocale(dateInput, date, locale)
    })
  })

  describe('dateFormat', function () {
    it('should use the date format of the global locale by default', function () {
      var date = moment()
      var dateInput = TestUtils.renderIntoDocument(
        <DateInput date={date} />
      )
      expect(dateInput.refs.input.value).to.equal(date.format('L'))
    })

    it('should use the date format of the locale prop', function () {
      var locale = 'fr'
      var date = moment().locale(locale)
      var dateInput = TestUtils.renderIntoDocument(
        <DateInput date={date} locale={locale} />
      )
      expect(dateInput.refs.input.value).to.equal(date.format('L'))
    })

    it('should use the date format of the dateFormat prop', function () {
      var locale = 'fr'
      var dateFormat = 'LL'
      var date = moment().locale(locale)
      var dateInput = TestUtils.renderIntoDocument(
        <DateInput date={date} dateFormat={dateFormat} locale={locale} />
      )
      expect(dateInput.refs.input.value).to.equal(date.format(dateFormat))
    })
  })
})
