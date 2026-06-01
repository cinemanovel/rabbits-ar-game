export type ExternalSurfaceId =
  | 'companySite'
  | 'emilySupport'
  | 'gatewick'
  | 'lockeKnight'
  | 'lucyAndTheCardinal'
  | 'nightStation'
  | 'commentThreads';

export type ExternalSurface = {
  id: ExternalSurfaceId;
  label: string;
  url: string | null;
  requiredForFirstSection: boolean;
};

function readOptionalPublicUrl(value: string | undefined): string | null {
  if (!value || value.includes('your-') || value.trim() === '') {
    return null;
  }

  return value.trim();
}

function readOptionalPublicReference(value: string | undefined): string | null {
  if (!value || value.includes('your-') || value.trim() === '') {
    return null;
  }

  return value.trim();
}

const COMPANY_SITE_URL = readOptionalPublicUrl(process.env.EXPO_PUBLIC_RABBITS_COMPANY_SITE_URL);
const EMILY_SUPPORT_URL = readOptionalPublicUrl(process.env.EXPO_PUBLIC_RABBITS_EMILY_SUPPORT_URL);

export const EXTERNAL_SURFACES: Record<ExternalSurfaceId, ExternalSurface> = {
  companySite: {
    id: 'companySite',
    label: 'Company site',
    url: COMPANY_SITE_URL,
    requiredForFirstSection: true,
  },
  emilySupport: {
    id: 'emilySupport',
    label: 'Support',
    url: EMILY_SUPPORT_URL ?? COMPANY_SITE_URL,
    requiredForFirstSection: true,
  },
  gatewick: {
    id: 'gatewick',
    label: 'Gatewick',
    url: null,
    requiredForFirstSection: false,
  },
  lockeKnight: {
    id: 'lockeKnight',
    label: 'Locke & Knight',
    url: null,
    requiredForFirstSection: false,
  },
  lucyAndTheCardinal: {
    id: 'lucyAndTheCardinal',
    label: 'Lucy & the Cardinal',
    url: null,
    requiredForFirstSection: false,
  },
  nightStation: {
    id: 'nightStation',
    label: 'Night Station',
    url: null,
    requiredForFirstSection: false,
  },
  commentThreads: {
    id: 'commentThreads',
    label: 'Comment threads',
    url: null,
    requiredForFirstSection: false,
  },
};

export function getExternalSurface(id: ExternalSurfaceId): ExternalSurface {
  return EXTERNAL_SURFACES[id];
}

export function isExternalSurfaceConfigured(id: ExternalSurfaceId): boolean {
  return EXTERNAL_SURFACES[id].url !== null;
}

export function getEmilySupportSurface(): ExternalSurface {
  return EXTERNAL_SURFACES.emilySupport;
}

export function isEmilySupportSurfaceConfigured(): boolean {
  return isExternalSurfaceConfigured('emilySupport');
}

export function getEmilySupportReference(): string | null {
  return readOptionalPublicReference(process.env.EXPO_PUBLIC_RABBITS_EMILY_SUPPORT_REFERENCE);
}

export function isEmilySupportReferenceConfigured(): boolean {
  return getEmilySupportReference() !== null;
}

export function isEmilyDiscoveryConfigured(): boolean {
  return isEmilySupportSurfaceConfigured() && isEmilySupportReferenceConfigured();
}

function normalizeReference(value: string): string {
  return value.trim().toLowerCase();
}

export function matchesEmilySupportReference(input: string): boolean {
  const expected = getEmilySupportReference();

  if (!expected) {
    return false;
  }

  return normalizeReference(input) === normalizeReference(expected);
}
