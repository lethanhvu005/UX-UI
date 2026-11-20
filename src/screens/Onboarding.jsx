import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, z } from '../theme';
import { Img, Press, Txt, Dots } from '../ui';
import { useNav } from '../nav';

// Màn "Bắt đầu": logo xoay vào rồi chữ GreenSteps (205:2187 → 205:2184).
export function Splash() {
  const nav = useNav();
  const spin = useRef(new Animated.Value(0)).current;
  const [showName, setShowName] = useState(false);
  useEffect(() => {
    Animated.timing(spin, { toValue: 1, duration: 900, useNativeDriver: true }).start(() => setShowName(true));
    const t = setTimeout(() => nav.replace('onboarding'), 2200);
    return () => clearTimeout(t);
  }, []);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-45deg'] });
  const scale = spin.interpolate({ inputRange: [0, 1], outputRange: [1.4, 1] });
  return (
    <Press label="Bỏ qua" onPress={() => nav.replace('onboarding')} style={{ flex: 1, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar style="dark" />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: z(12) }}>
        {showName && <Txt s={44} w="700" c={C.green}>GreenSteps</Txt>}
        <Animated.View style={{ transform: [{ rotate }, { scale }] }}>
          <Img name="logo" style={{ width: z(showName ? 100 : 150), height: z(showName ? 100 : 150), borderRadius: z(100) }} />
        </Animated.View>
      </View>
    </Press>
  );
}

const { width: W, height: H } = Dimensions.get('window');
const PAGES = [
  { id: 'earth' },
  { id: 'reduce', title: 'REDUCE', text: 'Cùng nhau bảo vệ môi trường từ việc phân loại rác đúng cách', img: 'onb_reduce' },
  { id: 'recycle', title: 'RECYCLE', text: 'Phân loại rác thông minh – Vì hành tinh xanh của chúng ta 🌱', img: 'onb_recycle' },
  { id: 'reuse', title: 'REUSE', text: 'Một hành động tái sử dụng hôm nay có thể mang lại ngàn điều tốt đẹp cho tương lai.💚', img: 'onb_reuse' },
];

// 4 trang giới thiệu (205:2189, 2193, 2201, 2209): vuốt ngang, chạm vào thanh chỉ báo để tiếp tục.
export function Onboarding() {
  const nav = useNav();
  const [index, setIndex] = useState(0);
  const list = useRef(null);
  const next = () => {
    if (index < PAGES.length - 1) list.current?.scrollToIndex({ index: index + 1 });
    else nav.replace('login');
  };
  return (
    <View style={{ flex: 1, backgroundColor: C.white }}>
      <StatusBar style="dark" />
      <FlatList ref={list} data={PAGES} horizontal pagingEnabled showsHorizontalScrollIndicator={false} keyExtractor={p => p.id}
        onMomentumScrollEnd={e => setIndex(Math.round(e.nativeEvent.contentOffset.x / W))}
        renderItem={({ item }) => <Page page={item} />} />
      <SafeAreaView edges={['bottom']} style={s.footer}>
        <Press label="Bỏ qua" onPress={() => nav.replace('login')} style={{ padding: z(10) }}>
          <Txt s={14} w="600" c={index === 0 ? C.white : C.grey}>Bỏ qua</Txt>
        </Press>
        <Press label="Tiếp tục" onPress={next} style={{ padding: z(10) }}>
          <Dots count={index === 0 ? 1 : 3} index={index === 0 ? 0 : index - 1} active={C.lime} inactive={index === 0 ? '#9fd39f' : C.greyLight} />
        </Press>
      </SafeAreaView>
    </View>
  );
}

function Page({ page }) {
  if (page.id === 'earth') {
    return (
      <View style={{ width: W, height: H, backgroundColor: C.green }}>
        <Img name="onb_earth" style={StyleSheet.absoluteFill} mode="cover" />
      </View>
    );
  }
  const top = page.id === 'reduce';
  return (
    <View style={{ width: W, height: H, backgroundColor: C.white, overflow: 'hidden' }}>
      {/* Mảng xanh bo tròn xoay 45° như trong thiết kế */}
      <View style={[s.blob, top ? { top: -z(330), left: -z(250) } : { bottom: -z(420), left: -z(110) }]} />
      <SafeAreaView edges={['top']} style={{ flex: 1, alignItems: 'center' }}>
        {top ? (
          <>
            <Img name={page.img} style={{ width: W, height: W, marginTop: z(120) }} mode="contain" />
            <Txt s={40} w="700" c={C.green} center style={{ marginTop: z(10) }}>{page.title}</Txt>
            <Txt s={19} center style={{ width: z(350), marginTop: z(14), lineHeight: z(22) }}>{page.text}</Txt>
          </>
        ) : (
          <>
            <Txt s={40} w="700" c={C.green} center style={{ marginTop: z(50) }}>{page.title}</Txt>
            <Txt s={19} center style={{ width: z(350), marginTop: z(40), lineHeight: z(24) }}>{page.text}</Txt>
            <Img name={page.img} style={{ width: W, height: z(400), marginTop: z(40) }} mode="contain" />
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  blob: { position: 'absolute', width: z(780), height: z(720), borderRadius: z(260), backgroundColor: C.green, transform: [{ rotate: '-45deg' }] },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: z(20), paddingBottom: z(20) },
});
