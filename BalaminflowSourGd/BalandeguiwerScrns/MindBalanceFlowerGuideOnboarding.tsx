import { useNavigation as blossomGuideNav } from '@react-navigation/native';
import balanceWelcomeGuide from '../MindDataBalance/balanceWelcomeGuide'
import { balanceMindFontsFlower } from '../balanceMindFontsFlower';
import React, { useState as useWelcomeStepState } from 'react';
import {
    useWindowDimensions as useBalanceMindWindow,
    TouchableOpacity as FLowerGuideNextButton,
    Image as BalanceMindBackground,
    View as BlossomGuideScreen,
    Text as WelcomeGuideText,
    SafeAreaView as FLowerGuideSafeArea,
} from 'react-native';


const MindBalanceFlowerGuideOnboarding: React.FC = () => {
    const [welcomeStepIndex, setWelcomeStepIndex] = useWelcomeStepState(0);
    const { width: balanceMindWidth, height: balanceMindHeight } = useBalanceMindWindow();
    const blossomGuideNavigation = blossomGuideNav();

    const goToNextWelcomeStep = () => {
        const lastStep = balanceWelcomeGuide.length - 1;
        if (welcomeStepIndex < lastStep) {
            setWelcomeStepIndex(prev => prev + 1);
        } else {
            blossomGuideNavigation.replace?.('OpenpageBalanceFlowGuide');
        }
    };

    const getWelcomeButtonText = (step: number) => {
        switch (step) {
            case 2:
                return 'Let\'s go';
            case 0:
                return 'Next';
            case 1:
                return 'Continue';
            default:
                return '';
        }
    }

    const welcomeGuideButtonText = getWelcomeButtonText(welcomeStepIndex);

    return (
        <BlossomGuideScreen
            style={{
                alignItems: 'center',
                flex: 1,
                width: balanceMindWidth,
                height: balanceMindHeight,
            }}
        >
            <FLowerGuideSafeArea />

            <BalanceMindBackground
                resizeMode="cover"
                style={{
                    height: balanceMindHeight * 1.0119,
                    position: 'absolute',
                    width: balanceMindWidth,
                }}
                source={balanceWelcomeGuide[welcomeStepIndex]}
            />

            <FLowerGuideNextButton
                onPress={goToNextWelcomeStep}
                style={{
                    width: balanceMindWidth * 0.59,
                    height: balanceMindHeight * 0.08,
                    borderRadius: balanceMindWidth * 0.0611,
                    position: 'absolute',
                    backgroundColor: '#037148',
                    alignSelf: 'center',
                    alignItems: 'center',
                    bottom: balanceMindHeight * 0.0480543,
                    justifyContent: 'center',
                }}
                activeOpacity={0.8}
            >
                <WelcomeGuideText
                    style={{
                        letterSpacing: 0.5,
                        color: '#fff',
                        fontSize: balanceMindWidth * 0.048,
                        fontFamily: balanceMindFontsFlower.flowerMonrratSemiBold,
                    }}
                >
                    {welcomeGuideButtonText}
                </WelcomeGuideText>
            </FLowerGuideNextButton>
        </BlossomGuideScreen>
    );
};

export default MindBalanceFlowerGuideOnboarding;