import { useState } from 'preact/hooks';
import { useDatePickerInterface } from 'datepicker-interface/hooks/preact';
import './DatePicker.scss';

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

    let dpi = useDatePickerInterface({
        onDateSelect: d => {
            setShowing(false);
            props.onDateSelect(d);
        }
    });

    let layout = dpi.getLayout();

    return (
        <div class="DatePicker">
            <div class="DatePicker-input">
                <input type="text" value={props.selected && dpi.getFormattedDate(props.selected)} placeholder={dpi.getPlaceholder()} />
                <Icon name="calendar" onClick={() => setShowing(!showing)} />
            </div>
            {showing && (
                <div class="DatePicker-popover">
                    <div class="DatePicker-calendar">
                        <div class="DatePicker-calendar-header">
                            <div class="DatePicker-calendar-title" onClick={dpi.goUpLevel}>
                                {layout.title}
                            </div>
                            <div class="DatePicker-calendar-arrows">
                                <Icon name="chevron-up" onClick={dpi.goPrevPage} />
                                <Icon name="chevron-down" onClick={dpi.goNextPage} />
                            </div>
                        </div>
                        <div class="DatePicker-calendar-body" key={layout.level}>
                            {layout.grid.map(r => (
                                <div data-type={layout.level}>
                                    {r.map(d => (
                                        <div 
                                            data-header={d.header}
                                            onClick={!d.header && (() => dpi.select(d.value))}
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