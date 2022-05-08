import { isMobile } from '@/utils/isMobile';

import DesktopHeader from './Desktop';
import MobileHeader from './Mobile';

const navs = [
  { id: 1, url: '/', title: 'Нүүр хуудас' },
  { id: 2, url: '/news', title: 'Мэдээ' },
  { id: 3, url: '/online-course', title: 'Онлайн хичээл' },
  { id: 4, url: '/trading-view', title: 'Trading view' },
];

const Header = () => {
  if (isMobile()) {
    return <MobileHeader />;
  }
  return <DesktopHeader navs={navs} />;
};

export default Header;
