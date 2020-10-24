import FormSubmitter from './formSubmitter';
import { IQueryData } from './queryDataInterface';

(async function () {
    let query: IQueryData = {
        age: 55,
        gender: 'Female',
        weight: 62,
        height: 170,
        previous_fracture: 'No',
        parent_fractured_hip: 'No',
        current_smoking: 'No',
        glucocorticoids: 'Yes',
        rheumatoid_arthritis: 'No',
        secondary_osteoporosis: 'Yes',
        alcohol: 'No',
    };

    const formSubmitter = new FormSubmitter(
        query,
        'ctl00_ContentPlaceHolder1_btnCalculate',
        'ctl00_ContentPlaceHolder1_lbrs1',
    );

    try {
        const targetValue = await formSubmitter.evaluateQuery();
        console.log(targetValue);
    } catch (e) {
        console.log(e);
    }
})();
