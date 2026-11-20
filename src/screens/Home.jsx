import React, { useState } from 'react';
import { Dimensions, FlatList, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, z, shadow } from '../theme';
import { Icon, Img, Press, Screen, Txt } from '../ui';
import { useNav, useStore } from '../nav';
import { ACTIVITIES } from '../data/content';

// Trang chủ (205:3852) — nội dung cuộn theo outline Figma.
const CATS = [
  { label: 'Nhựa', bg: '#fbf6b0', img: 'home_rectangle9', to: ['category', { id: 'plastic' }] },
  { label: 'Ni Lông', bg: '#c8f1f4', img: 'home_rectangle258', to: ['category', { id: 'bags' }] },
  { label: 'Pin', bg: '#f8c8cf', img: 'home_rectangle255', to: ['category', { id: 'battery' }] },
  { label: 'Y tế', bg: '#d4f1cf', img: 'home_rectangle259', to: ['category', { id: 'medical' }] },
  { label: 'Giấy', bg: '#ffe2b8', img: 'home_image28', to: ['handbookItem', { id: 'paper' }] },
  { label: 'Thủy tinh', bg: '#dfe9fb', img: 'home_image29', to: ['handbookItem', { id: 'glass' }] },
];
const BANNERS = ['home_rectangle750', 'home_rectangle751', 'home_rectangle752'];
const { width: W } = Dimensions.get('window');

