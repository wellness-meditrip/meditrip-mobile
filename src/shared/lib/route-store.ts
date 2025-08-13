import { atom } from 'jotai';

// 웹뷰의 현재 route 상태
export const webViewRouteAtom = atom<string>('');

// route가 변경되었는지 추적하는 상태
export const isRouteChangedAtom = atom<boolean>(false);

// 현재 route를 가져오는 derived atom
export const getCurrentRouteAtom = atom(get => get(webViewRouteAtom));

// route 변경 함수
export const updateWebViewRouteAtom = atom(
  null,
  (get, set, newRoute: string) => {
    const currentRoute = get(webViewRouteAtom);
    if (currentRoute !== newRoute) {
      set(webViewRouteAtom, newRoute);
      set(isRouteChangedAtom, true);
      // route가 변경되면 웹뷰 뒤로가기 요청 상태 초기화
      set(webViewGoBackRequestAtom, false);
    }
  }
);

// 웹뷰 뒤로가기 요청을 위한 atom
export const webViewGoBackRequestAtom = atom<boolean>(false);

// 웹뷰 뒤로가기 요청 함수
export const requestWebViewGoBackAtom = atom(null, (get, set) => {
  set(webViewGoBackRequestAtom, true);
});
