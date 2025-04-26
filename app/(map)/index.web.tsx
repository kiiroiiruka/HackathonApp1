import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import { useAtom } from 'jotai';
import { myLocationAtom } from '@/atom/locationAtom'; // locationAtomをインポート
import { useFriendUserStore } from '@/store/friendData'; // Zustandの友達情報ストアをインポート
import { getlocationsbyKeys } from "@/firebase/get/getLocation"; // Firebaseから位置情報を取得する関数をインポート

// マーカーアイコン設定（これないと表示されない）
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapScreen: React.FC = () => {
  const [myLocation] = useAtom(myLocationAtom); // 現在地を取得
  const friends = useFriendUserStore((state) => state.users); // 友達情報を取得
  const [markers, setMarkers] = useState<L.LatLng[]>([]);

  useEffect(() => {
    if (!myLocation || (myLocation.latitude === 0 && myLocation.longitude === 0)) return; // myLocationがない、または(0,0)の場合は処理をスキップ

    const fetchLocations = async () => {
        console.log("マップ画面フレンド",friends);
      const list = await getlocationsbyKeys(friends.map((friend) => friend.key));
      setMarkers([
        new L.LatLng(myLocation.latitude, myLocation.longitude), // 現在地
        ...list.map((friend) => new L.LatLng(friend.location.latitude, friend.location.longitude)), // 友達の位置
      ]);
      console.log("名ｍｍでも",list,markers);
    };

    fetchLocations();
  }, [friends, myLocation]);

  if (!myLocation || (myLocation.latitude === 0 && myLocation.longitude === 0)) {
    // myLocationがない、または(0,0)の場合は真っ白なマップを表示
    return <div style={{ height: '100vh', width: '100%', backgroundColor: '#fff' }} />;
  }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer
        center={[myLocation.latitude, myLocation.longitude]} // 現在地を中心に設定
        zoom={13} // ズームレベル
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((pos, idx) => (
          <Marker key={idx} position={pos} />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapScreen;
