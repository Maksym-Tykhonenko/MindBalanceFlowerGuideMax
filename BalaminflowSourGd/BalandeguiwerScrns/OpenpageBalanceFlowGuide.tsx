import { balanceMindFontsFlower } from '../balanceMindFontsFlower';
import balanceBarofBottoms from '../MindDataBalance/balanceBarofBottoms';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlowerGuideTimerAndHome from './FlowerGuideTimerAndHome';
import FlowerBalanceCalendarPage from './FlowerBalanceCalendarPage';
import React, { useState as useMBFGState, useEffect as useMBFGEffect, useRef as useMBFGRef } from 'react';
import GuideBalanceStatPage from './GuideBalanceStatPage';
type BalandeguiwerScrns =
    | 'Balance FLower Meditation Also Is First'
    | 'Guide Mind Balance Calendar Archive'
    | 'Mind Stat Balance Flower GD';

import {
    Keyboard,
    Image as MindBalanceImage,
    TouchableWithoutFeedback as FlowerGuideTouchableWithoutFeedback,
    Text as BalanceGuideText,
    TouchableOpacity as FlowerGuideTouchable,
    Dimensions as MindBalanceDimensions,
    SafeAreaView as FlowerGuideSafeArea,
    View as MindBalanceView,
    Platform,
    Animated as MBFGAnimated, // <-- added Animated
} from 'react-native';

const { width: MBFGScreenWidth, height: MBFGScreenHeight } = MindBalanceDimensions.get('window');

