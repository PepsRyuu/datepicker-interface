import DatePicker from './DatePicker';
import { useState } from 'preact/hooks';
import './App.scss';

export default function App () {
    let [ selected, setSelected ] = useState(undefined);

    function onDateSelect (date) {
        setSelected(date);
    }

    return (
        <div>
            <DatePicker 
                selected={selected}
                onDateSelect={onDateSelect}
            />
        </div>
    )
}