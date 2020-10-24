type TextInput = {
    id: string;
    type: 'text';
    value: string;
};

type RadioInput = {
    id: string;
    type: 'radio';
    options: Array<{ extendId: string; value: string }>;
};

export type Input = TextInput | RadioInput;

const inputFields: Record<string, Input> = {
    age: {
        id: 'ctl00_ContentPlaceHolder1_toolage',
        type: 'text',
        value: '',
    },
    gender: {
        id: 'ctl00_ContentPlaceHolder1_sex',
        type: 'radio',
        options: [
            { extendId: '1', value: 'Male' },
            { extendId: '2', value: 'Female' },
        ],
    },
    weight: {
        id: 'ctl00_ContentPlaceHolder1_toolweight',
        type: 'text',
        value: '',
    },
    height: {
        id: 'ctl00_ContentPlaceHolder1_ht',
        type: 'text',
        value: '',
    },
    previous_fracture: {
        id: 'ctl00_ContentPlaceHolder1_previousfracture',
        type: 'radio',
        options: [
            { extendId: '1', value: 'No' },
            { extendId: '2', value: 'Yes' },
        ],
    },
    parent_fractured_hip: {
        id: 'ctl00_ContentPlaceHolder1_pfracturehip',
        type: 'radio',
        options: [
            { extendId: '1', value: 'No' },
            { extendId: '2', value: 'Yes' },
        ],
    },
    current_smoking: {
        id: 'ctl00_ContentPlaceHolder1_currentsmoker',
        type: 'radio',
        options: [
            { extendId: '1', value: 'No' },
            { extendId: '2', value: 'Yes' },
        ],
    },
    glucocorticoids: {
        id: 'ctl00_ContentPlaceHolder1_glucocorticoids',
        type: 'radio',
        options: [
            { extendId: '1', value: 'No' },
            { extendId: '2', value: 'Yes' },
        ],
    },
    rheumatoid_arthritis: {
        id: 'ctl00_ContentPlaceHolder1_arthritis',
        type: 'radio',
        options: [
            { extendId: '1', value: 'No' },
            { extendId: '2', value: 'Yes' },
        ],
    },
    secondary_osteoporosis: {
        id: 'ctl00_ContentPlaceHolder1_osteoporosis',
        type: 'radio',
        options: [
            { extendId: '1', value: 'No' },
            { extendId: '2', value: 'Yes' },
        ],
    },
    alcohol: {
        id: 'ctl00_ContentPlaceHolder1_alcohol',
        type: 'radio',
        options: [
            { extendId: '1', value: 'No' },
            { extendId: '2', value: 'Yes' },
        ],
    },
};

export default inputFields;
