import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { C, z, shadow } from '../theme';
import { Btn, Congrats, Icon, Img, Overlay, Press, Screen, Scroll, Txt } from '../ui';
import { useNav, useStore } from '../nav';

// Màn "Scan your item" (205:9581).
export function ScanIntro() {
  const nav = useNav();
  return (
    <Screen bg={C.white} topBg="#eef6fb" active="scan">
      <View style={st.introHead}>
        <Img name="scan_leaf" style={{ position: 'absolute', left: 0, top: z(-20), width: z(75), height: z(115) }} />
        <Press label="Quay lại" onPress={nav.back} style={{ padding: z(4), marginLeft: z(14) }}><Icon name="chevron-back" size={24} /></Press>
        <Txt s={26} w="700" style={{ flex: 1, textAlign: 'center' }}>Scan your item</Txt>
        <Press label="Sổ tay rác" onPress={() => nav.go('handbook')} style={{ padding: z(10) }}><Icon name="ellipsis-vertical" size={22} /></Press>
      </View>
      <View style={st.scanCard}>
        <Icon name="scan-helper" mc size={150} color="#111" />
        <Btn title="Scan your waste" onPress={() => nav.go('camera')} h={62} radius={30} s={15} style={{ width: z(260), marginTop: z(40), ...shadow(4, 6, 0.25) }} />
      </View>
      <View style={st.bubble}>
        <Txt s={15} w="500" center>Sẵn sàng quét rác chưa?{'\n'}nhấn “Scan your waste” để bắt đầu nhé!</Txt>
        <View style={st.bubbleTail} />
      </View>
      <Img name="mascot_bin" style={{ position: 'absolute', right: z(80), bottom: z(80), width: z(60), height: z(73) }} mode="contain" />
    </Screen>
  );
}

// Camera mô phỏng + các trạng thái quét (205:9609, 9629, 11577, 11606, 9697, 9652).
export function Camera() {
  const nav = useNav();
  const [state, setState] = useState('aim'); // aim | loading | success | result | fail
  const [image, setImage] = useState('cam_bg');
  const shoot = (img = 'cam_bg') => {
    setImage(img);
    setState('loading');
    setTimeout(() => setState(img === 'cam_cup' ? 'fail' : 'success'), 1400);
  };
  useEffect(() => {
    if (state !== 'success') return;
    const t = setTimeout(() => setState('result'), 1200);
    return () => clearTimeout(t);
  }, [state]);
  const boxed = state === 'success' || state === 'result';
  return (
    <View style={{ flex: 1, backgroundColor: C.green }}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} />
      <View style={{ height: z(20) }} />
      <View style={{ flex: 1, overflow: 'hidden' }}>
        <Img name={boxed ? 'cam_box' : image} style={StyleSheet.absoluteFill} />
        <View style={st.camTop}>
          <Press label="Quay lại" onPress={nav.back} style={{ padding: z(6) }}><Icon name="arrow-back" size={26} color={C.white} /></Press>
          <Icon name="flash-off" size={24} color={C.white} />
          <View style={{ flex: 1 }} />
          <Icon name="ellipsis-vertical" size={22} color={C.white} />
        </View>
        <View style={st.camBottom}>
          <Press label="Chọn ảnh từ thư viện" onPress={() => shoot('cam_cup')}><Img name="cam_thumb" style={{ width: z(54), height: z(54), borderRadius: z(27) }} /></Press>
          <Press label="Chụp" onPress={() => shoot()} disabled={state === 'loading'} style={[st.shutter, boxed && { backgroundColor: '#9b9b9b' }]} />
          <Icon name="camera-reverse-outline" size={40} color={C.white} />
        </View>
        {state === 'loading' && <Loading style={{ position: 'absolute', alignSelf: 'center', top: z(150) }} />}
        {state === 'success' && (
          <View style={st.okPop}>
            <View style={st.okIcon}><Icon name="checkmark" size={24} color={C.white} /></View>
            <Txt s={18} w="600" style={{ marginTop: z(14) }}>Quét thành công!</Txt>
          </View>
        )}
        {state === 'result' && (
          <>
            <View style={st.resPop}>
              <Img name="bottle" style={{ width: z(68), height: z(102) }} mode="contain" />
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Txt s={14} c="#999">Kết quả</Txt>
                <Txt s={20} w="500">Chai nhựa</Txt>
              </View>
            </View>
            <Btn title="Chi tiết ....." onPress={() => nav.replace('scanResult')} h={58} s={16} radius={30} style={st.detailBtn} />
          </>
        )}
      </View>
      <SafeAreaView edges={['bottom']} style={{ height: z(40) }} />
      <Overlay visible={state === 'fail'} onClose={() => setState('aim')} dim="rgba(255,255,255,0.35)">
        <View style={st.failCard}>
          <Press label="Đóng" onPress={() => setState('aim')} style={{ position: 'absolute', right: z(14), top: z(12) }}><Icon name="close" size={20} /></Press>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: z(16) }}>
            <Txt s={34} w="900" c={C.red}>!</Txt>
            <Txt s={18} w="500" center style={{ width: z(190) }}>Không nhận diện được rác</Txt>
          </View>
          <View style={{ flexDirection: 'row', gap: z(10), marginTop: z(26) }}>
            <Btn title="Quét lại" onPress={() => { setImage('cam_bg'); setState('aim'); }} bg="#c8e6c9" color="#333" s={13} w="600" h={50} icon={<Icon name="refresh" size={20} color="#333" />} style={{ width: z(146) }} />
            <Btn title="Sổ tay rác" onPress={() => nav.replace('handbook')} s={13} w="600" h={50} icon={<Icon name="arrow-forward" size={20} color={C.white} />} style={{ width: z(146), flexDirection: 'row-reverse' }} />
          </View>
        </View>
      </Overlay>
    </View>
  );
}

