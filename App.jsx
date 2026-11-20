import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavProvider, StoreProvider, useNav } from './src/nav';
import { Splash, Onboarding } from './src/screens/Onboarding';
import { Auth } from './src/screens/Auth';
import { Home } from './src/screens/Home';
import { Category } from './src/screens/Category';
import { Chatbot } from './src/screens/Chatbot';
import { Stats } from './src/screens/Stats';
import { Activity, Favorites } from './src/screens/Activity';
import { News, NewsDetail } from './src/screens/News';
import { MapScreen } from './src/screens/MapScreen';
import { Camera, ScanIntro, ScanResult } from './src/screens/Scan';
import { Handbook, HandbookAll, HandbookItem, HandbookList, WasteGroup } from './src/screens/Handbook';
import { Convert, Gifts, History, Rewards } from './src/screens/Rewards';
import { Achievements, Chat, CommunityNotifications, EditProfile, Messages, Notifications, Profile, Settings } from './src/screens/Profile';
import { Community, CreatePost } from './src/screens/Community';
import { GameLoading, GameLobby, GamePlay, Games } from './src/screens/Games';

// GreenSteps — toàn bộ màn hình từ trang "Final 1" của file Figma UX-UI.
const ROUTES = {
  splash: Splash,
  onboarding: Onboarding,
  login: () => <Auth mode="login" />,
  register: () => <Auth mode="register" />,
  home: Home,
  category: Category,
  chatbot: Chatbot,
  stats: Stats,
  activity: Activity,
  favorites: Favorites,
  news: News,
  newsDetail: NewsDetail,
  map: MapScreen,
  scan: ScanIntro,
  camera: Camera,
  scanResult: ScanResult,
  handbook: Handbook,
  handbookAll: HandbookAll,
  handbookList: HandbookList,
  handbookItem: HandbookItem,
  wasteGroup: WasteGroup,
  rewards: Rewards,
  convert: Convert,
  gifts: Gifts,
  history: History,
  profile: Profile,
  settings: Settings,
  editProfile: EditProfile,
  achievements: Achievements,
  notifications: Notifications,
  communityNotifications: CommunityNotifications,
  messages: Messages,
  chat: Chat,
  community: Community,
  createPost: CreatePost,
  games: Games,
  gameLoading: GameLoading,
  gameLobby: GameLobby,
  gamePlay: GamePlay,
};

function Router() {
  const { route, depth } = useNav();
  const Screen = ROUTES[route.name] ?? Home;
  return <View style={{ flex: 1 }}><Screen key={`${depth}-${route.name}-${JSON.stringify(route.params)}`} /></View>;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <NavProvider initial="splash">
          <Router />
        </NavProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
