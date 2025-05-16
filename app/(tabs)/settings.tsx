import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { 
  User, 
  FileText, 
  PaletteIcon, 
  Users, 
  Boxes, 
  CreditCard, 
  DollarSign, 
  HelpCircle,
  ChevronRight
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { getBusiness, saveBusiness } from '@/utils/storage';
import { Business } from '@/types';

export default function SettingsScreen() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadBusiness = async () => {
      const storedBusiness = await getBusiness();
      setBusiness(storedBusiness);
    };
    
    loadBusiness();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, you would actually implement dark mode here
  };

  const settingsSections = [
    {
      title: 'Profile',
      items: [
        {
          icon: <User size={22} color={Colors.primary[600]} />,
          label: 'Business Profile',
          route: '/settings/profile',
          value: business?.name || 'Not set up'
        },
        {
          icon: <FileText size={22} color={Colors.primary[600]} />,
          label: 'Invoice Templates',
          route: '/settings/templates',
          value: '3 templates'
        },
        {
          icon: <PaletteIcon size={22} color={Colors.primary[600]} />,
          label: 'Appearance',
          route: '/settings/appearance',
          toggle: true,
          toggleValue: darkMode,
          toggleAction: toggleDarkMode,
          toggleLabel: 'Dark Mode'
        }
      ]
    },
    {
      title: 'Data',
      items: [
        {
          icon: <Users size={22} color={Colors.primary[600]} />,
          label: 'Client Management',
          route: '/clients',
          value: null
        },
        {
          icon: <Boxes size={22} color={Colors.primary[600]} />,
          label: 'Products & Services',
          route: '/products',
          value: null
        }
      ]
    },
    {
      title: 'Payment',
      items: [
        {
          icon: <CreditCard size={22} color={Colors.primary[600]} />,
          label: 'Payment Methods',
          route: '/settings/payment-methods',
          value: 'Not set up'
        },
        {
          icon: <DollarSign size={22} color={Colors.primary[600]} />,
          label: 'Taxes & Currency',
          route: '/settings/taxes',
          value: business?.currency || 'USD'
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          icon: <HelpCircle size={22} color={Colors.primary[600]} />,
          label: 'Help & Support',
          route: '/settings/help',
          value: null
        }
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Settings</Text>

        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity 
                key={itemIndex}
                style={styles.settingItem}
                onPress={() => item.route ? router.push(item.route) : null}
                disabled={item.toggle}
              >
                <View style={styles.settingIconContainer}>
                  {item.icon}
                </View>
                
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                  
                  <View style={styles.settingValueContainer}>
                    {item.toggle ? (
                      <View style={styles.toggleContainer}>
                        <Text style={styles.toggleLabel}>{item.toggleLabel}</Text>
                        <Switch
                          value={item.toggleValue}
                          onValueChange={item.toggleAction}
                          trackColor={{ false: Colors.neutral[300], true: Colors.primary[500] }}
                          thumbColor={'#FFFFFF'}
                        />
                      </View>
                    ) : (
                      <>
                        {item.value && (
                          <Text style={styles.settingValue}>{item.value}</Text>
                        )}
                        <ChevronRight size={20} color={Colors.neutral[400]} />
                      </>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textTransform: 'uppercase',
    color: Colors.neutral[500],
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[900],
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[500],
    marginRight: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[500],
    marginRight: 12,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[400],
  },
});