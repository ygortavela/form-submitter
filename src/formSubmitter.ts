import { IQueryData } from './queryDataInterface';
import inputFields, { Input } from './inputFields';
import { Browser, Page } from 'puppeteer-core';

const puppeteer = require('puppeteer-core');
require('dotenv').config();

export default class FormSubmitter {
    private queryData: IQueryData;
    private buttonHandlerId: string;
    private targetFieldId: string;
    private browser!: Browser;
    private page!: Page;

    constructor(queryData: IQueryData, buttonHandlerId: string, targetFieldId: string) {
        this.queryData = queryData;
        this.buttonHandlerId = buttonHandlerId;
        this.targetFieldId = targetFieldId;
    }

    public async evaluateQuery() {
        await this.browserNewPage();

        await this.setQueryDataOnPage();

        await this.submitFormOnPage();

        const targetValue = await this.getTargetValue();

        await this.browser.close();

        return targetValue;
    }

    private async browserNewPage() {
        this.browser = await puppeteer.launch({
            headless: 'false' === process.env.DEBUG,
            executablePath: process.env.CHROMIUM_PATH,
        });

        this.page = await this.browser.newPage();

        await this.page.goto(process.env.PAGE_URL!);
    }

    private async setQueryDataOnPage() {
        await this.page.evaluate(
            (serializedQueryData: string, formInput: Record<string, Input>) => {
                const queryData = JSON.parse(serializedQueryData);

                (Object.keys(queryData) as Array<keyof IQueryData>).forEach((key) => {
                    const input = formInput[key];
                    const queryValue = queryData[key];
                    let inputElement;

                    switch (input.type) {
                        case 'text':
                            inputElement = document.querySelector(`#${input.id}`) as HTMLInputElement;

                            inputElement.value = String(queryValue);

                            break;
                        case 'radio':
                            let id = `#${input.id}`;

                            input.options.forEach((opt) => {
                                if (opt.value === queryValue) id += opt.extendId;
                            });

                            inputElement = document.querySelector(id) as HTMLInputElement;
                            inputElement.checked = true;

                            break;
                    }
                });
            },
            JSON.stringify(this.queryData),
            inputFields,
        );
    }

    private async submitFormOnPage() {
        await this.page.evaluate((buttonHandlerId: string) => {
            const buttonElement = document.querySelector(`#${buttonHandlerId}`) as HTMLInputElement;

            buttonElement.click();
        }, this.buttonHandlerId);
    }

    private async getTargetValue() {
        await this.page.waitForSelector(`#${this.targetFieldId}`);

        const targetValue = await this.page.evaluate((targetFieldId: string) => {
            return document.querySelector(`#${targetFieldId}`)?.innerHTML;
        }, this.targetFieldId);

        return targetValue;
    }
}
