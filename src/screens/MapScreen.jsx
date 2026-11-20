import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { C, z, shadow } from '../theme';
import { Icon, Img, Press, Screen, Txt } from '../ui';
import { useNav } from '../nav';

// Bản đồ điểm thu gom (205:21549 → 21633 → 21840 → 21912 → 21697, chi tiết 205:21747).
const STEPS = [
  ['arrow-up', 'Đi về phía hướng Tây', '90 m'],
  ['arrow-redo-outline', 'Rẽ phải', '160 m'],
  ['arrow-undo-outline', 'Rẽ trái', '80 m'],
  ['arrow-redo-outline', 'Rẽ phải về hướng Trần Đại Nghĩa/Đ. Trần Hưng Đạo/ĐT607', '130 m', 'Đi qua Tuyết Nhung ở phía bên phải'],
  ['arrow-redo-outline', 'Rẽ phải vào Trần Đại Nghĩa/Đ. Trần Đại', '240 m'],
];

export function MapScreen() {
  const nav = useNav();
  const [step, setStep] = useState(nav.route.params.step ?? 'explore');
  const [q, setQ] = useState('');
  const back = () => {
    const prev = { nearby: 'explore', route: 'nearby', steps: 'route', drive: 'route', place: 'nearby' }[step];
    if (prev) setStep(prev); else nav.back();
  };
  return (
    <Screen bg="#eef1f4" topBg="#eef1f4" active="map">
      {step === 'explore' && (
        <MapImage name="map_explore" h={813}>
          <TopBar onBack={back} />
          <View style={[st.searchBox, { top: z(63) }]}>
            <TextInput value={q} onChangeText={setQ} onSubmitEditing={() => setStep('nearby')} placeholder="Tìm kiếm địa điểm phân loại rác" placeholderTextColor="#c9c9c9" style={{ flex: 1, fontSize: z(15) }} />
            <Press label="Tìm" onPress={() => setStep('nearby')}><Icon name="mic-outline" size={22} color="#c9c9c9" /></Press>
          </View>
          <Press label="Thùng rác gần bạn" onPress={() => setStep('nearby')} style={[st.hit, { left: z(300), top: z(230), width: z(80), height: z(80) }]} />
        </MapImage>
      )}
      {step === 'nearby' && (
        <View style={{ flex: 1 }}>
          <MapImage name="map_nearby" h={560}>
            <TopBar onBack={back} />
            <Press label="Tìm kiếm" onPress={() => setStep('explore')} style={[st.searchBox, { top: z(63) }]}>
              <Txt s={15} style={{ flex: 1 }}>Công viên gần nhất</Txt><Icon name="mic-outline" size={22} color="#c9c9c9" />
            </Press>
          </MapImage>
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: z(92) }}>
            <Txt s={17} w="700" c={C.green} style={{ marginLeft: z(20), marginBottom: z(8) }}>Gần bạn</Txt>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: z(16), paddingHorizontal: z(28), paddingBottom: z(16) }}>
              {[0, 1, 2].map(i => (
                <Press key={i} label="Thùng rác cộng đồng" onPress={() => setStep('place')} style={st.binCard}>
                  <View style={{ flexDirection: 'row' }}>
                    <Img name="map_bin" style={{ width: z(82), height: z(72) }} mode="contain" />
                    <View style={{ flex: 1, marginLeft: z(6) }}>
                      <Txt s={10} w="700">Thùng rác cộng đồng- Công Viên {String.fromCharCode(65 + i)}</Txt>
                      <Txt s={10} c={C.green} style={{ marginTop: z(12) }}>Còn chỗ</Txt>
                    </View>
                  </View>
                  <Txt s={10} style={{ marginTop: z(8) }}>460 Trần Đại Nghĩa,Ngũ Hành Sơn,TP. Đà Nẵng</Txt>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: z(8) }}>
                    <Txt s={9} c="#b0b0b0">{200 + i * 150}m  -  {5 + i * 3} phút đi bộ</Txt>
                    <Press label="Chỉ đường" onPress={() => setStep('route')} style={st.smallBtn}><Txt s={8} c={C.white}>Chỉ đường</Txt></Press>
                  </View>
                </Press>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
      {(step === 'route' || step === 'steps') && (
        <View style={{ flex: 1 }}>
          <MapImage name="map_route" h={668}>
            <View style={st.routeCard}>
              <View style={st.routeRow}><View style={st.blueDot} /><Txt s={15} style={{ flex: 1 }}>Vị trí hiện tại của bạn</Txt><Icon name="ellipsis-vertical" size={18} color="#999" /></View>
              <View style={{ height: 1, backgroundColor: '#eee', marginLeft: z(36) }} />
              <View style={st.routeRow}><Icon name="location" size={20} color={C.red} /><Txt s={15} style={{ flex: 1 }}>Công viên cộng đồng A</Txt><Icon name="swap-vertical" size={20} /></View>
            </View>
          </MapImage>
          <DriveSheet expanded={step === 'steps'} onToggle={() => setStep(step === 'steps' ? 'route' : 'steps')} onClose={back} onStart={() => setStep('drive')} />
        </View>
      )}
      {step === 'drive' && (
        <View style={{ flex: 1 }}>
        <MapImage name="map_nav" h={713}>
          <View style={st.instruction}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: z(18) }}>
              <Icon name="arrow-forward" size={22} />
              <Txt s={15} w="700">Rẻ phải vào đường Lê Duẩn</Txt>
            </View>
            <Txt s={13} style={{ marginLeft: z(40), marginTop: z(16) }}>100m - 1 phút</Txt>
          </View>
          <View style={st.then}><Txt s={15} w="700">Sau đó</Txt><Icon name="arrow-up" size={20} /></View>
          <Press label="Âm thanh" style={st.sound}><Icon name="volume-high" size={20} color={C.white} /></Press>
        </MapImage>
          <View style={st.driveBottom}>
            <Press label="Kết thúc" onPress={() => setStep('route')} style={st.greyCircle}><Icon name="close" size={28} /></Press>
            <View style={{ alignItems: 'center' }}>
              <View style={{ width: z(48), height: z(4), backgroundColor: C.black, borderRadius: 2, marginBottom: z(8) }} />
              <Txt s={22} w="700">5 phút</Txt>
              <Txt s={13} c="#ccc">2 km     11:00</Txt>
            </View>
            <Press label="Lộ trình khác" onPress={() => setStep('steps')} style={st.greyCircle}><Icon name="git-compare-outline" size={24} /></Press>
          </View>
        </View>
      )}
      {step === 'place' && <PlaceDetail onBack={back} onRoute={() => setStep('route')} />}
    </Screen>
  );
}

