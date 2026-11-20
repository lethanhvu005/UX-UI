import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { C, z, shadow } from '../theme';
import { Icon, Img, Press, Screen, Scroll, Txt } from '../ui';
import { useNav } from '../nav';
import { loadAppData } from '../database';
import { groups as fallback, nextGroup } from '../groups';

// "Các loại … phổ biến" (205:15795, 16009, 15941, 15869). Dữ liệu đọc từ SQLite.
let cache = null;
export function Category() {
  const nav = useNav();
  const [groups, setGroups] = useState(cache);
  useEffect(() => {
    if (cache) return;
    loadAppData().then(d => { cache = d.groups; setGroups(d.groups); })
      .catch(error => { console.warn('SQLite:', error); setGroups(fallback); });
  }, []);
  const group = groups?.find(g => g.id === nav.route.params.id);
  const next = group && nextGroup[group.id];
  return (
    <Screen active="home" topBg={C.green} light>
      <View style={st.greenTop} />
      <View style={st.header}>
        <Press label="Quay lại" onPress={nav.back} style={{ padding: z(4) }}><Icon name="chevron-back" size={28} color={C.white} /></Press>
        <Txt s={22} w="600" c={C.white} numberOfLines={1} style={{ flex: 1, marginLeft: z(4) }}>{group?.title ?? ''}</Txt>
        <Press label="Sổ tay" onPress={() => nav.go('handbook')} style={{ padding: z(4) }}><Icon name="menu" size={26} color={C.white} /></Press>
      </View>
      {!group ? <ActivityIndicator color={C.green} style={{ marginTop: z(60) }} /> : (
        <Scroll contentStyle={{ paddingHorizontal: z(19), paddingTop: z(4) }}>
          {group.items.map(([name, time, img, progress]) => (
            <View key={name} style={st.card}>
              <Img name={img} style={{ width: z(98), height: z(90) }} mode="contain" />
              <View style={{ flex: 1, marginLeft: z(14) }}>
                <Txt s={22} w="600" numberOfLines={2}>{name}</Txt>
                <Txt s={14} w="600" style={{ marginTop: z(8) }}>{time}</Txt>
                <View style={st.track}><View style={[st.bar, { width: `${progress}%` }]} /></View>
              </View>
            </View>
          ))}
          <Txt s={20} w="600" style={{ marginTop: z(10) }}>{group.noteTitle}</Txt>
          <View style={{ paddingLeft: z(group.id === 'medical' ? 22 : 28), marginTop: z(10), gap: z(2) }}>
            {group.notes.map(n => (
              <Txt key={n} s={15} w="500" style={{ lineHeight: z(21) }}>{group.id === 'medical' ? `•  ${n}` : n}</Txt>
            ))}
          </View>
          {next && (
            <Press label={next.label} onPress={() => nav.replace('category', { id: next.to })} style={[st.next, { backgroundColor: group.color, shadowColor: group.color }]}>
              <Img name={next.icon} style={{ width: z(40), height: z(40) }} mode="contain" />
              <Txt s={15} w="600" c={C.white}>{next.label}</Txt>
            </Press>
          )}
        </Scroll>
      )}
    </Screen>
  );
}

const st = StyleSheet.create({
  greenTop: { position: 'absolute', top: 0, left: 0, right: 0, height: z(100), backgroundColor: C.green },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: z(16), height: z(56) },
  card: { flexDirection: 'row', alignItems: 'center', height: z(110), borderRadius: z(15), backgroundColor: C.greenLight, paddingHorizontal: z(14), marginBottom: z(18), ...shadow(4, 6, 0.2) },
  track: { alignSelf: 'flex-end', marginTop: z(8), width: z(100), height: z(10), borderRadius: z(5), backgroundColor: C.greenSoft, overflow: 'hidden' },
  bar: { height: '100%', borderRadius: z(5), backgroundColor: C.green },
  next: { alignSelf: 'center', marginTop: z(26), height: z(50), minWidth: z(220), borderRadius: z(30), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: z(8), paddingHorizontal: z(20), shadowOpacity: 0.5, shadowRadius: 4, shadowOffset: { width: 0, height: 0 }, elevation: 4 },
});
