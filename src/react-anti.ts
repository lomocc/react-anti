import React, { ReactElement, RefObject } from 'react';
import ReactDOM from 'react-dom';

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

  show = (element: ReactElement) => {
    let promiseResolve;
    let promiseReject;
    let cloned: ReactElement;
    const promise: AntiPromise = new Promise((resolve, reject) => {
      promiseResolve = resolve;
      promiseReject = reject;
      cloned = React.cloneElement(element, {
        key: uniqueKey++,
        resolve,
        reject
      });
      this.setState(({ children }) => {
        return {
          children: [...children, cloned]
        };
      });
    }).finally(() => {
      this.setState(({ children }) => {
        return {
          children: children.filter(val => val !== cloned)
        };
      });
    });
    promise.resolve = promiseResolve;
    promise.reject = promiseReject;
    return promise;
  };

  el = document.createElement('div');

  componentDidMount() {
    this.el.setAttribute('react-anti', '');
    (this.props.container || document.body).appendChild(this.el);
  }

  componentWillUnmount() {
    (this.props.container || document.body).removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.state.children, this.el);
  }
}

const ref: RefObject<Container> = React.createRef();

let uniqueKey = 0;

const Provider: React.SFC<Props> = ({ container }) =>
  React.createElement(Container, { container, ref });

const anti: { (element: ReactElement): AntiPromise; Provider?: React.SFC<Props> } = (
  element: ReactElement
) => ref.current.show(element);

anti.Provider = Provider;

export default anti;

export { Provider };