function MapImage({ name, h, children }) {
  return (
    <View style={{ width: '100%', height: z(h) }}>
      <Img name={name} style={StyleSheet.absoluteFill} />
      {children}
    </View>
  );
}

function TopBar({ onBack }) {
  // Tiêu đề "Khám phá" và ảnh đại diện đã nằm trong ảnh bản đồ xuất từ Figma; chỉ đặt vùng bấm Back.
  return (
    <Press label="Quay lại" onPress={onBack} style={{ position: 'absolute', left: z(20), top: z(6), width: z(44), height: z(44) }} />
  );
}

function DriveSheet({ expanded, onToggle, onClose, onStart }) {
  return (
    <View style={[st.sheet, expanded && { top: z(0) }]}>
      <Press label="Mở rộng" onPress={onToggle} style={{ alignSelf: 'center', padding: z(6) }}><View style={st.grabber} /></Press>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Txt s={22} w="700" style={{ flex: 1 }}>Lái xe</Txt>
        <Icon name="map-outline" size={20} />
        <Press label="Đóng" onPress={onClose} style={[st.greyCircle, { width: z(28), height: z(28), marginLeft: z(14) }]}><Icon name="close" size={16} /></Press>
      </View>
      {expanded && (
        <>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: z(20) }}>
            {[['car-outline', '5 phút'], ['bicycle-outline', '4 phút'], ['bus-outline', '9 phút'], ['walk-outline', '9 phút']].map(([ic, t], i) => (
              <View key={ic} style={{ flexDirection: 'row', alignItems: 'center', gap: z(4) }}>
                <Icon name={ic} size={18} color={i ? C.black : C.green} /><Txt s={12} c={i ? C.black : C.green}>{t}</Txt>
              </View>
            ))}
          </View>
          <View style={{ height: 2, width: z(70), backgroundColor: C.green, marginTop: z(6) }} />
          <View style={{ flexDirection: 'row', gap: z(14), marginTop: z(18) }}>
            {['Khởi hành lúc 10:00 ▾', 'Tránh trạm thu phí', 'Tránh cao tốc'].map(t => <View key={t} style={st.chip}><Txt s={12}>{t}</Txt></View>)}
          </View>
          <Txt s={22} w="500" style={{ marginTop: z(20) }}>5 phút (2,0 km)</Txt>
          <Txt s={14} c="#777" style={{ marginTop: z(4) }}>Tuyến đường gần nhất</Txt>
          <View style={{ height: 1, backgroundColor: '#ddd', marginVertical: z(16) }} />
          <Txt s={18} w="500">Các chặng</Txt>
          <ScrollView style={{ flex: 1, marginTop: z(10) }}>
            <View style={st.stepRow}><View style={[st.blueDot, { marginHorizontal: z(5) }]} /><Txt s={15} style={{ flex: 1 }}>Vị trí của bạn</Txt></View>
            {STEPS.map(([ic, t, d, note]) => (
              <View key={t} style={st.stepRow}>
                <Icon name={ic} size={22} />
                <View style={{ flex: 1, marginLeft: z(14), borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: z(10) }}>
                  <Txt s={15}>{t}</Txt>
                  {note && <Txt s={11} c="#888" style={{ marginTop: z(4) }}>ⓘ {note}</Txt>}
                  <Txt s={13} c="#888" style={{ marginTop: z(6) }}>{d}</Txt>
                </View>
              </View>
            ))}
          </ScrollView>
        </>
      )}
      <View style={{ flexDirection: 'row', gap: z(10), marginTop: z(12), marginBottom: z(expanded ? 100 : 0) }}>
        <Press label="Bắt đầu" onPress={onStart} style={[st.pillBtn, { backgroundColor: C.green }]}><Icon name="navigate-outline" size={16} color={C.white} /><Txt s={13} c={C.white}>Bắt đầu</Txt></Press>
        <View style={st.pillBtn}><Icon name="location-outline" size={16} color={C.greenDeep} /><Txt s={13} c={C.greenDeep}>Thêm điểm dừng</Txt></View>
        <View style={st.pillBtn}><Icon name="share-social-outline" size={16} color={C.greenDeep} /><Txt s={13} c={C.greenDeep}>Chia sẻ</Txt></View>
      </View>
    </View>
  );
}

