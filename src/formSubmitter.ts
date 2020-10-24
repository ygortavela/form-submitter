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

    constructor(queryData: IQueryData, buttonHandlerId: string, targetFieldId: string) {
        this.queryData = queryData;
        this.buttonHandlerId = buttonHandlerId;
        this.targetFieldId = targetFieldId;
    }

    public async evaluateQuery(): Promise<string> {
        const page = await this.browserNewPage();

        await page.evaluate(
            (
                serializedQueryData: string,
                buttonHandlerId: string,
                targetFieldId: string,
                formInput: Record<string, Input>,
            ) => {
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

                const buttonElement = document.querySelector(`#${buttonHandlerId}`) as HTMLInputElement;

                buttonElement.click();
            },
            JSON.stringify(this.queryData),
            this.buttonHandlerId,
            this.targetFieldId,
            inputFields,
        );

        await page.waitForSelector(`#${this.targetFieldId}`);

        const targetValue = await page.evaluate((targetFieldId) => {
            return document.querySelector(`#${targetFieldId}`)?.innerHTML!;
        }, this.targetFieldId);

        this.browser.close();

        return targetValue;
    }

    private async browserNewPage(): Promise<Page> {
        this.browser = await puppeteer.launch({
            headless: 'false' === process.env.DEBUG,
            executablePath: process.env.CHROMIUM_PATH,
        });

        const page = await this.browser.newPage();

        await page.goto(process.env.PAGE_URL!);

        return page;
    }
}
