import React from 'react';
import { SvgProps } from 'react-native-svg';

// SVG 아이콘들을 import

// assets/icons 폴더 바로 하위 SVG 파일들 import
import AI from '../../assets/icons/ic-ai.svg';
import ANTIAGING from '../../assets/icons/ic-anti-aging.svg';
import ARROWUPDOWN from '../../assets/icons/ic-arrow-up-down.svg';
import CALENDAR from '../../assets/icons/ic-calendar.svg';
import CALL from '../../assets/icons/ic-call.svg';
import CAMERA from '../../assets/icons/ic-camera.svg';
import CHATBOT from '../../assets/icons/ic-chatbot.svg';
import CHECK from '../../assets/icons/ic-check.svg';
import CHECKBOX from '../../assets/icons/ic-checkbox.svg';
import CHEVRONDOWN from '../../assets/icons/ic-chevron-down.svg';
import CHEVRONLEFT from '../../assets/icons/ic-chevron-left.svg';
import CHEVRONRIGHT from '../../assets/icons/ic-chevron-right.svg';
import CHEVRONUP from '../../assets/icons/ic-chevron-up.svg';
import CLOCK from '../../assets/icons/ic-clock.svg';
import CLOSE from '../../assets/icons/ic-close.svg';
import DELETE from '../../assets/icons/ic-delete.svg';
import DIETDETOX from '../../assets/icons/ic-diet&detox.svg';
import EDIT from '../../assets/icons/ic-edit.svg';
import ELLIPSISVERTICAL from '../../assets/icons/ic-ellipsis-vertical.svg';
import ERROR from '../../assets/icons/ic-error.svg';
import EYE from '../../assets/icons/ic-eye.svg';
import EYEOFF from '../../assets/icons/ic-eyeoff.svg';
import GLOBE from '../../assets/icons/ic-globe.svg';
import HOME from '../../assets/icons/ic-home.svg';
import IMAGE from '../../assets/icons/ic-image.svg';
import IMMUNITY from '../../assets/icons/ic-immunity.svg';
import INFO from '../../assets/icons/ic-info.svg';
import LANGUAGES from '../../assets/icons/ic-languages.svg';
import LUGGAGE from '../../assets/icons/ic-luggage.svg';
import MAIL from '../../assets/icons/ic-mail.svg';
import MAN from '../../assets/icons/ic-man.svg';
import MENTALHEALTH from '../../assets/icons/ic-mental-health.svg';
import MENU from '../../assets/icons/ic-menu.svg';
import PACKAGELIST from '../../assets/icons/ic-packagelist.svg';
import PARKING from '../../assets/icons/ic-parking.svg';
import PICKUP from '../../assets/icons/ic-pickup.svg';
import PLUS from '../../assets/icons/ic-plus.svg';
import PRIVATE from '../../assets/icons/ic-private.svg';
import ROTATE from '../../assets/icons/ic-rotate.svg';
import SEARCH from '../../assets/icons/ic-search.svg';
import SEND from '../../assets/icons/ic-send.svg';
import SHARE from '../../assets/icons/ic-share.svg';
import STARHALF from '../../assets/icons/ic-star-half.svg';
import STAR from '../../assets/icons/ic-star.svg';
import WIFI from '../../assets/icons/ic-wifi.svg';
import WOMANHEALTH from '../../assets/icons/ic-woman-health.svg';
import CLINICLIST from '../../assets/icons/ic-clinic-list.svg';
import MYPAGE from '../../assets/icons/ic-mypage.svg';

// 아이콘 타입 정의
export type IconName =
  | 'ic-ai'
  | 'ic-anti-aging'
  | 'ic-arrow-up-down'
  | 'ic-calendar'
  | 'ic-call'
  | 'ic-camera'
  | 'ic-chatbot'
  | 'ic-check'
  | 'ic-checkbox'
  | 'ic-chevron-down'
  | 'ic-chevron-left'
  | 'ic-chevron-right'
  | 'ic-chevron-up'
  | 'ic-clock'
  | 'ic-close'
  | 'ic-delete'
  | 'ic-diet-detox'
  | 'ic-edit'
  | 'ic-ellipsis-vertical'
  | 'ic-error'
  | 'ic-eye'
  | 'ic-eyeoff'
  | 'ic-globe'
  | 'ic-home'
  | 'ic-image'
  | 'ic-immunity'
  | 'ic-info'
  | 'ic-languages'
  | 'ic-luggage'
  | 'ic-mail'
  | 'ic-man'
  | 'ic-mental-health'
  | 'ic-menu'
  | 'ic-packagelist'
  | 'ic-parking'
  | 'ic-pickup'
  | 'ic-plus'
  | 'ic-private'
  | 'ic-rotate'
  | 'ic-search'
  | 'ic-send'
  | 'ic-share'
  | 'ic-star-half'
  | 'ic-star'
  | 'ic-wifi'
  | 'ic-woman-health'
  | 'ic-clinic-list'
  | 'ic-mypage';

interface IconProps extends SvgProps {
  name: IconName;
  size?: number;
  color?: string;
}

// 아이콘 매핑
const iconMap: Record<IconName, React.FC<SvgProps>> = {
  'ic-ai': AI,
  'ic-anti-aging': ANTIAGING,
  'ic-arrow-up-down': ARROWUPDOWN,
  'ic-calendar': CALENDAR,
  'ic-call': CALL,
  'ic-camera': CAMERA,
  'ic-chatbot': CHATBOT,
  'ic-check': CHECK,
  'ic-checkbox': CHECKBOX,
  'ic-chevron-down': CHEVRONDOWN,
  'ic-chevron-left': CHEVRONLEFT,
  'ic-chevron-right': CHEVRONRIGHT,
  'ic-chevron-up': CHEVRONUP,
  'ic-clock': CLOCK,
  'ic-close': CLOSE,
  'ic-delete': DELETE,
  'ic-diet-detox': DIETDETOX,
  'ic-edit': EDIT,
  'ic-ellipsis-vertical': ELLIPSISVERTICAL,
  'ic-error': ERROR,
  'ic-eye': EYE,
  'ic-eyeoff': EYEOFF,
  'ic-globe': GLOBE,
  'ic-home': HOME,
  'ic-image': IMAGE,
  'ic-immunity': IMMUNITY,
  'ic-info': INFO,
  'ic-languages': LANGUAGES,
  'ic-luggage': LUGGAGE,
  'ic-mail': MAIL,
  'ic-man': MAN,
  'ic-mental-health': MENTALHEALTH,
  'ic-menu': MENU,
  'ic-packagelist': PACKAGELIST,
  'ic-parking': PARKING,
  'ic-pickup': PICKUP,
  'ic-plus': PLUS,
  'ic-private': PRIVATE,
  'ic-rotate': ROTATE,
  'ic-search': SEARCH,
  'ic-send': SEND,
  'ic-share': SHARE,
  'ic-star-half': STARHALF,
  'ic-star': STAR,
  'ic-wifi': WIFI,
  'ic-woman-health': WOMANHEALTH,
  'ic-clinic-list': CLINICLIST,
  'ic-mypage': MYPAGE,
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#222222',
  ...props
}) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent width={size} height={size} color={color} {...props} />;
};
