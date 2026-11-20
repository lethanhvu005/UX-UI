import React from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { C, z, shadow } from './theme';
import { IMG } from './assets';
import { useNav } from './nav';

export function Txt({ s = 14, w = '400', c = C.black, center, style, children, ...rest }) {
  return <Text {...rest} style={[{ fontSize: z(s), fontWeight: w, color: c }, center && { textAlign: 'center' }, style]}>{children}</Text>;
}

export function Press({ style, children, label, onPress, disabled, ...rest }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={onPress} {...rest}
      style={({ pressed }) => [typeof style === 'function' ? style(pressed) : style, pressed && { opacity: 0.7 }]}>
      {children}
    </Pressable>
  );
}

export function Img({ name, style, mode = 'cover', ...rest }) {
  const fill = style === StyleSheet.absoluteFill ? [style, { width: '100%', height: '100%' }] : style;
  return <Image source={IMG[name]} style={fill} resizeMode={mode} {...rest} />;
}

export const Icon = ({ name, size = 24, color = C.black, mc }) => mc
  ? <MaterialCommunityIcons name={name} size={z(size)} color={color} />
  : <Ionicons name={name} size={z(size)} color={color} />;

// Thanh điều hướng dưới: 4 tab + nút quét ở giữa (theo component "Group 36934" trong Figma).
const TABS = [
  { id: 'home', icon: 'home-outline' },
  { id: 'map', icon: 'map-marker-radius-outline', mc: true },
  { id: 'scan' },
  { id: 'rewards', icon: 'storefront-outline' },
  { id: 'profile', icon: 'person-circle-outline' },
];
export function BottomNav({ active, notchColor = C.white, dim }) {
  const nav = useNav();
  const insets = useSafeAreaInsets();
  return (
    <View style={[st.navWrap, dim && { opacity: 0.45 }]} pointerEvents={dim ? 'none' : 'auto'}>
      <View style={[st.navBar, { paddingBottom: Math.max(insets.bottom - 6, 0) }]}>
        {TABS.map(t => t.id === 'scan' ? <View key="gap" style={{ width: z(90) }} /> : (
          <Press key={t.id} label={t.id} onPress={() => nav.reset(t.id)} style={[st.tab, active === t.id && st.tabActive]}>
            <Icon name={t.icon} mc={t.mc} size={30} color={C.white} />
          </Press>
        ))}
      </View>
      <View style={[st.notch, { backgroundColor: notchColor }]} pointerEvents="none" />
      <Press label="Quét rác" onPress={() => nav.reset('scan')} style={st.scanBtn}>
        <Icon name="scan-helper" mc size={34} color={C.black} />
      </Press>
    </View>
  );
}

// Khung màn hình chung: vùng an toàn + thanh trạng thái + bottom nav.
export function Screen({ children, bg = C.white, topBg, light, nav = true, active, notch, dimNav, overlay }) {
  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar style={light ? 'light' : 'dark'} />
      <SafeAreaView edges={['top']} style={{ backgroundColor: topBg ?? bg }} />
      <View style={{ flex: 1 }}>{children}</View>
      {nav && <BottomNav active={active} notchColor={notch ?? bg} dim={dimNav} />}
      {overlay}
    </View>
  );
}

export function Scroll({ children, style, contentStyle, pad = 120, ...rest }) {
  return <ScrollView style={[{ flex: 1 }, style]} contentContainerStyle={[{ paddingBottom: z(pad) }, contentStyle]} showsVerticalScrollIndicator={false} {...rest}>{children}</ScrollView>;
}

// Header nền xanh: nút back, tiêu đề, nút phải.
export function GreenHeader({ title, onBack, right, size = 32, align = 'center', style, children, color = C.green }) {
  const nav = useNav();
  return (
    <View style={[{ backgroundColor: color, paddingHorizontal: z(16), paddingTop: z(8), paddingBottom: z(14) }, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: z(48) }}>
        <Press label="Quay lại" onPress={onBack ?? nav.back} style={{ padding: z(6) }}>
          <Icon name="chevron-back" size={26} color={C.white} />
        </Press>
        <Txt s={size} w="700" c={C.white} numberOfLines={1} style={{ flex: 1, textAlign: align, marginRight: right ? 0 : z(36) }}>{title}</Txt>
        {right}
      </View>
      {children}
    </View>
  );
}

