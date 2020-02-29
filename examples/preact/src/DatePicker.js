import { useState, useReducer } from 'preact/hooks';
import { createDatePickerInterface } from '../../../src/DatePickerInterface';
import './DatePicker.scss';

function useDatePickerInterface (options) {
    let [ dateState ] = useState(createDatePickerInterface(options));
    let [ ignored, forceUpdate] = useReducer(x => x + 1, 0);

    function onLevelUp () {
        dateState.goUpLevel();
        forceUpdate();
    }

    function onPageUp () {
        dateState.goUpPage();
        forceUpdate();
    }

    function onPageDown () {
        dateState.goDownPage();
        forceUpdate();
    }

    function getPlaceholder () {
        return dateState.getPlaceholder();
    }

    function getFormattedDate (d) {
        return dateState.getFormattedDate(d);
    }

    function getLayout () {
        return dateState.getLayout();
    }

    function onSelect (value) {
        dateState.getLayout().onSelect(value);
        forceUpdate();
    }

    return { onLevelUp, onPageUp, onPageDown, getPlaceholder, getLayout, onSelect, getFormattedDate };
}

function Icon (props) {
    return (
        <img
            src={'node_modules/feather-icons/dist/icons/' + props.name + '.svg'}
            onClick={props.onClick}
        />
    )
}

export default function DatePicker (props) {
    let [ showing, setShowing ] = useState(false);

    let { onLevelUp, onPageUp, onPageDown, getPlaceholder, getLayout, onSelect, getFormattedDate } = useDatePickerInterface({
        onDateSelect: d => {
            setShowing(false);
            props.onDateSelect(d);
        }
    });

    let layout = getLayout();

    return (
        <div class="DatePicker">
            <div class="DatePicker-input">
                <input type="text" value={props.selected && getFormattedDate(props.selected)} placeholder={getPlaceholder()} />
                <Icon name="calendar" onClick={() => setShowing(!showing)} />
            </div>
            {showing && (
                <div class="DatePicker-popover">
                    <div class="DatePicker-calendar">
                        <div class="DatePicker-calendar-header">
                            <div class="DatePicker-calendar-title" onClick={onLevelUp}>
                                {layout.title}
                            </div>
                            <div class="DatePicker-calendar-arrows">
                                <Icon name="chevron-up" onClick={onPageUp} />
                                <Icon name="chevron-down" onClick={onPageDown} />
                            </div>
                        </div>
                        <div class="DatePicker-calendar-body" key={layout.level}>
                            {layout.grid.map(r => (
                                <div data-type={layout.level}>
                                    {r.map(d => (
                                        <div 
                                            data-header={d.header}
                                            onClick={!d.header && (() => onSelect(d.value))}
                                        >
                                            {d.text}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}