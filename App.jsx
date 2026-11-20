import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, Image, ImageBackground, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { loadAppData, commitGreenLiving } from './src/database';

const green = '#56b564';
const forest = { uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&auto=format&fit=crop&q=80' };
const plants = { uri: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&auto=format&fit=crop&q=80' };
function Button({ children, onPress, style, label, disabled = false }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [style, (pressed || disabled) && { opacity: 0.65 }]}>{children}</Pressable>;
}
function Icon({ name, color = '#467e40', size = 22 }) { return <Ionicons name={name} size={size} color={color} />; }
function GreenLife() {
  const [page, setPage] = useState('home');
  const [modal, setModal] = useState(null);
  const [saved, setSaved] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);
    loadAppData().then(data => {
      if (active) { setGroups(data.groups); setSaved(data.saved); }
    }).catch(error => {
      console.error('SQLite load failed:', error);
      if (active) setLoadError(true);
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [retry]);
  async function pledge() {
    if (saving || saved) return;
    setSaving(true);
    try { await commitGreenLiving(); setSaved(true); }
    catch (error) {
      console.error('SQLite save failed:', error);
      Alert.alert('Chưa lưu được cam kết', 'Vui lòng thử lại. Cam kết chưa được lưu trên điện thoại.');
    } finally { setSaving(false); }
  }
  const group = groups.find(g => g.id === page);
  const go = id => { setModal(null); setPage(id); };
  const choose = () => setModal({ title: 'Chọn nhóm rác', categories: true });
  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (modal) { setModal(null); return true; }
      if (page !== 'home') { setPage('home'); return true; }
      return false;
    });
    return () => listener.remove();
  }, [page, modal]);
  if (loading || loadError) return <SafeAreaView style={[s.safe, { backgroundColor: '#fffef9', justifyContent: 'center', padding: 28 }]}><StatusBar style="dark" />{loading ? <><ActivityIndicator size="large" color={green} /><Text style={[s.modalBody, { textAlign: 'center', marginTop: 15 }]}>Đang tải dữ liệu GreenLife…</Text></> : <><Text style={s.modalTitle}>Chưa tải được dữ liệu</Text><Text style={s.modalBody}>Hãy thử lại. Dữ liệu hiện có trên điện thoại sẽ được giữ nguyên.</Text><Button style={s.primary} onPress={() => setRetry(value => value + 1)}><Text style={s.whiteButtonText}>Thử lại</Text></Button></>}</SafeAreaView>;
  const categoryButtons = (list = false) => <View style={list ? s.categoryList : s.categoryRow}>{groups.map((g, i) => <Button key={g.id} label={`Xem nhóm ${g.label}`} onPress={() => go(g.id)} style={list ? s.categoryListItem : s.category}><View style={[s.categoryCircle, { backgroundColor: ['#fff2b8', '#ffd4de', '#c7f0fc', '#dbf5ce'][i] }]}><Text style={s.categoryEmoji}>{g.emoji}</Text></View><Text style={s.categoryLabel}>{g.label}</Text>{list && <Icon name="chevron-forward" />}</Button>)}</View>;
  return <SafeAreaView style={[s.safe, { backgroundColor: group ? green : '#fffef9' }]} edges={['top', 'left', 'right']}>
    <StatusBar style={group ? 'light' : 'dark'} />
    <View style={s.app}>
      {group && <View style={s.header}><Button label="Trở về trang chủ" onPress={() => go('home')} style={s.back}><Icon name="chevron-back" color="white" /></Button><Text style={s.headerTitle}>{group.title}</Text></View>}
      <ScrollView key={page} style={s.scroll} contentContainerStyle={group ? s.detailContent : s.homeContent} showsVerticalScrollIndicator={false}>
        {group ? <>
          {group.items.map(([name, time, emoji, progress]) => <View key={name} style={s.card}><Text style={s.materialEmoji}>{emoji}</Text><View style={s.cardCopy}><Text style={s.cardTitle}>{name}</Text><Text style={s.cardTime}>{time}</Text><View style={s.track}><View style={[s.progress, { width: `${progress}%` }]} /></View></View></View>)}
          <View style={s.notes}><Text style={s.noteTitle}>🌿 {group.noteTitle}</Text>{group.notes.map(note => <Text key={note} style={s.note}>• {note}</Text>)}<Text style={s.footnote}>Thời gian phân hủy mang tính tham khảo và phụ thuộc điều kiện môi trường.</Text></View>
          <Button style={[s.collect, { backgroundColor: group.color }]} onPress={() => setModal({ title: `Tìm hiểu về ${group.label}`, body: 'Phân loại riêng, giữ khô và đóng gói gọn trước khi mang đến điểm thu gom. Không tự đốt hoặc chôn lấp. Liên hệ điểm thu gom tại địa phương để xác nhận loại rác được tiếp nhận.' })}><Icon name="information-circle-outline" color="white" size={19} /><Text style={s.whiteButtonText}>Tìm hiểu về {group.label}</Text></Button>
        </> : <>
          <View style={s.profile}><View style={s.avatar}><Text style={{ fontSize: 29 }}>🌍</Text></View><View style={{ flex: 1 }}><Text style={s.small}>Chào buổi sáng,</Text><Text style={s.profileName}>Hi, Hoàng</Text></View><Button style={s.points} onPress={() => setModal({ title: 'Điểm xanh của bạn', body: 'Bạn có 0 điểm xanh. Hãy bắt đầu phân loại rác và tham gia các hoạt động thu gom để xây dựng thói quen sống xanh.' })}><Text style={s.pointsText}>🌱 0 điểm</Text></Button><Button label="Thông báo" style={s.iconButton} onPress={() => setModal({ title: 'Thông báo', body: 'Chào mừng bạn đến GreenLife! Khám phá 4 nhóm rác để bắt đầu phân loại đúng ngay hôm nay.' })}><Icon name="notifications-outline" /></Button></View>
          <View style={s.hero}><View style={s.heroText}><Text style={s.eyebrow}>SỐNG XANH MỖI NGÀY</Text><Text style={s.headline}>Phân loại hôm nay,{ '\n' }<Text style={{ color: '#579c30' }}>Xanh mãi</Text>{'\n'}ngày mai</Text><Text style={s.intro}>Phân loại rác đúng cách.{'\n'}Góp một chút xanh cho đời.</Text><Text style={s.leaves}>🌿 ♻️ 🌱</Text><Button style={s.discover} onPress={() => go('plastic')}><Text style={s.whiteButtonText}>Khám phá ngay ↗</Text></Button></View><View style={s.photos}><Image accessibilityLabel="Cây xanh" source={plants} style={s.plants} /><Image accessibilityLabel="Rừng xanh" source={forest} style={s.forest} /><View style={s.leafBadge}><Icon name="leaf-outline" size={26} /></View></View></View>
          <View style={s.sectionHeading}><Text style={s.noteTitle}>Rác cần phân loại</Text><Button onPress={choose} style={s.iconButton}><Text style={s.all}>Tất cả ↗</Text></Button></View>
          {categoryButtons()}
          <Button style={s.campaign} onPress={() => setModal({ title: 'Sống xanh từ những điều nhỏ', body: 'Mang theo bình nước cá nhân, dùng túi vải khi mua sắm và phân loại rác tại nhà. Chọn một thói quen nhỏ và thực hiện mỗi ngày!', pledge: true })}><ImageBackground source={forest} style={s.campaignImage}><View style={s.campaignShade}><Text style={s.campaignTag}>GREENLIFE CHALLENGE</Text><Text style={s.healing}>Healing</Text><Text style={s.campaignCaption}>Bảo vệ môi trường • Kiến tạo tương lai</Text><Text style={s.campaignLink}>Bắt đầu từ bạn ↗</Text></View></ImageBackground></Button>
          <View style={s.tip}><Icon name="leaf-outline" /><Text style={s.tipText}><Text style={{ fontWeight: '700' }}>Bạn có biết?{'\n'}</Text>Một chai nhựa có thể mất đến 500 năm để phân hủy.</Text></View>
        </>}
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={s.bottomSafe}><View style={s.nav}>
        <NavButton icon="home-outline" label="Trang chủ" active={!group} onPress={() => go('home')} />
        <NavButton icon="book-outline" label="Phân loại" active={!!group} onPress={choose} />
        <Button label="Hướng dẫn nhận diện rác" style={s.scan} onPress={() => setModal({ title: 'Nhận diện rác', body: 'Quan sát ký hiệu trên bao bì: số 1 là PET, số 2 là HDPE, số 3 là PVC, số 4 là LDPE và số 5 là PP. Chọn nhóm rác để xem hướng dẫn.', categories: true })}><Icon name="scan-outline" size={30} /></Button>
        <NavButton icon="storefront-outline" label="Thu gom" onPress={() => setModal({ title: 'Điểm thu gom', body: 'Liên hệ đơn vị vệ sinh môi trường hoặc điểm thu hồi tại địa phương. Với pin và rác y tế, hãy chọn đơn vị có chức năng xử lý chuyên biệt.' })} />
        <NavButton icon="person-outline" label="Cá nhân" onPress={() => setModal({ title: 'Xin chào, Hoàng!', body: saved ? 'Bạn đã cam kết sống xanh. Cảm ơn bạn đã bắt đầu từ những hành động nhỏ!' : 'Cùng xây dựng thói quen phân loại rác mỗi ngày. Hãy tham gia thử thách ở trang chủ nhé.' })} />
      </View></SafeAreaView>
    </View>
    <Modal visible={!!modal} transparent animationType="fade" onRequestClose={() => setModal(null)}><SafeAreaView style={s.modalOverlay}><Pressable accessibilityLabel="Đóng hộp thoại" onPress={() => setModal(null)} style={StyleSheet.absoluteFill} /><View style={s.modal} accessibilityViewIsModal><ScrollView contentContainerStyle={s.modalContent}><View style={s.modalTop}><Icon name="leaf-outline" size={30} /><Button label="Đóng" onPress={() => setModal(null)} style={s.iconButton}><Icon name="close" /></Button></View><Text style={s.modalTitle}>{modal?.title}</Text>{modal?.body && <Text style={s.modalBody}>{modal.body}</Text>}{modal?.categories && categoryButtons(true)}{modal?.pledge && <Button style={s.primary} disabled={saving || saved} onPress={pledge}><Text style={s.whiteButtonText}>{saved ? '✓ Đã cam kết sống xanh' : 'Tôi cam kết sống xanh'}</Text></Button>}<Button style={s.primary} onPress={() => setModal(null)}><Text style={s.whiteButtonText}>Đã hiểu</Text></Button></ScrollView></View></SafeAreaView></Modal>
  </SafeAreaView>;
}
function NavButton({ icon, label, onPress, active }) { return <Button label={label} onPress={onPress} style={[s.navItem, active && s.navActive]}><Icon name={icon} color="#f1ffe8" /><Text style={s.navLabel}>{label}</Text></Button>; }
export default function App() { return <SafeAreaProvider><GreenLife /></SafeAreaProvider>; }

