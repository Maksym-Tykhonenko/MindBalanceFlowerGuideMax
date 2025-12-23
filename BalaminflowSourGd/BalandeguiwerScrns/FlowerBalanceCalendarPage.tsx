import { ScrollView as MindScrollArea } from 'react-native-gesture-handler';
import { View as BlossomCalendarView, Text as PetalText, TouchableOpacity as MindCardButton, Image as PetalImage, Dimensions as MindCalendarDimensions, Share as MindShare, Animated as PetalAnimated } from 'react-native';
import React, { useState as useBlossomCalendarState, useEffect as useBlossomCalendarEffect, useRef as useBlossomCalendarRef } from 'react';
import { balanceMindFontsFlower } from '../balanceMindFontsFlower';
import flowerBalancePractics from '../MindDataBalance/flowerBalancePractics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: calendarWidth, height: calendarHeight } = MindCalendarDimensions.get('window');

const petalNames = flowerBalancePractics.map(f => f.practiceTitle);
const petalColors = flowerBalancePractics.map(f => f.backColorOfFlower);
const petalImages = flowerBalancePractics.map(f => f.flowerImage);

function getMonthDays(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getMindCalendarRows(daysInMonth: number) {
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const rows = [];
    for (let i = 0; i < days.length; i += 7) {
        rows.push(days.slice(i, i + 7));
    }
    return rows;
}

const MindCard = ({ index, selected, onPress }: { index: number, selected: boolean, onPress: () => void }) => (
    <MindCardButton activeOpacity={0.8} onPress={onPress}
        style={{
            marginHorizontal: calendarWidth * 0.015,
            backgroundColor: petalColors[index],
            height: calendarWidth * 0.23,
            elevation: selected ? 4 : 1,
            borderRadius: calendarWidth * 0.05,
            borderColor: selected ? '#037148' : undefined,
            shadowRadius: calendarWidth * 0.02,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.08,
            borderWidth: selected ? calendarWidth * 0.008 : 0,
            width: calendarWidth * 0.23,
        }}
    >
        <PetalImage source={petalImages[index]} style={{ height: calendarWidth * 0.16, resizeMode: 'contain', width: calendarWidth * 0.16 }} />
    </MindCardButton>
);

const MindStatPanel = ({
    flowerIndex,
    stat,
    onShare,
}: {
    flowerIndex: number,
    stat: any,
    onShare: () => void,
}) => (
    <BlossomCalendarView
        style={{
            borderRadius: calendarWidth * 0.04,
            alignSelf: 'center',
            backgroundColor: '#08301C',
            marginTop: calendarHeight * 0.025,
            width: calendarWidth * 0.93,
            paddingTop: calendarHeight * 0.019,
            minHeight: calendarHeight * 0.19,
        }}
    >
        <BlossomCalendarView style={{
            width: '100%',
            paddingHorizontal: calendarWidth * 0.05,
        }}>
            <PetalText
                style={{
                    marginBottom: calendarHeight * 0.01,
                    fontSize: calendarWidth * 0.05,
                    color: '#fff',
                    textAlign: 'center',
                    fontFamily: balanceMindFontsFlower.flowerMonrratSemiBold,
                }}
            >
                {petalNames[flowerIndex]}
            </PetalText>
            {stat ? (
                <>
                    <BlossomCalendarView style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: calendarHeight * 0.01 }}>
                        <PetalText style={{
                            color: '#fff',
                            fontFamily: balanceMindFontsFlower.flowerMonrratRegular,
                            fontSize: calendarWidth * 0.045,
                        }}>
                            Total time spent:
                        </PetalText>
                        <PetalText style={{
                            color: '#fff',
                            fontFamily: balanceMindFontsFlower.flowerMonrratRegular,
                            fontSize: calendarWidth * 0.045,
                        }}>
                            {stat.time}
                        </PetalText>
                    </BlossomCalendarView>
                    <BlossomCalendarView style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: calendarHeight * 0.025 }}>
                        <PetalText style={{
                            color: '#fff',
                            fontFamily: balanceMindFontsFlower.flowerMonrratRegular,
                            fontSize: calendarWidth * 0.045,
                        }}>
                            In general, approaches:
                        </PetalText>
                        <PetalText style={{
                            color: '#fff',
                            fontFamily: balanceMindFontsFlower.flowerMonrratRegular,
                            fontSize: calendarWidth * 0.045,
                        }}>
                            {stat.approaches}
                        </PetalText>
                    </BlossomCalendarView>
                </>
            ) : (
                <PetalText
                    style={{
                        marginTop: calendarHeight * 0.025,
                        color: '#fff',
                        textAlign: 'center',
                        fontSize: calendarWidth * 0.048,
                        fontFamily: balanceMindFontsFlower.flowerMonrratRegular,
                    }}
                >
                    You had no activities in this category on this day.
                </PetalText>
            )}
        </BlossomCalendarView>
        {stat && (
            <MindCardButton
                style={{
                    marginTop: calendarHeight * 0.01,
                    backgroundColor: '#037148',
                    borderTopLeftRadius: calendarWidth * 0.04,
                    paddingVertical: calendarHeight * 0.013,
                    paddingHorizontal: calendarWidth * 0.09,
                    alignSelf: 'flex-end',
                    borderBottomRightRadius: calendarWidth * 0.04,
                }}
                onPress={onShare}
            >
                <PetalText style={{
                    fontSize: calendarWidth * 0.04,
                    color: '#fff',
                    fontFamily: balanceMindFontsFlower.flowerMonrratSemiBold,
                }}>
                    Share
                </PetalText>
            </MindCardButton>
        )}
    </BlossomCalendarView>
);

