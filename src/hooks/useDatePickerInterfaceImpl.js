import { createDatePickerInterface } from '../DatePickerInterface';

export default function createHook (useState) {
    return function useDatePickerInterface (options) {
        let [ dateState ] = useState(createDatePickerInterface(options));
        let [ forceUpdateValue, forceUpdate ] = useState(0);
        let hook = {};

        for (let prop in dateState) {
            hook[prop] = function () {
                let hr = dateState[prop].apply(dateState, arguments);
                if (hr === undefined) {
                    forceUpdate(++forceUpdateValue);
                }

                return hr;
            }
        }

        return hook;
    }
}