const OpenpageBalanceFlowGuide: React.FC = () => {
    const [currentMBFGScreen, setCurrentMBFGScreen] = useMBFGState<BalandeguiwerScrns>('Balance FLower Meditation Also Is First');

    const renderMBFGScreen = () => {
        switch (currentMBFGScreen) {
            case 'Balance FLower Meditation Also Is First':
                return <FlowerGuideTimerAndHome />;
            case 'Guide Mind Balance Calendar Archive':
                return <FlowerBalanceCalendarPage />;
            case 'Mind Stat Balance Flower GD':
                return <GuideBalanceStatPage />;
            default:
                return null;
        }
    };

    // Tracking time spent in the app
    const [mbfgStartTime, setMBFGStartTime] = useMBFGState<number | null>(null);

    useMBFGEffect(() => {
        if (mbfgStartTime === null) {
            setMBFGStartTime(Date.now());
        }

        return () => {
            if (mbfgStartTime) {
                const mbfgEndTime = Date.now();
                const mbfgSessionTime = Math.floor((mbfgEndTime - mbfgStartTime) / 1000);

                AsyncStorage.getItem('totalAppTime')
                    .then((stored) => {
                        let prevSeconds = 0;
                        if (stored) {
                            const parts = stored.split(':').map(Number);
                            if (parts.length === 3 && parts.every(n => !isNaN(n))) {
                                prevSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
                            } else if (parts.length === 2 && parts.every(n => !isNaN(n))) {
                                prevSeconds = parts[0] * 3600 + parts[1] * 60;
                            } else if (parts.length === 1 && !isNaN(parts[0])) {
                                prevSeconds = parts[0];
                            }
                        }
                        const newTotalSeconds = prevSeconds + mbfgSessionTime;
                        const hours = Math.floor(newTotalSeconds / 3600);
                        const minutes = Math.floor((newTotalSeconds % 3600) / 60);
                        const seconds = newTotalSeconds % 60;
                        const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                        return AsyncStorage.setItem('totalAppTime', formatted);
                    })
                    .catch(() => {
                        // handle error if needed
                    });
            }
        };
    }, []);

    // --- NEW: animation setup ---
    // create refs with actual Animated.Value instances (not factory functions)
    const transition = useMBFGRef(new MBFGAnimated.Value(1)).current; // 1 = visible
    const petalAnim = useMBFGRef(new MBFGAnimated.Value(0)).current; // decorative petal

    // Navigator that runs animation out -> change screen -> animation in
    const handleNavigate = (to: BalandeguiwerScrns) => {
        // if already on that screen, do a soft pulse
        if (to === currentMBFGScreen) {
            MBFGAnimated.sequence([
                MBFGAnimated.timing(transition, { toValue: 0.95, duration: 180, useNativeDriver: true }),
                MBFGAnimated.timing(transition, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start();
            return;
        }

        MBFGAnimated.timing(transition, { toValue: 0, duration: 280, useNativeDriver: true }).start(() => {
            // show short petal burst
            MBFGAnimated.sequence([
                MBFGAnimated.timing(petalAnim, { toValue: 1, duration: 420, useNativeDriver: true }),
                MBFGAnimated.timing(petalAnim, { toValue: 0, duration: 420, useNativeDriver: true }),
            ]).start();
            // switch screen while hidden
            setCurrentMBFGScreen(to);
            // animate content in
            MBFGAnimated.timing(transition, { toValue: 1, duration: 420, useNativeDriver: true }).start();
        });
    };

    return (
        <FlowerGuideTouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <MindBalanceView
                style={{
                    width: MBFGScreenWidth,
                    height: MBFGScreenHeight,
                    flex: 1,
                }}
            >
                <MindBalanceImage
                    // source={require('../MinguifloerAssts/BalaIMAGEflowedends/balanceBottomZobrazh.png')}
                    source={require('../MinguifloerAssts/BalaIMAGEflowedends/mindBalanceNewGround.png')}
                    style={{
                        width: MBFGScreenWidth,
                        resizeMode: 'cover',
                        position: 'absolute',
                        height: MBFGScreenHeight,
                    }}
                />
                <FlowerGuideSafeArea />
                <FlowerGuideSafeArea style={{
                    justifyContent: 'space-between',
                    width: MBFGScreenWidth * 0.930543,
                    alignSelf: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginTop: Platform.OS === 'android' ? MBFGScreenHeight * 0.031 : 0,
                }}>
                    <BalanceGuideText style={{
                        maxWidth: MBFGScreenWidth * 0.69,
                        color: 'white',
                        fontFamily: balanceMindFontsFlower.flowerMonrratSemiBold,
                        fontSize: MBFGScreenWidth * 0.048,
                    }} numberOfLines={2} adjustsFontSizeToFit>
                        Welcome to Harmony Flower Guide
                    </BalanceGuideText>

                    <MindBalanceImage source={Platform.OS === 'android'
                        ? require('../MinguifloerAssts/BalaIMAGEflowedends/2dayIconOfTop.png')
                        : require('../MinguifloerAssts/BalaIMAGEflowedends/guideHarmonyIcnTop.png')}
                        style={{
                            height: MBFGScreenHeight * 0.08,
                            width: MBFGScreenHeight * 0.08,
                        }} resizeMode='contain' />
                </FlowerGuideSafeArea>

                <FlowerGuideSafeArea />

                {/* Animated container for screen content */}
                <MBFGAnimated.View
                    style={{
                        flex: 1,
                        width: MBFGScreenWidth,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'transparent', // ensure no default background
                        overflow: 'visible',
                        opacity: transition,
                        transform: [
                            {
                                translateY: transition.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0],
                                }),
                            },
                            {
                                scale: transition.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.98, 1],
                                }),
                            },
                        ],
                    }}
                >
                    

                    {/* actual screen */}
                    {renderMBFGScreen()}
                </MBFGAnimated.View>

                <MindBalanceView style={{
                    backgroundColor: '#08301C',
                    borderWidth: MBFGScreenWidth * 0.007,
                    position: 'absolute',
                    width: MBFGScreenWidth * 0.64,
                    height: MBFGScreenHeight * 0.1,
                    borderRadius: MBFGScreenWidth * 0.071,
                    bottom: MBFGScreenHeight * 0.03719,
                    borderColor: '#012802',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    alignSelf: 'center',
                    paddingHorizontal: MBFGScreenWidth * 0.03503457,
                }}>
                    {balanceBarofBottoms.map((mbfgBarItem, mbfgBarIndex) => (
                        <FlowerGuideTouchable key={`mbfgBarItem_${mbfgBarIndex}`} style={{
                            borderBottomWidth: currentMBFGScreen === mbfgBarItem.thaiNavigateTo ? MBFGScreenWidth * 0.008 : 0,
                            borderBottomColor: '#037148',
                            paddingBottom: MBFGScreenHeight * 0.008,
                        }} onPress={() => {
                            // <-- use animated navigator
                            handleNavigate(mbfgBarItem.thaiNavigateTo)
                        }}>
                            <MindBalanceImage
                                source={mbfgBarItem.gfbmIcon}
                                style={{
                                    tintColor: currentMBFGScreen === mbfgBarItem.thaiNavigateTo ? '#FFFFFF' : '#021A0E',
                                    height: MBFGScreenHeight * 0.05,
                                    width: MBFGScreenHeight * 0.05,
                                    resizeMode: 'contain',
                                }}
                            />
                        </FlowerGuideTouchable>
                    ))}
                </MindBalanceView>
            </MindBalanceView>
        </FlowerGuideTouchableWithoutFeedback>
    );
};

export default OpenpageBalanceFlowGuide;