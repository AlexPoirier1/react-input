import React from 'react';
import chai, { expect } from 'chai';
import 'jsdom-global/register';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { afterEach, before, beforeEach, describe, it } from 'mocha';
import chaiEnzyme from 'chai-enzyme';
import JSDOM_G from 'jsdom-global';

import {
    Input,
    MoneyInput
} from '../../src/index';

import {
    EN, FR,
    VALID_UNFORMATTED_NUMERIC_VALUE,
    VALID_UNFORMATTED_NUMERIC_STRING, // Since we can't efficiently retrieve the input's value as an actual number
    VALID_FR_FORMATTED_MONEY_VALUE,
    VALID_EN_FORMATTED_MONEY_VALUE,
    VALID_TEXT_VALUE
} from '../../src/utils/constants';

chai.use(chaiEnzyme());

let cleanup;
let txt_input;
let num_input;
let txt_wrappper;
let num_wrapper;
const dummyChange = () => {};

beforeEach(() => {
    cleanup = () => JSDOM_G();
});

afterEach(() => cleanup());

describe('Inputs ::', () => {
    describe('Given any Input', () => {
        beforeEach(() => {
            txt_wrappper = mount(<Input value={VALID_TEXT_VALUE} onChange={dummyChange} />);
            txt_input = txt_wrappper.find('input').node;
        });

        it('when focusing, should select the entire value', () => {
            txt_input.focus();
            txt_wrappper.find('input').prop('onFocus')();
            setTimeout(() => {
                expect(txt_input.selectionStart).to.equal(0);
                expect(txt_input.selectionEnd).to.equal(txt_input.value.length);
            }, 0);
        });
    });

    describe('Given a regular Input', () => {
        beforeEach(() => {
            num_wrapper = mount(<Input value={VALID_UNFORMATTED_NUMERIC_VALUE} onChange={dummyChange} />);
            txt_wrappper = mount(<Input value={VALID_TEXT_VALUE} onChange={dummyChange} />);
            num_input = num_wrapper.find('input').node;
            txt_input = txt_wrappper.find('input').node;
        });

        it('when focused, should display the actual value', () => {
            num_wrapper.find('input').prop('onFocus')();
            num_input.focus();
            txt_input.focus();

            expect(num_input.value).to.equal(VALID_UNFORMATTED_NUMERIC_STRING);
            expect(txt_input.value).to.equal(VALID_TEXT_VALUE);
        });

        it('when not focused, should display the actual value', () => {
            expect(num_input.value).to.equal(VALID_UNFORMATTED_NUMERIC_STRING);
            expect(txt_input.value).to.equal(VALID_TEXT_VALUE);
        });
    });

    describe('Given a Money Input', () => {
        describe('(EN), ', () => {
            beforeEach(() => {
                num_wrapper = mount(<MoneyInput value={VALID_UNFORMATTED_NUMERIC_VALUE} lang={EN} onChange={dummyChange} />);
                num_input = num_wrapper.find('input').node;
            });

            it('when rendering, should call the appriopriate formatting function', () => {
                const spy = sinon.spy(num_wrapper.);
            });

            it('when focused, should display the actual value', () => {
                num_wrapper.find('input').prop('onFocus')();
                num_input.focus();

                expect(num_input.value).to.equal(VALID_UNFORMATTED_NUMERIC_STRING);
            });

            it('when not focused, should display the correctly formatted number', () => {
                expect(num_input.value).to.equal(VALID_EN_FORMATTED_MONEY_VALUE);
            });
        });

        describe('(FR), ', () => {
            beforeEach(() => {
                num_wrapper = mount(<MoneyInput value={VALID_UNFORMATTED_NUMERIC_VALUE} lang={FR} onChange={dummyChange} />);
                num_input = num_wrapper.find('input').node;
            });

            it('when focused, should display the actual value', () => {
                num_input.focus();
                num_wrapper.find('input').prop('onFocus')();

                expect(num_wrapper.state('focused')).to.be.true;
                expect(num_input.value).to.equal(VALID_UNFORMATTED_NUMERIC_STRING);
            });

            it('when not focused, should display the correctly formatted number', () => {
                expect(num_input.value).to.equal(VALID_FR_FORMATTED_MONEY_VALUE);
            });
        });
    });
});
