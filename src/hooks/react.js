import { useState } from 'react';
import createHook from './useDatePickerInterfaceImpl';

export const useDatePickerInterface = createHook(useState);