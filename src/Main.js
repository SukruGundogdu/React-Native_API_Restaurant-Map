import React, {useEffect, useState} from 'react';
import MapView from 'react-native-maps';
import Axios from "axios";
import {SafeAreaView, View, FlatList, Text} from 'react-native';


import {City, RestaurantDetail, SearchBar} from './components';

const Main = (props) => {
  const [cityList, setCityList] = useState([]);


  const fetchCities = async () => {
    const {data} = await Axios.get(
      "http://opentable.herokuapp.com/api/cities",
      );
      setCityList(data.cities);
  };

  useEffect(() => {
    fetchCities();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>

      <View style={{flex: 1}}>
        <MapView
        style={{flex:1}}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    />
        <View style={{position: "absolute"}}>
        <SearchBar/>
        <FlatList
        keyExtractor={(_, index) => index.toString()}
        data={cityList}
        renderItem={({item}) => <Text> {item} </Text>}
        />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Main;