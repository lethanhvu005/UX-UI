import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler } from 'react-native';
import { loadAppState, saveAppState } from './database';

// Điều hướng dạng stack đơn giản, không cần thư viện ngoài.
const NavContext = createContext(null);
export const useNav = () => useContext(NavContext);

export function NavProvider({ initial = 'splash', children }) {
  const [stack, setStack] = useState(() => { const [n, q] = initial.split('?'); return [{ name: n, params: q ? JSON.parse(decodeURIComponent(q)) : {} }]; });
  const go = useCallback((name, params = {}) => setStack(s => [...s, { name, params }]), []);
  const replace = useCallback((name, params = {}) => setStack(s => [...s.slice(0, -1), { name, params }]), []);
  const reset = useCallback((name, params = {}) => setStack(s => {
    // Tab chính: giữ trang chủ ở đáy stack để nút Back quay về trang chủ.
    if (name === 'home') return [{ name, params }];
    return [{ name: 'home', params: {} }, { name, params }];
  }), []);
  const back = useCallback(() => setStack(s => (s.length > 1 ? s.slice(0, -1) : s)), []);
  const route = stack[stack.length - 1];
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length > 1) { back(); return true; }
      return false;
    });
    return () => sub.remove();
  }, [stack.length, back]);
  const value = useMemo(() => ({ route, go, back, replace, reset, depth: stack.length }), [route, go, back, replace, reset, stack.length]);
  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

// Trạng thái người dùng (điểm, yêu thích, lịch sử…) lưu bền trong SQLite.
const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

export const DEFAULT_STATE = {
  points: 180,
  total: 253,
  favorites: ['act1', 'act2', 'act3', 'act4'],
  following: [],
  checkinDay: 0,
  lastCheckin: '',
  reminder: false,
  history: [
    ['29/10/2025', 'Phân loại rác nhựa', 10], ['25/10/2025', 'Phân loại rác giấy', 5],
    ['22/10/2025', 'Phân loại rác nhựa', 15], ['13/10/2025', 'Đổi quà “Chậu cây tái chế”', -80],
    ['08/10/2025', 'Phân loại rác giấy', 15], ['02/10/2025', 'Phân loại rác nhựa', 15],
    ['27/09/2025', 'Phân loại rác giấy', 15], ['21/09/2025', 'Phân loại rác nhựa', 15],
    ['12/09/2025', 'Phân loại rác nhựa', 15], ['05/09/2025', 'Phân loại rác giấy', 15],
  ],
  posts: [],
  user: { name: 'Healing', email: 'vule@gmail.com' },
};

export function StoreProvider({ children }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const loaded = useRef(false);
  useEffect(() => {
    loadAppState().then(saved => { if (saved) setState(s => ({ ...s, ...saved })); })
      .catch(error => console.warn('Không đọc được dữ liệu đã lưu:', error))
      .finally(() => { loaded.current = true; });
  }, []);
  useEffect(() => {
    if (loaded.current) saveAppState(state).catch(error => console.warn('Không lưu được dữ liệu:', error));
  }, [state]);
  const update = useCallback(fn => setState(s => ({ ...s, ...fn(s) })), []);
  const addPoints = useCallback((n, label) => update(s => ({
    points: s.points + n, total: n > 0 ? s.total + n : s.total,
    history: [[today(), label, n], ...s.history],
  })), [update]);
  const toggleFavorite = useCallback(id => update(s => ({
    favorites: s.favorites.includes(id) ? s.favorites.filter(f => f !== id) : [...s.favorites, id],
  })), [update]);
  const value = useMemo(() => ({ ...state, update, addPoints, toggleFavorite }), [state, update, addPoints, toggleFavorite]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

function today() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}
