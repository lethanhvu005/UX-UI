import React, { useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import { C, z, shadow } from '../theme';
import { Icon, Img, Press, Screen, Scroll, Txt } from '../ui';
import { useNav } from '../nav';
import { NEWS, WASTE_TYPES } from '../data/content';

const SERIF = Platform.select({ ios: 'Georgia', default: 'serif' });
const TABS = [['all', 'Tất cả'], ['latest', 'Tin mới nhất'], ['events', 'Sự kiện sắp tới']];

// Tin tức (205:19012) + tab "Tin mới nhất" (205:5166) + "Sự kiện sắp tới" (205:5288).
export function News() {
  const nav = useNav();
  const [tab, setTab] = useState(nav.route.params.tab ?? 'all');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  const filtered = NEWS.filter(n => (tab === 'all' || n.tab === tab) && n.title.toLowerCase().includes(q.toLowerCase()));
  const perPage = 8;
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const shown = filtered.slice(page * perPage, page * perPage + perPage);
  return (
    <Screen active="home">
      <Scroll contentStyle={{ paddingHorizontal: z(19) }}>
        {/* Banner */}
        <View style={st.banner}>
          <Img name="news_banner" style={StyleSheet.absoluteFill} />
          <Txt s={6} w="700" c="#6b6b6b" style={{ position: 'absolute', left: z(48), top: z(41), fontFamily: SERIF }}>Cập nhật hôm nay, bảo vệ mai sau</Txt>
          <View style={{ position: 'absolute', left: z(21), top: z(49), alignItems: 'center' }}>
            {[1, 2, 3].map(n => (
              <React.Fragment key={n}>
                {n > 1 && <View style={{ width: 1, height: z(30), backgroundColor: '#6b6b6b' }} />}
                <View style={[st.step, n > 1 && { backgroundColor: '#c9c9c9' }]}><Txt s={10} w="700" c={n > 1 ? C.white : C.black}>{n}</Txt></View>
              </React.Fragment>
            ))}
          </View>
          <Txt s={19} w="700" c={C.greenText} style={{ position: 'absolute', left: z(51), top: z(57), width: z(300) }}>CẬP NHẬT TIN TỨC{'\n'}VÌ MỘT HÀNH TINH XANH</Txt>
          <Txt s={7} w="700" c="#6b6b6b" style={{ position: 'absolute', left: z(51), top: z(110), fontFamily: SERIF }}>Bắt đầu hành trình xanh</Txt>
          <Press label="Tìm hiểu ngay" onPress={() => nav.go('newsDetail', { id: 'n1' })} style={st.learn}><Txt s={6} w="700" c={C.white}>Tìm hiểu ngay</Txt></Press>
          <Press label="Cộng đồng xanh" onPress={() => nav.go('community')} style={st.community}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Txt s={8} w="700" style={{ fontFamily: SERIF, marginLeft: z(80) }}>Xem thêm</Txt>
              <Img name="arrow_right" style={{ width: z(15), height: z(15) }} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: z(2) }}>
              {['cm1', 'cm2', 'cm3', 'cm4'].map((c, i) => <Img key={c} name={c} style={{ width: z(28), height: z(28), borderRadius: z(14), marginLeft: i ? z(-14) : 0 }} />)}
              <View style={{ marginLeft: z(6), flex: 1 }}>
                <Txt s={6} w="700" style={{ fontFamily: SERIF }}>Cộng đồng xanh</Txt>
                <Txt s={6} c="#777">Hàng nghìn người đã quan tâm đến môi trường</Txt>
              </View>
            </View>
          </Press>
        </View>
        {/* Tìm kiếm */}
        <View style={st.search}>
          <View style={st.searchIcon}><Icon name="search" size={16} color={C.white} /></View>
          <TextInput value={q} onChangeText={t => { setQ(t); setPage(0); }} placeholder="Tìm kiếm..." placeholderTextColor="#8a8a8a" style={{ flex: 1, fontSize: z(11), fontFamily: SERIF, color: C.black }} />
          <Icon name="menu" size={22} color="#8a8a8a" />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: z(6), marginTop: z(17) }}>
          {TABS.map(([id, label]) => (
            <Press key={id} label={label} onPress={() => { setTab(id); setPage(0); }} style={[st.tab, tab === id && st.tabOn]}>
              <Txt s={11} w="700" c={tab === id ? C.white : '#676767'}>{label}</Txt>
            </Press>
          ))}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: z(22), paddingHorizontal: z(12) }}>
          <View style={{ flex: 1 }}>
            <Txt s={15} w="700" style={{ fontFamily: SERIF }}>{TABS.find(t => t[0] === tab)[1]}</Txt>
            <Txt s={6} w="700" c="#818181" style={{ fontFamily: SERIF }}>“Cùng GreenSteps – Phân loại rác, bảo vệ hành tinh xanh”</Txt>
          </View>
          <Press label="Trang trước" onPress={() => setPage(p => Math.max(0, p - 1))} style={[st.arrow, { backgroundColor: '#efefef' }]}><Icon name="chevron-back" size={16} /></Press>
          <Press label="Trang sau" onPress={() => setPage(p => Math.min(pages - 1, p + 1))} style={[st.arrow, { backgroundColor: C.black, marginLeft: z(8) }]}><Icon name="chevron-forward" size={16} color={C.white} /></Press>
        </View>
        <View style={st.grid}>
          {shown.map(n => <NewsCard key={n.id} n={n} />)}
          {shown.length === 0 && <Txt s={13} c={C.grey} style={{ margin: z(20) }}>Không tìm thấy tin tức phù hợp.</Txt>}
        </View>
      </Scroll>
    </Screen>
  );
}

