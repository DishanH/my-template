import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import contexts
import { useSettings } from '@/context/SettingsContext';
import { PlanType, useSubscription } from '@/context/SubscriptionContext';

// Credit card input component
const CreditCardInput = ({ 
  colors, 
  fontSize, 
  onCardDetailsChange 
}: { 
  colors: any, 
  fontSize: any, 
  onCardDetailsChange: (details: any) => void 
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');

  // Format card number with spaces
  const formatCardNumber = (text: string) => {
    // Remove spaces and non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add space every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    
    // Pass card details to parent
    onCardDetailsChange({
      cardNumber: cleaned,
      cardName,
      expiryMonth,
      expiryYear,
      cvv,
      cardLast4: cleaned.slice(-4),
      cardBrand: getCardBrand(cleaned)
    });
  };

  // Get card brand based on number
  const getCardBrand = (number: string): string => {
    const firstDigit = number.charAt(0);
    const firstTwoDigits = number.substring(0, 2);
    
    if (number.startsWith('4')) return 'Visa';
    if (['51', '52', '53', '54', '55'].includes(firstTwoDigits)) return 'Mastercard';
    if (['34', '37'].includes(firstTwoDigits)) return 'American Express';
    if (['60', '65'].includes(firstTwoDigits)) return 'Discover';
    
    return 'Unknown';
  };

  // Handle expiry date changes
  const handleExpiryMonthChange = (text: string) => {
    // Only allow 01-12
    if (text && (parseInt(text) < 1 || parseInt(text) > 12)) {
      return;
    }
    setExpiryMonth(text);
    onCardDetailsChange({
      cardNumber: cardNumber.replace(/\D/g, ''),
      cardName,
      expiryMonth: text,
      expiryYear,
      cvv,
      cardLast4: cardNumber.replace(/\D/g, '').slice(-4),
      cardBrand: getCardBrand(cardNumber)
    });
  };

  const handleExpiryYearChange = (text: string) => {
    setExpiryYear(text);
    onCardDetailsChange({
      cardNumber: cardNumber.replace(/\D/g, ''),
      cardName,
      expiryMonth,
      expiryYear: text,
      cvv,
      cardLast4: cardNumber.replace(/\D/g, '').slice(-4),
      cardBrand: getCardBrand(cardNumber)
    });
  };

  const handleNameChange = (text: string) => {
    setCardName(text);
    onCardDetailsChange({
      cardNumber: cardNumber.replace(/\D/g, ''),
      cardName: text,
      expiryMonth,
      expiryYear,
      cvv,
      cardLast4: cardNumber.replace(/\D/g, '').slice(-4),
      cardBrand: getCardBrand(cardNumber)
    });
  };

  const handleCvvChange = (text: string) => {
    // Only allow numbers and max 4 digits
    if (text.length > 4 || !/^\d*$/.test(text)) {
      return;
    }
    setCvv(text);
    onCardDetailsChange({
      cardNumber: cardNumber.replace(/\D/g, ''),
      cardName,
      expiryMonth,
      expiryYear,
      cvv: text,
      cardLast4: cardNumber.replace(/\D/g, '').slice(-4),
      cardBrand: getCardBrand(cardNumber)
    });
  };

  return (
    <View style={styles.cardInputContainer}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginBottom: 1 }]}>
        Payment Information
      </Text>
      
      <View style={styles.cardNumberContainer}>
        <View style={[styles.inputWrapper, { borderColor: colors.accent + '30' }]}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            Card Number
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.textPrimary,
                fontSize: fontSize.normal,
              }
            ]}
            value={cardNumber}
            onChangeText={formatCardNumber}
            placeholder="4242 4242 4242 4242"
            placeholderTextColor={colors.textSecondary + '80'}
            keyboardType="number-pad"
            maxLength={19} // 16 digits + 3 spaces
          />
        </View>
      </View>
      
      <View style={[styles.inputWrapper, { borderColor: colors.accent + '30' }]}>
        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
          Cardholder Name
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              fontSize: fontSize.normal,
            }
          ]}
          value={cardName}
          onChangeText={handleNameChange}
          placeholder="John Doe"
          placeholderTextColor={colors.textSecondary + '80'}
        />
      </View>
      
      <View style={styles.cardDetailsRow}>
        <View style={[styles.inputWrapper, { width: '48%', borderColor: colors.accent + '30' }]}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            Expiry Date
          </Text>
          <View style={styles.expiryContainer}>
            <TextInput
              style={[
                styles.input,
                styles.expiryInput,
                {
                  color: colors.textPrimary,
                  fontSize: fontSize.normal,
                }
              ]}
              value={expiryMonth}
              onChangeText={handleExpiryMonthChange}
              placeholder="MM"
              placeholderTextColor={colors.textSecondary + '80'}
              keyboardType="number-pad"
              maxLength={2}
            />
            <Text style={{ color: colors.textPrimary }}>/</Text>
            <TextInput
              style={[
                styles.input,
                styles.expiryInput,
                {
                  color: colors.textPrimary,
                  fontSize: fontSize.normal,
                }
              ]}
              value={expiryYear}
              onChangeText={handleExpiryYearChange}
              placeholder="YY"
              placeholderTextColor={colors.textSecondary + '80'}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
        </View>
        
        <View style={[styles.inputWrapper, { width: '48%', borderColor: colors.accent + '30' }]}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            CVV
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.textPrimary,
                fontSize: fontSize.normal,
              }
            ]}
            value={cvv}
            onChangeText={handleCvvChange}
            placeholder="123"
            placeholderTextColor={colors.textSecondary + '80'}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry={true}
          />
        </View>
      </View>
    </View>
  );
};

