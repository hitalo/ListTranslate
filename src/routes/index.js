import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import GroupArea from '../components/group-area';
import MainList from '../components/list-area';
import ListItem from '../components/list-item';

const MainNavigator = createStackNavigator({
  GroupArea: { screen: GroupArea },
  MainList: { screen: MainList },
  ListItem: { screen: ListItem }
}, {
  initialRouteName: 'GroupArea',
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