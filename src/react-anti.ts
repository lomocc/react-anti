import { createContext, createElement, FunctionComponent, ReactType, useState } from 'react';

interface WrapperComponent extends FunctionComponent {
  show: (props?: {}) => void;
  hide: () => void;
  visible: boolean;
}

export const Context = createContext(null);

export default <P = {}>(WrappedComponent: any) => {
  let ref: any = {
    state: false,
    setState: null,
    props: undefined
  };
  const wrapper: WrapperComponent = function(props: P) {
    const [state, setState] = useState(false);
    ref.state = state;
    ref.setState = setState;

    return createElement(
      Context.Provider,
      { value: wrapper as any },
      createElement(
        WrappedComponent as ReactType<P>,
        Object.assign({ visible: state }, props, ref.props)
      )
    );
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
  wrapper.show = props => {
    ref.props = props;
    wrapper.visible = true;
  };
  wrapper.hide = () => {
    wrapper.visible = false;
  };
  return wrapper;
};
