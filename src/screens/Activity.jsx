import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { C, z, shadow } from '../theme';
import { Icon, Img, Press, Screen, Scroll, Txt } from '../ui';
import { useNav, useStore } from '../nav';
import { ACTIVITIES } from '../data/content';
import { WorkCard } from './Home';

const SERIF = Platform.select({ ios: 'Georgia', default: 'serif' });

// Toast "Đã Thêm Vào Yêu Thích" (205:5509) / "Hoạt động yêu thích đã xóa" (205:5518).
export function Toast({ text, onHide }) {
  useEffect(() => { if (!text) return; const t = setTimeout(onHide, 1600); return () => clearTimeout(t); }, [text]);
  if (!text) return null;
  return (
    <View style={st.toast} pointerEvents="none">
      <Icon name={text.includes('xóa') ? 'trash-outline' : 'heart'} size={26} color={C.red} />
      <Txt s={16} w="600">{text}</Txt>
    </View>
  );
}

// Chi tiết hoạt động (205:4513, 5413, 4607, 4712) — trạng thái "Đã Quan Tâm" (205:2087, 18809…).
export function Activity() {
  const nav = useNav();
  const store = useStore();
  const a = ACTIVITIES.find(x => x.id === nav.route.params.id) ?? ACTIVITIES[0];
  const fav = store.favorites.includes(a.id);
  const following = store.following.includes(a.id);
  const [toast, setToast] = useState('');
  const toggleFav = () => { store.toggleFavorite(a.id); setToast(fav ? 'Hoạt động yêu thích đã xóa' : 'Đã Thêm Vào Yêu Thích'); };
  const follow = () => store.update(s => ({ following: following ? s.following.filter(f => f !== a.id) : [...s.following, a.id] }));
  return (
    <Screen bg={C.white} topBg="rgba(217,217,217,0.8)" active="home">
      <View style={[st.blob, { right: z(-150), top: z(320) }]} />
      <Scroll>
        <View style={st.hero}>
          <Img name={a.hero} style={StyleSheet.absoluteFill} />
          <Press label="Quay lại" onPress={nav.back} style={st.back}><Icon name="chevron-back" size={26} /></Press>
          <Press label="Yêu thích" onPress={toggleFav} style={st.heart}>
            <Icon name={fav ? 'heart' : 'heart-outline'} size={18} color={C.red} />
          </Press>
        </View>
        <View style={{ paddingHorizontal: z(26) }}>
          <Txt s={22} w="700" c={C.navy} numberOfLines={1} style={{ fontFamily: SERIF, marginTop: z(14) }}>{a.title}</Txt>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: z(6), marginTop: z(6) }}>
            <Icon name="location-outline" size={18} color="#f0a050" />
            <Txt s={15} c={C.blue}>{a.place}</Txt>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: z(20) }}>
            {['ppl1', 'ppl2', 'ppl3', 'ppl4', 'ppl5'].map((p, i) => (
              <Img key={p} name={p} style={[st.ppl, { marginLeft: i ? z(-20) : 0 }]} />
            ))}
            <View style={[st.ppl, { marginLeft: z(-20), backgroundColor: '#cde9cc', alignItems: 'center', justifyContent: 'center' }]}>
              <Txt s={8} w="700" c="#42b850">{a.count}</Txt>
            </View>
            <View style={{ flex: 1 }} />
            <Press label="Quan tâm" onPress={follow} style={[st.follow, following && { backgroundColor: C.green, borderColor: C.green }]}>
              <Txt s={12} w="700" c={following ? C.white : C.black}>{following ? 'Đã Quan Tâm' : 'Quan tâm'}</Txt>
            </Press>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: z(26) }}>
            {a.stats.map(([b, t], i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: z(8) }}>
                <View style={st.iconCircle}>
                  {i === 2 ? <Img name="clock" style={{ width: z(25), height: z(25) }} /> : <Icon name={i ? 'person-outline' : 'people-outline'} size={20} color={i ? C.green : '#e05a5a'} />}
                </View>
                <View><Txt s={12} w="700">{b}</Txt><Txt s={12}>{t}</Txt></View>
              </View>
            ))}
          </View>
          <Txt s={15} w="700" style={{ marginTop: z(34) }}>{a.heading}</Txt>
          {a.body.map((p, i) => <Txt key={i} s={12} style={{ marginTop: z(i ? 2 : 10), lineHeight: z(16) }}>{p}</Txt>)}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: z(28) }}>
            <Txt s={20} w="700">Hoạt động khác</Txt>
            <Press label="Tất cả" onPress={() => nav.go('favorites')}><Txt s={14} w="700" c="#575757">Tất cả</Txt></Press>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: z(16), padding: z(24), paddingTop: z(14) }}>
          {ACTIVITIES.filter(x => x.id !== a.id).map(x => <WorkCard key={x.id} a={x} w={135} />)}
        </ScrollView>
      </Scroll>
      <Toast text={toast} onHide={() => setToast('')} />
    </Screen>
  );
}

