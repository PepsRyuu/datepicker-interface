import { useState } from 'preact/hooks';
import createHook from './useDatePickerInterfaceImpl';

export const useDatePickerInterface = createHook(useState);