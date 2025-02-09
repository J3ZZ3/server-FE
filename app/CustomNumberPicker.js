import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const CustomNumberPicker = ({ value, onChange }) => {
    return (
        <View style={styles.container}>
            <Button 
                title="-" 
                onPress={() => {
                    if (value > 1) {
                        onChange(value - 1);
                    }
                }} 
            />
            <Text style={styles.numberDisplay}>{value}</Text>
            <Button 
                title="+" 
                onPress={() => {
                    if (value < 7) {
                        onChange(value + 1);
                    }
                }} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    numberDisplay: {
        fontSize: 18,
        marginHorizontal: 10,
    },
});

export default CustomNumberPicker; 