import { IQueryData } from './queryDataInterface';
import inputFields, { Input } from './inputFields';
import { Browser, Page } from 'puppeteer-core';

const puppeteer = require('puppeteer-core');
require('dotenv').config();

export default class FormSubmitter {
    private queryData: IQueryData;
    private browser!: Browser;

    constructor(queryData: IQueryData) {
        this.queryData = queryData;
    }

    public async evaluateQuery(): Promise<number> {
        const page = await this.browserNewPage();

        const targetValue = await page.evaluate(
            (serializedQueryData, formInput: Record<string, Input>) => {
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

                return 1;
            },
            JSON.stringify(this.queryData),
            inputFields,
        );

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