export function Home() {
  const nav = useNav();
  const store = useStore();
  const [menu, setMenu] = useState(false);
  const [banner, setBanner] = useState(0);
  const bannerW = W - z(39);
  return (
    <Screen active="home">
      <View style={st.blobRight} /><View style={st.blobLeft} />
      {/* Header */}
      <View style={st.header}>
        <Press label="Menu" onPress={() => setMenu(true)} style={{ padding: z(4) }}><Icon name="menu" size={26} /></Press>
        <Press label="Thông báo" onPress={() => nav.go('notifications')} style={{ padding: z(4) }}>
          <Icon name="notifications-outline" size={26} />
          <View style={st.badge} />
        </Press>
      </View>
      <View style={st.info}>
        <Img name="home_ellipse1" style={st.avatar} />
        <Txt s={12} w="600" style={{ flex: 1, marginLeft: z(10) }}>Hi, {store.user.name}</Txt>
        <Press label="Điểm của bạn" onPress={() => nav.go('rewards')} style={st.point}>
          <Img name="home_ellipse2" style={{ width: z(20), height: z(20), borderRadius: z(10) }} />
          <Txt s={10} w="600" c={C.white}>{store.points} Point</Txt>
        </Press>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: z(12), paddingBottom: z(130), gap: z(28) }} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={{ height: z(262), marginTop: z(6) }}>
          <Txt s={32} w="700" style={{ width: z(250), lineHeight: z(38) }}>
            <Txt s={32} w="700" c={C.green}>Phân loại</Txt> hôm nay, <Txt s={32} w="700" c={C.green}>Xanh mãi</Txt> ngày mai
          </Txt>
          <Txt s={13} c="rgba(0,0,0,0.7)" center style={{ width: z(160), marginTop: z(14) }}>Phân loại rác – thói quen của người văn minh</Txt>
          <View style={[st.dot, { left: z(24), top: z(190), width: z(22), height: z(22), backgroundColor: '#2f7a33' }]} />
          <Press label="Bắt đầu hành trình" onPress={() => nav.go('handbookList')} style={st.start}>
            <Txt s={12} w="700" c={C.white}>Bắt đầu hành trình</Txt>
          </Press>
          <View style={[st.dot, { left: z(140), top: z(212), width: z(14), height: z(14), backgroundColor: '#f7c948' }]} />
          <Img name="home_rectangle736" style={[st.heroImg, { left: z(158), top: z(60), height: z(146) }]} />
          <Img name="home_rectangle252" style={[st.heroImg, st.shadowImg, { left: z(280), top: z(4), height: z(116) }]} />
          <Img name="home_rectangle253" style={[st.heroImg, st.shadowImg, { left: z(281), top: z(136), height: z(116) }]} />
        </View>

        {/* Rác cần phân loại */}
        <View>
          <View style={st.rowBetween}>
            <Txt s={15} w="800">Rác Cần Phân Loại</Txt>
            <Press label="Tất cả" onPress={() => nav.go('handbookAll')}><Txt s={14} w="700" c="#57aa5b">Tất cả</Txt></Press>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: z(30), paddingTop: z(16), paddingRight: z(10) }}>
            {CATS.map(c => (
              <Press key={c.label} label={c.label} onPress={() => nav.go(...c.to)} style={{ alignItems: 'center', gap: z(10) }}>
                <View style={[st.catCircle, { backgroundColor: c.bg }]}>
                  <Img name={c.img} style={{ width: z(45), height: z(45) }} mode="contain" />
                </View>
                <Txt s={12} w="600">{c.label}</Txt>
              </Press>
            ))}
          </ScrollView>
        </View>

        {/* Banner Healing */}
        <View>
          <FlatList data={BANNERS} horizontal pagingEnabled showsHorizontalScrollIndicator={false} keyExtractor={b => b}
            snapToInterval={bannerW + z(15)} decelerationRate="fast" ItemSeparatorComponent={() => <View style={{ width: z(15) }} />}
            onMomentumScrollEnd={e => setBanner(Math.round(e.nativeEvent.contentOffset.x / (bannerW + z(15))))}
            renderItem={({ item }) => (
              <Press label="Healing" onPress={() => nav.go('activity', { id: 'act3' })} style={{ width: bannerW, height: z(162), borderRadius: z(10), overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
                <Img name={item} style={StyleSheet.absoluteFill} />
                <Txt s={25} w="800" c={C.white} style={st.tshadow}>H e a l i n g</Txt>
                <Txt s={17} w="700" c={C.white} style={[st.tshadow, { marginTop: z(12) }]}>Bảo vệ môi trường - Kiến tạo tương lại</Txt>
              </Press>
            )} />
          <View style={{ flexDirection: 'row', gap: z(6), alignSelf: 'center', marginTop: z(10) }}>
            {BANNERS.map((b, i) => <View key={b} style={{ width: z(10), height: z(10), borderRadius: z(5), backgroundColor: i === banner ? C.green : '#cfd8cf' }} />)}
          </View>
        </View>

        {/* Hoạt động nổi bật */}
        <View>
          <View style={st.rowBetween}>
            <Txt s={20} w="700">Hoạt động nổi bật</Txt>
            <Press label="Hoạt động yêu thích" onPress={() => nav.go('favorites')}><Txt s={14} w="700" c="#575757">Tất cả</Txt></Press>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: z(16), paddingVertical: z(14), paddingRight: z(10) }}>
            {ACTIVITIES.map(a => <WorkCard key={a.id} a={a} />)}
          </ScrollView>
        </View>

        {/* Thống kê rác toàn cầu */}
        <View style={{ height: z(240), flexDirection: 'row' }}>
          <View style={st.footerImgWrap}>
            <Img name="home_rectangle28" style={StyleSheet.absoluteFill} />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.25)' }]} />
            <Img name="home_image23" style={{ position: 'absolute', left: z(40), top: z(-30), width: z(154), height: z(232), transform: [{ rotate: '180deg' }] }} mode="contain" />
          </View>
          <View style={{ flex: 1, alignItems: 'center', paddingLeft: z(8) }}>
            <Txt s={20} w="700" c={C.green} style={{ letterSpacing: 4 }}>Healing</Txt>
            <Txt s={10} w="600" center style={{ marginTop: z(6) }}>Khối lượng ước tính <Txt s={11} w="600" c="#4f81bc">rác thải</Txt> sinh hoạt đô thị <Txt s={11} w="600" c="#4f81bc">toàn cầu</Txt> hiện nay</Txt>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: z(8), justifyContent: 'center', marginTop: z(14), width: z(150) }}>
              {[['2.3B+', 'Tổng lượng rác toàn cầu'], ['19%+', 'Rác được tái chế'], ['300M+', 'Rác nhựa'], ['3.8B+', 'Dự báo 2050']].map(([v, l]) => (
                <View key={v} style={st.stat}>
                  <Txt s={9} w="800" c="#2e7d32">{v}</Txt>
                  <Txt s={7} w="300" center>{l}</Txt>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Về chúng tôi */}
        <View style={{ alignItems: 'center' }}>
          <Txt s={24} w="800" c="#4e4e4e">Về chúng tôi</Txt>
          <View style={{ width: z(48), height: z(4), borderRadius: 2, backgroundColor: C.green, marginTop: z(6) }} />
          <Txt s={18} w="600" center style={{ marginTop: z(16) }}>Cùng chung tay bảo vệ môi trường xanh cùng</Txt>
          <Txt s={18} w="800" c={C.greenText} style={{ marginTop: z(4), letterSpacing: 0.5 }}>GreenSteps</Txt>
          <View style={{ height: z(200), width: '100%', marginTop: z(10) }}>
            <Img name="home_image50" style={{ position: 'absolute', alignSelf: 'center', top: z(8), width: z(184), height: z(184) }} mode="contain" />
            {[['Thu Phương', 0, 16], ['Mỹ Duyên', 0, 120], ['Quang Huy', 1, 16], ['Hoàng Bảo', 1, 120]].map(([n, side, top]) => (
              <View key={n} style={[st.member, side ? { right: z(10) } : { left: z(10) }, { top: z(top) }]}>
                <Img name="home_ellipse112" style={{ width: z(20), height: z(20), borderRadius: z(10) }} />
                <Txt s={8} w="700">{n}</Txt>
              </View>
            ))}
          </View>
          <Txt s={12} w="500" center style={{ marginTop: z(6) }}>“Hành động nhỏ hôm nay - Môi trường xanh mai sau.”</Txt>
          <Txt s={14} w="300" center style={{ marginTop: z(10), lineHeight: z(18) }}>
            Mỗi việc làm đúng về rác thải đều góp phần giảm ô nhiễm, tái chế tài nguyên và bảo vệ sức khỏe cộng đồng. Chúng tôi mong muốn biến việc phân loại rác trở thành thói quen dễ dàng và thú vị cho tất cả mọi người.
          </Txt>
        </View>
      </ScrollView>

      {/* Nút RecycleBot */}
      <Press label="Trò chuyện với RecycleBot" onPress={() => nav.go('chatbot')} style={st.fab}>
        <Icon name="recycle" mc size={30} color={C.green} />
      </Press>
      <SideMenu visible={menu} onClose={() => setMenu(false)} />
    </Screen>
  );
}