function PlaceDetail({ onBack, onRoute }) {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: z(130) }}>
      <View style={{ height: z(353) }}>
        <Img name="map_detail" style={StyleSheet.absoluteFill} />
        <Press label="Quay lại" onPress={onBack} style={{ position: 'absolute', left: z(10), top: z(14), padding: z(4) }}><Icon name="chevron-back" size={26} /></Press>
      </View>
      <View style={{ paddingHorizontal: z(26) }}>
        <View style={{ flexDirection: 'row', gap: z(28), marginTop: z(-2) }}>
          {[['Hữu cơ', '#f7d630'], ['Vô cơ', '#ec1c1c'], ['Tái chế', '#2a4f8c']].map(([t, c]) => (
            <View key={t} style={[st.tag, { backgroundColor: c }]}><Txt s={13} w="700" c={c === '#f7d630' ? '#fff8c4' : C.white}>{t}</Txt></View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: z(18) }}>
          <View style={{ flex: 1 }}>
            <Txt s={22} w="700">Công viên cộng đồng A</Txt>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: z(4), marginTop: z(4) }}>
              {[1, 2, 3, 4].map(i => <Icon key={i} name="star" size={20} color="#f2cf1f" />)}
              <Icon name="star-half" size={20} color="#f2cf1f" />
              <Txt s={13} w="700" style={{ marginLeft: z(8) }}>4.5</Txt>
            </View>
          </View>
          <Press label="Chỉ đường" onPress={onRoute} style={st.routeBtn}><Txt s={14} w="700" c={C.white}>Chỉ đường</Txt></Press>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: z(8), marginTop: z(16) }}>
          <Icon name="location" size={18} color="#c62828" /><Txt s={14} c="#555">460 Trần Đại Nghĩa,Ngũ Hành Sơn,TP. Đà Nẵng</Txt>
        </View>
        <View style={{ flexDirection: 'row', gap: z(20), marginTop: z(22) }}>
          <View><Txt s={15} w="600" c={C.green}>Tổng quan</Txt><View style={{ height: 2, backgroundColor: C.green, marginTop: z(4) }} /></View>
          <Txt s={15} w="600">Bài đánh giá</Txt>
        </View>
        <Txt s={13} style={{ marginTop: z(14) }}>Liên quan đến nội dung tìm kiếm của bạn</Txt>
        <View style={st.infoBox}>
          {[['time-outline', <><Txt s={13} w="600" c={C.green}>Mở cửa    </Txt><Txt s={13}>Mở cửa suốt ngày</Txt></>],
            ['trash-outline', <><Txt s={13} c="#999">Tình trạng: </Txt><Txt s={13} w="600" c={C.green}>Còn trống</Txt></>],
            ['trash-outline', <Txt s={13}>congviencongdong.com.vn</Txt>],
            ['call-outline', <Txt s={13}>023928465725</Txt>]].map(([ic, content], i) => (
            <View key={i} style={st.infoRow}><Icon name={ic} size={20} color={i === 1 || i === 2 ? C.greenDeep : C.black} /><Txt s={13} style={{ marginLeft: z(12) }}>{content}</Txt></View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: z(20), height: z(56) },
  searchBox: { position: 'absolute', left: z(26), right: z(28), height: z(52), borderRadius: z(10), backgroundColor: C.white, flexDirection: 'row', alignItems: 'center', paddingHorizontal: z(14), ...shadow(4, 8, 0.25) },
  hit: { position: 'absolute' },
  binCard: { width: z(220), borderRadius: z(15), backgroundColor: C.white, padding: z(10), ...shadow(4, 8, 0.25) },
  smallBtn: { backgroundColor: C.green, borderRadius: z(15), paddingHorizontal: z(8), paddingVertical: z(4) },
  routeCard: { position: 'absolute', left: z(30), right: z(26), top: z(30), borderRadius: z(20), backgroundColor: C.white, paddingHorizontal: z(16), paddingVertical: z(6), ...shadow(4, 10, 0.25) },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: z(16), height: z(48) },
  blueDot: { width: z(14), height: z(14), borderRadius: z(7), backgroundColor: '#1a56f0', borderWidth: 2, borderColor: C.white, ...shadow(1, 2, 0.3) },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: C.white, borderTopLeftRadius: z(20), borderTopRightRadius: z(20), paddingHorizontal: z(20), paddingBottom: z(100), ...shadow(-4, 10, 0.15) },
  grabber: { width: z(60), height: z(4), borderRadius: 2, backgroundColor: '#bbb' },
  chip: { backgroundColor: '#e6f4e1', borderRadius: z(6), paddingHorizontal: z(10), paddingVertical: z(8) },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: z(8), gap: z(6) },
  pillBtn: { flexDirection: 'row', alignItems: 'center', gap: z(6), backgroundColor: '#e6f4e1', borderRadius: z(20), paddingHorizontal: z(14), height: z(36) },
  instruction: { position: 'absolute', left: z(10), right: z(12), top: z(13), height: z(92), borderRadius: z(20), backgroundColor: C.green, padding: z(16) },
  then: { position: 'absolute', left: z(10), top: z(104), width: z(132), height: z(52), borderRadius: z(20), backgroundColor: '#2f8f34', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  sound: { position: 'absolute', right: z(18), top: z(178), width: z(44), height: z(44), borderRadius: z(22), backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' },
  driveBottom: { position: 'absolute', left: z(30), right: z(28), bottom: z(96), height: z(90), borderRadius: z(20), backgroundColor: C.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: z(18), ...shadow(4, 10, 0.2) },
  greyCircle: { width: z(54), height: z(54), borderRadius: z(27), backgroundColor: '#e3e3e3', alignItems: 'center', justifyContent: 'center' },
  tag: { width: z(76), height: z(22), borderRadius: z(11), alignItems: 'center', justifyContent: 'center' },
  routeBtn: { backgroundColor: C.green, borderRadius: z(10), paddingHorizontal: z(14), height: z(40), justifyContent: 'center', ...shadow(4, 4, 0.25) },
  infoBox: { marginTop: z(10), borderRadius: z(15), backgroundColor: '#fafafa', ...shadow(2, 6, 0.1) },
  infoRow: { flexDirection: 'row', alignItems: 'center', height: z(42), paddingHorizontal: z(10), borderBottomWidth: 1, borderBottomColor: '#eee' },
});
