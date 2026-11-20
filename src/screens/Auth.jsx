import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { C, z, shadow } from '../theme';
import { Icon, Press, Txt } from '../ui';
import { useNav, useStore } from '../nav';

// Đăng nhập (205:2217) và Đăng ký (205:2423): thẻ trắng trên nền gradient xanh.
export function Auth({ mode = 'login' }) {
  const nav = useNav();
  const store = useStore();
  const isLogin = mode === 'login';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const submit = () => {
    if (!email.trim() || !pass.trim() || (!isLogin && !name.trim())) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ các trường.');
      return;
    }
    if (!isLogin) store.update(() => ({ user: { name: name.trim(), email: email.trim() } }));
    nav.reset('home');
  };
  return (
    <LinearGradient colors={[C.green, '#c1fd67']} style={{ flex: 1 }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: z(40) }} keyboardShouldPersistTaps="handled">
          <View style={s.card}>
            <Txt s={36} w="700" c={C.green} center>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</Txt>
            <View style={s.tabs}>
              <Tab title="Đăng nhập" active={isLogin} onPress={() => !isLogin && nav.replace('login')} />
              <Tab title="Đăng ký" active={!isLogin} onPress={() => isLogin && nav.replace('register')} />
            </View>
            {!isLogin && <Field label="Tên" value={name} onChangeText={setName} />}
            <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <Field label="Mật khẩu" value={pass} onChangeText={setPass} secure={!show}
              right={<Press label="Hiện mật khẩu" onPress={() => setShow(v => !v)}><Icon name={show ? 'eye-outline' : 'eye-off-outline'} size={20} color="#b3b3b3" /></Press>} />
            {isLogin && (
              <View style={s.row}>
                <Press label="Ghi nhớ" onPress={() => setRemember(v => !v)} style={{ flexDirection: 'row', alignItems: 'center', gap: z(8) }}>
                  <View style={s.switchTrack}><View style={[s.switchKnob, remember ? { right: 0, backgroundColor: C.lime } : { left: 0, backgroundColor: '#aaa' }]} /></View>
                  <Txt s={12}>Nhớ</Txt>
                </Press>
                <Press label="Quên mật khẩu" onPress={() => Alert.alert('Quên mật khẩu', 'Liên kết đặt lại mật khẩu sẽ được gửi tới email của bạn.')}>
                  <Txt s={12} c={C.text} style={{ textDecorationLine: 'underline' }}>Quên mật khẩu?</Txt>
                </Press>
              </View>
            )}
            <Press label={isLogin ? 'Đăng nhập' : 'Đăng ký'} onPress={submit} style={[s.primary, !isLogin && { marginTop: z(26) }]}>
              <Txt s={16} c={C.white}>{isLogin ? 'Đăng nhập' : 'Đăng Ký'}</Txt>
            </Press>
            {isLogin && (
              <>
                <View style={s.orRow}>
                  <View style={s.line} /><Txt s={12} c="#c3c3c3">Hoặc</Txt><View style={s.line} />
                </View>
                <Press label="Đăng nhập với Google" onPress={() => nav.reset('home')} style={s.google}>
                  <Icon name="logo-google" size={18} color="#4285F4" />
                  <Txt s={16} c="#141414">Đăng nhập với Google</Txt>
                </Press>
              </>
            )}
            <Press label="Chuyển màn" onPress={() => nav.replace(isLogin ? 'register' : 'login')} style={{ marginTop: z(20), alignSelf: 'center' }}>
              <Txt s={12} w="500">
                {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
                <Txt s={12} w="500" c={C.greenDark} style={{ textDecorationLine: 'underline' }}>{isLogin ? 'Đăng ký ngay.' : 'Đăng nhập ngay'}</Txt>
              </Txt>
            </Press>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

function Tab({ title, active, onPress }) {
  return (
    <Press label={title} onPress={onPress} style={[s.tab, active ? { backgroundColor: C.lime } : { backgroundColor: C.white }]}>
      <Txt s={12} w="500" c={active ? C.white : C.black}>{title}</Txt>
    </Press>
  );
}

function Field({ label, value, onChangeText, secure, right, keyboardType }) {
  return (
    <View style={{ marginTop: z(16) }}>
      <Txt s={14} w="500" style={{ marginBottom: z(7) }}>{label}</Txt>
      <View style={s.input}>
        <TextInput value={value} onChangeText={onChangeText} placeholder="Value" placeholderTextColor={C.greyLight} secureTextEntry={secure}
          autoCapitalize="none" keyboardType={keyboardType} style={{ flex: 1, fontSize: z(14), color: C.black }} />
        {right}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: C.white, borderRadius: z(40), paddingHorizontal: z(38), paddingTop: z(14), paddingBottom: z(26) },
  tabs: { flexDirection: 'row', justifyContent: 'space-between', marginTop: z(14) },
  tab: { width: z(99), height: z(35), borderRadius: z(30), alignItems: 'center', justifyContent: 'center', ...shadow(4, 4, 0.25) },
  input: { flexDirection: 'row', alignItems: 'center', height: z(42), borderRadius: z(10), borderWidth: 1, borderColor: C.greyLight, paddingHorizontal: z(13) },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: z(26) },
  switchTrack: { width: z(37), height: z(15), borderRadius: z(20), backgroundColor: '#d9d9d9' },
  switchKnob: { position: 'absolute', width: z(21), height: z(15), borderRadius: z(20) },
  primary: { marginTop: z(20), height: z(44), borderRadius: z(10), backgroundColor: C.lime, alignItems: 'center', justifyContent: 'center' },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: z(10), marginTop: z(16) },
  line: { flex: 1, height: 1, backgroundColor: C.black },
  google: { marginTop: z(16), height: z(44), borderRadius: z(10), backgroundColor: C.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: z(10), ...shadow(4, 4, 0.25) },
});
