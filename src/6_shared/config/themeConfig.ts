export const lightTheme = {
  colors: {
    background: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.6)',
    surface: '#ffffff',
    textPrimary: '#1a1a1a',
    textSecondary: '#666666',
    textTertiary: '#888888',
    primary: '#007bff',
    border: '#e0e0e0',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
};

export const darkTheme = {
  colors: {
    background: '#121212',
    overlay: 'rgba(0, 0, 0, 0.8)',
    surface: '#1e1e1e',
    textPrimary: '#ffffff',
    textSecondary: '#b0b0b0',
    textTertiary: '#717171',
    primary: '#3793ff', // 다크모드에서는 살짝 더 밝은 블루가 눈이 편해요
    border: '#333333',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

export type ThemeType = typeof lightTheme;
// TODO: 추후, 테마 프로바이더 만들어 적용하기!  테마적용을 위한 첫 단계!
