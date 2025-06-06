import StorageHelper from '@/services/storageHelper';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

// Subscription plan types
export type PlanType = 'free' | 'monthly' | 'yearly';

// Subscription state
export type Subscription = {
  planType: PlanType;
  startDate: number; // timestamp
  expiryDate: number; // timestamp
  tokenUsage: number;
  tokenLimit: number;
  isActive: boolean;
  trialEndsAt: number | null; // timestamp or null if trial ended
  paymentDetails?: {
    cardLast4: string;
    cardBrand: string;
    expiryMonth: number;
    expiryYear: number;
  };
};

// Subscription context type
type SubscriptionContextType = {
  subscription: Subscription | null;
  isLoading: boolean;
  activateTrial: () => Promise<boolean>;
  subscribeToPlan: (planType: PlanType, paymentDetails?: any) => Promise<boolean>;
  cancelSubscription: () => Promise<boolean>;
  getRemainingTrialDays: () => number;
  getPlanPrice: (planType: PlanType) => number;
  isTokenLimitReached: () => boolean;
  useToken: (count: number | { usage?: { total_tokens?: number } }) => boolean;
  resetTokenUsage: () => void;
  isInTrial: () => boolean;
  getPlanDetails: (planType: PlanType) => {
    tokenLimit: number;
    priceMonthly: number;
    priceYearly: number;
    name: string;
  };
};

// Plan details and pricing
export const PLAN_DETAILS = {
  free: {
    tokenLimit: 15000,//15000
    priceMonthly: 0,
    priceYearly: 0, 
    name: 'Free'
  },
  monthly: {
    tokenLimit: 1000000,
    priceMonthly: 1.99,
    priceYearly: 0, // Not applicable
    name: 'Monthly'
  },
  yearly: {
    tokenLimit: 15000000,
    priceMonthly: 0, // Not applicable
    priceYearly: 12.99,
    name: 'Yearly'
  }
};

// Trial period in days
const TRIAL_PERIOD_DAYS = 14;

// Storage key
const SUBSCRIPTION_STORAGE_KEY = 'simpletext_subscription';

// Create context
const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Subscription provider props
type SubscriptionProviderProps = {
  children: React.ReactNode;
};

