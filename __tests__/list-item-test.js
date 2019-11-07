import 'react-native';
import React from 'react';
import ListItem from '../src/components/list-item';
import renderer from 'react-test-renderer';



//configs

const item = {
    id: '123451234512345',
    group_id: '123451234512345',
    text: 'sample-text',
    translations: [{id: '123451234512345', text: 'text1'}, {id: '123451234512345', text: 'text2'}]
}

const config = {
    id: '123451234512345',
    group_id: '123451234512345',
    src: 'English',
    targets: [{id: '1234512345123451', target: 'Spanish', model: 'en-es'}, {id: '123451234512345', target: 'French', model: 'en-fr'}]
}

getParamMock = jest.fn(x => {
    return {name: 'Testing', id: ''}
});
const navigation = { 
    navigate: jest.fn(), 
    getParam:  getParamMock,
    setParams: jest.fn()
};
component = renderer.create(<ListItem config={config} item={item} navigation={navigation}/>);


//tests
it('renders correctly', () => {
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    const instance = component.getInstance();
    expect(instance.state.item).toHaveProperty('id');
    expect(instance.state.item.id.trim().length).toBeGreaterThan(10);
    expect(instance.state.item.group_id.trim().length).toBeGreaterThan(10);
    expect(instance.state.item.translations.length).toBeGreaterThan(0);
    expect(instance.state.item.translations[0].id.trim().length).toBeGreaterThan(10);
    expect(instance.state.item.translations.length).toEqual(instance.props.config.targets.length);
});