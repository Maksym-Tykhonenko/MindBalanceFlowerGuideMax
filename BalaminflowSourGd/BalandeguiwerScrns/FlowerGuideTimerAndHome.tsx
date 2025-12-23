const { width: blossomWidth, height: blossomHeight } = FLowerDimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import { balanceMindFontsFlower } from '../balanceMindFontsFlower';
const blossomCardRadius = blossomWidth * 0.05;
const blossomButtonFontSize = blossomWidth * 0.05;
const blossomDarkGreen = '#08301C';
const blossomImgSize = blossomWidth * 0.5;
const blossomPadding = blossomWidth * 0.05;
import { View as BlossomTimerView, Text as FLowerText, TouchableOpacity as BalanceMindButton, Image as FLowerImage, Dimensions as FLowerDimensions, Animated as MindAnimated, Share as ShareBlossom } from 'react-native';
const blossomHowToStepFontSize = blossomWidth * 0.04;
const blossomArrowSize = blossomWidth * 0.12;
const blossomTitleFontSize = blossomWidth * 0.07;
const blossomButtonHeight = blossomHeight * 0.07;
const blossomHowToFontSize = blossomWidth * 0.048;
const blossomDescFontSize = blossomWidth * 0.045;
const blossomLightGreen = '#037148';
import React, { useState as useBlossomTimerState, useRef as useBlossomTimerRef, useEffect as useBlossomTimerEffect } from 'react';
import flowerBalancePractics from '../MindDataBalance/flowerBalancePractics';
import Svg, { Circle as MindCircleSvg } from 'react-native-svg';


// Animated refs for gentle floating of selection controls
const useAnimatedLoop = (animRef: any, duration = 2500, toValue = 1, delay = 0) => {
    useBlossomTimerEffect(() => {
        const anim = MindAnimated.loop(
            MindAnimated.sequence([
                MindAnimated.timing(animRef, { toValue, duration: Math.floor(duration / 2), useNativeDriver: true, delay }),
                MindAnimated.timing(animRef, { toValue: 0, duration: Math.floor(duration / 2), useNativeDriver: true }),
            ])
        );
        anim.start();
        return () => anim.stop();
    }, []);
};

const BLOSSOM_TIMER_SECONDS = 300; // 5 хвилин