// Hoạt động yêu thích (205:19634).
export function Favorites() {
  const nav = useNav();
  const store = useStore();
  const [toast, setToast] = useState('');
  const list = ACTIVITIES.filter(a => store.favorites.includes(a.id));
  return (
    <Screen active="home">
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: z(16), height: z(64) }}>
        <Press label="Quay lại" onPress={nav.back} style={{ padding: z(4) }}><Icon name="chevron-back" size={24} /></Press>
        <Icon name="heart" size={32} color="#ef4b4b" />
        <Txt s={24} w="700" style={{ marginLeft: z(14) }}>Hoạt động yêu thích</Txt>
      </View>
      <Scroll contentStyle={{ paddingHorizontal: z(20) }}>
        {list.length === 0 && <Txt s={14} c={C.grey} center style={{ marginTop: z(40) }}>Chưa có hoạt động yêu thích. Nhấn ♥ ở một hoạt động để lưu lại nhé!</Txt>}
        {list.map((a, i) => (
          <Press key={a.id} label={a.title} onPress={() => nav.go('activity', { id: a.id })} style={st.favRow}>
            <Img name={`fav_${i % 4 + 1}`} style={{ width: z(72), height: z(72), borderRadius: z(12) }} />
            <View style={{ flex: 1, marginLeft: z(18) }}>
              <Txt s={16} w="700" c={C.navy} numberOfLines={1} style={{ fontFamily: SERIF }}>{a.title}</Txt>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: z(4), marginTop: z(10) }}>
                <Icon name="location-outline" size={16} color="#f0a050" />
                <Txt s={11} c={C.blue} numberOfLines={1} style={{ flex: 1 }}>{a.place}</Txt>
              </View>
            </View>
            <Press label="Xóa" onPress={() => { store.toggleFavorite(a.id); setToast('Hoạt động yêu thích đã xóa'); }} style={st.del}>
              <Txt s={10} w="700" c={C.white}>Xóa</Txt>
            </Press>
          </Press>
        ))}
      </Scroll>
      <Toast text={toast} onHide={() => setToast('')} />
    </Screen>
  );
}

const st = StyleSheet.create({
  blob: { position: 'absolute', width: z(260), height: z(264), borderRadius: z(132), backgroundColor: 'rgba(88,176,92,0.08)' },
  hero: { height: z(352), borderBottomLeftRadius: z(35), borderBottomRightRadius: z(35), overflow: 'hidden', ...shadow(15, 10, 0.25) },
  back: { position: 'absolute', left: z(14), top: z(4), padding: z(6) },
  heart: { position: 'absolute', left: z(380), top: z(304), width: z(32), height: z(32), borderRadius: z(16), backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  ppl: { width: z(40), height: z(40), borderRadius: z(20), borderWidth: 1, borderColor: C.white },
  follow: { width: z(84), height: z(35), borderRadius: z(10), backgroundColor: C.white, borderWidth: 1, borderColor: '#59b760', alignItems: 'center', justifyContent: 'center', ...shadow(4, 4, 0.25) },
  iconCircle: { width: z(40), height: z(40), borderRadius: z(20), backgroundColor: C.white, alignItems: 'center', justifyContent: 'center', ...shadow(4, 6, 0.2) },
  toast: { position: 'absolute', alignSelf: 'center', top: '40%', width: z(359), minHeight: z(95), borderRadius: z(20), backgroundColor: C.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: z(12), ...shadow(4, 12, 0.3) },
  favRow: { flexDirection: 'row', alignItems: 'center', height: z(101) },
  del: { backgroundColor: '#f31d1d', borderRadius: z(10), paddingHorizontal: z(12), height: z(24), justifyContent: 'center' },
});