function NewsCard({ n }) {
  const nav = useNav();
  return (
    <Press label={n.card} onPress={() => nav.go('newsDetail', { id: n.id })} style={st.card}>
      <Img name={n.thumb} style={{ width: '100%', height: z(90), borderRadius: z(10) }} />
      <View style={{ flexDirection: 'row', marginTop: z(8), flex: 1 }}>
        <Txt s={12} w="600" numberOfLines={2} style={{ flex: 1 }}>{n.card}</Txt>
        <Img name="home_image26" style={{ width: z(15), height: z(15) }} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Img name="eye" style={{ width: z(15), height: z(15) }} />
        <Txt s={10} w="700" c={C.grey} style={{ flex: 1, marginLeft: z(2) }}>{n.views}</Txt>
        <Img name="share" style={{ width: z(13), height: z(13) }} />
        <Txt s={10} w="700" c={C.grey} style={{ marginLeft: z(3) }}>{n.shares}</Txt>
      </View>
    </Press>
  );
}

// Tin tức chi tiết (205:19173 … 205:6306).
export function NewsDetail() {
  const nav = useNav();
  const n = NEWS.find(x => x.id === nav.route.params.id) ?? NEWS[0];
  const [more, setMore] = useState(false);
  return (
    <Screen bg="#efeeee" topBg="#efeeee" active="home">
      <Scroll>
        <View style={{ height: z(217) + z(90) }}>
          <Img name={n.hero} style={{ width: '100%', height: z(217) }} />
          <Press label="Quay lại" onPress={nav.back} style={st.backCircle}><Icon name="chevron-back" size={20} /></Press>
          <View style={st.titleCard}>
            <Txt s={16} w="600" numberOfLines={2}>{n.title}</Txt>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: z(10), marginTop: z(10) }}>
              <Icon name="time-outline" size={16} color={C.grey} />
              <Txt s={11} c={C.grey}>{n.time}</Txt>
              <View style={st.tale}><Txt s={11} w="600" c={C.white}>Tale</Txt></View>
              <Txt s={11} c={C.grey}>Tái Chế</Txt>
            </View>
          </View>
        </View>
        <View style={{ paddingHorizontal: z(20), marginTop: z(4) }}>
          <Txt s={16} style={{ lineHeight: z(19) }}>
            {n.lead[0] ? <Txt s={16} w="700">{n.lead[0]}</Txt> : null}{n.lead[1]}
            {more ? '…' : <Txt s={16} w="700" onPress={() => setMore(true)}>...xem thêm</Txt>}
          </Txt>
          {more && <Txt s={14} c="#444" style={{ marginTop: z(6), lineHeight: z(18) }}>Hãy cùng GreenSteps lan tỏa hành động xanh: phân loại rác tại nguồn, giảm nhựa dùng một lần và tham gia các hoạt động cộng đồng gần bạn.</Txt>}
          <Section s={n.s1} />
          <Txt s={15} w="700" style={{ marginTop: z(18) }}>2. Hình ảnh các loại rác thải phổ biến</Txt>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: z(14) }}>
            {WASTE_TYPES.map(([img, label]) => (
              <View key={img} style={{ alignItems: 'center' }}>
                <View style={st.wtFrame}><Img name={img} style={{ width: z(66), height: z(66), borderRadius: z(10) }} /></View>
                <View style={st.wtLabel}><Txt s={7} w="700" c={C.white}>{label}</Txt></View>
              </View>
            ))}
          </View>
          <Section s={n.s3} ordered />
          <Section s={n.s4} />
        </View>
      </Scroll>
    </Screen>
  );
}

