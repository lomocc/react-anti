import { createElement, FunctionComponent, ReactType, useState } from 'react';

interface WrapperComponent extends FunctionComponent {
  show: () => void;
  hide: () => void;
  visible: boolean;
}

export default <P = {}>(WrappedComponent: any = 'div') => {
  let ref: any = {
    state: false,
    setState: null
  };
  const wrapper: WrapperComponent = function(props: P) {
    const [state, setState] = useState(false);
    ref.state = state;
    ref.setState = setState;
    return state && createElement(WrappedComponent as ReactType<P>, props);
  } as WrapperComponent;
  Object.defineProperty(wrapper, 'visible', {
    get() {
      return ref.state;
    },
    set(value) {
      ref.setState && ref.setState(value);
    },
    enumerable: true
  });
  wrapper.show = () => {
    wrapper.visible = true;
  };
  wrapper.hide = () => {
    wrapper.visible = false;
  };
  return wrapper;
};
