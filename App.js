
import React, {Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import MainList from './src/components/list-area/';

const App = () => {
  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
      <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#3e74f0', '#799df2', '#d5e1fb']} style={styles.linearGradient}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          
          <MainList />
        </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    // backgroundColor: '#b3ffff',
  },
  safeArea: {
    flex: 1
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    // borderRadius: 5
  }
});

export default App;
