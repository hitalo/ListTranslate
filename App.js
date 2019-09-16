
import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';
// import { ScrollView } from 'react-navigation';

import MainContainer from './src/routes';

const App = () => {
  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <MainContainer />
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
});

export default App;