export default function FLowerGuideTimerAndHome() {
    const [blossomStep, setBlossomStep] = useBlossomTimerState<'choose' | 'instructions' | 'timer' | 'congrats'>('choose');
    const [selectedBlossomIdx, setSelectedBlossomIdx] = useBlossomTimerState(0);
    const [blossomTimer, setBlossomTimer] = useBlossomTimerState(BLOSSOM_TIMER_SECONDS);
    const [isBlossomRunning, setIsBlossomRunning] = useBlossomTimerState(false);
    const [elapsedBlossomSeconds, setElapsedBlossomSeconds] = useBlossomTimerState(0);
    const intervalBlossomRef = useBlossomTimerRef<NodeJS.Timeout | null>(null);
    const selectedBlossomIdxRef = useBlossomTimerRef(0);
    const elapsedBlossomSecondsRef = useBlossomTimerRef(0);

    // --- Animated floats (must be defined before JSX) ---
    const centerFloat = useBlossomTimerRef(new MindAnimated.Value(0)).current;
    const leftFloat = useBlossomTimerRef(new MindAnimated.Value(0)).current;
    const rightFloat = useBlossomTimerRef(new MindAnimated.Value(0)).current;

    // start gentle loops (small offsets for organic motion)
    useAnimatedLoop(centerFloat, 3000, 1, 0);
    useAnimatedLoop(leftFloat, 2600, 1, 180);
    useAnimatedLoop(rightFloat, 2800, 1, 340);
    // --- end animated floats ---

    const blossomPractice = flowerBalancePractics[selectedBlossomIdx];

    const arrowBlossomLeft = require('../MinguifloerAssts/BalaIMAGEflowedends/leftMindArrow.png');
    const arrowBlossomRight = require('../MinguifloerAssts/BalaIMAGEflowedends/balanceRIghtGuide.png');
    const iconBlossomBack = require('../MinguifloerAssts/BalaIMAGEflowedends/arrowBackTimer.png');
    const iconBlossomPause = require('../MinguifloerAssts/BalaIMAGEflowedends/flowerPauseTimer.png');
    const iconBlossomPlay = require('../MinguifloerAssts/BalaIMAGEflowedends/thaiPlayTimer.png');

    // Перетворення секунд у hh:mm:ss
    const secondsToBlossomHms = (sec: number) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
    };

    // Додає два hh:mm:ss
    const addBlossomTimes = (time1: string, time2: string) => {
        const [h1, m1, s1] = time1.split(':').map(Number);
        const [h2, m2, s2] = time2.split(':').map(Number);
        let s = s1 + s2;
        let m = m1 + m2 + Math.floor(s / 60);
        let h = h1 + h2 + Math.floor(m / 60);
        s = s % 60;
        m = m % 60;
        return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
    };

    // Додаємо/оновлюємо статистику в архів
    const addToBlossomArchive = async (practiceIdx: number, seconds: number) => {
        if (seconds === 0) return;
        try {
            const archiveStr = await AsyncStorage.getItem('balanceFlowerMeditationsArchive');
            let blossomArchive = {};
            if (archiveStr) {
                const parsed = JSON.parse(archiveStr);
                if (Array.isArray(parsed)) {
                    blossomArchive = {};
                } else {
                    blossomArchive = parsed;
                }
            }
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${day}`;
            if (!blossomArchive[dateKey]) blossomArchive[dateKey] = {};
            const practiceKey = String(practiceIdx);
            if (!blossomArchive[dateKey][practiceKey]) {
                blossomArchive[dateKey][practiceKey] = { time: secondsToBlossomHms(seconds), approaches: 0 };
            } else {
                blossomArchive[dateKey][practiceKey].time = secondsToBlossomHms(seconds);
            }
            await AsyncStorage.setItem('balanceFlowerMeditationsArchive', JSON.stringify(blossomArchive));
        } catch (e) {}
    };

    // Створити початковий запис при старті
    const createBlossomInitialRecord = async (practiceIdx: number) => {
        try {
            const archiveStr = await AsyncStorage.getItem('balanceFlowerMeditationsArchive');
            let blossomArchive = {};
            if (archiveStr) {
                const parsed = JSON.parse(archiveStr);
                if (Array.isArray(parsed)) {
                    blossomArchive = {};
                } else {
                    blossomArchive = parsed;
                }
            }
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${day}`;
            if (!blossomArchive[dateKey]) blossomArchive[dateKey] = {};
            const practiceKey = String(practiceIdx);
            if (!blossomArchive[dateKey][practiceKey]) {
                blossomArchive[dateKey][practiceKey] = { time: '00:00:00', approaches: 1 };
            } else {
                blossomArchive[dateKey][practiceKey].approaches += 1;
            }
            await AsyncStorage.setItem('balanceFlowerMeditationsArchive', JSON.stringify(blossomArchive));
        } catch (e) {}
    };

    useBlossomTimerEffect(() => {
        elapsedBlossomSecondsRef.current = elapsedBlossomSeconds;
    }, [elapsedBlossomSeconds]);

    useBlossomTimerEffect(() => {
        selectedBlossomIdxRef.current = selectedBlossomIdx;
    }, [selectedBlossomIdx]);

    useBlossomTimerEffect(() => {
        if (blossomStep !== 'timer') {
            if (elapsedBlossomSecondsRef.current > 0) {
                addToBlossomArchive(selectedBlossomIdxRef.current, elapsedBlossomSecondsRef.current);
            }
            return;
        }
        if (isBlossomRunning && blossomTimer > 0) {
            intervalBlossomRef.current = setInterval(() => {
                setBlossomTimer(t => t - 1);
                setElapsedBlossomSeconds(e => {
                    const newElapsed = e + 1;
                    if (newElapsed % 10 === 0) {
                        addToBlossomArchive(selectedBlossomIdxRef.current, newElapsed);
                    }
                    return newElapsed;
                });
            }, 1000);
        } else if (!isBlossomRunning && intervalBlossomRef.current) {
            clearInterval(intervalBlossomRef.current);
            if (elapsedBlossomSecondsRef.current > 0) {
                addToBlossomArchive(selectedBlossomIdxRef.current, elapsedBlossomSecondsRef.current);
            }
        }
        if (blossomTimer === 0 && intervalBlossomRef.current) {
            clearInterval(intervalBlossomRef.current);
            setIsBlossomRunning(false);
            addToBlossomArchive(selectedBlossomIdxRef.current, elapsedBlossomSecondsRef.current);
            setTimeout(() => setBlossomStep('congrats'), 600);
        }
        return () => {
            if (intervalBlossomRef.current) {
                clearInterval(intervalBlossomRef.current);
            }
        };
    }, [isBlossomRunning, blossomTimer, blossomStep]);

    const handleBlossomStart = async () => {
        setBlossomTimer(BLOSSOM_TIMER_SECONDS);
        setElapsedBlossomSeconds(0);
        elapsedBlossomSecondsRef.current = 0;
        setIsBlossomRunning(true);
        setBlossomStep('timer');
        await createBlossomInitialRecord(selectedBlossomIdx);
    };

    const formatBlossomTime = (sec: number) => {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // SVG таймер
    const blossomSize = blossomWidth * 0.65;
    const blossomStrokeWidth = blossomWidth * 0.055;
    const blossomRadius = (blossomSize - blossomStrokeWidth) / 2;
    const blossomCircumference = 2 * Math.PI * blossomRadius;
    const blossomProgress = blossomTimer / BLOSSOM_TIMER_SECONDS;
    const blossomProgressStroke = blossomCircumference * (1 - blossomProgress);

    if (blossomStep === 'timer') {
        return (
            <BlossomTimerView style={{ flex: 1, alignItems: 'center'}}>
                <BlossomTimerView style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: blossomWidth * 0.92,
                    paddingVertical: blossomPadding * 0.6,
                    backgroundColor: blossomDarkGreen,
                    paddingHorizontal: blossomPadding,
                    borderWidth: blossomWidth * 0.00614,
                    borderColor: "#012802",
                    borderRadius: blossomCardRadius,
                    marginTop: blossomHeight * 0.04,
                }}>
                    <FLowerImage
                        source={blossomPractice.flowerImage}
                        style={{
                            resizeMode: 'contain',
                            height: blossomImgSize * 0.6,
                            width: blossomImgSize * 0.6,
                        }}
                    />
                    <FLowerText
                        style={{
                            color: 'white',
                            fontSize: blossomHowToFontSize * 1.12,
                            marginLeft: blossomWidth * 0.08,
                            textAlign: 'center',
                            letterSpacing: 0.2,
                            fontFamily: balanceMindFontsFlower.flowerMonrratSemiBold,
                        }}
                    >
                        {blossomPractice.practiceTitle}
                    </FLowerText>
                </BlossomTimerView>
                <BlossomTimerView style={{
                    marginBottom: blossomHeight * 0.04,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: blossomHeight * 0.04,
                }}>
                    <Svg width={blossomSize} height={blossomSize}>
                        <MindCircleSvg
                            cx={blossomSize / 2}
                            cy={blossomSize / 2}
                            r={blossomRadius}
                            stroke="#062B18"
                            strokeWidth={blossomStrokeWidth}
                            fill="none"
                        />
                        <MindCircleSvg
                            cx={blossomSize / 2}
                            cy={blossomSize / 2}
                            r={blossomRadius}
                            stroke={blossomLightGreen}
                            strokeWidth={blossomStrokeWidth}
                            fill="none"
                            strokeDasharray={`${blossomCircumference},${blossomCircumference}`}
                            strokeDashoffset={blossomProgressStroke}
                            strokeLinecap="round"
                            rotation="-90"
                            origin={`${blossomSize / 2},${blossomSize / 2}`}
                        />
                    </Svg>
                    <FLowerText
                        style={{
                            color: 'white',
                            alignSelf: 'center',
                            textAlign: 'center',
                            fontFamily: balanceMindFontsFlower.flowerMonrratSemiBold,
                            fontSize: blossomWidth * 0.13,
                            position: 'absolute',
                        }}
                    >
                        {formatBlossomTime(blossomTimer)}
                    </FLowerText>
                </BlossomTimerView>
                <BlossomTimerView style={{
                    alignItems: 'center',
                    gap: blossomWidth * 0.08,
                    justifyContent: 'center',
                    flexDirection: 'row',
                }}>
                    <BalanceMindButton
                        style={{
                            justifyContent: 'center',
                            width: blossomWidth * 0.22,
                            backgroundColor: '#2B5C3E',
                            marginHorizontal: blossomWidth * 0.03,
                            borderRadius: blossomWidth * 0.06,
                            alignItems: 'center',
                            height: blossomWidth * 0.22,
                        }}
                        onPress={() => {
                            setIsBlossomRunning(false);
                            if (intervalBlossomRef.current) {
                                clearInterval(intervalBlossomRef.current);
                            }
                            if (elapsedBlossomSecondsRef.current > 0) {
                                addToBlossomArchive(selectedBlossomIdxRef.current, elapsedBlossomSecondsRef.current).then(() => {
                                    setBlossomStep('instructions');
                                });
                            } else {
                                setBlossomStep('instructions');
                            }
                        }}
                        activeOpacity={0.85}
                    >
                        <FLowerImage source={iconBlossomBack} style={{ width: blossomWidth * 0.11, height: blossomWidth * 0.11, resizeMode: 'contain' }} />
                    </BalanceMindButton>
                    <BalanceMindButton
                        style={{
                            marginHorizontal: blossomWidth * 0.03,
                            height: blossomWidth * 0.22,
                            backgroundColor: '#2B5C3E',
                            borderRadius: blossomWidth * 0.06,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: blossomWidth * 0.22,
                        }}
                        onPress={() => {
                            if (blossomTimer === 0) {
                                setIsBlossomRunning(true);
                                createBlossomInitialRecord(selectedBlossomIdx);
                                setElapsedBlossomSeconds(0);
                                setBlossomTimer(BLOSSOM_TIMER_SECONDS);
                            } else {
                                setIsBlossomRunning(prev => !prev);
                            }
                        }}
                        activeOpacity={0.85}
                    >
                        <FLowerImage
                            source={isBlossomRunning ? iconBlossomPause : iconBlossomPlay}
                            style={{ width: blossomWidth * 0.11, height: blossomWidth * 0.11, resizeMode: 'contain' }}
                        />
                    </BalanceMindButton>
                </BlossomTimerView>
            </BlossomTimerView>
        );
    }

    if (blossomStep === 'congrats') {
        return (
            <BlossomTimerView style={{ flex: 1, }}>
                <BlossomTimerView style={{
                    flex: 1,
                    alignItems: 'center',
                }}>
                    <FLowerImage
                        source={require('../MinguifloerAssts/BalaIMAGEflowedends/congratsGirl.png')}
                        style={{
                            width: blossomWidth * 0.7,
                            height: blossomHeight * 0.43,
                            resizeMode: 'contain',
                            marginTop: blossomHeight * 0.04,
                        }}
                    />
                    <BlossomTimerView
                        style={{
                            paddingTop: blossomPadding * 0.8,
                            shadowColor: '#000',
                            backgroundColor: blossomDarkGreen,
                            borderRadius: blossomCardRadius,
                            shadowOpacity: 0.10,
                            alignItems: 'center',
                            borderColor: "#012802",
                            overflow: 'hidden',
                            shadowRadius: 8,
                            borderWidth: blossomWidth * 0.00614,
                            marginTop: -blossomHeight * 0.03,
                            elevation: 4,
                            paddingBottom: 0,
                            width: blossomWidth * 0.92,
                        }}
                    >
                        <FLowerText
                            style={{
                                color: 'white',
                                fontSize: blossomHowToFontSize * 1.1,
                                fontFamily: balanceMindFontsFlower.flowerMonrratSemiBold,
                                marginBottom: blossomHeight * 0.01,
                                textAlign: 'center',
                                letterSpacing: 0.2,
                            }}
                        >
                            Congratulations!
                        </FLowerText>
                        <FLowerText
                            style={{
                                marginBottom: blossomHeight * 0.03,
                                fontFamily: balanceMindFontsFlower.flowerMonrratRegular,
                                letterSpacing: 0.2,
                                color: 'white',
                                textAlign: 'center',
                                fontSize: blossomDescFontSize,
                            }}
                        >
                            You have completed the breathing practice, continue!
                        </FLowerText>
                        <BlossomTimerView style={{
                            justifyContent: 'space-between',
                            marginTop: blossomHeight * 0.01,
                            width: '100%',
                            flexDirection: 'row',
                        }}>
                            <BalanceMindButton
                                style={{
                                    borderTopRightRadius: blossomWidth * 0.08,
                                    justifyContent: 'center',
                                    width: blossomWidth * 0.42,
                                    backgroundColor: blossomLightGreen,
                                    alignItems: 'center',
                                    height: blossomButtonHeight * 0.8,
                                }}
                                onPress={() => setBlossomStep('choose')}
                                activeOpacity={0.85}
                            >
                                <FLowerText
                                    style={{
                                        letterSpacing: 0.5,
                                        color: 'white',
                                        fontSize: blossomButtonFontSize * 0.8,
                                        fontFamily: balanceMindFontsFlower.flowerMonrratSemiBold,
                                    }}
                                >
                                    Back
                                </FLowerText>
                            </BalanceMindButton>
                            <BalanceMindButton
                                style={{
                                    justifyContent: 'center',
                                    height: blossomButtonHeight * 0.8,
                                    backgroundColor: blossomLightGreen,
                                    borderTopLeftRadius: blossomWidth * 0.08,
                                    alignItems: 'center',
                                    width: blossomWidth * 0.42,
                                }}
                                onPress={() => {
                                    ShareBlossom.share({
                                        message: `I just completed the "${blossomPractice.practiceTitle}" breathing practice using the Harmony Flower Guide app! It was a refreshing experience. Give it a try!`
                                    })
                                }}
                                activeOpacity={0.85}
                            >
                                <FLowerText
                                    style={{
                                        letterSpacing: 0.5,
                                        color: 'white',
                                        fontSize: blossomButtonFontSize * 0.8,
                                        fontFamily: balanceMindFontsFlower.flowerMonrratSemiBold,
                                    }}
                                >
                                    Share
                                </FLowerText>
                            </BalanceMindButton>
                        </BlossomTimerView>
                    </BlossomTimerView>
                </BlossomTimerView>
            </BlossomTimerView>
        );
    }

    return (
        <BlossomTimerView style={{ flex: 1, alignItems: 'center', }}>
            {blossomStep === 'choose' ? (
                <>
                    <FLowerText
                        style={{
                            textAlign: 'center',
                            marginTop: blossomHeight * 0.019,
                            fontSize: blossomTitleFontSize,
                            letterSpacing: 0.5,
                            color: 'white',
                            marginBottom: blossomHeight * 0.03,
                            fontFamily: balanceMindFontsFlower.flowerMonrratSemiBold,
                        }}
                    >
                        Choose a practice
                    </FLowerText>
                    <BlossomTimerView
                        style={{
                            marginBottom: blossomHeight * 0.03,
                            alignItems: 'center',
                            flexDirection: 'row',
                        }}
                    >
                        {/* animated left arrow */}
                        <MindAnimated.View
                            style={{
                                transform: [
                                    {
                                        translateY: leftFloat.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, -6],
                                        }),
                                    },
                                    {
                                        rotate: leftFloat.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0deg', '-3deg'],
                                        }),
                                    },
                                ],
                            }}
                        >
                            <BalanceMindButton
                                onPress={() => setSelectedBlossomIdx((prev) => (prev === 0 ? flowerBalancePractics.length - 1 : prev - 1))}
                                style={{
                                    justifyContent: 'center',
                                    height: blossomArrowSize,
                                    alignItems: 'center',
                                    borderRadius: blossomWidth * 0.019,
                                    backgroundColor: blossomLightGreen,
                                    width: blossomArrowSize,
                                }}
                                hitSlop={10}
                            >
                                <FLowerImage source={arrowBlossomLeft} style={{ width: blossomArrowSize * 0.48, height: blossomArrowSize * 0.48, resizeMode: 'contain' }} />
                            </BalanceMindButton>
                        </MindAnimated.View>
                        {/* animated center card */}
                        <MindAnimated.View
                            style={{
                                shadowOpacity: 0.12,
                                height: blossomImgSize,
                                elevation: 6,
                                shadowRadius: 10,
                                backgroundColor: blossomPractice.backColorOfFlower,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginHorizontal: blossomWidth * 0.05,
                                shadowColor: '#000',
                                width: blossomImgSize,
                                borderRadius: blossomWidth * 0.07,
                                transform: [
                                    {
                                        translateY: centerFloat.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, -8], // gentle up movement
                                        }),
                                    },
                                    {
                                        scale: centerFloat.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.995, 1.01], // tiny breathing scale
                                        }),
                                    },
                                ],
                            }}
                        >
                            <FLowerImage
                                source={blossomPractice.flowerImage}
                                style={{
                                    width: blossomImgSize * 0.9,
                                    height: blossomImgSize * 0.9,
                                    resizeMode: 'contain',
                                }}
                            />
                        </MindAnimated.View>
                        {/* animated right arrow */}
                        <MindAnimated.View
                            style={{
                                transform: [
                                    {
                                        translateY: rightFloat.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, -6],
                                        }),
                                    },
                                    {
                                        rotate: rightFloat.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0deg', '3deg'],
                                        }),
                                    },
                                ],
                            }}
                        >
                            <BalanceMindButton
                                onPress={() => setSelectedBlossomIdx((prev) => (prev === flowerBalancePractics.length - 1 ? 0 : prev + 1))}
                                style={{
                                    backgroundColor: blossomLightGreen,
                                    borderRadius: blossomWidth * 0.019,
                                    height: blossomArrowSize,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: blossomArrowSize,
                                }}
                                hitSlop={10}
                            >
                                <FLowerImage source={arrowBlossomRight} style={{ width: blossomArrowSize * 0.48, height: blossomArrowSize * 0.48, resizeMode: 'contain' }} />
                            </BalanceMindButton>
                        </MindAnimated.View>
                    </BlossomTimerView>
                    <BlossomTimerView
                        style={{
                            shadowRadius: 8,
                            backgroundColor: blossomDarkGreen,
                            borderRadius: blossomCardRadius,
                            shadowOpacity: 0.10,
                            padding: blossomPadding * 0.8,
                            shadowColor: '#000',
                            width: blossomWidth * 0.88,
                            elevation: 4,
                            height: blossomHeight * 0.28,
                            borderWidth: blossomWidth * 0.00614,
                            borderColor: "#012802",
                            overflow: 'hidden',
                            alignItems: 'center',
                        }}
                    >
                        <FLowerText
                            style={{
                                textAlign: 'center',
                                fontSize: blossomHowToFontSize,
                                letterSpacing: 0.2,
                                color: 'white',
                                marginBottom: blossomHeight * 0.01,
                                fontFamily: balanceMindFontsFlower.flowerMonrratSemiBold,
                            }}
                        >
                            {blossomPractice.practiceTitle}
                        </FLowerText>
                        <FLowerText
                            style={{
                                lineHeight: blossomDescFontSize * 1.3,
                                fontSize: blossomDescFontSize * 0.8,
                                marginBottom: blossomHeight * 0.01,
                                textAlign: 'center',
                                color: 'white',
                                fontFamily: balanceMindFontsFlower.flowerMonrratRegular,
                            }}
                        >
                            {blossomPractice.forWhatPracticeUse}
                        </FLowerText>

                        <BalanceMindButton
                            style={{
                                right: 0,
                                width: blossomWidth * 0.5,
                                height: blossomButtonHeight,
                                borderTopLeftRadius: blossomWidth * 0.08,
                                marginTop: blossomHeight * 0.04,
                                justifyContent: 'center',
                                alignSelf: 'center',
                                backgroundColor: blossomLightGreen,
                                position: 'absolute',
                                bottom: 0,
                                alignItems: 'center',
                            }}
                            onPress={() => setBlossomStep('instructions')}
                            activeOpacity={0.85}
                        >
                            <FLowerText
                                style={{
                                    letterSpacing: 0.5,
                                    color: 'white',
                                    fontSize: blossomButtonFontSize,
                                    fontFamily: balanceMindFontsFlower.flowerMonrratSemiBold,
                                }}
                            >
                                Choose
                            </FLowerText>
                        </BalanceMindButton>
                    </BlossomTimerView>
                </>
            ) : (
                <>
                    <BlossomTimerView
                        style={{
                            shadowRadius: 8,
                            width: blossomWidth * 0.92,
                            borderRadius: blossomCardRadius,
                            alignItems: 'center',
                            paddingVertical: blossomPadding * 0.8,
                            backgroundColor: blossomDarkGreen,
                            borderColor: "#012802",
                            paddingHorizontal: blossomPadding,
                            marginBottom: blossomHeight * 0.03,
                            shadowOpacity: 0.10,
                            elevation: 4,
                            flexDirection: 'row',
                            borderWidth: blossomWidth * 0.00614,
                            marginTop: blossomHeight * 0.019,
                            shadowColor: '#000',
                        }}
                    >
                        <FLowerImage
                            source={blossomPractice.flowerImage}
                            style={{
                                width: blossomImgSize * 0.6,
                                height: blossomImgSize * 0.6,
                                resizeMode: 'contain',
                            }}
                        />
                        <FLowerText
                            style={{
                                marginBottom: blossomHeight * 0.01,
                                fontFamily: balanceMindFontsFlower.flowerMonrratSemiBold,
                                color: 'white',
                                textAlign: 'center',
                                marginLeft: blossomWidth * 0.08,
                                letterSpacing: 0.2,
                                fontSize: blossomHowToFontSize * 1.12,
                            }}
                        >
                            {blossomPractice.practiceTitle}
                        </FLowerText>
                    </BlossomTimerView>
                    <BlossomTimerView
                        style={{
                            borderWidth: blossomWidth * 0.00614,
                            shadowRadius: 8,
                            width: blossomWidth * 0.92,
                            borderRadius: blossomCardRadius,
                            padding: blossomPadding * 0.8,
                            alignItems: 'center',
                            marginBottom: blossomHeight * 0.03,
                            shadowColor: '#000',
                            shadowOpacity: 0.10,
                            overflow: 'hidden',
                            elevation: 4,
                            borderColor: "#012802",
                            paddingBottom: 0,
                            backgroundColor: blossomDarkGreen,
                        }}
                    >
                        <FLowerText
                            style={{
                                letterSpacing: 0.2,
                                marginBottom: blossomHeight * 0.01,
                                fontFamily: balanceMindFontsFlower.flowerMonrratRegular,
                                color: 'white',
                                textAlign: 'center',
                                fontSize: blossomDescFontSize,
                            }}
                        >
                            Instructions
                        </FLowerText>
                        <FLowerText
                            style={{
                                letterSpacing: 0.2,
                                fontSize: blossomHowToFontSize,
                                alignSelf: 'flex-start',
                                color: 'white',
                                marginBottom: blossomHeight * 0.015,
                                textAlign: 'left',
                                fontFamily: balanceMindFontsFlower.flowerMonrratSemiBold,
                            }}
                        >
                            How to do it:
                        </FLowerText>
                        <BlossomTimerView style={{ width: '100%' }}>
                            {blossomPractice.howToDoIt.map((step, idx) => (
                                <FLowerText
                                    key={idx}
                                    style={{
                                        marginBottom: blossomHeight * 0.008,
                                        fontSize: blossomHowToStepFontSize,
                                        color: 'white',
                                        lineHeight: blossomHowToStepFontSize * 1.3,
                                        textAlign: 'left',
                                        fontFamily: balanceMindFontsFlower.flowerMonrratRegular,
                                    }}
                                >
                                    {`${idx + 1}. ${step}`}
                                </FLowerText>
                            ))}
                        </BlossomTimerView>
                        <BlossomTimerView style={{ flexDirection: 'row', width: blossomWidth * 0.92, justifyContent: 'space-between', marginTop: blossomHeight * 0.019, }}>
                            <BalanceMindButton
                                style={{
                                    justifyContent: 'center',
                                    height: blossomButtonHeight * 0.8,
                                    alignItems: 'center',
                                    backgroundColor: blossomLightGreen,
                                    borderTopRightRadius: blossomWidth * 0.08,
                                    width: blossomWidth * 0.42,
                                }}
                                onPress={() => setBlossomStep('choose')}
                                activeOpacity={0.85}
                            >
                                <FLowerText
                                    style={{
                                        fontFamily: balanceMindFontsFlower.flowerMonrratSemiBold,
                                        fontSize: blossomButtonFontSize * 0.8,
                                        color: 'white',
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    Back
                                </FLowerText>
                            </BalanceMindButton>
                            <BalanceMindButton
                                style={{
                                    borderTopLeftRadius: blossomWidth * 0.08,
                                    width: blossomWidth * 0.42,
                                    justifyContent: 'center',
                                    backgroundColor: blossomLightGreen,
                                    alignItems: 'center',
                                    height: blossomButtonHeight * 0.8,
                                }}
                                onPress={handleBlossomStart}
                                activeOpacity={0.85}
                            >
                                <FLowerText
                                    style={{
                                        color: 'white',
                                        letterSpacing: 0.5,
                                        fontSize: blossomButtonFontSize * 0.8,
                                        fontFamily: balanceMindFontsFlower.flowerMonrratSemiBold,
                                    }}
                                >
                                    Start
                                </FLowerText>
                            </BalanceMindButton>
                        </BlossomTimerView>
                    </BlossomTimerView>
                </>
            )}
        </BlossomTimerView>
    );
}

