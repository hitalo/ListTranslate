import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import MainList from '../components/list-area';
import ListItem from '../components/list-item';

const MainNavigator = createStackNavigator({
  MainList: { screen: MainList },
  ListItem: { screen: ListItem }
}, {
  initialRouteName: 'MainList',
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#3e74f0',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});
  
const MainContainer = createAppContainer(MainNavigator);
export default MainContainer;