import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export default function UserProfileScreen() {
  // Get the id parameter from the route
  const { id } = useLocalSearchParams<{ id: string }>();

  // Mock user data - in a real app, you would fetch this from an API
  const userData = {
    id: id,
    name: `User ${id}`,
    email: `user${id}@example.com`,
    joinDate: "January 2023",
    bio: "This is a sample user profile for demonstration purposes.",
    avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
    stats: {
      posts: 42,
      followers: 256,
      following: 128,
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: userData.avatar }} 
          style={styles.avatar} 
          resizeMode="cover"
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.email}>{userData.email}</Text>
          <Text style={styles.joinDate}>Member since {userData.joinDate}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userData.stats.posts}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userData.stats.followers}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userData.stats.following}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      <View style={styles.bioContainer}>
        <Text style={styles.bioHeader}>About</Text>
        <Text style={styles.bioText}>{userData.bio}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <View style={styles.actionButton}>
          <FontAwesome name="envelope" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Message</Text>
        </View>
        <View style={styles.actionButton}>
          <FontAwesome name="user-plus" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Follow</Text>
        </View>
        <View style={styles.actionButton}>
          <FontAwesome name="share" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Share</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  joinDate: {
    fontSize: 14,
    color: "#999",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 25,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  bioContainer: {
    marginBottom: 25,
  },
  bioHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bioText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9ff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 16,
    color: "#007AFF",
    marginLeft: 8,
  },
}); 