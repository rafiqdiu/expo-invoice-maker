import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useRef } from 'react';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import { FileText, Users, Boxes, Settings } from 'lucide-react-native';

export default function CreateScreen() {
  // Create reference to scroll view for smooth scrolling
  const scrollViewRef = useRef<ScrollView>(null);
  
  const navigateTo = (route: string) => {
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Create New</Text>
        <Text style={styles.subtitle}>What would you like to create?</Text>

        <Animated.View entering={FadeInUp.delay(100).duration(400)}>
          <TouchableOpacity 
            style={styles.cardContainer}
            onPress={() => navigateTo('/invoice/create')}
            activeOpacity={0.8}
          >
            <View style={styles.cardIconContainer}>
              <FileText size={24} color={Colors.primary[600]} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>New Invoice</Text>
              <Text style={styles.cardDescription}>
                Create a new invoice for a client with items, taxes, and more
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          <TouchableOpacity 
            style={styles.cardContainer}
            onPress={() => navigateTo('/client/create')}
            activeOpacity={0.8}
          >
            <View style={styles.cardIconContainer}>
              <Users size={24} color={Colors.primary[600]} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>New Client</Text>
              <Text style={styles.cardDescription}>
                Add a new client with contact details and billing information
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
          <TouchableOpacity 
            style={styles.cardContainer}
            onPress={() => navigateTo('/product/create')}
            activeOpacity={0.8}
          >
            <View style={styles.cardIconContainer}>
              <Boxes size={24} color={Colors.primary[600]} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>New Product/Service</Text>
              <Text style={styles.cardDescription}>
                Add a product or service with pricing and description
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <View style={styles.templateSection}>
            <Text style={styles.sectionTitle}>Invoice Templates</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.templatesContainer}
            >
              <TouchableOpacity 
                style={styles.templateCard}
                onPress={() => navigateTo('/settings/templates')}
              >
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg?auto=compress&cs=tinysrgb&w=300' }} 
                  style={styles.templateImage} 
                />
                <Text style={styles.templateName}>Professional</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.templateCard}
                onPress={() => navigateTo('/settings/templates')}
              >
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/6893633/pexels-photo-6893633.jpeg?auto=compress&cs=tinysrgb&w=300' }} 
                  style={styles.templateImage} 
                />
                <Text style={styles.templateName}>Minimal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.templateCard}
                onPress={() => navigateTo('/settings/templates')}
              >
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/7171398/pexels-photo-7171398.jpeg?auto=compress&cs=tinysrgb&w=300' }} 
                  style={styles.templateImage} 
                />
                <Text style={styles.templateName}>Creative</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.templateCard}
                onPress={() => navigateTo('/settings/templates')}
              >
                <View style={styles.moreCover}>
                  <Settings size={24} color="#FFF" />
                  <Text style={styles.moreText}>More</Text>
                </View>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/6476783/pexels-photo-6476783.jpeg?auto=compress&cs=tinysrgb&w=300' }} 
                  style={styles.templateImage} 
                />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Animated.View>
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
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[600],
    marginBottom: 24,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[600],
    lineHeight: 20,
  },
  templateSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
    marginBottom: 16,
  },
  templatesContainer: {
    paddingBottom: 16,
  },
  templateCard: {
    width: 150,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  templateImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  templateName: {
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[800],
  },
  moreCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginTop: 8,
  },
});