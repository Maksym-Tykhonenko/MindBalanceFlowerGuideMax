const { width: flowerWidth, height: flowerHeight } = FlowerDimensions.get('window');
import { View as LeafView, Text as FlowerText, TouchableOpacity as LeafButton, Image as LeafImage, Dimensions as FlowerDimensions, Share as FlowerShare, ScrollView as FlowerScrollArea, Animated as FlowerAnimated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { balanceMindFontsFlower } from '../balanceMindFontsFlower';
import flowerBalancePractics from '../MindDataBalance/flowerBalancePractics';
import React, { useState as useLeafState, useEffect as useLeafEffect, useRef as useLeafRef } from 'react';


// Flower card component
const LeafCard = ({ index, selected, onPress }: { index: number, selected: boolean, onPress: () => void }) => (
    <LeafButton
        activeOpacity={0.8}
        onPress={onPress}
        style={{
            width: flowerWidth * 0.23,
            justifyContent: 'center',
            borderRadius: flowerWidth * 0.05,
            backgroundColor: flowerBalancePractics[index].backColorOfFlower,
            marginHorizontal: flowerWidth * 0.015,
            borderColor: selected ? '#037148' : undefined,
            shadowRadius: flowerWidth * 0.02,
            shadowOpacity: 0.08,
            alignItems: 'center',
            shadowColor: '#000',
            elevation: selected ? 4 : 1,
            borderWidth: selected ? flowerWidth * 0.008 : 0,
            height: flowerWidth * 0.23,
        }}
    >
        <LeafImage
            source={flowerBalancePractics[index].flowerImage}
            style={{
                width: flowerWidth * 0.16,
                height: flowerWidth * 0.16,
                resizeMode: 'contain',
            }}
        />
    </LeafButton>
);

// Stat panel component
const PetalStatsPanel = ({
    flowerIndex,
    stat,
    onShare,
}: {
    flowerIndex: number,
    stat: any,
    onShare: () => void,
}) => (
    <LeafView
        style={{
            borderRadius: flowerWidth * 0.04,
            marginTop: flowerHeight * 0.025,
            minHeight: flowerHeight * 0.19,
            paddingTop: flowerHeight * 0.019,
            backgroundColor: '#08301C',
            alignSelf: 'center',
            width: flowerWidth * 0.93,
        }}
    >
        <LeafView style={{
            width: '100%',
            paddingHorizontal: flowerWidth * 0.05,
        }}>
            <FlowerText
                style={{
                    textAlign: 'center',
                    fontFamily: balanceMindFontsFlower.flowerMonrratSemiBold,
                    marginBottom: flowerHeight * 0.01,
                    fontSize: flowerWidth * 0.05,
                    color: '#fff',
                }}
            >
                {flowerBalancePractics[flowerIndex].practiceTitle}
            </FlowerText>
            {stat ? (
                <>
                    <LeafView style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: flowerHeight * 0.01 }}>
                        <FlowerText style={{
                            color: '#fff',
                            fontFamily: balanceMindFontsFlower.flowerMonrratRegular,
                            fontSize: flowerWidth * 0.045,
                        }}>
                            Total time spent:
                        </FlowerText>
                        <FlowerText style={{
                            color: '#fff',
                            fontFamily: balanceMindFontsFlower.flowerMonrratRegular,
                            fontSize: flowerWidth * 0.045,
                        }}>
                            {stat.time}
                        </FlowerText>
                    </LeafView>
                    <LeafView style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: flowerHeight * 0.025 }}>
                        <FlowerText style={{
                            color: '#fff',
                            fontFamily: balanceMindFontsFlower.flowerMonrratRegular,
                            fontSize: flowerWidth * 0.045,
                        }}>
                            In general, approaches:
                        </FlowerText>
                        <FlowerText style={{
                            color: '#fff',
                            fontFamily: balanceMindFontsFlower.flowerMonrratRegular,
                            fontSize: flowerWidth * 0.045,
                        }}>
                            {stat.approaches}
                        </FlowerText>
                    </LeafView>
                </>
            ) : (
                <FlowerText
                    style={{
                        textAlign: 'center',
                        fontFamily: balanceMindFontsFlower.flowerMonrratRegular,
                        marginTop: flowerHeight * 0.025,
                        fontSize: flowerWidth * 0.048,
                        color: '#fff',
                    }}
                >
                    You don't have any random statistics yet.
                </FlowerText>
            )}
        </LeafView>
        <LeafButton
            style={{
                paddingVertical: flowerHeight * 0.013,
                alignSelf: 'flex-end',
                backgroundColor: '#037148',
                marginTop: flowerHeight * 0.01,
                borderTopLeftRadius: flowerWidth * 0.04,
                paddingHorizontal: flowerWidth * 0.09,
                borderBottomRightRadius: flowerWidth * 0.04,
            }}
            onPress={onShare}
        >
            <FlowerText style={{
                color: '#fff',
                fontFamily: balanceMindFontsFlower.flowerMonrratSemiBold,
                fontSize: flowerWidth * 0.04,
            }}>
                Share
            </FlowerText>
        </LeafButton>
    </LeafView>
);

