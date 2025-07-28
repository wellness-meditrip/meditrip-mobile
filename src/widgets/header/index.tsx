
import { ARROW_LEFT } from '@/assets/icons/components/navigation'
import { scale, useSafeRouter } from '@/src/shared/lib'
import { Custom } from '@/src/shared/ui/custom'
import { usePathname } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const Header = () => {
  const safeRouter = useSafeRouter();
  const pathname = usePathname();
  
  // 탭 최상단 페이지들 (뒤로가기 불가능한 페이지들)
  const isTopLevelPage = ['/home', '/clinics', '/my-page'].includes(pathname);
  
  const handleGoBack = () => {
    safeRouter.back();
  };

  const Bin = () => { 
    return <View style={{ width: scale(24), height: scale(24) }} />;
  }

  return (
    <View style={styles.container}>
      {!isTopLevelPage && (
        <Custom.Button 
          onPress={handleGoBack} 
        >
        <ARROW_LEFT width={scale(24)} height={scale(24)} />
        </Custom.Button>
      )}
      {isTopLevelPage && <Bin />}
      <Custom.Text style={{ fontSize: scale(16), fontWeight: "bold" }}>MEDITRIP</Custom.Text>
      <Bin />
    </View>
  );
}

export default Header

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f2f2f2",
    paddingVertical: scale(10),
    paddingHorizontal: scale(16),
  },
});