export function Loading({ style, label = 'Loading...' }) {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const a = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 1200, easing: Easing.linear, useNativeDriver: true }));
    a.start();
    return () => a.stop();
  }, []);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const dots = [[0, -42, 26, '#1f4d1f'], [42, 0, 28, '#1f4d1f'], [0, 42, 34, '#7cc07c'], [-42, 0, 40, '#7cc07c']];
  return (
    <View style={[st.loading, style]}>
      <Animated.View style={{ width: z(130), height: z(130), transform: [{ rotate }] }}>
        {dots.map(([x, y, d, c], i) => (
          <View key={i} style={{ position: 'absolute', left: z(65 + x - d / 2), top: z(65 + y - d / 2), width: z(d), height: z(d), borderRadius: z(d), backgroundColor: c }} />
        ))}
      </Animated.View>
      <Txt s={22} w="500" c="#444" style={{ marginTop: z(30) }}>{label}</Txt>
    </View>
  );
}

// Kết quả quét rác (205:9734) + popup chúc mừng (205:9767).
export function ScanResult() {
  const nav = useNav();
  const store = useStore();
  const [done, setDone] = useState(false);
  const claim = () => { if (!done) { setDone(true); store.addPoints(5, 'Phân loại rác nhựa'); } };
  return (
    <Screen bg="#d6f0b8" topBg={C.green} light active="scan">
      <LinearGradient colors={[C.green, '#d6f0b8', '#eefbdc']} style={StyleSheet.absoluteFill} />
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: z(20), height: z(64) }}>
        <Press label="Quay lại" onPress={nav.back} style={{ padding: z(4) }}><Icon name="chevron-back" size={26} color={C.white} /></Press>
        <Txt s={28} w="700" c={C.white} style={{ flex: 1, textAlign: 'center', marginRight: z(34) }}>Kết quả quét rác</Txt>
      </View>
      <Scroll contentStyle={{ paddingHorizontal: z(14), alignItems: 'center' }}>
        <View style={st.product}>
          <Img name="bottle" style={{ width: z(68), height: z(102) }} mode="contain" />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Txt s={18} w="500">Plastic Bottle</Txt>
            <Txt s={18} w="500" style={{ marginTop: z(6) }}><Txt s={18} c={C.green}>♻ </Txt>Rác tái chế</Txt>
          </View>
        </View>
        <Icon name="sunny-outline" size={30} color={C.green} />
        {['🧼 Dấu hiệu: Trong suốt, nhẹ, có ký hiệu PET hoặc HDPE.', '🗑️ Phân loại: Bỏ vào thùng tái chế màu xanh lá.', '💧 Xử lý: Rửa sạch, làm khô trước khi bỏ.\n💡 Mẹo: Có thể tận dụng làm chậu cây nhỏ hoặc đồ'].map(t => (
          <View key={t} style={st.tip}><Txt s={13} center>{t}</Txt></View>
        ))}
        <Btn title="🔍 Xem thùng rác gần đây" onPress={() => nav.reset('map')} radius={8} h={48} s={13} w="600" style={st.actionBtn} />
        <Btn title="⭐ Tích điểm xanh" onPress={claim} radius={8} h={48} s={13} w="600" style={st.actionBtn} />
      </Scroll>
      <Overlay visible={done} onClose={() => nav.reset('home')} dim="rgba(255,255,255,0.45)">
        <View style={st.congrats}>
          <Press label="Đóng" onPress={() => nav.reset('home')} style={{ position: 'absolute', right: z(18), top: z(16) }}><Icon name="close" size={18} /></Press>
          <Congrats />
          <Txt s={14} center style={{ marginTop: z(12) }}>Bạn vừa phân loại rác nhựa{'\n'}tái chế thành công 👏</Txt>
          <Img name="leaf_big" style={{ width: z(74), height: z(90), marginVertical: z(16) }} mode="contain" />
          <Txt s={14}>Bạn nhận được <Txt s={14} w="800">5</Txt> điểm</Txt>
          <Btn title="Đi đến trang tích điểm để đổi quà" onPress={() => nav.reset('rewards')} h={36} s={10} w="600" bg="#4caf50" style={{ width: z(228), marginTop: z(16) }} />
          <Btn title="Trở về trang chủ" onPress={() => nav.reset('home')} h={32} s={10} w="600" bg="#4caf50" style={{ width: z(168), marginTop: z(12) }} />
        </View>
      </Overlay>
    </Screen>
  );
}

