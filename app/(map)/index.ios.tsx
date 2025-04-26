import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import { useAtom } from "jotai";
import { myLocationAtom } from "@/atom/locationAtom";
import { useFriendUserStore } from "@/store/friendData";
import { getlocationsbyKeys } from "@/firebase/get/getLocation";

const MapScreen: React.FC = () => {
  const [myLocation] = useAtom(myLocationAtom);
  const friends = useFriendUserStore((state) => state.users);
  const [markers, setMarkers] = useState<{ latitude: number; longitude: number }[]>([]);

  useEffect(() => {
    if (!myLocation || (myLocation.latitude === 0 && myLocation.longitude === 0)) return;

    const fetchLocations = async () => {
      const list = await getlocationsbyKeys(friends.map((friend) => friend.key));
      setMarkers([
        { latitude: myLocation.latitude, longitude: myLocation.longitude }, // 自分
        ...list.map((friend) => ({
          latitude: friend.location.latitude,
          longitude: friend.location.longitude,
        })), // 友達
      ]);
    };

    fetchLocations();
  }, [friends, myLocation]);

  if (!myLocation || (myLocation.latitude === 0 && myLocation.longitude === 0)) {
    return <View style={{ flex: 1, backgroundColor: "#fff" }} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: myLocation.latitude,
          longitude: myLocation.longitude,
          latitudeDelta: 0.05, // ズームレベル
          longitudeDelta: 0.05,
        }}
      >
        {markers.map((pos, idx) => (
          <Marker key={idx} coordinate={pos} />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
