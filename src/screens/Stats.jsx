import React from 'react';
import { StyleSheet, View } from 'react-native';
import { C, z, shadow } from '../theme';
import { GreenHeader, Icon, Img, Screen, Scroll, Txt } from '../ui';

// Thống kê (205:5854).
const DETAIL = [['Hữu Cơ', '1,125 kg', '45%', '4000%'], ['Nhựa', '325 kg', '150kg', '5000%'], ['Tái chế', '125 kg', '45kg', '1500%']];

export function Stats() {
  return (
    <Screen bg="#a5d6a7" topBg={C.green} light active="home">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: C.green, height: z(300) }]} />
      <GreenHeader title="Thống kê" />
      <Scroll contentStyle={{ paddingHorizontal: z(16) }}>
        <View style={st.panel}>
          <Txt s={22} w="600" c={C.white} style={{ margin: z(12) }}>Thống kê loại rác</Txt>
          <View style={{ flexDirection: 'row', gap: z(14) }}>
            <View style={st.card}>
              <Txt s={15} w="500">Tổng lượng rác</Txt>
              <Img name="stats_donut" style={{ width: z(170), height: z(188) }} mode="contain" />
              <Txt s={15} w="600">2,500 Kg</Txt>
              <Txt s={11} c="#b5b5b5">Trong nhóm này</Txt>
            </View>
            <View style={st.card}>
              <Txt s={15} w="500">Tần suất phân loại</Txt>
              <Img name="stats_bars" style={{ width: z(170), height: z(180), marginVertical: z(4) }} mode="contain" />
              <Txt s={15} w="600" style={{ marginTop: z(12) }}>12O lần/Tuần</Txt>
            </View>
          </View>
        </View>

        <View style={[st.panel, { marginTop: z(40), paddingBottom: z(0) }]}>
          <Txt s={17} w="600" c={C.white} style={{ margin: z(16) }}>Mục tiêu & Thành tựu</Txt>
          <View style={st.goal}>
            <View style={{ flex: 1 }}>
              <Txt s={13}>Giảm rác thải nhựa</Txt>
              <View style={st.track}><View style={[st.bar, { width: '75%' }]} /></View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Txt s={13}><Txt s={13} w="700">75%</Txt> hoàn thành</Txt>
                <Txt s={13}>500kg</Txt>
              </View>
            </View>
            {[['checkmark-circle-outline', 'Đã tái chế\n50kg giấy'], ['add-circle-outline', 'Thu gom\n10kg vụn'], ['checkmark-circle-outline', 'Tham gia\nthử thách']].map(([ic, t]) => (
              <View key={t} style={{ alignItems: 'center', width: z(62) }}>
                <Icon name={ic} size={26} color={C.green} />
                <Txt s={12} c="#666" center style={{ marginTop: z(10) }}>{t}</Txt>
              </View>
            ))}
          </View>
        </View>

        <View style={[st.panel, { marginTop: z(30), padding: z(16) }]}>
          <Txt s={17} w="600" c={C.white}>Thống kê chi tiết</Txt>
          <View style={st.table}>
            <View style={st.tr}>
              {['Phân loại', 'Khối lượng', 'Đã tái chế', 'Tăng trưởng'].map(h => <Txt key={h} s={12} w="700" style={st.td}>{h}</Txt>)}
            </View>
            {DETAIL.map(row => (
              <View key={row[0]} style={st.tr}>
                {row.map((c, i) => <Txt key={i} s={13} w={i ? '500' : '700'} c={i === 3 ? C.greenDeep : C.black} style={st.td}>{c}</Txt>)}
              </View>
            ))}
          </View>
        </View>
      </Scroll>
    </Screen>
  );
}

const st = StyleSheet.create({
  panel: { backgroundColor: C.green, borderRadius: z(25), padding: z(0), paddingBottom: z(14), ...shadow(4, 6, 0.2) },
  card: { flex: 1, backgroundColor: C.white, borderRadius: z(25), alignItems: 'center', paddingVertical: z(18), ...shadow(4, 6, 0.2) },
  goal: { backgroundColor: C.white, borderRadius: z(20), padding: z(14), flexDirection: 'row', alignItems: 'center', gap: z(8), marginHorizontal: z(-2), marginBottom: z(-2) },
  track: { height: z(10), borderRadius: z(5), backgroundColor: '#c8e6c9', marginVertical: z(12), overflow: 'hidden' },
  bar: { height: '100%', borderRadius: z(5), backgroundColor: C.greenDeep },
  table: { backgroundColor: C.white, borderRadius: z(15), marginTop: z(12), overflow: 'hidden' },
  tr: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e6efe6', paddingVertical: z(14), paddingHorizontal: z(8) },
  td: { flex: 1, textAlign: 'center' },
});
