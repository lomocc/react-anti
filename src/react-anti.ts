import { createElement, FunctionComponent, ReactType, useState } from 'react';

interface WrapperComponent extends FunctionComponent {
  show: (props?: {}) => void;
  hide: () => void;
  visible: boolean;
}

export default <P = {}>(WrappedComponent: any) => {
  let ref: any = {
    state: false,
    setState: null,
    props: undefined
  };
  const anti: WrapperComponent = function(props: P) {
    const [state, setState] = useState(false);
    ref.state = state;
    ref.setState = setState;
    return createElement(
      WrappedComponent as ReactType<P>,
      Object.assign({ anti }, props, ref.props)
    );
  } as WrapperComponent;
  Object.defineProperty(anti, 'visible', {
    get() {
      return ref.state;
    },
    set(value) {
      ref.setState && ref.setState(value);
    },
    enumerable: true
  });
  anti.show = props => {
    if (props !== undefined) {
      ref.props = props;
    }
    anti.visible = true;
  };
  anti.hide = () => {
    if (ref.props !== undefined) {
      ref.props = undefined;
    }
    anti.visible = false;
  };
  return anti;
};
