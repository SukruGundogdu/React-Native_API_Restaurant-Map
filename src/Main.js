import React, {useEffect, useState, useRef} from 'react';
import MapView, {Marker} from 'react-native-maps';
import Axios from "axios";
import {SafeAreaView, View, FlatList, Text} from 'react-native';

import {City, RestaurantDetail, SearchBar} from './components';

let orginalList = [];

const Main = (props) => {
  const [cityList, setCityList] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const mapRef = useRef(null)


  const fetchCities = async () => {
    const {data} = await Axios.get(
      "http://opentable.herokuapp.com/api/cities",
      );
      setCityList(data.cities);
      orginalList = [...data.cities];
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const onCitySearch = (text) => {
    const filteredList = orginalList.filter(item => {
      const userText = text.toUpperCase();
      const cityName = item.toUpperCase();

      return cityName.indexOf(userText) > -1;
    })
    setCityList(filteredList);
  }

  conCitySelect = async (city) => {
    const {data: {restaurants} } = await Axios.get("http://opentable.herokuapp.com/api/restaurants?city=" + city)
    setRestaurants(restaurants)

    const restaurantsCoordinates = restaurants.map((res) => {
      return({
        latitude: res.lat,
        longitude: res.lng,
      });
    });

    mapRef.current.fitToCoordinates(restaurantsCoordinates, {
      edgePadding: {
        top: 50,
        right: 25,
        bottom: 25,
        left: 25
      }
    })

    console.log(restaurants)
  }

  return (
    <SafeAreaView style={{flex: 1}}>

      <View style={{flex: 1}}>
        <MapView
          ref={mapRef}
          style={{flex:1}}
          initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
      }}>
          {restaurants.map((r, index) => (
    <Marker
      key={index}
      coordinate={{
        latitude: r.lat,
        longitude: r.lng,
      }}
    />
  ))}
      </MapView>
    
        <View style={{position: "absolute"}}>
        <SearchBar onSearch={onCitySearch} />
        <FlatList
        keyExtractor={(_, index) => index.toString()}
        data={cityList}
        renderItem={({item}) =>(
          <City cityName={item} onSelect={() => conCitySelect(item)}/>
          )}
        horizontal
        showsHorizontalScrollIndicator={false}
        />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Main;