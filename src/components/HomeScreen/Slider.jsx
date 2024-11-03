import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet } from "react-native";
import colors from "../../constants/Colors";
export default function Slider() {
    const flatListRef = useRef(null);  // Ref for the FlatList
    const [currentIndex, setCurrentIndex] = useState(0);  // Current index for auto-play
    const slider = [
        { url: require('../../assets/slider/1.jpg') },
        { url: require('../../assets/slider/2.jpg') },
        { url: require('../../assets/slider/3.jpg') },
    ];
    useEffect(() => {
        if (slider.length > 0) {
            const interval = setInterval(() => {
                let nextIndex = currentIndex + 1;
                if (nextIndex >= slider.length) {
                    nextIndex = 0;  // Loop back to the first item
                }
                setCurrentIndex(nextIndex);

                // Scroll to the next index
                flatListRef.current?.scrollToIndex({
                    index: nextIndex,
                    animated: true,
                });
            }, 5000); // Change slide every 5 seconds

            return () => clearInterval(interval);  // Clean up on unmount
        }
    }, [currentIndex, slider]);

   
  

    // Render each item in the slider
    const renderItem = ({ item }) => (
        <View style={styles.sliderItem}>
            <Image source={item.url} style={styles.sliderImage} />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.sliderText}>Services </Text>
            <FlatList
                data={slider}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                ref={flatListRef}
                onScrollToIndexFailed={() => {
                    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    sliderItem: {
        marginRight: 10,
        alignItems: "center",
    },
    sliderImage: {
        width: 300,
        height: 150,
        borderRadius: 8,
    },
    sliderText: {
        fontSize: 20,
        padding: 5,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 5
    },
});
