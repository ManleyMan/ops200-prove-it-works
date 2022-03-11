const express = require('express');
const expect = require('chai').expect;
const path = require('path');
const Nightmare = require('nightmare');
const { inRange } = require('lodash');

const app = express();

app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../dist')));

const url = 'http://localhost:8888';

const nightmare = new Nightmare();

describe('End to End Tests', () => {
	let httpServer = null;
	let pageObject = null;

	before((done) => {
		httpServer = app.listen(8888);
		done();
	});

	beforeEach(() => {
		pageObject = nightmare.goto(url);
	});

	after((done) => {
		httpServer.close();
		done();
	});

// This is where your code is going to go
    it('should contain a <h1> element for the page title', () => { 
        return pageObject
            .evaluate(() => document.querySelector('h1').innerText)
            .then(headerText => {
            expect(headerText).to.not.be.null;
            expect(headerText).to.equal('Mortgage Calculator');
            });
        }).timeout(3500);

    it('should contain a <button> element for the calculation', () => {
        return pageObject
            .evaluate(() => document.querySelector('button').innerText)
            .then(buttonText => {
            expect(buttonText).to.not.be.null;
            expect(buttonText).to.equal('Calculate');
            });
    }); 

    it('should contain an <option> element for the monthly period', () => {
        return pageObject
            .evaluate(() => document.querySelector('option').innerText)
            .then(monthlyOption => {
                expect(monthlyOption).to.not.be.null;
                expect(monthlyOption).to.equal('Monthly');
            });
    });

    it('should contain an <select> element', () => {
        return pageObject
            .evaluate(() => document.querySelector('select'))
            .then(select => {
                expect(select).to.not.be.null;
                expect(select).to.exist;
            });
    });

    it('should contain a <p> element for the output', () => {
        return pageObject
            .evaluate(() => document.querySelector('#output').innerText)
            .then(output => {
                expect(output).to.not.be.null;
                expect(output).to.exist
            })
    })

    it('should correctly calculate mortgage', () =>
        pageObject
        .wait()
        .type('input[name=principal]', 300000)
        .type('input[name=interestRate]', 3.75)
        .type('input[name=loanTerm]', 30)
        .select('select[name=period]', 12)
        .click('button#calculate')
        .wait('#output')
        .evaluate(() => document.querySelector('#output').innerText)
        .then((outputText) => {
            expect(outputText).to.equal('$1389.35');
        })
        ).timeout(6500);

    it('should correctly calculate mortgage', () =>
        pageObject
        .wait()
        .type('input[name=principal]', 100000)
        .type('input[name=interestRate]', 5)
        .type('input[name=loanTerm]', 15)
        .select('select[name=period]', 12)
        .click('button#calculate')
        .wait('#output')
        .evaluate(() => document.querySelector('#output').innerText)
        .then((outputText) => {
            expect(outputText).to.equal('$790.79');
        })
        ).timeout(6500);

    it('should correctly calculate mortgage', () =>
        pageObject
        .wait()
        .type('input[name=principal]', 200000)
        .type('input[name=interestRate]', 2.5)
        .type('input[name=loanTerm]', 30)
        .select('select[name=period]', 12)
        .click('button#calculate')
        .wait('#output')
        .evaluate(() => document.querySelector('#output').innerText)
        .then((outputText) => {
            expect(outputText).to.equal('$790.24');
        })
        ).timeout(6500);
})