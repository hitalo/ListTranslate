import 'react-native';
import React from 'react';
import MainList from '../src/components/list-area';
import renderer from 'react-test-renderer';



//configs
getParamMock = jest.fn(x => {
    return {name: 'Testing', id: ''}
});
const navigation = { 
    navigate: jest.fn(), 
    getParam:  getParamMock,
    setParams: jest.fn()
};
component = renderer.create(<MainList navigation={navigation}/>);




//tests
it('renders correctly', () => {
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

it('function getItemByModal', () => {
    const instance = component.getInstance();
    let item = instance.getItemByModal('en-ar');
    expect(item).toEqual({src: 'English', target: 'Arabic', model: 'en-ar'});
});

it('function getModel', () => {
    const instance = component.getInstance();
    let model = instance.getModel('English', 'Arabic');
    expect(model).toEqual('en-ar');
});
