# 💸 Billy

Billy is a modern, premium accounting and billing application tailored specifically for Indian businesses. Built with React Native and Expo, it offers a seamless cross-platform experience with a focus on beautiful aesthetics, buttery-smooth micro-animations, and robust GST (Goods and Services Tax) compliance tracking.

## ✨ Features

- **📊 Comprehensive Dashboards**: Instantly view cashflow, outstanding balances, and profit & loss summaries with interactive charts.
- **🧾 GST-Ready Invoicing**: Generate, track, and manage invoices with built-in support for HSN/SAC codes and Indian tax slabs (CGST, SGST, IGST).
- **👥 Directory Management**: Organize your customers and vendors in a centralized directory with real-time payable/receivable balances.
- **📦 Product & Service Catalog**: Maintain a dynamic catalog of your inventory, complete with pricing and GST rates.
- **📱 Premium UI/UX**: Designed with modern glassmorphism, subtle gradients, and `react-native-reanimated` powered micro-interactions for a truly native feel.

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/) (with File-based Routing via Expo Router)
- **Styling**: [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Icons**: [Lucide React Native](https://lucide.dev/icons/)
- **Charts**: [React Native SVG](https://github.com/software-mansion/react-native-svg)
- **Fonts**: Custom integration of *Plus Jakarta Sans*

## 🚀 Getting Started

1. **Install dependencies**
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npx expo start
   ```

3. **Run the App**
   - Press `a` to open in an **Android Emulator**
   - Press `i` to open in an **iOS Simulator**
   - Or scan the QR code with the **Expo Go** app on your physical device.

## 📂 Project Structure

- `src/app/` - Contains the file-based routing logic (Expo Router).
  - `(auth)/` - Login, Sign up, and Onboarding flows.
  - `(app)/` - Core internal screens (Dashboard, Invoices, Payments, Reports).
- `components/` - Reusable UI components (`Card`, `Button`, `StatCard`, etc.).
- `constants/` - Static assets and structured Indian business mock data (`data.ts`).
- `assets/` - Fonts, Images, and raw Icon files.
- `global.css` - NativeWind theme variables and root CSS definitions.

## 📄 License

This project is licensed under the MIT License.