export function WhiteHeader({ title, onBack, right, size = 26 }) {
  const nav = useNav();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: z(16), height: z(64) }}>
      <Press label="Quay lại" onPress={onBack ?? nav.back} style={{ padding: z(6), marginRight: z(8) }}>
        <Icon name="chevron-back" size={26} />
      </Press>
      <Txt s={size} w="700" style={{ flex: 1 }} numberOfLines={1}>{title}</Txt>
      {right}
    </View>
  );
}

export function Btn({ title, onPress, bg = C.green, color = C.white, style, s = 15, w = '700', icon, h = 44, radius = 30, outline }) {
  return (
    <Press label={title} onPress={onPress} style={[{ backgroundColor: bg, height: z(h), borderRadius: z(radius), alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: z(18), gap: z(8) }, outline && { borderWidth: 1, borderColor: outline }, style]}>
      {icon}
      <Txt s={s} w={w} c={color}>{title}</Txt>
    </Press>
  );
}

export function Overlay({ visible, onClose, children, dim = 'rgba(0,0,0,0.35)', center = true }) {
  return (
    <Modal visible={!!visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: dim, justifyContent: center ? 'center' : 'flex-end', alignItems: 'center', padding: z(20) }]}>
        <Pressable accessibilityLabel="Đóng" style={StyleSheet.absoluteFill} onPress={onClose} />
        {children}
      </View>
    </Modal>
  );
}

export function CloseX({ onPress, style, size = 18 }) {
  return (
    <Press label="Đóng" onPress={onPress} style={[{ width: z(28), height: z(28), borderRadius: z(14), backgroundColor: C.white, alignItems: 'center', justifyContent: 'center', ...shadow(1, 3, 0.2) }, style]}>
      <Icon name="close" size={size} />
    </Press>
  );
}

export function SearchBox({ placeholder = 'Tìm kiếm.....', value, onChangeText, style, icon = true, right }) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderRadius: z(15), height: z(56), paddingHorizontal: z(14), gap: z(10), ...shadow(4, 6, 0.2) }, style]}>
      {icon && <Icon name="search-outline" size={26} />}
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#9a9a9a" style={{ flex: 1, fontSize: z(13), color: C.black }} />
      {right}
    </View>
  );
}

// Chữ "CHÚC MỪNG" vàng viền đậm như trong thiết kế.
export function Congrats({ s = 22 }) {
  return <Txt s={s} w="900" c="#f2e600" center style={{ textShadowColor: '#5b4b00', textShadowRadius: 2, textShadowOffset: { width: 1, height: 1 }, letterSpacing: 0.5 }}>CHÚC MỪNG</Txt>;
}

export function Dots({ count, index, active = C.lime, inactive = C.greyLight }) {
  return (
    <View style={{ flexDirection: 'row', gap: z(5), alignItems: 'center' }}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={{ height: z(10), width: i === index ? z(40) : z(10), borderRadius: z(10), backgroundColor: i === index ? active : inactive }} />
      ))}
    </View>
  );
}

const st = StyleSheet.create({
  navWrap: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  navBar: { backgroundColor: C.green, minHeight: z(75), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: z(12), borderTopLeftRadius: z(30), borderTopRightRadius: z(30) },
  tab: { width: z(76), height: z(48), borderRadius: z(25), alignItems: 'center', justifyContent: 'center' },
  tabActive: { backgroundColor: C.greenNav },
  notch: { position: 'absolute', alignSelf: 'center', top: z(-52), width: z(94), height: z(94), borderRadius: z(47) },
  scanBtn: { position: 'absolute', alignSelf: 'center', top: z(-36), width: z(72), height: z(72), borderRadius: z(36), backgroundColor: C.white, alignItems: 'center', justifyContent: 'center', ...shadow(4, 8, 0.25) },
});