// Plan card component
const PlanCard = ({ 
  plan, 
  isSelected, 
  onSelect, 
  colors, 
  fontSize,
  isDarkMode
}: { 
  plan: PlanType, 
  isSelected: boolean, 
  onSelect: () => void, 
  colors: any, 
  fontSize: any,
  isDarkMode: boolean
}) => {
  const { getPlanDetails, isInTrial } = useSubscription();
  const planDetails = getPlanDetails(plan);
  const isTrial = isInTrial();

  // Format token number for display
  const formatTokenNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { 
          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#fff',
          shadowColor: isDarkMode ? '#000' : '#888',
          borderColor: isSelected ? colors.accent : 'transparent',
          borderWidth: isSelected ? 2 : 0,
        }
      ]}
      onPress={onSelect}
    >
      <View style={styles.cardHeader}>
        <View style={styles.planHeader}>
          <Text style={[
            styles.planName,
            { color: colors.textPrimary, fontSize: fontSize.normal * 1.1 }
          ]}>
            {planDetails.name}
          </Text>
          
          {plan === 'yearly' && (
            <View style={[
              styles.savingBadge,
              { backgroundColor: colors.accent }
            ]}>
              <Text style={[
                styles.savingText,
                { color: '#FFF', fontSize: fontSize.small }
              ]}>
                Save 40%
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.planPriceContainer}>
          {plan === 'free' ? (
            <Text style={[
              styles.planPrice,
              { color: colors.textPrimary, fontSize: fontSize.large }
            ]}>
              Free
            </Text>
          ) : plan === 'monthly' ? (
            <View style={styles.priceRow}>
              <Text style={[
                styles.planPrice,
                { color: colors.textPrimary, fontSize: fontSize.large * 1.2 }
              ]}>
                ${planDetails.priceMonthly}
              </Text>
              <Text style={[
                styles.planPeriod,
                { color: colors.textSecondary, fontSize: fontSize.normal }
              ]}>
                /month
              </Text>
            </View>
          ) : (
            <View>
              <View style={styles.priceRow}>
                <Text style={[
                  styles.planPrice,
                  { color: colors.textPrimary, fontSize: fontSize.large * 1.2 }
                ]}>
                  ${planDetails.priceYearly}
                </Text>
                <Text style={[
                  styles.planPeriod,
                  { color: colors.textSecondary, fontSize: fontSize.normal }
                ]}>
                  /year
                </Text>
              </View>
              <Text style={[
                styles.monthlyEquivalent,
                { color: colors.textSecondary, fontSize: fontSize.small }
              ]}>
                Only ${(planDetails.priceYearly / 12).toFixed(2)}/month
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.planFeatures}>
          {plan === 'free' ? (
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
              <Text style={[
                styles.featureText,
                { color: colors.textPrimary, fontSize: fontSize.normal, fontWeight: '500', marginLeft: 8 }
              ]}>
                {formatTokenNumber(planDetails.tokenLimit)} tokens
              </Text>
            </View>
          ) : (
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
              <Text style={[
                styles.featureText,
                { color: colors.textPrimary, fontSize: fontSize.normal, fontWeight: '500', marginLeft: 8 }
              ]}>
                Unlimited tokens
              </Text>
            </View>
          )}
          
          {plan !== 'free' && (
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
              <Text style={[
                styles.featureText,
                { color: colors.textPrimary, fontSize: fontSize.normal, marginLeft: 8 }
              ]}>
                Priority Support
              </Text>
            </View>
          )}
        </View>
        
        {plan === 'free' ? (
          <Text style={[
            styles.currentPlan,
            { color: colors.textSecondary, fontSize: fontSize.small, marginTop: 8 }
          ]}>
            {isTrial ? 'Currently in Trial' : 'Limited Features'}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

// Current subscription component
const CurrentSubscription = ({ colors, fontSize, isDarkMode }: { colors: any, fontSize: any, isDarkMode: boolean }) => {
  const { subscription, getRemainingTrialDays, isInTrial } = useSubscription();
  
  if (!subscription) return null;
  
  const trialDays = getRemainingTrialDays();
  const isTrial = isInTrial();
  
  // Format token number for display
  const formatTokenNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };
  
  // Calculate percentage used
  const usagePercentage = Math.min((subscription.tokenUsage / subscription.tokenLimit) * 100, 100);
  
  return (
    <View style={[
      styles.card,
      { 
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#fff',
        shadowColor: isDarkMode ? '#000' : '#888',
        marginTop: 16,
      }
    ]}>
      <View style={styles.cardHeader}>
        <Ionicons name="card-outline" size={22} color={colors.accent} style={styles.cardIcon} />
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
          Current Subscription
        </Text>
      </View>
      
      <View style={styles.cardContent}>
        {isTrial ? (
          <>
            <Text style={[
              styles.trialInfo,
              { color: colors.textPrimary, fontSize: fontSize.normal }
            ]}>
              Free Trial
            </Text>
            <Text style={[
              styles.trialRemaining,
              { color: colors.textSecondary, fontSize: fontSize.small }
            ]}>
              {formatTokenNumber(subscription.tokenUsage)} / {formatTokenNumber(subscription.tokenLimit)} tokens used
            </Text>
            <View style={[
              styles.progressBar,
              { backgroundColor: colors.textSecondary + '30' }
            ]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: colors.accent,
                    width: `${usagePercentage}%`
                  }
                ]} 
              />
            </View>
            <Text style={[
              styles.trialFooter,
              { color: colors.textSecondary, fontSize: fontSize.small, marginTop: 8 }
            ]}>
              Trial ends in {trialDays} {trialDays === 1 ? 'day' : 'days'}
            </Text>
          </>
        ) : (
          <>
            <Text style={[
              styles.planInfo,
              { color: colors.textPrimary, fontSize: fontSize.normal }
            ]}>
              {subscription.planType.charAt(0).toUpperCase() + subscription.planType.slice(1)} Plan
            </Text>
            
            {subscription.planType === 'free' && (
              <View style={styles.tokenUsage}>
                <Text style={[
                  styles.tokenUsageText,
                  { color: colors.textSecondary, fontSize: fontSize.small }
                ]}>
                  {formatTokenNumber(subscription.tokenUsage)} / {formatTokenNumber(subscription.tokenLimit)} tokens used
                </Text>
                <View style={[
                  styles.progressBar,
                  { backgroundColor: colors.textSecondary + '30' }
                ]}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        backgroundColor: colors.accent,
                        width: `${usagePercentage}%`
                      }
                    ]} 
                  />
                </View>
              </View>
            )}
            
            {subscription.paymentDetails && (
              <View style={styles.paymentDetails}>
                <Text style={[
                  styles.paymentDetailsText,
                  { color: colors.textSecondary, fontSize: fontSize.small }
                ]}>
                  {subscription.paymentDetails.cardBrand} ending in {subscription.paymentDetails.cardLast4}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

// Native payment button component
const NativePaymentButton = ({ 
  colors, 
  fontSize,
  planType,
  onPaymentComplete,
  isDarkMode
}: { 
  colors: any, 
  fontSize: any, 
  planType: PlanType,
  onPaymentComplete: (success: boolean) => void,
  isDarkMode: boolean
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { getPlanDetails } = useSubscription();
  const planDetails = getPlanDetails(planType);
  
  // Generate payment amount text based on selected plan
  const paymentText = planType === 'monthly' 
    ? `$${planDetails.priceMonthly.toFixed(2)} per month` 
    : `$${planDetails.priceYearly.toFixed(2)} per year`;
  
  // Mock function to simulate payment processing
  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      // Simulate success
      onPaymentComplete(true);
      
      // In a real app, you would:
      // 1. Initialize a payment request with correct amount
      // 2. Handle payment authorization
      // 3. Verify the payment with your server
      // 4. Return success/failure
    }, 1500);
  };
  
  return (
    <View style={[
      styles.card,
      { 
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#fff',
        shadowColor: isDarkMode ? '#000' : '#888',
      }
    ]}>
      <View style={styles.cardHeader}>
        <Ionicons 
          name={Platform.OS === 'ios' ? "logo-apple" : "logo-google"}
          size={22} 
          color={colors.accent} 
          style={styles.cardIcon}
        />
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
          Payment Method
        </Text>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={[styles.paymentDescription, { color: colors.textSecondary, marginBottom: 20 }]}>
          Your subscription will be charged to your {Platform.OS === 'ios' ? 'Apple' : 'Google'} account.
        </Text>
        
        <TouchableOpacity
          style={[
            styles.applePayButton,
            { 
              backgroundColor: Platform.OS === 'ios' ? colors.textPrimary : colors.accent,
              shadowColor: colors.textPrimary,
              opacity: isProcessing ? 0.7 : 1
            }
          ]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <View style={styles.nativePayButtonContent}>
              <Ionicons 
                name={Platform.OS === 'ios' ? "logo-apple" : "logo-google"} 
                size={24} 
                color="#FFF" 
              />
              <Text style={styles.nativePayButtonText}>
                Pay with {Platform.OS === 'ios' ? 'Apple Pay' : 'Google Pay'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        
        <Text style={[styles.paymentAmount, { color: colors.textPrimary, marginTop: 12 }]}>
          {paymentText}
        </Text>
        
        <View style={styles.securePaymentNote}>
          <Ionicons name="lock-closed" size={14} color={colors.textSecondary} />
          <Text style={[styles.securePaymentText, { color: colors.textSecondary }]}>
            Secure payment via {Platform.OS === 'ios' ? 'Apple' : 'Google'}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Main component
export default function SubscriptionScreen() {
  const { isDarkMode, colors, fontSize } = useSettings();
  const { 
    subscription, 
    subscribeToPlan, 
    isLoading,
    cancelSubscription,
    isInTrial 
  } = useSubscription();
  const navigation = useNavigation();
  
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  // Animation on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  // Subscribe to a plan
  const handleSubscribe = async () => {
    // For free plan, no payment needed
    if (selectedPlan === 'free') {
      Alert.alert(
        "Downgrade to Free Plan",
        "Are you sure you want to downgrade to the free plan? You&apos;ll lose access to premium features.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Downgrade", 
            style: "destructive",
            onPress: async () => {
              setIsProcessing(true);
              const success = await cancelSubscription();
              setIsProcessing(false);
              
              if (success) {
                Alert.alert("Success", "Your subscription has been updated to the free plan.");
              } else {
                Alert.alert("Error", "Failed to update your subscription. Please try again.");
              }
            }
          }
        ]
      );
      return;
    }
    
    // For paid plans, show payment options
    if (!showPaymentForm) {
      setShowPaymentForm(true);
      return;
    }
  };
  
  // Handle payment completion from native payment
  const handlePaymentComplete = async (success: boolean) => {
    if (success) {
      // Simulate successful subscription with mock payment details
      const mockPaymentDetails = {
        cardLast4: '0000',
        cardBrand: Platform.OS === 'ios' ? 'Apple Pay' : 'Google Pay',
        expiryMonth: 12,
        expiryYear: 2030
      };
      
      const subscriptionSuccess = await subscribeToPlan(selectedPlan, mockPaymentDetails);
      
      if (subscriptionSuccess) {
        Alert.alert(
          "Subscription Successful", 
          `You are now subscribed to the ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} plan.`
        );
        setShowPaymentForm(false);
      } else {
        Alert.alert("Subscription Failed", "There was an error processing your subscription. Please try again.");
      }
    } else {
      Alert.alert("Payment Failed", "The payment was not completed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['left', 'right', 'bottom']} // Don't include top edge to prevent extra space
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
            {/* Current subscription information */}
            <CurrentSubscription colors={colors} fontSize={fontSize} isDarkMode={isDarkMode} />
            
            <Text style={[
              styles.sectionTitle,
              { color: colors.textPrimary, fontSize: fontSize.normal * 1.1, marginTop: 16, marginHorizontal: 16 }
            ]}>
              Choose a Plan
            </Text>
            
            {/* Plan cards */}
            <View style={styles.plansContainer}>
              <PlanCard
                plan="monthly" 
                isSelected={selectedPlan === 'monthly'} 
                onSelect={() => setSelectedPlan('monthly')}
                colors={colors}
                fontSize={fontSize}
                isDarkMode={isDarkMode}
              />
              
              <PlanCard
                plan="yearly" 
                isSelected={selectedPlan === 'yearly'} 
                onSelect={() => setSelectedPlan('yearly')}
                colors={colors}
                fontSize={fontSize}
                isDarkMode={isDarkMode}
              />
              
              <PlanCard 
                plan="free" 
                isSelected={selectedPlan === 'free'} 
                onSelect={() => setSelectedPlan('free')}
                colors={colors}
                fontSize={fontSize}
                isDarkMode={isDarkMode}
              />
            </View>
            
            {/* Native payment UI */}
            {showPaymentForm && selectedPlan !== 'free' && (
              <NativePaymentButton 
                colors={colors}
                fontSize={fontSize}
                planType={selectedPlan}
                onPaymentComplete={handlePaymentComplete}
                isDarkMode={isDarkMode}
              />
            )}
            
            {/* Subscribe button */}
            {!showPaymentForm && (
              <TouchableOpacity
                style={[
                  styles.subscribeButton,
                  { 
                    backgroundColor: selectedPlan === 'free' ? 'rgba(255,59,48,0.1)' : colors.accent,
                    marginHorizontal: 16,
                    marginBottom: 16
                  }
                ]}
                onPress={handleSubscribe}
                disabled={isProcessing}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  {isProcessing ? (
                    <ActivityIndicator size="small" color={selectedPlan === 'free' ? '#FF3B30' : '#FFF'} />
                  ) : (
                    <>
                      <Ionicons 
                        name={selectedPlan === 'free' ? "arrow-down-circle-outline" : "card-outline"} 
                        size={20} 
                        color={selectedPlan === 'free' ? '#FF3B30' : '#FFF'} 
                        style={{ marginRight: 8 }}
                      />
                      <Text style={[
                        styles.subscribeButtonText,
                        { 
                          color: selectedPlan === 'free' ? '#FF3B30' : '#FFF', 
                          fontSize: fontSize.normal,
                          fontWeight: '600'
                        }
                      ]}>
                        {selectedPlan === 'free' 
                          ? 'Downgrade to Free Plan' 
                          : 'Continue to Payment'}
                      </Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            )}
            
            <View style={styles.termsContainer}>
              <Text style={[
                styles.termsText,
                { color: colors.textSecondary, fontSize: fontSize.small, textAlign: 'center' }
              ]}>
                By subscribing, you agree to our Terms of Service and Privacy Policy. 
                Subscriptions automatically renew unless auto-renew is turned off at least 24 hours 
                before the end of the current period.
              </Text>
            </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    marginTop: 0,
  },
  plansContainer: {
    marginBottom: 24,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  cardIcon: {
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  trialInfo: {
    fontWeight: '600',
    marginBottom: 4,
  },
  trialRemaining: {
    marginBottom: 8,
  },
  trialFooter: {
    marginTop: 8,
  },
  planInfo: {
    fontWeight: '600',
    marginBottom: 4,
  },
  expiryInfo: {
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  tokenUsage: {
    marginTop: 8,
  },
  tokenUsageText: {
    marginBottom: 4,
  },
  paymentDetails: {
    marginTop: 12,
  },
  paymentDetailsText: {
    fontStyle: 'italic',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontWeight: 'bold',
  },
  savingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savingText: {
    fontWeight: 'bold',
  },
  planPriceContainer: {
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  planPrice: {
    fontWeight: 'bold',
  },
  planPeriod: {
    marginLeft: 4,
  },
  monthlyEquivalent: {
    marginTop: 4,
  },
  planFeatures: {
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
  },
  currentPlan: {
    fontStyle: 'italic',
    textAlign: 'center',
  },
  cardInputContainer: {
    marginBottom: 24,
  },
  cardNumberContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  input: {
    padding: 0,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryInput: {
    width: 30,
    textAlign: 'center',
    marginHorizontal: 4,
  },
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  subscribeButtonText: {
    fontWeight: '600',
  },
  termsContainer: {
    marginBottom: 24,
    marginHorizontal: 16,
  },
  termsText: {
    textAlign: 'center',
    lineHeight: 18,
  },
  // Native payment styles
  nativePaymentContainer: {
    marginBottom: 24,
  },
  paymentDescription: {
    lineHeight: 20,
  },
  applePayButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  nativePayButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nativePayButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  paymentAmount: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  securePaymentNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  securePaymentText: {
    fontSize: 12,
    marginLeft: 4,
  },
  paymentFormContainer: {
    marginBottom: 24,
  },
  paymentButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  payButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    padding: 24,
    borderRadius: 12,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    textAlign: 'center',
  },
  doneButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 