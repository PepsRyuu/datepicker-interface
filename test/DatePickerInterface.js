import { createDatePickerInterface } from '../src/DatePickerInterface';

describe ('DatePickerInterface', () => {
    describe ('getPlaceholder', () => {
        it ('should return localised placeholder using specified language', () => {
            let state = createDatePickerInterface({ language: 'en-gb' });
            expect(state.getPlaceholder()).to.equal('DD/MM/YYYY');

            state = createDatePickerInterface({ language: 'en-us' });
            expect(state.getPlaceholder()).to.equal('MM/DD/YYYY');

            state = createDatePickerInterface({ language: 'ru' });
            expect(state.getPlaceholder()).to.equal('DD.MM.YYYY');

            state = createDatePickerInterface({ language: 'bg' });
            expect(state.getPlaceholder()).to.equal('DD.MM.YYYY г.');

            state = createDatePickerInterface({ language: 'th' });
            expect(state.getPlaceholder()).to.equal('DD/MM/YYYY');
        });

        it ('should use browser language by default if not specified', () => {
            let state = createDatePickerInterface();
            let placeholder = state.getPlaceholder();

            // Just check that the expected placeholder labels exist.
            expect(placeholder.indexOf('YYYY') > -1).to.be.true;
            expect(placeholder.indexOf('MM') > -1).to.be.true;
            expect(placeholder.indexOf('DD') > -1).to.be.true;
        });
    });

    describe ('getLayout', () => {
        describe('day layout', () => {
            it ('should return day layout by default for current date', () => {
                let clock = sinon.useFakeTimers(new Date(2020, 0, 1));
                let state = createDatePickerInterface();

                let layout = state.getLayout();
                expect(layout.title).to.equal('January 2020');
                expect(layout.grid).to.deep.equal([
                    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(s => ({ text: s, header: true })),
                    ['',  '',  '',  '1', '2', '3', '4'].map(s => ({ text: s, value: s? parseInt(s) : null })),
                    ['5', '6', '7', '8', '9', '10', '11'].map(s => ({ text: s, value: parseInt(s) })),
                    ['12', '13', '14', '15', '16', '17', '18'].map(s => ({ text: s, value: parseInt(s) })),
                    ['19', '20', '21', '22', '23', '24', '25'].map(s => ({ text: s, value: parseInt(s) })),
                    ['26', '27', '28', '29', '30', '31', ''].map(s => ({ text: s, value: s? parseInt(s) : null})),
                    ['', '', '', '', '', '', ''].map(s => ({ text: s, value: null })),
                ]);

                clock.restore();
            });

            it ('should support shorter months', () => {
                let clock = sinon.useFakeTimers(new Date(2020, 1, 1));
                let state = createDatePickerInterface();

                let layout = state.getLayout();
                expect(layout.title).to.equal('February 2020');
                expect(layout.grid).to.deep.equal([
                    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(s => ({ text: s, header: true })),
                    ['',  '',  '',  '', '', '', '1'].map(s => ({ text: s, value: s? parseInt(s) : null })),
                    ['2', '3', '4', '5', '6', '7', '8'].map(s => ({ text: s, value: parseInt(s) })),
                    ['9', '10', '11', '12', '13', '14', '15'].map(s => ({ text: s, value: parseInt(s) })),
                    ['16', '17', '18', '19', '20', '21', '22'].map(s => ({ text: s, value: parseInt(s) })),
                    ['23', '24', '25', '26', '27', '28', '29'].map(s => ({ text: s, value: parseInt(s) })),
                    ['', '', '', '', '', '', ''].map(s => ({ text: s, value: null })),
                ]);

                clock.restore();
            });

            it ('should support months with 6 rows of dates', () => {
                let clock = sinon.useFakeTimers(new Date(2020, 7, 1));
                let state = createDatePickerInterface();

                let layout = state.getLayout();
                expect(layout.title).to.equal('August 2020');
                expect(layout.grid).to.deep.equal([
                    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(s => ({ text: s, header: true })),
                    ['',  '',  '',  '', '', '', '1'].map(s => ({ text: s, value: s? parseInt(s) : null })),
                    ['2', '3', '4', '5', '6', '7', '8'].map(s => ({ text: s, value: parseInt(s) })),
                    ['9', '10', '11', '12', '13', '14', '15'].map(s => ({ text: s, value: parseInt(s) })),
                    ['16', '17', '18', '19', '20', '21', '22'].map(s => ({ text: s, value: parseInt(s) })),
                    ['23', '24', '25', '26', '27', '28', '29'].map(s => ({ text: s, value: parseInt(s) })),
                    ['30', '31', '', '', '', '', ''].map(s => ({ text: s, value: s? parseInt(s) : null })),
                ]);

                clock.restore();
            });
        });

        describe ('month layout', () => {
            it ('should show months for the current year', () => {
                let clock = sinon.useFakeTimers(new Date(2000, 0, 1));
                let state = createDatePickerInterface();
                state.setLevel('month');

                let layout = state.getLayout();
                expect(layout.title).to.equal('2000');
                expect(layout.grid).to.deep.equal([
                    ['Jan', 'Feb', 'Mar', 'Apr'].map((s, i) => ({ text: s, value: i })),
                    ['May', 'Jun', 'Jul', 'Aug'].map((s, i) => ({ text: s, value: 4 + i })),
                    ['Sep', 'Oct', 'Nov', 'Dec'].map((s, i) => ({ text: s, value: 8 + i })),
                ]);
            });
        });  

        describe ('year layout', () => {
            it ('should show year range for the current year', () => {
                let clock = sinon.useFakeTimers(new Date(2018, 0, 1));
                let state = createDatePickerInterface();
                state.setLevel('year');

                let layout = state.getLayout();
                expect(layout.title).to.equal('2010 - 2021');
                expect(layout.grid).to.deep.equal([
                    ['2010', '2011', '2012', '2013'].map(s => ({ text: s, value: parseInt(s) })),
                    ['2014', '2015', '2016', '2017'].map(s => ({ text: s, value: parseInt(s) })),
                    ['2018', '2019', '2020', '2021'].map(s => ({ text: s, value: parseInt(s) })),
                ]);
            });
        });  

        describe ('Localisation', () => {
            it ('should localise day level', () => {
                let state = createDatePickerInterface({ language: 'ja' });
                let layout = state.getLayout();
                let expected = ['日', '月', '火', '水', '木', '金', '土'].map(s => ({ text: s, header: true }));
                expect(layout.title).to.equal('1月 2018')
                expect(layout.grid[0]).to.deep.equal(expected);
            });

            it ('should localise month level', () => {
                let state = createDatePickerInterface({ language: 'ja' });
                state.setLevel('month');
                let layout = state.getLayout();

                expect(layout.grid).to.deep.equal([
                    ['1月', '2月', '3月', '4月'].map((s, i) => ({ text: s, value: i })),
                    ['5月', '6月', '7月', '8月'].map((s, i) => ({ text: s, value: 4 + i })),
                    ['9月', '10月', '11月', '12月'].map((s, i) => ({ text: s, value: 8 + i })),
                ]);
            });
        });   
    });

    describe('Page Switching', () => {
        it ('should be able to switch pages for days layout', () => {
            let clock = sinon.useFakeTimers(new Date(2020, 0, 1));
            let state = createDatePickerInterface();

            let layout = state.getLayout();
            expect(layout.title).to.equal('January 2020');
            expect(layout.grid).to.deep.equal([
                ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(s => ({ text: s, header: true })),
                ['',  '',  '',  '1', '2', '3', '4'].map(s => ({ text: s, value: s? parseInt(s) : null })),
                ['5', '6', '7', '8', '9', '10', '11'].map(s => ({ text: s, value: parseInt(s) })),
                ['12', '13', '14', '15', '16', '17', '18'].map(s => ({ text: s, value: parseInt(s) })),
                ['19', '20', '21', '22', '23', '24', '25'].map(s => ({ text: s, value: parseInt(s) })),
                ['26', '27', '28', '29', '30', '31', ''].map(s => ({ text: s, value: s? parseInt(s) : null })),
                ['', '', '', '', '', '', ''].map(s => ({ text: s, value: null })),
            ]);

            state.goUpPage();
            layout = state.getLayout();

            expect(layout.title).to.equal('December 2019');
            expect(layout.grid).to.deep.equal([
                ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(s => ({ text: s, header: true })),
                ['1', '2', '3', '4', '5', '6', '7'].map(s => ({ text: s, value: parseInt(s) })),
                ['8', '9', '10', '11', '12', '13', '14'].map(s => ({ text: s, value: parseInt(s) })),
                ['15', '16', '17', '18', '19', '20', '21'].map(s => ({ text: s, value: parseInt(s) })),
                ['22', '23', '24', '25', '26', '27', '28'].map(s => ({ text: s, value: parseInt(s) })),
                ['29', '30', '31', '', '', '', ''].map(s => ({ text: s, value: s? parseInt(s) : null })),
                ['', '', '', '', '', '', ''].map(s => ({ text: s, value: null })),
            ]);

            state.goUpPage();
            layout = state.getLayout();

            expect(layout.title).to.equal('November 2019');
            expect(layout.grid).to.deep.equal([
                ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(s => ({ text: s, header: true })),
                ['', '', '', '', '', '1', '2'].map(s => ({ text: s, value: s? parseInt(s) : null })),
                ['3', '4', '5', '6', '7', '8', '9'].map(s => ({ text: s, value: parseInt(s) })),
                ['10', '11', '12', '13', '14', '15', '16'].map(s => ({ text: s, value: parseInt(s) })),
                ['17', '18', '19', '20', '21', '22', '23'].map(s => ({ text: s, value: parseInt(s) })),
                ['24', '25', '26', '27', '28', '29', '30'].map(s => ({ text: s, value: parseInt(s) })),
                ['', '', '', '', '', '', ''].map(s => ({ text: s, value: null })),
            ]);

            state.goDownPage();
            layout = state.getLayout();

            expect(layout.title).to.equal('December 2019');
            expect(layout.grid).to.deep.equal([
                ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(s => ({ text: s, header: true })),
                ['1', '2', '3', '4', '5', '6', '7'].map(s => ({ text: s, value: parseInt(s) })),
                ['8', '9', '10', '11', '12', '13', '14'].map(s => ({ text: s, value: parseInt(s) })),
                ['15', '16', '17', '18', '19', '20', '21'].map(s => ({ text: s, value: parseInt(s) })),
                ['22', '23', '24', '25', '26', '27', '28'].map(s => ({ text: s, value: parseInt(s) })),
                ['29', '30', '31', '', '', '', ''].map(s => ({ text: s, value: s? parseInt(s) : null })),
                ['', '', '', '', '', '', ''].map(s => ({ text: s, value: null })),
            ]);

            clock.restore();
        });

        it ('should be able to switch pages for months layout', () => {
            let clock = sinon.useFakeTimers(new Date(2020, 0, 1));
            let state = createDatePickerInterface();
            state.setLevel('month');

            let layout = state.getLayout();

            expect(layout.title).to.equal('2020');
            expect(layout.grid).to.deep.equal([
                ['Jan', 'Feb', 'Mar', 'Apr'].map((s, i) => ({ text: s, value: i })),
                ['May', 'Jun', 'Jul', 'Aug'].map((s, i) => ({ text: s, value: 4 + i })),
                ['Sep', 'Oct', 'Nov', 'Dec'].map((s, i) => ({ text: s, value: 8 + i })),
            ]);

            state.goUpPage();
            layout = state.getLayout();

            expect(layout.title).to.equal('2019');
            expect(layout.grid).to.deep.equal([
                ['Jan', 'Feb', 'Mar', 'Apr'].map((s, i) => ({ text: s, value: i })),
                ['May', 'Jun', 'Jul', 'Aug'].map((s, i) => ({ text: s, value: 4 + i })),
                ['Sep', 'Oct', 'Nov', 'Dec'].map((s, i) => ({ text: s, value: 8 + i })),
            ]);

            state.goUpPage();
            layout = state.getLayout();

            expect(layout.title).to.equal('2018');
            expect(layout.grid).to.deep.equal([
                ['Jan', 'Feb', 'Mar', 'Apr'].map((s, i) => ({ text: s, value: i })),
                ['May', 'Jun', 'Jul', 'Aug'].map((s, i) => ({ text: s, value: 4 + i })),
                ['Sep', 'Oct', 'Nov', 'Dec'].map((s, i) => ({ text: s, value: 8 + i })),
            ]);

            state.goDownPage();
            layout = state.getLayout();

            expect(layout.title).to.equal('2019');
            expect(layout.grid).to.deep.equal([
                ['Jan', 'Feb', 'Mar', 'Apr'].map((s, i) => ({ text: s, value: i })),
                ['May', 'Jun', 'Jul', 'Aug'].map((s, i) => ({ text: s, value: 4 + i })),
                ['Sep', 'Oct', 'Nov', 'Dec'].map((s, i) => ({ text: s, value: 8 + i })),
            ]);

            clock.restore();

        });

        it ('should be able to switch pages for years layout', () => {
            let clock = sinon.useFakeTimers(new Date(2015, 0, 1));
            let state = createDatePickerInterface();
            state.setLevel('year');

            let layout = state.getLayout();

            expect(layout.title).to.equal('2010 - 2021');
            expect(layout.grid).to.deep.equal([
                ['2010', '2011', '2012', '2013'].map(s => ({ text: s, value: parseInt(s) })),
                ['2014', '2015', '2016', '2017'].map(s => ({ text: s, value: parseInt(s) })),
                ['2018', '2019', '2020', '2021'].map(s => ({ text: s, value: parseInt(s) })),
            ]);

            state.goUpPage();
            layout = state.getLayout();

            expect(layout.title).to.equal('2000 - 2011');
            expect(layout.grid).to.deep.equal([
                ['2000', '2001', '2002', '2003'].map(s => ({ text: s, value: parseInt(s) })),
                ['2004', '2005', '2006', '2007'].map(s => ({ text: s, value: parseInt(s) })),
                ['2008', '2009', '2010', '2011'].map(s => ({ text: s, value: parseInt(s) })),
            ]);

            state.goUpPage();
            layout = state.getLayout();

            expect(layout.title).to.equal('1990 - 2001');
            expect(layout.grid).to.deep.equal([
                ['1990', '1991', '1992', '1993'].map(s => ({ text: s, value: parseInt(s) })),
                ['1994', '1995', '1996', '1997'].map(s => ({ text: s, value: parseInt(s) })),
                ['1998', '1999', '2000', '2001'].map(s => ({ text: s, value: parseInt(s) })),
            ]);

            state.goDownPage();
            layout = state.getLayout();

            expect(layout.title).to.equal('2000 - 2011');
            expect(layout.grid).to.deep.equal([
                ['2000', '2001', '2002', '2003'].map(s => ({ text: s, value: parseInt(s) })),
                ['2004', '2005', '2006', '2007'].map(s => ({ text: s, value: parseInt(s) })),
                ['2008', '2009', '2010', '2011'].map(s => ({ text: s, value: parseInt(s) })),
            ]);

            clock.restore();
        });
    })

    describe('Level Navigation', () => {
        it ('should be able to go up levels based on current date', () => {
            let clock = sinon.useFakeTimers(new Date(2018, 0, 1));
            let state = createDatePickerInterface();
            expect(state.getLayout().title).to.equal('January 2018');
            state.goUpLevel();
            expect(state.getLayout().title).to.equal('2018');
            state.goUpLevel();
            expect(state.getLayout().title).to.equal('2010 - 2021');
            state.goUpLevel();
            expect(state.getLayout().title).to.equal('2010 - 2021');

            clock.restore();
        });

        it ('should be able to navigate to previous year via days, and goUpLevel should show that year', () => {
            let clock = sinon.useFakeTimers(new Date(2018, 0, 1));
            let state = createDatePickerInterface();
            expect(state.getLayout().title).to.equal('January 2018');
            state.goUpPage();
            expect(state.getLayout().title).to.equal('December 2017');
            state.goUpLevel();
            expect(state.getLayout().title).to.equal('2017');

            clock.restore();
        });

        it ('should be able to navigate to previous year via months and then go down level should show days for that month', () => {
            let clock = sinon.useFakeTimers(new Date(2018, 0, 1)); 

            let state = createDatePickerInterface();
            expect(state.getLayout().title).to.equal('January 2018');
            state.goUpLevel(); 

            expect(state.getLayout().title).to.equal('2018');
            state.goUpPage();
            state.getLayout().onSelect(3);
            expect(state.getLayout().title).to.equal('April 2017');

            clock.restore();
        });

        it ('should be able to up to year selection, and then into month and finally date', () => {
            let clock = sinon.useFakeTimers(new Date(2018, 0, 1)); 

            let state = createDatePickerInterface();
            expect(state.getLayout().title).to.equal('January 2018');
            state.goUpLevel(); 

            expect(state.getLayout().title).to.equal('2018');
            state.goUpLevel();

            expect(state.getLayout().title).to.equal('2010 - 2021');

            state.goUpPage();
            state.getLayout().onSelect(2001)
            state.getLayout().onSelect(3);
            
            expect(state.getLayout().title).to.equal('April 2001');

            clock.restore();
        })
    });

    describe('getFormattedDate', () => {
        it ('should format date to specified locale', () => {
            let state = createDatePickerInterface({ language: 'en-gb' });
            expect(state.getFormattedDate(new Date(2020, 0, 2))).to.equal('02/01/2020'); 

            state = createDatePickerInterface({ language: 'en-us' });
            expect(state.getFormattedDate(new Date(2020, 0, 2))).to.equal('01/02/2020');

            state = createDatePickerInterface({ language: 'ru' });
            expect(state.getFormattedDate(new Date(2020, 0, 2))).to.equal('02.01.2020');

            state = createDatePickerInterface({ language: 'bg' });
            expect(state.getFormattedDate(new Date(2020, 0, 2))).to.equal('02.01.2020 г.');

            state = createDatePickerInterface({ language: 'th' });
            expect(state.getFormattedDate(new Date(2020, 0, 2))).to.equal('02/01/2020');
        })
    });

    describe('onDateSelect', () => {
        it ('should trigger callback when day is selected', () => {
            let clock = sinon.useFakeTimers(new Date(2018, 0, 1)); 
            let callback = sinon.spy();
            let state = createDatePickerInterface({ onDateSelect: callback });

            state.goUpLevel();
            state.goUpPage();
            state.getLayout().onSelect(3);
            state.getLayout().onSelect(30);

            expect(callback.args[0][0].getFullYear()).to.equal(2017);
            expect(callback.args[0][0].getMonth()).to.equal(3);
            expect(callback.args[0][0].getDate()).to.equal(30);

            clock.restore();
        });
    })
});