function Section({ s, ordered }) {
  const [title, items] = s;
  return (
    <View style={{ marginTop: z(18) }}>
      <Txt s={15} w="700">{title}</Txt>
      {items.map((t, i) => (
        <View key={i} style={{ flexDirection: 'row', marginTop: z(5), paddingLeft: z(10) }}>
          {items.length > 1 && <Txt s={12} style={{ width: z(16) }}>{ordered ? `${i + 1}.` : '•'}</Txt>}
          <Txt s={12} style={{ flex: 1, lineHeight: z(16) }}>{t}</Txt>
        </View>
      ))}
    </View>
  );
}

const st = StyleSheet.create({
  banner: { height: z(220), borderRadius: z(15), overflow: 'hidden', marginTop: z(6) },
  step: { width: z(20), height: z(20), borderRadius: z(10), backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  learn: { position: 'absolute', left: z(51), top: z(147), width: z(65), height: z(22), borderRadius: z(15), backgroundColor: '#258b28', alignItems: 'center', justifyContent: 'center' },
  community: { position: 'absolute', right: z(0), bottom: z(0), width: z(163), height: z(56), backgroundColor: C.white, borderTopLeftRadius: z(20), padding: z(6) },
  search: { flexDirection: 'row', alignItems: 'center', height: z(40), borderRadius: z(20), borderWidth: 1, borderColor: '#b8b8b8', backgroundColor: C.white, marginTop: z(22), paddingHorizontal: z(8), gap: z(12), marginHorizontal: z(13) },
  searchIcon: { width: z(27), height: z(27), borderRadius: z(14), backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' },
  tab: { width: z(103), height: z(25), borderRadius: z(15), borderWidth: 1, borderColor: '#258b28', backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  tabOn: { backgroundColor: C.green, borderColor: C.green },
  arrow: { width: z(28), height: z(28), borderRadius: z(14), alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: z(12), marginTop: z(18), rowGap: z(15) },
  card: { width: z(170), height: z(174), borderRadius: z(15), backgroundColor: C.white, padding: z(10), paddingBottom: z(8), ...shadow(4, 4, 0.25) },
  backCircle: { position: 'absolute', left: z(10), top: z(10), width: z(28), height: z(28), borderRadius: z(14), backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  titleCard: { position: 'absolute', left: z(22), right: z(22), top: z(173), minHeight: z(87), borderRadius: z(20), backgroundColor: C.white, paddingHorizontal: z(22), paddingVertical: z(12), ...shadow(4, 8, 0.25) },
  tale: { backgroundColor: C.green, borderRadius: z(4), paddingHorizontal: z(8), paddingVertical: z(1) },
  wtFrame: { padding: z(4), borderRadius: z(14), backgroundColor: C.white, ...shadow(2, 4, 0.15) },
  wtLabel: { marginTop: z(10), backgroundColor: C.green, borderRadius: z(4), paddingHorizontal: z(6), paddingVertical: z(2) },
});
