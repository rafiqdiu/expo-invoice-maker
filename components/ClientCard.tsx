import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Client } from '@/types';
import Colors from '@/constants/Colors';
import { Mail, Phone } from 'lucide-react-native';

type ClientCardProps = {
  client: Client;
};

export default function ClientCard({ client }: ClientCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => router.push(`/client/${client.id}`)}
    >
      <View style={styles.content}>
        <View style={styles.initialsCircle}>
          <Text style={styles.initials}>
            {client.name
              .split(' ')
              .map(word => word[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.details}>
          <Text style={styles.name}>{client.name}</Text>
          {client.company && (
            <Text style={styles.company}>{client.company}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.contactInfo}>
        {client.email && (
          <View style={styles.contactItem}>
            <Mail size={14} color={Colors.neutral[500]} />
            <Text style={styles.contactText}>{client.email}</Text>
          </View>
        )}
        
        {client.phone && (
          <View style={styles.contactItem}>
            <Phone size={14} color={Colors.neutral[500]} />
            <Text style={styles.contactText}>{client.phone}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  initialsCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  initials: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.primary[700],
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
    marginBottom: 2,
  },
  company: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[600],
  },
  contactInfo: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    paddingTop: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[700],
    marginLeft: 8,
  },
});