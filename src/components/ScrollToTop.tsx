import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GlobalRefs from '../utils/Ref';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (GlobalRefs.scrollRef) GlobalRefs.scrollRef.scrollToTop();
  }, [pathname]);

  return null;
}
