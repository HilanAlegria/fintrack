import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../src/store/appStore';
import { Colors } from '../../src/constants/tokens';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  name: string;
  title: string;
  icon: IoniconsName;
  iconFocused: IoniconsName;
}

const TABS: TabConfig[] = [
  { name: 'index', title: 'Inicio', icon: 'grid-outline', iconFocused: 'grid' },
  { name: 'expenses', title: 'Gastos', icon: 'alert-circle-outline', iconFocused: 'alert-circle' },
  { name: 'portfolio', title: 'Cartera', icon: 'trending-up-outline', iconFocused: 'trending-up' },
  { name: 'reports', title: 'Reportes', icon: 'document-text-outline', iconFocused: 'document-text' },
];

export default function TabLayout() {
  const isDarkMode = useAppStore((s) => s.isDarkMode);

  const tabBarBg = isDarkMode ? '#0D1117' : '#FFFFFF';
  const borderColor = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const inactiveColor = isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.brand,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopColor: borderColor,
          borderTopWidth: 0.5,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 2,
        },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? tab.iconFocused : tab.icon}
                size={22}
                color={color}
              />
            ),
          }}
        />
      ))}

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          href: '/(tabs)/profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
