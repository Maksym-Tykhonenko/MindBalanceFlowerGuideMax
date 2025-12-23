const MBFG_USER_PROFILE_KEY = 'mbfg_user_profile_mood_data';
const MBFG_FIRST_LAUNCH_KEY = 'mbfg_app_first_launch_flag';
import React, { useEffect as useEffectMindBalance } from 'react';
import { useNavigation as navigationMindBalance } from '@react-navigation/native';
import {
    Image as ImageBalanceMind,
    View as ViewBalanceMind,
    Dimensions as DimensionBalanceMind,
    Platform,
    Animated as BalanceAnimated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MindBalanceFlowerGuideLoading: React.FC = () => {
    const { width: widthBalanceMind, height: heightBalanceMind } = DimensionBalanceMind.get('window');
    const navigationBalanceMind = navigationMindBalance();
    // animated logo value
    const logoAnim = React.useRef(new BalanceAnimated.Value(0)).current;

    useEffectMindBalance(() => {
        let shouldShowOnboardingMindBalance = false;
        const initializeMindBalanceLoading = async () => {
            try {
                const [firstLaunchFlag, userProfileMood] = await Promise.all([
                    AsyncStorage.getItem(MBFG_FIRST_LAUNCH_KEY),
                    AsyncStorage.getItem(MBFG_USER_PROFILE_KEY),
                ]);

                if (!firstLaunchFlag && !userProfileMood) {
                    shouldShowOnboardingMindBalance = true;
                    await AsyncStorage.setItem(MBFG_FIRST_LAUNCH_KEY, 'true');
                }
            } catch (errMindBalance) {
                if (__DEV__) console.warn('MindBalanceFlowerGuideLoading:init', errMindBalance);
            }
            setTimeout(() => {
                navigationBalanceMind.replace(
                    shouldShowOnboardingMindBalance
                        ? 'MindBalanceFlowerGuideOnboarding'
                        : 'OpenpageBalanceFlowGuide'
                );
            }, 4804);
        };

        initializeMindBalanceLoading();
    }, [navigationBalanceMind, widthBalanceMind]);

    // logo breathing animation (loop)
    useEffectMindBalance(() => {
        const loop = BalanceAnimated.loop(
            BalanceAnimated.sequence([
                BalanceAnimated.timing(logoAnim, { toValue: 1, duration: 1600, useNativeDriver: true }),
                BalanceAnimated.timing(logoAnim, { toValue: 0, duration: 1600, useNativeDriver: true }),
            ])
        );
        loop.start();
        return () => loop.stop && loop.stop();
    }, [logoAnim]);

    return (
        <ViewBalanceMind
            style={{
                alignItems: 'center',
                height: heightBalanceMind,
                flex: 1,
                justifyContent: 'center',
                width: widthBalanceMind,
            }}
        >
            <ImageBalanceMind
                style={{
                    width: widthBalanceMind,
                    resizeMode: 'cover',
                    position: 'absolute',
                    height: heightBalanceMind,
                }}
                // source={require('../MinguifloerAssts/BalaIMAGEflowedends/balanceBottomZobrazh.png')}
                source={require('../MinguifloerAssts/BalaIMAGEflowedends/mindBalanceNewGround.png')}
            />

            {/* animated logo */}
            <BalanceAnimated.Image
                source={Platform.OS === 'android'
                    ? require('../MinguifloerAssts/BalaIMAGEflowedends/2dayMindBalanceLogoImage.png')
                    : require('../MinguifloerAssts/BalaIMAGEflowedends/harmonyLoadingImg.png')}
                style={{
                    resizeMode: 'contain',
                    width: widthBalanceMind * 0.91,
                    height: widthBalanceMind * 0.91,
                    transform: [
                        {
                            scale: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.02] })
                        }
                    ],
                    opacity: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }),
                }}
            />
        </ViewBalanceMind>
    );
};
export default MindBalanceFlowerGuideLoading;