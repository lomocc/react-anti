import React, { ReactElement, RefObject } from 'react';

export interface AntiComponentProps<T = any> {
  resolve?: (value?: T | PromiseLike<T>) => void;
  reject?: (reason?: unknown) => void;
}
interface Props {
  container?: HTMLElement;
}
interface State {
  children?: ReactElement[];
}
interface AntiPromise<T = any> extends Promise<T>, AntiComponentProps<T> {}
class Container extends React.Component<Props, State> {
  state = {
    children: []
  };

  render() {
    return this.state.children;
  }
}

const ref: RefObject<Container> = React.createRef();

let uniqueKey = 0;

const Provider: React.SFC<Props> = ({ container }) =>
  React.createElement(Container, { container, ref });

const anti: {
  (element: ReactElement): AntiPromise;
  Provider?: React.SFC<Props>;
} = (element: ReactElement) => {
  let promiseResolve;
  let promiseReject;
  let cloned: ReactElement;

  const onFinally = () => {
    ref.current.setState(({ children }) => {
      return {
        children: children.filter(val => val !== cloned)
      };
    });
  };
  const promise: AntiPromise = new Promise((resolve, reject) => {
    promiseResolve = resolve;
    promiseReject = reject;
    cloned = React.cloneElement(element, {
      key: uniqueKey++,
      resolve,
      reject
    });
    ref.current.setState(({ children }) => {
      return {
        children: [...children, cloned]
      };
    });
  }).then(
    value => {
      onFinally();
      return value;
    },
    reason => {
      onFinally();
      throw reason;
    }
  );

  promise.resolve = promiseResolve;

  promise.reject = promiseReject;

  return promise;
};

anti.Provider = Provider;

export default anti;

export { Provider };