// Provider component
export const SubscriptionProvider = ({ children }: SubscriptionProviderProps) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Initialize a default subscription (free plan)
  const initDefaultSubscription = (): Subscription => {
    const now = Date.now();
    const trialEnd = now + (TRIAL_PERIOD_DAYS * 24 * 60 * 60 * 1000); // 14 days from now
    
    return {
      planType: 'free',
      startDate: now,
      expiryDate: 0, // No expiry for free
      tokenUsage: 0,
      tokenLimit: PLAN_DETAILS.free.tokenLimit,
      isActive: true,
      trialEndsAt: trialEnd
    };
  };

  // Load subscription from storage on user login
  useEffect(() => {
    const loadSubscription = async () => {
      if (!user) {
        setSubscription(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const key = `${SUBSCRIPTION_STORAGE_KEY}_${user.id}`;
        const storedSubscription = await StorageHelper.getItem(key);
        
        if (storedSubscription) {
          const parsedSubscription = JSON.parse(storedSubscription);
          setSubscription(parsedSubscription);
        } else {
          // Create a default subscription for new users
          const defaultSubscription = initDefaultSubscription();
          setSubscription(defaultSubscription);
          await StorageHelper.setItem(key, JSON.stringify(defaultSubscription));
        }
      } catch (error) {
        console.error('Failed to load subscription:', error);
        setSubscription(initDefaultSubscription());
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscription();
  }, [user]);

  // Save subscription to storage whenever it changes
  useEffect(() => {
    const saveSubscription = async () => {
      if (!user || !subscription) return;

      try {
        const key = `${SUBSCRIPTION_STORAGE_KEY}_${user.id}`;
        await StorageHelper.setItem(key, JSON.stringify(subscription));
      } catch (error) {
        console.error('Failed to save subscription:', error);
      }
    };

    saveSubscription();
  }, [subscription, user]);

  // Calculate remaining trial days
  const getRemainingTrialDays = (): number => {
    if (!subscription || !subscription.trialEndsAt) return 0;

    const now = Date.now();
    const diff = subscription.trialEndsAt - now;
    
    // If trial has expired
    if (diff <= 0) return 0;
    
    // Convert ms to days
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Check if user is in trial period
  const isInTrial = (): boolean => {
    return getRemainingTrialDays() > 0;
  };

  // Activate trial
  const activateTrial = async (): Promise<boolean> => {
    try {
      const now = Date.now();
      const trialEnd = now + (TRIAL_PERIOD_DAYS * 24 * 60 * 60 * 1000);
      
      setSubscription(prev => {
        if (!prev) return initDefaultSubscription();
        
        return {
          ...prev,
          trialEndsAt: trialEnd
        };
      });
      
      return true;
    } catch (error) {
      console.error('Failed to activate trial:', error);
      return false;
    }
  };

  // Subscribe to a plan
  const subscribeToPlan = async (planType: PlanType, paymentDetails?: any): Promise<boolean> => {
    try {
      // In a real app, this would make API calls to a payment processor
      // and verify the payment was successful before updating subscription
      
      const now = Date.now();
      let expiryDate: number;
      
      if (planType === 'monthly') {
        // Set expiry to 1 month from now
        expiryDate = now + (30 * 24 * 60 * 60 * 1000);
      } else if (planType === 'yearly') {
        // Set expiry to 1 year from now
        expiryDate = now + (365 * 24 * 60 * 60 * 1000);
      } else {
        // Free plan has no expiry
        expiryDate = 0;
      }
      
      setSubscription(prev => {
        if (!prev) return initDefaultSubscription();
        
        return {
          ...prev,
          planType,
          startDate: now,
          expiryDate,
          tokenLimit: PLAN_DETAILS[planType].tokenLimit,
          isActive: true,
          tokenUsage: 0, // Reset token usage on new subscription
          paymentDetails: paymentDetails ? {
            cardLast4: paymentDetails.cardLast4 || '1234',
            cardBrand: paymentDetails.cardBrand || 'Visa',
            expiryMonth: paymentDetails.expiryMonth || 12,
            expiryYear: paymentDetails.expiryYear || 2025
          } : undefined
        };
      });
      
      return true;
    } catch (error) {
      console.error('Failed to subscribe to plan:', error);
      return false;
    }
  };

  // Cancel subscription
  const cancelSubscription = async (): Promise<boolean> => {
    try {
      // In a real app, this would make API calls to cancel recurring payments
      
      setSubscription(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          planType: 'free',
          expiryDate: 0,
          tokenLimit: PLAN_DETAILS.free.tokenLimit,
          isActive: true,
          paymentDetails: undefined
        };
      });
      
      return true;
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      return false;
    }
  };

  // Get plan price
  const getPlanPrice = (planType: PlanType): number => {
    if (planType === 'monthly') {
      return PLAN_DETAILS.monthly.priceMonthly;
    } else if (planType === 'yearly') {
      return PLAN_DETAILS.yearly.priceYearly;
    }
    return 0; // Free plan
  };

  // Get plan details
  const getPlanDetails = (planType: PlanType) => {
    return PLAN_DETAILS[planType];
  };

  // Check if token limit is reached
  const isTokenLimitReached = (): boolean => {
    if (!subscription) return true;
    return subscription.tokenUsage >= subscription.tokenLimit;
  };

  // Use tokens
  const useToken = (count: number | { usage?: { total_tokens?: number } }): boolean => {
    if (!subscription) return false;
    
    try {
      // Check if we're getting a usage object from API
      let tokenCount = 0;
      
      if (typeof count === 'object' && count.usage && typeof count.usage.total_tokens === 'number') {
        tokenCount = count.usage.total_tokens;
        console.log('Using token count from usage object:', tokenCount);
      } else if (typeof count === 'number') {
        tokenCount = count;
        console.log('Using direct token count:', tokenCount);
      } else {
        console.log('Invalid token count format:', count);
      }
      
      // Don't track token usage for paid plans
      if (subscription.planType !== 'free') {
        console.log('Skipping token tracking for paid plan:', subscription.planType);
        return true;
      }
      
      const newUsage = subscription.tokenUsage + tokenCount;
      console.log(`Updating token usage: ${subscription.tokenUsage} + ${tokenCount} = ${newUsage}`);
      
      // Check if token limit is reached
      if (newUsage > subscription.tokenLimit) {
        console.log('Token limit reached:', newUsage, '>', subscription.tokenLimit);
        return false;
      }
      
      // Update token usage
      setSubscription(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          tokenUsage: newUsage
        };
      });
      
      return true;
    } catch (error) {
      console.error('Error using tokens:', error);
      return false;
    }
  };

  // Reset token usage (e.g., when starting a new billing cycle)
  const resetTokenUsage = () => {
    setSubscription(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        tokenUsage: 0
      };
    });
  };

  // Context value
  const value = {
    subscription,
    isLoading,
    activateTrial,
    subscribeToPlan,
    cancelSubscription,
    getRemainingTrialDays,
    getPlanPrice,
    isTokenLimitReached,
    useToken,
    resetTokenUsage,
    isInTrial,
    getPlanDetails
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

// Hook for using subscription context
export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  
  return context;
}; 