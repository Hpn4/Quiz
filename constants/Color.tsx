export const darkColors = {
	background: "#111217",
	accentuation: "#0067C6",
	accentuation_a: "#0067C61B",
	orange: "#F5A623",
	red: "#FF2727",
	red_a: "#FF27271B",
	green: "#26AE1A",
	green_a: "#26AE1A1B",
	stroke: "#353540",
	card: "#1A1C23",
	title: "#16181F",
	text: "#FFFFFF",
	subtitle: "#999999",
	desc: "#999999",
	desc_a: "#666666",
	shadow: "#000000",
} as const;

export const lightColors = {
	background: "#F7F8FA",
	accentuation: "#50aaff",
	accentuation_a: "#3EA2FF1A",
	orange: "#F5A623",
	red: "#D9534F",
	red_a: "#D9534F1A",
	green: "#2DAA4F",
	green_a: "#2DAA4F1A",
	stroke: "#E6E7EB",
	card: "#FFFFFF",
	title: "#F0F3F8",
	text: "#0B0D0F",
	subtitle: "#666666",
	desc: "#666666",
	desc_a: "#999999",
	shadow: "#BBBBBB",
} as const;

export type ThemeName = "dark" | "light";
export type ThemeColors = {
	background: string;
	accentuation: string;
	accentuation_a: string;
	orange: string;
	red: string;
	red_a: string;
	green: string;
	green_a: string;
	stroke: string;
	card: string;
	title: string;
	text: string;
	subtitle: string;
	desc: string;
	desc_a: string;
	shadow: string;
};

const colors: ThemeColors = { ...darkColors };

export function getThemeColors(theme: ThemeName): ThemeColors {
	return theme === "light" ? lightColors : darkColors;
}

export function applyTheme(theme: ThemeName) {
	Object.assign(colors, getThemeColors(theme));
}

export default colors;