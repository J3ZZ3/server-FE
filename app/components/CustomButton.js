import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ 
    title, 
    onPress, 
    type = 'primary', 
    disabled = false,
    style = {} 
}) => {
    const buttonStyle = [
        styles.button,
        type === 'secondary' && styles.secondaryButton,
        type === 'danger' && styles.dangerButton,
        disabled && styles.disabledButton,
        style
    ];

    const textStyle = [
        styles.text,
        type === 'secondary' && styles.secondaryText,
        disabled && styles.disabledText
    ];

    return (
        <TouchableOpacity 
            style={buttonStyle} 
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={textStyle}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    dangerButton: {
        backgroundColor: '#FF3B30',
    },
    disabledButton: {
        backgroundColor: '#cccccc',
        borderColor: '#cccccc',
    },
    text: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryText: {
        color: '#007AFF',
    },
    disabledText: {
        color: '#666666',
    },
});

export default CustomButton; 