export function WorkCard({ a, w = 156 }) {
  const nav = useNav();
  const store = useStore();
  const fav = store.favorites.includes(a.id);
  return (
    <Press label={a.short} onPress={() => nav.go('activity', { id: a.id })} style={{ width: z(w), height: z(201) }}>
      <Img name={a.card} style={{ width: '100%', height: z(122), borderTopLeftRadius: z(15), borderTopRightRadius: z(15) }} />
      <View style={st.workBottom}>
        <View style={{ flexDirection: 'row', gap: z(4) }}>
          <Img name="home_image32" style={{ width: z(10), height: z(12), marginTop: z(2) }} mode="contain" />
          <View style={{ flex: 1 }}>
            <Txt s={10} w="700" c={C.navy} numberOfLines={2}>{a.short}</Txt>
            <Txt s={6} c={C.blue} numberOfLines={1} style={{ marginTop: z(3) }}>{a.place}</Txt>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: z(5) }}>
          {['home_ellipse95', 'home_ellipse96', 'home_ellipse97', 'home_ellipse98', 'home_ellipse99'].map((p, i) => (
            <Img key={p} name={p} style={{ width: z(20), height: z(20), borderRadius: z(10), marginLeft: i ? z(-8) : 0, borderWidth: 1, borderColor: C.white }} />
          ))}
          <View style={{ width: z(20), height: z(20), borderRadius: z(10), backgroundColor: '#d8f0d4', marginLeft: z(-8), alignItems: 'center', justifyContent: 'center' }}>
            <Txt s={6} w="600">{a.cardCount}</Txt>
          </View>
        </View>
      </View>
      <Press label="Yêu thích" onPress={() => store.toggleFavorite(a.id)} style={st.loveBtn}>
        <Icon name={fav ? 'heart' : 'heart-outline'} size={12} color={C.red} />
      </Press>
    </Press>
  );
}