const s = StyleSheet.create({
  safe: { flex: 1 }, app: { flex: 1, backgroundColor: '#fffef9', width: '100%', maxWidth: 600, alignSelf: 'center' }, scroll: { flex: 1 },
  homeContent: { padding: 22, paddingBottom: 28 }, detailContent: { padding: 18, paddingBottom: 35, gap: 13, flexGrow: 1 },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: green, paddingHorizontal: 8, paddingVertical: 12 }, back: { padding: 10 }, headerTitle: { color: 'white', fontSize: 17, fontWeight: '700', flex: 1, paddingRight: 12 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 28 }, avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#eef5db', borderWidth: 2, borderColor: '#a9d2a2', alignItems: 'center', justifyContent: 'center' }, small: { color: '#819179', fontSize: 10 }, profileName: { color: '#203725', fontWeight: '700', fontSize: 13, marginTop: 4 }, points: { backgroundColor: '#568e39', borderRadius: 20, padding: 8 }, pointsText: { color: 'white', fontSize: 10 }, iconButton: { padding: 10, minHeight: 44, justifyContent: 'center' },
  hero: { flexDirection: 'row', marginBottom: 20 }, heroText: { width: '62%', zIndex: 1 }, eyebrow: { color: '#819179', fontSize: 8, letterSpacing: 1.1, marginBottom: 12 }, headline: { fontSize: 27, lineHeight: 33, fontWeight: '800', letterSpacing: -0.8, color: '#253928' }, intro: { fontSize: 11, lineHeight: 19, color: '#7e8878', marginTop: 14 }, leaves: { fontSize: 22, marginVertical: 13 }, discover: { backgroundColor: green, borderRadius: 22, padding: 12, alignSelf: 'flex-start' }, whiteButtonText: { color: 'white', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  photos: { flex: 1, minHeight: 240 }, plants: { width: '78%', height: 157, position: 'absolute', left: 0, top: 55, borderTopLeftRadius: 35, borderBottomRightRadius: 35, borderTopRightRadius: 8, borderBottomLeftRadius: 8 }, forest: { width: '70%', height: 112, position: 'absolute', right: 0, top: 7, borderRadius: 14 }, leafBadge: { position: 'absolute', right: 0, bottom: 5, width: 44, height: 44, borderRadius: 22, backgroundColor: '#e9f3d7', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fffef9' },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, all: { color: '#5eae59', fontSize: 11 }, categoryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, marginTop: 10 }, category: { alignItems: 'center', gap: 8, minWidth: 60 }, categoryCircle: { width: 55, height: 55, borderRadius: 28, justifyContent: 'center', alignItems: 'center' }, categoryEmoji: { fontSize: 28 }, categoryLabel: { fontSize: 12, color: '#203725' }, categoryList: { gap: 8, marginVertical: 15 }, categoryListItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, backgroundColor: '#edf6e6', padding: 9, borderRadius: 12 },
  campaign: { borderRadius: 16, overflow: 'hidden', backgroundColor: '#305d35' }, campaignImage: { minHeight: 170 }, campaignShade: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#17351a66', padding: 19 }, campaignTag: { color: 'white', fontSize: 8, letterSpacing: 2 }, healing: { color: 'white', fontSize: 44, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', letterSpacing: 4, marginVertical: 6 }, campaignCaption: { color: 'white', fontSize: 11, textAlign: 'center' }, campaignLink: { color: 'white', fontSize: 10, marginTop: 12 }, tip: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 20 }, tipText: { flex: 1, fontSize: 11, lineHeight: 18, color: '#7b9670' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#eff9e8', borderRadius: 10, padding: 14, minHeight: 96, borderBottomWidth: 3, borderBottomColor: '#c3cfbd' }, materialEmoji: { fontSize: 43, width: 70, textAlign: 'center' }, cardCopy: { flex: 1 }, cardTitle: { fontSize: 15, fontWeight: '600', color: '#203725', marginBottom: 6 }, cardTime: { fontSize: 11, color: '#203725', marginBottom: 10 }, track: { backgroundColor: '#e0ecd9', height: 6, borderRadius: 5, overflow: 'hidden' }, progress: { backgroundColor: '#64bc6a', height: 6, borderRadius: 5 }, notes: { marginTop: 8, marginBottom: 12 }, noteTitle: { fontSize: 14, fontWeight: '700', color: '#203725', marginBottom: 6 }, note: { color: '#203725', fontSize: 12, lineHeight: 19, marginBottom: 3 }, footnote: { color: '#82917e', fontSize: 10, lineHeight: 16, marginTop: 10 }, collect: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', borderRadius: 25, padding: 13, alignSelf: 'center', marginTop: 'auto' },
  bottomSafe: { backgroundColor: green }, nav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', minHeight: 67, paddingHorizontal: 5, paddingTop: 6 }, navItem: { alignItems: 'center', justifyContent: 'center', minHeight: 49, flex: 1, gap: 4, borderRadius: 15 }, navActive: { backgroundColor: '#438f36' }, navLabel: { color: '#f1ffe8', fontSize: 9 }, scan: { borderRadius: 30, backgroundColor: '#fffef9', width: 56, height: 56, marginHorizontal: 7, marginTop: -24, alignItems: 'center', justifyContent: 'center', borderWidth: 5, borderColor: '#fffef9' },
  modalOverlay: { flex: 1, backgroundColor: '#10281988', alignItems: 'center', justifyContent: 'center', padding: 23 }, modal: { width: '100%', maxWidth: 430, maxHeight: '90%', backgroundColor: '#fffef9', borderRadius: 23, overflow: 'hidden' }, modalContent: { padding: 23 }, modalTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, modalTitle: { fontSize: 21, fontWeight: '700', lineHeight: 29, color: '#203725', marginVertical: 12 }, modalBody: { fontSize: 13, lineHeight: 23, color: '#71806a' }, primary: { backgroundColor: green, padding: 14, borderRadius: 11, marginTop: 14 },
});
