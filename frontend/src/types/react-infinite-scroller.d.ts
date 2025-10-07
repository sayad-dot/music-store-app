declare module 'react-infinite-scroller' {
  import { Component } from 'react';

  interface InfiniteScrollProps {
    loadMore: (page: number) => void;
    hasMore: boolean;
    loader: React.ReactElement;
    children?: React.ReactNode;
    pageStart?: number;
    getScrollParent?: () => HTMLElement | null;
    useWindow?: boolean;
    threshold?: number;
  }

  export default class InfiniteScroll extends Component<InfiniteScrollProps> {}
}