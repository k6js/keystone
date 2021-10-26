import type { KeystoneConfig } from '../../types';

export const noAccessTemplate = (session: KeystoneConfig['session']) =>
  `import { getNoAccessPage } from '@k6js/ks-next/___internal-do-not-use-will-break-in-patch/admin-ui/pages/NoAccessPage';

export default getNoAccessPage(${JSON.stringify({ sessionsEnabled: !!session })})
`;
