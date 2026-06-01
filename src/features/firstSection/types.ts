export type FirstSectionState = {
  trace_004773_visible: boolean;
  dispatch_001_available: boolean;
  dispatch_001_completed: boolean;
  emily_contact_available: boolean;
  emily_site_opened: boolean;
  emily_reference_submitted: boolean;
  emily_contact_attempted: boolean;
  emily_reply_001_received: boolean;
  correction_request_submitted: boolean;
  radiant_l1_active: boolean;
  first_section_closed: boolean;
};

export const INITIAL_FIRST_SECTION_STATE: FirstSectionState = {
  trace_004773_visible: false,
  dispatch_001_available: false,
  dispatch_001_completed: false,
  emily_contact_available: false,
  emily_site_opened: false,
  emily_reference_submitted: false,
  emily_contact_attempted: false,
  emily_reply_001_received: false,
  correction_request_submitted: false,
  radiant_l1_active: false,
  first_section_closed: false,
};