export default function GuideBalanceStatPage() {
    const [flowerAppTotalTime, setFlowerAppTotalTime] = useLeafState<string>('00:00:00');
    const [archiveMindBalance, setArchiveMindBalance] = useLeafState<any>({});
    const [selectedLeaf, setSelectedLeaf] = useLeafState<number>(0);

    // Animated values: top floating panel, per-card float, and panel show/hide
    const topFloat = useLeafRef(new FlowerAnimated.Value(0)).current;
    const cardFloats = useLeafRef(flowerBalancePractics.map(() => new FlowerAnimated.Value(0))).current;
    const statsPanelAnim = useLeafRef(new FlowerAnimated.Value(1)).current;
    const bottomFloat = useLeafRef(new FlowerAnimated.Value(0)).current; // animated bottom "Balance Flow" block

    // start gentle loops for top and cards
    useLeafEffect(() => {
        const topLoop = FlowerAnimated.loop(
            FlowerAnimated.sequence([
                FlowerAnimated.timing(topFloat, { toValue: 1, duration: 2000, useNativeDriver: true }),
                FlowerAnimated.timing(topFloat, { toValue: 0, duration: 2000, useNativeDriver: true }),
            ])
        );
        topLoop.start();

        const cardLoops = cardFloats.map((v, i) =>
            FlowerAnimated.loop(
                FlowerAnimated.sequence([
                    FlowerAnimated.timing(v, { toValue: 1, duration: 1400 + i * 120, useNativeDriver: true }),
                    FlowerAnimated.timing(v, { toValue: 0, duration: 1400 + i * 120, useNativeDriver: true }),
                ])
            )
        );
        cardLoops.forEach(l => l.start());

        // gentle loop for bottom block (slower, subtle)
        const bottomLoop = FlowerAnimated.loop(
            FlowerAnimated.sequence([
                FlowerAnimated.timing(bottomFloat, { toValue: 1, duration: 2800, useNativeDriver: true }),
                FlowerAnimated.timing(bottomFloat, { toValue: 0, duration: 2800, useNativeDriver: true }),
            ])
        );
        bottomLoop.start();

        return () => {
            topLoop.stop && topLoop.stop();
            cardLoops.forEach(l => l.stop && l.stop());
            bottomLoop.stop && bottomLoop.stop();
        };
    }, []);

    // handle selection with panel cross-fade
    const handleSelectLeaf = (idx: number) => {
        if (idx === selectedLeaf) {
            // small pulse feedback on the chosen card
            const v = cardFloats[idx];
            FlowerAnimated.sequence([
                FlowerAnimated.timing(v, { toValue: 1, duration: 120, useNativeDriver: true }),
                FlowerAnimated.timing(v, { toValue: 0, duration: 180, useNativeDriver: true }),
            ]).start();
            return;
        }
        FlowerAnimated.timing(statsPanelAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
            setSelectedLeaf(idx);
            FlowerAnimated.timing(statsPanelAnim, { toValue: 1, duration: 240, useNativeDriver: true }).start();
        });
    };

    // Load archive and totalAppTime from AsyncStorage
    useLeafEffect(() => {
        const loadArchiveMindBalance = async () => {
            const res = await AsyncStorage.getItem('balanceFlowerMeditationsArchive');
            if (res) {
                const data = JSON.parse(res);
                if (Array.isArray(data)) {
                    setArchiveMindBalance({});
                } else {
                    setArchiveMindBalance(data);
                }
            } else {
                setArchiveMindBalance({});
            }
        };
        const loadFlowerAppTotalTime = async () => {
            const res = await AsyncStorage.getItem('totalAppTime');
            setFlowerAppTotalTime(res || '00:00:00');
        };
        loadArchiveMindBalance();
        loadFlowerAppTotalTime();

        // Оновлення кожну хвилину
        const interval = setInterval(() => {
            loadArchiveMindBalance();
            loadFlowerAppTotalTime();
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    // Get stat for selected flower (all time)
    const getLeafStats = () => {
        let totalTime = 0;
        let totalApproaches = 0;
        Object.values(archiveMindBalance).forEach((dayObj: any) => {
            const stat = dayObj[String(selectedLeaf)];
            if (stat) {
                // Parse time as hh:mm:ss
                const [h, m, s] = (stat.time || '00:00:00').split(':').map(Number);
                totalTime += h * 3600 + m * 60 + s;
                totalApproaches += stat.approaches || 0;
            }
        });
        if (totalApproaches === 0) return null;
        // Format totalTime as hh:mm h (без секунд)
        const hours = Math.floor(totalTime / 3600);
        const minutes = Math.floor((totalTime % 3600) / 60);
        const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} h`;
        return {
            time: timeStr,
            approaches: totalApproaches,
        };
    };

    // Share handler
    const handleLeafShare = () => {
        const stat = getLeafStats();
        if (!stat) return;
        FlowerShare.share({
            message: `${flowerBalancePractics[selectedLeaf].practiceTitle}\nTotal time spent: ${stat.time}\nIn general, approaches: ${stat.approaches}`,
        });
    };

    return (
        <FlowerScrollArea style={{ flex: 1, }} contentContainerStyle={{ alignItems: 'center', paddingBottom: flowerHeight * 0.19 }}>
            {/* Top panel: animated gentle float */}
            <FlowerAnimated.View
                style={{
                    borderRadius: flowerWidth * 0.04,
                    alignItems: 'center',
                    backgroundColor: '#08301C',
                    marginTop: flowerHeight * 0.035,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    height: flowerHeight * 0.19,
                    paddingTop: flowerHeight * 0.019,
                    width: flowerWidth * 0.93,
                    transform: [
                        { translateY: topFloat.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) },
                        { scale: topFloat.interpolate({ inputRange: [0, 1], outputRange: [1, 1.01] }) },
                    ],
                    opacity: topFloat.interpolate({ inputRange: [0, 1], outputRange: [1, 0.96] }),
                }}
            >
                <FlowerText style={{
                    marginBottom: flowerHeight * 0.01,
                    textAlign: 'center',
                    fontFamily: balanceMindFontsFlower.flowerMonrratRegular,
                    fontSize: flowerWidth * 0.048,
                    color: '#fff',
                }}>
                    Total time spent in the app
                </FlowerText>
                <FlowerText style={{
                    marginBottom: flowerHeight * 0.01,
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: flowerWidth * 0.11,
                    fontFamily: balanceMindFontsFlower.flowerMonrratSemiBold,
                }}>
                    {/* Відображення у форматі hh:mm h з лідуючими нулями */}
                    {(() => {
                        const parts = (flowerAppTotalTime || '00:00:00').split(':').map(Number);
                        let totalSeconds = 0;
                        if (parts.length === 3 && parts.every(n => !isNaN(n))) {
                            totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
                        } else if (parts.length === 2 && parts.every(n => !isNaN(n))) {
                            totalSeconds = parts[0] * 3600 + parts[1] * 60;
                        } else if (parts.length === 1 && !isNaN(parts[0])) {
                            totalSeconds = parts[0];
                        }
                        const hours = Math.floor(totalSeconds / 3600);
                        const minutes = Math.floor((totalSeconds % 3600) / 60);
                        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} h`;
                    })()}
                </FlowerText>
                <LeafButton
                    style={{
                        paddingVertical: flowerHeight * 0.013,
                        borderBottomRightRadius: flowerWidth * 0.04,
                        marginTop: flowerHeight * 0.01,
                        borderTopLeftRadius: flowerWidth * 0.04,
                        alignSelf: 'flex-end',
                        paddingHorizontal: flowerWidth * 0.09,
                        backgroundColor: '#037148',
                    }}
                    onPress={() => {
                        const parts = (flowerAppTotalTime || '00:00:00').split(':').map(Number);
                        let totalSeconds = 0;
                        if (parts.length === 3 && parts.every(n => !isNaN(n))) {
                            totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
                        } else if (parts.length === 2 && parts.every(n => !isNaN(n))) {
                            totalSeconds = parts[0] * 3600 + parts[1] * 60;
                        } else if (parts.length === 1 && !isNaN(parts[0])) {
                            totalSeconds = parts[0];
                        }
                        const hours = Math.floor(totalSeconds / 3600);
                        const minutes = Math.floor((totalSeconds % 3600) / 60);
                        FlowerShare.share({ message: `Total time spent in the app: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} h` });
                    }}
                >
                    <FlowerText style={{
                        color: '#fff',
                        fontFamily: balanceMindFontsFlower.flowerMonrratSemiBold,
                        fontSize: flowerWidth * 0.04,
                    }}>
                        Share
                    </FlowerText>
                </LeafButton>
            </FlowerAnimated.View>
            {/* Flower cards */}
            <LeafView style={{
                marginTop: flowerHeight * 0.03,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: flowerHeight * 0.01,
                flexDirection: 'row',
            }}>
                {flowerBalancePractics.map((_, idx) => {
                    const floatVal = cardFloats[idx];
                    return (
                        <FlowerAnimated.View
                            key={idx}
                            style={{
                                transform: [
                                    { translateY: floatVal.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }) },
                                    { scale: floatVal.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] }) },
                                ],
                            }}
                        >
                            <LeafCard index={idx} selected={selectedLeaf === idx} onPress={() => handleSelectLeaf(idx)} />
                        </FlowerAnimated.View>
                    );
                })}
            </LeafView>
            {/* animated stat panel */}
            <FlowerAnimated.View style={{
                opacity: statsPanelAnim,
                width: '100%',
                transform: [
                    { translateY: bottomFloat.interpolate({ inputRange: [0, 1], outputRange: [4, -6] }) },
                    { scale: bottomFloat.interpolate({ inputRange: [0, 1], outputRange: [1, 1.01] }) },
                ],
            }}>
                <PetalStatsPanel
                    flowerIndex={selectedLeaf}
                    stat={getLeafStats()}
                    onShare={handleLeafShare}
                />
            </FlowerAnimated.View>
        </FlowerScrollArea>
    );
}