const st = StyleSheet.create({
  introHead: { flexDirection: 'row', alignItems: 'center', height: z(110), backgroundColor: '#eef6fb', paddingRight: z(10) },
  scanCard: { marginTop: z(48), marginHorizontal: z(30), height: z(384), borderRadius: z(20), backgroundColor: '#d7eed2', alignItems: 'center', justifyContent: 'center' },
  bubble: { marginTop: z(22), alignSelf: 'center', width: z(222), borderWidth: 1, borderColor: '#555', backgroundColor: C.white, paddingVertical: z(10), paddingHorizontal: z(4) },
  bubbleTail: { position: 'absolute', right: z(46), bottom: z(-14), width: z(18), height: z(18), backgroundColor: C.white, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#555', transform: [{ rotate: '45deg' }] },
  camTop: { flexDirection: 'row', alignItems: 'center', gap: z(18), paddingHorizontal: z(16), paddingTop: z(24) },
  camBottom: { position: 'absolute', left: z(50), right: z(50), bottom: z(24), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  shutter: { width: z(80), height: z(80), borderRadius: z(40), backgroundColor: C.white, borderWidth: z(4), borderColor: 'rgba(255,255,255,0.6)' },
  loading: { width: z(311), height: z(370), borderRadius: z(20), backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  okPop: { position: 'absolute', alignSelf: 'center', top: z(268), width: z(224), height: z(134), borderRadius: z(20), backgroundColor: '#f2fbe4', alignItems: 'center', justifyContent: 'center' },
  okIcon: { width: z(36), height: z(36), borderRadius: z(18), backgroundColor: '#8bc34a', alignItems: 'center', justifyContent: 'center' },
  resPop: { position: 'absolute', alignSelf: 'center', top: z(470), width: z(310), height: z(102), borderRadius: z(10), backgroundColor: C.white, flexDirection: 'row', alignItems: 'center', paddingHorizontal: z(20) },
  detailBtn: { position: 'absolute', alignSelf: 'center', top: z(586), width: z(226), backgroundColor: C.green },
  failCard: { width: z(320), borderRadius: z(20), backgroundColor: C.white, padding: z(20), paddingTop: z(30), alignItems: 'center' },
  product: { width: z(355), height: z(108), marginTop: z(10), marginBottom: z(20), borderRadius: z(10), backgroundColor: C.white, borderWidth: 1, borderColor: '#999', flexDirection: 'row', alignItems: 'center', paddingHorizontal: z(30) },
  tip: { width: z(398), minHeight: z(58), borderRadius: z(15), backgroundColor: '#f2fbea', borderWidth: 1, borderColor: '#c8d8c0', justifyContent: 'center', padding: z(10), marginTop: z(26) },
  actionBtn: { width: z(220), marginTop: z(44), ...shadow(4, 4, 0.25) },
  congrats: { width: z(310), borderRadius: z(30), backgroundColor: '#f6fde8', alignItems: 'center', paddingVertical: z(36), paddingHorizontal: z(16) },
});