// Menu trượt (205:3691): Tin tức, Bài đăng, Thống kê, Sổ tay.
function SideMenu({ visible, onClose }) {
  const nav = useNav();
  const store = useStore();
  const items = [['Tin tức', 'news'], ['Bài Đăng', 'community'], ['Thống kê', 'stats'], ['Sổ Tay', 'handbook']];
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable accessibilityLabel="Đóng menu" style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.15)' }} onPress={onClose}>
        <SafeAreaView>
          <Pressable style={st.menu}>
            <View style={st.menuBlob} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: z(13), marginBottom: z(14) }}>
              <Img name="avatar_healing" style={{ width: z(40), height: z(40), borderRadius: z(20) }} />
              <Txt s={12} w="600">Hi, {store.user.name}</Txt>
            </View>
            {items.map(([label, to]) => (
              <Press key={to} label={label} onPress={() => { onClose(); nav.go(to); }} style={st.menuItem}>
                <Txt s={12} w="600">{label}</Txt>
              </Press>
            ))}
          </Pressable>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
}

const st = StyleSheet.create({
  blobRight: { position: 'absolute', right: z(-150), top: z(250), width: z(260), height: z(264), borderRadius: z(132), backgroundColor: 'rgba(88,176,92,0.10)' },
  blobLeft: { position: 'absolute', left: z(-150), top: z(700), width: z(260), height: z(264), borderRadius: z(132), backgroundColor: 'rgba(88,176,92,0.10)' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: z(24), paddingTop: z(8) },
  badge: { position: 'absolute', right: z(4), top: z(4), width: z(8), height: z(8), borderRadius: z(4), backgroundColor: C.red },
  info: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: z(29), marginTop: z(8), marginBottom: z(10) },
  avatar: { width: z(50), height: z(50), borderRadius: z(25), borderWidth: z(3), borderColor: C.white, ...shadow(4, 6, 0.3) },
  point: { backgroundColor: C.greenDark, height: z(30), width: z(110), borderRadius: z(20), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: z(10), ...shadow(0, 10, 0.25) },
  start: { position: 'absolute', left: z(10), top: z(218), width: z(132), height: z(32), borderRadius: z(30), backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', borderRadius: z(20) },
  heroImg: { position: 'absolute', width: z(90), borderRadius: z(15) },
  shadowImg: { ...shadow(4, 4, 0.25) },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catCircle: { width: z(65), height: z(65), borderRadius: z(33), alignItems: 'center', justifyContent: 'center' },
  tshadow: { textShadowColor: 'rgba(0,0,0,0.35)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 4 },
  workBottom: { backgroundColor: C.white, height: z(79), borderBottomLeftRadius: z(15), borderBottomRightRadius: z(15), padding: z(6), ...shadow(4, 4, 0.25) },
  loveBtn: { position: 'absolute', right: z(6), top: z(6), width: z(20), height: z(20), borderRadius: z(10), backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  footerImgWrap: { width: z(220), height: z(179), marginTop: z(30), borderTopRightRadius: z(100), borderBottomRightRadius: z(100), overflow: 'hidden', marginLeft: z(-12) },
  stat: { width: z(66), height: z(46), borderRadius: z(5), backgroundColor: 'rgba(165,214,167,0.77)', alignItems: 'center', justifyContent: 'center', padding: z(3) },
  member: { position: 'absolute', width: z(70), height: z(46), borderRadius: z(5), backgroundColor: C.greenPale, alignItems: 'center', justifyContent: 'center', gap: z(2) },
  fab: { position: 'absolute', right: z(25), bottom: z(130), width: z(50), height: z(50), borderRadius: z(25), backgroundColor: C.white, alignItems: 'center', justifyContent: 'center', ...shadow(4, 10, 0.3) },
  menu: { marginLeft: z(16), marginTop: z(40), width: z(183), borderRadius: z(15), backgroundColor: C.white, padding: z(14), overflow: 'hidden', ...shadow(4, 10, 0.25) },
  menuBlob: { position: 'absolute', left: z(-97), top: z(-141), width: z(273), height: z(273), borderRadius: z(137), backgroundColor: 'rgba(88,176,92,0.12)' },
  menuItem: { height: z(25), borderRadius: z(10), backgroundColor: '#f3f3f3', justifyContent: 'center', paddingHorizontal: z(9), marginTop: z(10) },
});
