import 'react-native';

import { Utils } from '../src/utils';


//tests
it('function getLanguages', () => {
    const languages = Utils.getLanguages();
    expect(languages).toHaveProperty('list');
    const isArray = Array.isArray(languages.list);
    expect(isArray).toBe(true);
    expect(languages.list.length).toBeGreaterThan(19);
    expect(languages.list.includes('English')).toBe(true);
    expect(languages.list.includes('Spanish')).toBe(true);
    expect(languages.list.includes('French')).toBe(true);
});