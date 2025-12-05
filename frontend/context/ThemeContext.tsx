import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = {
    dark: boolean;
    colors: {
        background: string;
        card: string;
        text: string;
        subtext: string;
        border: string;
        primary: string;
        icon: string;
    };
};

const LightTheme: Theme = {
    dark: false,
    colors: {
        background: '#F3F4F6',
        card: '#FFFFFF',
        text: '#111827',
        subtext: '#6B7280',
        border: '#E5E7EB',
        primary: '#6D28D9',
        icon: '#1F2937',
    },
};

const DarkTheme: Theme = {
    dark: true,
    colors: {
        background: '#111827',
        card: '#1F2937',
        text: '#F9FAFB',
        subtext: '#9CA3AF',
        border: '#374151',
        primary: '#8B5CF6',
        icon: '#E5E7EB',
    },
};

type ThemeContextType = {
    theme: Theme;
    isDark: boolean;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
    theme: LightTheme,
    isDark: false,
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemScheme = useColorScheme();
    const [isDark, setIsDark] = useState(systemScheme === 'dark');

    useEffect(() => {
        // Load saved theme preference
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('theme');
                if (savedTheme !== null) {
                    setIsDark(savedTheme === 'dark');
                }
            } catch (error) {
                console.error('Failed to load theme', error);
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const newMode = !isDark;
        setIsDark(newMode);
        try {
            await AsyncStorage.setItem('theme', newMode ? 'dark' : 'light');
        } catch (error) {
            console.error('Failed to save theme', error);
        }
    };

    const theme = isDark ? DarkTheme : LightTheme;

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
