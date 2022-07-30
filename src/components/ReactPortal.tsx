import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  containerId?: string | undefined;
}

const Portal = ({
  children,
  containerId,
}: PortalProps) => {
  let element: HTMLElement | null = null;
  if (containerId)
    element = document.getElementById(containerId);

  // if element is not found with containerId,
  // create and append to body
  if (!element && containerId) {
    const container = document.createElement('div');
    
    container.setAttribute('id', containerId);
    // TODO set any relevant styles

    document.body.appendChild(container);
    element = container;
  }

  return createPortal(children, element || document.body);
};

export default Portal;