export default function FLowerBalanceCalendarPage() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const daysInMonth = getMonthDays(year, month);
    const mindCalendarRows = getMindCalendarRows(daysInMonth);

    const [selectedDay, setSelectedDay] = useBlossomCalendarState<number>(today.getDate());
    const [selectedPetal, setSelectedPetal] = useBlossomCalendarState<number>(0);
    const [mindArchive, setMindArchive] = useBlossomCalendarState<any>({});
    // Animated values for petals and panel (correctly initialize refs with actual values)
    const petalCount = flowerBalancePractics.length;
    const petalFloatRefs = useBlossomCalendarRef(flowerBalancePractics.map(() => new PetalAnimated.Value(0))).current;
    const panelAnim = useBlossomCalendarRef(new PetalAnimated.Value(1)).current;

    // start gentle looping float for petals
    useBlossomCalendarEffect(() => {
        const loops = petalFloatRefs.map((val, i) => {
            const loop = PetalAnimated.loop(
                PetalAnimated.sequence([
                    PetalAnimated.timing(val, { toValue: 1, duration: 1400 + (i * 120), useNativeDriver: true }),
                    PetalAnimated.timing(val, { toValue: 0, duration: 1400 + (i * 120), useNativeDriver: true }),
                ])
            );
            loop.start();
            return loop;
        });
        return () => loops.forEach(l => l.stop && l.stop());
    }, []);

    useBlossomCalendarEffect(() => {
        const loadMindArchive = async () => {
            const res = await AsyncStorage.getItem('balanceFlowerMeditationsArchive');
            if (res) {
                const data = JSON.parse(res);
                if (Array.isArray(data)) {
                    setMindArchive({});
                } else {
                    setMindArchive(data);
                }
            } else {
                setMindArchive({});
            }
        };
        loadMindArchive();

        const interval = setInterval(() => {
            loadMindArchive();
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const getMindStat = () => {
        const month_padded = String(month + 1).padStart(2, '0');
        const day_padded = String(selectedDay).padStart(2, '0');
        const key = `${year}-${month_padded}-${day_padded}`;
        const dayObj = mindArchive?.[key];
        if (!dayObj) return null;
        const practiceKey = String(selectedPetal);
        const stat = dayObj[practiceKey];
        if (!stat) return null;
        return {
            time: stat.time || '00:00:00',
            approaches: stat.approaches || 0,
        };
    };

    const handleMindShare = () => {
        const stat = getMindStat();
        if (!stat) return;
        MindShare.share({
            message: `${petalNames[selectedPetal]} on ${selectedDay}.${month + 1}.${year}\nTime: ${stat.time}\nApproaches: ${stat.approaches}`,
        });
    };

    // Animated selection handler: animate panel out, change selected petal, animate panel in
    const handleSelectPetal = (idx: number) => {
        if (idx === selectedPetal) {
            // small feedback pulse for same selected petal
            const v = petalFloatRefs[idx];
            PetalAnimated.sequence([
                PetalAnimated.timing(v, { toValue: 1, duration: 140, useNativeDriver: true }),
                PetalAnimated.timing(v, { toValue: 0, duration: 200, useNativeDriver: true }),
            ]).start();
            return;
        }
        PetalAnimated.timing(panelAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
            setSelectedPetal(idx);
            PetalAnimated.timing(panelAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
        });
    };

    const cellSize = calendarWidth * 0.1;
    const cellMargin = calendarWidth * 0.012;

    return (
        <MindScrollArea style={{ flex: 1, }} showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingBottom: calendarHeight * 0.19 }}>
            <PetalText
                style={{
                    marginTop: calendarHeight * 0.035,
                    fontFamily: balanceMindFontsFlower.flowerMonrratSemiBold,
                    color: '#fff',
                    marginBottom: calendarHeight * 0.025,
                    fontSize: calendarWidth * 0.08,
                }}
            >
                {today.toLocaleString('default', { month: 'long' })} {year}
            </PetalText>
            <BlossomCalendarView
                style={{
                    width: '100%',
                    alignItems: 'center',
                    marginBottom: calendarHeight * 0.03,
                }}
            >
                {mindCalendarRows.map((week, rowIdx) => (
                    <BlossomCalendarView
                        key={rowIdx}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginBottom: calendarHeight * 0.012,
                        }}
                    >
                        {rowIdx === 0 && week.length < 7
                            ? Array.from({ length: Math.floor((7 - week.length) / 2) }).map((_, i) => (
                                <BlossomCalendarView
                                    key={`empty-start-${i}`}
                                    style={{
                                        width: cellSize,
                                        height: cellSize,
                                        margin: cellMargin,
                                    }}
                                />
                            ))
                            : null}
                        {week.map(day => (
                            <MindCardButton
                                key={day}
                                onPress={() => setSelectedDay(day)}
                                style={{
                                    width: cellSize,
                                    margin: cellMargin,
                                    height: cellSize,
                                    borderColor: '#fff',
                                    backgroundColor: selectedDay === day ? '#037148' : 'transparent',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: cellSize * 0.35,
                                    borderWidth: calendarWidth * 0.003,
                                }}
                            >
                                <PetalText style={{
                                    color: '#fff',
                                    fontFamily: balanceMindFontsFlower.flowerMonrratRegular,
                                    fontSize: calendarWidth * 0.05,
                                }}>
                                    {day}
                                </PetalText>
                            </MindCardButton>
                        ))}
                        {rowIdx === mindCalendarRows.length - 1 && week.length < 7
                            ? Array.from({ length: 7 - week.length - Math.floor((7 - week.length) / 2) }).map((_, i) => (
                                <BlossomCalendarView
                                    key={`empty-end-${i}`}
                                    style={{
                                        width: cellSize,
                                        height: cellSize,
                                        margin: cellMargin,
                                    }}
                                />
                            ))
                            : null}
                    </BlossomCalendarView>
                ))}
            </BlossomCalendarView>
            <BlossomCalendarView style={{
                marginBottom: calendarHeight * 0.01,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
            }}>
                {flowerBalancePractics.map((_, idx) => {
                    const floatVal = petalFloatRefs[idx];
                    return (
                        <PetalAnimated.View
                            key={idx}
                            style={{
                                transform: [
                                    {
                                        translateY: floatVal.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }),
                                    },
                                    {
                                        scale: floatVal.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] }),
                                    },
                                ],
                            }}
                        >
                            <MindCard index={idx} selected={selectedPetal === idx} onPress={() => handleSelectPetal(idx)} />
                        </PetalAnimated.View>
                    );
                })}
            </BlossomCalendarView>
            {/* animated replacement of stat panel */}
            <PetalAnimated.View
                style={{
                    width: '100%',
                    opacity: panelAnim,
                    transform: [{ translateY: panelAnim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
                }}
            >
                <MindStatPanel flowerIndex={selectedPetal} stat={getMindStat()} onShare={handleMindShare} />
            </PetalAnimated.View>
        </MindScrollArea>
    );
}

