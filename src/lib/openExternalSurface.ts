import { Linking } from 'react-native';

import {
  getExternalSurface,
  isExternalSurfaceConfigured,
  type ExternalSurfaceId,
} from '@/config/externalSurfaces';

export type OpenExternalSurfaceResult =
  | { ok: true }
  | { ok: false; error: string };

export async function openExternalSurface(id: ExternalSurfaceId): Promise<OpenExternalSurfaceResult> {
  if (!isExternalSurfaceConfigured(id)) {
    return { ok: false, error: 'External surface URL is not configured.' };
  }

  const { url } = getExternalSurface(id);

  if (!url) {
    return { ok: false, error: 'External surface URL is not configured.' };
  }

  try {
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
      return { ok: false, error: 'This device cannot open the support source.' };
    }

    await Linking.openURL(url);
    return { ok: true };
  } catch {
    return { ok: false, error: 'The support source could not be opened.' };
  }
}
