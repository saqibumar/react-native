import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  createAppContainer,
  createStackNavigator,
} from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MoviesListScreen from './Screens/MoviesList';
import MovieDetailsScreen from './Screens/MovieDetails';
import Constants from 'expo-constants'



const AppNavigator = createStackNavigator(
  {
    MoviesList: MoviesListScreen,
    MovieDetails: MovieDetailsScreen,
  },
  {
    headerLayoutPreset: 'center', //to center the title of page on android
    initialRouteName: 'MoviesList',
    navigationOptions: {
      headerTintColor: '#a41034',
      headerStyle: {
        backgroundColor: 'lightyellow',
      },
    },
  }
)


const AppContainer = createAppContainer(AppNavigator);

state = {
  movies: null,
}

export default function App() {
  return (
      <AppContainer 
        screenProps={{
          movies: this.state.movies,
        }}
 />
  );
}
