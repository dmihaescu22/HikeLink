import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import Svg, { Polyline as SvgPolyline } from 'react-native-svg';
import { useRef } from 'react';


export default function ExploreScreen() {
  const [location, setLocation] = useState(null);
  const apiKey = 'AIzaSyCVwpLAu2b7mIwHnkWbTSYhZxEpBa0tO18';
  const [errorMsg, setErrorMsg] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [region, setRegion] = useState(null);
  const [trails, setTrails] = useState([]);
  const windowHeight = Dimensions.get('window').height;
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0); // Timpul scurs în secunde
  const timer = useRef(null); // Inițializare timer ca referință


  const handleTrailSelection = (trail) => {
    if (trail && trail.geometry && trail.geometry.location) {
      console.log('Selected trail:', trail);
      setSelectedTrail(trail);
      getDirections(trail.geometry.location);
    } else {
      console.error('Invalid trail data:', trail);
    }
  };
  

  const convertToSvgPoints = (coords, region, width, height) => {
    if (!Array.isArray(coords) || coords.length < 2) {
      console.error('Not enough points to draw a route');
      return '';
    }
  
    return coords
      .map((point) => {
        const x = ((point.longitude - region.longitude) / region.longitudeDelta) * width;
        const y = ((region.latitude - point.latitude) / region.latitudeDelta) * height;
        return `${x},${y}`;
      })
      .join(' ');
  };
  
  

  useEffect(() => {
    let locationSubscription;
  
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
  
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (loc) => {
          setLocation(loc);
          setRegion({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
          fetchTrails(loc.coords.latitude, loc.coords.longitude);
        }
      );
    })();
  
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
      clearInterval(timer.current); // Oprim cronometru la demontare
    };
  }, []);
  
  

  const fetchTrails = async (latitude, longitude) => {
    const radius = 10000;
    const keyword = 'hiking trail';
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&keyword=${keyword}&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      //console.log('API Response:', data); // Adaugă acest log
  
      if (data.results) {
        setTrails(data.results);
      } else {
        //console.log('No hiking trails found');
      }
    } catch (error) {
      console.error('Error fetching hiking trails:', error);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDirections = async (destination) => {
    if (!location) {
      console.error('Location is not available');
      return;
    }
  
    if (!destination || !destination.lat || !destination.lng) {
      console.error('Invalid destination:', destination);
      return;
    }
  
    const origin = `${location.coords.latitude},${location.coords.longitude}`;
    const dest = `${destination.lat},${destination.lng}`;    
  
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${dest}&mode=walking&key=${apiKey}`
      );
      const data = await response.json();
  
      if (data.routes && data.routes.length > 0) {
        const points = data.routes[0].overview_polyline.points;
        const decodedPoints = decodePolyline(points);
  
        if (decodedPoints.length < 2) {
          console.error('Not enough points in decoded route');
          return;
        }
  
        setRouteCoords(decodedPoints);
        console.log('Route coordinates set:', decodedPoints);
      } else {
        console.log('No routes found');
        setRouteCoords([]); // Resetăm coordonatele în caz de eroare
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };
  

  const decodePolyline = (t) => {
    let points = [];
    let index = 0,
      len = t.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b, shift = 0,
        result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };

  const toggleTracking = () => {
    if (isTracking) {
      // Oprim cronometru și resetăm timpul
      clearInterval(timer.current);
      timer.current = null;
      setElapsedTime(0); // Resetăm timpul la 0
    } else {
      // Pornim cronometru
      timer.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    setIsTracking(!isTracking);
  };
  
  
  

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.dividerLine} />
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Speed</Text>
          <Text style={styles.statValue}>--</Text>
          <Text style={styles.unitLabel}>km/h</Text>
        </View>
          <View style={styles.statCenter}>
          <Text style={styles.statLabel}>Time</Text>
          <Text style={styles.statValue}>{formatTime(elapsedTime)}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>--</Text>
          <Text style={styles.unitLabel}>km</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={isTracking ? styles.stopButton : styles.startButton}
          onPress={toggleTracking}
        >
          <Text style={styles.buttonText}>{isTracking ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
      </View>

      {region && (
        <MapView
        style={[styles.map, { height: windowHeight * 0.4 }]}
        provider="google"
        region={region}
        showsUserLocation={true}
        followsUserLocation={isTracking}
        showsMyLocationButton={true}
        zoomControlEnabled={true}
        zoomEnabled={true}
        onRegionChangeComplete={(reg) => setRegion(reg)}
        onPress={() => {
          if (routeCoords.length > 0) {
            setSelectedTrail(null);
            setRouteCoords([]);
          }
        }}
      >
        {/* Markere pentru trasee */}
        {trails.map((trail) => (
          <Marker
            key={trail.place_id}
            coordinate={{
              latitude: trail.geometry.location.lat,
              longitude: trail.geometry.location.lng,
            }}
            onPress={() => handleTrailSelection(trail)}
          />
        ))}
      
        {/* Afișarea traseului folosind SVG */}
        {Array.isArray(routeCoords) && routeCoords.length > 1 && region && (
          <Svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
            viewBox={`0 0 ${Dimensions.get('window').width} ${windowHeight * 0.4}`}
          >
            <SvgPolyline
              points={convertToSvgPoints(routeCoords, region, Dimensions.get('window').width, windowHeight * 0.4)}
              fill="none"
              stroke="blue"
              strokeWidth="3"
            />
          </Svg>
        )}
      </MapView>
      
      )}

      {selectedTrail && routeCoords.length > 0 && (
        <TouchableOpacity
          style={styles.startNavigationButton}
          onPress={() => getDirections(selectedTrail.geometry.location)}
        >
          <Text style={styles.startNavigationText}>Start Navigation</Text>
        </TouchableOpacity>
      )}

      <View style={styles.trailsContainer}>
        <View style={styles.trailsHeader}>
          <Text style={styles.trailsTitle}>Hiking trails near you</Text>
        </View>
        <FlatList
  data={trails}
  horizontal
  renderItem={({ item }) => (
    item ? (
      <View style={styles.trailItem}>
        {item.photos ? (
          <Image
            source={{
              uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=${apiKey}`,
            }}
            style={styles.trailImage}
          />
        ) : (
          <View style={styles.noImagePlaceholder}>
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}
        <Text style={styles.trailName}>{item.name}</Text>

        <TouchableOpacity
          style={styles.navigateButton}
          onPress={() => handleTrailSelection(item)}
        >
          <Text style={styles.navigateButtonText}>Start Hike</Text>
        </TouchableOpacity>
      </View>
    ) : null
  )}
  keyExtractor={(item) => item.place_id}
/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: StatusBar.currentHeight || 20,
  },
  startNavigationButton: {
    position: 'absolute',
    bottom: 20,
    left: '43%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#556B2F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  startNavigationText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navigateButton: {
    backgroundColor: '#556B2F',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  navigateButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  trailImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  noImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  noImageText: {
    color: '#888',
    fontSize: 12,
  },
  dividerLine: {
    position: 'absolute',
    top: 35,
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
  },
  statCenter: {
    alignItems: 'center',
    marginLeft: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  unitLabel: {
    fontSize: 12,
    color: '#000',
  },
  startButton: {
    backgroundColor: '#556B2F',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 125,
    marginBottom: 20,
  },
  stopButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 125,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    borderRadius: 10,
    marginBottom: 20,
  },
  trailsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  trailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  trailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  exploreMoreButton: {
    backgroundColor: '#556B2F',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  exploreMoreText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  trailItem: {
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    marginRight: 10,
  },
  trailName: {
    fontSize: 14,
    color: '#333',
  },
});
